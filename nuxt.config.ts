// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  // Configuration pour l'accessibilité
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      title: "Benevoclic - Plateforme d'engagement solidaire",
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        {
          name: 'description',
          content:
            "Benevoclic met en relation bénévoles, associations et personnes dans le besoin : publiez et découvrez des événements solidaires, trouvez des missions et mobilisez l'entraide."
        },
        {
          name: 'keywords',
          content:
            'bénévolat, association, événements solidaires, aide, entraide, missions, bénévoles'
        },
        { name: 'author', content: 'Benevoclic' },
        { name: 'robots', content: 'index, follow' },

        // Open Graph aligné
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Benevoclic' },
        {
          property: 'og:title',
          content: "Benevoclic - Plateforme d'engagement solidaire"
        },
        {
          property: 'og:description',
          content:
            "Benevoclic met en relation bénévoles, associations et personnes dans le besoin : publiez et découvrez des événements solidaires, trouvez des missions et mobilisez l'entraide."
        },
        { property: 'og:image', content: '/logo_benevoclic.png' },
        { property: 'og:image:alt', content: 'Logo Benevoclic' },

        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:title',
          content: "Benevoclic - Plateforme d'engagement solidaire"
        },
        {
          name: 'twitter:description',
          content:
            "Benevoclic met en relation bénévoles, associations et personnes dans le besoin : publiez et découvrez des événements solidaires, trouvez des missions et mobilisez l'entraide."
        },
        { name: 'twitter:image', content: '/logo_benevoclic.png' },

        // Accessibilité / thème
        { name: 'theme-color', content: '#eb5577' },
        { name: 'color-scheme', content: 'light dark' }
      ],
      link: [
        { rel: 'canonical', href: 'https://www.benevoclic.fr' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '192x192',
          href: '/logo_benevoclic.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '512x512',
          href: '/logo_benevoclic.png'
        },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        // Preload des polices critiques
        {
          rel: 'preload',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
          as: 'style',
          onload: "this.onload=null;this.rel='stylesheet'"
        },
        // Preload du logo principal
        {
          rel: 'preload',
          href: '/logo_benevoclic.png',
          as: 'image',
          type: 'image/png'
        }
      ]
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
    assets: '/<rootDir>/assets'
  },
  css: ['~/assets/css/main.scss', '~/assets/css/accessibility.scss'],
  i18n: {
    locales: [
      { code: 'es', name: 'Espanish', file: 'es.json' },
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    lazy: true,
    langDir: '.',
    defaultLocale: 'fr',
    vueI18n: './i18n.config.ts',
    bundle: {
      optimizeTranslationDirective: false
    },
    strategy: 'prefix_except_default'
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts',
    '@nuxtjs/partytown',
    'nuxt-schema-org'
  ],

  // Configuration Google Fonts
  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700],
      Poppins: [300, 400, 500, 600, 700]
    },
    display: 'swap',
    prefetch: true,
    preconnect: true,
    download: true,
    base64: false,
    inject: true,
    overwriting: false,
    subsets: ['latin'],
    fontsDir: 'fonts',
    fontsPath: '/fonts'
  },

  // Configuration Color Mode
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'benevoclic-color-mode'
  },

  // Configuration Partytown pour les scripts tiers
  partytown: {
    lib: '/~partytown/',
    forward: ['dataLayer.push', 'gtag'],
    debug: false
  },

  plugins: [
    { src: '~/plugins/runtime-config.server.ts', mode: 'server' },
    { src: '~/plugins/firebase-init.client.ts', mode: 'client' },
    { src: '~/plugins/init-permissions.client.ts', mode: 'client' },
    { src: '~/plugins/firebase-permissions.client.ts', mode: 'client' },
    { src: '~/plugins/permissions.client.ts', mode: 'client' },
    { src: '~/plugins/maplibre.client.ts', mode: 'client' }
  ],
  build: {
    transpile: ['defu']
  },

  compatibilityDate: '2025-02-23',

  runtimeConfig: {
    private: {
      api_base_url: process.env.API_BASE_URL,
      api_sirene_url: process.env.API_SIRENE_URL,
      api_sirene_key: process.env.API_SIRENE_KEY
    },
    public: {
      ssr: true,
      siteUrl: 'https://www.benevoclic.fr',
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
          'Content-Security-Policy':
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://*.firebaseio.com https://*.firebase.com https://*.googleapis.com https://www.googletagmanager.com https://www.google-analytics.com blob:; worker-src 'self' blob:; child-src 'self' blob:; connect-src 'self' https://*.firebase.com https://*.firebaseio.com https://*.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://api.www.benevoclic.fr https://api-adresse.data.gouv.fr https://nominatim.openstreetmap.org https://www.google-analytics.com https://analytics.google.com https://*.google-analytics.com https://*.openstreetmap.org https://*.cartodb.com https://*.thunderforest.com; img-src 'self' data: https: https://www.google-analytics.com https://*.openstreetmap.org https://*.cartodb.com https://*.thunderforest.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src 'self' https://*.firebaseapp.com https://accounts.google.com;",
          // Référer Policy
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          // Permissions Policy
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
        }
      }
    }
  }
})
