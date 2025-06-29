import {defineNuxtPlugin} from '#app'
import {$fetch} from "ofetch";

export default defineNuxtPlugin(() => {
  let interval: ReturnType<typeof setInterval> | null = null;
  let isRefreshing = false;
  let retryCount = 0;
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 5000; // 5 secondes

  async function checkTokens() {
    try {
      const response = await $fetch('/api/auth/check-tokens')
      return response.hasTokens
    } catch (error) {
      console.warn('Erreur lors de la vérification des tokens:', error)
      return false
    }
  }

  async function refreshTokens() {
    if (isRefreshing) {
      console.log('Refresh déjà en cours, attente...')
      return false
    }

    isRefreshing = true
    try {
      await $fetch('/api/auth/refresh', { method: 'POST' })
      console.log('Tokens refreshed')
      retryCount = 0 // Réinitialiser le compteur de tentatives
      return true
    } catch (error: any) {
      console.error('Erreur lors du refresh des tokens:', error)
      retryCount++
      
      if (retryCount >= MAX_RETRIES) {
        console.error('Nombre maximum de tentatives atteint, déconnexion...')
        clearAuthAndRedirect()
        return false
      }
      
      // Attendre avant de réessayer
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
      return false
    } finally {
      isRefreshing = false
    }
  }

  function clearAuthAndRedirect() {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
    retryCount = 0
    isRefreshing = false
    
    // Nettoyer les données d'authentification
    if (process.client) {
      localStorage.removeItem('isConnected')
      sessionStorage.clear()
    }
    
    navigateTo('/auth/login')
  }

  async function setupRefreshInterval() {
    if (typeof window === 'undefined') return
    
    try {
      // Vérifie d'abord si l'utilisateur a des tokens valides
      const hasTokens = await checkTokens()
      if (!hasTokens) {
        // Si pas de tokens, tente un refresh immédiat
        const refreshed = await refreshTokens()
        if (!refreshed) return // Si le refresh échoue, l'utilisateur est déconnecté
      }
      
      // Rafraîchit le token toutes les 55 minutes
      interval = setInterval(async () => {
        try {
          const stillHasTokens = await checkTokens()
          if (!stillHasTokens) {
            // Si le token n'est plus valide, tente un refresh
            const refreshed = await refreshTokens()
            if (!refreshed) return // Si le refresh échoue, l'utilisateur est déconnecté
          } else {
            // Si le token est encore valide, tente un refresh proactif
            await refreshTokens()
          }
        } catch (error) {
          console.error('Erreur dans l\'intervalle de refresh:', error)
        }
      }, 55 * 60 * 1000) // 55 minutes
      
    } catch (error) {
      console.error('Erreur lors de la configuration du refresh:', error)
    }
  }

  // Démarrer le processus de refresh
  setupRefreshInterval()

  // Nettoyer lors de la destruction du plugin
  if (process.client) {
    window.addEventListener('beforeunload', () => {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
    })
  }

  return {
    provide: {
      refreshAuth: setupRefreshInterval,
      clearAuth: clearAuthAndRedirect
    }
  }
})