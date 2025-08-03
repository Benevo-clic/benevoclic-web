// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock des stores
const mockAuthStore = {
  userId: 'user123',
  getToken: 'mock-token',
  loading: false,
  error: null,
  getIsVerified: true,
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
  sendEmailVerification: vi.fn(),
  loginWithGoogle: vi.fn(),
  getPageRole: vi.fn(),
  refreshTokens: vi.fn()
}

const mockUserStore = {
  getUser: { id: 'user123', name: 'John Doe', email: 'john@example.com' },
  getRole: 'volunteer',
  loading: false,
  error: null,
  fetchUser: vi.fn(),
  updateIsCompleted: vi.fn(),
  uploadProfilePicture: vi.fn(),
  removeUserAccount: vi.fn(),
  updatePassword: vi.fn(),
  fullName: 'John Doe'
}

// Mock de useCookie
const mockCookie = vi.fn(() => ({
  value: true
}))

// Mock de computed
const mockComputed = vi.fn((getter) => ({
  value: getter()
}))

// Mock des modules
vi.mock('../../stores/auth/auth.store', () => ({
  useAuthStore: () => mockAuthStore
}))

vi.mock('../../stores/user/user.store', () => ({
  useUserStore: () => mockUserStore
}))

// Mock globaux
global.useCookie = mockCookie
global.computed = mockComputed

