import {defineStore} from 'pinia'
import {$fetch} from 'ofetch'
import type {User} from "~/common/interface/auth.interface";
import type {LoginPayload, LoginResponse} from "~/common/types/auth.type";
import {useCookie} from "#app/composables/cookie";
import { signInWithPopup ,sendEmailVerification} from "firebase/auth";



export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
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
        this.user = await $fetch<User>('/api/user/userCurrent')
      } catch (err) {
        await this.logout()
      }
    },

    async fetchUserGoogle(){
      const response = await fetch("/api/google/userCurrent");
      const data = await response.json();
      this.user = data.error ? null : data;
    },

    async loginWithGoogle() {
      this.loading = true
      this.error = null
      try {
        const { $firebase } = useNuxtApp();
        const result = await signInWithPopup($firebase.auth, $firebase.provider);
        const user = result.user;

        // Vérifie si l'utilisateur a déjà confirmé son email
        if (!user.emailVerified) {
          await sendEmailVerification(user); // Envoie l'e-mail de vérification
          alert("Un e-mail de vérification a été envoyé. Veuillez confirmer avant de continuer.");
          return;
        }

        console.log(user);

        // Récupère le token uniquement si l'e-mail est vérifié
        const idToken = await user.getIdToken();
        console.log(idToken);
  
        // await fetch("/api/auth/login", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ idToken }),
        // });
        //
        // await this.fetchUserGoogle();
      } catch (err) {
        this.error = "Erreur d'authentification Google"
        console.error(err)
      } finally {
        this.loading = false
      }
    }

  },
})
