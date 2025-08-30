import { getHeader, createError } from 'h3';
import { verifyToken } from '~/server/utils/auth';
import { db } from '~/server/utils/firebase-admin';

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'Authorization')?.split(' ')[1] || null;
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Nenhum token fornecido' });

  const user = await verifyToken(token);
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Token inválido' });

  const body = await readBody(event);

  // Busca cadastro pelo email
  const cadastroSnapshot = await db.collection('cadastros')
    .where('email', '==', user.email)
    .limit(1)
    .get();

  if (cadastroSnapshot.empty) throw createError({ statusCode: 404, statusMessage: 'Aluno não encontrado' });

  const cadastroDoc = cadastroSnapshot.docs[0];
  const cadastro = { id: cadastroDoc.id, ...cadastroDoc.data() };

  // Busca a aula atual
  const aulaDoc = await db.collection('aulas').doc(body.aulaId).get();
  if (!aulaDoc.exists) throw createError({ statusCode: 404, statusMessage: 'Aula não encontrada' });
  const aula = aulaDoc.data();

  // Checa o período de envio
  const now = new Date();
  const dataAbertura = aula.dataAbertura?.toDate ? aula.dataAbertura.toDate() : aula.dataAbertura;
  const dataFechamento = aula.dataFechamento?.toDate ? aula.dataFechamento.toDate() : aula.dataFechamento;
  if (now < dataAbertura || now > dataFechamento) {
    throw createError({ statusCode: 400, statusMessage: 'Fora do período de envio' });
  }

  // Checa se há questões não respondidas
  const questoesNaoRespondidas = (body.questoes || []).filter(q => q.resposta === null);
  if (questoesNaoRespondidas.length > 0) {
    throw createError({ statusCode: 400, statusMessage: 'Questões não respondidas' });
  }

  // Checa se o número de questões está correto
  if ((body.questoes || []).length !== (aula.questoes || []).length) {
    throw createError({ statusCode: 400, statusMessage: 'Número incorreto de questões' });
  }

  // Cria ID único para o envio baseado no alunoId e aulaId
  const envioId = `${cadastro.id}_${body.aulaId}`;
  const envioRef = db.collection('envios').doc(envioId);

  // Verifica se já existe envio e cria de forma atômica
  const envioDoc = await envioRef.get();
  if (envioDoc.exists) {
    throw createError({ statusCode: 400, statusMessage: 'O envio já foi realizado' });
  }

  // Cria o envio
  await envioRef.set({
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

  // Busca todas as aulas da turma para mapear respostas corretas por aula
  const aulasSnapshot = await db.collection('aulas')
    .where('turmaId', '==', cadastro.turmaId)
    .get();

  const aulas = aulasSnapshot.docs.map(doc => {
    const aulaData = doc.data();
    return {
      id: doc.id,
      questoes: aulaData.questoes || []
    };
  });

  // Cria mapa rápido de aulas por id
  const aulasMap = {};
  aulas.forEach(a => {
    aulasMap[a.id] = a;
  });

  // Corrige cada envio com o gabarito apropriado
  const enviosComCorrecao = envios.map(envio => {
    const aulaAtual = aulasMap[envio.aulaId];
    if (!aulaAtual) return envio;

    // Monta mapa de respostas corretas da aula
    const respostasCorretas = {};
    aulaAtual.questoes.forEach(q => {
      respostasCorretas[q.numero] = q.resposta;
    });

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

  // Retorna cadastro atualizado com todos os envios corrigidos
  return {
    ...cadastro,
    envios: enviosComCorrecao
  };
});
