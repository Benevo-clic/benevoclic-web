import { useAuthStore } from '~/stores/auth/auth'
import { onMounted, computed } from 'vue'
import Login from '~/pages/auth/login.vue'

export const useAuth = () => {
    const authStore = useAuthStore()
    
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
        removeUser: authStore.removeUserAccount
    }
}
