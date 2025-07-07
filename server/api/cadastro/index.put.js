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

    const cadastroSnapshot = await db.collection('cadastros')
        .where('email', '==', user.email)
        .limit(1)
        .get();
    if (cadastroSnapshot.empty) throw createError({
        statusCode: 404,
        statusMessage: 'Aluno nao encontrado' 
    });
    const cadastroDoc = cadastroSnapshot.docs[0];
    const cadastroRef = db.collection('cadastros').doc(cadastroDoc.id);

    await cadastroRef.update(body);
    const updatedDoc = await cadastroRef.get();

    return {
        id: updatedDoc.id,
        ...updatedDoc.data()
    };
});