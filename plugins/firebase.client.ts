// ~/plugins/firebase.client.ts
import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, browserPopupRedirectResolver } from 'firebase/auth'

export default defineNuxtPlugin(() => {
  const cfg = useRuntimeConfig().public.firebaseConfig

  console.log('🔑 Firebase API Key (client):', cfg.apiKey)

  const app = initializeApp(cfg)
  const auth = getAuth(app)
  const provider = new GoogleAuthProvider()

  return {
    provide: {
      firebase: { auth, provider, resolver: browserPopupRedirectResolver }
    }
  }
})
