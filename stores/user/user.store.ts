import {defineStore} from 'pinia'
import {$fetch} from 'ofetch'
import type {UserInfo} from "~/common/types/auth.type";
import type {User} from "firebase/auth";
import {
  signInWithPopup,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "firebase/auth";
import { useNuxtApp } from '#app';
import {useAuthStore} from "~/stores/auth/auth.store";

// Fonction utilitaire pour obtenir Firebase de manière sécurisée
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

export async function loginWithGoogle(): Promise<User> {
  const firebase = await getFirebase()
  const result = await signInWithPopup(firebase.auth, firebase.provider!);
  return result.user;
}

interface UserState {
  user: UserInfo | null;
  loading: boolean;
  error: string | null;
  // Cache pour éviter les appels API redondants
  _lastUserFetch: number;
  _userCacheExpiry: number;
  _isFetching: boolean;
  _lastUserUpdate: number; // Timestamp de la dernière mise à jour
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    loading: false,
    error: null,
    _lastUserFetch: 0,
    _userCacheExpiry: 2 * 60 * 1000, // 2 minutes
    _isFetching: false,
    _lastUserUpdate: 0,
  }),

  getters: {
    userId: (state) => state.user?.userId ?? null,
    getUser: (state) => state.user,
    getRole: (state) => state.user?.role ?? null,
    fullName: (state) => state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
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

    updateUserData(userData: UserInfo) {
      this.user = userData;
      this._lastUserUpdate = Date.now();
      this.error = null;
    },

    async fetchUser() {
      if (this._isFetching) {
        return this.user;
      }

      if (this.isUserCacheValid && this.user && !this.isUserDataFresh) {
        return this.user;
      }

      this.loading = true;
      this._isFetching = true;
      try {
        this.error = null;
        const authStore = useAuthStore();
        await authStore.refreshTokens();
        const userData = await $fetch<UserInfo>('/api/user/current-user',{
            method: 'GET',
            credentials: 'include',
        });
        
        if (!userData || !userData.userId) {
          throw new Error('Données utilisateur invalides');
        }
        this.updateUserData(userData);
        this._lastUserFetch = Date.now();
        this.user = userData;

        return this.user;
      } catch (err: any) {
        this.error = err?.message || 'Erreur de récupération utilisateur';
        throw err;
      } finally {
        this._isFetching = false;
        this.loading = false;
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
        const response = await $fetch<UserInfo>(`/api/user/${id}`,{
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

    // Met à jour le statut isCompleted
    async updateIsCompleted(id: string, isCompleted: boolean) {
      this.loading = true;
      this.error = null;
      try {
        const response = await $fetch<UserInfo>(`/api/user/${id}/isCompleted/${isCompleted}`, {
          method: 'PATCH',
          credentials: 'include'
        });

        if (response) {
          this.updateUserData(response);
        }

        return response;
      } catch (err: any) {
        this.error = err?.message || 'Erreur de mise à jour du profil';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // Upload photo de profil
    async uploadProfilePicture(imageBase64: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch('/api/user/updateProfileUser', {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            imageBase64,
            id: this.user?.userId
          })
        });

        if (!response) {
          this.error = 'Erreur lors de l\'upload de l\'image';
          throw new Error(this.error);
        }

        this.invalidateUserCache();
      } catch (error: any) {
        this.error = error?.message || 'Erreur lors de l\'upload de l\'image';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateAvatar(file: File){
        this.loading = true;
        this.error = null;

        try {
          const firebase = await getFirebase()
          const user = firebase.auth.currentUser
          if (!user) {
            throw new Error('Utilisateur non connecté')
          }

          const formData = new FormData()
          formData.append('file', file)


          const response = await $fetch<UserInfo>(
              `/api/user/${user.uid}/update-avatar`,
              {
                method: 'PATCH',
                credentials: 'include',
                body: formData,

              }
          )

          if (response) {
            this.updateUserData(response)
          }
        } catch (error: any) {
            this.error = error?.message || 'Erreur lors de la mise à jour de l\'avatar';
            throw error;
        } finally {
            this.loading = false;
        }
    },

    async removeUserAccount() {
      this.loading = true;
      this.error = null;
      if (this.user === null || !this.user.userId) {
        this.error = 'Aucun utilisateur connecté';
        throw new Error(this.error);
      }
      try {
        const response = await $fetch(`/api/user/${this.user?.userId}`, {
          method: 'DELETE',
          credentials: 'include'
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

    // Met à jour le mot de passe (Firebase)
    async updatePassword(payload: {oldPassword: string, newPassword: string}) {
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

    clearUserCache() {
      this.invalidateUserCache();
    }
  },
});
