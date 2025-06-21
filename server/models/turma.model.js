import { defineMongooseModel } from '#nuxt/mongoose'

export const Turma = defineMongooseModel('Turma', {
    nome: { type: 'string', required: true },
    dataAbertura: { type: 'date', required: true },
    dataFechamento: { type: 'date', required: true },
}, {
    
}, (schema) => {
    
});