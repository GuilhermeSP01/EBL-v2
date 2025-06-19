// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  plugins: [
    { src: '~/plugins/firebase.client.js', mode: 'client' }
  ],
  runtimeConfig: {
    public: {
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_FIREBASE_APIKEY,
        authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTHDOMAIN,
        projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECTID,
        storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGEBUCKET,
        messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDERID,
        appId: process.env.NUXT_PUBLIC_FIREBASE_APPID,
        measurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENTID
      }
    }
  }
})
