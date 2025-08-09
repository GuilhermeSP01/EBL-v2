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

  // Busca cadastro
  const cadastroSnapshot = await db.collection('cadastros')
    .where('email', '==', user.email)
    .limit(1)
    .get();

  if (cadastroSnapshot.empty) {
    throw createError({ statusCode: 404, statusMessage: 'Aluno nao encontrado' });
  }

  const cadastroDoc = cadastroSnapshot.docs[0];
  const cadastro = { id: cadastroDoc.id, ...cadastroDoc.data() };
  const turmaId = cadastro.turmaId;

  // Busca todas as aulas principais
  const aulasSnapshot = await db.collection('aulas')
    .where('turmaId', '==', turmaId)
    .get();

const aulas = aulasSnapshot.docs.map(doc => {
  const aula = doc.data();
  return {
    id: doc.id,
    tipo: 'principal',
    ...aula,
    permitirPrevia: aula.permitirPrevia,
    dataAbertura: aula.dataAbertura?.toDate ? aula.dataAbertura.toDate().toISOString() : aula.dataAbertura,
    dataFechamento: aula.dataFechamento?.toDate ? aula.dataFechamento.toDate().toISOString() : aula.dataFechamento,
    questoes: aula.questoes || []
  };
});


  // Busca todas as complementares
  const compsSnapshot = await db.collection('complementares')
    .where('turmaId', '==', turmaId)
    .get();

  const complementares = compsSnapshot.docs.map(doc => ({
    id: doc.id,
    tipo: 'complementar',
    ...doc.data()
  }));

  // Junta todas
  const todasAulas = [...aulas, ...complementares];

  // Busca envios
  const enviosSnapshot = await db.collection('envios')
    .where('alunoId', '==', cadastro.id)
    .get();

  const envios = enviosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Corrige cada envio usando aula correspondente
  const enviosComCorrecao = await Promise.all(envios.map(async (envio) => {
    const aulaReferente = todasAulas.find(a => a.id === envio.aulaId);

    if (!aulaReferente) {
      // Aula ou complementar não existe (deletada?)
      return envio;
    }

    // Somente principais possuem questionário para corrigir
    if (aulaReferente.questoes && aulaReferente.questoes.length > 0) {
      const respostasCorretas = {};
      (aulaReferente.questoes || []).forEach(q => {
        respostasCorretas[q.numero] = q.resposta;
      });

      const questoesCorrigidas = (envio.questoes || []).map(questao => ({
        ...questao,
        correta: questao.resposta === respostasCorretas[questao.numero]
      }));

      return {
        ...envio,
        questoes: questoesCorrigidas
      };
    }

    // Se não tem questionário (complementar), retorna como está
    return envio;
  }));

  return {
    ...cadastro,
    envios: enviosComCorrecao ?? [],
    aulas: todasAulas // opcional: incluir aqui para o front usar a mesma estrutura
  };
});
