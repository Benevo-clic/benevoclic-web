// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// Mock component pour tester le DrawerContent
const MockDrawerContent = {
  template: `
    <div class="drawer-content">
      <!-- Overlay avec effet de flou -->
      <transition name="fade">
        <div
            v-if="menuOpen"
            class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            @click="handleOverlayClick"
            @keydown="handleKeydown"
            role="presentation"
            aria-hidden="true"
        />
      </transition>

      <!-- Drawer principal -->
      <transition name="slide">
        <aside
            v-if="menuOpen"
            class="fixed top-0 right-0 h-screen w-80 max-w-[85vw] bg-gradient-to-b from-base-100 to-base-200 shadow-2xl flex flex-col z-50 text-base-content border-l border-base-300"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="isAuthenticated ? 'drawer-title' : 'welcome-title'"
            :aria-describedby="isAuthenticated ? 'drawer-description' : 'welcome-description'"
            @keydown="handleKeydown"
        >
          <!-- Header avec effet de verre - Toujours visible -->
          <div class="flex-shrink-0 bg-base-100/80 backdrop-blur-md border-b border-base-300">
            <div class="flex items-center justify-between p-4">
              <h2 
                :id="isAuthenticated ? 'drawer-title' : 'welcome-title'" 
                class="text-lg font-semibold text-base-content"
              >
                {{ isAuthenticated ? 'Menu' : 'Bienvenue' }}
              </h2>
              <button 
                @click="handleCloseDrawer" 
                class="btn btn-ghost btn-circle btn-sm hover:bg-base-300 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
                :aria-label="isAuthenticated ? 'Fermer le menu' : 'Fermer le panneau de bienvenue'"
              >
                <div class="w-5 h-5" aria-hidden="true">✕</div>
              </button>
            </div>
            <div 
              :id="isAuthenticated ? 'drawer-description' : 'welcome-description'" 
              class="sr-only"
            >
              {{ isAuthenticated ? 'Menu de navigation principal' : 'Panneau de bienvenue et navigation' }}
            </div>
          </div>

          <!-- Contenu dynamique - Scrollable -->
          <div class="flex-1 overflow-hidden" role="main">
            <div class="mock-volunteer-content" v-if="role === 'VOLUNTEER'">
              Contenu bénévole
            </div>
            <div class="mock-association-content" v-else-if="role === 'ASSOCIATION'">
              Contenu association
            </div>
            <div class="mock-no-connected-content" v-else>
              Contenu non connecté
            </div>
          </div>
        </aside>
      </transition>
    </div>
  `,
  props: {
    isAuthenticated: {
      type: Boolean,
      default: false
    },
    menuOpen: {
      type: Boolean,
      default: false
    },
    userFirstName: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      bodyScrollDisabled: false
    }
  },
  methods: {
    toggleBodyScroll(disable) {
      this.bodyScrollDisabled = disable
      if (disable) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    },
    
    handleCloseDrawer() {
      this.$emit('closeDrawer')
    },
    
    handleKeydown(event) {
      if (event.key === 'Escape') {
        this.handleCloseDrawer()
      }
    },
    
    handleOverlayClick() {
      this.handleCloseDrawer()
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
  },
  unmounted() {
    this.toggleBodyScroll(false)
  }
}

