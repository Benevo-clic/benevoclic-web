import { defineEventHandler } from 'h3'
import { getConfig, validateConfig } from '~/utils/config'

export default defineEventHandler(async event => {
  const config = getConfig()
  const validation = validateConfig()

  return {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    config: {
      api: {
        baseUrl: config.api.baseUrl,
        sireneUrl: config.api.sireneUrl,
        sireneKey: config.api.sireneKey ? 'DÉFINIE' : 'NON DÉFINIE'
      },
      firebase: {
        apiKey: config.firebase.apiKey ? 'DÉFINIE' : 'NON DÉFINIE',
        authDomain: config.firebase.authDomain,
        projectId: config.firebase.projectId
      },
      server: {
        nodeEnv: config.server.nodeEnv,
        port: config.server.port
      }
    },
    validation: {
      isValid: validation.isValid,
      errors: validation.errors
    },
    processEnv: {
      API_BASE_URL: process.env.API_BASE_URL,
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY ? 'DÉFINIE' : 'NON DÉFINIE'
    }
  }
})
