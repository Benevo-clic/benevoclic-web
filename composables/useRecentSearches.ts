import { ref, computed, watch } from 'vue'

export function useRecentSearches() {
  const MAX_RECENT_SEARCHES = 5
  const STORAGE_KEY = 'recentSearches'

  // Cache pour éviter les accès répétés au localStorage
  let cachedSearches: string[] | null = null

  const loadRecentSearches = (): string[] => {
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

  const recentSearches = ref<string[]>(loadRecentSearches())

  const saveRecentSearches = (searches: string[]) => {
    if (process.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(searches))
        cachedSearches = searches
      } catch (error) {
        console.warn('Erreur lors de la sauvegarde des recherches récentes:', error)
      }
    }
  }

  const addRecentSearch = (search: string) => {
    if (!search.trim()) {
      return
    }

    const trimmedSearch = search.trim()
    const currentSearches = recentSearches.value

    // Éviter les doublons (insensible à la casse)
    const filteredSearches = currentSearches.filter(
      item => item.toLowerCase() !== trimmedSearch.toLowerCase()
    )

    // Ajouter la nouvelle recherche en premier
    const updatedSearches = [trimmedSearch, ...filteredSearches].slice(0, MAX_RECENT_SEARCHES)

    recentSearches.value = updatedSearches
    saveRecentSearches(updatedSearches)
  }

  // Clear all recent searches
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

  // Computed pour obtenir les recherches récentes
  const getRecentSearches = computed(() => recentSearches.value)

  // Computed pour vérifier s'il y a des recherches récentes
  const hasRecentSearches = computed(() => recentSearches.value.length > 0)

  // Computed pour obtenir le nombre de recherches récentes
  const recentSearchesCount = computed(() => recentSearches.value.length)

  // Watcher pour synchroniser avec le localStorage (optionnel, pour la cohérence)
  if (process.client) {
    watch(
      recentSearches,
      newSearches => {
        saveRecentSearches(newSearches)
      },
      { deep: true }
    )
  }

  return {
    recentSearches: getRecentSearches,
    addRecentSearch,
    clearRecentSearches,
    hasRecentSearches,
    recentSearchesCount,
    // Méthode pour forcer un refresh depuis le localStorage
    refreshFromStorage: () => {
      cachedSearches = null
      recentSearches.value = loadRecentSearches()
    }
  }
}
