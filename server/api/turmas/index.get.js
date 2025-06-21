export default defineEventHandler(async (event) => {
    const turmas = await Turma.find();
    return turmas.filter( turma =>
        turma.dataFechamento > new Date()
        && turma.dataAbertura < new Date()
    );
});