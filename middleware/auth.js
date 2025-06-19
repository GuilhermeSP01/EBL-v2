import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useAuth } from '#imports';

export default defineNuxtRouteMiddleware((to, from) => {
    if (import.meta.server) return;

    const { isAuthLoading } = useAuth();
    isAuthLoading.value = true;

    const auth = getAuth();
    
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            isAuthLoading.value = false;

            if(!user)
                resolve(navigateTo('/'));

            resolve();
        });
    });
});