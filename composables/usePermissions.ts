import { ref, computed } from 'vue'

export interface CookiePreferences {
  essential: boolean
  analytics: boolean
  personalization: boolean
  thirdParty: boolean
}

export interface PermissionState {
  canUseLocation: boolean
  canUsePersonalData: boolean
  canUseAnalytics: boolean
  canUseThirdParty: boolean
  canAuthenticate: boolean
}

const COOKIE_PREFERENCES_KEY = 'benevoclic_cookie_preferences'

// Variables globales pour éviter les problèmes de contexte
let isInitialized = false
let cookiePreferencesGlobal = ref<CookiePreferences>({
  essential: true,
  analytics: false,
  personalization: false,
  thirdParty: false
})
let hasConsentedGlobal = ref(false)

// Fonction d'initialisation
const initializePermissions = () => {
  if (isInitialized || typeof window === 'undefined') return
  
  try {
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY)
    if (savedPreferences) {
      const parsed = JSON.parse(savedPreferences)
      if (parsed.preferences) {
        cookiePreferencesGlobal.value = { ...parsed.preferences }
        hasConsentedGlobal.value = true
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement des préférences de cookies:', error)
  }
  
  isInitialized = true
}

export const usePermissions = () => {
  // Initialiser si ce n'est pas déjà fait
  if (typeof window !== 'undefined') {
    initializePermissions()
  }

  // Charger les préférences depuis le localStorage
  const loadCookiePreferences = (): boolean => {
    if (typeof window === 'undefined') return false
    
    try {
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY)
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences)
        if (parsed.preferences) {
          cookiePreferencesGlobal.value = { ...parsed.preferences }
          hasConsentedGlobal.value = true
          return true
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préférences de cookies:', error)
    }
    return false
  }

  // Sauvegarder les préférences
  const saveCookiePreferences = (preferences: CookiePreferences) => {
    if (typeof window === 'undefined') return
    
    try {
      const toSave = {
        version: '1.0',
        preferences,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(toSave))
      cookiePreferencesGlobal.value = preferences
      hasConsentedGlobal.value = true
      
      // Émettre un événement pour informer l'application
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cookiePreferencesUpdated', {
          detail: preferences
        }))
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences de cookies:', error)
    }
  }

  // Calculer les permissions basées sur les préférences de cookies
  const permissions = computed<PermissionState>(() => ({
    // L'authentification nécessite les cookies essentiels
    canAuthenticate: cookiePreferencesGlobal.value.essential,
    
    // La localisation nécessite les cookies de personnalisation
    canUseLocation: cookiePreferencesGlobal.value.personalization,
    
    // Les données personnelles nécessitent les cookies de personnalisation
    canUsePersonalData: cookiePreferencesGlobal.value.personalization,
    
    // Les analytics nécessitent les cookies analytiques
    canUseAnalytics: cookiePreferencesGlobal.value.analytics,
    
    // Les services tiers nécessitent les cookies tiers
    canUseThirdParty: cookiePreferencesGlobal.value.thirdParty
  }))

  // Vérifier si une permission spécifique est accordée
  const hasPermission = (permission: keyof PermissionState): boolean => {
    return permissions.value[permission]
  }

  // Accepter tous les cookies
  const acceptAllCookies = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      personalization: true,
      thirdParty: true
    }
    saveCookiePreferences(allAccepted)
  }

  // Refuser les cookies non essentiels
  const rejectNonEssentialCookies = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      analytics: false,
      personalization: false,
      thirdParty: false
    }
    saveCookiePreferences(essentialOnly)
  }

  // Accepter des cookies spécifiques
  const acceptSpecificCookies = (preferences: Partial<CookiePreferences>) => {
    const newPreferences = { ...cookiePreferencesGlobal.value, ...preferences }
    saveCookiePreferences(newPreferences)
  }

  // Réinitialiser les préférences (pour forcer l'affichage de la bannière)
  const resetPreferences = () => {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem(COOKIE_PREFERENCES_KEY)
    hasConsentedGlobal.value = false
    cookiePreferencesGlobal.value = {
      essential: true,
      analytics: false,
      personalization: false,
      thirdParty: false
    }
  }

  return {
    // État
    cookiePreferences: computed(() => cookiePreferencesGlobal.value),
    hasConsented: computed(() => hasConsentedGlobal.value),
    permissions: computed(() => permissions.value),
    isClient: computed(() => typeof window !== 'undefined'),
    
    // Méthodes de vérification
    hasPermission,
    
    // Méthodes de gestion des cookies
    loadCookiePreferences,
    saveCookiePreferences,
    acceptAllCookies,
    rejectNonEssentialCookies,
    acceptSpecificCookies,
    resetPreferences
  }
} 