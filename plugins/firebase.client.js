import { defineNuxtPlugin } from "#app";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    
    const firebaseConfig = {
        apiKey: config.public.firebase.apiKey,
        authDomain: config.public.firebase.authDomain,
        projectId: config.public.firebase.projectId,
        storageBucket: config.public.firebase.storageBucket,
        messagingSenderId: config.public.firebase.messagingSenderId,
        appId: config.public.firebase.appId,
        measurementId: config.public.firebase.measurementId
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    nuxtApp.provide('firebase', app);
    nuxtApp.provide('auth', auth);
});