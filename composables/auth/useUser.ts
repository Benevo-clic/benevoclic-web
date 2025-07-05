import { useUserStore } from '~/stores/user/user.store'
import { onMounted, computed, ref } from 'vue'
import {useRegisterStore} from "~/stores/user/register.store";

export const useUser = () => {
    const authStore = useUserStore()
    const registerStore = useRegisterStore()
    const hasInitialized = ref(false)

    onMounted(async () => {
        if (hasInitialized.value) return
        
        if (!authStore.isAuthenticated) {
            await authStore.fetchUser()
        }
        hasInitialized.value = true
    })

    return {
        user: computed(() => authStore.getUser),
        fetchUser: authStore.fetchUser,
        getUserId: authStore.getUserId,
        isAuthenticated: computed(() => authStore.isAuthenticated),
        login: authStore.login,
        logout: authStore.logout,
        userRole: computed(() => authStore.getUserRule),
        error: computed(() => authStore.error),
        loginWithGoogle: authStore.loginWithGoogle,
        updateIsCompleted: authStore.updateIsCompleted,
        getUserById: authStore.getUserById,
        removeUser: authStore.removeUserAccount,
        updateProfile: authStore.uploadProfilePicture,
        register: registerStore.registerWithEmailPassword,
        _isFetching: computed(() => authStore.isFetching),
        updatePassword: authStore.updatePassword,
        refreshUser: async () => {
            authStore.clearUserCache()
            return await authStore.fetchUser()
        }
    }
}
