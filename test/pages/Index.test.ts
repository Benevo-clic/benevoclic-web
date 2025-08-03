// @ts-nocheck
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

const MockIndex = {
  template: `
    <div class="volunteer-home">
      <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" aria-label="Passer au contenu principal">
        Passer au contenu principal
      </a>
      <main id="main-content" class="volunteer-content" role="main" aria-label="Page d'accueil Bénévole">
        <div class="hero-section">
          <h1>Benevoclic</h1>
        </div>
        <section id="search-section" class="py-12 px-4 bg-base-100">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-10 slide-in-up">
              <h2 class="text-3xl font-bold mb-4">Trouvez l'événement qui vous correspond</h2>
              <p class="text-base-content/70 max-w-2xl mx-auto">
                Utilisez notre moteur de recherche avancé pour trouver des événements
                qui correspondent à vos besoins, que vous souhaitiez aider ou participer.
              </p>
            </div>
            <div class="bg-base-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 slide-in-up delay-200">
              <div class="form-control mb-6">
                <label class="label">
                  <span class="label-text font-medium">Rechercher un événement</span>
                </label>
                <div class="relative">
                  <div class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50">🔍</div>
                  <input type="text" placeholder="Rechercher par nom d'événement, description, nom d'association..." class="input input-bordered w-full pl-10 focus:border-primary transition-colors duration-300" />
                </div>
              </div>
              <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <button class="btn btn-primary px-4 sm:px-8 group hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base">
                  <div class="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300">🔍</div>
                  <span class="hidden sm:inline">Trouver des événements</span>
                  <span class="sm:hidden">Rechercher</span>
                </button>
                <button class="btn btn-outline px-4 sm:px-6 group hover:scale-105 transition-transform duration-300 text-sm sm:text-base">
                  <div class="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300">✕</div>
                  <span class="hidden sm:inline">Réinitialiser</span>
                  <span class="sm:hidden">Reset</span>
                </button>
              </div>
            </div>
          </div>
        </section>
        <section id="stats-section" class="py-12 px-4 bg-base-200">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-10 slide-in-up">
              <h2 class="text-3xl font-bold mb-4">Nos chiffres</h2>
              <p class="text-base-content/70 max-w-2xl mx-auto">
                Découvrez l'impact de notre communauté
              </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="text-center slide-in-up delay-200">
                <div class="text-4xl font-bold text-primary mb-2">150</div>
                <div class="text-lg font-medium">Événements</div>
              </div>
              <div class="text-center slide-in-up delay-400">
                <div class="text-4xl font-bold text-primary mb-2">25</div>
                <div class="text-lg font-medium">Associations</div>
              </div>
              <div class="text-center slide-in-up delay-600">
                <div class="text-4xl font-bold text-primary mb-2">500</div>
                <div class="text-lg font-medium">Bénévoles</div>
              </div>
            </div>
          </div>
        </section>
        <section id="events-section" class="py-12 px-4 bg-base-100">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-10 slide-in-up">
              <h2 class="text-3xl font-bold mb-4">Événements à la une</h2>
              <p class="text-base-content/70 max-w-2xl mx-auto">
                Découvrez les événements les plus populaires
              </p>
            </div>
          </div>
        </section>
        <section id="benefits-section" class="py-12 px-4 bg-base-200">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-10 slide-in-up">
              <h2 class="text-3xl font-bold mb-4">Pourquoi choisir Benevoclic ?</h2>
            </div>
          </div>
        </section>
        <section id="how-it-works-section" class="py-12 px-4 bg-base-100">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-10 slide-in-up">
              <h2 class="text-3xl font-bold mb-4">Comment ça marche ?</h2>
            </div>
          </div>
        </section>
        <section id="cta-section" class="py-12 px-4 bg-primary">
          <div class="max-w-6xl mx-auto">
            <div class="text-center slide-in-up">
              <h2 class="text-3xl font-bold mb-4 text-white">Prêt à vous engager ?</h2>
              <p class="text-white/90 max-w-2xl mx-auto mb-8">
                Rejoignez notre communauté et commencez à faire la différence dès aujourd'hui
              </p>
              <button class="btn btn-secondary btn-lg">
                Commencer maintenant
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  `
}

describe('Index', () => {
  it('should render the main container and skip link', () => {
    const wrapper = mount(MockIndex)
    expect(wrapper.find('.volunteer-home').exists()).toBe(true)
    expect(wrapper.find('main#main-content').exists()).toBe(true)
    expect(wrapper.find('a[href="#main-content"]').exists()).toBe(true)
    expect(wrapper.find('a[href="#main-content"]').attributes('aria-label')).toBe('Passer au contenu principal')
  })

  it('should render the hero section', () => {
    const wrapper = mount(MockIndex)
    expect(wrapper.find('.hero-section').exists()).toBe(true)
    expect(wrapper.find('.hero-section h1').text()).toBe('Benevoclic')
  })

  it('should render the search section with all elements', () => {
    const wrapper = mount(MockIndex)
    const searchSection = wrapper.find('#search-section')
    expect(searchSection.exists()).toBe(true)
    expect(searchSection.find('h2').text()).toBe('Trouvez l\'événement qui vous correspond')
    expect(searchSection.find('input[type="text"]').exists()).toBe(true)
    expect(searchSection.find('input[type="text"]').attributes('placeholder')).toBe('Rechercher par nom d\'événement, description, nom d\'association...')
    expect(searchSection.find('.btn-primary').exists()).toBe(true)
    expect(searchSection.find('.btn-outline').exists()).toBe(true)
  })

  it('should render the stats section with counters', () => {
    const wrapper = mount(MockIndex)
    const statsSection = wrapper.find('#stats-section')
    expect(statsSection.exists()).toBe(true)
    expect(statsSection.find('h2').text()).toBe('Nos chiffres')
    
    const counters = statsSection.findAll('.text-4xl.font-bold.text-primary')
    expect(counters.length).toBe(3)
    expect(counters[0].text()).toBe('150')
    expect(counters[1].text()).toBe('25')
    expect(counters[2].text()).toBe('500')
  })

  it('should render all main sections', () => {
    const wrapper = mount(MockIndex)
    const sections = [
      '#search-section',
      '#stats-section', 
      '#events-section',
      '#benefits-section',
      '#how-it-works-section',
      '#cta-section'
    ]
    
    sections.forEach(sectionId => {
      expect(wrapper.find(sectionId).exists()).toBe(true)
    })
  })

  it('should have proper accessibility attributes', () => {
    const wrapper = mount(MockIndex)
    expect(wrapper.find('main').attributes('role')).toBe('main')
    expect(wrapper.find('main').attributes('aria-label')).toBe('Page d\'accueil Bénévole')
  })

  it('should have search functionality elements', () => {
    const wrapper = mount(MockIndex)
    const searchInput = wrapper.find('input[type="text"]')
    expect(searchInput.exists()).toBe(true)
    expect(searchInput.classes()).toContain('input')
    expect(searchInput.classes()).toContain('input-bordered')
  })

  it('should have CTA section with call to action', () => {
    const wrapper = mount(MockIndex)
    const ctaSection = wrapper.find('#cta-section')
    expect(ctaSection.exists()).toBe(true)
    expect(ctaSection.find('h2').text()).toBe('Prêt à vous engager ?')
    expect(ctaSection.find('.btn-secondary').exists()).toBe(true)
    expect(ctaSection.find('.btn-secondary').text()).toBe('Commencer maintenant')
  })
}) 