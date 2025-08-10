export default defineNuxtPlugin(() => {
  // Ce plugin s'exécute uniquement côté client
  if (process.client) {
    // Initialiser Firebase de base pour l'authentification
    const initFirebaseBase = async () => {
      try {
        const { initializeApp } = await import('firebase/app')
        const { getAuth, GoogleAuthProvider, browserPopupRedirectResolver } = await import(
          'firebase/auth'
        )

        const config = useRuntimeConfig()
        const firebaseConfig = config.public.firebaseConfig
        if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
          console.log('Configuration Firebase manquante ou invalide', firebaseConfig)
          throw new Error('Configuration Firebase manquante ou invalide')
        }

        const app = initializeApp(firebaseConfig)
        const auth = getAuth(app)
        const provider = new GoogleAuthProvider()

        console.log("Firebase de base initialisé pour l'authentification")

        return {
          auth,
          provider,
          resolver: browserPopupRedirectResolver
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de Firebase de base:", error)
        return null
      }
    }

    // Retourner le plugin avec une promesse
    return {
      provide: {
        firebaseBase: initFirebaseBase()
      }
    }
  }
})
