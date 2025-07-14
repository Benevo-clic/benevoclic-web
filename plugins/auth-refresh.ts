import {defineNuxtPlugin} from '#app'
import {$fetch} from "ofetch";

export default defineNuxtPlugin(() => {
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
      clearAuthAndRedirect()
      return false
    }
  }

  function clearAuthAndRedirect() {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
    navigateTo('/')
  }

  async function setupRefreshInterval() {
    if (typeof window === 'undefined') return
    const hasTokens = await checkTokens()
    if (!hasTokens) {
      const refreshed = await refreshTokens()
      if (!refreshed) return
    }
    interval = setInterval(async () => {
      const stillHasTokens = await checkTokens()
      if (!stillHasTokens) {
        const refreshed = await refreshTokens()
        if (!refreshed) return
      } else {
        await refreshTokens()
      }
    }, 55 * 60 * 1000)
  }

   setupRefreshInterval()

  return {
    provide: {
      refreshAuth: setupRefreshInterval
    }
  }
})