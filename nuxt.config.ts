// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  app: {
    head: {
      htmlAttrs: {
        lang: 'fr'
      }
    },
    // Activation de l'hydratation progressive
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  experimental: {
    // Améliore les performances de l'hydratation
    asyncContext: true,
    // Optimise le chargement des composants
    componentIslands: true
  },
  alias: {
    assets: '/<rootDir>/assets',
  },
  css: [
    '~/assets/css/main.scss'
  ],

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
  ],

  compatibilityDate: '2025-02-23',

  runtimeConfig: {
    public: {
      firebaseConfig: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
      }
    }
  }
})