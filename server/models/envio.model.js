import { defineMongooseModel } from '#nuxt/mongoose'

export const QuestaoRef = {
    numero: {type: 'number', required: true},
    resposta: {type: 'number', required: true},
    _id: false
};

export const Envio = defineMongooseModel('Envio', {
    alunoId: {type: 'string', required: true},
    aulaId: {type: 'string', required: true},
    questoes: {type: [QuestaoRef], required: true}, // TODO: Validação de Length
    dataEnvio: {type: 'date', required: true},
}, {

}, (schema) => {
    
});