import {defineStore} from 'pinia'
import {$fetch} from 'ofetch'
import type {User} from "~/types/auth";


interface LoginPayload {
  email: string
  password: string
}

interface LoginResponse {
  idToken: string
  refreshToken: string
  expiresIn: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!useCookie('auth_token').value,
    getUser: (state) => state.user,
    fullName: (state) => state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
  },

  actions: {
    async setCookies(token: string, email: string, refreshToken: string) {
      const authCookie = useCookie('auth_token', {
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'strict',
        secure: true
      })
      const emailCookie = useCookie('user_email', {
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'strict',
        secure: true
      })
      const refreshTokenCookie = useCookie('refresh_token', {
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'strict',
        secure: true
      })

      authCookie.value = token
      emailCookie.value = email
      refreshTokenCookie.value = refreshToken

      // Vérifier que les cookies sont bien définis
      return !!(authCookie.value && emailCookie.value && refreshTokenCookie.value)
    },

    async resetEmailToken() {
        const emailCookie = useCookie('user_email', {
            maxAge: 0,
            sameSite: 'strict',
            secure: true
        })
        emailCookie.value = null
    },
    async resetCookies() {
        const authCookie = useCookie('auth_token', {
            maxAge: 0,
            sameSite: 'strict',
            secure: true
        })

        const refreshTokenCookie = useCookie('refresh_token', {
            maxAge: 0,
            sameSite: 'strict',
            secure: true
        })

        authCookie.value = null
        refreshTokenCookie.value = null
    },

    async login(payload: LoginPayload) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<LoginResponse>('/api/auth/login', {
          method: 'POST',
          body: payload,
        })
        
        if (response.idToken) {
          const cookiesSet = await this.setCookies(
            response.idToken,
            payload.email,
            response.refreshToken
          )

          if (!cookiesSet) {
            throw new Error('Échec de la configuration des cookies')
          }

          await this.fetchUser()

          navigateTo('/dashboard')
        }
      } catch (err) {
        this.error = "Erreur d'authentification"
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      try {
        this.user = await $fetch<User>('/api/auth/user')
        await this.resetEmailToken()
      } catch (err) {
        await this.logout()
      }
    },

    async logout() {
      await this.resetCookies()
      this.user = null
      navigateTo('/login')
    }
  },
})
