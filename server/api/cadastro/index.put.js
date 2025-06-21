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

    const cadastro = await Cadastro.findOneAndUpdate(
        { email: user.email },
        { $set: body },
        { new: true }
    );

    if (!cadastro) throw createError({
        statusCode: 404,
        statusMessage: 'Cadastro nao encontrado' 
    });

    return cadastro;
});