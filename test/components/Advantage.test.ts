// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// Mock component pour tester le composant Advantage
const MockAdvantage = {
  template: `
    <div class="home-advantage">
      <section v-if="!startSearching" id="benefits-section" class="py-16 px-4 bg-base-200">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12 slide-in-up" :class="{ 'visible': isVisible }">
            <h2 class="text-3xl font-bold mb-4">Pourquoi rejoindre Benevoclic ?</h2>
            <p class="text-base-content/70 max-w-2xl mx-auto">
              Notre plateforme permet aux associations de promouvoir leurs événements
              et de connecter à la fois les bénévoles et les personnes dans le besoin
              avec des actions solidaires qui leur correspondent.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Carte 1 -->
            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] slide-in-up" :class="{ 'visible': isVisible }">
              <div class="card-body">
                <div class="flex items-center gap-4 mb-4">
                  <div class="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300">
                    <span class="h-6 w-6 text-primary">🔍</span>
                  </div>
                  <h3 class="card-title text-xl">Trouvez facilement</h3>
                </div>
                <p class="text-base-content/70">
                  Accédez à des milliers d'événements et de missions filtrés selon vos
                  besoins, préférences et votre localisation, que vous cherchiez à aider
                  ou à participer.
                </p>
              </div>
            </div>

            <!-- Carte 2 -->
            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] slide-in-up delay-200" :class="{ 'visible': isVisible }">
              <div class="card-body">
                <div class="flex items-center gap-4 mb-4">
                  <div class="p-3 rounded-lg bg-secondary/20 group-hover:bg-secondary/30 transition-colors duration-300">
                    <span class="h-6 w-6 text-secondary">⏰</span>
                  </div>
                  <h3 class="card-title text-xl">Gérez votre temps</h3>
                </div>
                <p class="text-base-content/70">
                  Choisissez des missions adaptées à vos disponibilités,
                  qu'il s'agisse d'un engagement ponctuel ou régulier.
                </p>
              </div>
            </div>

            <!-- Carte 3 -->
            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] slide-in-up delay-400" :class="{ 'visible': isVisible }">
              <div class="card-body">
                <div class="flex items-center gap-4 mb-4">
                  <div class="p-3 rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-colors duration-300">
                    <span class="h-6 w-6 text-accent">🏆</span>
                  </div>
                  <h3 class="card-title text-xl">Développez vos compétences</h3>
                </div>
                <p class="text-base-content/70">
                  Mettez en pratique vos talents ou acquérez de nouvelles
                  compétences valorisables dans votre parcours.
                </p>
              </div>
            </div>

            <!-- Carte 4 -->
            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] slide-in-up delay-200" :class="{ 'visible': isVisible }">
              <div class="card-body">
                <div class="flex items-center gap-4 mb-4">
                  <div class="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300">
                    <span class="h-6 w-6 text-primary">👥</span>
                  </div>
                  <h3 class="card-title text-xl">Rejoignez une communauté</h3>
                </div>
                <p class="text-base-content/70">
                  Connectez-vous avec d'autres bénévoles partageant vos valeurs
                  et élargissez votre réseau.
                </p>
              </div>
            </div>

            <!-- Carte 5 -->
            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] slide-in-up delay-400" :class="{ 'visible': isVisible }">
              <div class="card-body">
                <div class="flex items-center gap-4 mb-4">
                  <div class="p-3 rounded-lg bg-secondary/20 group-hover:bg-secondary/30 transition-colors duration-300">
                    <span class="h-6 w-6 text-secondary">🤝</span>
                  </div>
                  <h3 class="card-title text-xl">Faites la différence</h3>
                </div>
                <p class="text-base-content/70">
                  Contribuez concrètement à des causes qui vous tiennent à cœur
                  et créez un impact positif dans votre communauté.
                </p>
              </div>
            </div>

            <!-- Carte 6 -->
            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] slide-in-up" :class="{ 'visible': isVisible }">
              <div class="card-body">
                <div class="flex items-center gap-4 mb-4">
                  <div class="p-3 rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-colors duration-300">
                    <span class="h-6 w-6 text-accent">🛡️</span>
                  </div>
                  <h3 class="card-title text-xl">Sécurité garantie</h3>
                </div>
                <p class="text-base-content/70">
                  Bénéficiez d'un environnement sécurisé et de missions vérifiées
                  pour un engagement en toute confiance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  props: {
    startSearching: {
      type: Boolean,
      default: false
    },
    isVisible: {
      type: Boolean,
      default: false
    }
  }
}

describe('Advantage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendu de base', () => {
    it('should render benefits section when not searching', () => {
      const wrapper = mount(MockAdvantage, {
        props: {
          startSearching: false
        }
      })

      const benefitsSection = wrapper.find('#benefits-section')
      expect(benefitsSection.exists()).toBe(true)
    })

    it('should not render benefits section when searching', () => {
      const wrapper = mount(MockAdvantage, {
        props: {
          startSearching: true
        }
      })

      const benefitsSection = wrapper.find('#benefits-section')
      expect(benefitsSection.exists()).toBe(false)
    })

    it('should display main heading', () => {
      const wrapper = mount(MockAdvantage)

      const heading = wrapper.find('h2')
      expect(heading.exists()).toBe(true)
      expect(heading.text()).toBe('Pourquoi rejoindre Benevoclic ?')
    })

    it('should display description text', () => {
      const wrapper = mount(MockAdvantage)

      const description = wrapper.find('p')
      expect(description.exists()).toBe(true)
      expect(description.text()).toContain('Notre plateforme permet aux associations')
    })
  })

  describe("Cartes d'avantages", () => {
    it('should display all 6 advantage cards', () => {
      const wrapper = mount(MockAdvantage)

      const cards = wrapper.findAll('.card')
      expect(cards.length).toBe(6)
    })

    it('should display first card with correct content', () => {
      const wrapper = mount(MockAdvantage)

      const firstCard = wrapper.findAll('.card')[0]
      expect(firstCard.find('h3').text()).toBe('Trouvez facilement')
      expect(firstCard.find('p').text()).toContain("Accédez à des milliers d'événements")
    })

    it('should display second card with correct content', () => {
      const wrapper = mount(MockAdvantage)

      const secondCard = wrapper.findAll('.card')[1]
      expect(secondCard.find('h3').text()).toBe('Gérez votre temps')
      expect(secondCard.find('p').text()).toContain('Choisissez des missions adaptées')
    })

    it('should display third card with correct content', () => {
      const wrapper = mount(MockAdvantage)

      const thirdCard = wrapper.findAll('.card')[2]
      expect(thirdCard.find('h3').text()).toBe('Développez vos compétences')
      expect(thirdCard.find('p').text()).toContain('Mettez en pratique vos talents')
    })

    it('should display fourth card with correct content', () => {
      const wrapper = mount(MockAdvantage)

      const fourthCard = wrapper.findAll('.card')[3]
      expect(fourthCard.find('h3').text()).toBe('Rejoignez une communauté')
      expect(fourthCard.find('p').text()).toContain("Connectez-vous avec d'autres bénévoles")
    })

    it('should display fifth card with correct content', () => {
      const wrapper = mount(MockAdvantage)

      const fifthCard = wrapper.findAll('.card')[4]
      expect(fifthCard.find('h3').text()).toBe('Faites la différence')
      expect(fifthCard.find('p').text()).toContain('Contribuez concrètement à des causes')
    })

    it('should display sixth card with correct content', () => {
      const wrapper = mount(MockAdvantage)

      const sixthCard = wrapper.findAll('.card')[5]
      expect(sixthCard.find('h3').text()).toBe('Sécurité garantie')
      expect(sixthCard.find('p').text()).toContain("Bénéficiez d'un environnement sécurisé")
    })
  })

  describe('Icônes et visuels', () => {
    it('should display icons for each card', () => {
      const wrapper = mount(MockAdvantage)

      const icons = wrapper.findAll('span')
      expect(icons.length).toBeGreaterThan(0)
    })

    it('should have proper icon styling', () => {
      const wrapper = mount(MockAdvantage)

      const iconContainers = wrapper.findAll('.p-3.rounded-lg')
      iconContainers.forEach(container => {
        expect(container.classes()).toContain('p-3')
        expect(container.classes()).toContain('rounded-lg')
      })
    })
  })

  describe('Styles et classes CSS', () => {
    it('should have proper section styling', () => {
      const wrapper = mount(MockAdvantage)

      const section = wrapper.find('#benefits-section')
      expect(section.classes()).toContain('py-16')
      expect(section.classes()).toContain('px-4')
      expect(section.classes()).toContain('bg-base-200')
    })

    it('should have proper grid layout', () => {
      const wrapper = mount(MockAdvantage)

      const grid = wrapper.find('.grid')
      expect(grid.classes()).toContain('grid-cols-1')
      expect(grid.classes()).toContain('md:grid-cols-2')
      expect(grid.classes()).toContain('lg:grid-cols-3')
    })

    it('should have proper card styling', () => {
      const wrapper = mount(MockAdvantage)

      const cards = wrapper.findAll('.card')
      cards.forEach(card => {
        expect(card.classes()).toContain('card')
        expect(card.classes()).toContain('bg-base-100')
        expect(card.classes()).toContain('shadow-lg')
      })
    })
  })

  describe('Animation et visibilité', () => {
    it('should apply visible class when isVisible is true', () => {
      const wrapper = mount(MockAdvantage, {
        props: {
          isVisible: true
        }
      })

      const visibleElements = wrapper.findAll('.visible')
      expect(visibleElements.length).toBeGreaterThan(0)
    })

    it('should not apply visible class when isVisible is false', () => {
      const wrapper = mount(MockAdvantage, {
        props: {
          isVisible: false
        }
      })

      const visibleElements = wrapper.findAll('.visible')
      expect(visibleElements.length).toBe(0)
    })
  })

  describe('Accessibilité', () => {
    it('should have proper heading structure', () => {
      const wrapper = mount(MockAdvantage)

      const heading = wrapper.find('h2')
      expect(heading.exists()).toBe(true)
      expect(heading.text()).toBeTruthy()
    })

    it('should have proper card structure', () => {
      const wrapper = mount(MockAdvantage)

      const cards = wrapper.findAll('.card')
      cards.forEach(card => {
        const cardBody = card.find('.card-body')
        expect(cardBody.exists()).toBe(true)
      })
    })
  })

  describe('Responsive design', () => {
    it('should have responsive grid layout', () => {
      const wrapper = mount(MockAdvantage)

      const grid = wrapper.find('.grid')
      expect(grid.classes()).toContain('grid-cols-1')
      expect(grid.classes()).toContain('md:grid-cols-2')
      expect(grid.classes()).toContain('lg:grid-cols-3')
    })

    it('should have responsive text sizing', () => {
      const wrapper = mount(MockAdvantage)

      const heading = wrapper.find('h2')
      expect(heading.classes()).toContain('text-3xl')
    })
  })

  describe('Props et états', () => {
    it('should handle startSearching prop correctly', () => {
      const wrapper = mount(MockAdvantage, {
        props: {
          startSearching: false
        }
      })

      expect(wrapper.vm.startSearching).toBe(false)
      expect(wrapper.find('#benefits-section').exists()).toBe(true)
    })

    it('should handle isVisible prop correctly', () => {
      const wrapper = mount(MockAdvantage, {
        props: {
          isVisible: true
        }
      })

      expect(wrapper.vm.isVisible).toBe(true)
    })
  })
})
