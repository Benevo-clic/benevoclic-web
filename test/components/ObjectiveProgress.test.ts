import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ObjectiveProgress from '../../components/dashboard/ObjectiveProgress.vue'

describe('ObjectiveProgress', () => {
  it('should render objective progress component', () => {
    const wrapper = mount(ObjectiveProgress, {
      props: {
        title: 'Test Objective',
        covered: 50,
        planned: 100
      }
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.bg-white').exists()).toBe(true)
  })

  it('should display the correct title', () => {
    const wrapper = mount(ObjectiveProgress, {
      props: {
        title: 'Test Objective',
        covered: 50,
        planned: 100
      }
    })

    expect(wrapper.find('.font-semibold').text()).toBe('Test Objective')
  })

  it('should calculate and display correct percentage', () => {
    const wrapper = mount(ObjectiveProgress, {
      props: {
        title: 'Test Objective',
        covered: 75,
        planned: 100
      }
    })

    expect(wrapper.find('.text-xs').text()).toContain('75.0%')
  })

  it('should display covered and planned values', () => {
    const wrapper = mount(ObjectiveProgress, {
      props: {
        title: 'Test Objective',
        covered: 30,
        planned: 50
      }
    })

    expect(wrapper.find('.text-xs').text()).toContain('30 / 50')
  })

  it('should have proper accessibility attributes', () => {
    const wrapper = mount(ObjectiveProgress, {
      props: {
        title: 'Test Objective',
        covered: 50,
        planned: 100
      }
    })

    const progressBar = wrapper.find('[role="progressbar"]')
    expect(progressBar.exists()).toBe(true)
    expect(progressBar.attributes('aria-valuenow')).toBe('50')
    expect(progressBar.attributes('aria-valuemin')).toBe('0')
    expect(progressBar.attributes('aria-valuemax')).toBe('100')
    expect(progressBar.attributes('aria-label')).toBe('Progression de Test Objective')
  })

  it('should have proper CSS classes for styling', () => {
    const wrapper = mount(ObjectiveProgress, {
      props: {
        title: 'Test Objective',
        covered: 50,
        planned: 100
      }
    })

    expect(wrapper.find('.bg-white').exists()).toBe(true)
    expect(wrapper.find('.rounded-lg').exists()).toBe(true)
    expect(wrapper.find('.shadow').exists()).toBe(true)
    expect(wrapper.find('.p-4').exists()).toBe(true)
    expect(wrapper.find('.flex').exists()).toBe(true)
    expect(wrapper.find('.flex-col').exists()).toBe(true)
    expect(wrapper.find('.gap-2').exists()).toBe(true)
  })

  it('should have proper progress bar styling', () => {
    const wrapper = mount(ObjectiveProgress, {
      props: {
        title: 'Test Objective',
        covered: 50,
        planned: 100
      }
    })

    const progressBar = wrapper.find('[role="progressbar"]')
    const progressFill = progressBar.find('.bg-blue-500')

    expect(progressBar.classes()).toContain('w-full')
    expect(progressBar.classes()).toContain('bg-gray-200')
    expect(progressBar.classes()).toContain('rounded')
    expect(progressBar.classes()).toContain('h-3')

    expect(progressFill.classes()).toContain('bg-blue-500')
    expect(progressFill.classes()).toContain('h-3')
    expect(progressFill.classes()).toContain('rounded')
    expect(progressFill.classes()).toContain('transition-all')
    expect(progressFill.classes()).toContain('duration-300')
  })

  it('should handle zero planned value', () => {
    const wrapper = mount(ObjectiveProgress, {
      props: {
        title: 'Test Objective',
        covered: 50,
        planned: 0
      }
    })

    expect(wrapper.find('.text-xs').text()).toContain('0.0%')
  })

  it('should handle 100% completion', () => {
    const wrapper = mount(ObjectiveProgress, {
      props: {
        title: 'Test Objective',
        covered: 100,
        planned: 100
      }
    })

    expect(wrapper.find('.text-xs').text()).toContain('100.0%')
  })

  it('should handle partial completion', () => {
    const wrapper = mount(ObjectiveProgress, {
      props: {
        title: 'Test Objective',
        covered: 25,
        planned: 100
      }
    })

    expect(wrapper.find('.text-xs').text()).toContain('25.0%')
  })

  it('should have proper region role for accessibility', () => {
    const wrapper = mount(ObjectiveProgress, {
      props: {
        title: 'Test Objective',
        covered: 50,
        planned: 100
      }
    })

    const region = wrapper.find('[role="region"]')
    expect(region.exists()).toBe(true)
    expect(region.attributes('aria-labelledby')).toBe('objective-title')
  })

  it('should have proper live region for screen readers', () => {
    const wrapper = mount(ObjectiveProgress, {
      props: {
        title: 'Test Objective',
        covered: 50,
        planned: 100
      }
    })

    const liveRegion = wrapper.find('[aria-live="polite"]')
    expect(liveRegion.exists()).toBe(true)
    expect(liveRegion.classes()).toContain('text-xs')
    expect(liveRegion.classes()).toContain('text-gray-500')
  })

  it('should have proper progress bar width based on percentage', () => {
    const wrapper = mount(ObjectiveProgress, {
      props: {
        title: 'Test Objective',
        covered: 75,
        planned: 100
      }
    })

    const progressFill = wrapper.find('.bg-blue-500')
    expect(progressFill.attributes('style')).toContain('width: 75%')
  })

  it('should handle decimal percentages correctly', () => {
    const wrapper = mount(ObjectiveProgress, {
      props: {
        title: 'Test Objective',
        covered: 33,
        planned: 100
      }
    })

    expect(wrapper.find('.text-xs').text()).toContain('33.0%')
  })

  it('should have proper title ID for accessibility', () => {
    const wrapper = mount(ObjectiveProgress, {
      props: {
        title: 'Test Objective',
        covered: 50,
        planned: 100
      }
    })

    const title = wrapper.find('#objective-title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Test Objective')
  })

  it('should have proper description ID for accessibility', () => {
    const wrapper = mount(ObjectiveProgress, {
      props: {
        title: 'Test Objective',
        covered: 50,
        planned: 100
      }
    })

    const progressBar = wrapper.find('[role="progressbar"]')
    const descriptionId = progressBar.attributes('aria-describedby')
    expect(descriptionId).toBeTruthy()
    expect(descriptionId).toMatch(/progress-description-/)
  })

  it('should handle large numbers correctly', () => {
    const wrapper = mount(ObjectiveProgress, {
      props: {
        title: 'Test Objective',
        covered: 1500,
        planned: 2000
      }
    })

    expect(wrapper.find('.text-xs').text()).toContain('1500 / 2000')
    expect(wrapper.find('.text-xs').text()).toContain('75.0%')
  })

  it('should have proper responsive design classes', () => {
    const wrapper = mount(ObjectiveProgress, {
      props: {
        title: 'Test Objective',
        covered: 50,
        planned: 100
      }
    })

    expect(wrapper.find('.flex').exists()).toBe(true)
    expect(wrapper.find('.flex-col').exists()).toBe(true)
    expect(wrapper.find('.gap-2').exists()).toBe(true)
  })

  it('should maintain proper spacing and layout', () => {
    const wrapper = mount(ObjectiveProgress, {
      props: {
        title: 'Test Objective',
        covered: 50,
        planned: 100
      }
    })

    const container = wrapper.find('.bg-white')
    expect(container.classes()).toContain('p-4')
    expect(container.classes()).toContain('flex')
    expect(container.classes()).toContain('flex-col')
    expect(container.classes()).toContain('gap-2')
  })
})
