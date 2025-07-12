import { verifyToken } from '~/server/utils/auth';
import { db } from '~/server/utils/firebase-admin';

export default defineEventHandler(async (event) => { 
    const token = getHeader(event, 'Authorization')?.split(' ')[1] || null;
    if (!token) throw createError({
        statusCode: 401,
        statusMessage: 'Nenhum token fornecido' 
    });

    const user = await verifyToken(token);
    if (!user) throw createError({
        statusCode: 401,
        statusMessage: 'Token inválido' 
    });

    const cadastroSnapshot = await db.collection('cadastros')
        .where('email', '==', user.email)
        .limit(1)
        .get();
    if (cadastroSnapshot.empty) throw createError({
        statusCode: 404,
        statusMessage: 'Aluno nao encontrado' 
    });
    const cadastro = cadastroSnapshot.docs[0].data();

    const aulasSnapshot = await db.collection('aulas')
        .where('turmaId', '==', cadastro.turmaId)
        .get();

        const aulasSemResposta = aulasSnapshot.docs.map(doc => {
        const aula = doc.data();
        // Serializa as datas para string ISO
        return {
            id: doc.id,
            ...aula,
            dataAbertura: aula.dataAbertura?.toDate ? aula.dataAbertura.toDate().toISOString() : aula.dataAbertura,
            dataFechamento: aula.dataFechamento?.toDate ? aula.dataFechamento.toDate().toISOString() : aula.dataFechamento,
            questoes: (aula.questoes || []).map(questao => {
                const { resposta, ...rest } = questao;
                return rest;
            })
        };
    }).filter(aula => {
        const dataAberturaDate = aula.dataAbertura ? new Date(aula.dataAbertura) : null;
        return (aula.permitirPrevia === true) || (dataAberturaDate && dataAberturaDate <= new Date());
    });

    return aulasSemResposta;
});