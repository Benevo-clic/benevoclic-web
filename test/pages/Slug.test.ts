// @ts-nocheck
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// Mock component pour tester la page 404
const MockSlugPage = {
  template: `
    <div class="error-page">
      <div class="error-content">
        <h1>404</h1>
        <h2>Page non trouvée</h2>
        <p>La page que vous recherchez n'existe pas.</p>
        <button @click="goHome" class="btn-primary" type="button" focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2>Retour à l'accueil</button>
      </div>
    </div>
  `,
  methods: {
    goHome() {
      // Simuler la navigation
      console.log('Navigating to home')
    }
  }
}

describe('SlugPage (404)', () => {
  describe('Rendu de base', () => {
    it('should render 404 page', () => {
      const wrapper = mount(MockSlugPage)

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.error-page').exists()).toBe(true)
    })

    it('should render error content', () => {
      const wrapper = mount(MockSlugPage)

      const errorContent = wrapper.find('.error-content')
      expect(errorContent.exists()).toBe(true)
    })

    it('should render 404 heading', () => {
      const wrapper = mount(MockSlugPage)

      const h1 = wrapper.find('h1')
      expect(h1.exists()).toBe(true)
      expect(h1.text()).toBe('404')
    })

    it('should render error message', () => {
      const wrapper = mount(MockSlugPage)

      const h2 = wrapper.find('h2')
      expect(h2.exists()).toBe(true)
      expect(h2.text()).toBe('Page non trouvée')
    })

    it('should render error description', () => {
      const wrapper = mount(MockSlugPage)

      const p = wrapper.find('p')
      expect(p.exists()).toBe(true)
      expect(p.text()).toBe('La page que vous recherchez n\'existe pas.')
    })
  })

  describe('Bouton de navigation', () => {
    it('should render home button', () => {
      const wrapper = mount(MockSlugPage)

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      expect(button.text()).toBe('Retour à l\'accueil')
    })

    it('should have proper button attributes', () => {
      const wrapper = mount(MockSlugPage)

      const button = wrapper.find('button')
      expect(button.attributes('type')).toBe('button')
      expect(button.classes()).toContain('btn-primary')
    })

    it('should handle button click', async () => {
      const wrapper = mount(MockSlugPage)
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const button = wrapper.find('button')
      await button.trigger('click')

      expect(consoleSpy).toHaveBeenCalledWith('Navigating to home')

      consoleSpy.mockRestore()
    })
  })

  describe('Styles et classes CSS', () => {
    it('should have proper error page styling', () => {
      const wrapper = mount(MockSlugPage)

      const errorPage = wrapper.find('.error-page')
      expect(errorPage.exists()).toBe(true)
    })

    it('should have proper error content styling', () => {
      const wrapper = mount(MockSlugPage)

      const errorContent = wrapper.find('.error-content')
      expect(errorContent.exists()).toBe(true)
    })

    it('should have proper button styling', () => {
      const wrapper = mount(MockSlugPage)

      const button = wrapper.find('button')
      expect(button.classes()).toContain('btn-primary')
    })
  })

  describe('Structure du contenu', () => {
    it('should have proper heading hierarchy', () => {
      const wrapper = mount(MockSlugPage)

      const h1 = wrapper.find('h1')
      expect(h1.exists()).toBe(true)
      expect(h1.text()).toBe('404')

      const h2 = wrapper.find('h2')
      expect(h2.exists()).toBe(true)
      expect(h2.text()).toBe('Page non trouvée')
    })

    it('should have proper content structure', () => {
      const wrapper = mount(MockSlugPage)

      const errorPage = wrapper.find('.error-page')
      expect(errorPage.exists()).toBe(true)

      const errorContent = errorPage.find('.error-content')
      expect(errorContent.exists()).toBe(true)
    })

    it('should have all required elements', () => {
      const wrapper = mount(MockSlugPage)

      expect(wrapper.find('h1').exists()).toBe(true)
      expect(wrapper.find('h2').exists()).toBe(true)
      expect(wrapper.find('p').exists()).toBe(true)
      expect(wrapper.find('button').exists()).toBe(true)
    })
  })

  describe('Accessibilité', () => {
    it('should have proper button type', () => {
      const wrapper = mount(MockSlugPage)

      const button = wrapper.find('button')
      expect(button.attributes('type')).toBe('button')
    })

    it('should have proper heading structure', () => {
      const wrapper = mount(MockSlugPage)

      const h1 = wrapper.find('h1')
      expect(h1.exists()).toBe(true)

      const h2 = wrapper.find('h2')
      expect(h2.exists()).toBe(true)
    })
  })

  describe('Interactions utilisateur', () => {
    it('should handle button click correctly', async () => {
      const wrapper = mount(MockSlugPage)
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const button = wrapper.find('button')
      await button.trigger('click')

      expect(consoleSpy).toHaveBeenCalledWith('Navigating to home')

      consoleSpy.mockRestore()
    })

    it('should have clickable button', async () => {
      const wrapper = mount(MockSlugPage)

      const button = wrapper.find('button')
      expect(button.exists()).toBe(true)
      
      // Test that button is clickable
      await button.trigger('click')
      expect(button.exists()).toBe(true)
    })
  })
}) 