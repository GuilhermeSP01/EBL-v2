// server/api/aulas.get.js

import { verifyToken } from '~/server/utils/auth';
import { db } from '~/server/utils/firebase-admin';
import { getHeader, createError } from 'h3';

export default defineEventHandler(async (event) => { 
  const token = getHeader(event, 'Authorization')?.split(' ')[1] || null;
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Nenhum token fornecido' });
  }

  const user = await verifyToken(token);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Token inválido' });
  }

  // Get turmaId from cadastro
  const cadastroSnapshot = await db.collection('cadastros')
    .where('email', '==', user.email)
    .limit(1)
    .get();

  if (cadastroSnapshot.empty) {
    throw createError({ statusCode: 404, statusMessage: 'Aluno nao encontrado' });
  }

  const cadastro = cadastroSnapshot.docs[0].data();
  const turmaId = cadastro.turmaId;

  // Fetch aulas principais
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
      questoes: (aula.questoes || []).map(q => {
        const { resposta, ...rest } = q;
        return rest;
      })
    };
  }).filter(aula => {
    const dataAberturaDate = aula.dataAbertura ? new Date(aula.dataAbertura) : null;
    return aula.permitirPrevia === true || (dataAberturaDate && dataAberturaDate <= new Date());
  });

  // Fetch complementares
  const compsSnapshot = await db.collection('complementares')
    .where('turmaId', '==', turmaId)
    .get();

  const complementares = compsSnapshot.docs.map(doc => {
    const c = doc.data();
    return {
      id: doc.id,
      tipo: 'complementar',
      ...c,
      data: c.data?.toDate ? c.data.toDate().toISOString() : c.data
    };
  }).filter(comp => {
    const dataDate = comp.data ? new Date(comp.data) : null;
    return comp.permitirPrevia === true || (dataDate && dataDate <= new Date());
  });

  // Merge: For each principal aula, insert its complementares BEFORE it (descending order)
  const aulasComComplementares = [];
  aulas
    .sort((a, b) => b.numero - a.numero) // descending by numero
    .forEach(aula => {
      // Find complementares matching this aula number
      const compsDaAula = complementares
        .filter(c => c.aula === aula.numero)
        .sort((a, b) => new Date(a.data) - new Date(b.data)); // Optional: order by data

      // First, insert all complementares for this number (in order)
      aulasComComplementares.push(...compsDaAula);

      // Then, insert the main aula itself
      aulasComComplementares.push(aula);
    });

  return aulasComComplementares;
});
