import { useAuthStore } from '~/stores/auth/auth.store'
import { useUserStore } from '~/stores/user/user.store'

export function useAuth() {
  const authStore = useAuthStore()
  const userStore = useUserStore()

  return {
    // État d'authentification
    isAuthenticated: computed(() => useCookie("isConnected").value),
    userId: computed(() => authStore.userId),
    token: computed(() => authStore.getToken),
    
    // Données utilisateur
    user: computed(() => userStore.getUser),
    userRole: computed(() => userStore.getRole),
    fullName: computed(() => userStore.fullName),
    
    // États de chargement
    loading: computed(() => authStore.loading || userStore.loading),
    error: computed(() => authStore.error || userStore.error),
    
    // Actions d'authentification
    login: authStore.login,
    logout: authStore.logout,
    register: authStore.register,
    sendEmailVerification: authStore.sendEmailVerification,
    loginWithGoogle: authStore.loginWithGoogle,
    getPageRole: authStore.getPageRole,
    
    // Actions utilisateur
    fetchUser: userStore.fetchUser,
    updateIsCompleted: userStore.updateIsCompleted,
    uploadProfilePicture: userStore.uploadProfilePicture,
    removeUserAccount: userStore.removeUserAccount,
    updatePassword: userStore.updatePassword,
    refreshToken: authStore.refreshTokens,
  }
} 