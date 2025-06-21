export default defineEventHandler(async (event) => {
    const turmas = await Turma.find();
    return turmas;
});