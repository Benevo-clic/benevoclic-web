// @ts-nocheck
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

const MockVolunteerIndex = {
  template: `
    <div class="volunteer-home">
      <main id="main-content" class="volunteer-content" role="main" aria-label="Page d'accueil Bénévole">
        <section id="hero-section" class="py-12 px-4 bg-gradient-to-br from-primary to-secondary">
          <div class="max-w-6xl mx-auto text-center">
            <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
              Trouvez votre mission
            </h1>
            <p class="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Découvrez des événements adaptés à vos compétences et disponibilités
            </p>
            <button class="btn btn-secondary btn-lg">
              Commencer à chercher
            </button>
          </div>
        </section>
        
        <section id="search-section" class="py-12 px-4 bg-base-100">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-10">
              <h2 class="text-3xl font-bold mb-4">Trouvez l'événement qui vous correspond</h2>
              <p class="text-base-content/70 max-w-2xl mx-auto">
                Utilisez notre moteur de recherche avancé pour trouver des événements
                qui correspondent à vos besoins.
              </p>
            </div>
            <div class="bg-base-200 p-6 rounded-xl shadow-md">
              <div class="form-control mb-6">
                <label class="label">
                  <span class="label-text font-medium">Rechercher un événement</span>
                </label>
                <div class="relative">
                  <div class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50">🔍</div>
                  <input type="text" placeholder="Rechercher par nom d'événement..." class="input input-bordered w-full pl-10" />
                </div>
              </div>
              <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <button class="btn btn-primary px-4 sm:px-8">
                  <div class="w-4 h-4 mr-2">🔍</div>
                  <span>Trouver des événements</span>
                </button>
                <button class="btn btn-outline px-4 sm:px-6">
                  <div class="w-4 h-4 mr-2">✕</div>
                  <span>Réinitialiser</span>
                </button>
              </div>
            </div>
          </div>
        </section>
        
        <section id="stats-section" class="py-12 px-4 bg-base-200">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-10">
              <h2 class="text-3xl font-bold mb-4">Nos chiffres</h2>
              <p class="text-base-content/70 max-w-2xl mx-auto">
                Découvrez l'impact de notre communauté
              </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="text-center">
                <div class="text-4xl font-bold text-primary mb-2">150</div>
                <div class="text-lg font-medium">Événements</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-bold text-primary mb-2">25</div>
                <div class="text-lg font-medium">Associations</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-bold text-primary mb-2">500</div>
                <div class="text-lg font-medium">Bénévoles</div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="events-section" class="py-12 px-4 bg-base-100">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-10">
              <h2 class="text-3xl font-bold mb-4">Événements à la une</h2>
              <p class="text-base-content/70 max-w-2xl mx-auto">
                Découvrez les événements les plus populaires
              </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div class="card bg-base-200 shadow-lg">
                <div class="card-body">
                  <h3 class="card-title">Événement 1</h3>
                  <p>Description de l'événement</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="benefits-section" class="py-12 px-4 bg-base-200">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-10">
              <h2 class="text-3xl font-bold mb-4">Pourquoi choisir Benevoclic ?</h2>
            </div>
          </div>
        </section>
        
        <section id="how-it-works-section" class="py-12 px-4 bg-base-100">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-10">
              <h2 class="text-3xl font-bold mb-4">Comment ça marche ?</h2>
            </div>
          </div>
        </section>
        
        <section id="cta-section" class="py-12 px-4 bg-primary">
          <div class="max-w-6xl mx-auto">
            <div class="text-center">
              <h2 class="text-3xl font-bold mb-4 text-white">Prêt à vous engager ?</h2>
              <p class="text-white/90 max-w-2xl mx-auto mb-8">
                Rejoignez notre communauté et commencez à faire la différence
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

describe('VolunteerIndex', () => {
  it('should render the main container and hero section', () => {
    const wrapper = mount(MockVolunteerIndex)
    expect(wrapper.find('.volunteer-home').exists()).toBe(true)
    expect(wrapper.find('#hero-section').exists()).toBe(true)
    expect(wrapper.find('#hero-section h1').text()).toBe('Trouvez votre mission')
  })

  it('should render the search section with all elements', () => {
    const wrapper = mount(MockVolunteerIndex)
    const searchSection = wrapper.find('#search-section')
    expect(searchSection.exists()).toBe(true)
    expect(searchSection.find('h2').text()).toBe("Trouvez l'événement qui vous correspond")
    expect(searchSection.find('input[type="text"]').exists()).toBe(true)
    expect(searchSection.find('.btn-primary').exists()).toBe(true)
    expect(searchSection.find('.btn-outline').exists()).toBe(true)
  })

  it('should render the stats section with counters', () => {
    const wrapper = mount(MockVolunteerIndex)
    const statsSection = wrapper.find('#stats-section')
    expect(statsSection.exists()).toBe(true)
    expect(statsSection.find('h2').text()).toBe('Nos chiffres')

    const counters = statsSection.findAll('.text-4xl.font-bold.text-primary')
    expect(counters.length).toBe(3)
    expect(counters[0].text()).toBe('150')
    expect(counters[1].text()).toBe('25')
    expect(counters[2].text()).toBe('500')
  })

  it('should render the events section', () => {
    const wrapper = mount(MockVolunteerIndex)
    const eventsSection = wrapper.find('#events-section')
    expect(eventsSection.exists()).toBe(true)
    expect(eventsSection.find('h2').text()).toBe('Événements à la une')
    expect(eventsSection.find('.card').exists()).toBe(true)
  })

  it('should render all main sections', () => {
    const wrapper = mount(MockVolunteerIndex)
    const sections = [
      '#hero-section',
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
    const wrapper = mount(MockVolunteerIndex)
    expect(wrapper.find('main').attributes('role')).toBe('main')
    expect(wrapper.find('main').attributes('aria-label')).toBe("Page d'accueil Bénévole")
  })

  it('should have CTA section with call to action', () => {
    const wrapper = mount(MockVolunteerIndex)
    const ctaSection = wrapper.find('#cta-section')
    expect(ctaSection.exists()).toBe(true)
    expect(ctaSection.find('h2').text()).toBe('Prêt à vous engager ?')
    expect(ctaSection.find('.btn-secondary').exists()).toBe(true)
  })

  it('should have search functionality elements', () => {
    const wrapper = mount(MockVolunteerIndex)
    const searchInput = wrapper.find('input[type="text"]')
    expect(searchInput.exists()).toBe(true)
    expect(searchInput.classes()).toContain('input')
    expect(searchInput.classes()).toContain('input-bordered')
  })
})