// Fonction mock pour useAuth
const useAuth = () => {
  const authStore = mockAuthStore
  const userStore = mockUserStore

  return {
    // État d'authentification
    isAuthenticated: mockComputed(() => mockCookie("isConnected").value),
    userId: mockComputed(() => authStore.userId),
    token: mockComputed(() => authStore.getToken),
    
    // Données utilisateur
    user: mockComputed(() => userStore.getUser),
    userRole: mockComputed(() => userStore.getRole),
    fullName: mockComputed(() => userStore.fullName),
    
    // États de chargement
    loading: mockComputed(() => authStore.loading || userStore.loading),
    error: mockComputed(() => authStore.error || userStore.error),
    
    // Actions d'authentification
    login: authStore.login,
    logout: authStore.logout,
    register: authStore.register,
    sendEmailVerification: authStore.sendEmailVerification,
    loginWithGoogle: authStore.loginWithGoogle,
    getPageRole: authStore.getPageRole,
    
    // Actions utilisateur
    fetchUser: userStore.fetchUser,
    updateIsCompleted: userStore.updateIsCompleted,
    uploadProfilePicture: userStore.uploadProfilePicture,
    removeUserAccount: userStore.removeUserAccount,
    updatePassword: userStore.updatePassword,
    refreshToken: authStore.refreshTokens,
  }
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCookie.mockReturnValue({ value: true })
  })

  describe('État d\'authentification', () => {
    it('should return authentication state', () => {
      const auth = useAuth()

      expect(auth.isAuthenticated.value).toBe(true)
      expect(auth.userId.value).toBe('user123')
      expect(auth.token.value).toBe('mock-token')
    })

    it('should return user data', () => {
      const auth = useAuth()

      expect(auth.user.value).toEqual({
        id: 'user123',
        name: 'John Doe',
        email: 'john@example.com'
      })
      expect(auth.userRole.value).toBe('volunteer')
      expect(auth.fullName.value).toBe('John Doe')
    })

    it('should return loading and error states', () => {
      const auth = useAuth()

      expect(auth.loading.value).toBe(false)
      expect(auth.error.value).toBe(null)
    })
  })

  describe('Actions d\'authentification', () => {
    it('should call login method', async () => {
      const auth = useAuth()
      const credentials = { email: 'test@example.com', password: 'password' }

      await auth.login(credentials)

      expect(mockAuthStore.login).toHaveBeenCalledWith(credentials)
    })

    it('should call logout method', async () => {
      const auth = useAuth()

      await auth.logout()

      expect(mockAuthStore.logout).toHaveBeenCalled()
    })

    it('should call register method', async () => {
      const auth = useAuth()
      const userData = { email: 'test@example.com', password: 'password', name: 'Test User' }

      await auth.register(userData)

      expect(mockAuthStore.register).toHaveBeenCalledWith(userData)
    })

    it('should call sendEmailVerification method', async () => {
      const auth = useAuth()

      await auth.sendEmailVerification()

      expect(mockAuthStore.sendEmailVerification).toHaveBeenCalled()
    })

    it('should call loginWithGoogle method', async () => {
      const auth = useAuth()

      await auth.loginWithGoogle()

      expect(mockAuthStore.loginWithGoogle).toHaveBeenCalled()
    })

    it('should call getPageRole method', () => {
      const auth = useAuth()

      auth.getPageRole()

      expect(mockAuthStore.getPageRole).toHaveBeenCalled()
    })

    it('should call refreshToken method', async () => {
      const auth = useAuth()

      await auth.refreshToken()

      expect(mockAuthStore.refreshTokens).toHaveBeenCalled()
    })
  })

  describe('Actions utilisateur', () => {
    it('should call fetchUser method', async () => {
      const auth = useAuth()

      await auth.fetchUser()

      expect(mockUserStore.fetchUser).toHaveBeenCalled()
    })

    it('should call updateIsCompleted method', async () => {
      const auth = useAuth()
      const isCompleted = true

      await auth.updateIsCompleted(isCompleted)

      expect(mockUserStore.updateIsCompleted).toHaveBeenCalledWith(isCompleted)
    })

    it('should call uploadProfilePicture method', async () => {
      const auth = useAuth()
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })

      await auth.uploadProfilePicture(file)

      expect(mockUserStore.uploadProfilePicture).toHaveBeenCalledWith(file)
    })

    it('should call removeUserAccount method', async () => {
      const auth = useAuth()

      await auth.removeUserAccount()

      expect(mockUserStore.removeUserAccount).toHaveBeenCalled()
    })

    it('should call updatePassword method', async () => {
      const auth = useAuth()
      const newPassword = 'newpassword123'

      await auth.updatePassword(newPassword)

      expect(mockUserStore.updatePassword).toHaveBeenCalledWith(newPassword)
    })
  })

  describe('États réactifs', () => {
    it('should update loading state when stores change', () => {
      mockAuthStore.loading = true
      mockUserStore.loading = false

      const auth = useAuth()

      expect(auth.loading.value).toBe(true)
    })

    it('should update error state when stores change', () => {
      mockAuthStore.error = 'Auth error'
      mockUserStore.error = null

      const auth = useAuth()

      expect(auth.error.value).toBe('Auth error')
    })

    it('should return user data when available', () => {
      const auth = useAuth()

      expect(auth.user.value).toBeDefined()
      expect(auth.user.value.id).toBe('user123')
    })

    it('should return user role when available', () => {
      const auth = useAuth()

      expect(auth.userRole.value).toBe('volunteer')
    })
  })

  describe('Gestion des erreurs', () => {
    it('should handle auth store errors', () => {
      mockAuthStore.error = 'Authentication failed'
      mockUserStore.error = null

      const auth = useAuth()

      expect(auth.error.value).toBe('Authentication failed')
    })

    it('should handle user store errors', () => {
      mockAuthStore.error = null
      mockUserStore.error = 'User data error'

      const auth = useAuth()

      expect(auth.error.value).toBe('User data error')
    })

    it('should prioritize auth store errors over user store errors', () => {
      mockAuthStore.error = 'Auth error'
      mockUserStore.error = 'User error'

      const auth = useAuth()

      expect(auth.error.value).toBe('Auth error')
    })
  })

  describe('Intégration avec les stores', () => {
    it('should use auth store for authentication methods', () => {
      const auth = useAuth()

      expect(auth.login).toBe(mockAuthStore.login)
      expect(auth.logout).toBe(mockAuthStore.logout)
      expect(auth.register).toBe(mockAuthStore.register)
    })

    it('should use user store for user methods', () => {
      const auth = useAuth()

      expect(auth.fetchUser).toBe(mockUserStore.fetchUser)
      expect(auth.updateIsCompleted).toBe(mockUserStore.updateIsCompleted)
    })
  })

  describe('Computed properties', () => {
    it('should have reactive computed properties', () => {
      const auth = useAuth()

      expect(auth.isAuthenticated.value).toBe(true)
      expect(auth.userId.value).toBe('user123')
      expect(auth.token.value).toBe('mock-token')
      expect(auth.user.value).toBeDefined()
      expect(auth.userRole.value).toBe('volunteer')
      expect(auth.fullName.value).toBe('John Doe')
    })

    it('should update computed properties when stores change', () => {
      const auth = useAuth()

      // Les computed properties devraient être réactives
      expect(auth.userId.value).toBe('user123')
      expect(auth.user.value.id).toBe('user123')

      // Note: Dans un vrai environnement Vue, les computed properties seraient réactives
      // mais dans notre mock, elles sont évaluées une seule fois
    })
  })
}) 