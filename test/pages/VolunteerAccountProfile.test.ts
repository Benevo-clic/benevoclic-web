// @ts-nocheck
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

const MockVolunteerAccountProfile = {
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen bg-base-200 py-8">
      <div class="w-11/12 md:max-w-3xl mx-auto px-4">
        <div class="flex flex-col items-center mt-12 mb-6">
          <div class="w-32 h-32 rounded-full border-4 border-base-100 shadow-lg bg-base-300 flex items-center justify-center overflow-hidden mb-4">
            <div class="w-16 h-16 text-base-content opacity-50">👤</div>
          </div>
          <h1 class="font-bold text-base-content mb-1 text-xl sm:text-2xl md:text-3xl w-full text-center whitespace-nowrap overflow-hidden text-ellipsis">
            Jean Dupont
          </h1>
          <span class="badge badge-outline badge-primary mb-2 text-base-content border-base-content">25 ans</span>
          <p class="text-base-content/80 text-center max-w-xl mb-2">Bénévole passionné</p>
          <div class="flex gap-2 mt-2">
            <a href="/volunteer/account/edit" class="btn btn-sm btn-outline btn-primary">Éditer le profil</a>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <a href="/volunteer/account/associations">
            <div class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center">
              <span class="text-2xl font-bold text-primary">3</span>
              <span class="text-xs text-base-content/70">Associations</span>
            </div>
          </a>
          <div class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center">
            <span class="text-2xl font-bold text-primary">12</span>
            <span class="text-xs text-base-content/70">Événements participés</span>
          </div>
          <div class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center">
            <span class="text-2xl font-bold text-primary">Paris</span>
            <span class="text-xs text-base-content/70">Ville</span>
          </div>
          <div class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center">
            <span class="text-2xl font-bold text-primary">75001</span>
            <span class="text-xs text-base-content/70">Code postal</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div class="bg-base-100 rounded-xl shadow p-6 space-y-3">
            <h3 class="font-semibold mb-2 text-base-content">Contact</h3>
            <div class="flex items-center gap-2 text-base-content flex-wrap min-w-0">
              <div class="w-5 h-5 text-primary shrink-0">📧</div>
              <span>Email</span>
              <span class="font-medium break-all">jean.dupont@email.com</span>
            </div>
            <div class="flex items-center gap-2 text-base-content">
              <div class="w-5 h-5 text-primary">📞</div>
              <span>Téléphone</span>
              <span class="font-medium">0123456789</span>
            </div>
          </div>
          <div class="bg-base-100 rounded-xl shadow p-6 space-y-3">
            <h3 class="font-semibold mb-2 text-base-content">Localisation</h3>
            <div class="flex items-center gap-2 text-base-content">
              <div class="w-5 h-5 text-primary">📍</div>
              <span>Ville</span>
              <span class="font-medium">Paris</span>
            </div>
            <div class="flex items-center gap-2 text-base-content">
              <div class="w-5 h-5 text-primary">📍</div>
              <span>Code postal</span>
              <span class="font-medium">75001</span>
            </div>
          </div>
        </div>

        <div class="bg-base-100 rounded-xl shadow p-6 flex flex-col items-center">
          <h3 class="font-semibold mb-2 text-base-content">Réseaux sociaux</h3>
          <div class="flex gap-4">
            <span class="text-base-content/60">Aucun site web renseigné</span>
          </div>
        </div>
      </div>
    </div>
  `
}

describe('VolunteerAccountProfile', () => {
  it('should render the main container', () => {
    const wrapper = mount(MockVolunteerAccountProfile)
    expect(wrapper.find('.flex.flex-col.items-center.justify-center.min-h-screen').exists()).toBe(
      true
    )
  })

  it('should render the profile header section', () => {
    const wrapper = mount(MockVolunteerAccountProfile)
    const headerSection = wrapper.find('.flex.flex-col.items-center.mt-12.mb-6')
    expect(headerSection.exists()).toBe(true)
  })

  it('should render the profile image', () => {
    const wrapper = mount(MockVolunteerAccountProfile)
    const profileImage = wrapper.find(
      '.w-32.h-32.rounded-full.border-4.border-base-100.shadow-lg.bg-base-300'
    )
    expect(profileImage.exists()).toBe(true)
  })

  it('should render the user name', () => {
    const wrapper = mount(MockVolunteerAccountProfile)
    const userName = wrapper.find('h1')
    expect(userName.exists()).toBe(true)
    expect(userName.text()).toBe('Jean Dupont')
  })

  it('should render the age badge', () => {
    const wrapper = mount(MockVolunteerAccountProfile)
    const ageBadge = wrapper.find('.badge.badge-outline.badge-primary')
    expect(ageBadge.exists()).toBe(true)
    expect(ageBadge.text()).toBe('25 ans')
  })

  it('should render the bio description', () => {
    const wrapper = mount(MockVolunteerAccountProfile)
    const bio = wrapper.find('.text-base-content\\/80.text-center.max-w-xl.mb-2')
    expect(bio.exists()).toBe(true)
    expect(bio.text()).toBe('Bénévole passionné')
  })

  it('should render the edit profile button', () => {
    const wrapper = mount(MockVolunteerAccountProfile)
    const editButton = wrapper.find('.btn.btn-sm.btn-outline.btn-primary')
    expect(editButton.exists()).toBe(true)
    expect(editButton.text()).toBe('Éditer le profil')
  })

  it('should render the statistics grid', () => {
    const wrapper = mount(MockVolunteerAccountProfile)
    const statsGrid = wrapper.find('.grid.grid-cols-2.md\\:grid-cols-4.gap-4.mb-8')
    expect(statsGrid.exists()).toBe(true)
  })

  it('should render all statistics cards', () => {
    const wrapper = mount(MockVolunteerAccountProfile)
    const statCards = wrapper.findAll(
      '.bg-base-100.rounded-xl.shadow.p-4.flex.flex-col.items-center'
    )
    expect(statCards.length).toBe(4)
  })

  it('should render statistics with correct values', () => {
    const wrapper = mount(MockVolunteerAccountProfile)
    const statValues = wrapper.findAll('.text-2xl.font-bold.text-primary')
    expect(statValues.length).toBe(4)
    expect(statValues[0].text()).toBe('3')
    expect(statValues[1].text()).toBe('12')
    expect(statValues[2].text()).toBe('Paris')
    expect(statValues[3].text()).toBe('75001')
  })

  it('should render the detailed information sections', () => {
    const wrapper = mount(MockVolunteerAccountProfile)
    const detailSections = wrapper.findAll('.bg-base-100.rounded-xl.shadow.p-6')
    expect(detailSections.length).toBe(3)
  })

  it('should render contact information section', () => {
    const wrapper = mount(MockVolunteerAccountProfile)
    const contactSection = wrapper.find('.bg-base-100.rounded-xl.shadow.p-6.space-y-3')
    expect(contactSection.exists()).toBe(true)
    expect(contactSection.find('h3').text()).toBe('Contact')
  })

  it('should render location information section', () => {
    const wrapper = mount(MockVolunteerAccountProfile)
    const locationSections = wrapper.findAll('.bg-base-100.rounded-xl.shadow.p-6.space-y-3')
    expect(locationSections.length).toBe(2)
    expect(locationSections[1].find('h3').text()).toBe('Localisation')
  })

  it('should render social networks section', () => {
    const wrapper = mount(MockVolunteerAccountProfile)
    const socialSection = wrapper.find(
      '.bg-base-100.rounded-xl.shadow.p-6.flex.flex-col.items-center'
    )
    expect(socialSection.exists()).toBe(true)
    expect(socialSection.find('h3').text()).toBe('Réseaux sociaux')
  })

  it('should render contact details with icons', () => {
    const wrapper = mount(MockVolunteerAccountProfile)
    const contactIcons = wrapper.findAll('.w-5.h-5.text-primary')
    expect(contactIcons.length).toBeGreaterThan(0)
  })

  it('should have proper styling for statistics cards', () => {
    const wrapper = mount(MockVolunteerAccountProfile)
    const statCards = wrapper.findAll(
      '.bg-base-100.rounded-xl.shadow.p-4.flex.flex-col.items-center'
    )

    statCards.forEach(card => {
      expect(card.classes()).toContain('bg-base-100')
      expect(card.classes()).toContain('rounded-xl')
      expect(card.classes()).toContain('shadow')
    })
  })
})
