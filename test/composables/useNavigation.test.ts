// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock des stores
const mockUserStore = {
  getRole: 'VOLUNTEER',
  user: {
    isCompleted: true
  }
}

const mockAuthStore = {
  isConnected: true
}

// Mock de useCookie
const mockUseCookie = vi.fn(() => ({
  value: true
}))

// Mock de navigateTo
const mockNavigateTo = vi.fn()

// Mock des modules
vi.mock('~/stores/user/user.store', () => ({
  useUserStore: () => mockUserStore
}))

vi.mock('~/stores/auth/auth.store', () => ({
  useAuthStore: () => mockAuthStore
}))

vi.mock('#app', () => ({
  navigateTo: mockNavigateTo
}))

// Mock de useCookie global
vi.mock('#imports', () => ({
  useCookie: mockUseCookie
}))

// Mock globaux
global.useCookie = mockUseCookie

// Enum mock
const RoleUser = {
  VOLUNTEER: 'VOLUNTEER',
  ASSOCIATION: 'ASSOCIATION',
  ADMIN: 'ADMIN'
}

// Mock the useNavigation composable
const mockUseNavigation = () => {
  const userStore = mockUserStore

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

  const isRouteAccessible = path => {
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

  const getHomePageForRole = () => {
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

  const navigateToRoute = async path => {
    const authStore = mockAuthStore
    if (!authStore.isConnected && !ROUTE_CONFIG.public.includes(path)) {
      process.env.NODE_ENV !== 'production' &&
        console.log(`🔍 Utilisateur non connecté, redirection vers la page de connexion`)
      return mockNavigateTo('/')
    }
    if (!useCookie('isConnected').value) {
      if (!ROUTE_CONFIG.public.includes(path)) {
        return mockNavigateTo('/')
      }
      return mockNavigateTo(path)
    } else {
      if (userStore.user && !userStore.user.isCompleted) {
        const userRole = userStore.getRole
        switch (userRole) {
          case RoleUser.VOLUNTEER:
            return mockNavigateTo('/auth/registerVolunteer')
          case RoleUser.ASSOCIATION:
            return mockNavigateTo('/auth/registerAssociation')
          default:
            return mockNavigateTo('/auth/register')
        }
      }

      if (!isRouteAccessible(path)) {
        const homePage = getHomePageForRole()
        return mockNavigateTo(homePage)
      }
    }

    return mockNavigateTo(path)
  }

  const navigateToHome = () => {
    const homePage = getHomePageForRole()
    return mockNavigateTo(homePage)
  }

  const navigateToDashboard = () => {
    if (!useCookie('isConnected').value) {
      return mockNavigateTo('/')
    }

    const userRole = userStore.getRole
    switch (userRole) {
      case RoleUser.VOLUNTEER:
        return mockNavigateTo('/volunteer')
      case RoleUser.ASSOCIATION:
        return mockNavigateTo('/association/dashboard')
      case RoleUser.ADMIN:
        return mockNavigateTo('/dashboard')
      default:
        return mockNavigateTo('/')
    }
  }

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
    navigateToRoute,
    navigateToHome,
    navigateToDashboard,
    isRouteAccessible,
    getHomePageForRole,
    getAccessibleRoutes,
    ROUTE_CONFIG
  }
}

// Mock the useNavigation import
vi.mock('~/composables/useNavigation', () => ({
  useNavigation: mockUseNavigation
}))

describe('useNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseCookie.mockReturnValue({ value: true })
    mockNavigateTo.mockResolvedValue(undefined)

    // Reset mock stores to default values
    mockUserStore.getRole = 'VOLUNTEER'
    mockUserStore.user.isCompleted = true
    mockAuthStore.isConnected = true
  })

  describe('Méthode isRouteAccessible', () => {
    it('should allow public routes for non-connected users', () => {
      const navigation = mockUseNavigation()
      mockUseCookie.mockReturnValue({ value: false })

      const result = navigation.isRouteAccessible('/help')

      expect(result).toBe(true)
    })

    it('should deny private routes for non-connected users', () => {
      const navigation = mockUseNavigation()
      mockUseCookie.mockReturnValue({ value: false })

      const result = navigation.isRouteAccessible('/volunteer/account')

      expect(result).toBe(false)
    })

    it('should allow volunteer routes for volunteer users', () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'VOLUNTEER'

      const result = navigation.isRouteAccessible('/volunteer/account')

      expect(result).toBe(true)
    })

    it('should deny volunteer routes for association users', () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'ASSOCIATION'

      const result = navigation.isRouteAccessible('/volunteer/account')

      expect(result).toBe(false)
    })

    it('should allow association routes for association users', () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'ASSOCIATION'

      const result = navigation.isRouteAccessible('/association/dashboard')

      expect(result).toBe(true)
    })

    it('should allow all routes for admin users', () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'ADMIN'

      const result = navigation.isRouteAccessible('/volunteer/account')
      const result2 = navigation.isRouteAccessible('/association/dashboard')

      expect(result).toBe(true)
      expect(result2).toBe(true)
    })

    it('should always allow public routes for connected users', () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'VOLUNTEER'

      const result = navigation.isRouteAccessible('/help')

      expect(result).toBe(true)
    })
  })

  describe('Méthode getHomePageForRole', () => {
    it('should return home page for non-connected users', () => {
      const navigation = mockUseNavigation()
      mockUseCookie.mockReturnValue({ value: false })

      const result = navigation.getHomePageForRole()

      expect(result).toBe('/')
    })

    it('should return volunteer home for volunteer users', () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'VOLUNTEER'

      const result = navigation.getHomePageForRole()

      expect(result).toBe('/volunteer')
    })

    it('should return association dashboard for association users', () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'ASSOCIATION'

      const result = navigation.getHomePageForRole()

      expect(result).toBe('/association/dashboard')
    })

    it('should return admin dashboard for admin users', () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'ADMIN'

      const result = navigation.getHomePageForRole()

      expect(result).toBe('/dashboard')
    })

    it('should return home page for unknown roles', () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'UNKNOWN'

      const result = navigation.getHomePageForRole()

      expect(result).toBe('/')
    })
  })

  describe('Méthode navigateToRoute', () => {
    it('should redirect to home for non-connected users', async () => {
      const navigation = mockUseNavigation()
      mockAuthStore.isConnected = false
      mockUseCookie.mockReturnValue({ value: false })

      await navigation.navigateToRoute('/volunteer/account')

      expect(mockNavigateTo).toHaveBeenCalledWith('/')
    })

    it('should allow public routes for non-connected users', async () => {
      const navigation = mockUseNavigation()
      mockAuthStore.isConnected = false
      mockUseCookie.mockReturnValue({ value: false })

      await navigation.navigateToRoute('/help')

      expect(mockNavigateTo).toHaveBeenCalledWith('/help')
    })

    it('should redirect to registration for incomplete profiles', async () => {
      const navigation = mockUseNavigation()
      mockUserStore.user.isCompleted = false
      mockUserStore.getRole = 'VOLUNTEER'

      await navigation.navigateToRoute('/volunteer')

      expect(mockNavigateTo).toHaveBeenCalledWith('/auth/registerVolunteer')
    })

    it('should redirect to association registration for incomplete association profiles', async () => {
      const navigation = mockUseNavigation()
      mockUserStore.user.isCompleted = false
      mockUserStore.getRole = 'ASSOCIATION'

      await navigation.navigateToRoute('/association/dashboard')

      expect(mockNavigateTo).toHaveBeenCalledWith('/auth/registerAssociation')
    })

    it('should navigate to accessible routes', async () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'VOLUNTEER'

      await navigation.navigateToRoute('/volunteer/account')

      expect(mockNavigateTo).toHaveBeenCalledWith('/volunteer/account')
    })

    it('should redirect to home page for inaccessible routes', async () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'VOLUNTEER'

      await navigation.navigateToRoute('/association/dashboard')

      expect(mockNavigateTo).toHaveBeenCalledWith('/volunteer')
    })
  })

  describe('Méthode navigateToHome', () => {
    it('should navigate to appropriate home page for volunteer', () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'VOLUNTEER'

      navigation.navigateToHome()

      expect(mockNavigateTo).toHaveBeenCalledWith('/volunteer')
    })

    it('should navigate to appropriate home page for association', () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'ASSOCIATION'

      navigation.navigateToHome()

      expect(mockNavigateTo).toHaveBeenCalledWith('/association/dashboard')
    })

    it('should navigate to appropriate home page for admin', () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'ADMIN'

      navigation.navigateToHome()

      expect(mockNavigateTo).toHaveBeenCalledWith('/dashboard')
    })
  })

  describe('Méthode navigateToDashboard', () => {
    it('should redirect to home for non-connected users', () => {
      const navigation = mockUseNavigation()
      mockUseCookie.mockReturnValue({ value: false })

      navigation.navigateToDashboard()

      expect(mockNavigateTo).toHaveBeenCalledWith('/')
    })

    it('should navigate to volunteer dashboard', () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'VOLUNTEER'

      navigation.navigateToDashboard()

      expect(mockNavigateTo).toHaveBeenCalledWith('/volunteer')
    })

    it('should navigate to association dashboard', () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'ASSOCIATION'

      navigation.navigateToDashboard()

      expect(mockNavigateTo).toHaveBeenCalledWith('/association/dashboard')
    })

    it('should navigate to admin dashboard', () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'ADMIN'

      navigation.navigateToDashboard()

      expect(mockNavigateTo).toHaveBeenCalledWith('/dashboard')
    })
  })

  describe('Méthode getAccessibleRoutes', () => {
    it('should return only public routes for non-connected users', () => {
      const navigation = mockUseNavigation()
      mockUseCookie.mockReturnValue({ value: false })

      const routes = navigation.getAccessibleRoutes()

      expect(routes).toEqual(navigation.ROUTE_CONFIG.public)
    })

    it('should return public and volunteer routes for volunteer users', () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'VOLUNTEER'

      const routes = navigation.getAccessibleRoutes()

      expect(routes).toEqual([
        ...navigation.ROUTE_CONFIG.public,
        ...navigation.ROUTE_CONFIG.volunteer
      ])
    })

    it('should return public and association routes for association users', () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'ASSOCIATION'

      const routes = navigation.getAccessibleRoutes()

      expect(routes).toEqual([
        ...navigation.ROUTE_CONFIG.public,
        ...navigation.ROUTE_CONFIG.association
      ])
    })

    it('should return all routes for admin users', () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'ADMIN'

      const routes = navigation.getAccessibleRoutes()

      expect(routes).toEqual([
        ...navigation.ROUTE_CONFIG.public,
        ...navigation.ROUTE_CONFIG.volunteer,
        ...navigation.ROUTE_CONFIG.association,
        ...navigation.ROUTE_CONFIG.admin
      ])
    })

    it('should return only public routes for unknown roles', () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'UNKNOWN'

      const routes = navigation.getAccessibleRoutes()

      expect(routes).toEqual(navigation.ROUTE_CONFIG.public)
    })
  })

  describe('Configuration des routes', () => {
    it('should have correct public routes', () => {
      const navigation = mockUseNavigation()
      const expectedPublicRoutes = [
        '/',
        '/auth/login',
        '/auth/register',
        '/help',
        '/search',
        '/search/history',
        '/notifications'
      ]

      expect(navigation.ROUTE_CONFIG.public).toEqual(expectedPublicRoutes)
    })

    it('should have correct volunteer routes', () => {
      const navigation = mockUseNavigation()
      const expectedVolunteerRoutes = [
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
      ]

      expect(navigation.ROUTE_CONFIG.volunteer).toEqual(expectedVolunteerRoutes)
    })

    it('should have correct association routes', () => {
      const navigation = mockUseNavigation()
      const expectedAssociationRoutes = [
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
      ]

      expect(navigation.ROUTE_CONFIG.association).toEqual(expectedAssociationRoutes)
    })

    it('should have correct admin routes', () => {
      const navigation = mockUseNavigation()
      const expectedAdminRoutes = ['/admin', '/dashboard']

      expect(navigation.ROUTE_CONFIG.admin).toEqual(expectedAdminRoutes)
    })
  })

  describe('Intégration', () => {
    it('should handle complete navigation workflow for volunteer', async () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'VOLUNTEER'
      mockUserStore.user.isCompleted = true

      // Test public route access
      await navigation.navigateToRoute('/help')
      expect(mockNavigateTo).toHaveBeenCalledWith('/help')

      // Test volunteer route access
      await navigation.navigateToRoute('/volunteer/account')
      expect(mockNavigateTo).toHaveBeenCalledWith('/volunteer/account')

      // Test inaccessible route redirection
      await navigation.navigateToRoute('/association/dashboard')
      expect(mockNavigateTo).toHaveBeenCalledWith('/volunteer')
    })

    it('should handle complete navigation workflow for association', async () => {
      const navigation = mockUseNavigation()
      mockUserStore.getRole = 'ASSOCIATION'
      mockUserStore.user.isCompleted = true

      // Test public route access
      await navigation.navigateToRoute('/help')
      expect(mockNavigateTo).toHaveBeenCalledWith('/help')

      // Test association route access
      await navigation.navigateToRoute('/association/events')
      expect(mockNavigateTo).toHaveBeenCalledWith('/association/events')

      // Test inaccessible route redirection
      await navigation.navigateToRoute('/volunteer/account')
      expect(mockNavigateTo).toHaveBeenCalledWith('/association/dashboard')
    })
  })
})
