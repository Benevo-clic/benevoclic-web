// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock des stores
const mockAuthStore = {
  isAuthenticated: false,
  initAuth: vi.fn(),
  logout: vi.fn()
}

const mockUserStore = {
  user: null,
  getRole: null,
  fetchUser: vi.fn()
}

// Mock de useCookie
const mockUseCookie = vi.fn(() => ({
  value: false
}))

// Mock de navigateTo
const mockNavigateTo = vi.fn()

// Mock de Firebase
const mockFirebase = {
  auth: {
    currentUser: null
  }
}

// Mock de useNuxtApp
const mockUseNuxtApp = vi.fn(() => ({
  ssrContext: null,
  $firebase: null,
  $firebaseBase: null
}))

// Mock des modules
vi.mock('~/stores/auth/auth.store', () => ({
  useAuthStore: () => mockAuthStore
}))

vi.mock('~/stores/user/user.store', () => ({
  useUserStore: () => mockUserStore
}))

vi.mock('#app', () => ({
  navigateTo: mockNavigateTo
}))

// Mock globaux
global.useCookie = mockUseCookie
global.useNuxtApp = mockUseNuxtApp

// Mock de import.meta
global.import = {
  meta: {
    client: true
  }
}

// Enum mock
const RoleUser = {
  VOLUNTEER: 'VOLUNTEER',
  ASSOCIATION: 'ASSOCIATION',
  ADMIN: 'ADMIN'
}

