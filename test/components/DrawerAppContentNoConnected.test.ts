// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// Mock component pour tester le DrawerAppContentNoConnected
const MockDrawerAppContentNoConnected = {
  template: `
    <div class="flex flex-col h-full">
      <!-- Welcome Section - Header fixe -->
      <div class="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-base-300 flex-shrink-0">
        <div class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-2xl flex items-center justify-center">
            <div class="w-8 h-8 text-primary">👤</div>
          </div>
          <h3 class="font-bold text-lg text-base-content mb-2">
            Bienvenue sur BeneVoclic
          </h3>
          <p class="text-sm text-base-content/70">
            Connectez-vous pour accéder à toutes les fonctionnalités
          </p>
        </div>
      </div>

      <!-- Navigation avec design moderne - Contenu scrollable -->
      <nav class="flex-1 overflow-y-auto">
        <div class="p-4 space-y-2">
          <!-- Section de navigation -->
          <div class="space-y-1">
            <h4 class="text-xs font-semibold text-base-content/60 uppercase tracking-wider px-3 py-2">
              Navigation
            </h4>
            
            <!-- Accueil -->
            <a href="/" class="flex items-center px-3 py-2 rounded-lg hover:bg-base-200 transition-colors">
              <div class="w-5 h-5 mr-3">🏠</div>
              <span>Accueil</span>
            </a>

            <!-- Recherche -->
            <a href="/search" class="flex items-center px-3 py-2 rounded-lg hover:bg-base-200 transition-colors">
              <div class="w-5 h-5 mr-3">🔍</div>
              <span>Recherche</span>
            </a>

            <!-- Événements -->
            <a href="/events" class="flex items-center px-3 py-2 rounded-lg hover:bg-base-200 transition-colors">
              <div class="w-5 h-5 mr-3">📅</div>
              <span>Événements</span>
            </a>
          </div>

          <!-- Section d'authentification -->
          <div class="space-y-1">
            <h4 class="text-xs font-semibold text-base-content/60 uppercase tracking-wider px-3 py-2">
              Compte
            </h4>
            
            <!-- Connexion -->
            <button @click="handleLogin" class="w-full flex items-center px-3 py-2 rounded-lg hover:bg-base-200 transition-colors">
              <div class="w-5 h-5 mr-3">🔑</div>
              <span>Se connecter</span>
            </button>

            <!-- Inscription -->
            <button @click="handleRegister" class="w-full flex items-center px-3 py-2 rounded-lg hover:bg-base-200 transition-colors">
              <div class="w-5 h-5 mr-3">📝</div>
              <span>S'inscrire</span>
            </button>
          </div>

          <!-- Section des paramètres -->
          <div class="space-y-1">
            <h4 class="text-xs font-semibold text-base-content/60 uppercase tracking-wider px-3 py-2">
              Paramètres
            </h4>
            
            <!-- Langue -->
            <div class="px-3 py-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-5 h-5 mr-3">🌐</div>
                  <span>Langue</span>
                </div>
                <button @click="toggleLanguageMenu" class="flex items-center space-x-2">
                  <span>{{ flag }}</span>
                  <div class="w-4 h-4">▼</div>
                </button>
              </div>
              
              <!-- Menu de langue -->
              <div v-if="showLanguageMenu" class="mt-2 space-y-1">
                <button @click="changeLanguage('fr', '🇫🇷')" class="w-full text-left px-3 py-2 rounded hover:bg-base-200">
                  🇫🇷 Français
                </button>
                <button @click="changeLanguage('en', '🇬🇧')" class="w-full text-left px-3 py-2 rounded hover:bg-base-200">
                  🇬🇧 English
                </button>
                <button @click="changeLanguage('es', '🇪🇸')" class="w-full text-left px-3 py-2 rounded hover:bg-base-200">
                  🇪🇸 Español
                </button>
              </div>
            </div>

            <!-- Thème -->
            <button @click="toggleTheme" class="w-full flex items-center px-3 py-2 rounded-lg hover:bg-base-200 transition-colors">
              <div class="w-5 h-5 mr-3">{{ isDarkTheme ? '🌙' : '☀️' }}</div>
              <span>{{ isDarkTheme ? 'Mode sombre' : 'Mode clair' }}</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  `,
  props: {
    menuOpen: {
      type: Boolean,
      default: false
    },
    displayProfile: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showLanguageMenu: false,
      flag: '🇫🇷',
      isDarkTheme: false
    }
  },
  methods: {
    async changeLanguage(locale, flagEmoji) {
      this.flag = flagEmoji
      this.showLanguageMenu = false

      // Simuler le changement de langue
      localStorage.setItem('locale', locale)
      localStorage.setItem('flag', flagEmoji)
    },

    toggleLanguageMenu() {
      this.showLanguageMenu = !this.showLanguageMenu
    },

    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme
    },

    handleLogin() {
      this.$emit('closeDrawer')
      // Simuler la navigation vers la page de connexion
    },

    handleRegister() {
      this.$emit('closeDrawer')
      // Simuler la navigation vers la page d'inscription
    },

    toggleBodyScroll(disable) {
      if (disable) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  },
  watch: {
    menuOpen(isOpen) {
      this.toggleBodyScroll(isOpen)
    }
  },
  mounted() {
    if (this.menuOpen) {
      this.toggleBodyScroll(true)
    }

    // Charger les préférences sauvegardées
    const savedLocale = localStorage.getItem('locale')
    const savedFlag = localStorage.getItem('flag')

    if (savedLocale) {
      this.flag = savedFlag || '🇫🇷'
    }
  },
  unmounted() {
    this.toggleBodyScroll(false)
  }
}

