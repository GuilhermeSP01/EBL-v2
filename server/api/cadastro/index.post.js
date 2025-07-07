import { db } from "~/server/utils/firebase-admin";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    
    const docRef = await db.collection('cadastros').add(body);
    
    const docSnapshot = await docRef.get();

    return [{
        id: docSnapshot.id,
        ...docSnapshot.data()
    }];
});