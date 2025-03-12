import type {RegisterEmailVerifiedResponse, RegisterPayload} from "~/common/types/register.type";

import {useCookie} from "#app/composables/cookie";
import {
    createUserWithEmailAndPassword,
    getAuth,
    sendEmailVerification,
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

                        switch (payload.role) {
                            case RoleUser.VOLUNTEER:
                                navigateTo('/registerVolunteer');
                                break;
                            case RoleUser.ASSOCIATION:
                                navigateTo('/registerAssociation');
                                break;
                            default:
                                break;

                        }
                        // Arrêter l'écoute une fois vérifié
                        if (this.unsubscribe) {
                            this.callRegisterEmailVerified({ email: payload.email, password: payload.password, role: RoleUser.VOLUNTEER });
                            this.unsubscribe();
                            this.unsubscribe = null;
                        }
                    }
                }
            });
        },
        async callRegisterEmailVerified(payload: any) {
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
                
                // Démarrer l'écoute des changements de vérification
                await this.startEmailVerificationListener({
                    email: payload.email,
                    password: payload.password,
                    role: RoleUser.VOLUNTEER
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