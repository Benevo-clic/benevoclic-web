import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TimeSeriesChart from '../../components/dashboard/TimeSeriesChart.vue'

// Mock Chart.js de manière simple
vi.mock('chart.js/auto', () => ({
  default: vi.fn()
}))

describe('TimeSeriesChart', () => {
  it('should render time series chart component', () => {
    const wrapper = mount(TimeSeriesChart, {
      props: {
        labels: ['Jan', 'Feb', 'Mar'],
        data: [10, 20, 30],
        label: 'Test Data',
        color: '#2563eb',
        type: 'line'
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.bg-white').exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('should have proper CSS classes for styling', () => {
    const wrapper = mount(TimeSeriesChart, {
      props: {
        labels: ['Jan', 'Feb', 'Mar'],
        data: [10, 20, 30],
        label: 'Test Data'
      }
    })

    expect(wrapper.find('.bg-white').exists()).toBe(true)
    expect(wrapper.find('.rounded-lg').exists()).toBe(true)
    expect(wrapper.find('.shadow').exists()).toBe(true)
    expect(wrapper.find('.p-4').exists()).toBe(true)
  })

  it('should have proper canvas element', () => {
    const wrapper = mount(TimeSeriesChart, {
      props: {
        labels: ['Jan', 'Feb', 'Mar'],
        data: [10, 20, 30],
        label: 'Test Data'
      }
    })

    const canvas = wrapper.find('canvas')
    expect(canvas.exists()).toBe(true)
    expect(canvas.element.tagName).toBe('CANVAS')
  })

  it('should handle different props correctly', () => {
    const wrapper = mount(TimeSeriesChart, {
      props: {
        labels: ['Jan', 'Feb'],
        data: [15, 25],
        label: 'Custom Label',
        color: '#ff0000',
        type: 'bar'
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('should handle empty data arrays', () => {
    const wrapper = mount(TimeSeriesChart, {
      props: {
        labels: [],
        data: [],
        label: 'Empty Data'
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('should handle large datasets', () => {
    const largeLabels = Array.from({ length: 100 }, (_, i) => `Month ${i + 1}`)
    const largeData = Array.from({ length: 100 }, (_, i) => i * 10)

    const wrapper = mount(TimeSeriesChart, {
      props: {
        labels: largeLabels,
        data: largeData,
        label: 'Large Dataset'
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('should handle negative values', () => {
    const wrapper = mount(TimeSeriesChart, {
      props: {
        labels: ['Jan', 'Feb', 'Mar'],
        data: [-10, 0, 20],
        label: 'Negative Values'
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('should handle decimal values', () => {
    const wrapper = mount(TimeSeriesChart, {
      props: {
        labels: ['Jan', 'Feb', 'Mar'],
        data: [10.5, 20.7, 30.2],
        label: 'Decimal Values'
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('should handle custom colors', () => {
    const wrapper = mount(TimeSeriesChart, {
      props: {
        labels: ['Jan', 'Feb', 'Mar'],
        data: [10, 20, 30],
        label: 'Test Data',
        color: '#ff0000'
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('should handle different chart types', () => {
    const wrapper = mount(TimeSeriesChart, {
      props: {
        labels: ['Jan', 'Feb', 'Mar'],
        data: [10, 20, 30],
        label: 'Test Data',
        type: 'area'
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('should have proper responsive design', () => {
    const wrapper = mount(TimeSeriesChart, {
      props: {
        labels: ['Jan', 'Feb', 'Mar'],
        data: [10, 20, 30],
        label: 'Test Data'
      }
    })

    expect(wrapper.find('.bg-white').exists()).toBe(true)
    expect(wrapper.find('.rounded-lg').exists()).toBe(true)
    expect(wrapper.find('.shadow').exists()).toBe(true)
    expect(wrapper.find('.p-4').exists()).toBe(true)
  })

  it('should maintain proper component structure', () => {
    const wrapper = mount(TimeSeriesChart, {
      props: {
        labels: ['Jan', 'Feb', 'Mar'],
        data: [10, 20, 30],
        label: 'Test Data'
      }
    })

    const container = wrapper.find('.bg-white')
    expect(container.exists()).toBe(true)
    expect(container.find('canvas').exists()).toBe(true)
  })
})
