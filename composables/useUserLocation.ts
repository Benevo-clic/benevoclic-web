import { ref, readonly } from 'vue'

interface UserLocation {
  latitude: number
  longitude: number
  timestamp: number
  city?: string      // Récupéré via géocodage inverse
  address?: string   // Adresse complète
}

export const useUserLocation = () => {
  const userLocation = ref<UserLocation | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const permissionDenied = ref(false)

  // Clés pour le localStorage
  const LOCATION_KEY = 'user_location'
  const LOCATION_TIMESTAMP_KEY = 'user_location_timestamp'
  const LOCATION_EXPIRY_HOURS = 24 // Expire après 24h

  // Charger la position depuis le storage
  const loadLocationFromStorage = (): UserLocation | null => {
    if (typeof window === 'undefined') return null
    
    try {
      const storedLocation = localStorage.getItem(LOCATION_KEY)
      const storedTimestamp = localStorage.getItem(LOCATION_TIMESTAMP_KEY)
      
      if (!storedLocation || !storedTimestamp) return null
      
      const location: UserLocation = JSON.parse(storedLocation)
      const timestamp = parseInt(storedTimestamp)
      const now = Date.now()
      
      // Vérifier si la position n'a pas expiré (24h)
      if (now - timestamp > LOCATION_EXPIRY_HOURS * 60 * 1000) {
        localStorage.removeItem(LOCATION_KEY)
        localStorage.removeItem(LOCATION_TIMESTAMP_KEY)
        return null
      }
      
      return location
    } catch (err) {
      console.error('Erreur lors du chargement de la position:', err)
      return null
    }
  }

  // Sauvegarder la position dans le storage
  const saveLocationToStorage = (location: UserLocation) => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(LOCATION_KEY, JSON.stringify(location))
      localStorage.setItem(LOCATION_TIMESTAMP_KEY, Date.now().toString())
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de la position:', err)
    }
  }

  // Obtenir la position actuelle de l'utilisateur
  const getCurrentLocation = (): Promise<UserLocation> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('La géolocalisation n\'est pas supportée par ce navigateur'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: UserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: position.timestamp
          }
          resolve(location)
        },
        (err) => {
          let errorMessage = 'Erreur lors de la géolocalisation'
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = 'Permission de géolocalisation refusée'
              permissionDenied.value = true
              break
            case err.POSITION_UNAVAILABLE:
              errorMessage = 'Position indisponible'
              break
            case err.TIMEOUT:
              errorMessage = 'Timeout de géolocalisation'
              break
          }
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000 // Cache pendant 1 minute
        }
      )
    })
  }

  // Obtenir la position (depuis le cache ou GPS)
  const getUserLocation = async (forceRefresh = false): Promise<UserLocation | null> => {
    if (typeof window === 'undefined') return null
    
    // Vérifier les permissions de cookies côté client
    try {
      const { usePermissions } = await import('./usePermissions')
      const { hasPermission } = usePermissions()
      
      if (!hasPermission('canUseLocation')) {
        error.value = 'Vous devez accepter les cookies de personnalisation pour utiliser la géolocalisation'
        permissionDenied.value = true
        return null
      }
    } catch (err) {
      console.warn('Impossible de vérifier les permissions de cookies:', err)
    }

    isLoading.value = true
    error.value = null
    permissionDenied.value = false

    try {
      // Essayer de charger depuis le storage si pas de refresh forcé
      if (!forceRefresh) {
        const cachedLocation = loadLocationFromStorage()
        if (cachedLocation) {
          userLocation.value = cachedLocation
          isLoading.value = false
          return cachedLocation
        }
      }

      // Obtenir la position GPS
      const location = await getCurrentLocation()
      
      // Optionnel : Récupérer l'adresse via API de géocodage inverse
      try {
        const response = await fetch(
          `https://api-adresse.data.gouv.fr/reverse/?lon=${location.longitude}&lat=${location.latitude}`
        )
        const data = await response.json()
        
        if (data.features && data.features.length > 0) {
          const feature = data.features[0]
          location.city = feature.properties.city
          location.address = feature.properties.label
        }
      } catch (geocodeError) {
        console.warn('Erreur lors du géocodage inverse:', geocodeError)
      }

      // Sauvegarder dans le storage
      saveLocationToStorage(location)
      userLocation.value = location
      
      return location
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur inconnue'
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Effacer la position stockée
  const clearStoredLocation = () => {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem(LOCATION_KEY)
    localStorage.removeItem(LOCATION_TIMESTAMP_KEY)
    userLocation.value = null
  }

  // Vérifier si la géolocalisation est autorisée
  const isLocationAllowed = async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false
    
    try {
      const { usePermissions } = await import('./usePermissions')
      const { hasPermission } = usePermissions()
      return hasPermission('canUseLocation') && !permissionDenied.value
    } catch (err) {
      console.warn('Impossible de vérifier les permissions de géolocalisation:', err)
      return false
    }
  }

  // Demander les permissions de géolocalisation
  const requestLocationPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false
    
    try {
      const { usePermissions } = await import('./usePermissions')
      const { hasPermission } = usePermissions()
      
      if (!hasPermission('canUseLocation')) {
        error.value = 'Vous devez d\'abord accepter les cookies de personnalisation'
        return false
      }

      await getUserLocation(true)
      return true
    } catch (err) {
      return false
    }
  }

  // Initialiser la position (à appeler depuis un composant)
  const initializeLocation = async () => {
    if (typeof window === 'undefined') return
    
    try {
      const { usePermissions } = await import('./usePermissions')
      const { hasPermission } = usePermissions()
      
      if (hasPermission('canUseLocation')) {
        const cachedLocation = loadLocationFromStorage()
        if (cachedLocation) {
          userLocation.value = cachedLocation
        }
      }
    } catch (err) {
      console.warn('Impossible de vérifier les permissions au montage:', err)
    }
  }

  return {
    userLocation: readonly(userLocation),
    isLoading: readonly(isLoading),
    error: readonly(error),
    permissionDenied: readonly(permissionDenied),
    isClient: readonly(ref(typeof window !== 'undefined')),
    getUserLocation,
    clearStoredLocation,
    loadLocationFromStorage,
    isLocationAllowed,
    requestLocationPermission,
    initializeLocation
  }
} 