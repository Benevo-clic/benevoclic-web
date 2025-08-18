import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthStore } from '@/stores/auth/auth.store'
import { useUserStore } from '~/stores/user/user.store'
import { RoleUser } from '~/common/enums/role.enum'

function getPathWithoutLocale(path: string): string {
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
    'events',
    '/auth/login',
    '/auth/register',
    '/help',
    '/search',
    '/search/history',
    '/notifications',
    '/mentions-legales',
    '/confidentialite'
  ],

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
    '/volunteer/events/announcement'
  ],

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
    '/association/events/announcement'
  ],

  admin: ['/admin', '/dashboard']
}

function isRouteAccessible(path: string, role: RoleUser | null): boolean {
  const pathWithoutLocale = getPathWithoutLocale(path)

  if (BASE_ROUTE_CONFIG.public.includes(pathWithoutLocale)) {
    return true
  }

  if (
    pathWithoutLocale.startsWith('/announcement/') ||
    pathWithoutLocale.startsWith('/annoucement/')
  ) {
    return true
  }

  if (pathWithoutLocale.startsWith('/admin')) {
    return true
  }

  switch (role) {
    case RoleUser.VOLUNTEER:
      return BASE_ROUTE_CONFIG.volunteer.some(route => pathWithoutLocale.startsWith(route))
    case RoleUser.ASSOCIATION:
      return BASE_ROUTE_CONFIG.association.some(route => pathWithoutLocale.startsWith(route))
    case RoleUser.ADMIN:
      return (
        BASE_ROUTE_CONFIG.admin.some(route => pathWithoutLocale.startsWith(route)) ||
        BASE_ROUTE_CONFIG.volunteer.some(route => pathWithoutLocale.startsWith(route)) ||
        BASE_ROUTE_CONFIG.association.some(route => pathWithoutLocale.startsWith(route))
      )
    default:
      return false
  }
}

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

  if (locale && locale !== 'fr') {
    return `/${locale}${basePath}`
  }

  return basePath
}

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware for admin routes
  if (to.path.startsWith('/admin')) {
    return
  }

  // Skip middleware during SSR
  if (process.server) {
    return
  }

  // Firebase verification only on client side
  if (process.client) {
    try {
      const { useFirebase } = await import('~/composables/useFirebase')
      const { initializeFirebase, getAuth } = useFirebase()

      await initializeFirebase()
      const auth = getAuth()

      if (auth) {
        const currentUser = auth.currentUser
        if (currentUser && !currentUser.emailVerified) {
          if (to.path !== '/auth/VerifyEmailPage') {
            return navigateTo('/auth/VerifyEmailPage')
          }
          return
        }
      }
    } catch (error) {
      process.env.NODE_ENV !== 'production' &&
        console.warn(
          'Firebase non disponible dans le route guard, continuation sans vérification:',
          error
        )
    }
  }

  const authStore = useAuthStore()
  const userStore = useUserStore()

  const isConnectedCookie = useCookie('isConnected')
  if (!isConnectedCookie.value) {
    try {
      const { useSessionStore } = await import('~/stores/session.store')
      const sessionStore = useSessionStore()

      const restored = await sessionStore.restoreSession()
      if (restored) {
        if (isConnectedCookie.value) {
        }
      }
    } catch (sessionError) {
      process.env.NODE_ENV !== 'production' &&
        console.warn(
          '⚠️ Erreur lors de la restauration de session dans le middleware:',
          sessionError
        )
    }

    await authStore.initAuth()
  }

  if (!isConnectedCookie.value) {
    const pathWithoutLocale = getPathWithoutLocale(to.path)

    if (BASE_ROUTE_CONFIG.public.includes(pathWithoutLocale)) {
      return
    }

    if (
      pathWithoutLocale.startsWith('/announcement/') ||
      pathWithoutLocale.startsWith('/annoucement/')
    ) {
      return
    }

    if (['/auth/registerVolunteer', '/auth/registerAssociation'].includes(pathWithoutLocale)) {
      return navigateTo('/')
    }

    return navigateTo('/')
  }

  if (!userStore.user) {
    try {
      await userStore.fetchUser()
    } catch (error: any) {
      if (error?.statusCode === 401 || error?.statusCode === 403) {
        const isConnectedCookie = useCookie('isConnected')
        if (isConnectedCookie.value) {
          isConnectedCookie.value = null
        }
        return navigateTo('/')
      }

      return navigateTo('/')
    }
  }

  const userRole = userStore.getRole || null

  if (!authStore.isAuthenticated && ['/'].includes(getPathWithoutLocale(to.path))) {
    const locale = getLocaleFromPath(to.path)
    return navigateTo(getHomePageForRole(userRole, locale))
  }

  if (
    ['/auth/registerVolunteer', '/auth/registerAssociation'].includes(getPathWithoutLocale(to.path))
  ) {
    if (userStore.user && userStore.user.isCompleted) {
      const locale = getLocaleFromPath(to.path)
      return navigateTo(getHomePageForRole(userRole, locale))
    }
    return
  }

  if (to.path === '/auth/VerifyEmailPage') {
    return
  }

  if (userStore.user && !userStore.user.isCompleted) {
    const locale = getLocaleFromPath(to.path)

    switch (userRole) {
      case RoleUser.VOLUNTEER:
        if (getPathWithoutLocale(to.path) !== '/auth/registerVolunteer') {
          const registerPath =
            locale !== 'fr' ? `/${locale}/auth/registerVolunteer` : '/auth/registerVolunteer'
          return navigateTo(registerPath)
        }
        break
      case RoleUser.ASSOCIATION:
        if (getPathWithoutLocale(to.path) !== '/auth/registerAssociation') {
          const registerPath =
            locale !== 'fr' ? `/${locale}/auth/registerAssociation` : '/auth/registerAssociation'
          return navigateTo(registerPath)
        }
        break
    }
    return
  }

  if (!isRouteAccessible(to.path, userRole)) {
    const locale = getLocaleFromPath(to.path)
    const homePage = getHomePageForRole(userRole, locale)
    return navigateTo(homePage)
  }
})
