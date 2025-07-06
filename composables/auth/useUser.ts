import { useUserStore } from '~/stores/user/user.store'
import { onMounted, computed, ref, watch } from 'vue'
import {useRegisterStore} from "~/stores/user/register.store";
import type {UserInfo} from "~/common/types/auth.type";

export const useUser = () => {
    const authStore = useUserStore()
    const registerStore = useRegisterStore()
    const hasInitialized = ref(false)
    const initializationError = ref<string | null>(null)

    // Fonction d'initialisation améliorée
    const initializeUser = async (): Promise<UserInfo | void> => {
        if (hasInitialized.value) return

        try {
            // Vérifier si l'utilisateur est connecté via le cookie
            const isConnected = useCookie('isConnected').value


            if (isConnected) {
                await authStore.fetchUser()
            }
            
            hasInitialized.value = true
            initializationError.value = null

            return authStore.getUser as UserInfo

        } catch (error: any) {
            initializationError.value = error?.message || 'Erreur lors de l\'initialisation'
            console.error('Erreur d\'initialisation:', error)
        }
    }

    // Initialisation au montage du composant
    onMounted(async () => {
        await initializeUser()
    })

    // Surveiller les changements d'état pour réagir automatiquement
    watch(() => authStore.error, (newError) => {
        if (newError) {
            console.error('Erreur du store utilisateur:', newError)
        }
    })

    // Fonction pour forcer un refresh des données utilisateur
    const refreshUserData = async () => {
        try {
            authStore.clearUserCache()
            return await authStore.fetchUser()
        } catch (error: any) {
            console.error('Erreur lors du refresh:', error)
            throw error
        }
    }

    return {
        // État réactif
        user: computed(() => authStore.getUser),
        isAuthenticated: computed(() => authStore.isAuthenticated),
        userRole: computed(() => authStore.getUserRule),
        error: computed(() => authStore.error || initializationError.value),
        isLoading: computed(() => authStore.loading),
        isFetching: computed(() => authStore.isFetching),
        isInitialized: computed(() => hasInitialized.value),
        
        // Méthodes
        fetchUser: authStore.fetchUser,
        getUserId: authStore.getUserId,
        login: authStore.login,
        logout: authStore.logout,
        loginWithGoogle: authStore.loginWithGoogle,
        updateIsCompleted: authStore.updateIsCompleted,
        getUserById: authStore.getUserById,
        removeUser: authStore.removeUserAccount,
        updateProfile: authStore.uploadProfilePicture,
        register: registerStore.registerWithEmailPassword,
        updatePassword: authStore.updatePassword,
        
        // Méthodes utilitaires
        refreshUser: refreshUserData,
        initializeUser,
        
        // Getters calculés utiles
        fullName: computed(() => authStore.fullName),
        isVerified: computed(() => authStore.getVerificationStatus),
        hasUserData: computed(() => Boolean(authStore.getUser)),
        isUserCacheValid: computed(() => authStore.isUserCacheValid),
        isUserDataFresh: computed(() => authStore.isUserDataFresh)
    }
}
