
import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthStore } from '~/stores/auth/auth.store'
import { useUserStore } from '~/stores/user/user.store'
import { RoleUser } from '~/common/enums/role.enum'
import { getAuth } from "firebase/auth";

// Fonction pour extraire le chemin sans préfixe de langue
function getPathWithoutLocale(path: string): string {
  // Supprimer les préfixes de langue (/en/, /es/)
  return path.replace(/^\/(en|es)\//, '/')
}

// Fonction pour obtenir la locale depuis le chemin
function getLocaleFromPath(path: string): string {
  const match = path.match(/^\/(en|es)\//)
  return match ? match[1] : 'fr'
}

// Configuration des routes de base par rôle (sans préfixe de langue)
const BASE_ROUTE_CONFIG = {
  // Routes publiques (accessibles à tous)
  public: [
    '/',
    '/events',
    '/announcement',
    '/announcement/[id]',
    '/annoucement',
    '/annoucement/[id]',
    'events',
    '/auth/login',
    '/auth/register',
    '/help',
    '/search',
    '/search/history',
    '/notifications',
    '/mentions-legales',
    '/confidentialite',
  ],

  // Routes pour les volontaires
  volunteer: [
    '/volunteer',
    '/volunteer/account',
    '/volunteer/account/profile',
    '/volunteer/account/edit',
    '/volunteer/account/settings',
    '/volunteer/account/associations',
    '/volunteer/activity',
    '/volunteer/activity/favorites',
    '/volunteer/activity/history',
    '/volunteer/activity/missions',
    '/volunteer/activity/participations',
    '/volunteer/events',
    '/volunteer/events/announcement',
  ],

  // Routes pour les associations
  association: [
    '/association',
    '/association/dashboard',
    '/association/account',
    '/association/account/profile',
    '/association/account/edit',
    '/association/account/settings',
    '/association/account/volunteers',
    '/association/activity',
    '/association/activity/history',
    '/association/events',
    '/association/events/association',
    '/association/events/association/manage',
    '/association/events/association/requests',
    '/association/events/announcement',
  ],

  // Routes pour les admins (si nécessaire)
  admin: [
    '/admin',
    '/dashboard'
  ]
}

// Fonction pour vérifier si une route est accessible pour un rôle
function isRouteAccessible(path: string, role: RoleUser | null): boolean {
  const pathWithoutLocale = getPathWithoutLocale(path)

  // Routes publiques toujours accessibles
  if (BASE_ROUTE_CONFIG.public.includes(pathWithoutLocale)) {
    return true
  }

  // Vérifier les routes dynamiques publiques (comme /announcement/[id] ou /annoucement/[id])
  if (pathWithoutLocale.startsWith('/announcement/') || pathWithoutLocale.startsWith('/annoucement/')) {
    return true
  }

  // Vérifier selon le rôle
  switch (role) {
    case RoleUser.VOLUNTEER:
      return BASE_ROUTE_CONFIG.volunteer.some(route => pathWithoutLocale.startsWith(route))
    case RoleUser.ASSOCIATION:
      return BASE_ROUTE_CONFIG.association.some(route => pathWithoutLocale.startsWith(route))
    case RoleUser.ADMIN:
      return BASE_ROUTE_CONFIG.admin.some(route => pathWithoutLocale.startsWith(route)) ||
             BASE_ROUTE_CONFIG.volunteer.some(route => pathWithoutLocale.startsWith(route)) ||
             BASE_ROUTE_CONFIG.association.some(route => pathWithoutLocale.startsWith(route))
    default:
      return false
  }
}

// Fonction pour obtenir la page d'accueil selon le rôle et la langue
function getHomePageForRole(role: RoleUser | null, locale?: string): string {
  const basePath = (() => {
    switch (role) {
      case RoleUser.VOLUNTEER:
        return '/volunteer'
      case RoleUser.ASSOCIATION:
        return '/association/dashboard'
      case RoleUser.ADMIN:
        return '/dashboard'
      default:
        return '/'
    }
  })()

  // Ajouter le préfixe de langue si nécessaire
  if (locale && locale !== 'fr') {
    return `/${locale}${basePath}`
  }

  return basePath
}

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.client) {
    try {
      const { $firebase } = useNuxtApp()
      let firebase = null

      if ($firebase) {
        firebase = await $firebase
      }

      if (!firebase) {
        const { $firebaseBase } = useNuxtApp()
        if ($firebaseBase) {
          firebase = await $firebaseBase
        }
      }

      if (firebase && firebase.auth) {
        const currentUser = firebase.auth.currentUser
        if (
            currentUser &&
            !currentUser.emailVerified
        ) {
          if (to.path !== '/auth/VerifyEmailPage') {
            return navigateTo('/auth/VerifyEmailPage')
          }
          return
        }
      }
    } catch (error) {
      console.warn('Firebase non initialisé dans le route guard:', error)
    }
  }

  if (useNuxtApp().ssrContext) {
    return
  }

  const authStore = useAuthStore()
  const userStore = useUserStore()

  if (!useCookie("isConnected").value) {
    await authStore.initAuth()
  }

  console.log(`🔍 Vérification de la route: ${to.path} depuis ${from.path}`)

  if (!useCookie("isConnected").value) {
    const pathWithoutLocale = getPathWithoutLocale(to.path)
    
    // Si c'est une route publique, laisser passer
    if (BASE_ROUTE_CONFIG.public.includes(pathWithoutLocale)) {
      console.log('✅ Route publique, accès autorisé')
      return
    }
    
    // Vérifier les routes dynamiques publiques (comme /announcement/[id] ou /annoucement/[id])
    if (pathWithoutLocale.startsWith('/announcement/') || pathWithoutLocale.startsWith('/annoucement/')) {
      console.log('✅ Route d\'annonce publique, accès autorisé')
      return
    }
    
    // Si c'est une route de transition, rediriger vers login
    if ([
      '/auth/registerVolunteer',
      '/auth/registerAssociation'
    ].includes(pathWithoutLocale)) {
      console.log('🔄 Route de transition, redirection vers login')
      return navigateTo('/')
    }

    return navigateTo('/')
  }

  // Utilisateur connecté, récupérer ses données si nécessaire
  if (!userStore.user) {
    try {
      await userStore.fetchUser()
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des données utilisateur:', error)
      await authStore.logout()
      return navigateTo('/')
    }
  }

  const userRole = userStore.getRole || null
  console.log(`👤 Utilisateur connecté avec le rôle: ${userRole}`)

  if (!authStore.isAuthenticated && ['/'].includes(getPathWithoutLocale(to.path))) {
    const locale = getLocaleFromPath(to.path)
    return navigateTo(getHomePageForRole(userRole, locale))
  }

  // Gestion explicite des routes de transition
  if (['/auth/registerVolunteer', '/auth/registerAssociation'].includes(getPathWithoutLocale(to.path))) {
    if (userStore.user && userStore.user.isCompleted) {
      // Rediriger vers la home selon le rôle et la langue
      const locale = getLocaleFromPath(to.path)
      return navigateTo(getHomePageForRole(userRole, locale))
    }
    // Sinon, laisser passer (profil incomplet)
    return
  }

  if (to.path === '/auth/VerifyEmailPage') {
    // Ici, tu peux ajouter une vérification supplémentaire si besoin
    return
  }

  // Vérifier si le profil est complété
  if (userStore.user && !userStore.user.isCompleted) {
    console.log('📝 Profil incomplet, redirection vers complétion')
    const locale = getLocaleFromPath(to.path)

    switch (userRole) {
      case RoleUser.VOLUNTEER:
        if (getPathWithoutLocale(to.path) !== '/auth/registerVolunteer') {
          const registerPath = locale !== 'fr' ? `/${locale}/auth/registerVolunteer` : '/auth/registerVolunteer'
          return navigateTo(registerPath)
        }
        break
      case RoleUser.ASSOCIATION:
        if (getPathWithoutLocale(to.path) !== '/auth/registerAssociation') {
          const registerPath = locale !== 'fr' ? `/${locale}/auth/registerAssociation` : '/auth/registerAssociation'
          return navigateTo(registerPath)
        }
        break
    }
    return
  }

  // Vérifier si la route est accessible pour le rôle
  if (!isRouteAccessible(to.path, userRole)) {
    console.log(`🚫 Route ${to.path} non accessible pour le rôle ${userRole}`)

    // Rediriger vers la page d'accueil appropriée avec la bonne langue
    const locale = getLocaleFromPath(to.path)
    const homePage = getHomePageForRole(userRole, locale)
    console.log(`🏠 Redirection vers la page d'accueil: ${homePage}`)
    return navigateTo(homePage)
  }

  // Route accessible, laisser passer
  console.log('✅ Route accessible, accès autorisé')
})
