import { useAuthStore } from '~/stores/auth'
import { onMounted, computed } from 'vue'
import Login from '~/pages/login.vue'

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
        loginWithGoogle: authStore.loginWithGoogle,
        removeUser: authStore.removeUserAccount
    }
}
