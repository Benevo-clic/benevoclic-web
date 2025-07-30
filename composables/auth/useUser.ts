import { useAuthStore } from '~/stores/auth/auth.store'
import { useUserStore } from '~/stores/user/user.store'
import { onMounted, computed, ref } from 'vue'
import type { UserInfo } from "~/common/types/auth.type"

export const useUser = () => {
    const authStore = useAuthStore()
    const userStore = useUserStore()
    const hasInitialized = ref(false)
    const initializationError = ref<string | null>(null)

    // Fonction d'initialisation améliorée
    const initializeUser = async (): Promise<UserInfo | void> => {
        if (hasInitialized.value) return

        // Protection : n'appelle fetchUser que si authentifié
        if (!useCookie("isConnected").value) return

        try {
            await userStore.fetchUser()
            hasInitialized.value = true
            initializationError.value = null
            return userStore.getUser as UserInfo
        } catch (error: any) {
            initializationError.value = error?.message || 'Erreur lors de l\'initialisation'
            console.error('Erreur d\'initialisation:', error)
        }
    }

    // Initialisation au montage du composant
    onMounted(async () => {
        await initializeUser()
    })

    const refreshUserData = async () => {
        try {
            userStore.clearUserCache()
            return await userStore.fetchUser()
        } catch (error: any) {
            console.error('Erreur lors du refresh:', error)
            throw error
        }
    }

    return {
        // État réactif
        user: computed(() => userStore.getUser),
        isAuthenticated: computed(() => useCookie("isConnected").value),
        userRole: computed(() => userStore.getRole),
        error: computed(() => userStore.error || initializationError.value),
        isLoading: computed(() => userStore.loading),
        isFetching: computed(() => userStore.isFetching),
        isInitialized: computed(() => hasInitialized.value),
        isVerified: computed(() => authStore.getIsVerified),
        getTempPassword: computed(() => authStore.getTempPassword),
        getRole: computed(() => userStore.getRole),


        
        // Méthodes
        fetchUser: userStore.fetchUser,
        getUserId: userStore.userId,
        login: authStore.login,
        sendEmailVerification: authStore.sendEmailVerification,
        forgotPassword: authStore.forgotPassword,
        logout: authStore.logout,
        loginWithGoogle: authStore.loginWithGoogle,
        updateIsCompleted: userStore.updateIsCompleted,
        getUserById: userStore.getUserById,
        removeUser: userStore.removeUserAccount,
        updateProfile: userStore.uploadProfilePicture,
        updateAvatar: userStore.updateAvatar,
        register: authStore.registerWithEmailPassword,
        updatePassword: userStore.updatePassword,
        
        // Méthodes utilitaires
        refreshUser: refreshUserData,
        initializeUser,
        
        // Getters calculés utiles
        fullName: computed(() => userStore.fullName),
        hasUserData: computed(() => Boolean(userStore.getUser)),
        isUserCacheValid: computed(() => userStore.isUserCacheValid),
        isUserDataFresh: computed(() => userStore.isUserDataFresh)
    }
}
