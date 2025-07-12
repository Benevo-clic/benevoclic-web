import { defineStore } from 'pinia'
import {useCookie} from '#app'
import { RoleUser } from '~/common/enums/role.enum'
import { loginWithGoogle as firebaseLoginWithGoogle } from '~/stores/user/user.store'
import { useUserStore } from '~/stores/user/user.store'
import type {RegisterEmailVerifiedResponse, RegisterPayload} from "~/common/types/register.type";
import {createUserWithEmailAndPassword, getAuth, onIdTokenChanged, sendEmailVerification, sendPasswordResetEmail} from "firebase/auth";
import {$fetch} from "ofetch";
import { encodePasswordBase64 } from "~/utils/crypto"

interface AuthState {
  idToken: string | null
  refreshToken: string | null
  idUser: string | null
  isConnected: boolean
  email: string
  loading: boolean
  error: string | null
  unsubscribe: (() => void) | null;
  isVerified: boolean;
  tempPassword: string;
  role: RoleUser | null;

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
    role: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.idToken && state.isConnected,
    userId: (state) => state.idUser,
    getToken: (state) => state.idToken,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    getRole: (state) => state.role,
    getIsVerified: (state) => state.isVerified,
    getEmail: (state) => state.email,
    getTempPassword: (state) => state.tempPassword,
    getVerificationStatus: (state) => state.isVerified
  },

  actions: {
    hydrate() {
      this.idToken = useCookie('auth_token').value || null
      this.refreshToken = useCookie('refresh_token').value || null
      this.idUser = useCookie('id_user').value || null
      this.isConnected = Boolean(useCookie('isConnected').value)
    },

    async login(payload: { email: string; password: string, role: RoleUser }) {
      this.loading = true
      this.error = null
      try {

        const encodedPassword = encodePasswordBase64(payload.password)
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: {
            email: payload.email,
            password: encodedPassword,
            role: payload.role,
          },
        })

        this.hydrate()
        await this.goToPageAfterLogin(
            { role: payload.role, password: payload.password , email: payload.email }
        )
        return response
      } catch (e: any) {
        this.error = e?.data?.message || 'Erreur de connexion'
        throw e
      } finally {
        this.loading = false
      }
    },

    async goToPageAfterLogin(payload: { role: RoleUser; password: string, email: string }) {
      const auth = getAuth();
      const userStore = useUserStore()
      if (!auth.currentUser) {
        throw new Error('Aucun utilisateur connecté pour envoyer la vérification par email.');
      }

      if (!auth.currentUser?.emailVerified) {
        const tempPwdCookie = useCookie<string>('tempPassword')
        const roleCookie   = useCookie<string>('userRole')
        const emailCookie = useCookie<string>('email')
        tempPwdCookie.value = encodePasswordBase64(payload.password)
        roleCookie.value    = payload.role
        emailCookie.value   = payload.email

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

    // Redirection selon le rôle
    async getPageRole() {

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
        const encodedPassword = encodePasswordBase64(payload.password)
        await $fetch('/api/auth/registerEmailVerified', {
          method: 'POST',
          body: {
            email: payload.email,
            password: encodedPassword,
            role: payload.role,
          },
        })
        await this.refreshTokens()
      } catch (e: any) {
        this.error = e?.data?.message || 'Erreur d\'inscription'
        throw e
      } finally {
        this.loading = false
      }
    },

    async sendEmailVerification(payload: { role: RoleUser , tempPassword: string }) {
      const auth = getAuth();

      if (!auth.currentUser) {
        throw new Error('Aucun utilisateur connecté pour envoyer la vérification par email.');
      }

      if (auth.currentUser.emailVerified) {
        console.warn('L\'email est déjà vérifié pour l\'utilisateur actuel.');
      }

      if(!this.tempPassword) {
        await this.deleteCookies()
        throw new Error('Aucun mot de passe temporaire trouvé pour l\'envoi de la vérification par email.');
      }
      
      this.loading = true;
      this.error = null;
      
      try {


        await sendEmailVerification(auth.currentUser);
        this.$patch({ isVerified: false });


        await this.startEmailVerificationListener({
          email: auth.currentUser.email || '',
          password: this.tempPassword as string || payload.tempPassword,
          role: this.role as RoleUser || payload.role,
        });

        console.log('✅ Email de vérification envoyé avec succès');
        
      } catch (error: any) {
        console.error('❌ Erreur lors de l\'envoi de la vérification:', error);
        this.error = error.message;
        throw new Error('Erreur lors de l\'envoi de la vérification par email: ' + error.message);
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


            if (this.unsubscribe) {
              const tempPwdCookie = useCookie<string>('tempPassword')
              const roleCookie   = useCookie<string>('userRole')
              const emailCookie  = useCookie<string>('email')
              tempPwdCookie.value = encodePasswordBase64(payload.password)
              roleCookie.value    = payload.role
              emailCookie.value   = payload.email
              this.isVerified = true
              this.callRegisterEmailVerified({ email: payload.email, password: payload.password, role: payload.role });
              this.unsubscribe();
              this.unsubscribe = null;
            }
          }
        }
      });
    },
    async callRegisterEmailVerified(payload: RegisterPayload) {
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

        if(payload.role === 'VOLUNTEER'){
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

      } catch (error) {
        this.error = "Une erreur est survenue lors de l'inscription"
        throw new Error('Erreur lors de l\'inscription'+error);
      }
    },
    async registerWithEmailPassword(payload: RegisterPayload) {
      const auth = getAuth();
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
      }
    },

    // Nettoyage lors de la destruction du store
    cleanup() {
      if (this.unsubscribe) {
        this.unsubscribe();
        this.unsubscribe = null;
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

    async deleteCookies() {
      try {
        await $fetch('/api/auth/deleteCookies', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
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
        navigateTo(
            '/auth/login',
        )
      }catch (error) {

      }
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
      this.resetCookies()
      
      // Nettoyer les données utilisateur
      const userStore = useUserStore()
      userStore.user = null
      userStore.clearUserCache()
      
      this.loading = false

      navigateTo(
            '/auth/login',
      )
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
     resetCookies() {
      const tempPwdCookie = useCookie<string>('tempPassword')
      const roleCookie   = useCookie<string>('userRole')
      const emailCookie  = useCookie<string>('email')

      if (tempPwdCookie.value) {
        tempPwdCookie.value = '';
      }
      if (roleCookie.value) {
        roleCookie.value = '';
      }
      if (emailCookie.value) {
        emailCookie.value = '';
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