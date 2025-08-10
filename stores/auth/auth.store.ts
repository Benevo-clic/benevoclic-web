import { defineStore } from 'pinia'
import { useCookie, useRequestFetch } from '#app'
import {
  createUserWithEmailAndPassword,
  getAuth,
  onIdTokenChanged,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth'
import { RoleUser } from '~/common/enums/role.enum'
import { loginWithGoogle as firebaseLoginWithGoogle, useUserStore } from '~/stores/user/user.store'
import type { RegisterEmailVerifiedResponse, RegisterPayload } from '~/common/types/register.type'

interface AuthState {
  idToken: string | null
  refreshToken: string | null
  idUser: string | null
  isConnected: boolean
  email: string
  loading: boolean
  error: string | null
  unsubscribe: (() => void) | null
  isVerified: boolean
  tempPassword: string
  role: RoleUser | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    idToken: null,
    refreshToken: null,
    idUser: null,
    isConnected: false,
    loading: false,
    email: '',
    isVerified: false,
    error: null,
    unsubscribe: null,
    tempPassword: '',
    role: null
  }),

  getters: {
    isAuthenticated: state => !!state.idToken && state.isConnected,
    userId: state => state.idUser,
    getToken: state => state.idToken,
    isLoading: state => state.loading,
    getError: state => state.error,
    getRole: state => state.role,
    getIsVerified: state => state.isVerified,
    getEmail: state => state.email,
    getTempPassword: state => state.tempPassword,
    getVerificationStatus: state => state.isVerified
  },

  actions: {
    hydrate() {
      this.idToken = useCookie('auth_token').value || null
      this.refreshToken = useCookie('refresh_token').value || null
      this.idUser = useCookie('id_user').value || null
      const isConnectedRaw = useCookie<any>('isConnected').value
      this.isConnected = isConnectedRaw === 'true' || isConnectedRaw === true
    },

    async login(payload: { email: string; password: string; role: RoleUser }) {
      this.loading = true
      this.error = null

      try {
        const $fetch = useRequestFetch()
        if (process.client) {
          try {
            const { usePermissions } = await import('~/composables/usePermissions')
            const { hasPermission } = usePermissions()

            if (!hasPermission('canAuthenticate')) {
              this.error =
                'Vous devez accepter les cookies essentiels pour vous connecter. Veuillez paramétrer vos préférences de cookies.'
              throw new Error('Cookies essentiels non acceptés')
            }
          } catch (err) {
            if (process.dev) {
              console.warn('Impossible de vérifier les permissions de cookies:', err)
            }
          }
        }

        const response = await $fetch('/api/user/login', {
          method: 'POST',
          credentials: 'include',
          body: {
            email: payload.email,
            password: payload.password,
            role: payload.role
          }
        })

        // Forcer le cookie et le flag store avant hydratation et redirection
        if (process.client) {
          const isConnectedCookie = useCookie<string>('isConnected')
          isConnectedCookie.value = 'true'
        }
        this.isConnected = true
        this.hydrate()
        await this.goToPageAfterLogin({
          role: payload.role,
          password: payload.password,
          email: payload.email
        })
        return response
      } catch (e: any) {
        this.error = e?.data?.message || e?.message || 'Erreur de connexion'
        throw e
      } finally {
        this.loading = false
      }
    },

    async goToPageAfterLogin(payload: { role: RoleUser; password: string; email: string }) {
      const auth = getAuth()
      const userStore = useUserStore()
      if (!auth.currentUser) {
        throw new Error('Aucun utilisateur connecté pour envoyer la vérification par email.')
      }

      if (!auth.currentUser?.emailVerified) {
        const tempPwdCookie = useCookie<string>('tempPassword')
        const roleCookie = useCookie<string>('userRole')
        const emailCookie = useCookie<string>('email')
        tempPwdCookie.value = payload.password
        roleCookie.value = payload.role
        emailCookie.value = payload.email

        return navigateTo('/auth/VerifyEmailPage')
      }

      await userStore.fetchUser()

      if (!userStore.user) {
        this.error = 'Utilisateur non trouvé'
        return
      }

      const role = userStore.getRole as RoleUser | undefined
      const isCompleted = userStore.user?.isCompleted

      if (!isCompleted) {
        switch (role) {
          case RoleUser.VOLUNTEER:
            return navigateTo('/auth/registerVolunteer')
          case RoleUser.ASSOCIATION:
            return navigateTo('/auth/registerAssociation')
          case RoleUser.ADMIN:
            return navigateTo('/admin/verification')
          default:
            return navigateTo('/')
        }
      } else {
        switch (role) {
          case RoleUser.VOLUNTEER:
            return navigateTo('/volunteer')
          case RoleUser.ASSOCIATION:
            return navigateTo('/association/dashboard')
          case RoleUser.ADMIN:
            return navigateTo('/admin')
          default:
            return '/'
        }
      }
    },

    async getPageRole() {
      try {
        const userStore = useUserStore()
        await userStore.fetchUser()

        const isCompleted = userStore.user?.isCompleted
        const role = userStore.getRole as RoleUser | undefined

        if (!isCompleted) {
          switch (role) {
            case RoleUser.VOLUNTEER:
              return navigateTo('/auth/registerVolunteer')
            case RoleUser.ASSOCIATION:
              return navigateTo('/auth/registerAssociation')
            case RoleUser.ADMIN:
              return navigateTo('/admin/verification')
            default:
              return navigateTo('/')
          }
        } else {
          switch (role) {
            case RoleUser.VOLUNTEER:
              return navigateTo('/volunteer')
            case RoleUser.ASSOCIATION:
              return navigateTo('/association/dashboard')
            case RoleUser.ADMIN:
              return navigateTo('/admin')
            default:
              return navigateTo('/')
          }
        }
      } catch (error) {
        if (process.dev) {
          console.error("Erreur lors de la récupération de l'utilisateur:", error)
        }
        await this.logout()
      }
    },

    async sendEmailVerification(payload: { role: RoleUser; tempPassword: string }) {
      const auth = getAuth()

      if (!auth.currentUser) {
        throw new Error('Aucun utilisateur connecté pour envoyer la vérification par email.')
      }

      if (auth.currentUser.emailVerified) {
        if (process.dev) {
          console.warn("L'email est déjà vérifié pour l'utilisateur actuel.")
        }
      }

      if (!this.tempPassword) {
        await this.deleteCookies()
        throw new Error(
          "Aucun mot de passe temporaire trouvé pour l'envoi de la vérification par email."
        )
      }

      this.loading = true
      this.error = null

      try {
        await sendEmailVerification(auth.currentUser)
        this.$patch({ isVerified: false })

        if (process.dev) {
          console.log('✅ Email de vérification envoyé, écoute en cours...')
        }
        await this.startEmailVerificationListener({
          email: auth.currentUser.email || '',
          password: (this.tempPassword as string) || payload.tempPassword,
          role: (this.role as RoleUser) || payload.role
        })

        if (process.dev) {
          console.log('✅ Email de vérification envoyé avec succès')
        }
      } catch (error: any) {
        if (process.dev) {
          console.error("❌ Erreur lors de l'envoi de la vérification:", error)
        }
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    startEmailVerificationListener(payload: RegisterPayload) {
      const auth = getAuth()

      // Ajouter un flag pour éviter les appels multiples
      if (this.isVerified) {
        if (process.dev) {
          console.log("Email déjà vérifié, arrêt de l'écouteur")
        }
        return
      }

      this.unsubscribe = onIdTokenChanged(auth, async user => {
        if (user) {
          await user.reload()

          if (user.emailVerified && !this.isVerified) {
            if (process.dev) {
              console.log('Email vérifié, traitement en cours...')
            }

            if (this.unsubscribe) {
              const tempPwdCookie = useCookie<string>('tempPassword')
              const roleCookie = useCookie<string>('userRole')
              const emailCookie = useCookie<string>('email')
              tempPwdCookie.value = payload.password
              roleCookie.value = payload.role
              emailCookie.value = payload.email
              this.isVerified = true

              try {
                await this.callRegisterEmailVerified({
                  email: payload.email,
                  password: payload.password,
                  role: payload.role
                })
              } catch (error) {
                if (process.dev) {
                  console.error("Erreur lors de l'enregistrement vérifié:", error)
                }
                this.isVerified = false
                return
              }

              this.unsubscribe()
              this.unsubscribe = null
            }
          }
        }
      })
    },
    async callRegisterEmailVerified(payload: RegisterPayload) {
      // Vérifier si l'appel est déjà en cours
      if (this.loading) {
        if (process.dev) {
          console.log('Appel en cours, attente...')
        }
        return
      }

      this.loading = true
      try {
        const $fetch = useRequestFetch()
        const response = await $fetch<RegisterEmailVerifiedResponse>(
          '/api/user/register-user-verified',
          {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: {
              email: payload.email,
              role: payload.role,
              password: payload.password
            }
          }
        )

        if (response) {
          await this.login(payload)
        }
      } catch (error) {
        if (process.dev) {
          console.error("❌ Erreur lors de l'enregistrement vérifié:", error)
        }
        this.error = "Une erreur est survenue lors de l'inscription"
        throw new Error("Erreur lors de l'inscription: " + error)
      } finally {
        this.loading = false
      }
    },

    async registerWithEmailPassword(payload: RegisterPayload) {
      const auth = getAuth()
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          payload.email,
          payload.password
        )
        await sendEmailVerification(userCredential.user)

        if (process.dev) {
          console.log('✅ Inscription réussie, email de vérification envoyé', payload)
        }
        if (process.dev) {
          console.log('Utilisateur créé avec succès:', userCredential.user)
        }

        await this.startEmailVerificationListener({
          email: payload.email,
          password: payload.password,
          role: payload.role
        })
        if (process.dev) {
          console.log('✅ Inscription réussie, email de vérification envoyé', payload)
        }
        return userCredential.user.emailVerified
      } catch (error: any) {
        this.error = error.message
        throw new Error("Erreur lors de l'inscription" + error)
      }
    },

    // Nettoyage lors de la destruction du store
    cleanup() {
      if (this.unsubscribe) {
        this.unsubscribe()
        this.unsubscribe = null
      }
    },

    async forgotPassword(email: string) {
      this.loading = true
      this.error = null
      try {
        const auth = getAuth()
        await sendPasswordResetEmail(auth, email)
      } catch (e: any) {
        this.error = e?.message || 'Erreur lors de la réinitialisation du mot de passe'
        throw e
      } finally {
        this.loading = false
      }
    },

    // Login Google
    async loginWithGoogle(
      role: RoleUser,
      isRegisterMode: boolean = false,
      termsAccepted: boolean = false
    ) {
      this.loading = true
      this.error = null

      try {
        // Vérifier les permissions de cookies côté client
        if (process.client) {
          try {
            const { usePermissions } = await import('~/composables/usePermissions')
            const { hasPermission } = usePermissions()

            if (!hasPermission('canAuthenticate')) {
              this.error =
                'Vous devez accepter les cookies essentiels pour vous connecter. Veuillez paramétrer vos préférences de cookies.'
              throw new Error('Cookies essentiels non acceptés')
            }
          } catch (err) {
            console.warn('Impossible de vérifier les permissions de cookies:', err)
          }
        }

        // Vérifier l'acceptation des conditions générales
        if (isRegisterMode && !termsAccepted) {
          this.error = "Vous devez accepter les conditions générales d'utilisation pour continuer."
          throw new Error('Conditions générales non acceptées')
        }

        const user = await firebaseLoginWithGoogle()
        const idToken = await user.getIdToken()
        const payload = idToken.split('.')[1]
        const decodedPayload = JSON.parse(atob(payload))

        if (decodedPayload.role) {
          // Utilisateur déjà enregistré, on met à jour le statut côté backend
          await this.fetchUserGoogle({
            idToken,
            refreshToken: user.refreshToken,
            uid: user.uid
          })
        } else {
          // Première connexion, on enregistre l'utilisateur
          await this.callRegisterGoogle(idToken, role)
        }
        this.hydrate()

        // Attend que getPageRole() termine
        await this.getPageRole()
      } catch (e: any) {
        this.error = e?.data?.message || e?.message || 'Erreur Google'
        throw e
      } finally {
        this.loading = false
      }
    },

    async callRegisterGoogle(idToken: string, role: RoleUser) {
      const $fetch = useRequestFetch()
      await $fetch('/api/user/register-google', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: { idToken, role }
      })
    },

    async fetchUserGoogle(body: { idToken: string; refreshToken: string; uid: string }) {
      const $fetch = useRequestFetch()
      await $fetch(`/api/user/${body.uid}/update-connected/${true}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body
      })
    },

    async deleteCookies() {
      try {
        const $fetch = useRequestFetch()
        await $fetch('/api/auth/deleteCookies', {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        })
        this.idToken = null
        this.refreshToken = null
        this.idUser = null
        this.isConnected = false
        this.role = null
        this.isVerified = false
        this.loading = false
        this.error = null
        this.cleanup() // Nettoyer l'écouteur de token
        const userStore = useUserStore()
        userStore.user = null
        userStore.clearUserCache()
        this.resetCookies()
        if (process.client) {
          window.location.href = '/'
        }
      } catch (error) {}
    },

    // Logout
    async logout() {
      this.loading = true
      this.error = null
      try {
        const $fetch = useRequestFetch()
        await $fetch('/api/user/logout', {
          method: 'POST',
          credentials: 'include'
        })
        await this.deleteCookies()
      } catch (e: any) {
        this.error = e?.data?.message || 'Erreur de déconnexion'
        throw e
      } finally {
        this.loading = false
      }
    },

    async refreshTokens() {
      try {
        this.error = null
        const $fetch = useRequestFetch()
        await $fetch('/api/user/refresh', {
          method: 'POST',
          credentials: 'include'
        })
        this.hydrate()
      } catch (error: any) {
        this.error = error?.message || 'Erreur de rafraîchissement du token'
        await this.logout()
      }
    },
    resetCookies() {
      const tempPwdCookie = useCookie<string>('tempPassword')
      const roleCookie = useCookie<string>('userRole')
      const emailCookie = useCookie<string>('email')

      if (tempPwdCookie.value) {
        tempPwdCookie.value = ''
      }
      if (roleCookie.value) {
        roleCookie.value = ''
      }
      if (emailCookie.value) {
        emailCookie.value = ''
      }
    },

    // Initialisation globale (à appeler dans le middleware)
    async initAuth() {
      this.hydrate()
      if (this.idToken && this.isConnected) {
        // Récupérer les données utilisateur via user. Store
        const userStore = useUserStore()
        if (!userStore.user) {
          await userStore.fetchUser()
        }
      }
    }
  }
})
