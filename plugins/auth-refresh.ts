import {defineNuxtPlugin} from '#app'
import {$fetch} from "ofetch";

export default defineNuxtPlugin(() => {
  let interval: ReturnType<typeof setInterval> | null = null;

  async function setupRefreshInterval() {
    async function checkTokens() {
      try {
        const response = await $fetch('/api/auth/check-tokens')
        if (!response.hasTokens && interval) {
          clearInterval(interval)
          interval = null
          return false
        }
        return response.hasTokens
      } catch (error) {
        if (interval) {
          clearInterval(interval)
          interval = null
        }
        return false
      }
    }

    const refreshTokens = async () => {
      try {
        await $fetch('/api/auth/refresh', { method: 'POST' })
        console.log('Tokens refreshed')
      } catch (error) {
        if (interval) {
          clearInterval(interval)
          interval = null
        }

        navigateTo('/auth/login')

      }
    }

    if (typeof window !== 'undefined') {
      const hasTokens = await checkTokens()
      if (hasTokens) {
        await refreshTokens()
        interval = setInterval(async () => {
          const hasValidTokens = await checkTokens()
          if (hasValidTokens) await refreshTokens()
        }, 30 * 1000) // 1 hour
      }
    }
  }

  setupRefreshInterval()

  return {
    provide: {
      refreshAuth: setupRefreshInterval
    }
  }
})