export default defineEventHandler(async (event) => {
    const envios = await Envio.find();
    return envios;
});