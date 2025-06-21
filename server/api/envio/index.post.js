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

    const body = await readBody(event);
    const cadastro = await Cadastro.findOne({ email: user.email });
    if (!cadastro) throw createError({
        statusCode: 404,
        statusMessage: 'Aluno não encontrado' 
    });

    const envioExistente = await Envio.findOne({
        alunoId: cadastro._id,
        aulaId: body.aulaId
    });
    if (envioExistente) throw createError({
        statusCode: 400,
        statusMessage: 'O envio já foi realizado'
    });

    const aula = await Aula.findById(body.aulaId);
    if (!aula) throw createError({
        statusCode: 404,
        statusMessage: 'Aula nao encontrada' 
    });

    const now = new Date();
    if (now < aula.dataAbertura || now > aula.dataFechamento) throw createError({
        statusCode: 400,
        statusMessage: 'Fora do período de envio' 
    });

    const questoesNaoRespondidas = body.questoes.filter(questao => questao.resposta === null);
    if (questoesNaoRespondidas.length > 0) throw createError({
        statusCode: 400,
        statusMessage: 'Questões nao respondidas' 
    });

    if (body.questoes.length !== aula.questoes.length) throw createError({
        statusCode: 400,
        statusMessage: 'Número incorreto de questões' 
    });

    const envio = await Envio.create({
        alunoId: cadastro._id,
        aulaId: body.aulaId,
        questoes: body.questoes,
        dataEnvio: new Date()
    });
    
    const envios = await Envio.find({ alunoId: cadastro._id });

    const respostasCorretas = {};
    aula.questoes.forEach(q => {
        respostasCorretas[q.numero] = q.resposta;
    });

    const enviosComCorrecao = envios.map(envio => {
        const questoesCorrigidas = envio.questoes.map(questao => ({
            ...questao.toObject ? questao.toObject() : questao,
            correta: questao.resposta === respostasCorretas[questao.numero]
        }));
        return {
            ...envio.toObject(),
            questoes: questoesCorrigidas
        };
    });

    return {
        ...cadastro.toObject(),
        envios: enviosComCorrecao
    };
});