// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
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
    payloadExtraction: false,
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

  plugins: [
    { src: '~/plugins/firebase-init.client.ts', mode: 'client' },
    { src: '~/plugins/init-permissions.client.ts', mode: 'client' },
    { src: '~/plugins/firebase-permissions.client.ts', mode: 'client' },
    { src: '~/plugins/permissions.client.ts', mode: 'client' },
    { src: '~/plugins/maplibre.client.ts', mode: 'client' },
  ],
  build: {
    transpile: [
      'defu',
    ],
  },

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
      ignore: [
        '/association/account/edit',
        '/en/association/account/edit',
        '/es/association/account/edit'
      ]
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
    },
    // Headers de sécurité RGPD
    routeRules: {
      '/**': {
        headers: {
          // Protection contre le clickjacking
          'X-Frame-Options': 'SAMEORIGIN',
          // Protection contre le MIME sniffing
          'X-Content-Type-Options': 'nosniff',
          // Protection contre les attaques XSS
          'X-XSS-Protection': '1; mode=block',
          // Politique de sécurité du contenu - Corrigée pour Firebase
          'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseio.com https://*.firebase.com https://*.googleapis.com https://www.googletagmanager.com https://www.google-analytics.com blob:; worker-src 'self' blob:; child-src 'self' blob:; connect-src 'self' https://*.firebase.com https://*.firebaseio.com https://*.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://api.benevoclic.app https://api-adresse.data.gouv.fr https://nominatim.openstreetmap.org https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com https://region*.google-analytics.com https://*.openstreetmap.org https://*.cartodb.com https://*.thunderforest.com; img-src 'self' data: https: https://www.google-analytics.com https://*.openstreetmap.org https://*.cartodb.com https://*.thunderforest.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src 'self' https://*.firebaseapp.com https://accounts.google.com;",
          // Référer Policy
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          // Permissions Policy
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
        }
      }
    }
  },

})
