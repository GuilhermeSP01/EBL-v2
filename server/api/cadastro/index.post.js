export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const user = await Cadastro.create(body);
    return user;
});