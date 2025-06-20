export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    await Cadastro.findByIdAndDelete(id);
    return {};
});