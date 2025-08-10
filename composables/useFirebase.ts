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

      // Configuration Firebase via variables d'environnement
      let firebaseConfig

      if (process.client) {
        // Côté client, utiliser useRuntimeConfig
        const runtimeConfig = useRuntimeConfig()
        firebaseConfig = {
          apiKey: runtimeConfig.public.firebaseConfig.apiKey,
          authDomain: runtimeConfig.public.firebaseConfig.authDomain,
          projectId: runtimeConfig.public.firebaseConfig.projectId,
          storageBucket: runtimeConfig.public.firebaseConfig.storageBucket,
          messagingSenderId: runtimeConfig.public.firebaseConfig.messagingSenderId,
          appId: runtimeConfig.public.firebaseConfig.appId,
          measurementId: runtimeConfig.public.firebaseConfig.measurementId
        }
        console.log('🔍 Debug - Configuration Firebase via useRuntimeConfig')
      } else {
        console.log('🔍 Debug - Configuration Firebase via process.env')

        firebaseConfig = {
          apiKey: process.env.FIREBASE_API_KEY,
          authDomain: process.env.FIREBASE_AUTH_DOMAIN,
          projectId: process.env.FIREBASE_PROJECT_ID,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.FIREBASE_APP_ID,
          measurementId: process.env.FIREBASE_MEASUREMENT_ID || 'G-F7YS4B0QZ8'
        }
      }

      console.log('🔍 Debug - Configuration Firebase directe:', firebaseConfig)

      firebaseApp = initializeApp(firebaseConfig)
      firebaseAuth = getAuth(firebaseApp)
      firebaseProvider = new GoogleAuthProvider()

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
