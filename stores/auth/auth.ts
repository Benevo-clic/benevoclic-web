import {defineStore} from 'pinia'
import {$fetch} from 'ofetch'
import type {LoginPayload, LoginResponse, UserInfo} from "~/common/types/auth.type";
import {useCookie} from "#app/composables/cookie";
import {signInWithPopup} from "firebase/auth";
import type {User} from "firebase/auth";
import {RoleUser} from "~/common/enums/role.enum";


export async function loginWithGoogle(): Promise<User> {
  const {$firebase} = useNuxtApp();
  if (!$firebase.auth) throw new Error('Firebase non initialisé');

  const result = await signInWithPopup($firebase.auth, $firebase.provider!);

  return result.user;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as UserInfo | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !useCookie('isConnected').value,
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

        if(response.idToken) {
          await this.fetchUser()
            navigateTo('/dashboard')
        }
      } catch (err) {
        this.error = "Erreur d'authentification"
        throw new Error('Erreur d\'authentification'+err);
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
            navigateTo('/auth/login')
        }
      } catch (err) {
        this.error = "Erreur de déconnexion"
        throw new Error('Erreur de déconnexion'+err);
      } finally {
        this.loading = false
      }
    },

    async refreshTokens() {
      try {
        await $fetch('/api/auth/refresh', {
          method: 'POST',
        })
      } catch (error) {
        await this.logout()
      }
    },

    async fetchUser() {
      try {

          await this.refreshTokens()

        this.user = await $fetch<UserInfo>('/api/user/userCurrent')
      } catch (err) {
        await this.logout()
      }
    },

    async fetchUserGoogle(body: { idToken: string, refreshToken: string, uid: string }) {
      try {
        const response = await $fetch('/api/auth/google/updateStatusUser', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        if(!response) {
          this.error = "Erreur lors de la connexion"
          throw new Error('Réponse serveur vide');
        }
      } catch (error) {
        throw new Error('Erreur lors de la connexion'+error);
      }
    },

    async loginWithGoogle() {
      this.loading = true
      this.error = null
      try {

        const user = await loginWithGoogle(); // Connexion avec Google
        const idToken = await user.getIdToken();

        const payload = idToken.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));

        if(decodedPayload.role){
            await this.fetchUserGoogle({idToken, refreshToken: user.refreshToken, uid: user.uid});
            navigateTo('/dashboard')
        }else{
          await this.callRegisterGoogle(idToken);
          navigateTo('/registerVolunteer');
        }

      } catch (err) {
        this.error = "Erreur d'authentification Google"
        throw new Error('Erreur d\'authentification Google'+err);
      } finally {
        this.loading = false
      }
    },

    async callRegisterGoogle(idToken: string) {
      const response = await $fetch("/api/auth/google/registerGoogle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idToken,
          role: RoleUser.VOLUNTEER,
        }),
      });
      if (!response) {
        this.error = "Erreur lors de l'inscription";
        throw new Error('Réponse serveur vide');
      }
      return response;
    },

    async removeUserAccount(){
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
    }

  },
})
