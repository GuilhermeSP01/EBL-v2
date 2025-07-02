// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite"

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: ['nuxt-mongoose'],

  plugins: [{ src: '~/plugins/firebase.client.js', mode: 'client' }],

  css: ['~/assets/css/main.css'],
  
  vite: {
    plugins: [tailwindcss()]
  },

  mongoose: {
    options: {
      maxPoolSize: 5,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    }
  },

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