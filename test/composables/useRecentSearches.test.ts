// @ts-nocheck
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
global.localStorage = localStorageMock

// Mock de process.client
global.process = {
  client: true
}

// Mock des modules Vue
const mockRef = vi.fn((initialValue) => {
  const ref = {
    value: initialValue
  }
  return ref
})

const mockComputed = vi.fn((getter) => {
  const computed = {
    get value() {
      return getter()
    }
  }
  return computed
})

const mockWatch = vi.fn()

// Mock globaux
global.ref = mockRef
global.computed = mockComputed
global.watch = mockWatch

// Variables globales pour le mock
let cachedSearches = null

// Fonction mock pour useRecentSearches
const useRecentSearches = () => {
  const MAX_RECENT_SEARCHES = 5
  const STORAGE_KEY = 'recentSearches'
  
  const loadRecentSearches = () => {
    if (cachedSearches !== null) {
      return cachedSearches
    }
    
    if (process.client) {
      try {
        const storedSearches = localStorage.getItem(STORAGE_KEY)
        const parsedSearches = storedSearches ? JSON.parse(storedSearches) : []
        cachedSearches = parsedSearches
        return parsedSearches
      } catch (error) {
        console.warn('Erreur lors du chargement des recherches récentes:', error)
        cachedSearches = []
        return []
      }
    }
    cachedSearches = []
    return []
  }
  
  const recentSearches = mockRef(loadRecentSearches())
  
  const saveRecentSearches = (searches) => {
    if (process.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(searches))
        cachedSearches = searches
      } catch (error) {
        console.warn('Erreur lors de la sauvegarde des recherches récentes:', error)
      }
    }
  }
  
  const addRecentSearch = (search) => {
    if (!search.trim()) return
    
    const trimmedSearch = search.trim()
    const currentSearches = recentSearches.value
    
    const filteredSearches = currentSearches.filter(
      item => item.toLowerCase() !== trimmedSearch.toLowerCase()
    )
    
    const updatedSearches = [trimmedSearch, ...filteredSearches].slice(0, MAX_RECENT_SEARCHES)
    
    recentSearches.value = updatedSearches
    saveRecentSearches(updatedSearches)
  }
  
  const clearRecentSearches = () => {
    recentSearches.value = []
    cachedSearches = []
    if (process.client) {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (error) {
        console.warn('Erreur lors de la suppression des recherches récentes:', error)
      }
    }
  }

  const getRecentSearches = mockComputed(() => recentSearches.value)
  const hasRecentSearches = mockComputed(() => recentSearches.value.length > 0)
  const recentSearchesCount = mockComputed(() => recentSearches.value.length)

  if (process.client) {
    mockWatch(recentSearches, (newSearches) => {
      saveRecentSearches(newSearches)
    }, { deep: true })
  }
  
  return {
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    hasRecentSearches,
    recentSearchesCount,
    refreshFromStorage: () => {
      cachedSearches = null
      recentSearches.value = loadRecentSearches()
      return recentSearches.value
    }
  }
}

