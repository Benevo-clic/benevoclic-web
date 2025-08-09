export default defineNuxtPlugin(async () => {
  // Ce plugin s'exécute uniquement côté client
  if (process.client) {
    // Importer le composable de permissions
    const { usePermissions } = await import('~/composables/usePermissions')
    const { hasPermission } = usePermissions()

    // Écouter les changements de permissions pour informer l'application
    window.addEventListener('cookiePreferencesUpdated', (event: any) => {
      const preferences = event.detail

      // Émettre des événements spécifiques selon les permissions
      if (!preferences.essential) {
        window.dispatchEvent(
          new CustomEvent('permissionDenied', {
            detail: {
              type: 'error',
              permission: 'canAuthenticate',
              message: 'Cookies essentiels refusés'
            }
          })
        )
      }

      if (!preferences.personalization) {
        window.dispatchEvent(
          new CustomEvent('permissionDenied', {
            detail: {
              type: 'warning',
              permission: 'canUseLocation',
              message: 'Géolocalisation désactivée'
            }
          })
        )
      }

      if (!preferences.analytics) {
        window.dispatchEvent(
          new CustomEvent('permissionDenied', {
            detail: {
              type: 'info',
              permission: 'canUseAnalytics',
              message: 'Analytics désactivés'
            }
          })
        )
      }
    })

    // Intercepter les tentatives d'utilisation de la géolocalisation
    const originalGetCurrentPosition =
      navigator.geolocation?.getCurrentPosition
    if (originalGetCurrentPosition) {
      navigator.geolocation.getCurrentPosition = function (
        successCallback,
        errorCallback,
        options
      ) {
        if (!hasPermission('canUseLocation')) {
          // Émettre un événement pour informer l'utilisateur
          window.dispatchEvent(
            new CustomEvent('permissionDenied', {
              detail: {
                type: 'warning',
                permission: 'canUseLocation',
                message:
                  'Géolocalisation bloquée - cookies de personnalisation requis'
              }
            })
          )

          // Appeler le callback d'erreur avec une erreur de permission
          if (errorCallback) {
            errorCallback({
              code: 1, // PERMISSION_DENIED
              message:
                'Permission de géolocalisation refusée - cookies de personnalisation requis'
            } as GeolocationPositionError)
          }
          return
        }

        // Si les permissions sont accordées, utiliser la fonction originale
        return originalGetCurrentPosition.call(
          this,
          successCallback,
          errorCallback,
          options
        )
      }
    }

    // Intercepter les tentatives d'accès au localStorage pour les données personnelles
    const originalSetItem = localStorage.setItem
    localStorage.setItem = function (key: string, value: string) {
      // Vérifier si la clé concerne des données personnelles
      const personalDataKeys = [
        'user_location',
        'user_preferences',
        'user_profile'
      ]
      if (
        personalDataKeys.some(k => key.includes(k)) &&
        !hasPermission('canUsePersonalData')
      ) {
        console.warn(
          "Tentative d'accès aux données personnelles bloquée - cookies de personnalisation requis"
        )
        return
      }

      return originalSetItem.call(this, key, value)
    }

    // Intercepter les tentatives d'accès au localStorage pour les données personnelles (lecture)
    const originalGetItem = localStorage.getItem
    localStorage.getItem = function (key: string) {
      // Vérifier si la clé concerne des données personnelles
      const personalDataKeys = [
        'user_location',
        'user_preferences',
        'user_profile'
      ]
      if (
        personalDataKeys.some(k => key.includes(k)) &&
        !hasPermission('canUsePersonalData')
      ) {
        console.warn(
          'Tentative de lecture des données personnelles bloquée - cookies de personnalisation requis'
        )
        return null
      }

      return originalGetItem.call(this, key)
    }

    console.log('Plugin de permissions initialisé')
  }
})
