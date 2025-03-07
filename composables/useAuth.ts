import { useAuthStore } from '~/stores/auth'
import { onMounted, computed } from 'vue'
import {useCookie} from "#app/composables/cookie";

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
        logout: authStore.logout
    }
}
