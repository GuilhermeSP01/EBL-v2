import mongoose from 'mongoose';

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    if (!id) throw createError({
        statusCode: 400,
        statusMessage: 'ID não fornecido' 
    });
    if (!mongoose.isValidObjectId(id)) throw createError({
        statusCode: 400,
        statusMessage: 'Formato de ID inválido' 
    });

    const cadastro = await Cadastro.findById(id);
    if (!cadastro) throw createError({
        statusCode: 404,
        statusMessage: 'Usuário não encontrado' 
    });

    return cadastro;
});