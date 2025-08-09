import { useAuthStore } from '@/stores/auth/auth.store'
import { useUserStore } from '~/stores/user/user.store'
import { RoleUser } from '~/common/enums/role.enum'

export function useNavigation () {
  const userStore = useUserStore()

  // Configuration des routes par rôle (même que dans le middleware)
  const ROUTE_CONFIG = {
    public: [
      '/',
      '/auth/login',
      '/auth/register',
      '/help',
      '/search',
      '/search/history',
      '/notifications'
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

  const isRouteAccessible = (path: string): boolean => {
    if (!useCookie('isConnected').value) {
      return ROUTE_CONFIG.public.includes(path)
    }

    const userRole = userStore.getRole
    if (ROUTE_CONFIG.public.includes(path)) {
      return true
    }

    switch (userRole) {
      case RoleUser.VOLUNTEER:
        return ROUTE_CONFIG.volunteer.some(route => path.startsWith(route))
      case RoleUser.ASSOCIATION:
        return ROUTE_CONFIG.association.some(route => path.startsWith(route))
      case RoleUser.ADMIN:
        return (
          ROUTE_CONFIG.admin.some(route => path.startsWith(route)) ||
          ROUTE_CONFIG.volunteer.some(route => path.startsWith(route)) ||
          ROUTE_CONFIG.association.some(route => path.startsWith(route))
        )
      default:
        return false
    }
  }

  // Obtenir la page d'accueil selon le rôle
  const getHomePageForRole = (): string => {
    if (!useCookie('isConnected').value) {
      return '/'
    }

    const userRole = userStore.getRole
    switch (userRole) {
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

  // Naviguer vers une route avec vérification d'accès
  const navigateToRoute = async (path: string) => {
    const authStore = useAuthStore()
    // Vérifier si l'utilisateur est connecté
    if (!authStore.isConnected) {
      console.log(
        '🔍 Utilisateur non connecté, redirection vers la page de connexion'
      )
      return navigateTo('/')
    }
    if (!useCookie('isConnected').value) {
      if (!ROUTE_CONFIG.public.includes(path)) {
        return navigateTo('/')
      }
    } else {
      if (userStore.user && !userStore.user.isCompleted) {
        const userRole = userStore.getRole
        switch (userRole) {
          case RoleUser.VOLUNTEER:
            return navigateTo('/auth/registerVolunteer')
          case RoleUser.ASSOCIATION:
            return navigateTo('/auth/registerAssociation')
          default:
            return navigateTo('/auth/register')
        }
      }

      // Vérifier si la route est accessible
      if (!isRouteAccessible(path)) {
        const homePage = getHomePageForRole()
        return navigateTo(homePage)
      }
    }

    return navigateTo(path)
  }

  // Naviguer vers la page d'accueil appropriée
  const navigateToHome = () => {
    const homePage = getHomePageForRole()
    return navigateTo(homePage)
  }

  // Naviguer vers le dashboard selon le rôle
  const navigateToDashboard = () => {
    if (!useCookie('isConnected').value) {
      return navigateTo('/')
    }

    const userRole = userStore.getRole
    switch (userRole) {
      case RoleUser.VOLUNTEER:
        return navigateTo('/volunteer')
      case RoleUser.ASSOCIATION:
        return navigateTo('/association/dashboard')
      case RoleUser.ADMIN:
        return navigateTo('/dashboard')
      default:
        return navigateTo('/')
    }
  }

  // Obtenir les routes accessibles pour le rôle actuel
  const getAccessibleRoutes = () => {
    if (!useCookie('isConnected').value) {
      return ROUTE_CONFIG.public
    }

    const userRole = userStore.getRole
    switch (userRole) {
      case RoleUser.VOLUNTEER:
        return [...ROUTE_CONFIG.public, ...ROUTE_CONFIG.volunteer]
      case RoleUser.ASSOCIATION:
        return [...ROUTE_CONFIG.public, ...ROUTE_CONFIG.association]
      case RoleUser.ADMIN:
        return [
          ...ROUTE_CONFIG.public,
          ...ROUTE_CONFIG.volunteer,
          ...ROUTE_CONFIG.association,
          ...ROUTE_CONFIG.admin
        ]
      default:
        return ROUTE_CONFIG.public
    }
  }

  return {
    // Fonctions de navigation
    navigateToRoute,
    navigateToHome,
    navigateToDashboard,

    // Fonctions de vérification
    isRouteAccessible,
    getHomePageForRole,
    getAccessibleRoutes,

    // Configuration des routes
    ROUTE_CONFIG
  }
}
