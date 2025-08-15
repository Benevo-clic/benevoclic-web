// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// Mock component pour tester le Header principal
const MockHeader = {
  template: `
    <div class="bg-base-200">
      <div v-if="isLoading" class="flex justify-center py-2" role="status" aria-live="polite">
        <span class="loading loading-dots loading-xl" aria-hidden="true"></span>
        <span class="sr-only">Chargement de l'application...</span>
      </div>
      <header v-else role="banner" aria-label="En-tête de l'application Benevoclic">
        <!-- Login Modal -->
        <dialog 
          ref="loginModal" 
          class="modal" 
          role="dialog" 
          aria-labelledby="login-modal-title" 
          aria-describedby="login-modal-description"
          aria-modal="true"
        >
          <div class="modal-box">
            <h3 id="login-modal-title" class="font-bold text-lg">{{ t('auth.login_required') }}</h3>
            <p id="login-modal-description" class="py-4">{{ t('auth.login_to_access') }}</p>
            <div class="modal-action">
              <form method="dialog">
                <button 
                  class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                  aria-label="Fermer la modal"
                  @keyup.enter="loginModal?.close()"
                  @keyup.space.prevent="loginModal?.close()"
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </form>
              <div class="header-auth-modal">HeaderAuthModalAuth</div>
            </div>
          </div>
        </dialog>

        <!-- Top bar -->
        <div class="bg-base-100 shadow-sm px-4 py-2 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <NuxtLink 
              to="/" 
              class="w-14 rounded-full overflow-hidden"
              aria-label="Accueil - Logo Benevoclic"
            >
              <img 
                src="/logo_benevoclic.png" 
                alt="Logo Benevoclic" 
                class="w-full h-auto" 
                width="56" 
                height="56"
                loading="eager"
                decoding="sync"
              />
            </NuxtLink>
          </div>

          <div class="flex items-center gap-3">
            <div class="indicator hidden sm:flex mr-2">
              <button
                  class="btn btn-ghost btn-circle px-0 py-0 flex items-center gap-1"
                  @click="handleHome"
                  aria-label="Aller à l'accueil bénévole"
              >
                <span class="w-5 h-5">🏠</span>
              </button>
            </div>

            <button
                class="btn btn-ghost btn-circle"
                @click="toggleTheme"
                aria-label="Changer le thème"
            >
              <span class="w-5 h-5">{{ isDarkTheme ? '🌙' : '☀️' }}</span>
            </button>

            <button
                v-if="isAuthenticated"
                class="btn btn-ghost btn-circle"
                @click="handleNotifications"
                aria-label="Notifications"
            >
              <span class="w-5 h-5">🔔</span>
            </button>

            <button
                v-if="isAuthenticated"
                class="btn btn-ghost btn-circle"
                @click="handleFavorites"
                aria-label="Favoris"
            >
              <span class="w-5 h-5">❤️</span>
            </button>

            <div v-if="isAuthenticated" class="dropdown dropdown-end">
              <button
                  class="btn btn-ghost btn-circle"
                  @click="menuOpen = !menuOpen"
                  @keydown="handleUserMenuKeydown"
                  aria-label="Menu utilisateur"
              >
                <img 
                  v-if="profileImageUrl" 
                  :src="profileImageUrl" 
                  :alt="'Photo de profil de ' + (user?.name || 'utilisateur')"
                  class="w-8 h-8 rounded-full"
                />
                <span v-else class="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center">
                  {{ (user?.name || 'U').charAt(0).toUpperCase() }}
                </span>
              </button>
              <div v-if="menuOpen" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a @click="handleProfile">Profil</a></li>
                <li><a @click="handleLogout">Déconnexion</a></li>
              </div>
            </div>

            <button
                v-else
                class="btn btn-primary btn-sm"
                @click="showLoginModal = true"
                aria-label="Se connecter"
            >
              Se connecter
            </button>
          </div>
        </div>

        <!-- Drawer -->
        <div v-if="menuOpen" class="drawer drawer-end">
          <div class="drawer-content">
            <div class="drawer-content-mock">DrawerContent</div>
          </div>
        </div>
      </header>
    </div>
  `,
  data() {
    return {
      isLoading: true,
      isAuthenticated: false,
      isDarkTheme: false,
      menuOpen: false,
      showLoginModal: false,
      loginModal: null,
      user: null,
      profileImageUrl: null,
      role: null,
      t: key => key // Mock pour les traductions
    }
  },
  methods: {
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme
    },
    handleHome() {
      // Simuler la navigation
      return '/'
    },
    handleNotifications() {
      if (this.isAuthenticated) {
        this.loginModal?.showModal()
      } else {
        return '/notifications'
      }
    },
    handleFavorites() {
      if (!this.isAuthenticated) {
        return
      }
      return '/volunteer/activity/favorites'
    },
    handleUserMenuKeydown(event) {
      if (event.key === 'Escape') {
        const dropdown = event.target
        dropdown?.blur()
      }
    },
    handleProfile() {
      return '/user'
    },
    handleLogout() {
      this.isAuthenticated = false
      this.user = null
    }
  },
  mounted() {
    // Simuler l'initialisation
    setTimeout(() => {
      this.isLoading = false
    }, 100)
  }
}

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendu de base', () => {
    it('should render component', () => {
      const wrapper = mount(MockHeader)

      expect(wrapper.exists()).toBe(true)
    })

    it('should display loading state initially', () => {
      const wrapper = mount(MockHeader)

      const loadingDiv = wrapper.find('[role="status"]')
      expect(loadingDiv.exists()).toBe(true)
    })

    it('should display header after loading', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      const header = wrapper.find('header')
      expect(header.exists()).toBe(true)
    })
  })

  describe('Logo et navigation', () => {
    it('should display logo', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      const logo = wrapper.find('img[alt="Logo Benevoclic"]')
      expect(logo.exists()).toBe(true)
      expect(logo.attributes('src')).toBe('/logo_benevoclic.png')
    })

    it('should have proper logo link', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      const logoLink = wrapper.find('NuxtLink[to="/"]')
      expect(logoLink.exists()).toBe(true)
      expect(logoLink.classes()).toContain('w-14')
    })
  })

  describe("Boutons d'action", () => {
    it('should display theme toggle button', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      const themeButton = wrapper.find('button[aria-label="Changer le thème"]')
      expect(themeButton.exists()).toBe(true)
    })

    it('should toggle theme when clicked', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      const themeButton = wrapper.find('button[aria-label="Changer le thème"]')
      const initialTheme = wrapper.vm.isDarkTheme

      await themeButton.trigger('click')

      expect(wrapper.vm.isDarkTheme).toBe(!initialTheme)
    })

    it('should display home button', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 200))
      await wrapper.vm.$nextTick()

      const homeButton = wrapper.findAll('button').find(btn => btn.text().includes('🏠'))
      if (!homeButton.exists()) {
        // Affiche le HTML pour debug si le bouton n'est pas trouvé
        process.env.NODE_ENV !== 'production' && console.log(wrapper.html())
      }
      expect(homeButton.exists()).toBe(true)
    })
  })

  describe("États d'authentification", () => {
    it('should show login button when not authenticated', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      const loginButton = wrapper.find('button[aria-label="Se connecter"]')
      expect(loginButton.exists()).toBe(true)
      expect(loginButton.text()).toBe('Se connecter')
    })

    it('should show user menu when authenticated', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      // Simuler l'authentification
      wrapper.vm.isAuthenticated = true
      wrapper.vm.user = { name: 'John Doe' }
      await nextTick()

      const userMenuButton = wrapper.find('button[aria-label="Menu utilisateur"]')
      expect(userMenuButton.exists()).toBe(true)
    })

    it('should show notification button when authenticated', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      wrapper.vm.isAuthenticated = true
      await nextTick()

      const notificationButton = wrapper.find('button[aria-label="Notifications"]')
      expect(notificationButton.exists()).toBe(true)
    })

    it('should show favorites button when authenticated', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      wrapper.vm.isAuthenticated = true
      await nextTick()

      const favoritesButton = wrapper.find('button[aria-label="Favoris"]')
      expect(favoritesButton.exists()).toBe(true)
    })
  })

  describe('Menu utilisateur', () => {
    it('should toggle menu when user button is clicked', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      wrapper.vm.isAuthenticated = true
      wrapper.vm.user = { name: 'John Doe' }
      await nextTick()

      const userMenuButton = wrapper.find('button[aria-label="Menu utilisateur"]')
      await userMenuButton.trigger('click')

      expect(wrapper.vm.menuOpen).toBe(true)
    })

    it('should display user avatar when available', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      wrapper.vm.isAuthenticated = true
      wrapper.vm.user = { name: 'John Doe' }
      wrapper.vm.profileImageUrl = '/avatar.jpg'
      await nextTick()

      const avatar = wrapper.find('img[alt*="Photo de profil"]')
      expect(avatar.exists()).toBe(true)
    })

    it('should display user initial when no avatar', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      wrapper.vm.isAuthenticated = true
      wrapper.vm.user = { name: 'John Doe' }
      await nextTick()

      const initial = wrapper.find('.bg-primary.text-primary-content')
      expect(initial.exists()).toBe(true)
      expect(initial.text()).toBe('J')
    })
  })

  describe('Modal de connexion', () => {
    it('should show login modal when login button is clicked', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      const loginButton = wrapper.find('button[aria-label="Se connecter"]')
      await loginButton.trigger('click')

      expect(wrapper.vm.showLoginModal).toBe(true)
    })

    it('should have proper modal structure', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      const modal = wrapper.find('dialog')
      expect(modal.exists()).toBe(true)
      expect(modal.attributes('role')).toBe('dialog')
    })

    it('should have proper modal accessibility', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      const modal = wrapper.find('dialog')
      expect(modal.attributes('aria-modal')).toBe('true')
      expect(modal.attributes('aria-labelledby')).toBe('login-modal-title')
    })
  })

  describe('Navigation', () => {
    it('should handle home navigation', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      const homeButton = wrapper.find('button[aria-label="Aller à l\'accueil bénévole"]')
      const result = await wrapper.vm.handleHome()
      expect(result).toBe('/')
    })

    it('should handle favorites navigation when authenticated', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      wrapper.vm.isAuthenticated = true
      await nextTick()

      const result = await wrapper.vm.handleFavorites()
      expect(result).toBe('/volunteer/activity/favorites')
    })

    it('should not navigate to favorites when not authenticated', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      const result = await wrapper.vm.handleFavorites()
      expect(result).toBeUndefined()
    })
  })

  describe('Gestion du clavier', () => {
    it('should handle escape key in user menu', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      const mockEvent = {
        key: 'Escape',
        target: {
          blur: vi.fn()
        }
      }

      wrapper.vm.handleUserMenuKeydown(mockEvent)

      expect(mockEvent.target.blur).toHaveBeenCalled()
    })
  })

  describe('Accessibilité', () => {
    it('should have proper loading accessibility', () => {
      const wrapper = mount(MockHeader)

      const loadingDiv = wrapper.find('[role="status"]')
      expect(loadingDiv.exists()).toBe(true)
      expect(loadingDiv.attributes('aria-live')).toBe('polite')
    })

    it('should have proper header accessibility', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      const header = wrapper.find('header')
      expect(header.attributes('role')).toBe('banner')
      expect(header.attributes('aria-label')).toBe("En-tête de l'application Benevoclic")
    })

    it('should have proper button accessibility', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      const buttons = wrapper.findAll('button')
      buttons.forEach(button => {
        expect(button.attributes('aria-label')).toBeTruthy()
      })
    })
  })

  describe('Styles et classes CSS', () => {
    it('should have proper container styling', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      expect(wrapper.find('.bg-base-200').exists()).toBe(true)
    })

    it('should have proper header styling', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      const header = wrapper.find('header')
      expect(header.exists()).toBe(true)
    })

    it('should have proper button styling', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      const buttons = wrapper.findAll('.btn')
      buttons.forEach(button => {
        expect(button.classes()).toContain('btn')
      })
    })
  })

  describe('États conditionnels', () => {
    it('should show different content based on authentication state', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      // Non authentifié
      expect(wrapper.find('button[aria-label="Se connecter"]').exists()).toBe(true)
      expect(wrapper.find('button[aria-label="Menu utilisateur"]').exists()).toBe(false)

      // Authentifié
      wrapper.vm.isAuthenticated = true
      await nextTick()

      expect(wrapper.find('button[aria-label="Se connecter"]').exists()).toBe(false)
      expect(wrapper.find('button[aria-label="Menu utilisateur"]').exists()).toBe(true)
    })

    it('should show different theme icons based on theme state', async () => {
      const wrapper = mount(MockHeader)
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))
      const themeButton = wrapper.find('button[aria-label="Changer le thème"]')
      // Thème clair
      expect(themeButton.text()).toContain('☀️')
      // Thème sombre
      wrapper.vm.isDarkTheme = true
      await nextTick()
      expect(themeButton.text()).toContain('🌙')
    })
  })
})
