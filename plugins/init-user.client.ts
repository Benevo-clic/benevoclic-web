import { useAuthStore } from '~/stores/auth/auth.store'
import { useUserStore } from '~/stores/user/user.store'

export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()
  const userStore = useUserStore()

  await auth.initAuth()

  if (auth.isAuthenticated && !userStore.user && !userStore.error) {
    try {
      await userStore.fetchUser()
      console.log('✅ Utilisateur initialisé:', userStore.getUser)
    } catch (error) {
      console.error(
        "❌ Erreur lors de l'initialisation de l'utilisateur:",
        error
      )
      await auth.logout()
    }
  }

  return {
    provide: {
      auth,
      userStore,
    },
  }
})
