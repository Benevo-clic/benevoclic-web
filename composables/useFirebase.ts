import { getConfig } from '~/utils/config'

export const useFirebase = () => {
  let firebaseApp: any = null
  let firebaseAuth: any = null
  let firebaseProvider: any = null

  const initializeFirebase = async () => {
    if (firebaseApp) {
      return { app: firebaseApp, auth: firebaseAuth, provider: firebaseProvider }
    }

    try {
      const { initializeApp } = await import('firebase/app')
      const { getAuth, GoogleAuthProvider, browserPopupRedirectResolver } = await import(
        'firebase/auth'
      )

      // Utiliser getConfig() qui fonctionne côté client et serveur
      const config = getConfig()
      const firebaseConfig = {
        apiKey: config.firebase.apiKey,
        authDomain: config.firebase.authDomain,
        projectId: config.firebase.projectId,
        storageBucket: config.firebase.storageBucket,
        messagingSenderId: config.firebase.messagingSenderId,
        appId: config.firebase.appId,
        measurementId: config.firebase.measurementId
      }

      console.log('🔍 Debug - Configuration Firebase via composable:', firebaseConfig)

      if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
        console.log('❌ Configuration Firebase manquante ou invalide', firebaseConfig)
        throw new Error('Configuration Firebase manquante ou invalide')
      }

      firebaseApp = initializeApp(firebaseConfig)
      firebaseAuth = getAuth(firebaseApp)
      firebaseProvider = new GoogleAuthProvider()

      console.log('✅ Firebase initialisé via composable')

      return { app: firebaseApp, auth: firebaseAuth, provider: firebaseProvider }
    } catch (error) {
      console.error("❌ Erreur lors de l'initialisation de Firebase via composable:", error)
      throw error
    }
  }

  const initializeFirebaseWithPermissions = async () => {
    const { app, auth, provider } = await initializeFirebase()

    let canUseAnalytics = false
    let canUseThirdParty = false

    try {
      const { usePermissions } = await import('~/composables/usePermissions')
      const { hasPermission } = usePermissions()

      canUseAnalytics = hasPermission('canUseAnalytics')
      canUseThirdParty = hasPermission('canUseThirdParty')
    } catch (error) {
      console.warn(
        'Permissions non disponibles, utilisation des valeurs par défaut sécurisées:',
        error
      )
      canUseAnalytics = false
      canUseThirdParty = false
    }

    // Configurer Firebase Analytics seulement si autorisé
    let analytics = null
    if (canUseAnalytics) {
      try {
        const { getAnalytics, isSupported } = await import('firebase/analytics')
        const analyticsSupported = await isSupported()
        if (analyticsSupported) {
          analytics = getAnalytics(app)
          console.log('Firebase Analytics activé')
        }
      } catch (error) {
        console.warn('Firebase Analytics non disponible:', error)
      }
    } else {
      console.log('Firebase Analytics désactivé - cookies analytiques non acceptés')
    }

    return {
      app,
      auth,
      provider,
      analytics,
      analyticsEnabled: canUseAnalytics,
      thirdPartyEnabled: canUseThirdParty
    }
  }

  return {
    initializeFirebase,
    initializeFirebaseWithPermissions,
    getAuth: () => firebaseAuth,
    getProvider: () => firebaseProvider,
    getApp: () => firebaseApp
  }
}
