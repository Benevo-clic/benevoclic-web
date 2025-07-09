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
    // Configuration de l'hydration
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  experimental: {
    // Améliore les performances de l'hydratation
    asyncContext: true,
    // Optimise le chargement des composants
    componentIslands: false,
    // Optimisations de performance
    payloadExtraction: true,
    renderJsonPayloads: true,
    // Optimisation du bundling
    treeshakeClientOnly: true
  },
  alias: {
    assets: '/<rootDir>/assets',
  },
  css: [
    '~/assets/css/main.scss',
  ],
  i18n: {
    locales: [
      { code: 'es', name: 'Espanish', file: 'es.json' },
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'en', name: 'English', file: 'en.json' },
    ],
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'fr',
    vueI18n: './i18n.config.ts'
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/i18n'
  ],

  compatibilityDate: '2025-02-23',

  runtimeConfig: {
    private: {
      api_base_url: process.env.API_BASE_URL,
      api_sirene_url: process.env.API_SIRENE_URL,
      api_sirene_key: process.env.API_SIRENE_KEY,
    },
    public: {
      ssr: true,
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
  },

  // Optimisations pour l'hydratation
  nitro: {
    prerender: {
      crawlLinks: true,
    },
    // Optimisations de performance
    compressPublicAssets: true,
    minify: true,
    // Cache des assets statiques
    storage: {
      fs: {
        driver: 'fs',
        base: './.nuxt/storage'
      }
    }
  },

})