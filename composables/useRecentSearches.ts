import { ref } from 'vue'

/**
 * Composable for managing recent searches
 * Stores searches in localStorage to persist across sessions
 */
export function useRecentSearches() {
  // Maximum number of recent searches to store
  const MAX_RECENT_SEARCHES = 5
  
  // Load recent searches from localStorage
  const loadRecentSearches = (): string[] => {
    if (process.client) {
      const storedSearches = localStorage.getItem('recentSearches')
      return storedSearches ? JSON.parse(storedSearches) : []
    }
    return []
  }
  
  // Reactive reference to recent searches
  const recentSearches = ref<string[]>(loadRecentSearches())
  
  // Save recent searches to localStorage
  const saveRecentSearches = (searches: string[]) => {
    if (process.client) {
      localStorage.setItem('recentSearches', JSON.stringify(searches))
    }
  }
  
  // Add a new search to recent searches
  const addRecentSearch = (search: string) => {
    if (!search.trim()) return
    
    // Create a new array without the current search (if it exists)
    const filteredSearches = recentSearches.value.filter(
      item => item.toLowerCase() !== search.toLowerCase()
    )
    
    // Add the new search to the beginning
    const updatedSearches = [search, ...filteredSearches].slice(0, MAX_RECENT_SEARCHES)
    
    // Update the reactive reference
    recentSearches.value = updatedSearches
    
    // Save to localStorage
    saveRecentSearches(updatedSearches)
  }
  
  // Clear all recent searches
  const clearRecentSearches = () => {
    recentSearches.value = []
    if (process.client) {
      localStorage.removeItem('recentSearches')
    }
  }
  
  return {
    recentSearches,
    addRecentSearch,
    clearRecentSearches
  }
}