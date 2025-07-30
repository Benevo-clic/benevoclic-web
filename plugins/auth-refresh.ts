import {defineNuxtPlugin} from '#app'
import {$fetch} from "ofetch";
import {useCookie} from '#app'

export default defineNuxtPlugin(() => {
  let interval: ReturnType<typeof setInterval> | null = null;

  async function checkTokens() {
    try {
      const refreshToken = useCookie('refresh-token').value
      const authToken = useCookie('auth_token').value
      return {
        hasTokens: !!(refreshToken && authToken)
      }
    } catch (error) {
      return false
    }
  }

  async function refreshTokens() {
    try {
      await $fetch('/api/user/refresh', { method: 'POST', credentials: 'include' })
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