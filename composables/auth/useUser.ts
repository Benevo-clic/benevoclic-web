import { useUserStore } from '~/stores/user/user.store'
import { onMounted, computed } from 'vue'
import {useRegisterStore} from "~/stores/user/register";

export const useUser = () => {
    const authStore = useUserStore()
    const registerStore = useRegisterStore()
    
    onMounted(async () => {
        if (!authStore.isAuthenticated) {
            await authStore.fetchUser()
        }
    })

    return {
        user: computed(() => authStore.getUser),
        fetchUser:  authStore.fetchUser,
        isAuthenticated: computed(() => authStore.isAuthenticated),
        login: authStore.login,
        logout: authStore.logout,
        userRole: computed(() => authStore.getUserRule),
        error: computed(() => authStore.error),
        loginWithGoogle: authStore.loginWithGoogle,
        removeUser: authStore.removeUserAccount,
        updateProfile: authStore.uploadProfilePicture,
        register: registerStore.registerWithEmailPassword
    }
}
