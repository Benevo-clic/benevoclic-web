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
        console.error(err)
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
            navigateTo('/login')
        }
      } catch (err) {
        this.error = "Erreur de déconnexion"
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      try {
        this.user = await $fetch<UserInfo>('/api/user/userCurrent')
      } catch (err) {
        await this.logout()
      }
    },

    async fetchUserGoogle(body: { idToken: string, refreshToken: string, uid: string }) {
      try {
        const response = await $fetch('/api/auth/google/loginGoogle', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        const data = await response;

        if (response.message) {
          console.log('Cookies définis avec succès');
        } else {
          console.error('Erreur lors de la définition des cookies:', data.error);
        }
      } catch (error) {
        console.error('Erreur de réseau:', error);
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
          console.log('decodedPayload 2', decodedPayload)

          navigateTo('/registerVolunteer');
        }

      } catch (err) {
        this.error = "Erreur d'authentification Google"
        console.error(err)
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
        throw new Error('Réponse serveur vide');
      }
      return response;
    }

  },
})
