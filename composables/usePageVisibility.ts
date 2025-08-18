import { ref } from 'vue'

export const usePageVisibility = () => {
  const isPageVisible = ref(true)
  const lastVisibilityChange = ref(Date.now())
  const backgroundTime = ref(0)
  const isInitialized = ref(false)

  // Gestionnaire d'événement de changement de visibilité
  const handleVisibilityChange = async () => {
    const now = Date.now()

    if (document.visibilityState === 'visible') {
      // Page redevenue visible
      isPageVisible.value = true
      backgroundTime.value = now - lastVisibilityChange.value

      process.env.NODE_ENV !== 'production' &&
        console.log(
          `📱 Page redevenue visible après ${Math.round(backgroundTime.value / 1000)}s en arrière-plan`
        )

      // Si plus de 5 minutes en arrière-plan, déclencher le rafraîchissement
      if (backgroundTime.value > 5 * 60 * 1000) {
        process.env.NODE_ENV !== 'production' &&
          console.log('🔄 Rafraîchissement de session après longue période en arrière-plan')
        await refreshSessionOnVisibility()
      }
    } else {
      // Page mise en arrière-plan
      isPageVisible.value = false
      lastVisibilityChange.value = now
      process.env.NODE_ENV !== 'production' && console.log('📱 Page mise en arrière-plan')
    }
  }

  // Rafraîchir la session lors du retour de visibilité
  const refreshSessionOnVisibility = async () => {
    try {
      // Importer dynamiquement pour éviter les dépendances circulaires
      const { useAuthStore } = await import('~/stores/auth/auth.store')
      const { useUserStore } = await import('~/stores/user/user.store')
      const { useSessionStore } = await import('~/stores/session.store')

      const authStore = useAuthStore()
      const userStore = useUserStore()
      const sessionStore = useSessionStore()

      process.env.NODE_ENV !== 'production' && console.log('🔄 Vérification de la session...')

      // Vérifier si l'utilisateur est connecté
      if (!authStore.isAuthenticated) {
        process.env.NODE_ENV !== 'production' &&
          console.log('❌ Utilisateur non authentifié, redirection vers login')
        return
      }

      // Rafraîchir les tokens
      await authStore.refreshTokens()

      // Restaurer l'état utilisateur si nécessaire
      if (!userStore.user) {
        process.env.NODE_ENV !== 'production' &&
          console.log('🔄 Restauration des données utilisateur...')
        await userStore.fetchUser()
      }

      // Mettre à jour le store de session
      sessionStore.isSessionValid = true
      sessionStore.lastActivity = Date.now()
      sessionStore.backgroundTime = backgroundTime.value

      process.env.NODE_ENV !== 'production' && console.log('✅ Session rafraîchie avec succès')
    } catch (error) {
      process.env.NODE_ENV !== 'production' &&
        console.error('❌ Erreur lors du rafraîchissement de session:', error)

      // En cas d'erreur, déconnecter l'utilisateur
      try {
        const { useAuthStore } = await import('~/stores/auth/auth.store')
        const authStore = useAuthStore()
        await authStore.logout()
      } catch (logoutError) {
        process.env.NODE_ENV !== 'production' &&
          console.error('❌ Erreur lors de la déconnexion:', logoutError)
      }
    }
  }

  // Initialiser la gestion de visibilité
  const initializeVisibility = () => {
    if (isInitialized.value || typeof window === 'undefined') return

    // Écouter les événements de visibilité
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Écouter les événements de focus/blur de la fenêtre
    window.addEventListener('focus', () => {
      if (!isPageVisible.value) {
        handleVisibilityChange()
      }
    })

    window.addEventListener('blur', () => {
      if (isPageVisible.value) {
        handleVisibilityChange()
      }
    })

    // Écouter les événements de pause/resume sur mobile
    if ('onpagehide' in window) {
      window.addEventListener('pagehide', () => {
        isPageVisible.value = false
        lastVisibilityChange.value = Date.now()
      })

      window.addEventListener('pageshow', () => {
        const now = Date.now()
        backgroundTime.value = now - lastVisibilityChange.value
        isPageVisible.value = true

        if (backgroundTime.value > 5 * 60 * 1000) {
          refreshSessionOnVisibility()
        }
      })
    }

    isInitialized.value = true
    process.env.NODE_ENV !== 'production' && console.log('✅ Gestionnaire de visibilité initialisé')
  }

  // Nettoyer les événements
  const cleanupVisibility = () => {
    if (typeof window === 'undefined') return

    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('focus', handleVisibilityChange)
    window.removeEventListener('blur', handleVisibilityChange)
    window.removeEventListener('pagehide', handleVisibilityChange)
    window.removeEventListener('pageshow', handleVisibilityChange)

    isInitialized.value = false
    process.env.NODE_ENV !== 'production' && console.log('🧹 Gestionnaire de visibilité nettoyé')
  }

  return {
    isPageVisible,
    lastVisibilityChange,
    backgroundTime,
    isInitialized,
    handleVisibilityChange,
    refreshSessionOnVisibility,
    initializeVisibility,
    cleanupVisibility
  }
}
