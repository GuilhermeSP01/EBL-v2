export default defineEventHandler(async (event) => {
    const aulas = await Aula.find();
    return aulas;
});