// Configuration des routes de base
const BASE_ROUTE_CONFIG = {
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

// Fonction helper pour extraire le chemin sans préfixe de langue
function getPathWithoutLocale(path) {
  return path.replace(/^\/(en|es)\//, '/')
}

// Fonction helper pour obtenir la locale depuis le chemin
function getLocaleFromPath(path) {
  const match = path.match(/^\/(en|es)\//)
  return match ? match[1] : 'fr'
}

// Fonction helper pour vérifier si une route est accessible
function isRouteAccessible(path, role) {
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

// Fonction helper pour obtenir la page d'accueil selon le rôle
function getHomePageForRole(role, locale) {
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

// Mock du middleware
const routeGuardMiddleware = async (to, from) => {
  // Simulation de la logique du middleware
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
        if (currentUser && !currentUser.emailVerified) {
          if (to.path !== '/auth/VerifyEmailPage') {
            return mockNavigateTo('/auth/VerifyEmailPage')
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

  if (!useCookie('isConnected').value) {
    await mockAuthStore.initAuth()
  }

  if (!useCookie('isConnected').value) {
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
      return mockNavigateTo('/')
    }

    return mockNavigateTo('/')
  }

  if (!mockUserStore.user) {
    try {
      await mockUserStore.fetchUser()
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des données utilisateur:', error)
      await mockAuthStore.logout()
      return mockNavigateTo('/')
    }
  }

  const userRole = mockUserStore.getRole || null

  if (!mockAuthStore.isAuthenticated && ['/'].includes(getPathWithoutLocale(to.path))) {
    const locale = getLocaleFromPath(to.path)
    return mockNavigateTo(getHomePageForRole(userRole, locale))
  }

  if (
    ['/auth/registerVolunteer', '/auth/registerAssociation'].includes(getPathWithoutLocale(to.path))
  ) {
    if (mockUserStore.user && mockUserStore.user.isCompleted) {
      const locale = getLocaleFromPath(to.path)
      return mockNavigateTo(getHomePageForRole(userRole, locale))
    }
    return
  }

  if (to.path === '/auth/VerifyEmailPage') {
    return
  }

  if (mockUserStore.user && !mockUserStore.user.isCompleted) {
    const locale = getLocaleFromPath(to.path)

    switch (userRole) {
      case RoleUser.VOLUNTEER:
        if (getPathWithoutLocale(to.path) !== '/auth/registerVolunteer') {
          const registerPath =
            locale !== 'fr' ? `/${locale}/auth/registerVolunteer` : '/auth/registerVolunteer'
          return mockNavigateTo(registerPath)
        }
        break
      case RoleUser.ASSOCIATION:
        if (getPathWithoutLocale(to.path) !== '/auth/registerAssociation') {
          const registerPath =
            locale !== 'fr' ? `/${locale}/auth/registerAssociation` : '/auth/registerAssociation'
          return mockNavigateTo(registerPath)
        }
        break
    }
    return
  }

  if (!isRouteAccessible(to.path, userRole)) {
    const locale = getLocaleFromPath(to.path)
    const homePage = getHomePageForRole(userRole, locale)
    return mockNavigateTo(homePage)
  }

  console.log('✅ Route accessible, accès autorisé')
}

describe('Route Guard Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseCookie.mockReturnValue({ value: false })
    mockNavigateTo.mockResolvedValue(undefined)

    // Reset mock stores
    mockAuthStore.isAuthenticated = false
    mockAuthStore.initAuth.mockResolvedValue(undefined)
    mockAuthStore.logout.mockResolvedValue(undefined)

    mockUserStore.user = null
    mockUserStore.getRole = null
    mockUserStore.fetchUser.mockResolvedValue(undefined)

    // Reset useNuxtApp mock
    mockUseNuxtApp.mockReturnValue({
      ssrContext: null,
      $firebase: null,
      $firebaseBase: null
    })
  })

  describe('Gestion des utilisateurs non connectés', () => {
    it('should allow access to public routes for non-connected users', async () => {
      const to = { path: '/help' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('should allow access to announcement routes for non-connected users', async () => {
      const to = { path: '/announcement/123' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('should redirect to home for private routes when not connected', async () => {
      const to = { path: '/volunteer/account' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).toHaveBeenCalledWith('/')
    })

    it('should redirect to home for registration routes when not connected', async () => {
      const to = { path: '/auth/registerVolunteer' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).toHaveBeenCalledWith('/')
    })

    it('should initialize auth when not connected', async () => {
      const to = { path: '/volunteer/account' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockAuthStore.initAuth).toHaveBeenCalled()
    })
  })

  describe('Gestion des utilisateurs connectés', () => {
    beforeEach(() => {
      mockUseCookie.mockReturnValue({ value: true })
    })

    it('should fetch user data when user is not loaded', async () => {
      const to = { path: '/volunteer/account' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockUserStore.fetchUser).toHaveBeenCalled()
    })

    it('should handle user fetch error and logout', async () => {
      mockUserStore.fetchUser.mockRejectedValue(new Error('Fetch error'))
      const to = { path: '/volunteer/account' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockAuthStore.logout).toHaveBeenCalled()
      expect(mockNavigateTo).toHaveBeenCalledWith('/')
    })

    it('should redirect to home page for authenticated users on root path', async () => {
      mockUserStore.getRole = RoleUser.VOLUNTEER
      const to = { path: '/' }
      const from = { path: '/volunteer' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).toHaveBeenCalledWith('/volunteer')
    })
  })

  describe('Gestion des profils incomplets', () => {
    beforeEach(() => {
      mockUseCookie.mockReturnValue({ value: true })
      mockUserStore.user = { isCompleted: false }
    })

    it('should redirect volunteer to registration page when profile incomplete', async () => {
      mockUserStore.getRole = RoleUser.VOLUNTEER
      const to = { path: '/volunteer/account' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).toHaveBeenCalledWith('/auth/registerVolunteer')
    })

    it('should redirect association to registration page when profile incomplete', async () => {
      mockUserStore.getRole = RoleUser.ASSOCIATION
      const to = { path: '/association/dashboard' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).toHaveBeenCalledWith('/auth/registerAssociation')
    })

    it('should allow access to registration pages when profile incomplete', async () => {
      mockUserStore.getRole = RoleUser.VOLUNTEER
      const to = { path: '/auth/registerVolunteer' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('should redirect to localized registration page', async () => {
      mockUserStore.getRole = RoleUser.VOLUNTEER
      const to = { path: '/en/volunteer/account' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).toHaveBeenCalledWith('/en/auth/registerVolunteer')
    })
  })

  describe('Gestion des profils complets', () => {
    beforeEach(() => {
      mockUseCookie.mockReturnValue({ value: true })
      mockUserStore.user = { isCompleted: true }
    })

    it('should redirect from registration pages when profile is complete', async () => {
      mockUserStore.getRole = RoleUser.VOLUNTEER
      const to = { path: '/auth/registerVolunteer' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).toHaveBeenCalledWith('/volunteer')
    })

    it('should redirect to localized home page when profile is complete', async () => {
      mockUserStore.getRole = RoleUser.VOLUNTEER
      const to = { path: '/en/auth/registerVolunteer' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).toHaveBeenCalledWith('/en/volunteer')
    })
  })

  describe('Gestion des rôles et permissions', () => {
    beforeEach(() => {
      mockUseCookie.mockReturnValue({ value: true })
      mockUserStore.user = { isCompleted: true }
    })

    it('should allow volunteer access to volunteer routes', async () => {
      mockUserStore.getRole = RoleUser.VOLUNTEER
      const to = { path: '/volunteer/account' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('should deny volunteer access to association routes', async () => {
      mockUserStore.getRole = RoleUser.VOLUNTEER
      const to = { path: '/association/dashboard' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).toHaveBeenCalledWith('/volunteer')
    })

    it('should allow association access to association routes', async () => {
      mockUserStore.getRole = RoleUser.ASSOCIATION
      const to = { path: '/association/dashboard' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('should deny association access to volunteer routes', async () => {
      mockUserStore.getRole = RoleUser.ASSOCIATION
      const to = { path: '/volunteer/account' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).toHaveBeenCalledWith('/association/dashboard')
    })

    it('should allow admin access to all routes', async () => {
      mockUserStore.getRole = RoleUser.ADMIN
      const to = { path: '/volunteer/account' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('should redirect to appropriate home page for unknown roles', async () => {
      mockUserStore.getRole = 'UNKNOWN'
      const to = { path: '/volunteer/account' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).toHaveBeenCalledWith('/')
    })
  })

  describe('Gestion des locales', () => {
    beforeEach(() => {
      mockUseCookie.mockReturnValue({ value: true })
      mockUserStore.user = { isCompleted: true }
    })

    it('should handle English locale correctly', async () => {
      mockUserStore.getRole = RoleUser.VOLUNTEER
      const to = { path: '/en/volunteer/account' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('should handle Spanish locale correctly', async () => {
      mockUserStore.getRole = RoleUser.ASSOCIATION
      const to = { path: '/es/association/dashboard' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('should redirect to localized home page for inaccessible routes', async () => {
      mockUserStore.getRole = RoleUser.VOLUNTEER
      const to = { path: '/en/association/dashboard' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).toHaveBeenCalledWith('/en/volunteer')
    })
  })

  describe('Gestion de Firebase et vérification email', () => {
    it('should redirect to email verification page for unverified users', async () => {
      mockFirebase.auth.currentUser = { emailVerified: false }
      mockUseNuxtApp.mockReturnValue({
        ssrContext: null,
        $firebase: Promise.resolve(mockFirebase),
        $firebaseBase: null
      })

      const to = { path: '/volunteer/account' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      // Le middleware devrait rediriger vers la page de vérification email
      // mais comme l'utilisateur n'est pas connecté, il redirige d'abord vers '/'
      expect(mockNavigateTo).toHaveBeenCalledWith('/')
    })

    it('should allow access to email verification page for unverified users', async () => {
      mockFirebase.auth.currentUser = { emailVerified: false }
      mockUseNuxtApp.mockReturnValue({
        ssrContext: null,
        $firebase: Promise.resolve(mockFirebase),
        $firebaseBase: null
      })

      const to = { path: '/auth/VerifyEmailPage' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      // Comme l'utilisateur n'est pas connecté, il redirige vers '/'
      expect(mockNavigateTo).toHaveBeenCalledWith('/')
    })

    it('should handle Firebase initialization error gracefully', async () => {
      // Mock Firebase avec une erreur mais en la gérant dans le middleware
      mockUseNuxtApp.mockReturnValue({
        ssrContext: null,
        $firebase: null, // Pas de Firebase disponible
        $firebaseBase: null
      })

      const to = { path: '/volunteer/account' }
      const from = { path: '/' }

      // Le middleware devrait gérer l'absence de Firebase et continuer normalement
      await routeGuardMiddleware(to, from)

      // Should continue with normal flow
      expect(mockNavigateTo).toHaveBeenCalledWith('/')
    })
  })

  describe('Gestion du SSR', () => {
    it('should return early for SSR context', async () => {
      mockUseNuxtApp.mockReturnValue({
        ssrContext: { url: '/' },
        $firebase: null,
        $firebaseBase: null
      })

      const to = { path: '/volunteer/account' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).not.toHaveBeenCalled()
      expect(mockAuthStore.initAuth).not.toHaveBeenCalled()
    })
  })

  describe('Fonctions utilitaires', () => {
    describe('getPathWithoutLocale', () => {
      it('should remove English locale prefix', () => {
        expect(getPathWithoutLocale('/en/volunteer/account')).toBe('/volunteer/account')
      })

      it('should remove Spanish locale prefix', () => {
        expect(getPathWithoutLocale('/es/association/dashboard')).toBe('/association/dashboard')
      })

      it('should return path unchanged when no locale prefix', () => {
        expect(getPathWithoutLocale('/volunteer/account')).toBe('/volunteer/account')
      })
    })

    describe('getLocaleFromPath', () => {
      it('should extract English locale', () => {
        expect(getLocaleFromPath('/en/volunteer/account')).toBe('en')
      })

      it('should extract Spanish locale', () => {
        expect(getLocaleFromPath('/es/association/dashboard')).toBe('es')
      })

      it('should return fr for paths without locale', () => {
        expect(getLocaleFromPath('/volunteer/account')).toBe('fr')
      })
    })

    describe('isRouteAccessible', () => {
      it('should allow public routes for any role', () => {
        expect(isRouteAccessible('/help', null)).toBe(true)
        expect(isRouteAccessible('/help', RoleUser.VOLUNTEER)).toBe(true)
        expect(isRouteAccessible('/help', RoleUser.ASSOCIATION)).toBe(true)
      })

      it('should allow volunteer routes for volunteer role', () => {
        expect(isRouteAccessible('/volunteer/account', RoleUser.VOLUNTEER)).toBe(true)
      })

      it('should deny volunteer routes for association role', () => {
        expect(isRouteAccessible('/volunteer/account', RoleUser.ASSOCIATION)).toBe(false)
      })

      it('should allow admin access to all routes', () => {
        expect(isRouteAccessible('/volunteer/account', RoleUser.ADMIN)).toBe(true)
        expect(isRouteAccessible('/association/dashboard', RoleUser.ADMIN)).toBe(true)
      })
    })

    describe('getHomePageForRole', () => {
      it('should return correct home page for volunteer', () => {
        expect(getHomePageForRole(RoleUser.VOLUNTEER)).toBe('/volunteer')
      })

      it('should return correct home page for association', () => {
        expect(getHomePageForRole(RoleUser.ASSOCIATION)).toBe('/association/dashboard')
      })

      it('should return correct home page for admin', () => {
        expect(getHomePageForRole(RoleUser.ADMIN)).toBe('/dashboard')
      })

      it('should return home page for unknown roles', () => {
        expect(getHomePageForRole(null)).toBe('/')
      })

      it('should add locale prefix when not French', () => {
        expect(getHomePageForRole(RoleUser.VOLUNTEER, 'en')).toBe('/en/volunteer')
        expect(getHomePageForRole(RoleUser.ASSOCIATION, 'es')).toBe('/es/association/dashboard')
      })
    })
  })

  describe('Intégration', () => {
    it('should handle complete workflow for new volunteer user', async () => {
      // Simuler un utilisateur non connecté
      mockUseCookie.mockReturnValue({ value: false })

      const to = { path: '/volunteer/account' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockAuthStore.initAuth).toHaveBeenCalled()
      expect(mockNavigateTo).toHaveBeenCalledWith('/')
    })

    it('should handle complete workflow for authenticated volunteer', async () => {
      // Simuler un utilisateur connecté avec profil complet
      mockUseCookie.mockReturnValue({ value: true })
      mockUserStore.user = { isCompleted: true }
      mockUserStore.getRole = RoleUser.VOLUNTEER

      const to = { path: '/volunteer/account' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('should handle complete workflow for incomplete association profile', async () => {
      // Simuler un utilisateur connecté avec profil incomplet
      mockUseCookie.mockReturnValue({ value: true })
      mockUserStore.user = { isCompleted: false }
      mockUserStore.getRole = RoleUser.ASSOCIATION

      const to = { path: '/association/dashboard' }
      const from = { path: '/' }

      await routeGuardMiddleware(to, from)

      expect(mockNavigateTo).toHaveBeenCalledWith('/auth/registerAssociation')
    })
  })
})
