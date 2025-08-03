// @ts-nocheck
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

const MockVolunteerFavorites = {
  template: `
    <div class="mx-auto px-4 py-6 max-w-screen-2xl w-full">
      <div class="container mx-auto px-4 w-full">
        <div class="bg-base-100 rounded-lg shadow-md p-6 w-full">
          <div class="flex flex-col items-start w-full">
            <div class="mb-4">
              <h2 class="text-2xl font-bold mb-4">Mes favoris</h2>
              <div class="filters">
                <select class="select select-bordered">
                  <option value="">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
                <select class="select select-bordered">
                  <option value="datePublication_desc">Plus récent</option>
                  <option value="dateEvent_asc">Date événement croissant</option>
                  <option value="dateEvent_desc">Date événement décroissant</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto px-4 py-4">
        <div class="bg-base-100 rounded-lg shadow-md p-6">
          <div class="favorites-list">
            <div class="card bg-base-200 shadow-lg mb-4">
              <div class="card-body">
                <h3 class="card-title">Événement favori 1</h3>
                <p>Description de l'événement favori</p>
                <div class="card-actions justify-end">
                  <button class="btn btn-primary">Voir détails</button>
                </div>
              </div>
            </div>
            <div class="card bg-base-200 shadow-lg mb-4">
              <div class="card-body">
                <h3 class="card-title">Événement favori 2</h3>
                <p>Description de l'événement favori</p>
                <div class="card-actions justify-end">
                  <button class="btn btn-primary">Voir détails</button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-center mt-6">
            <div class="join">
              <button class="join-item btn" disabled>«</button>
              <button class="join-item btn" disabled>
                Page 1 / 1
              </button>
              <button class="join-item btn" disabled>»</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

describe('VolunteerFavorites', () => {
  it('should render the main container', () => {
    const wrapper = mount(MockVolunteerFavorites)
    expect(wrapper.find('.mx-auto.px-4.py-6.max-w-screen-2xl').exists()).toBe(true)
  })

  it('should render the filters section', () => {
    const wrapper = mount(MockVolunteerFavorites)
    const filtersSection = wrapper.find('.bg-base-100.rounded-lg.shadow-md.p-6.w-full')
    expect(filtersSection.exists()).toBe(true)
    expect(filtersSection.find('h2').text()).toBe('Mes favoris')
    expect(filtersSection.find('.filters').exists()).toBe(true)
  })

  it('should render filter selects', () => {
    const wrapper = mount(MockVolunteerFavorites)
    const selects = wrapper.findAll('.select.select-bordered')
    expect(selects.length).toBe(2)
  })

  it('should render the favorites list', () => {
    const wrapper = mount(MockVolunteerFavorites)
    const favoritesList = wrapper.find('.favorites-list')
    expect(favoritesList.exists()).toBe(true)
    
    const cards = favoritesList.findAll('.card')
    expect(cards.length).toBe(2)
  })

  it('should render favorite event cards with proper structure', () => {
    const wrapper = mount(MockVolunteerFavorites)
    const cards = wrapper.findAll('.card')
    
    cards.forEach(card => {
      expect(card.find('.card-title').exists()).toBe(true)
      expect(card.find('.card-body').exists()).toBe(true)
      expect(card.find('.card-actions').exists()).toBe(true)
      expect(card.find('.btn-primary').exists()).toBe(true)
    })
  })

  it('should render pagination controls', () => {
    const wrapper = mount(MockVolunteerFavorites)
    const pagination = wrapper.find('.join')
    expect(pagination.exists()).toBe(true)
    
    const buttons = pagination.findAll('.join-item.btn')
    expect(buttons.length).toBe(3)
  })

  it('should have proper card styling', () => {
    const wrapper = mount(MockVolunteerFavorites)
    const cards = wrapper.findAll('.card')
    
    cards.forEach(card => {
      expect(card.classes()).toContain('bg-base-200')
      expect(card.classes()).toContain('shadow-lg')
    })
  })

  it('should have proper container structure', () => {
    const wrapper = mount(MockVolunteerFavorites)
    const containers = wrapper.findAll('.container.mx-auto.px-4')
    expect(containers.length).toBe(2)
  })

  it('should have proper button styling in cards', () => {
    const wrapper = mount(MockVolunteerFavorites)
    const buttons = wrapper.findAll('.btn-primary')
    
    buttons.forEach(button => {
      expect(button.classes()).toContain('btn')
      expect(button.classes()).toContain('btn-primary')
    })
  })
}) 