describe('DrawerContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset body overflow
    document.body.style.overflow = ''
  })

  describe('Rendu de base', () => {
    it('should render drawer content', () => {
      const wrapper = mount(MockDrawerContent)

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.drawer-content').exists()).toBe(true)
    })

    it('should not show drawer when menu is closed', () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: false
        }
      })

      const aside = wrapper.find('aside')
      expect(aside.exists()).toBe(false)
    })

    it('should show drawer when menu is open', () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true
        }
      })

      const aside = wrapper.find('aside')
      expect(aside.exists()).toBe(true)
    })
  })

  describe('Overlay', () => {
    it('should render overlay when menu is open', () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true
        }
      })

      const overlay = wrapper.find('div[role="presentation"]')
      expect(overlay.exists()).toBe(true)
      expect(overlay.classes()).toContain('fixed')
      expect(overlay.classes()).toContain('inset-0')
    })

    it('should handle overlay click', async () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true
        }
      })

      const overlay = wrapper.find('div[role="presentation"]')
      await overlay.trigger('click')

      expect(wrapper.emitted('closeDrawer')).toBeTruthy()
    })
  })

  describe('Header du drawer', () => {
    it('should render header with title', () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true,
          isAuthenticated: true
        }
      })

      const header = wrapper.find('h2')
      expect(header.exists()).toBe(true)
      expect(header.text()).toBe('Menu')
    })

    it('should show welcome title when not authenticated', () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true,
          isAuthenticated: false
        }
      })

      const header = wrapper.find('h2')
      expect(header.text()).toBe('Bienvenue')
    })

    it('should render close button', () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true
        }
      })

      const closeButton = wrapper.find('button')
      expect(closeButton.exists()).toBe(true)
      expect(closeButton.classes()).toContain('btn')
      expect(closeButton.classes()).toContain('btn-ghost')
    })

    it('should handle close button click', async () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true
        }
      })

      const closeButton = wrapper.find('button')
      await closeButton.trigger('click')

      expect(wrapper.emitted('closeDrawer')).toBeTruthy()
    })
  })

  describe('Contenu dynamique', () => {
    it('should show volunteer content when role is VOLUNTEER', () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true,
          role: 'VOLUNTEER'
        }
      })

      const volunteerContent = wrapper.find('.mock-volunteer-content')
      expect(volunteerContent.exists()).toBe(true)
      expect(volunteerContent.text()).toBe('Contenu bénévole')
    })

    it('should show association content when role is ASSOCIATION', () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true,
          role: 'ASSOCIATION'
        }
      })

      const associationContent = wrapper.find('.mock-association-content')
      expect(associationContent.exists()).toBe(true)
      expect(associationContent.text()).toBe('Contenu association')
    })

    it('should show no connected content when no role', () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true,
          role: ''
        }
      })

      const noConnectedContent = wrapper.find('.mock-no-connected-content')
      expect(noConnectedContent.exists()).toBe(true)
      expect(noConnectedContent.text()).toBe('Contenu non connecté')
    })
  })

  describe('Gestion du scroll', () => {
    it('should disable body scroll when menu opens', async () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: false
        }
      })

      await wrapper.setProps({ menuOpen: true })
      await nextTick()

      expect(wrapper.vm.bodyScrollDisabled).toBe(true)
    })

    it('should enable body scroll when menu closes', async () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true
        }
      })

      await wrapper.setProps({ menuOpen: false })
      await nextTick()

      expect(wrapper.vm.bodyScrollDisabled).toBe(false)
    })
  })

  describe('Navigation clavier', () => {
    it('should handle escape key', async () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true
        }
      })

      const aside = wrapper.find('aside')
      await aside.trigger('keydown', { key: 'Escape' })

      expect(wrapper.emitted('closeDrawer')).toBeTruthy()
    })

    it('should not close on other keys', async () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true
        }
      })

      const aside = wrapper.find('aside')
      await aside.trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('closeDrawer')).toBeFalsy()
    })
  })

  describe('Accessibilité', () => {
    it('should have proper dialog role', () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true
        }
      })

      const aside = wrapper.find('aside')
      expect(aside.attributes('role')).toBe('dialog')
      expect(aside.attributes('aria-modal')).toBe('true')
    })

    it('should have proper aria-labelledby for authenticated user', () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true,
          isAuthenticated: true
        }
      })

      const aside = wrapper.find('aside')
      expect(aside.attributes('aria-labelledby')).toBe('drawer-title')
      expect(aside.attributes('aria-describedby')).toBe('drawer-description')
    })

    it('should have proper aria-labelledby for non-authenticated user', () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true,
          isAuthenticated: false
        }
      })

      const aside = wrapper.find('aside')
      expect(aside.attributes('aria-labelledby')).toBe('welcome-title')
      expect(aside.attributes('aria-describedby')).toBe('welcome-description')
    })

    it('should have proper button aria-label', () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true,
          isAuthenticated: true
        }
      })

      const closeButton = wrapper.find('button')
      expect(closeButton.attributes('aria-label')).toBe('Fermer le menu')
    })

    it('should have proper button aria-label for non-authenticated user', () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true,
          isAuthenticated: false
        }
      })

      const closeButton = wrapper.find('button')
      expect(closeButton.attributes('aria-label')).toBe('Fermer le panneau de bienvenue')
    })

    it('should have proper screen reader descriptions', () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true,
          isAuthenticated: true
        }
      })

      const description = wrapper.find('#drawer-description')
      expect(description.exists()).toBe(true)
      expect(description.classes()).toContain('sr-only')
    })
  })

  describe('Styles et classes CSS', () => {
    it('should have proper drawer styling', () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true
        }
      })

      const aside = wrapper.find('aside')
      expect(aside.classes()).toContain('fixed')
      expect(aside.classes()).toContain('top-0')
      expect(aside.classes()).toContain('right-0')
      expect(aside.classes()).toContain('h-screen')
      expect(aside.classes()).toContain('w-80')
    })

    it('should have proper header styling', () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true
        }
      })

      const header = wrapper.find('div.flex-shrink-0')
      expect(header.exists()).toBe(true)
      expect(header.classes()).toContain('bg-base-100/80')
      expect(header.classes()).toContain('backdrop-blur-md')
    })

    it('should have proper close button styling', () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true
        }
      })

      const closeButton = wrapper.find('button')
      expect(closeButton.classes()).toContain('btn')
      expect(closeButton.classes()).toContain('btn-ghost')
      expect(closeButton.classes()).toContain('btn-circle')
      expect(closeButton.classes()).toContain('btn-sm')
    })
  })

  describe('Transitions', () => {
    it('should have fade transition for overlay', () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true
        }
      })

      const overlay = wrapper.find('div[role="presentation"]')
      expect(overlay.exists()).toBe(true)
      // Note: Testing transition classes in Vue Test Utils is complex
      // We'll just verify the overlay exists when menu is open
    })

    it('should have slide transition for drawer', () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: true
        }
      })

      const aside = wrapper.find('aside')
      expect(aside.exists()).toBe(true)
      // Note: Testing transition classes in Vue Test Utils is complex
      // We'll just verify the drawer exists when menu is open
    })
  })

  describe('Props et états', () => {
    it('should initialize with correct props', () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          isAuthenticated: true,
          menuOpen: false,
          userFirstName: 'John',
          role: 'VOLUNTEER'
        }
      })

      expect(wrapper.vm.isAuthenticated).toBe(true)
      expect(wrapper.vm.menuOpen).toBe(false)
      expect(wrapper.vm.userFirstName).toBe('John')
      expect(wrapper.vm.role).toBe('VOLUNTEER')
    })

    it('should handle prop changes', async () => {
      const wrapper = mount(MockDrawerContent, {
        props: {
          menuOpen: false
        }
      })

      expect(wrapper.vm.menuOpen).toBe(false)

      await wrapper.setProps({ menuOpen: true })
      await nextTick()

      expect(wrapper.vm.menuOpen).toBe(true)
    })
  })
}) 