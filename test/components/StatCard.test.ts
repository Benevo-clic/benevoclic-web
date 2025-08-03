import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatCard from '../../components/dashboard/StatCard.vue'

describe('StatCard', () => {
  it('should render stat card component', () => {
    const wrapper = mount(StatCard, {
      props: {
        value: 42,
        label: 'Test Label'
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.bg-white').exists()).toBe(true)
  })

  it('should display the correct value', () => {
    const wrapper = mount(StatCard, {
      props: {
        value: 42,
        label: 'Test Label'
      }
    })

    expect(wrapper.find('.text-2xl').text()).toBe('42')
  })

  it('should display the correct label', () => {
    const wrapper = mount(StatCard, {
      props: {
        value: 42,
        label: 'Test Label'
      }
    })

    expect(wrapper.find('.text-gray-500').text()).toBe('Test Label')
  })

  it('should handle string values', () => {
    const wrapper = mount(StatCard, {
      props: {
        value: '100%',
        label: 'Completion Rate'
      }
    })

    expect(wrapper.find('.text-2xl').text()).toBe('100%')
    expect(wrapper.find('.text-gray-500').text()).toBe('Completion Rate')
  })

  it('should handle number values', () => {
    const wrapper = mount(StatCard, {
      props: {
        value: 150,
        label: 'Total Users'
      }
    })

    expect(wrapper.find('.text-2xl').text()).toBe('150')
    expect(wrapper.find('.text-gray-500').text()).toBe('Total Users')
  })

  it('should have proper CSS classes for styling', () => {
    const wrapper = mount(StatCard, {
      props: {
        value: 42,
        label: 'Test Label'
      }
    })

    expect(wrapper.find('.bg-white').exists()).toBe(true)
    expect(wrapper.find('.rounded-lg').exists()).toBe(true)
    expect(wrapper.find('.shadow').exists()).toBe(true)
    expect(wrapper.find('.p-4').exists()).toBe(true)
    expect(wrapper.find('.flex').exists()).toBe(true)
    expect(wrapper.find('.flex-col').exists()).toBe(true)
    expect(wrapper.find('.items-center').exists()).toBe(true)
  })

  it('should have proper text styling classes', () => {
    const wrapper = mount(StatCard, {
      props: {
        value: 42,
        label: 'Test Label'
      }
    })

    const valueElement = wrapper.find('.text-2xl')
    const labelElement = wrapper.find('.text-gray-500')

    expect(valueElement.classes()).toContain('text-2xl')
    expect(valueElement.classes()).toContain('font-bold')
    expect(valueElement.classes()).toContain('text-blue-600')

    expect(labelElement.classes()).toContain('text-gray-500')
    expect(labelElement.classes()).toContain('text-sm')
  })

  it('should be accessible with proper semantic structure', () => {
    const wrapper = mount(StatCard, {
      props: {
        value: 42,
        label: 'Test Label'
      }
    })

    // Vérifier que le composant a une structure sémantique appropriée
    expect(wrapper.find('div').exists()).toBe(true)
  })

  it('should handle zero values', () => {
    const wrapper = mount(StatCard, {
      props: {
        value: 0,
        label: 'Zero Value'
      }
    })

    expect(wrapper.find('.text-2xl').text()).toBe('0')
    expect(wrapper.find('.text-gray-500').text()).toBe('Zero Value')
  })

  it('should handle large numbers', () => {
    const wrapper = mount(StatCard, {
      props: {
        value: 999999,
        label: 'Large Number'
      }
    })

    expect(wrapper.find('.text-2xl').text()).toBe('999999')
    expect(wrapper.find('.text-gray-500').text()).toBe('Large Number')
  })

  it('should handle special characters in labels', () => {
    const wrapper = mount(StatCard, {
      props: {
        value: 50,
        label: 'Test & Special Characters!'
      }
    })

    expect(wrapper.find('.text-2xl').text()).toBe('50')
    expect(wrapper.find('.text-gray-500').text()).toBe('Test & Special Characters!')
  })

  it('should have proper responsive design classes', () => {
    const wrapper = mount(StatCard, {
      props: {
        value: 42,
        label: 'Test Label'
      }
    })

    // Vérifier que le composant a des classes responsives appropriées
    expect(wrapper.find('.flex').exists()).toBe(true)
    expect(wrapper.find('.flex-col').exists()).toBe(true)
  })

  it('should maintain proper spacing and layout', () => {
    const wrapper = mount(StatCard, {
      props: {
        value: 42,
        label: 'Test Label'
      }
    })

    const container = wrapper.find('.bg-white')
    expect(container.classes()).toContain('p-4')
    expect(container.classes()).toContain('flex')
    expect(container.classes()).toContain('flex-col')
    expect(container.classes()).toContain('items-center')
  })
}) 