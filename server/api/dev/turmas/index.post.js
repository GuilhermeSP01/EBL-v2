export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const turma = await Turma.create(body);
    return turma;
});