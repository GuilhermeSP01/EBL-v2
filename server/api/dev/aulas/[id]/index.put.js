export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    const aula = await Aula.findByIdAndUpdate(id, body, { new: true });
    return aula;
});