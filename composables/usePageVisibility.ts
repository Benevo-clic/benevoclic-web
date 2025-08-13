import { ref, onMounted, onUnmounted } from 'vue'

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

      console.log(
        `📱 Page redevenue visible après ${Math.round(backgroundTime.value / 1000)}s en arrière-plan`
      )

      // Si plus de 5 minutes en arrière-plan, déclencher le rafraîchissement
      if (backgroundTime.value > 5 * 60 * 1000) {
        console.log('🔄 Rafraîchissement de session après longue période en arrière-plan')
        await refreshSessionOnVisibility()
      }
    } else {
      // Page mise en arrière-plan
      isPageVisible.value = false
      lastVisibilityChange.value = now
      console.log('📱 Page mise en arrière-plan')
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

      console.log('🔄 Vérification de la session...')

      // Vérifier si l'utilisateur est connecté
      if (!authStore.isAuthenticated) {
        console.log('❌ Utilisateur non authentifié, redirection vers login')
        return
      }

      // Rafraîchir les tokens
      await authStore.refreshTokens()

      // Restaurer l'état utilisateur si nécessaire
      if (!userStore.user) {
        console.log('🔄 Restauration des données utilisateur...')
        await userStore.fetchUser()
      }

      // Mettre à jour le store de session
      sessionStore.isSessionValid = true
      sessionStore.lastActivity = Date.now()
      sessionStore.backgroundTime = backgroundTime.value

      console.log('✅ Session rafraîchie avec succès')
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement de session:', error)

      // En cas d'erreur, déconnecter l'utilisateur
      try {
        const { useAuthStore } = await import('~/stores/auth/auth.store')
        const authStore = useAuthStore()
        await authStore.logout()
      } catch (logoutError) {
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
    console.log('✅ Gestionnaire de visibilité initialisé')
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
    console.log('🧹 Gestionnaire de visibilité nettoyé')
  }

  // Initialisation automatique
  onMounted(() => {
    initializeVisibility()
  })

  // Nettoyage automatique
  onUnmounted(() => {
    cleanupVisibility()
  })

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
