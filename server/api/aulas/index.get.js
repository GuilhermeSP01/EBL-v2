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

    const aulas = await Aula.find({ turmaId: cadastro.turmaId });
    const aulasSemResposta = aulas.map(aula => {
        const obj = aula.toObject();
        obj.questoes = obj.questoes?.map(questao => {
           const { resposta, ...rest } = questao;
           return rest;
        });
        return obj;
    });

    return aulasSemResposta;
});