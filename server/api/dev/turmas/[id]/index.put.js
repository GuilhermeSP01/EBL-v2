export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    const turma = await Turma.findByIdAndUpdate(id, body, { new: true });
    return turma;
});