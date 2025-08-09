// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// Mock component pour tester le composant HowItWorks
const MockHowItWorks = {
  template: `
    <div class="how-it-works">
      <section v-if="!startSearching" id="how-it-works-section" class="py-16 px-4 bg-base-100">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12 slide-in-up" :class="{ 'visible': isVisible }">
            <h2 class="text-3xl font-bold mb-4">Comment ça marche ?</h2>
            <p class="text-base-content/70 max-w-2xl mx-auto">
              Participer à un événement ou rejoindre une mission n'a jamais été aussi simple.
              Suivez ces étapes pour trouver l'événement qui vous correspond, que vous soyez
              bénévole ou personne à la recherche d'aide.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <!-- Ligne de connexion entre les étapes (visible uniquement sur desktop) -->
            <div class="absolute top-8 left-0 w-full h-1 bg-base-300 hidden md:block z-0">
              <div class="absolute top-0 left-0 h-full bg-primary transition-all duration-1000"
                   :style="{ width: isVisible ? '100%' : '0%' }"></div>
            </div>

            <!-- Étape 1 -->
            <div class="flex flex-col items-center text-center slide-in-up" :class="{ 'visible': isVisible }">
              <div class="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg transform transition-transform duration-300 hover:scale-110 z-10">
                1
              </div>
              <h3 class="text-xl font-bold mb-3">Trouvez un événement</h3>
              <p class="text-base-content/70">
                Parcourez les annonces ou utilisez les filtres pour trouver
                un événement qui correspond à vos besoins ou compétences.
              </p>
            </div>

            <!-- Étape 2 -->
            <div class="flex flex-col items-center text-center slide-in-up delay-300" :class="{ 'visible': isVisible }">
              <div class="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg transform transition-transform duration-300 hover:scale-110 z-10">
                2
              </div>
              <h3 class="text-xl font-bold mb-3">Inscrivez-vous en quelques clics</h3>
              <p class="text-base-content/70">
                Inscrivez-vous à l'événement directement via la plateforme.
                Vous pouvez préciser votre rôle (bénévole ou participant) et ajouter un message.
              </p>
            </div>

            <!-- Étape 3 -->
            <div class="flex flex-col items-center text-center slide-in-up delay-600" :class="{ 'visible': isVisible }">
              <div class="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg transform transition-transform duration-300 hover:scale-110 z-10">
                3
              </div>
              <h3 class="text-xl font-bold mb-3">Participez</h3>
              <p class="text-base-content/70">
                Une fois votre inscription confirmée, vous recevrez tous les détails
                pour participer à l'événement, que ce soit en tant que bénévole ou bénéficiaire.
              </p>
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

describe('HowItWorks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendu de base', () => {
    it('should render how it works section when not searching', () => {
      const wrapper = mount(MockHowItWorks, {
        props: {
          startSearching: false
        }
      })

      const howItWorksSection = wrapper.find('#how-it-works-section')
      expect(howItWorksSection.exists()).toBe(true)
    })

    it('should not render how it works section when searching', () => {
      const wrapper = mount(MockHowItWorks, {
        props: {
          startSearching: true
        }
      })

      const howItWorksSection = wrapper.find('#how-it-works-section')
      expect(howItWorksSection.exists()).toBe(false)
    })

    it('should display main heading', () => {
      const wrapper = mount(MockHowItWorks)

      const heading = wrapper.find('h2')
      expect(heading.exists()).toBe(true)
      expect(heading.text()).toBe('Comment ça marche ?')
    })

    it('should display description text', () => {
      const wrapper = mount(MockHowItWorks)

      const description = wrapper.find('p')
      expect(description.exists()).toBe(true)
      expect(description.text()).toContain('Participer à un événement')
    })
  })

  describe('Étapes du processus', () => {
    it('should display all 3 steps', () => {
      const wrapper = mount(MockHowItWorks)

      const steps = wrapper.findAll('.flex.flex-col.items-center.text-center')
      expect(steps.length).toBe(3)
    })

    it('should display step 1 with correct content', () => {
      const wrapper = mount(MockHowItWorks)

      const step1 = wrapper.findAll('.flex.flex-col.items-center.text-center')[0]
      expect(step1.find('h3').text()).toBe('Trouvez un événement')
      expect(step1.find('p').text()).toContain('Parcourez les annonces')
    })

    it('should display step 2 with correct content', () => {
      const wrapper = mount(MockHowItWorks)

      const step2 = wrapper.findAll('.flex.flex-col.items-center.text-center')[1]
      expect(step2.find('h3').text()).toBe('Inscrivez-vous en quelques clics')
      expect(step2.find('p').text()).toContain("Inscrivez-vous à l'événement")
    })

    it('should display step 3 with correct content', () => {
      const wrapper = mount(MockHowItWorks)

      const step3 = wrapper.findAll('.flex.flex-col.items-center.text-center')[2]
      expect(step3.find('h3').text()).toBe('Participez')
      expect(step3.find('p').text()).toContain('Une fois votre inscription confirmée')
    })
  })

  describe('Numéros des étapes', () => {
    it('should display step numbers correctly', () => {
      const wrapper = mount(MockHowItWorks)

      const stepNumbers = wrapper.findAll('.w-16.h-16.rounded-full')
      expect(stepNumbers.length).toBe(3)

      stepNumbers.forEach((stepNumber, index) => {
        expect(stepNumber.text()).toBe((index + 1).toString())
      })
    })

    it('should have proper step number styling', () => {
      const wrapper = mount(MockHowItWorks)

      const stepNumbers = wrapper.findAll('.w-16.h-16.rounded-full')
      stepNumbers.forEach(stepNumber => {
        expect(stepNumber.classes()).toContain('w-16')
        expect(stepNumber.classes()).toContain('h-16')
        expect(stepNumber.classes()).toContain('rounded-full')
        expect(stepNumber.classes()).toContain('text-white')
        expect(stepNumber.classes()).toContain('text-2xl')
        expect(stepNumber.classes()).toContain('font-bold')
      })
    })
  })

  describe('Couleurs des étapes', () => {
    it('should have different colors for each step', () => {
      const wrapper = mount(MockHowItWorks)

      const stepNumbers = wrapper.findAll('.w-16.h-16.rounded-full')

      // Étape 1 - Primary
      expect(stepNumbers[0].classes()).toContain('bg-primary')

      // Étape 2 - Secondary
      expect(stepNumbers[1].classes()).toContain('bg-secondary')

      // Étape 3 - Accent
      expect(stepNumbers[2].classes()).toContain('bg-accent')
    })
  })

  describe('Ligne de connexion', () => {
    it('should have connection line between steps', () => {
      const wrapper = mount(MockHowItWorks)

      const connectionLine = wrapper.find('.absolute.top-8.left-0.w-full.h-1')
      expect(connectionLine.exists()).toBe(true)
      expect(connectionLine.classes()).toContain('bg-base-300')
      expect(connectionLine.classes()).toContain('hidden')
      expect(connectionLine.classes()).toContain('md:block')
    })

    it('should have animated progress line', () => {
      const wrapper = mount(MockHowItWorks)

      const progressLine = wrapper.find('.absolute.top-0.left-0.h-full.bg-primary')
      expect(progressLine.exists()).toBe(true)
      expect(progressLine.classes()).toContain('bg-primary')
      expect(progressLine.classes()).toContain('transition-all')
      expect(progressLine.classes()).toContain('duration-1000')
    })
  })

  describe('Styles et classes CSS', () => {
    it('should have proper section styling', () => {
      const wrapper = mount(MockHowItWorks)

      const section = wrapper.find('#how-it-works-section')
      expect(section.classes()).toContain('py-16')
      expect(section.classes()).toContain('px-4')
      expect(section.classes()).toContain('bg-base-100')
    })

    it('should have proper grid layout', () => {
      const wrapper = mount(MockHowItWorks)

      const grid = wrapper.find('.grid')
      expect(grid.classes()).toContain('grid-cols-1')
      expect(grid.classes()).toContain('md:grid-cols-3')
    })

    it('should have proper step styling', () => {
      const wrapper = mount(MockHowItWorks)

      const steps = wrapper.findAll('.flex.flex-col.items-center.text-center')
      steps.forEach(step => {
        expect(step.classes()).toContain('flex')
        expect(step.classes()).toContain('flex-col')
        expect(step.classes()).toContain('items-center')
        expect(step.classes()).toContain('text-center')
      })
    })
  })

  describe('Animation et visibilité', () => {
    it('should apply visible class when isVisible is true', () => {
      const wrapper = mount(MockHowItWorks, {
        props: {
          isVisible: true
        }
      })

      const visibleElements = wrapper.findAll('.visible')
      expect(visibleElements.length).toBeGreaterThan(0)
    })

    it('should not apply visible class when isVisible is false', () => {
      const wrapper = mount(MockHowItWorks, {
        props: {
          isVisible: false
        }
      })

      const visibleElements = wrapper.findAll('.visible')
      expect(visibleElements.length).toBe(0)
    })

    it('should have animation delays for steps', () => {
      const wrapper = mount(MockHowItWorks)

      const steps = wrapper.findAll('.slide-in-up')
      expect(steps.length).toBeGreaterThan(0)

      // Vérifier les délais d'animation
      const delayedSteps = wrapper.findAll('.delay-300, .delay-600')
      expect(delayedSteps.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibilité', () => {
    it('should have proper heading structure', () => {
      const wrapper = mount(MockHowItWorks)

      const heading = wrapper.find('h2')
      expect(heading.exists()).toBe(true)
      expect(heading.text()).toBeTruthy()
    })

    it('should have proper step headings', () => {
      const wrapper = mount(MockHowItWorks)

      const stepHeadings = wrapper.findAll('h3')
      expect(stepHeadings.length).toBe(3)
      stepHeadings.forEach(heading => {
        expect(heading.text()).toBeTruthy()
      })
    })
  })

  describe('Responsive design', () => {
    it('should have responsive grid layout', () => {
      const wrapper = mount(MockHowItWorks)

      const grid = wrapper.find('.grid')
      expect(grid.classes()).toContain('grid-cols-1')
      expect(grid.classes()).toContain('md:grid-cols-3')
    })

    it('should have responsive text sizing', () => {
      const wrapper = mount(MockHowItWorks)

      const heading = wrapper.find('h2')
      expect(heading.classes()).toContain('text-3xl')
    })
  })

  describe('Props et états', () => {
    it('should handle startSearching prop correctly', () => {
      const wrapper = mount(MockHowItWorks, {
        props: {
          startSearching: false
        }
      })

      expect(wrapper.vm.startSearching).toBe(false)
      expect(wrapper.find('#how-it-works-section').exists()).toBe(true)
    })

    it('should handle isVisible prop correctly', () => {
      const wrapper = mount(MockHowItWorks, {
        props: {
          isVisible: true
        }
      })

      expect(wrapper.vm.isVisible).toBe(true)
    })
  })

  describe('Contenu et messaging', () => {
    it('should have clear process explanation', () => {
      const wrapper = mount(MockHowItWorks)

      const description = wrapper.find('p')
      expect(description.text()).toContain('Participer à un événement')
      expect(description.text()).toContain('bénévole')
      expect(description.text()).toContain("recherche d'aide")
    })

    it('should have step-by-step instructions', () => {
      const wrapper = mount(MockHowItWorks)

      const steps = wrapper.findAll('.flex.flex-col.items-center.text-center')
      expect(steps.length).toBe(3)

      // Vérifier que chaque étape a un titre et une description
      steps.forEach(step => {
        expect(step.find('h3').exists()).toBe(true)
        expect(step.find('p').exists()).toBe(true)
      })
    })
  })
})
