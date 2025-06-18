import { ref } from 'vue'


export function useRecentSearches() {
  const MAX_RECENT_SEARCHES = 5
  
  const loadRecentSearches = (): string[] => {
    if (process.client) {
      const storedSearches = localStorage.getItem('recentSearches')
      return storedSearches ? JSON.parse(storedSearches) : []
    }
    return []
  }
  
  const recentSearches = ref<string[]>(loadRecentSearches())
  
  const saveRecentSearches = (searches: string[]) => {
    if (process.client) {
      localStorage.setItem('recentSearches', JSON.stringify(searches))
    }
  }
  
  const addRecentSearch = (search: string) => {
    if (!search.trim()) return
    
    const filteredSearches = recentSearches.value.filter(
      item => item.toLowerCase() !== search.toLowerCase()
    )
    
    const updatedSearches = [search, ...filteredSearches].slice(0, MAX_RECENT_SEARCHES)
    
    recentSearches.value = updatedSearches
    
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