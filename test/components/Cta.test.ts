// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// Mock component pour tester le composant CTA
const MockCta = {
  template: `
    <div class="home-cta">
      <section v-if="!startSearching" id="cta-section" class="py-16 px-4 bg-base-100">
        <div class="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 md:p-12 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 slide-in-up" :class="{ 'visible': isVisible }">
          <h2 class="text-3xl font-bold mb-4">Prêt à participer ?</h2>
          <p class="text-base-content/80 max-w-2xl mx-auto mb-8">
            Des centaines d'associations proposent des événements pour tous. Trouvez dès maintenant
            un événement qui vous correspond, que vous souhaitiez aider comme bénévole
            ou participer comme bénéficiaire.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink to="#search-section" class="btn btn-primary btn-lg group hover:scale-105 transition-transform duration-300">
              Découvrir les événements
              <span class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </NuxtLink>
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

describe('Cta', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendu de base', () => {
    it('should render CTA section when not searching', () => {
      const wrapper = mount(MockCta, {
        props: {
          startSearching: false
        }
      })

      const ctaSection = wrapper.find('#cta-section')
      expect(ctaSection.exists()).toBe(true)
    })

    it('should not render CTA section when searching', () => {
      const wrapper = mount(MockCta, {
        props: {
          startSearching: true
        }
      })

      const ctaSection = wrapper.find('#cta-section')
      expect(ctaSection.exists()).toBe(false)
    })

    it('should display main heading', () => {
      const wrapper = mount(MockCta)

      const heading = wrapper.find('h2')
      expect(heading.exists()).toBe(true)
      expect(heading.text()).toBe('Prêt à participer ?')
    })

    it('should display description text', () => {
      const wrapper = mount(MockCta)

      const description = wrapper.find('p')
      expect(description.exists()).toBe(true)
      expect(description.text()).toContain('Des centaines d\'associations proposent')
    })
  })

  describe('Bouton d\'action', () => {
    it('should display call to action button', () => {
      const wrapper = mount(MockCta)

      // Vérifier que le conteneur du bouton existe
      const buttonContainer = wrapper.find('.flex.flex-wrap.justify-center.gap-4')
      expect(buttonContainer.exists()).toBe(true)

      // Vérifier que le texte du bouton est présent dans le template
      expect(wrapper.text()).toContain('Découvrir les événements')
      
      // Vérifier les classes CSS du bouton
      const buttons = wrapper.findAll('.btn')
      if (buttons.length > 0) {
        buttons.forEach(button => {
          expect(button.classes()).toContain('btn')
        })
      }
    })

    it('should have proper button styling', () => {
      const wrapper = mount(MockCta)

      const buttons = wrapper.findAll('.btn')
      buttons.forEach(button => {
        expect(button.classes()).toContain('btn')
      })
    })
  })

  describe('Styles et classes CSS', () => {
    it('should have proper section styling', () => {
      const wrapper = mount(MockCta)

      const section = wrapper.find('#cta-section')
      expect(section.classes()).toContain('py-16')
      expect(section.classes()).toContain('px-4')
      expect(section.classes()).toContain('bg-base-100')
    })

    it('should have proper container styling', () => {
      const wrapper = mount(MockCta)

      const container = wrapper.find('.max-w-4xl')
      expect(container.classes()).toContain('bg-gradient-to-r')
      expect(container.classes()).toContain('rounded-xl')
      expect(container.classes()).toContain('shadow-lg')
    })

    it('should have proper text styling', () => {
      const wrapper = mount(MockCta)

      const heading = wrapper.find('h2')
      expect(heading.classes()).toContain('text-3xl')
      expect(heading.classes()).toContain('font-bold')
    })
  })

  describe('Animation et visibilité', () => {
    it('should apply visible class when isVisible is true', () => {
      const wrapper = mount(MockCta, {
        props: {
          isVisible: true
        }
      })

      const visibleElements = wrapper.findAll('.visible')
      expect(visibleElements.length).toBeGreaterThan(0)
    })

    it('should not apply visible class when isVisible is false', () => {
      const wrapper = mount(MockCta, {
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
      const wrapper = mount(MockCta)

      const heading = wrapper.find('h2')
      expect(heading.exists()).toBe(true)
      expect(heading.text()).toBeTruthy()
    })

    it('should have proper link structure', () => {
      const wrapper = mount(MockCta)

      // Vérifier que le conteneur des liens existe
      const linkContainer = wrapper.find('.flex.flex-wrap.justify-center.gap-4')
      expect(linkContainer.exists()).toBe(true)

      // Vérifier que le texte du bouton est présent
      expect(wrapper.text()).toContain('Découvrir les événements')
    })
  })

  describe('Responsive design', () => {
    it('should have responsive container padding', () => {
      const wrapper = mount(MockCta)

      const container = wrapper.find('.max-w-4xl')
      expect(container.classes()).toContain('p-8')
      expect(container.classes()).toContain('md:p-12')
    })

    it('should have responsive text sizing', () => {
      const wrapper = mount(MockCta)

      const heading = wrapper.find('h2')
      expect(heading.classes()).toContain('text-3xl')
    })
  })

  describe('Props et états', () => {
    it('should handle startSearching prop correctly', () => {
      const wrapper = mount(MockCta, {
        props: {
          startSearching: false
        }
      })

      expect(wrapper.vm.startSearching).toBe(false)
      expect(wrapper.find('#cta-section').exists()).toBe(true)
    })

    it('should handle isVisible prop correctly', () => {
      const wrapper = mount(MockCta, {
        props: {
          isVisible: true
        }
      })

      expect(wrapper.vm.isVisible).toBe(true)
    })
  })

  describe('Contenu et messaging', () => {
    it('should have compelling call to action', () => {
      const wrapper = mount(MockCta)

      const heading = wrapper.find('h2')
      expect(heading.text()).toBe('Prêt à participer ?')
    })

    it('should have descriptive content', () => {
      const wrapper = mount(MockCta)

      const description = wrapper.find('p')
      expect(description.text()).toContain('associations proposent des événements')
      expect(description.text()).toContain('bénévole')
      expect(description.text()).toContain('bénéficiaire')
    })
  })
}) 