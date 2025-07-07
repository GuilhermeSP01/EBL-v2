import { db } from "~/server/utils/firebase-admin";

export default defineEventHandler(async (event) => {
    try {
        const snapshot = await db.collection('turmas')
        .where('dataAbertura', '<', new Date())
        .where('dataFechamento', '>', new Date())
        .get();

        return snapshot.docs.map(doc => {
            const dataAbertura = doc.data().dataAbertura.toDate();
            const dataFechamento = doc.data().dataFechamento.toDate();
            return {
                id: doc.id,
                ...doc.data(),
                dataAbertura,
                dataFechamento
            }
        });
    } catch (error) {
        console.error(error);
        return [];
    };
});