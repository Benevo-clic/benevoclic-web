import {defineStore} from 'pinia'
import {$fetch} from 'ofetch'
import type {User} from "~/common/interface/auth.interface";
import type {LoginPayload, LoginResponse} from "~/common/types/auth.type";


export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => {
      return state.user?.email !== null
    },
    getUser: (state) => state.user,
    fullName: (state) => state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
  },

  actions: {

    async login(payload: LoginPayload) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<LoginResponse>('/api/auth/login', {
          method: 'POST',
          body: payload,
        })

        await this.fetchUser()
        navigateTo('/dashboard')

      } catch (err) {
        this.error = "Erreur d'authentification"
        console.error(err)
      } finally {
        this.loading = false
      }
    },
    async logout() {
      this.loading = true
      this.error = null
      try {
        await $fetch('/api/auth/logout',{
            method: 'POST',
        }) ;
        this.user = null
        navigateTo('/login')
      }catch (err) {
        this.error = "Erreur de déconnexion"
        console.error(err)
      }finally {
        this.loading = false
      }
    },

    async fetchUser() {
      try {
        this.user = await $fetch<User>('/api/user/userCurrent')
      } catch (err) {
        await this.logout()
      }
    },

  },
})
