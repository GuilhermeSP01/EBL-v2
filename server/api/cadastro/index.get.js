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

  // Busca cadastro pelo email
  const cadastroSnapshot = await db.collection('cadastros')
    .where('email', '==', user.email)
    .limit(1)
    .get();
  if (cadastroSnapshot.empty) throw createError({
    statusCode: 404,
    statusMessage: 'Aluno nao encontrado' 
  });
  const cadastroDoc = cadastroSnapshot.docs[0];
  const cadastro = { id: cadastroDoc.id, ...cadastroDoc.data() };

  // Busca envios pelo alunoId (id do cadastro)
  const enviosSnapshot = await db.collection('envios')
    .where('alunoId', '==', cadastro.id)
    .get();
  const envios = enviosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Corrige cada envio
  const enviosComCorrecao = await Promise.all(envios.map(async (envio) => {
    const aulaDoc = await db.collection('aulas').doc(envio.aulaId).get();
    if (!aulaDoc.exists) return envio;

    const aula = aulaDoc.data();

    // Cria mapa de respostas corretas
    const respostasCorretas = {};
    (aula.questoes || []).forEach(q => {
      respostasCorretas[q.numero] = q.resposta;
    });

    // Adiciona propriedade 'correta' em cada questão
    const questoesCorrigidas = (envio.questoes || []).map(questao => ({
      ...questao,
      correta: questao.resposta === respostasCorretas[questao.numero]
    }));

    return {
      ...envio,
      questoes: questoesCorrigidas
    };
  }));

  return {
    ...cadastro,
    envios: enviosComCorrecao ?? []
  };
});