export default defineEventHandler(async (event) => {
    const cadastros = await Cadastro.find();
    return cadastros;
});