import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthStore } from '~/stores/auth/auth.store'
import { useUserStore } from '~/stores/user/user.store'
import { RoleUser } from '~/common/enums/role.enum'
import { getAuth } from "firebase/auth";


// Configuration des routes par rôle
const ROUTE_CONFIG = {
  // Routes publiques (accessibles à tous)
  public: [
    '/',
    '/auth/login',
    '/auth/register',
    '/help',
    '/search',
    '/search/history',
    '/notifications'
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
    '/en/volunteer/account/associations',
    '/en/volunteer/activity',
    '/en/volunteer/activity/favorites',
    '/en/volunteer/activity/history',
    '/en/volunteer/activity/missions',
    '/en/volunteer/activity/participations',
    '/en/volunteer/events',
    '/en/volunteer/events/announcement'
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
    '/en/association',
    '/en/association/dashboard',
    '/en/association/account',
    '/en/association/account/profile',
    '/en/association/account/edit',
    '/en/association/account/settings',
    '/en/association/account/volunteers',
    '/en/association/activity',
    '/en/association/activity/history',
    '/en/association/events',
    '/en/association/events/association',
    '/en/association/events/association/manage',
    '/en/association/events/association/requests',
    '/en/association/events/announcement'
  ],

  // Routes pour les admins (si nécessaire)
  admin: [
    '/admin',
    '/dashboard'
  ]
}

// Fonction pour vérifier si une route est accessible pour un rôle
function isRouteAccessible(path: string, role: RoleUser | null): boolean {
  // Routes publiques toujours accessibles
  if (ROUTE_CONFIG.public.includes(path)) {
    return true
  }

  // Vérifier selon le rôle
  switch (role) {
    case RoleUser.VOLUNTEER:
      return ROUTE_CONFIG.volunteer.some(route => path.startsWith(route))
    case RoleUser.ASSOCIATION:
      return ROUTE_CONFIG.association.some(route => path.startsWith(route))
    case RoleUser.ADMIN:
      return ROUTE_CONFIG.admin.some(route => path.startsWith(route)) ||
             ROUTE_CONFIG.volunteer.some(route => path.startsWith(route)) ||
             ROUTE_CONFIG.association.some(route => path.startsWith(route))
    default:
      return false
  }
}

// Fonction pour obtenir la page d'accueil selon le rôle
function getHomePageForRole(role: RoleUser | null): string {
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
}

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = getAuth()

  if (import.meta.client) {
    const currentUser = auth.currentUser
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

  if (useNuxtApp().ssrContext) {
    return
  }

  const authStore = useAuthStore()
  const userStore = useUserStore()


  if (!useCookie("isConnected").value) {
    await authStore.initAuth()
  }

  if (!useCookie("isConnected").value) {
    // Si c'est une route publique, laisser passer
    if (ROUTE_CONFIG.public.includes(to.path)) {
      console.log('✅ Route publique, accès autorisé')
      return
    }
    // Si c'est une route de transition, rediriger vers login
    if ([
      '/auth/registerVolunteer',
      '/auth/registerAssociation'
    ].includes(to.path)) {
      console.log('🔄 Route de transition, redirection vers login')
      return navigateTo('/')
    }
    // Sinon, rediriger vers login


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

  if (!authStore.isAuthenticated && ['/'].includes(to.path)) {
    return navigateTo(getHomePageForRole(userRole))
  }

  // Gestion explicite des routes de transition
  if (['/auth/registerVolunteer', '/auth/registerAssociation'].includes(to.path)) {
    if (userStore.user && userStore.user.isCompleted) {
      // Rediriger vers la home selon le rôle
      return navigateTo(getHomePageForRole(userRole))
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
    switch (userRole) {
      case RoleUser.VOLUNTEER:
        if (to.path !== '/auth/registerVolunteer') {
          return navigateTo('/auth/registerVolunteer')
        }
        break
      case RoleUser.ASSOCIATION:
        if (to.path !== '/auth/registerAssociation') {
          return navigateTo('/auth/registerAssociation')
        }
        break
      default:
        return navigateTo('/auth/register')
    }
    return
  }

  // Vérifier si la route est accessible pour le rôle
  if (!isRouteAccessible(to.path, userRole)) {

    // Rediriger vers la page d'accueil appropriée
    const homePage = getHomePageForRole(userRole)
    console.log(`🏠 Redirection vers la page d'accueil: ${homePage}`)
    return navigateTo(homePage)
  }
})