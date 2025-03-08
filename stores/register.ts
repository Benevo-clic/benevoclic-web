import type {RegisterEmailVerifiedResponse, RegisterPayload} from "~/common/types/register.type";

import type { RegisterDone } from "~/common/interface/register.interface";
import {useAuthStore} from "~/stores/auth";
import {useCookie} from "#app/composables/cookie";
import {
    createUserWithEmailAndPassword,
    getAuth,
    sendEmailVerification,
    onAuthStateChanged,
    onIdTokenChanged,
} from "firebase/auth";
import {RoleUser} from "~/common/enums/role.enum";

interface RegisterState {
    loading: boolean;
    idUser: string | null;
    isVerified: boolean;
    error: string | null;
    unsubscribe: (() => void) | null;
}

export const useRegisterStore = defineStore('register', {

    state: (): RegisterState => ({
        loading: false,
        idUser: null,
        isVerified: false,
        error: null,
        unsubscribe: null
    }),
    getters:{
        getIdUser: (state)  => state.idUser,
        isRegisted: (state) => !!useCookie('auth_token').value,
        getVerificationStatus: (state) => state.isVerified
    },
    actions: {
        // Nouvelle méthode pour observer les changements de token
        async startEmailVerificationListener(payload: RegisterPayload) {
            const auth = getAuth();


            
            this.unsubscribe = onIdTokenChanged(auth, async (user) => {
                if (user) {
                    await user.reload();

                    if (user.emailVerified) {
                        this.$patch({ isVerified: true });

                        console.log('Email vérifié:', user.refreshToken);

                        // Rediriger vers la page d'inscription volontaire
                        navigateTo('/registerVolunteer');
                        
                        // Arrêter l'écoute une fois vérifié
                        if (this.unsubscribe) {
                            this.callRegisterEmailVerified({ email: payload.email, password: payload.password });
                            this.unsubscribe();
                            this.unsubscribe = null;
                        }
                    }
                }
            });
        },
        async callRegisterEmailVerified(payload: any) {
            try {
                const response: RegisterEmailVerifiedResponse = await $fetch<RegisterEmailVerifiedResponse>(`/api/auth/registerEmailVerified`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'

                    },
                    body: {
                        email: payload.email,
                        role: RoleUser.VOLUNTEER,
                        password: payload.password
                    }
                })
                console.log('Réponse de l\'inscription:', response);
            } catch (error) {
                this.error = "Une erreur est survenue lors de l'inscription"
                throw error;
            }
        },
        async registerWithEmailPassword(payload: RegisterPayload) {
            const auth = getAuth();
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
                await sendEmailVerification(userCredential.user);
                
                // Démarrer l'écoute des changements de vérification
                await this.startEmailVerificationListener(payload);
                
            } catch (error: any) {
                this.error = error.message;
                throw error;
            }
        },

        async register() {
            this.error = null
            this.loading = true

            try {
                const response: RegisterDone = await $fetch<RegisterDone>(`api/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        isVerified: this.isVerified
                    })
                })

                this.idUser = response.registerResponse.uid
                navigateTo('/registerVolunteer')
            } catch (error) {
                this.error = "Une erreur est survenue lors de l'inscription"
                throw error;
            } finally {
                this.loading = false
            }
        },

        // Nettoyage lors de la destruction du store
        cleanup() {
            if (this.unsubscribe) {
                this.unsubscribe();
                this.unsubscribe = null;
            }
        }
    }


})