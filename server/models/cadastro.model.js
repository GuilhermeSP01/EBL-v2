import { defineMongooseModel } from '#nuxt/mongoose'

export const enderecoSchema =  {
    cep: { type: 'string', required: true },
    estado: { type: 'string', required: true },
    cidade: { type: 'string', required: true },
    bairro: { type: 'string', required: true },
    tipoLogradouro: { type: 'string', required: true },
    logradouro: { type: 'string', required: true },
    numero: { type: 'number', required: true },
    complemento: { type: 'string', required: false },
    _id: false,
};

export const Cadastro = defineMongooseModel('Cadastro', {
  nome: { type: 'string', required: true },
  turmaId: { type: 'string', required: true },
  modalidade: { type: 'string', required: true },
  email: { type: 'string', required: true, unique: true },
  telefone: { type: 'string', required: true },
  endereco: { type: enderecoSchema, required: false },
}, {
  timestamps: true
}, (schema) => {

});
