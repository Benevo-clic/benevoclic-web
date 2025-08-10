import { getConfig } from '~/utils/config'

export default defineNuxtPlugin(() => {
  if (process.client) {
    const initFirebase = async () => {
      try {
        const { initializeApp } = await import('firebase/app')
        const { getAuth, GoogleAuthProvider, browserPopupRedirectResolver } = await import(
          'firebase/auth'
        )

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

        console.log(
          '🔍 Debug - Configuration Firebase via getConfig() (permissions):',
          firebaseConfig
        )

        if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
          console.log('❌ Configuration Firebase manquante ou invalide', firebaseConfig)
          throw new Error('Configuration Firebase manquante ou invalide')
        }

        const app = initializeApp(firebaseConfig)
        const auth = getAuth(app)
        const provider = new GoogleAuthProvider()

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
          // Par défaut, désactiver les services non essentiels
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

        // Retourner la configuration Firebase
        return {
          auth,
          provider,
          resolver: browserPopupRedirectResolver,
          analytics,
          analyticsEnabled: canUseAnalytics,
          thirdPartyEnabled: canUseThirdParty
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de Firebase avec permissions:", error)
        return null
      }
    }

    // Retourner le plugin avec une promesse
    return {
      provide: {
        firebase: initFirebase()
      }
    }
  }
})
