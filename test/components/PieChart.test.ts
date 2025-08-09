import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PieChart from '../../components/dashboard/PieChart.vue'

// Mock Chart.js de manière simple
vi.mock('chart.js/auto', () => ({
  default: vi.fn()
}))

describe('PieChart', () => {
  it('should render pie chart component', () => {
    const wrapper = mount(PieChart, {
      props: {
        labels: ['Red', 'Blue', 'Green'],
        data: [30, 40, 30],
        colors: ['#ff0000', '#0000ff', '#00ff00'],
        title: 'Test Chart'
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('[role="img"]').exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('should have proper accessibility attributes', () => {
    const wrapper = mount(PieChart, {
      props: {
        labels: ['Red', 'Blue', 'Green'],
        data: [30, 40, 30],
        title: 'Test Chart'
      }
    })

    const img = wrapper.find('[role="img"]')
    expect(img.exists()).toBe(true)
    expect(img.attributes('aria-label')).toContain('Test Chart')
    expect(img.attributes('aria-describedby')).toMatch(/chart-description-/)
  })

  it('should have proper CSS classes for styling', () => {
    const wrapper = mount(PieChart, {
      props: {
        labels: ['Red', 'Blue', 'Green'],
        data: [30, 40, 30]
      }
    })

    const container = wrapper.find('[role="img"]')
    expect(container.classes()).toContain('w-full')
    expect(container.classes()).toContain('h-full')
    expect(container.classes()).toContain('flex')
    expect(container.classes()).toContain('items-center')
    expect(container.classes()).toContain('justify-center')
  })

  it('should have proper canvas element with accessibility', () => {
    const wrapper = mount(PieChart, {
      props: {
        labels: ['Red', 'Blue', 'Green'],
        data: [30, 40, 30],
        title: 'Test Chart'
      }
    })

    const canvas = wrapper.find('canvas')
    expect(canvas.exists()).toBe(true)
    expect(canvas.element.tagName).toBe('CANVAS')
    expect(canvas.classes()).toContain('max-w-full')
    expect(canvas.classes()).toContain('max-h-full')
    expect(canvas.attributes('tabindex')).toBe('0')
    expect(canvas.attributes('aria-label')).toContain('Test Chart')
  })

  it('should generate proper chart description for screen readers', () => {
    const wrapper = mount(PieChart, {
      props: {
        labels: ['Red', 'Blue', 'Green'],
        data: [30, 40, 30],
        title: 'Test Chart'
      }
    })

    const description = wrapper.find('.sr-only')
    expect(description.exists()).toBe(true)
    expect(description.text()).toContain('Test Chart')
    expect(description.text()).toContain('Red: 30')
    expect(description.text()).toContain('Blue: 40')
    expect(description.text()).toContain('Green: 30')
  })

  it('should handle empty data arrays', () => {
    const wrapper = mount(PieChart, {
      props: {
        labels: [],
        data: [],
        title: 'Empty Chart'
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('should handle large datasets', () => {
    const largeLabels = Array.from({ length: 10 }, (_, i) => `Category ${i + 1}`)
    const largeData = Array.from({ length: 10 }, (_, i) => (i + 1) * 10)

    const wrapper = mount(PieChart, {
      props: {
        labels: largeLabels,
        data: largeData,
        title: 'Large Dataset'
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('should handle zero values', () => {
    const wrapper = mount(PieChart, {
      props: {
        labels: ['Red', 'Blue', 'Green'],
        data: [0, 50, 50],
        title: 'Zero Values'
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('should handle decimal values', () => {
    const wrapper = mount(PieChart, {
      props: {
        labels: ['Red', 'Blue', 'Green'],
        data: [33.33, 33.33, 33.34],
        title: 'Decimal Values'
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('should handle custom colors correctly', () => {
    const wrapper = mount(PieChart, {
      props: {
        labels: ['Red', 'Blue', 'Green'],
        data: [30, 40, 30],
        colors: ['#ff0000', '#0000ff', '#00ff00']
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('should generate unique IDs for accessibility', () => {
    const wrapper1 = mount(PieChart, {
      props: {
        labels: ['Red', 'Blue'],
        data: [50, 50]
      }
    })

    const wrapper2 = mount(PieChart, {
      props: {
        labels: ['Red', 'Blue'],
        data: [50, 50]
      }
    })

    const description1 = wrapper1.find('.sr-only')
    const description2 = wrapper2.find('.sr-only')

    expect(description1.attributes('id')).not.toBe(description2.attributes('id'))
  })

  it('should handle loading state description', () => {
    const wrapper = mount(PieChart, {
      props: {
        labels: [],
        data: [],
        title: 'Test Chart'
      }
    })

    const description = wrapper.find('.sr-only')
    expect(description.text()).toContain('Graphique en cours de chargement')
  })

  it('should calculate percentages correctly in description', () => {
    const wrapper = mount(PieChart, {
      props: {
        labels: ['Red', 'Blue', 'Green'],
        data: [25, 50, 25],
        title: 'Test Chart'
      }
    })

    const description = wrapper.find('.sr-only')
    expect(description.text()).toContain('Red: 25 (25.0%)')
    expect(description.text()).toContain('Blue: 50 (50.0%)')
    expect(description.text()).toContain('Green: 25 (25.0%)')
  })

  it('should handle total of zero in percentage calculation', () => {
    const wrapper = mount(PieChart, {
      props: {
        labels: ['Red', 'Blue', 'Green'],
        data: [0, 0, 0],
        title: 'Test Chart'
      }
    })

    const description = wrapper.find('.sr-only')
    expect(description.text()).toContain('Red: 0 (0%)')
    expect(description.text()).toContain('Blue: 0 (0%)')
    expect(description.text()).toContain('Green: 0 (0%)')
  })

  it('should have proper focus styles for canvas', () => {
    const wrapper = mount(PieChart, {
      props: {
        labels: ['Red', 'Blue', 'Green'],
        data: [30, 40, 30]
      }
    })

    const canvas = wrapper.find('canvas')
    expect(canvas.classes()).toContain('focus-visible:ring-2')
    expect(canvas.classes()).toContain('focus-visible:ring-primary/80')
    expect(canvas.classes()).toContain('focus-visible:ring-offset-2')
    expect(canvas.classes()).toContain('focus-visible:outline-none')
  })

  it('should maintain proper component structure', () => {
    const wrapper = mount(PieChart, {
      props: {
        labels: ['Red', 'Blue', 'Green'],
        data: [30, 40, 30]
      }
    })

    const container = wrapper.find('[role="img"]')
    expect(container.exists()).toBe(true)
    expect(container.find('canvas').exists()).toBe(true)
    expect(container.find('.sr-only').exists()).toBe(true)
  })
})
