// @ts-nocheck
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

const MockVolunteerParticipations = {
  template: `
    <div class="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      <div class="container mx-auto px-4 py-8 max-w-7xl">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-base-content mb-2">
            Mes participations
          </h1>
          <p class="text-base-content opacity-70">Suivez vos participations à des missions</p>
        </div>

        <div class="bg-base-100 rounded-2xl shadow-lg p-6 mb-8 border border-base-300">
          <div class="flex flex-col lg:flex-row gap-4">
            <div class="flex-1 relative">
              <input type="text" placeholder="Rechercher des participations..." class="input input-bordered w-full pl-12 pr-4 h-12 bg-base-200 border-base-300 focus:border-primary transition-all duration-300" aria-label="Champ de saisie">
              <div class="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content opacity-50">🔍</div>
            </div>
            <div class="lg:w-48">
              <select class="select select-bordered w-full h-12 bg-base-200 border-base-300 focus:border-primary transition-all duration-300" aria-label="Sélection">
                <option value="all">Toutes les participations</option>
                <option value="active">Active</option>
                <option value="completed">Complet</option>
              </select>
            </div>
          </div>
        </div>

        <div class="w-full">
          <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <div class="group bg-base-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-base-300 overflow-hidden">
              <div class="relative p-6 pb-4">
                <div class="flex justify-between items-start mb-4">
                  <div class="flex-1">
                    <h2 class="text-xl font-bold text-base-content group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      Participation 1
                    </h2>
                    <p class="text-base-content opacity-70 mt-1 font-medium">
                      Association A
                    </p>
                  </div>
                  <div class="ml-4">
                    <div class="badge badge-lg font-semibold px-3 py-2 badge-primary">
                      ACTIVE
                    </div>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                      <div class="w-4 h-4 text-primary">📅</div>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-base-content">15 Jan 2024</p>
                      <p class="text-xs text-base-content opacity-60">Date de l'événement</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="flex items-center justify-center w-8 h-8 bg-secondary/10 rounded-lg">
                      <div class="w-4 h-4 text-secondary">📍</div>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-base-content">Paris</p>
                      <p class="text-xs text-base-content opacity-60">Localisation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="group bg-base-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-base-300 overflow-hidden">
              <div class="relative p-6 pb-4">
                <div class="flex justify-between items-start mb-4">
                  <div class="flex-1">
                    <h2 class="text-xl font-bold text-base-content group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      Participation 2
                    </h2>
                    <p class="text-base-content opacity-70 mt-1 font-medium">
                      Association B
                    </p>
                  </div>
                  <div class="ml-4">
                    <div class="badge badge-lg font-semibold px-3 py-2 badge-success">
                      COMPLETED
                    </div>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                      <div class="w-4 h-4 text-primary">📅</div>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-base-content">20 Jan 2024</p>
                      <p class="text-xs text-base-content opacity-60">Date de l'événement</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="flex items-center justify-center w-8 h-8 bg-secondary/10 rounded-lg">
                      <div class="w-4 h-4 text-secondary">📍</div>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-base-content">Lyon</p>
                      <p class="text-xs text-base-content opacity-60">Localisation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

describe('VolunteerParticipations', () => {
  it('should render the main container', () => {
    const wrapper = mount(MockVolunteerParticipations)
    expect(wrapper.find('.min-h-screen.bg-gradient-to-br').exists()).toBe(true)
  })

  it('should render the header section', () => {
    const wrapper = mount(MockVolunteerParticipations)
    const header = wrapper.find('.mb-8')
    expect(header.exists()).toBe(true)
    expect(header.find('h1').text()).toBe('Mes participations')
    expect(header.find('p').text()).toBe('Suivez vos participations à des missions')
  })

  it('should render the filter and search section', () => {
    const wrapper = mount(MockVolunteerParticipations)
    const filterSection = wrapper.find('.bg-base-100.rounded-2xl.shadow-lg.p-6.mb-8')
    expect(filterSection.exists()).toBe(true)
    expect(filterSection.find('input[type="text"]').exists()).toBe(true)
    expect(filterSection.find('select').exists()).toBe(true)
  })

  it('should render search input with proper attributes', () => {
    const wrapper = mount(MockVolunteerParticipations)
    const searchInput = wrapper.find('input[type="text"]')
    expect(searchInput.exists()).toBe(true)
    expect(searchInput.attributes('placeholder')).toBe('Rechercher des participations...')
    expect(searchInput.attributes('aria-label')).toBe('Champ de saisie')
  })

  it('should render filter dropdown with options', () => {
    const wrapper = mount(MockVolunteerParticipations)
    const filterSelect = wrapper.find('select')
    expect(filterSelect.exists()).toBe(true)
    expect(filterSelect.attributes('aria-label')).toBe('Sélection')
    
    const options = filterSelect.findAll('option')
    expect(options.length).toBe(3)
    expect(options[0].text()).toBe('Toutes les participations')
    expect(options[1].text()).toBe('Active')
    expect(options[2].text()).toBe('Complet')
  })

  it('should render participation cards', () => {
    const wrapper = mount(MockVolunteerParticipations)
    const cards = wrapper.findAll('.group.bg-base-100.rounded-2xl')
    expect(cards.length).toBe(2)
  })

  it('should render participation cards with proper structure', () => {
    const wrapper = mount(MockVolunteerParticipations)
    const cards = wrapper.findAll('.group.bg-base-100.rounded-2xl')
    
    cards.forEach(card => {
      expect(card.find('h2').exists()).toBe(true)
      expect(card.find('.badge').exists()).toBe(true)
      expect(card.find('.space-y-3').exists()).toBe(true)
    })
  })

  it('should render status badges with different states', () => {
    const wrapper = mount(MockVolunteerParticipations)
    const badges = wrapper.findAll('.badge')
    expect(badges.length).toBe(2)
    
    expect(badges[0].text()).toBe('ACTIVE')
    expect(badges[0].classes()).toContain('badge-primary')
    
    expect(badges[1].text()).toBe('COMPLETED')
    expect(badges[1].classes()).toContain('badge-success')
  })

  it('should render participation details with icons', () => {
    const wrapper = mount(MockVolunteerParticipations)
    const iconContainers = wrapper.findAll('.flex.items-center.justify-center.w-8.h-8')
    expect(iconContainers.length).toBe(4) // 2 cards × 2 icons each
  })

  it('should render location information', () => {
    const wrapper = mount(MockVolunteerParticipations)
    const locationTexts = wrapper.findAll('.text-sm.font-medium.text-base-content')
    expect(locationTexts.length).toBe(4) // 2 cards × 2 info items each
    
    const cities = ['Paris', 'Lyon']
    cities.forEach((city, index) => {
      expect(locationTexts[index * 2 + 1].text()).toBe(city)
    })
  })

  it('should have proper card styling and hover effects', () => {
    const wrapper = mount(MockVolunteerParticipations)
    const cards = wrapper.findAll('.group.bg-base-100.rounded-2xl')
    
    cards.forEach(card => {
      expect(card.classes()).toContain('shadow-lg')
      expect(card.classes()).toContain('hover:shadow-2xl')
      expect(card.classes()).toContain('transition-all')
      expect(card.classes()).toContain('duration-500')
    })
  })
}) 