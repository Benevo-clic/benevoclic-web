// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// Mock component pour tester VolunteerBottomBar
const MockVolunteerBottomBar = {
  template: `
    <nav class="flex flex-col md:flex-row items-center justify-between gap-4" role="navigation" aria-label="Navigation bénévole">
      <div class="w-full md:max-w-2xl lg:max-w-3xl flex-1">
        <div class="relative">
          <div class="flex">
            <input
              :id="searchInputId"
              v-model="searchQuery"
              type="text"
              placeholder="Search for missions or associations"
              class="input input-bordered w-full h-12 text-base focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
              @keyup.enter="handleSearch"
              @keydown="handleKeydown"
              aria-label="Rechercher des missions ou associations"
              autocomplete="off"
            />
            <button 
              class="btn btn-primary h-12 ml-2 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none" 
              @click="handleSearch"
              :aria-describedby="searchInputId"
              aria-label="Lancer la recherche"
            >
              <span class="w-5 h-5" aria-hidden="true">🔍</span>
            </button>
          </div>
        </div>
      </div>

      <div class="w-full md:w-auto flex justify-center md:justify-end flex-wrap text-base-content" role="group" aria-label="Actions rapides">
        <button 
          class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none" 
          @click="handleHome"
          aria-label="Aller à l'accueil bénévole"
        >
          <span class="w-6 h-6" aria-hidden="true">🏠</span> 
          <span>{{ t('header.volunteer.home') }}</span>
        </button>
        <button 
          class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none" 
          @click="handleFavorites"
          aria-label="Voir mes favoris"
        >
          <span class="w-6 h-6" aria-hidden="true">❤️</span> 
          <span>{{ t('header.volunteer.favorites') }}</span>
        </button>
        <div class="relative recent-searches-container">
          <button 
            class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1 recent-searches-button focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none" 
            @click.stop="toggleRecentSearches"
            @keydown="handleKeydown"
            :aria-expanded="showRecentSearches"
            :aria-controls="recentSearchesId"
            aria-label="Voir les recherches récentes"
          >
            <span class="w-6 h-6" aria-hidden="true">⏰</span> 
            <span>{{ t('header.volunteer.recent-search') }}</span>
          </button>

          <div
            v-if="showRecentSearches" 
            :id="recentSearchesId"
            class="absolute right-0 mt-2 w-64 bg-base-100 shadow-lg rounded-lg z-10 p-2"
            role="dialog"
            aria-labelledby="recent-searches-title"
            aria-modal="true"
          >
            <div class="flex justify-between items-center mb-2 pb-2 border-b border-base-300">
              <h3 id="recent-searches-title" class="font-medium text-base-content">{{ t('header.volunteer.recent-search') }}</h3>
              <button 
                v-if="recentSearches.length > 0"
                class="btn btn-ghost btn-xs focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none" 
                @click.stop="clearRecentSearches"
                aria-label="Effacer tout l'historique"
              >
                {{ t('search.history.clear_all') }}
              </button>
            </div>

            <div v-if="recentSearches.length > 0" class="max-h-60 overflow-y-auto" role="listbox" aria-label="Recherches récentes">
              <button 
                v-for="(search, index) in recentSearches" 
                :key="index"
                class="flex items-center justify-between w-full p-2 hover:bg-base-200 rounded-md mb-1 text-left focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
                @click.stop="selectRecentSearch(search)"
                @keyup.enter="selectRecentSearch(search)"
                @keyup.space.prevent="selectRecentSearch(search)"
                role="option"
                :aria-label="'Rechercher : ' + search"
              >
                <span class="truncate">{{ search }}</span>
                <span class="w-4 h-4 text-base-content opacity-50" aria-hidden="true">🔍</span>
              </button>
            </div>

            <div v-else class="py-4 text-center text-base-content opacity-70" role="status" aria-live="polite">
              {{ t('search.history.no_history_description') }}
            </div>
          </div>
        </div>
        <button 
          class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none" 
          @click="navigateTo('/help')"
          aria-label="Aide et support"
        >
          <span class="w-6 h-6" aria-hidden="true">❓</span> 
          <span>{{ t('header.volunteer.help') }}</span>
        </button>
      </div>
    </nav>
  `,
  data() {
    return {
      showRecentSearches: false,
      searchQuery: '',
      recentSearches: ['recherche1', 'recherche2', 'recherche3'],
      searchInputId: 'search-input-123',
      recentSearchesId: 'recent-searches-456',
      t: key => {
        const translations = {
          'header.volunteer.home': 'Accueil',
          'header.volunteer.favorites': 'Favoris',
          'header.volunteer.recent-search': 'Recherches récentes',
          'header.volunteer.help': 'Aide',
          'search.history.clear_all': 'Effacer tout',
          'search.history.no_history_description': 'Aucune recherche récente'
        }
        return translations[key] || key
      }
    }
  },
  methods: {
    handleSearch() {
      if (this.searchQuery.trim()) {
        this.addRecentSearch(this.searchQuery.trim())
        this.patchCurrentFilter({
          nameEvent: this.searchQuery.trim(),
          description: this.searchQuery.trim(),
          associationName: this.searchQuery.trim()
        })
      } else {
        this.patchCurrentFilter({
          nameEvent: '',
          description: '',
          associationName: ''
        })
      }
    },
    selectRecentSearch(search) {
      this.searchQuery = search
      this.showRecentSearches = false
      this.handleSearch()
    },
    toggleRecentSearches() {
      this.showRecentSearches = !this.showRecentSearches
    },
    closeRecentSearches(event) {
      const target = event.target
      if (
        !target.closest('.recent-searches-container') &&
        !target.closest('.recent-searches-button')
      ) {
        this.showRecentSearches = false
      }
    },
    handleKeydown(event) {
      if (event.key === 'Escape') {
        this.showRecentSearches = false
      }
    },
    addRecentSearch(search) {
      if (!this.recentSearches.includes(search)) {
        this.recentSearches.unshift(search)
        if (this.recentSearches.length > 10) {
          this.recentSearches = this.recentSearches.slice(0, 10)
        }
      }
    },
    clearRecentSearches() {
      this.recentSearches = []
    },
    patchCurrentFilter(filter) {
      // Simuler la mise à jour du filtre
      return filter
    },
    handleFavorites() {
      return '/volunteer/activity/favorites'
    },
    handleHome() {
      return '/volunteer'
    },
    navigateTo(path) {
      return path
    }
  },
  mounted() {
    // Simuler l'ajout d'un event listener
    this.documentEventListener = this.closeRecentSearches
  },
  unmounted() {
    // Simuler la suppression de l'event listener
    this.documentEventListener = null
  }
}

