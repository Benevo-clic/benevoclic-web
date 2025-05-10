import { useUserStore } from '~/stores/user/user.store'
import { onMounted, computed } from 'vue'

export const useUser = () => {
    const authStore = useUserStore()
    
    onMounted(async () => {
        if (!authStore.isAuthenticated) {
            await authStore.fetchUser()
        }
    })

    return {
        user: computed(() => authStore.getUser),
        isAuthenticated: computed(() => authStore.isAuthenticated),
        login: authStore.login,
        logout: authStore.logout,
        error: computed(() => authStore.error),
        loginWithGoogle: authStore.loginWithGoogle,
        removeUser: authStore.removeUserAccount,
        updateProfile: authStore.uploadProfilePicture,
    }
}
