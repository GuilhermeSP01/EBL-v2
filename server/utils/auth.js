import { auth } from './firebase-admin';

export const verifyToken = async (token) => {
    return await auth.verifyIdToken(token);
}