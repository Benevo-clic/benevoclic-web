import {defineNuxtPlugin} from '#app'
import {$fetch} from "ofetch";

export default defineNuxtPlugin(async () => {
  let interval: ReturnType<typeof setInterval> | null = null;

  async function checkTokens() {
    try {
      const response = await $fetch('/api/auth/check-tokens')
      return response.hasTokens
    } catch (error) {
      return false
    }
  }

  async function refreshTokens() {
    try {
      await $fetch('/api/auth/refresh', { method: 'POST' })
      return true
    } catch (error: any) {
      // Si le refresh échoue, déconnecte l'utilisateur
      clearAuthAndRedirect()
      return false
    }
  }

  function clearAuthAndRedirect() {
    // Ici, tu peux aussi supprimer les cookies/tokens côté client si besoin
    if (interval) {
      clearInterval(interval)
      interval = null
    }
    navigateTo('/auth/login')
  }

  async function setupRefreshInterval() {
    if (typeof window === 'undefined') return
    // Vérifie d'abord si l'utilisateur a des tokens valides
    const hasTokens = await checkTokens()
    if (!hasTokens) {
      // Si pas de tokens, tente un refresh immédiat
      const refreshed = await refreshTokens()
      if (!refreshed) return // Si le refresh échoue, l'utilisateur est déconnecté
    }
    // Rafraîchit le token toutes les 55 minutes
    interval = setInterval(async () => {
      const stillHasTokens = await checkTokens()
      if (!stillHasTokens) {
        // Si le token n'est plus valide, tente un refresh
        const refreshed = await refreshTokens()
        if (!refreshed) return // Si le refresh échoue, l'utilisateur est déconnecté
      } else {
        // Si le token est encore valide, tente un refresh proactif
        await refreshTokens()
      }
    }, 55 * 60 * 1000) // 55 minutes
  }

  await setupRefreshInterval()

  return {
    provide: {
      refreshAuth: setupRefreshInterval
    }
  }
})