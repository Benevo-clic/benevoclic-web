import { defineEventHandler } from 'h3'

export default defineEventHandler(async event => {
  const config = useRuntimeConfig()
  
  return {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    runtimeConfig: {
      private: {
        api_base_url: config.private.api_base_url,
        api_sirene_url: config.private.api_sirene_url,
        api_sirene_key: config.private.api_sirene_key ? 'DÉFINIE' : 'NON DÉFINIE'
      },
      public: {
        siteUrl: config.public.siteUrl,
        firebaseConfig: {
          apiKey: config.public.firebaseConfig.apiKey ? 'DÉFINIE' : 'NON DÉFINIE',
          authDomain: config.public.firebaseConfig.authDomain,
          projectId: config.public.firebaseConfig.projectId
        }
      }
    },
    processEnv: {
      API_BASE_URL: process.env.API_BASE_URL,
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY ? 'DÉFINIE' : 'NON DÉFINIE'
    }
  }
})
