import { defineNuxtPlugin } from '#app'
import { useAuthStore } from '@/stores/auth/auth.store'
import { useUserStore } from '~/stores/user/user.store'

export default defineNuxtPlugin(() => {
  if (import.meta.server) {
    return
  }

  const auth = useAuthStore()
  const userStore = useUserStore()

  let timerId: number | null = null
  let refreshing = false

  function clearTimer() {
    if (timerId) {
      clearTimeout(timerId)
      timerId = null
    }
  }

  function getMsUntilPreExpiry(idToken?: string | null) {
    try {
      if (!idToken) {
        return null
      }
      const payload = JSON.parse(atob(idToken.split('.')[1]))
      const expMs = payload.exp * 1000
      const preMs = expMs - Date.now() - 5 * 60 * 1000 // 5 minutes avant l'expiration
      return Math.max(preMs, 60 * 1000) // minimum 60s
    } catch {
      return null
    }
  }

  function getRoleDefaultIntervalMs(role?: string) {
    // ADMIN: 10 minutes, autres: 20 minutes
    if (role === 'ADMIN') {
      return 10 * 60 * 1000
    }
    return 20 * 60 * 1000
  }

  function scheduleNext() {
    clearTimer()
    if (!auth.isConnected) {
      return
    }
    const role = userStore.getRole as string | undefined
    const preExpMs = getMsUntilPreExpiry(auth.idToken)
    const fallbackMs = getRoleDefaultIntervalMs(role)
    const nextMs = preExpMs ?? fallbackMs
    // @ts-ignore
    timerId = window.setTimeout(() => {
      void safeRefresh()
    }, nextMs)
  }

  async function safeRefresh() {
    if (refreshing || !auth.isConnected) {
      scheduleNext()
      return
    }
    refreshing = true
    try {
      await auth.refreshTokens()
    } catch {
      // silencieux, on réessaiera au prochain cycle/focus
    } finally {
      refreshing = false
      scheduleNext()
    }
  }

  function onVisibility() {
    if (document.visibilityState === 'visible') {
      void safeRefresh()
    }
  }

  function onFocus() {
    void safeRefresh()
  }

  // Démarrer
  scheduleNext()
  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('focus', onFocus)

  // Nettoyage HMR
  if (import.meta.hot) {
    import.meta.hot.on('vite:beforeUpdate', () => {
      clearTimer()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', onFocus)
    })
  }
})
