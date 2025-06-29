import {defineStore} from 'pinia'
import {$fetch} from 'ofetch'
import type {LoginPayload, LoginResponse, UserInfo} from "~/common/types/auth.type";
import {useCookie} from "#app/composables/cookie";
import type {User} from "firebase/auth";
import {
  signInWithPopup,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "firebase/auth";
import {RoleUser} from "~/common/enums/role.enum";
import { useNuxtApp } from '#app';

export async function loginWithGoogle(): Promise<User> {
  const {$firebase} = useNuxtApp();
  if (!$firebase.auth) throw new Error('Firebase non initialisé');

  const result = await signInWithPopup($firebase.auth, $firebase.provider!);

  return result.user;
}

interface UserState {
  user: UserInfo | null;
  loading: boolean;
  isVerified: boolean;
  error: string | null;
  // Cache pour éviter les appels API redondants
  _lastUserFetch: number;
  _userCacheExpiry: number;
  _isFetching: boolean;
}

export const useUserStore = defineStore('auth', {
  state: (): UserState => ({
    user: null,
    loading: false,
    error: null,
    isVerified: false,
    _lastUserFetch: 0,
    _userCacheExpiry: 2 * 60 * 1000, // 2 minutes
    _isFetching: false,
  }),

  getters: {
    isAuthenticated: () => !useCookie('isConnected').value,
    getUserId: (state) => state.user?.userId || useCookie('id_user').value || undefined,
    getRole(): RoleUser | null {
      // d’abord côté store
      if (this.user?.role) return this.user.role
      // ensuite côté browser
      if (typeof window !== 'undefined') {
        const r = localStorage.getItem('role')
        return (r === RoleUser.VOLUNTEER || r === RoleUser.ASSOCIATION)
            ? (r as RoleUser)
            : null
      }
      return null
    },
    getUser: (state) => state.user,
    fullName: (state) => state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
    getVerificationStatus: (state) => state.isVerified,
    isFetching: (state) => state._isFetching,
    getUserRule: (state) => state.user?.role,
    // Vérifier si le cache utilisateur est valide
    isUserCacheValid: (state) => {
      return Date.now() - state._lastUserFetch < state._userCacheExpiry;
    }
  },
  
  actions: {

    async getPageRole() {
      await this.fetchUser()
      useNuxtApp().$refreshAuth()

      const role = this.user?.role as RoleUser | undefined
      if (typeof window !== 'undefined' && role) {
        // on stocke dans le localStorage
        localStorage.setItem('role', role)
      }

      // puis on redirige
      switch (role) {
        case RoleUser.VOLUNTEER:
          return navigateTo('/volunteer')
        case RoleUser.ASSOCIATION:
          return navigateTo('/association/dashboard')
        default:
          return navigateTo('/dashboard')
      }
    },
    async login(payload: LoginPayload) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<LoginResponse>('/api/auth/login', {
          method: 'POST',
          body: payload,
        })


        if(response.idToken) {
          await this.getPageRole()
        }
        return response
      } catch (err: any) {
        this.error = err?.message || 'Erreur d\'authentification'
        throw err
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch('/api/auth/logout', {
          method: 'POST'
        })

        if(response.success) {
            this.user = null
            this._lastUserFetch = 0 // Réinitialiser le cache
            navigateTo('/')
        }
      } catch (err: any) {
        this.error = err?.message || 'Erreur de déconnexion'
        throw err
      } finally {
        this.loading = false
      }
    },

    async refreshTokens() {
      try {
        this.error = null
        await $fetch('/api/auth/refresh', {
          method: 'POST',
        })
      } catch (error: any) {
        this.error = error?.message || 'Erreur de rafraîchissement du token'
        await this.logout()
      }
    },

    async fetchUser() {
      // Éviter les appels simultanés
      if (this._isFetching) {
        return this.user;
      }

      // Vérifier le cache d'abord
      if (this.isUserCacheValid && this.user) {
        return this.user;
      }

      this._isFetching = true;
      try {
        this.error = null
        await this.refreshTokens()
        this.user = await $fetch<UserInfo>('/api/user/userCurrent')
        this._lastUserFetch = Date.now();
        return this.user;
      } catch (err: any) {
        this.error = err?.message || 'Erreur de récupération utilisateur'
        await this.logout()
      } finally {
        this._isFetching = false;
      }
    },

    async fetchUserGoogle(body: { idToken: string, refreshToken: string, uid: string }) {
      try {
        this.error = null

        const response = await $fetch('/api/auth/google/updateStatusUser', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        if (!response) {
          this.error = 'Erreur lors de la connexion'
          throw new Error(this.error)
        }
      } catch (error: any) {
        this.error = error?.message || 'Erreur lors de la connexion'
        throw error
      }
    },

    async uploadProfilePicture(imageBase64: string) {
      this.loading = true
      this.error = null

      try {
        const response = await $fetch('/api/user/updateProfileUser', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            imageBase64,
            id: this.user?.userId
          })
        })

        if (!response) {
          this.error = 'Erreur lors de l\'upload de l\'image'
          throw new Error(this.error)
        }

        // Invalider le cache utilisateur pour forcer un refresh
        this._lastUserFetch = 0;
      } catch (error: any) {
        this.error = error?.message || 'Erreur lors de l\'upload de l\'image'
        throw error
      } finally {
        this.loading = false
      }
    },

    async loginWithGoogle(role: RoleUser) {
      this.loading = true
      try {
        this.error = null

        const user = await loginWithGoogle();
        const idToken = await user.getIdToken();

        const payload = idToken.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));

        if(decodedPayload.role){
            await this.fetchUserGoogle({idToken, refreshToken: user.refreshToken, uid: user.uid});
            await this.getPageRole();
        }else{
          await this.callRegisterGoogle(idToken,role)
          if(role === 'VOLUNTEER'){
            localStorage.setItem("role", "VOLUNTEER")
            navigateTo('/auth/registerVolunteer')
          }else{
            localStorage.setItem("role", "ASSOCIATION")
            navigateTo('/auth/registerAssociation')
          }
        }
      } catch (error: any) {
        this.error = error?.message || 'Erreur lors de la connexion Google'
        throw error
      } finally {
        this.loading = false
      }
    },

    async callRegisterGoogle(idToken: string, role: RoleUser) {
      try {
        this.error = null

        const response = await $fetch('/api/auth/google/registerGoogle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idToken,
            role
          })
        });

        if (!response) {
          this.error = 'Erreur lors de l\'inscription'
          throw new Error(this.error)
        }
      } catch (error: any) {
        this.error = error?.message || 'Erreur lors de l\'inscription'
        throw error
      }
    },

    async removeUserAccount(){
      this.loading = true
      this.error = null
      try {
        const response = await $fetch('/api/auth/remove', {
          method: 'DELETE'
        })

        if(response.success) {
            this.user = null
            this._lastUserFetch = 0 // Réinitialiser le cache
            navigateTo('/')
        }
      } catch (err: any) {
        this.error = err?.message || 'Erreur de suppression du compte'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updatePassword(payload: { oldPassword: string, newPassword: string }) {
      this.loading = true
      this.error = null
      try {
        const {$firebase} = useNuxtApp();
        if (!$firebase.auth?.currentUser) {
          throw new Error('Utilisateur non connecté');
        }

        const credential = EmailAuthProvider.credential(
          $firebase.auth.currentUser.email!,
          payload.oldPassword
        );

        await reauthenticateWithCredential($firebase.auth.currentUser, credential);
        await updatePassword($firebase.auth.currentUser, payload.newPassword);

        // Invalider le cache utilisateur
        this._lastUserFetch = 0;
      } catch (error: any) {
        this.error = error?.message || 'Erreur lors de la mise à jour du mot de passe'
        throw error
      } finally {
        this.loading = false
      }
    },

    // Méthode pour nettoyer le cache
    clearUserCache() {
      this._lastUserFetch = 0;
      this._isFetching = false;
    }
  },
});
