import {defineStore} from 'pinia'
import {$fetch} from 'ofetch'
import type {UserInfo} from "~/common/types/auth.type";
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword, getAuth, createUserWithEmailAndPassword, sendPasswordResetEmail
} from "firebase/auth";
import {useCookie, useNuxtApp} from '#app';
import type {RegisterEmailVerifiedResponse, RegisterPayload} from "~/common/types/register.type";
import {RoleUser} from "~/common/enums/role.enum";

async function getFirebase() {
    const {$firebase, $firebaseBase} = useNuxtApp();

    // Essayer d'abord le plugin Firebase avec permissions
    let firebase = null
    if ($firebase) {
        try {
            firebase = await $firebase
        } catch (error) {
            console.warn('Firebase avec permissions non disponible:', error)
        }
    }

    // Fallback vers Firebase de base si nécessaire
    if (!firebase && $firebaseBase) {
        try {
            firebase = await $firebaseBase
        } catch (error) {
            console.warn('Firebase de base non disponible:', error)
        }
    }

    if (!firebase || !firebase.auth) {
        throw new Error('Firebase non initialisé - veuillez réessayer dans quelques secondes')
    }

    return firebase
}


interface AdminState {
    user: UserInfo | null;
    loading: boolean;
    error: string | null;
    idToken: string | null;
    refreshToken: string | null;
    idUser: string | null;
    isConnected: boolean;
    // Cache pour éviter les appels API redondants
    _lastUserFetch: number;
    _userCacheExpiry: number;
    _isFetching: boolean;
    _lastUserUpdate: number; // Timestamp de la dernière mise à jour
}

