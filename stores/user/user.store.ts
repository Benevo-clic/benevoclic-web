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
  _lastUserUpdate: number; // Timestamp de la dernière mise à jour
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
    _lastUserUpdate: 0,
  }),

  getters: {
    isAuthenticated: (state) => {
      const isConnected = useCookie('isConnected').value;
      return Boolean(isConnected);
    },
    getUserId: (state) => state.user?.userId || useCookie('id_user').value || undefined,
    getUser: (state) => state.user,
    fullName: (state) => state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
    getVerificationStatus: (state) => state.isVerified,
    isFetching: (state) => state._isFetching,
    getUserRule: (state) => state.user?.role,
    isUserCacheValid: (state) => {
      return Date.now() - state._lastUserFetch < state._userCacheExpiry;
    },
    isUserDataFresh: (state) => {
      return state._lastUserUpdate > state._lastUserFetch;
    }
  },
  
  actions: {

    invalidateUserCache() {
      this._lastUserFetch = 0;
      this._isFetching = false;
    },

    updateUserData(userData: UserInfo) {
      this.user = userData;
      this._lastUserUpdate = Date.now();
      this.error = null;
    },

    async getPageRole() {
      await this.fetchUser()
      useNuxtApp().$refreshAuth()

      const role = this.user?.role as RoleUser | undefined
      // puis on redirige
      switch (role) {
        case RoleUser.VOLUNTEER:
          return navigateTo('/volunteer')
        case RoleUser.ASSOCIATION:
          return navigateTo('/association/dashboard')
        default:
          return navigateTo('/auth/login')
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
          this.invalidateUserCache();
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
            this.invalidateUserCache()
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
      if (this._isFetching) {
        return this.user;
      }

      if (this.isUserCacheValid && this.user && !this.isUserDataFresh) {
        return this.user;
      }

      this.loading = true
      this._isFetching = true;
      try {
        this.error = null
        await this.refreshTokens()
        const userData = await $fetch<UserInfo>('/api/user/userCurrent')
        
        if (!userData || !userData.userId) {
          throw new Error('Données utilisateur invalides');
        }
        
        this.updateUserData(userData);
        this._lastUserFetch = Date.now();
        return this.user;
      } catch (err: any) {
        this.error = err?.message || 'Erreur de récupération utilisateur'
        await this.logout()
      } finally {
        this._isFetching = false;
        this.loading = false;
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
        
        this.invalidateUserCache();
        await this.getPageRole()

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

        this.invalidateUserCache();
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

    async getUserById(id: string) {
        this.loading = true
        this.error = null
        try {
            const response = await $fetch<UserInfo>(`/api/user/${id}`)

            if (!response) {
            this.error = 'Utilisateur non trouvé'
            }

            return response
        } catch (err: any) {
            this.error = err?.message || 'Erreur de récupération de l\'utilisateur'
            throw err
        } finally {
            this.loading = false
        }
    },

    async updateIsCompleted(id:string,isCompleted: boolean) {
      this.loading = true
      this.error = null
      try {
        const response = await $fetch<UserInfo>('/api/user/updateIsCompleted', {
          method: 'PATCH',
          body: {id, isCompleted}
        })

        if(response) {
          this.updateUserData(response);
        }

        return response
      } catch (err: any) {
        this.error = err?.message || 'Erreur de mise à jour du profil'
        throw err
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
            this.invalidateUserCache()
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

        this.invalidateUserCache();
      } catch (error: any) {
        this.error = error?.message || 'Erreur lors de la mise à jour du mot de passe'
        throw error
      } finally {
        this.loading = false
      }
    },

    clearUserCache() {
      this.invalidateUserCache();
    }
  },
});