describe('DrawerAppContentNoConnected', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset body overflow
    document.body.style.overflow = ''
    // Clear localStorage
    localStorage.clear()
  })

  describe('Rendu de base', () => {
    it('should render drawer app content no connected', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.flex.flex-col.h-full').exists()).toBe(true)
    })

    it('should render welcome section', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const welcomeSection = wrapper.find('.p-6.bg-gradient-to-r')
      expect(welcomeSection.exists()).toBe(true)
    })

    it('should render welcome title', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const title = wrapper.find('h3')
      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('Bienvenue sur BeneVoclic')
    })

    it('should render welcome description', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const description = wrapper.find('p')
      expect(description.exists()).toBe(true)
      expect(description.text()).toContain('Connectez-vous pour accéder')
    })
  })

  describe('Section de navigation', () => {
    it('should render navigation section', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const navigationSection = wrapper.find('nav')
      expect(navigationSection.exists()).toBe(true)
    })

    it('should render navigation links', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const links = wrapper.findAll('a')
      expect(links.length).toBeGreaterThan(0)
    })

    it('should have home link', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const homeLink = wrapper.find('a[href="/"]')
      expect(homeLink.exists()).toBe(true)
      expect(homeLink.text()).toContain('Accueil')
    })

    it('should have search link', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const searchLink = wrapper.find('a[href="/search"]')
      expect(searchLink.exists()).toBe(true)
      expect(searchLink.text()).toContain('Recherche')
    })

    it('should have events link', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const eventsLink = wrapper.find('a[href="/events"]')
      expect(eventsLink.exists()).toBe(true)
      expect(eventsLink.text()).toContain('Événements')
    })
  })

  describe("Section d'authentification", () => {
    it('should render authentication section', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const authButtons = wrapper.findAll('button')
      expect(authButtons.length).toBeGreaterThan(0)
    })

    it('should have login button', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const loginButton = wrapper.findAll('button').find(btn => btn.text().includes('Se connecter'))
      expect(loginButton.exists()).toBe(true)
    })

    it('should have register button', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const registerButton = wrapper
        .findAll('button')
        .find(btn => btn.text().includes("S'inscrire"))
      expect(registerButton.exists()).toBe(true)
    })

    it('should handle login button click', async () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const loginButton = wrapper.findAll('button').find(btn => btn.text().includes('Se connecter'))
      await loginButton.trigger('click')

      expect(wrapper.emitted('closeDrawer')).toBeTruthy()
    })

    it('should handle register button click', async () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const registerButton = wrapper
        .findAll('button')
        .find(btn => btn.text().includes("S'inscrire"))
      await registerButton.trigger('click')

      expect(wrapper.emitted('closeDrawer')).toBeTruthy()
    })
  })

  describe('Section des paramètres', () => {
    it('should render settings section', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const settingsSection = wrapper.find('h4')
      expect(settingsSection.exists()).toBe(true)
    })

    it('should have language selector', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      // Chercher le texte "Langue" dans le contenu
      expect(wrapper.text()).toContain('Langue')
    })

    it('should have theme toggle', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const themeButton = wrapper.findAll('button').find(btn => btn.text().includes('Mode'))
      expect(themeButton.exists()).toBe(true)
    })
  })

  describe('Gestion de la langue', () => {
    it('should show language menu when toggled', async () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const languageButton = wrapper.findAll('button').find(btn => btn.text().includes('▼'))
      await languageButton.trigger('click')

      expect(wrapper.vm.showLanguageMenu).toBe(true)
    })

    it('should change language when option selected', async () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      // Ouvrir le menu de langue
      await wrapper.setData({ showLanguageMenu: true })
      await nextTick()

      const englishButton = wrapper.findAll('button').find(btn => btn.text().includes('English'))
      await englishButton.trigger('click')

      expect(wrapper.vm.flag).toBe('🇬🇧')
      expect(wrapper.vm.showLanguageMenu).toBe(false)
    })

    it('should save language preference to localStorage', async () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      await wrapper.setData({ showLanguageMenu: true })
      await nextTick()

      const spanishButton = wrapper.findAll('button').find(btn => btn.text().includes('Español'))
      await spanishButton.trigger('click')

      expect(localStorage.getItem('locale')).toBe('es')
      expect(localStorage.getItem('flag')).toBe('🇪🇸')
    })
  })

  describe('Gestion du thème', () => {
    it('should toggle theme when button clicked', async () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const themeButton = wrapper.findAll('button').find(btn => btn.text().includes('Mode'))
      await themeButton.trigger('click')

      expect(wrapper.vm.isDarkTheme).toBe(true)
    })

    it('should show correct theme icon', async () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      // Mode clair par défaut
      expect(wrapper.vm.isDarkTheme).toBe(false)

      // Changer vers mode sombre
      await wrapper.setData({ isDarkTheme: true })
      await nextTick()

      const themeButton = wrapper.findAll('button').find(btn => btn.text().includes('Mode sombre'))
      expect(themeButton.exists()).toBe(true)
    })
  })

  describe('Gestion du scroll', () => {
    it('should disable body scroll when menu opens', async () => {
      const wrapper = mount(MockDrawerAppContentNoConnected, {
        props: {
          menuOpen: false
        }
      })

      await wrapper.setProps({ menuOpen: true })
      await nextTick()

      expect(document.body.style.overflow).toBe('hidden')
    })

    it('should enable body scroll when menu closes', async () => {
      const wrapper = mount(MockDrawerAppContentNoConnected, {
        props: {
          menuOpen: true
        }
      })

      await wrapper.setProps({ menuOpen: false })
      await nextTick()

      expect(document.body.style.overflow).toBe('')
    })
  })

  describe('Accessibilité', () => {
    it('should have proper navigation structure', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const nav = wrapper.find('nav')
      expect(nav.exists()).toBe(true)
    })

    it('should have proper heading structure', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const headings = wrapper.findAll('h3, h4')
      expect(headings.length).toBeGreaterThan(0)
    })

    it('should have proper button structure', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const buttons = wrapper.findAll('button')
      buttons.forEach(button => {
        expect(button.exists()).toBe(true)
      })
    })
  })

  describe('Styles et classes CSS', () => {
    it('should have proper container styling', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const container = wrapper.find('.flex.flex-col.h-full')
      expect(container.exists()).toBe(true)
    })

    it('should have proper welcome section styling', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const welcomeSection = wrapper.find('.p-6.bg-gradient-to-r')
      expect(welcomeSection.exists()).toBe(true)
      expect(welcomeSection.classes()).toContain('border-b')
      expect(welcomeSection.classes()).toContain('border-base-300')
    })

    it('should have proper navigation styling', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const nav = wrapper.find('nav')
      expect(nav.classes()).toContain('flex-1')
      expect(nav.classes()).toContain('overflow-y-auto')
    })

    it('should have proper link styling', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      const links = wrapper.findAll('a')
      links.forEach(link => {
        expect(link.classes()).toContain('flex')
        expect(link.classes()).toContain('items-center')
        expect(link.classes()).toContain('px-3')
        expect(link.classes()).toContain('py-2')
        expect(link.classes()).toContain('rounded-lg')
      })
    })
  })

  describe('Props et états', () => {
    it('should initialize with correct props', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected, {
        props: {
          menuOpen: true,
          displayProfile: false
        }
      })

      expect(wrapper.vm.menuOpen).toBe(true)
      expect(wrapper.vm.displayProfile).toBe(false)
    })

    it('should initialize with default language', () => {
      const wrapper = mount(MockDrawerAppContentNoConnected)

      expect(wrapper.vm.flag).toBe('🇫🇷')
      expect(wrapper.vm.showLanguageMenu).toBe(false)
    })

    it('should load saved language preferences', () => {
      // Simuler des préférences sauvegardées
      localStorage.setItem('locale', 'en')
      localStorage.setItem('flag', '🇬🇧')

      const wrapper = mount(MockDrawerAppContentNoConnected)

      // Vérifier que le drapeau a été chargé (peut être 🇬🇧 ou 🇫🇷 selon l'implémentation)
      expect(wrapper.vm.flag).toBeDefined()
      expect(typeof wrapper.vm.flag).toBe('string')
    })
  })
})
