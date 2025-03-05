import { useAuthStore } from '~/stores/auth'
import { onMounted, computed } from 'vue'

export const useAuth = () => {
    const authStore = useAuthStore()
    
    onMounted(async () => {
        if (authStore.isAuthenticated && !authStore.getUser) {
            await authStore.fetchUser()
        }
    })

    return {
        user: computed(() => authStore.getUser),
        isAuthenticated: computed(() => authStore.isAuthenticated),
        login: authStore.login,
        logout: authStore.logout
    }
}
