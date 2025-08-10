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

      // Configuration Firebase directe (sans dépendre des variables d'environnement)
      const firebaseConfig = {
        apiKey: 'AIzaSyAGAry8cF7Ma1aZxhTXvK5dMjjNFZdgKew',
        authDomain: 'benevoclic-85ddc.firebaseapp.com',
        projectId: 'benevoclic-85ddc',
        storageBucket: 'benevoclic-85ddc.firebasestorage.app',
        messagingSenderId: '538379400989',
        appId: '1:538379400989:web:980ce02f88b4512ba993f4',
        measurementId: 'G-F7YS4B0QZ8'
      }

      console.log('🔍 Debug - Configuration Firebase directe:', firebaseConfig)

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
