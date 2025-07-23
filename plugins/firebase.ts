// ~/plugins/firebase.ts
import { defineNuxtPlugin, useRuntimeConfig } from '#app'      // ← on importe useRuntimeConfig
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, browserPopupRedirectResolver } from 'firebase/auth'
import type { Auth } from 'firebase/auth'

interface FirebasePlugin {
  auth: Auth | null
  provider: GoogleAuthProvider | null
  resolver: typeof browserPopupRedirectResolver | null
}

export default defineNuxtPlugin(() => {
  try {
    // On récupère la config publique
    const config = useRuntimeConfig().public.firebaseConfig

    // DEBUG : côté client, voir la clé dans la console
    if (process.client) {
      console.log('🔑 Firebase API Key (client):', config.apiKey)
    }

    const app = initializeApp(config)
    const auth = getAuth(app)
    const provider = new GoogleAuthProvider()

    return {
      provide: {
        firebase: {
          auth,
          provider,
          resolver: browserPopupRedirectResolver,
        } as FirebasePlugin,
      },
    }
  } catch (error) {
    console.error('Erreur d’initialisation de Firebase', error)
    return {
      provide: {
        firebase: { auth: null, provider: null, resolver: null } as FirebasePlugin,
      },
    }
  }
})
