import type {RegisterEmailVerifiedResponse, RegisterPayload} from "~/common/types/register.type";

import {useCookie} from "#app/composables/cookie";
import {
    createUserWithEmailAndPassword,
    getAuth,
    sendEmailVerification,
    onIdTokenChanged,
} from "firebase/auth";

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
        isRegisted: () => !!useCookie('auth_token').value,
        getVerificationStatus: (state) => state.isVerified
    },
    actions: {
        async startEmailVerificationListener(payload: RegisterPayload) {
            const auth = getAuth();
            
            this.unsubscribe = onIdTokenChanged(auth, async (user) => {
                if (user) {
                    await user.reload();

                    if (user.emailVerified) {
                        this.$patch({ isVerified: true });

                        if (this.unsubscribe) {
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
        }
    }


})