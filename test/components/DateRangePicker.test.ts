import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import DateRangePicker from '~/components/dashboard/DateRangePicker.vue'

// Mock global pour useI18n
;(global as any).useI18n = vi.fn(() => ({
  t: vi.fn((key: string) => {
    const translations: Record<string, string> = {
      'dateRangePicker.label': 'Sélectionner une période',
      'dateRangePicker.from.label': 'Date de début',
      'dateRangePicker.from.description': 'Sélectionnez la date de début',
      'dateRangePicker.to.label': 'Date de fin',
      'dateRangePicker.to.description': 'Sélectionnez la date de fin',
      'dateRangePicker.filter.button': 'Filtrer',
      'dateRangePicker.filter.aria_label': 'Appliquer le filtre de dates',
      'dateRangePicker.validation.error': 'La date de fin doit être postérieure à la date de début'
    }
    return translations[key] || key
  })
}))

describe('DateRangePicker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with translated labels', () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: '', to: '' }
      }
    })

    expect(wrapper.text()).toContain('Filtrer')
  })

  it('should have translated aria labels', () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: '', to: '' }
      }
    })

    const filterButton = wrapper.find('button')
    expect(filterButton.attributes('aria-label')).toBe('Appliquer le filtre de dates')
  })

  it('should have translated screen reader labels', () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: '', to: '' }
      }
    })

    const mainLabel = wrapper.find('#date-range-label')
    expect(mainLabel.text()).toBe('Sélectionner une période')
  })

  it('should have translated input descriptions', () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: '', to: '' }
      }
    })

    const fromDesc = wrapper.find('#daterangepicker-from-desc')
    const toDesc = wrapper.find('#daterangepicker-to-desc')

    expect(fromDesc.text()).toBe('Sélectionnez la date de début')
    expect(toDesc.text()).toBe('Sélectionnez la date de fin')
  })

  it('should show validation error in French', async () => {
    const wrapper = mount(DateRangePicker, {
      props: {
        modelValue: { from: '2023-12-31', to: '2023-01-01' }
      }
    })

    // Le composant devrait déjà avoir une plage invalide avec les props
    const errorDiv = wrapper.find('#range-error')
    expect(errorDiv.exists()).toBe(true)
    expect(errorDiv.text()).toBe('La date de fin doit être postérieure à la date de début')
  })
})
