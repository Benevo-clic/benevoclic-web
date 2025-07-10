import { defineStore } from 'pinia'
import {useCookie, useNuxtApp} from '#app'
import { RoleUser } from '~/common/enums/role.enum'
import { loginWithGoogle as firebaseLoginWithGoogle } from '~/stores/user/user.store'
import { useUserStore } from '~/stores/user/user.store'
import type {RegisterEmailVerifiedResponse, RegisterPayload} from "~/common/types/register.type";
import {createUserWithEmailAndPassword, getAuth, onIdTokenChanged, sendEmailVerification} from "firebase/auth";
import {useNavigation} from "~/composables/useNavigation";
import {$fetch} from "ofetch";

interface AuthState {
  idToken: string | null
  refreshToken: string | null
  idUser: string | null
  isConnected: boolean
  loading: boolean
  error: string | null
  unsubscribe: (() => void) | null;
  isVerified: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    idToken: null,
    refreshToken: null,
    idUser: null,
    isConnected: false,
    loading: false,
    isVerified: false,
    error: null,
    unsubscribe: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.idToken && state.isConnected,
    userId: (state) => state.idUser,
    getToken: (state) => state.idToken,
    getVerificationStatus: (state) => state.isVerified
  },

  actions: {
    hydrate() {
      this.idToken = useCookie('auth_token').value || null
      this.refreshToken = useCookie('refresh_token').value || null
      this.idUser = useCookie('id_user').value || null
      this.isConnected = Boolean(useCookie('isConnected').value)
    },

    // Login email/mot de passe
    async login(payload: { email: string; password: string }) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: payload,
        })

        this.hydrate()
        await this.getPageRole()
        
        return response
      } catch (e: any) {
        this.error = e?.data?.message || 'Erreur de connexion'
        throw e
      } finally {
        this.loading = false
      }
    },

    // Redirection selon le rôle
    async getPageRole() {
      const userStore = useUserStore()
      await userStore.fetchUser()

      const role = userStore.getRole as RoleUser | undefined
      const isCompleted = userStore.user?.isCompleted
      const isVerified = userStore.user?.isVerified

      if(!isVerified){
        return navigateTo(
            '/auth/VerifyEmailPage',
        )
      }else if (!isCompleted) {
          switch (role) {
          case RoleUser.VOLUNTEER:
              return navigateTo('/auth/registerVolunteer')
          case RoleUser.ASSOCIATION:
              return navigateTo('/auth/registerAssociation')
          default:
              return navigateTo('/auth/login')
          }
      } else {
        switch (role) {
          case RoleUser.VOLUNTEER:
            return navigateTo('/volunteer')
          case RoleUser.ASSOCIATION:
            return navigateTo('/association/dashboard')
          default:
            return '/'
        }
      }

    },

    // Register email/mot de passe
    async register(payload: { email: string; password: string; role: RoleUser }) {
      this.loading = true
      this.error = null
      try {
        await $fetch('/api/auth/registerEmailVerified', {
          method: 'POST',
          body: payload,
        })
        await this.refreshTokens()
        await this.getPageRole()
      } catch (e: any) {
        this.error = e?.data?.message || 'Erreur d\'inscription'
        throw e
      } finally {
        this.loading = false
      }
    },

    async registerWithEmailPassword(payload: RegisterPayload) {
      const auth = getAuth();
      this.loading = true;
      this.error = null;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
        await sendEmailVerification(userCredential.user);

        await this.startEmailVerificationListener({
          email: payload.email,
          password: payload.password,
          role: payload.role,
        });
      } catch (error: any) {
        this.error = error.message;
        throw new Error('Erreur lors de l\'inscription'+error);
      } finally {
        this.loading = false;
      }
    },
    async startEmailVerificationListener(payload: RegisterPayload) {
      const auth = getAuth();

      this.unsubscribe = onIdTokenChanged(auth, async (user) => {
        if (user) {
          await user.reload();

          if (user.emailVerified) {
            this.$patch({ isVerified: true });

            if (this.unsubscribe) {
              await this.callRegisterEmailVerified({
                email: payload.email,
                password: payload.password,
                role: payload.role
              });
              this.unsubscribe();
              this.unsubscribe = null;
            }
          }
        }
      });
    },
    async callRegisterEmailVerified(payload: RegisterPayload) {
      this.loading = true;
      this.error = null;
      try {
        await $fetch<RegisterEmailVerifiedResponse>(`/api/auth/registerEmailVerified`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            email: payload.email,
            role: payload.role,
            password: payload.password
          }
        })

        const { navigateToRoute } = useNavigation()

        if (payload.role === 'VOLUNTEER') {
          await navigateToRoute('/auth/registerVolunteer')
        } else {
          await navigateToRoute('/auth/registerAssociation')
        }

        useNuxtApp().$refreshAuth();

      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Erreur lors de l\'enregistrement';
        throw new Error('Erreur lors de l\'enregistrement: ' + this.error);
      } finally {
        this.loading = false;
      }
    },

    cleanup() {
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
      }
    },

    // Login Google
    async loginWithGoogle(role: RoleUser) {
      this.loading = true
      this.error = null
      try {
        const user = await firebaseLoginWithGoogle()
        const idToken = await user.getIdToken()
        const payload = idToken.split('.')[1]
        const decodedPayload = JSON.parse(atob(payload))

        if (decodedPayload.role) {
          // Utilisateur déjà enregistré, on met à jour le statut côté backend
          await this.fetchUserGoogle({ idToken, refreshToken: user.refreshToken, uid: user.uid })
        } else {
          // Première connexion, on enregistre l'utilisateur
          await this.callRegisterGoogle(idToken, role)
        }
        this.hydrate()
        await this.getPageRole()
      } catch (e: any) {
        this.error = e?.data?.message || 'Erreur Google'
        throw e
      } finally {
        this.loading = false
      }
    },

    // Appel pour enregistrer un utilisateur Google
    async callRegisterGoogle(idToken: string, role: RoleUser) {
      await $fetch('/api/auth/google/registerGoogle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { idToken, role },
      })
    },

    // Met à jour le statut utilisateur Google
    async fetchUserGoogle(body: { idToken: string; refreshToken: string; uid: string }) {
      await $fetch('/api/auth/google/updateStatusUser', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
    },

    // Logout
    async logout() {
      this.loading = true
      this.error = null
      try {
        await $fetch('/api/auth/logout', { method: 'POST' })
      } catch (e: any) {

      }
      
      // Nettoyer l'état d'authentification
      this.idToken = null
      this.refreshToken = null
      this.idUser = null
      this.isConnected = false
      
      // Nettoyer les données utilisateur
      const userStore = useUserStore()
      userStore.user = null
      userStore.clearUserCache()
      
      this.loading = false
    },

    // Refresh token
    async refreshTokens() {
      try {
        this.error = null
        await $fetch('/api/auth/refresh', { method: 'POST' })
        this.hydrate()
      } catch (error: any) {
        this.error = error?.message || 'Erreur de rafraîchissement du token'
        await this.logout()
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
    },
  },
})