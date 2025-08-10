import { useFirebase } from './useFirebase'

export const useAuth = () => {
  const { initializeFirebase, getAuth, getProvider } = useFirebase()
  const user = ref(null)
  const loading = ref(false)

  const initAuth = async () => {
    try {
      loading.value = true
      await initializeFirebase()

      const auth = getAuth()
      const provider = getProvider()

      // Écouter les changements d'état d'authentification
      auth.onAuthStateChanged((firebaseUser: any) => {
        user.value = firebaseUser
        console.log("👤 État d'authentification changé:", firebaseUser ? 'Connecté' : 'Déconnecté')
      })

      return { auth, provider }
    } catch (error) {
      console.error("❌ Erreur lors de l'initialisation de l'authentification:", error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const signInWithGoogle = async () => {
    try {
      const { auth, provider } = await initAuth()
      const result = await auth.signInWithPopup(provider)
      console.log('✅ Connexion Google réussie:', result.user.email)
      return result
    } catch (error) {
      console.error('❌ Erreur lors de la connexion Google:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const auth = getAuth()
      await auth.signOut()
      console.log('✅ Déconnexion réussie')
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error)
      throw error
    }
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    initAuth,
    signInWithGoogle,
    signOut
  }
}
