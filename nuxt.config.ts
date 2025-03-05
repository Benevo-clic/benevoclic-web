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
})