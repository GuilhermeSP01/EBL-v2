export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const aula = await Aula.create(body);
    return aula;
});