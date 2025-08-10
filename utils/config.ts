/**
 * Utilitaire pour gérer les variables d'environnement
 * Utilise process.env directement car useRuntimeConfig() ne fonctionne pas au runtime
 */

export const getConfig = () => {
  return {
    api: {
      baseUrl: process.env.API_BASE_URL,
      sireneUrl: process.env.API_SIRENE_URL,
      sireneKey: process.env.API_SIRENE_KEY,
      key: process.env.API_KEY,
      timeout: process.env.API_TIMEOUT,
      retryCount: process.env.API_RETRY_COUNT
    },
    firebase: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID
    },
    server: {
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT
    }
  }
}

export const validateConfig = () => {
  const config = getConfig()
  const errors: string[] = []

  if (!config.api.baseUrl) {
    errors.push('API_BASE_URL is not configured')
  }

  if (!config.firebase.apiKey) {
    errors.push('FIREBASE_API_KEY is not configured')
  }

  if (!config.firebase.authDomain) {
    errors.push('FIREBASE_AUTH_DOMAIN is not configured')
  }

  return {
    isValid: errors.length === 0,
    errors,
    config
  }
}

export const logConfig = () => {
  const config = getConfig()
  console.log('🔧 Configuration loaded:', {
    api: {
      baseUrl: config.api.baseUrl ? 'DÉFINIE' : 'NON DÉFINIE',
      sireneUrl: config.api.sireneUrl ? 'DÉFINIE' : 'NON DÉFINIE',
      sireneKey: config.api.sireneKey ? 'DÉFINIE' : 'NON DÉFINIE'
    },
    firebase: {
      apiKey: config.firebase.apiKey ? 'DÉFINIE' : 'NON DÉFINIE',
      authDomain: config.firebase.authDomain ? 'DÉFINIE' : 'NON DÉFINIE',
      projectId: config.firebase.projectId ? 'DÉFINIE' : 'NON DÉFINIE'
    },
    server: {
      nodeEnv: config.server.nodeEnv,
      port: config.server.port
    }
  })
}
