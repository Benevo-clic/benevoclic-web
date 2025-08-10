import { defineEventHandler } from 'h3'

export default defineEventHandler(async event => {
  // Simuler la configuration Nuxt côté client
  const clientConfig = {
    public: {
      firebaseConfig: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
      },
      ssr: true,
      siteUrl: 'https://www.benevoclic.fr'
    }
  }

  const firebaseConfig = clientConfig.public.firebaseConfig
  const isValid = firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId

  return {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    clientConfig: clientConfig,
    validation: {
      isValid: isValid,
      missingVariables: [
        !firebaseConfig.apiKey && 'FIREBASE_API_KEY',
        !firebaseConfig.authDomain && 'FIREBASE_AUTH_DOMAIN',
        !firebaseConfig.projectId && 'FIREBASE_PROJECT_ID',
        !firebaseConfig.storageBucket && 'FIREBASE_STORAGE_BUCKET',
        !firebaseConfig.messagingSenderId && 'FIREBASE_MESSAGING_SENDER_ID',
        !firebaseConfig.appId && 'FIREBASE_APP_ID'
      ].filter(Boolean)
    },
    rawEnvVars: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY ? 'DÉFINIE' : 'NON DÉFINIE',
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN ? 'DÉFINIE' : 'NON DÉFINIE',
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? 'DÉFINIE' : 'NON DÉFINIE',
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET ? 'DÉFINIE' : 'NON DÉFINIE',
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID
        ? 'DÉFINIE'
        : 'NON DÉFINIE',
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID ? 'DÉFINIE' : 'NON DÉFINIE',
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID ? 'DÉFINIE' : 'NON DÉFINIE'
    }
  }
})
