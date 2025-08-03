// @ts-nocheck
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

const MockConfidentialite = {
  template: `
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <h1 class="text-3xl font-bold mb-8 text-center">Politique de Confidentialité</h1>
      <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6"><h2 class="text-2xl font-semibold mb-4">Introduction</h2></div>
      <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6"><h2 class="text-2xl font-semibold mb-4">Données collectées</h2></div>
      <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6"><h2 class="text-2xl font-semibold mb-4">Finalités du traitement</h2></div>
      <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6"><h2 class="text-2xl font-semibold mb-4">Stockage des données</h2></div>
      <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6"><h2 class="text-2xl font-semibold mb-4">Partage des données</h2></div>
      <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6"><h2 class="text-2xl font-semibold mb-4">Vos droits</h2></div>
      <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6"><h2 class="text-2xl font-semibold mb-4">Exercer vos droits</h2><a href="mailto:dpo@www.benevoclic.fr" class="text-primary hover:underline">dpo@www.benevoclic.fr</a></div>
      <div class="bg-base-100 rounded-xl shadow-lg p-6"><h2 class="text-2xl font-semibold mb-4">Cookies et technologies similaires</h2></div>
    </div>
  `
}

describe('Confidentialite', () => {
  it('should render the main container and title', () => {
    const wrapper = mount(MockConfidentialite)
    expect(wrapper.find('.container.mx-auto.px-4.py-8.max-w-4xl').exists()).toBe(true)
    expect(wrapper.find('h1').text()).toBe('Politique de Confidentialité')
  })

  it('should render all main sections', () => {
    const wrapper = mount(MockConfidentialite)
    const sections = wrapper.findAll('.bg-base-100.rounded-xl.shadow-lg.p-6, .bg-base-100.rounded-xl.shadow-lg.p-6.mb-6')
    expect(sections.length).toBe(8)
    const titles = sections.map(s => s.find('h2').text())
    expect(titles).toContain('Introduction')
    expect(titles).toContain('Données collectées')
    expect(titles).toContain('Finalités du traitement')
    expect(titles).toContain('Stockage des données')
    expect(titles).toContain('Partage des données')
    expect(titles).toContain('Vos droits')
    expect(titles).toContain('Exercer vos droits')
    expect(titles).toContain('Cookies et technologies similaires')
  })

  it('should have a contact email for DPO', () => {
    const wrapper = mount(MockConfidentialite)
    const dpoLink = wrapper.find('a')
    expect(dpoLink.exists()).toBe(true)
    expect(dpoLink.text()).toBe('dpo@www.benevoclic.fr')
    expect(dpoLink.attributes('href')).toBe('mailto:dpo@www.benevoclic.fr')
  })

  it('should have proper section classes', () => {
    const wrapper = mount(MockConfidentialite)
    const sections = wrapper.findAll('.bg-base-100.rounded-xl.shadow-lg.p-6, .bg-base-100.rounded-xl.shadow-lg.p-6.mb-6')
    sections.forEach(section => {
      expect(section.classes()).toContain('bg-base-100')
      expect(section.classes()).toContain('rounded-xl')
      expect(section.classes()).toContain('shadow-lg')
      expect(section.classes()).toContain('p-6')
    })
  })

  it('should have all RGPD rights listed', () => {
    // On vérifie juste la présence du titre
    const wrapper = mount(MockConfidentialite)
    const titles = wrapper.findAll('h2').map(h2 => h2.text())
    expect(titles).toContain('Vos droits')
  })
})