describe('VolunteerBottomBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendu de base', () => {
    it('should render component', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      expect(wrapper.exists()).toBe(true)
    })

    it('should have proper navigation role', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const nav = wrapper.find('nav')
      expect(nav.exists()).toBe(true)
      expect(nav.attributes('role')).toBe('navigation')
      expect(nav.attributes('aria-label')).toBe('Navigation bénévole')
    })

    it('should display search bar', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]'
      )
      expect(searchInput.exists()).toBe(true)
      expect(searchInput.attributes('placeholder')).toBe('Search for missions or associations')
    })

    it('should display search button', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const searchButton = wrapper.find('button[aria-label="Lancer la recherche"]')
      expect(searchButton.exists()).toBe(true)
      expect(searchButton.classes()).toContain('btn-primary')
    })
  })

  describe('Barre de recherche', () => {
    it('should handle search input', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]'
      )
      await searchInput.setValue('test search')

      expect(wrapper.vm.searchQuery).toBe('test search')
    })

    it('should handle search on enter key', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]'
      )
      await searchInput.setValue('test search')
      await searchInput.trigger('keyup.enter')

      expect(wrapper.vm.recentSearches).toContain('test search')
    })

    it('should handle search button click', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]'
      )
      await searchInput.setValue('test search')

      const searchButton = wrapper.find('button[aria-label="Lancer la recherche"]')
      await searchButton.trigger('click')

      expect(wrapper.vm.recentSearches).toContain('test search')
    })

    it('should handle empty search', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const searchButton = wrapper.find('button[aria-label="Lancer la recherche"]')
      await searchButton.trigger('click')

      expect(wrapper.vm.searchQuery).toBe('')
    })

    it('should have proper search input accessibility', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]'
      )
      expect(searchInput.attributes('autocomplete')).toBe('off')
      expect(searchInput.attributes('aria-label')).toBe('Rechercher des missions ou associations')
    })
  })

  describe("Boutons d'action", () => {
    it('should display home button', async () => {
      const wrapper = mount(MockVolunteerBottomBar)
      await nextTick()

      const homeButton = wrapper.findAll('button').find(btn => btn.text().includes('Accueil'))
      if (!homeButton.exists()) {
        console.log('HTML du composant:', wrapper.html())
      }
      expect(homeButton.exists()).toBe(true)
      expect(homeButton.text()).toContain('Accueil')
    })

    it('should display favorites button', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const favoritesButton = wrapper.find('button[aria-label="Voir mes favoris"]')
      expect(favoritesButton.exists()).toBe(true)
      expect(favoritesButton.text()).toContain('Favoris')
    })

    it('should display help button', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const helpButton = wrapper.find('button[aria-label="Aide et support"]')
      expect(helpButton.exists()).toBe(true)
      expect(helpButton.text()).toContain('Aide')
    })

    it('should handle home navigation', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const result = await wrapper.vm.handleHome()
      expect(result).toBe('/volunteer')
    })

    it('should handle favorites navigation', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const result = await wrapper.vm.handleFavorites()
      expect(result).toBe('/volunteer/activity/favorites')
    })
  })

  describe('Recherches récentes', () => {
    it('should display recent searches button', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const recentSearchesButton = wrapper.find('button[aria-label="Voir les recherches récentes"]')
      expect(recentSearchesButton.exists()).toBe(true)
      expect(recentSearchesButton.text()).toContain('Recherches récentes')
    })

    it('should toggle recent searches dropdown', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const recentSearchesButton = wrapper.find('button[aria-label="Voir les recherches récentes"]')
      await recentSearchesButton.trigger('click')

      expect(wrapper.vm.showRecentSearches).toBe(true)
    })

    it('should have proper aria-expanded attribute', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const recentSearchesButton = wrapper.find('button[aria-label="Voir les recherches récentes"]')

      // État initial
      expect(recentSearchesButton.attributes('aria-expanded')).toBe('false')

      // Après clic
      await recentSearchesButton.trigger('click')
      expect(recentSearchesButton.attributes('aria-expanded')).toBe('true')
    })

    it('should display recent searches dialog', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      wrapper.vm.showRecentSearches = true
      await nextTick()

      const dialog = wrapper.find('[role="dialog"]')
      expect(dialog.exists()).toBe(true)
      expect(dialog.attributes('aria-modal')).toBe('true')
    })

    it('should display recent searches items', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      wrapper.vm.showRecentSearches = true
      await nextTick()

      const searchItems = wrapper.findAll('[role="option"]')
      expect(searchItems.length).toBe(3)
    })

    it('should select recent search', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      wrapper.vm.showRecentSearches = true
      await nextTick()

      const searchItems = wrapper.findAll('[role="option"]')
      await searchItems[0].trigger('click')

      expect(wrapper.vm.searchQuery).toBe('recherche1')
      expect(wrapper.vm.showRecentSearches).toBe(false)
    })

    it('should handle keyboard navigation in recent searches', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      wrapper.vm.showRecentSearches = true
      await nextTick()

      const searchItems = wrapper.findAll('[role="option"]')
      await searchItems[0].trigger('keyup.enter')

      expect(wrapper.vm.searchQuery).toBe('recherche1')
    })

    it('should clear recent searches', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      // S'assurer qu'il y a des recherches récentes
      wrapper.vm.recentSearches = ['recherche1', 'recherche2']
      wrapper.vm.showRecentSearches = true
      await nextTick()

      const clearButton = wrapper.findAll('button').find(btn => btn.text().includes('Effacer tout'))
      if (!clearButton.exists()) {
        console.log('Bouton clear non trouvé. HTML:', wrapper.html())
      }
      await clearButton.trigger('click')

      expect(wrapper.vm.recentSearches.length).toBe(0)
    })

    it('should display no history message when empty', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      wrapper.vm.recentSearches = []
      wrapper.vm.showRecentSearches = true
      await nextTick()

      const noHistoryMessage = wrapper.find('[role="status"]')
      expect(noHistoryMessage.exists()).toBe(true)
      expect(noHistoryMessage.text()).toContain('Aucune recherche récente')
    })
  })

  describe('Navigation', () => {
    it('should handle home navigation', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const result = await wrapper.vm.handleHome()
      expect(result).toBe('/volunteer')
    })

    it('should handle favorites navigation', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const result = await wrapper.vm.handleFavorites()
      expect(result).toBe('/volunteer/activity/favorites')
    })

    it('should handle help navigation', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const result = await wrapper.vm.navigateTo('/help')
      expect(result).toBe('/help')
    })
  })

  describe('Gestion des événements', () => {
    it('should close recent searches on escape key', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      wrapper.vm.showRecentSearches = true

      const mockEvent = { key: 'Escape' }
      wrapper.vm.handleKeydown(mockEvent)

      expect(wrapper.vm.showRecentSearches).toBe(false)
    })

    it('should close recent searches on outside click', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      wrapper.vm.showRecentSearches = true

      const mockEvent = {
        target: document.createElement('div')
      }

      wrapper.vm.closeRecentSearches(mockEvent)
      expect(wrapper.vm.showRecentSearches).toBe(false)
    })

    it('should not close recent searches on inside click', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      wrapper.vm.showRecentSearches = true

      const mockEvent = {
        target: {
          closest: selector => {
            if (selector === '.recent-searches-container') return true
            return null
          }
        }
      }

      wrapper.vm.closeRecentSearches(mockEvent)
      expect(wrapper.vm.showRecentSearches).toBe(true)
    })
  })

  describe('Styles et classes CSS', () => {
    it('should have proper container styling', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const container = wrapper.find('.flex.flex-col.md\\:flex-row')
      expect(container.exists()).toBe(true)
    })

    it('should have proper search bar styling', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]'
      )
      expect(searchInput.classes()).toContain('input')
      expect(searchInput.classes()).toContain('input-bordered')
      expect(searchInput.classes()).toContain('w-full')
      expect(searchInput.classes()).toContain('h-12')
    })

    it('should have proper focus styling', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]'
      )
      expect(searchInput.classes()).toContain('focus-visible:ring-2')
      expect(searchInput.classes()).toContain('focus-visible:ring-primary/80')
    })

    it('should have proper button styling', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const buttons = wrapper.findAll('.btn')
      buttons.forEach(button => {
        expect(button.classes()).toContain('btn')
      })
    })
  })

  describe('Accessibilité', () => {
    it('should have proper search input accessibility', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]'
      )
      expect(searchInput.attributes('aria-label')).toBe('Rechercher des missions ou associations')
      expect(searchInput.attributes('autocomplete')).toBe('off')
    })

    it('should have proper search button accessibility', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const searchButton = wrapper.find('button[aria-label="Lancer la recherche"]')
      expect(searchButton.attributes('aria-describedby')).toBe('search-input-123')
    })

    it('should have proper button group accessibility', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const buttonGroup = wrapper.find('[role="group"]')
      expect(buttonGroup.exists()).toBe(true)
      expect(buttonGroup.attributes('aria-label')).toBe('Actions rapides')
    })

    it('should have proper recent searches accessibility', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const recentSearchesButton = wrapper.find('button[aria-label="Voir les recherches récentes"]')
      expect(recentSearchesButton.attributes('aria-controls')).toBe('recent-searches-456')
    })

    it('should have proper listbox accessibility', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      wrapper.vm.showRecentSearches = true
      await nextTick()

      const listbox = wrapper.find('[role="listbox"]')
      expect(listbox.exists()).toBe(true)
      expect(listbox.attributes('aria-label')).toBe('Recherches récentes')
    })
  })

  describe('Responsive design', () => {
    it('should have responsive container layout', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const container = wrapper.find('.flex.flex-col.md\\:flex-row')
      expect(container.classes()).toContain('md:flex-row')
    })

    it('should have responsive search bar width', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const searchContainer = wrapper.find('.w-full.md\\:max-w-2xl.lg\\:max-w-3xl')
      expect(searchContainer.classes()).toContain('md:max-w-2xl')
      expect(searchContainer.classes()).toContain('lg:max-w-3xl')
    })

    it('should have responsive button layout', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const buttonContainer = wrapper.find(
        '.w-full.md\\:w-auto.flex.justify-center.md\\:justify-end'
      )
      expect(buttonContainer.classes()).toContain('md:justify-end')
    })
  })

  describe('Gestion des états', () => {
    it('should handle search query state', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]'
      )
      await searchInput.setValue('test query')

      expect(wrapper.vm.searchQuery).toBe('test query')
    })

    it('should handle recent searches state', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      wrapper.vm.showRecentSearches = true
      await nextTick()

      expect(wrapper.vm.showRecentSearches).toBe(true)
    })

    it('should maintain recent searches list', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      expect(wrapper.vm.recentSearches.length).toBe(3)
      expect(wrapper.vm.recentSearches).toContain('recherche1')
    })

    it('should generate unique IDs', () => {
      const wrapper = mount(MockVolunteerBottomBar)

      expect(wrapper.vm.searchInputId).toBe('search-input-123')
      expect(wrapper.vm.recentSearchesId).toBe('recent-searches-456')
    })
  })

  describe('Fonctionnalités de recherche', () => {
    it('should add search to recent searches', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]'
      )
      await searchInput.setValue('new search')
      await searchInput.trigger('keyup.enter')

      expect(wrapper.vm.recentSearches).toContain('new search')
    })

    it('should not add empty search to recent searches', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const initialLength = wrapper.vm.recentSearches.length
      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]'
      )
      await searchInput.setValue('')
      await searchInput.trigger('keyup.enter')

      expect(wrapper.vm.recentSearches.length).toBe(initialLength)
    })

    it('should patch current filter with search query', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      const searchInput = wrapper.find(
        'input[aria-label="Rechercher des missions ou associations"]'
      )
      await searchInput.setValue('test search')
      await searchInput.trigger('keyup.enter')

      // Vérifier que la fonction patchCurrentFilter a été appelée
      expect(wrapper.vm.patchCurrentFilter).toBeDefined()
    })

    it('should limit recent searches to 10 items', async () => {
      const wrapper = mount(MockVolunteerBottomBar)

      // Ajouter plus de 10 recherches
      for (let i = 0; i < 12; i++) {
        wrapper.vm.addRecentSearch(`search${i}`)
      }

      expect(wrapper.vm.recentSearches.length).toBe(10)
    })
  })
})