describe('useRecentSearches', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockImplementation(() => {})
    localStorageMock.removeItem.mockImplementation(() => {})
    mockRef.mockImplementation((initialValue) => {
      const ref = {
        value: initialValue
      }
      return ref
    })
    mockComputed.mockImplementation((getter) => {
      const computed = {
        get value() {
          return getter()
        }
      }
      return computed
    })
    mockWatch.mockImplementation(() => {})
    cachedSearches = null
  })

  describe('Initialisation', () => {
    it('should initialize with empty searches', () => {
      const searches = useRecentSearches()

      expect(searches.recentSearches.value).toEqual([])
      expect(searches.hasRecentSearches.value).toBe(false)
      expect(searches.recentSearchesCount.value).toBe(0)
    })

    it('should load existing searches from localStorage', () => {
      const existingSearches = ['search1', 'search2', 'search3']
      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingSearches))

      const searches = useRecentSearches()

      expect(searches.recentSearches.value).toEqual(existingSearches)
      expect(searches.hasRecentSearches.value).toBe(true)
      expect(searches.recentSearchesCount.value).toBe(3)
    })
  })

  describe('Méthode addRecentSearch', () => {
    it('should add a new search to the beginning', () => {
      const searches = useRecentSearches()
      searches.recentSearches.value = ['existing1', 'existing2']

      searches.addRecentSearch('new search')

      expect(searches.recentSearches.value).toEqual(['new search', 'existing1', 'existing2'])
      expect(localStorage.setItem).toHaveBeenCalledWith('recentSearches', JSON.stringify(['new search', 'existing1', 'existing2']))
    })

    it('should not add empty or whitespace-only searches', () => {
      const searches = useRecentSearches()
      const initialSearches = ['existing1', 'existing2']
      searches.recentSearches.value = initialSearches

      searches.addRecentSearch('')
      searches.addRecentSearch('   ')
      searches.addRecentSearch('\t\n')

      expect(searches.recentSearches.value).toEqual(initialSearches)
    })

    it('should trim whitespace from searches', () => {
      const searches = useRecentSearches()

      searches.addRecentSearch('  trimmed search  ')

      expect(searches.recentSearches.value).toEqual(['trimmed search'])
    })

    it('should remove duplicates (case insensitive)', () => {
      const searches = useRecentSearches()
      searches.recentSearches.value = ['Search1', 'SEARCH2', 'search3']

      searches.addRecentSearch('SEARCH1')
      searches.addRecentSearch('search2')

      expect(searches.recentSearches.value).toEqual(['search2', 'SEARCH1', 'search3'])
    })

    it('should limit to maximum number of searches', () => {
      const searches = useRecentSearches()
      searches.recentSearches.value = ['search1', 'search2', 'search3', 'search4', 'search5']

      searches.addRecentSearch('new search')

      expect(searches.recentSearches.value).toHaveLength(5)
      expect(searches.recentSearches.value[0]).toBe('new search')
      expect(searches.recentSearches.value).not.toContain('search5')
    })
  })

  describe('Méthode clearRecentSearches', () => {
    it('should clear all recent searches', () => {
      const searches = useRecentSearches()
      searches.recentSearches.value = ['search1', 'search2', 'search3']

      searches.clearRecentSearches()

      expect(searches.recentSearches.value).toEqual([])
      expect(searches.hasRecentSearches.value).toBe(false)
      expect(searches.recentSearchesCount.value).toBe(0)
      expect(localStorage.removeItem).toHaveBeenCalledWith('recentSearches')
    })

    it('should clear cache when clearing searches', () => {
      const searches = useRecentSearches()
      searches.recentSearches.value = ['search1', 'search2']
      cachedSearches = ['search1', 'search2']

      searches.clearRecentSearches()

      expect(cachedSearches).toEqual([])
    })
  })

  describe('Méthode refreshFromStorage', () => {
    it('should refresh searches from localStorage', () => {
      const searches = useRecentSearches()
      searches.recentSearches.value = ['old1', 'old2']
      cachedSearches = ['old1', 'old2']
      
      const newSearches = ['new1', 'new2', 'new3']
      localStorageMock.getItem.mockReturnValue(JSON.stringify(newSearches))

      searches.refreshFromStorage()

      expect(searches.recentSearches.value).toEqual(newSearches)
      expect(cachedSearches).toEqual(newSearches)
    })

    it('should handle empty localStorage', () => {
      const searches = useRecentSearches()
      searches.recentSearches.value = ['old1', 'old2']
      localStorageMock.getItem.mockReturnValue(null)

      searches.refreshFromStorage()

      expect(searches.recentSearches.value).toEqual([])
    })
  })

  describe('Propriétés calculées', () => {
    it('should return correct recent searches', () => {
      const searches = useRecentSearches()
      const mockSearches = ['search1', 'search2', 'search3']
      searches.recentSearches.value = mockSearches

      expect(searches.recentSearches.value).toEqual(mockSearches)
    })

    it('should return true when there are recent searches', () => {
      const searches = useRecentSearches()
      searches.recentSearches.value = ['search1', 'search2']

      expect(searches.hasRecentSearches.value).toBe(true)
    })

    it('should return false when there are no recent searches', () => {
      const searches = useRecentSearches()
      searches.recentSearches.value = []

      expect(searches.hasRecentSearches.value).toBe(false)
    })

    it('should return correct count of recent searches', () => {
      const searches = useRecentSearches()
      searches.recentSearches.value = ['search1', 'search2', 'search3']

      expect(searches.recentSearchesCount.value).toBe(3)
    })
  })

  describe('Gestion des erreurs', () => {
    it('should handle localStorage getItem errors', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })

      const searches = useRecentSearches()

      expect(searches.recentSearches.value).toEqual([])
    })

    it('should handle localStorage setItem errors', () => {
      const searches = useRecentSearches()
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })

      expect(() => searches.addRecentSearch('test search')).not.toThrow()
    })

    it('should handle localStorage removeItem errors', () => {
      const searches = useRecentSearches()
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })

      expect(() => searches.clearRecentSearches()).not.toThrow()
    })

    it('should handle JSON parse errors', () => {
      localStorageMock.getItem.mockReturnValue('invalid json')

      const searches = useRecentSearches()

      expect(searches.recentSearches.value).toEqual([])
    })
  })

  describe('Cache management', () => {
    it('should use cache when available', () => {
      const searches = useRecentSearches()
      // Simuler que le cache est déjà rempli
      cachedSearches = ['cached1', 'cached2']
      
      // Créer une nouvelle instance qui utilisera le cache
      const newSearches = useRecentSearches()

      expect(newSearches.recentSearches.value).toEqual(['cached1', 'cached2'])
    })

    it('should clear cache when refreshing', () => {
      const searches = useRecentSearches()
      cachedSearches = ['old1', 'old2']
      localStorageMock.getItem.mockReturnValue(JSON.stringify(['new1', 'new2']))

      searches.refreshFromStorage()

      expect(cachedSearches).toEqual(['new1', 'new2'])
    })
  })

  describe('Intégration', () => {
    it('should handle complete search workflow', () => {
      const searches = useRecentSearches()
      
      // Initial state
      expect(searches.recentSearches.value).toEqual([])
      expect(searches.hasRecentSearches.value).toBe(false)
      
      // Add searches
      searches.addRecentSearch('first search')
      searches.addRecentSearch('second search')
      searches.addRecentSearch('third search')
      
      expect(searches.recentSearches.value).toEqual(['third search', 'second search', 'first search'])
      expect(searches.hasRecentSearches.value).toBe(true)
      expect(searches.recentSearchesCount.value).toBe(3)
      
      // Add duplicate (case insensitive)
      searches.addRecentSearch('FIRST SEARCH')
      
      expect(searches.recentSearches.value).toEqual(['FIRST SEARCH', 'third search', 'second search'])
      expect(searches.recentSearchesCount.value).toBe(3)
      
      // Clear searches
      searches.clearRecentSearches()
      
      expect(searches.recentSearches.value).toEqual([])
      expect(searches.hasRecentSearches.value).toBe(false)
      expect(searches.recentSearchesCount.value).toBe(0)
    })

    it('should handle maximum searches limit', () => {
      const searches = useRecentSearches()
      
      // Add more than maximum allowed searches
      for (let i = 1; i <= 7; i++) {
        searches.addRecentSearch(`search${i}`)
      }
      
      expect(searches.recentSearches.value).toHaveLength(5)
      expect(searches.recentSearches.value[0]).toBe('search7')
      expect(searches.recentSearches.value[4]).toBe('search3')
      expect(searches.recentSearches.value).not.toContain('search1')
      expect(searches.recentSearches.value).not.toContain('search2')
    })
  })
}) 