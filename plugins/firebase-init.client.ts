export default defineNuxtPlugin(() => {
  // Ce plugin s'exécute uniquement côté client
  if (process.client) {
    // Initialiser Firebase de base pour l'authentification
    const initFirebaseBase = async () => {
      try {
        const config = useRuntimeConfig()
        if (!config.public.firebaseConfig) {
          console.warn('Configuration Firebase manquante')
          return null
        }

        // Initialiser Firebase de base
        const { initializeApp } = await import('firebase/app')
        const { getAuth, GoogleAuthProvider, browserPopupRedirectResolver } = await import(
          'firebase/auth'
        )

        const app = initializeApp(config.public.firebaseConfig)
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
