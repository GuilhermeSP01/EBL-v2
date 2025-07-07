import { getHeader, createError } from 'h3';
import { verifyToken } from '~/server/utils/auth';
import { db } from '~/server/utils/firebase-admin';

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'Authorization')?.split(' ')[1] || null;
  if (!token) throw createError({
    statusCode: 401,
    statusMessage: 'Nenhum token fornecido'
  });

  const user = await verifyToken(token);
  if (!user) throw createError({
    statusCode: 401,
    statusMessage: 'Token inválido'
  });

  const body = await readBody(event);

  // Busca cadastro pelo email
  const cadastroSnapshot = await db.collection('cadastros')
    .where('email', '==', user.email)
    .limit(1)
    .get();
  if (cadastroSnapshot.empty) throw createError({
    statusCode: 404,
    statusMessage: 'Aluno não encontrado'
  });
  const cadastroDoc = cadastroSnapshot.docs[0];
  const cadastro = { id: cadastroDoc.id, ...cadastroDoc.data() };

  // Verifica se já existe envio para essa aula
  const envioExistenteSnapshot = await db.collection('envios')
    .where('alunoId', '==', cadastro.id)
    .where('aulaId', '==', body.aulaId)
    .limit(1)
    .get();
  if (!envioExistenteSnapshot.empty) throw createError({
    statusCode: 400,
    statusMessage: 'O envio já foi realizado'
  });

  // Busca a aula
  const aulaDoc = await db.collection('aulas').doc(body.aulaId).get();
  if (!aulaDoc.exists) throw createError({
    statusCode: 404,
    statusMessage: 'Aula nao encontrada'
  });
  const aula = aulaDoc.data();

  // Checa o período de envio
  const now = new Date();
  const dataAbertura = aula.dataAbertura?.toDate ? aula.dataAbertura.toDate() : aula.dataAbertura;
  const dataFechamento = aula.dataFechamento?.toDate ? aula.dataFechamento.toDate() : aula.dataFechamento;
  if (now < dataAbertura || now > dataFechamento) throw createError({
    statusCode: 400,
    statusMessage: 'Fora do período de envio'
  });

  // Checa se há questões não respondidas
  const questoesNaoRespondidas = (body.questoes || []).filter(questao => questao.resposta === null);
  if (questoesNaoRespondidas.length > 0) throw createError({
    statusCode: 400,
    statusMessage: 'Questões nao respondidas'
  });

  // Checa se o número de questões está correto
  if ((body.questoes || []).length !== (aula.questoes || []).length) throw createError({
    statusCode: 400,
    statusMessage: 'Número incorreto de questões'
  });

  // Cria o envio
  await db.collection('envios').add({
    alunoId: cadastro.id,
    aulaId: body.aulaId,
    questoes: body.questoes,
    dataEnvio: new Date()
  });

  // Busca todos os envios do aluno
  const enviosSnapshot = await db.collection('envios')
    .where('alunoId', '==', cadastro.id)
    .get();
  const envios = enviosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Monta mapa de respostas corretas
  const respostasCorretas = {};
  (aula.questoes || []).forEach(q => {
    respostasCorretas[q.numero] = q.resposta;
  });

  // Corrige cada envio
const enviosComCorrecao = envios.map(envio => {
  const questoesCorrigidas = (envio.questoes || []).map(questao => ({
    ...questao,
    correta: questao.resposta === respostasCorretas[questao.numero]
  }));
  return {
    ...envio,
    dataEnvio: envio.dataEnvio?.toDate ? envio.dataEnvio.toDate().toISOString() : envio.dataEnvio,
    questoes: questoesCorrigidas
  };
});

return {
  ...cadastro,
  envios: enviosComCorrecao
};
});
