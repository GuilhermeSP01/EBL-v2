import { defineMongooseModel } from '#nuxt/mongoose'

export const Alternativa = {
    numero: {type: 'number', required: true},
    descricao: {type: 'string', required: true},
    _id: false
}

export const Questao = {
    numero: {type: 'number', required: true},
    enunciado: {type: 'string', required: true},
    resposta: {type: 'number', required: true},
    alternativas: {type: [Alternativa], required: true},
    _id: false
};

export const Aula = defineMongooseModel('Aula', {
    turmaId: {type: 'string', required: true},
    titulo: {type: 'string', required: true},
    dataAbertura: {type: 'date', required: true},
    dataFechamento: {type: 'date', required: true},
    linkMaterial: {type: 'string', required: false},
    linkVideo: {type: 'string', required: false},
    questoes: {type: [Questao], required: false},
}, {

}, (schema) => {
    schema.pre('save', function(next) {
        if (this.dataFechamento < this.dataAbertura)
            throw new Error('A data de fechamento deve ser posterior a data de abertura');
        next();
    });
});