export default defineNuxtPlugin(() => {
  // Ce plugin s'exécute uniquement côté client
  if (process.server) {
    return {
      provide: {
        sessionSystem: {
          initialized: false
        }
      }
    }
  }

  console.log('🚀 Initialisation du système de persistance de session...')

  // Initialisation asynchrone
  ;(async () => {
    try {
      // Importer les composables nécessaires
      const { useSessionPersistence } = await import('~/composables/useSessionPersistence')
      const { usePageVisibility } = await import('~/composables/usePageVisibility')
      const { useSessionStore } = await import('~/stores/session.store')

      const sessionStore = useSessionStore()
      const { restoreSession } = useSessionPersistence()

      // Restaurer la session au démarrage
      console.log('🔄 Tentative de restauration de session...')
      const savedSession = await restoreSession()

      if (savedSession) {
        console.log('📦 Session trouvée, restauration...')
        const restored = await sessionStore.restoreSession(savedSession)

        if (restored) {
          console.log('✅ Session restaurée avec succès au démarrage')
        } else {
          console.log('❌ Échec de la restauration de session')
        }
      } else {
        console.log('ℹ️ Aucune session à restaurer')
      }

      // Initialiser la gestion de visibilité de page
      console.log('👁️ Initialisation de la gestion de visibilité...')
      usePageVisibility()

      // Sauvegarder la session périodiquement (toutes les 5 minutes)
      if (process.client) {
        setInterval(
          async () => {
            try {
              const { useAuthStore } = await import('~/stores/auth/auth.store')
              const authStore = useAuthStore()

              if (authStore.isAuthenticated) {
                await sessionStore.saveCurrentSession()
              }
            } catch (error) {
              console.warn('⚠️ Erreur lors de la sauvegarde périodique:', error)
            }
          },
          5 * 60 * 1000
        ) // 5 minutes
      }

      console.log('✅ Système de persistance de session initialisé')
    } catch (error) {
      console.error("❌ Erreur lors de l'initialisation du système de session:", error)
    }
  })()

  return {
    provide: {
      sessionSystem: {
        initialized: true
      }
    }
  }
})
