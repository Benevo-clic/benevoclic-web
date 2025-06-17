import {defineStore} from 'pinia'
import {$fetch} from 'ofetch'
import type {LoginPayload, LoginResponse, UserInfo} from "~/common/types/auth.type";
import {useCookie} from "#app/composables/cookie";
import type {User} from "firebase/auth";
import {
  signInWithPopup
} from "firebase/auth";
import {RoleUser} from "~/common/enums/role.enum";



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
}

export const useUserStore = defineStore('auth', {
  state: (): UserState => ({
    user: null,
    loading: false,
    error: null,
    isVerified: false
  }),

  getters: {
    isAuthenticated: () => !useCookie('isConnected').value,
    getUser: (state) => state.user,
    fullName: (state) => state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
    getVerificationStatus: (state) => state.isVerified,
    getUserRule: (state) => state.user?.role,
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


        if(response.idToken) {
          await this.fetchUser()
            navigateTo('/dashboard')
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
      try {
        this.error = null

          await this.refreshTokens()

        this.user = await $fetch<UserInfo>('/api/user/userCurrent')
      } catch (err: any) {
        this.error = err?.message || 'Erreur de récupération utilisateur'
        await this.logout()
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
            navigateTo('/dashboard')
        }else{
          await this.callRegisterGoogle(idToken,role)
          if(role === 'VOLUNTEER'){
            navigateTo(
                {
                  path: '/auth/registerVolunteer',
                }
            )
          }else {
            navigateTo(
                {
                  path: '/auth/registerAssociation',
                })
          }
        }

      } catch (err: any) {
        this.error = err?.message || 'Erreur d\'authentification Google'
        throw err
      } finally {
        this.loading = false
      }
    },

    async callRegisterGoogle(idToken: string, role: RoleUser) {
      try {
        this.error = null
        const response = await $fetch("/api/auth/google/registerGoogle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            idToken,
            role: role,
          }),
        });
        if (!response) {
          this.error = 'Réponse serveur vide'
          throw new Error(this.error)
        }
        return response;
      } catch (error: any) {
        this.error = error?.message || 'Erreur lors de l\'inscription Google'
        throw error
      }

    },

    async removeUserAccount(){

      try {
        this.error = null
        await $fetch("/api/auth/remove",{
          method:'DELETE',
          headers: {
            "Content-Type": "application/json"
          },
          body: {
            uid:this.user?.userId
          }
        })

        navigateTo('/')
      } catch (error: any) {
        this.error = error?.message || 'Erreur lors de la suppression du compte'
        throw error
      }
    }
  },
})