export const useAdminStore = defineStore('admin', {
    state: (): AdminState => ({
        user: null,
        loading: false,
        error: null,
        idToken: null,
        refreshToken: null,
        idUser: null,
        isConnected: false,
        _lastUserFetch: 0,
        _userCacheExpiry: 2 * 60 * 1000, // 2 minutes
        _isFetching: false,
        _lastUserUpdate: 0,
    }),

    getters: {
        userId: (state) => state.user?.userId ?? null,
        getToken: (state) => state.idToken ?? null,
        getUser: (state) => state.user,
        getRole: (state) => state.user?.role ?? null,
        isFetching: (state) => state._isFetching,
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
        hydrate() {
            console.log('🔄 Hydratation des cookies de l\'admin store',useCookie('auth_token').value)
            this.idToken = useCookie('auth_token').value || null
            this.refreshToken = useCookie('refresh_token').value || null
            this.idUser = useCookie('id_user').value || null
            const isConnectedRaw = useCookie<any>('isConnected').value
            this.isConnected = isConnectedRaw === 'true' || isConnectedRaw === true
        },

        updateUserData(userData: UserInfo) {
            this.user = userData;
            this._lastUserUpdate = Date.now();
            this.error = null;
        },
        async goToPageAfterLoginAdmin() {
            try {
                await this.fetchUserAdmin()

                if (!this.user) {
                    this.error = 'Utilisateur non trouvé'
                    return
                }

                const isCompleted = this.user.isCompleted

                if (!isCompleted) {
                    return navigateTo('/admin/verification')
                } else {
                   return navigateTo('/admin/dashboard')
                }
            } catch (error: any) {
                console.error('Erreur lors de la récupération des données utilisateur:', error)
                this.error = error?.message || 'Erreur lors de la récupération des données utilisateur'
                throw error
            }
        },

        async login(payload: { email: string; password: string, role: RoleUser }) {
            this.loading = true
            this.error = null

            try {
                if (process.client) {
                    try {
                        const { usePermissions } = await import('~/composables/usePermissions')
                        const { hasPermission } = usePermissions()

                        if (!hasPermission('canAuthenticate')) {
                            this.error = 'Vous devez accepter les cookies essentiels pour vous connecter. Veuillez paramétrer vos préférences de cookies.'
                            throw new Error('Cookies essentiels non acceptés')
                        }
                    } catch (err) {
                        console.warn('Impossible de vérifier les permissions de cookies:', err)
                    }
                }

                console.log('🔐 Tentative de connexion admin pour:', payload.email)

                const response = await $fetch('/api/user/login', {
                    method: 'POST',
                    credentials: 'include',
                    body: {
                        email: payload.email,
                        password: payload.password,
                        role: RoleUser.ADMIN,
                    },
                })

                console.log('✅ Connexion réussie, réponse:', response)

                if(response){
                    this.idToken = response.idToken
                    if (process.client) {
                        const isConnectedCookie = useCookie<string>('isConnected')
                        isConnectedCookie.value = 'true'
                    }
                    this.isConnected = true
                    this.hydrate()
                }

                console.log('🔄 Redirection après connexion...')
                await this.goToPageAfterLoginAdmin()

                return response
            } catch (e: any) {
                console.error('❌ Erreur lors de la connexion admin:', e)
                this.error = e?.data?.message || e?.message || 'Erreur de connexion'
                throw e
            } finally {
                this.loading = false
            }
        },

        async checkAdminApprovalStatus() {
            this.loading = true;
            this.error = null;

            try {
                const response = await $fetch<{ approved: boolean }>('/api/admin/check-approval-status', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.approved) {
                    return true;
                } else {
                    return false;
                }
            } catch (error: any) {
                this.error = error?.message || 'Erreur lors de la vérification du statut d\'approbation';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async registerWithEmailPassword(payload: RegisterPayload) {
            const auth = getAuth();
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
                const user = userCredential.user;

                if (!user) {
                    throw new Error('Utilisateur non créé');
                }

                await this.callRegisterEmailVerified(payload);

            } catch (error: any) {
                this.error = error.message;
                throw new Error('Erreur lors de l\'inscription'+error);
            }
        },
        async callRegisterEmailVerified(payload: RegisterPayload) {
            try {
                await $fetch<RegisterEmailVerifiedResponse>(`/api/user/register-user-verified`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: {
                        email: payload.email,
                        role: RoleUser.ADMIN,
                        password: payload.password
                    }
                })

                navigateTo('/admin/verification');

            } catch (error) {
                this.error = "Une erreur est survenue lors de l'inscription"
                throw new Error('Erreur lors de l\'inscription'+error);
            }
        },


        async fetchUserAdmin() {
            if (this._isFetching) {
                console.log('🔄 fetchUserAdmin déjà en cours, retour utilisateur actuel')
                return this.user;
            }

            if (this.isUserCacheValid && this.user && !this.isUserDataFresh) {
                console.log('🔄 Utilisateur en cache valide, retour utilisateur actuel')
                return this.user;
            }

            this.loading = true;
            this._isFetching = true;
            try {
                this.error = null
                
                console.log('🔄 Récupération des données utilisateur...')

                if (this.idToken) {
                    try {
                        console.log('🔄 Tentative de rafraîchissement du token...')
                        await this.refreshTokens();
                        console.log('✅ Token rafraîchi avec succès')
                    } catch (error) {
                        console.warn('⚠️ Erreur lors du rafraîchissement du token, tentative de récupération utilisateur:', error);
                        // Continuer même si le refresh échoue
                    }
                } else {
                    console.log('ℹ️ Pas de token disponible, récupération directe des données utilisateur')
                }
                
                console.log('🔄 Appel API /api/user/current-user...')
                const userData = await $fetch<UserInfo>('/api/user/current-user', {
                    method: 'GET',
                    credentials: 'include',
                });

                console.log('✅ Données utilisateur reçues:', userData)

                if (!userData || !userData.userId) {
                    throw new Error('Données utilisateur invalides');
                }
                this.updateUserData(userData);
                this._lastUserFetch = Date.now();
                this.user = userData;

                return this.user;
            } catch (err: any) {
                console.error('❌ Erreur lors de la récupération utilisateur:', err)
                this.error = err?.message || 'Erreur de récupération utilisateur';
                throw err;
            } finally {
                this._isFetching = false;
                this.loading = false;
            }
        },
        async forgotAdminPassword(email: string) {
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

        // Récupère un utilisateur par ID
        async getUserById(id: string) {
            if(this.user?.userId === id && this.isUserCacheValid && this.user) {
                return this.user;
            }
            if (!id) {
                this.error = 'ID utilisateur manquant';
                throw new Error(this.error);
            }

            this.loading = true;
            this.error = null;
            try {
                const response = await $fetch<UserInfo>(`/api/user/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response) {
                    this.error = 'Utilisateur non trouvé';
                }

                return response;
            } catch (err: any) {
                this.error = err?.message || 'Erreur de récupération de l\'utilisateur';
                throw err;
            } finally {
                this.loading = false;
            }
        },


        async removeUserAdminAccount() {
            this.loading = true;
            this.error = null;
            
            // Vérifier si l'utilisateur est connecté avant de procéder
            if (!this.user || !this.user.userId) {
                this.error = 'Aucun utilisateur connecté';
                this.loading = false;
                throw new Error(this.error);
            }
            
            try {
                const response = await $fetch(`/api/user/${this.user.userId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });

                if (response.success) {
                    this.user = null;
                    this.invalidateUserCache();
                }
            } catch (err: any) {
                this.error = err?.message || 'Erreur de suppression du compte';
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async updateAdminPassword(payload: {oldPassword: string, newPassword: string}) {
            this.loading = true;
            this.error = null;
            try {
                const firebase = await getFirebase();
                if (!firebase.auth.currentUser) {
                    throw new Error('Utilisateur non connecté');
                }

                const credential = EmailAuthProvider.credential(
                    firebase.auth.currentUser.email!,
                    payload.oldPassword
                );

                await reauthenticateWithCredential(firebase.auth.currentUser, credential);
                await updatePassword(firebase.auth.currentUser, payload.newPassword);

                this.invalidateUserCache();
            } catch (error: any) {
                this.error = error?.message || 'Erreur lors de la mise à jour du mot de passe';
                throw error;
            } finally {
                this.loading = false;
            }
        },
        async deleteCookies() {
            try {
                await $fetch('/api/auth/deleteCookies', {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                })
                this.clearUserCache()
                window.location.href = '/'
            }catch (error) {
                console.error('Erreur lors de la suppression des cookies:', error)
            }
        },

        async refreshTokens() {
            try {
                this.error = null
                
                // Récupérer le refresh token depuis les cookies
                const refreshToken = useCookie('refresh_token').value
                
                if (!refreshToken) {
                    throw new Error('Refresh token non disponible')
                }
                
                const response = await $fetch('/api/user/refresh', {
                    method: 'POST',
                    credentials: 'include',
                    body: {
                        refreshToken: refreshToken
                    }
                })
                
                // Mettre à jour les tokens si la réponse en contient
                if (response.idToken) {
                    this.idToken = response.idToken
                }
                if (response.refreshToken) {
                    this.refreshToken = response.refreshToken
                }
                
            } catch (error: any) {
                console.warn('Erreur lors du rafraîchissement du token:', error)
                this.error = error?.message || 'Erreur de rafraîchissement du token'
                // Ne pas appeler logout ici, laisser l'appelant décider
                throw error
            }
        },

        async logoutAdmin() {
            this.loading = true
            this.error = null
            try {
                await $fetch('/api/user/logout', { 
                    method: 'POST',
                    credentials: 'include'
                })
                await this.deleteCookies()
            } catch (e: any) {
                console.warn('Erreur lors de la déconnexion:', e)
                this.error = e?.data?.message || 'Erreur de déconnexion'
                // Essayer de supprimer les cookies même si le logout échoue
                try {
                    await this.deleteCookies()
                } catch (deleteError) {
                    console.error('Erreur lors de la suppression des cookies:', deleteError)
                }
            } finally {
                this.loading = false
            }
        },

        clearUserCache() {
            this.invalidateUserCache();
        }
    },
});
