import { useAuthStore } from '~/stores/auth/auth.store'
import { useUserStore } from '~/stores/user/user.store'

export default defineNuxtPlugin(async () => {
  const auth = useAuthStore()
  const userStore = useUserStore()

  // Initialiser l'authentification
  await auth.initAuth()

  // Protection : n'appelle fetchUser que si authentifié, pas d'erreur, et pas déjà chargé
  if (auth.isAuthenticated && !userStore.user && !userStore.error) {
    try {
      await userStore.fetchUser()
      console.log('✅ Utilisateur initialisé:', userStore.getUser)
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de l\'utilisateur:', error)
      // Si erreur, déconnecter l'utilisateur
      await auth.logout()
    }
  }


  // Exposer les stores globalement (optionnel)
  return {
    provide: {
      auth,
      userStore
    }
  }
}) 