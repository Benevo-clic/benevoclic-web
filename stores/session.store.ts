import { defineStore } from 'pinia'
import { useSessionPersistence, type SessionData } from '~/composables/useSessionPersistence'
import { useCookie } from '#app'

interface SessionState {
  isSessionValid: boolean
  lastActivity: number
  sessionExpiry: number
  backgroundTime: number
  isLoading: boolean
  error: string | null
}

export const useSessionStore = defineStore('session', {
  state: (): SessionState => ({
    isSessionValid: false,
    lastActivity: Date.now(),
    sessionExpiry: 24 * 60 * 60 * 1000, // 24h
    backgroundTime: 0,
    isLoading: false,
    error: null
  }),

  getters: {
    isSessionExpired: state => {
      return Date.now() - state.lastActivity > state.sessionExpiry
    },

    timeSinceLastActivity: state => {
      return Date.now() - state.lastActivity
    },

    shouldRefreshSession: state => {
      // Rafraîchir si plus de 30 minutes d'inactivité ou 5 minutes en arrière-plan
      return state.timeSinceLastActivity > 30 * 60 * 1000 || state.backgroundTime > 5 * 60 * 1000
    }
  },

  actions: {
    // Sauvegarder la session actuelle
    async saveCurrentSession() {
      this.isLoading = true
      this.error = null

      try {
        const { useAuthStore } = await import('~/stores/auth/auth.store')
        const { useUserStore } = await import('~/stores/user/user.store')

        const authStore = useAuthStore()
        const userStore = useUserStore()
        const { saveSession } = useSessionPersistence()

        if (!authStore.isAuthenticated) {
          throw new Error('Aucune session active à sauvegarder')
        }

        const sessionData: SessionData = {
          idToken: authStore.idToken || '',
          refreshToken: authStore.refreshToken || '',
          idUser: authStore.idUser || '',
          isConnected: authStore.isConnected,
          userData: userStore.user,
          lastActivity: this.lastActivity,
          expiresAt: Date.now() + this.sessionExpiry
        }

        await saveSession(sessionData)
        this.isSessionValid = true
        this.lastActivity = Date.now()

        process.env.NODE_ENV !== 'production' && console.log('✅ Session sauvegardée avec succès')
      } catch (error: any) {
        this.error = error.message
        process.env.NODE_ENV !== 'production' &&
          console.error('❌ Erreur lors de la sauvegarde de session:', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Restaurer la session depuis le stockage
    async restoreSession(savedSession?: SessionData) {
      this.isLoading = true
      this.error = null

      try {
        const { restoreSession } = useSessionPersistence()
        const { useAuthStore } = await import('~/stores/auth/auth.store')
        const { useUserStore } = await import('~/stores/user/user.store')

        const authStore = useAuthStore()
        const userStore = useUserStore()

        // Utiliser la session fournie ou restaurer depuis le stockage
        const sessionData = savedSession || (await restoreSession())

        if (!sessionData) {
          process.env.NODE_ENV !== 'production' && console.log('ℹ️ Aucune session à restaurer')
          return false
        }

        // Vérifier la validité de la session
        if (sessionData.expiresAt <= Date.now()) {
          process.env.NODE_ENV !== 'production' && console.log('❌ Session expirée')
          await this.clearSession()
          return false
        }

        // Restaurer l'état d'authentification
        authStore.idToken = sessionData.idToken
        authStore.refreshToken = sessionData.refreshToken
        authStore.idUser = sessionData.idUser
        authStore.isConnected = sessionData.isConnected

        // Mettre à jour le cookie isConnected côté client
        if (process.client && sessionData.isConnected) {
          const isConnectedCookie = useCookie<string>('isConnected')
          isConnectedCookie.value = 'true'
          process.env.NODE_ENV !== 'production' &&
            console.log('🍪 Cookie isConnected mis à jour côté client')
        }

        // Restaurer les données utilisateur si disponibles
        if (sessionData.userData && !userStore.user) {
          userStore.user = sessionData.userData
        }

        // Mettre à jour l'état de session
        this.isSessionValid = true
        this.lastActivity = sessionData.lastActivity
        this.backgroundTime = 0

        process.env.NODE_ENV !== 'production' && console.log('✅ Session restaurée avec succès')
        return true
      } catch (error: any) {
        this.error = error.message
        process.env.NODE_ENV !== 'production' &&
          console.error('❌ Erreur lors de la restauration de session:', error)
        return false
      } finally {
        this.isLoading = false
      }
    },

    // Rafraîchir la session lors du retour de visibilité
    async refreshSessionOnVisibility() {
      try {
        const { useAuthStore } = await import('~/stores/auth/auth.store')
        const { useUserStore } = await import('~/stores/user/user.store')
        const { useSessionApi } = await import('~/composables/useSessionApi')

        const authStore = useAuthStore()
        const userStore = useUserStore()
        const sessionApi = useSessionApi()

        process.env.NODE_ENV !== 'production' && console.log('🔄 Rafraîchissement de session...')

        // Vérifier si l'utilisateur est connecté
        if (!authStore.isAuthenticated) {
          process.env.NODE_ENV !== 'production' && console.log('❌ Utilisateur non authentifié')
          return false
        }

        // Vérifier la session côté serveur
        const sessionValid = await sessionApi.isSessionValid()
        if (!sessionValid) {
          process.env.NODE_ENV !== 'production' &&
            console.log('🔄 Session invalide, tentative de rafraîchissement...')
          await sessionApi.refreshSession()
        }

        // Rafraîchir les tokens côté client
        await authStore.refreshTokens()

        // Restaurer l'état utilisateur si nécessaire
        if (!userStore.user) {
          process.env.NODE_ENV !== 'production' &&
            console.log('🔄 Restauration des données utilisateur...')
          await userStore.fetchUser()
        }

        // Mettre à jour l'état de session
        this.isSessionValid = true
        this.lastActivity = Date.now()
        this.backgroundTime = 0

        // Sauvegarder la session mise à jour
        await this.saveCurrentSession()

        process.env.NODE_ENV !== 'production' && console.log('✅ Session rafraîchie avec succès')
        return true
      } catch (error: any) {
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

        return false
      }
    },

    // Nettoyer la session
    async clearSession() {
      try {
        const { clearSession } = useSessionPersistence()
        await clearSession()

        // Nettoyer l'état local
        this.isSessionValid = false
        this.lastActivity = 0
        this.backgroundTime = 0
        this.error = null

        // Supprimer le cookie isConnected côté client
        if (process.client) {
          const isConnectedCookie = useCookie<string>('isConnected')
          isConnectedCookie.value = ''
          process.env.NODE_ENV !== 'production' &&
            console.log('🍪 Cookie isConnected supprimé côté client')
        }

        process.env.NODE_ENV !== 'production' && console.log('✅ Session nettoyée avec succès')
      } catch (error: any) {
        this.error = error.message
        process.env.NODE_ENV !== 'production' &&
          console.error('❌ Erreur lors du nettoyage de session:', error)
      }
    },

    // Mettre à jour l'activité
    updateActivity() {
      this.lastActivity = Date.now()
      this.backgroundTime = 0
    },

    // Mettre à jour le temps en arrière-plan
    updateBackgroundTime(time: number) {
      this.backgroundTime = time
    },

    // Vérifier si la session doit être rafraîchie
    shouldRefresh(): boolean {
      return this.shouldRefreshSession
    }
  }
})
