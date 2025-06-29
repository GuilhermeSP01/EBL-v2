import { verifyToken } from '~/server/utils/auth';

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

    const cadastro = await Cadastro.findOne({ email: user.email });
    if (!cadastro) throw createError({
        statusCode: 404,
        statusMessage: 'Aluno nao encontrado' 
    });

    const envios = await Envio.find({ alunoId: cadastro._id });
    const enviosComCorrecao = await Promise.all(envios.map(async (envio) => {
        const aula = await Aula.findById(envio.aulaId);
        if (!aula) return envio.toObject();
        
        // Cria mapa de respostas corretas (questão número -> resposta correta)
        const respostasCorretas = {};
        aula.questoes.forEach(q => {
            respostasCorretas[q.numero] = q.resposta;
        });
        
        // Adiciona propriedade 'correta' em cada questão
        const questoesCorrigidas = envio.questoes.map(questao => ({
            ...questao.toObject ? questao.toObject() : questao,
            correta: questao.resposta === respostasCorretas[questao.numero]
        }));
        
        return {
            ...envio.toObject(),
            questoes: questoesCorrigidas
        };
    }));
    
    return {
        ...cadastro.toObject(),
        envios: enviosComCorrecao ?? []
    };
});