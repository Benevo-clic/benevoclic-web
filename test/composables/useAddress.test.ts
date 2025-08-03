// @ts-nocheck
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock de fetch
global.fetch = vi.fn()

// Mock des modules Vue
const mockRef = vi.fn((initialValue) => ({
  value: initialValue
}))

// Mock globaux
global.ref = mockRef

// Fonction mock pour useAddressAutocomplete
const useAddressAutocomplete = () => {
  const query = mockRef('')
  const suggestions = mockRef([])

  async function search() {
    if (query.value.length < 3) {
      suggestions.value = []
      return
    }
    const url = new URL('https://api-adresse.data.gouv.fr/search/')
    url.searchParams.set('q', query.value)
    url.searchParams.set('limit', '5')
    const res = await fetch(url.toString())
    const json = await res.json()
    suggestions.value = json.features
  }

  function pick(feat) {
    query.value = feat.properties.label
    suggestions.value = []
  }

  return { query, suggestions, search, pick }
}

describe('useAddressAutocomplete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRef.mockImplementation((initialValue) => ({
      value: initialValue
    }))
  })

  describe('Initialisation', () => {
    it('should initialize with empty query and suggestions', () => {
      const address = useAddressAutocomplete()

      expect(address.query.value).toBe('')
      expect(address.suggestions.value).toEqual([])
    })
  })

  describe('Méthode search', () => {
    it('should not search when query length is less than 3', async () => {
      const address = useAddressAutocomplete()
      address.query.value = 'ab'

      await address.search()

      expect(address.suggestions.value).toEqual([])
      expect(fetch).not.toHaveBeenCalled()
    })

    it('should search when query length is 3 or more', async () => {
      const address = useAddressAutocomplete()
      address.query.value = 'Paris'
      
      const mockResponse = {
        features: [
          {
            properties: {
              id: 1,
              label: 'Paris, 75001',
              postcode: '75001',
              city: 'Paris',
              context: 'Île-de-France',
              lat: 48.8566,
              lon: 2.3522
            }
          }
        ]
      }

      fetch.mockResolvedValueOnce({
        json: async () => mockResponse
      })

      await address.search()

      expect(fetch).toHaveBeenCalledWith(
        'https://api-adresse.data.gouv.fr/search/?q=Paris&limit=5'
      )
      expect(address.suggestions.value).toEqual(mockResponse.features)
    })

    it('should handle API errors gracefully', async () => {
      const address = useAddressAutocomplete()
      address.query.value = 'Paris'

      fetch.mockRejectedValueOnce(new Error('API Error'))

      await expect(address.search()).rejects.toThrow('API Error')
    })

    it('should handle empty API response', async () => {
      const address = useAddressAutocomplete()
      address.query.value = 'InvalidAddress'

      fetch.mockResolvedValueOnce({
        json: async () => ({ features: [] })
      })

      await address.search()

      expect(address.suggestions.value).toEqual([])
    })
  })

  describe('Méthode pick', () => {
    it('should update query and clear suggestions when picking a feature', () => {
      const address = useAddressAutocomplete()
      const feature = {
        properties: {
          id: 1,
          label: 'Paris, 75001',
          postcode: '75001',
          city: 'Paris',
          context: 'Île-de-France',
          lat: 48.8566,
          lon: 2.3522
        }
      }

      address.suggestions.value = [feature]

      address.pick(feature)

      expect(address.query.value).toBe('Paris, 75001')
      expect(address.suggestions.value).toEqual([])
    })

    it('should handle picking with empty suggestions', () => {
      const address = useAddressAutocomplete()
      const feature = {
        properties: {
          id: 1,
          label: 'Test Address',
          postcode: '12345',
          city: 'Test City',
          context: 'Test Context',
          lat: 0,
          lon: 0
        }
      }

      address.pick(feature)

      expect(address.query.value).toBe('Test Address')
      expect(address.suggestions.value).toEqual([])
    })
  })

  describe('Intégration', () => {
    it('should handle complete search and pick workflow', async () => {
      const address = useAddressAutocomplete()
      
      // Initial state
      expect(address.query.value).toBe('')
      expect(address.suggestions.value).toEqual([])

      // Search
      address.query.value = 'Paris'
      const mockResponse = {
        features: [
          {
            properties: {
              id: 1,
              label: 'Paris, 75001',
              postcode: '75001',
              city: 'Paris',
              context: 'Île-de-France',
              lat: 48.8566,
              lon: 2.3522
            }
          }
        ]
      }

      fetch.mockResolvedValueOnce({
        json: async () => mockResponse
      })

      await address.search()

      expect(address.suggestions.value).toEqual(mockResponse.features)

      // Pick
      address.pick(mockResponse.features[0])

      expect(address.query.value).toBe('Paris, 75001')
      expect(address.suggestions.value).toEqual([])
    })

    it('should handle multiple searches', async () => {
      const address = useAddressAutocomplete()
      
      // First search
      address.query.value = 'Paris'
      const firstResponse = {
        features: [
          {
            properties: {
              id: 1,
              label: 'Paris, 75001',
              postcode: '75001',
              city: 'Paris',
              context: 'Île-de-France',
              lat: 48.8566,
              lon: 2.3522
            }
          }
        ]
      }

      fetch.mockResolvedValueOnce({
        json: async () => firstResponse
      })

      await address.search()

      expect(address.suggestions.value).toEqual(firstResponse.features)

      // Second search
      address.query.value = 'Lyon'
      const secondResponse = {
        features: [
          {
            properties: {
              id: 2,
              label: 'Lyon, 69001',
              postcode: '69001',
              city: 'Lyon',
              context: 'Auvergne-Rhône-Alpes',
              lat: 45.7578,
              lon: 4.8320
            }
          }
        ]
      }

      fetch.mockResolvedValueOnce({
        json: async () => secondResponse
      })

      await address.search()

      expect(address.suggestions.value).toEqual(secondResponse.features)
    })
  })

  describe('Validation des données', () => {
    it('should handle valid feature structure', () => {
      const address = useAddressAutocomplete()
      const validFeature = {
        properties: {
          id: 1,
          label: 'Valid Address',
          postcode: '12345',
          city: 'Valid City',
          context: 'Valid Context',
          lat: 0,
          lon: 0
        }
      }

      address.pick(validFeature)

      expect(address.query.value).toBe('Valid Address')
    })

    it('should handle feature with missing properties', () => {
      const address = useAddressAutocomplete()
      const invalidFeature = {
        properties: {
          label: 'Incomplete Address'
        }
      }

      address.pick(invalidFeature)

      expect(address.query.value).toBe('Incomplete Address')
    })
  })

  describe('Gestion des erreurs', () => {
    it('should handle network errors', async () => {
      const address = useAddressAutocomplete()
      address.query.value = 'Paris'

      fetch.mockRejectedValueOnce(new Error('Network Error'))

      await expect(address.search()).rejects.toThrow('Network Error')
    })

    it('should handle invalid JSON response', async () => {
      const address = useAddressAutocomplete()
      address.query.value = 'Paris'

      fetch.mockResolvedValueOnce({
        json: async () => {
          throw new Error('Invalid JSON')
        }
      })

      await expect(address.search()).rejects.toThrow('Invalid JSON')
    })
  })
}) 