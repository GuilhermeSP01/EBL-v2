export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const id = getRouterParam(event, 'id');
    const cadastro = await Cadastro.findByIdAndUpdate(id, body, { new: true });
    return cadastro;
});