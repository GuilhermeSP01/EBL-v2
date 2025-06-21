export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    await Aula.findByIdAndDelete(id);
    return {};
});