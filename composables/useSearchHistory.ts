import { ref, computed } from 'vue'

interface SearchHistoryItem {
  query: string
  timestamp: number
  filters?: any
}

export function useSearchHistory() {
  const searchHistory = ref<SearchHistoryItem[]>([])
  const maxHistoryItems = 10

  const loadHistory = () => {
    if (process.client) {
      try {
        const stored = localStorage.getItem('benevoclic-search-history')
        if (stored) {
          searchHistory.value = JSON.parse(stored)
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique de recherche:", error)
      }
    }
  }

  const saveHistory = () => {
    if (process.client) {
      try {
        localStorage.setItem('benevoclic-search-history', JSON.stringify(searchHistory.value))
      } catch (error) {
        console.error("Erreur lors de la sauvegarde de l'historique de recherche:", error)
      }
    }
  }

  const addToHistory = (query: string, filters?: any) => {
    if (!query.trim()) return

    searchHistory.value = searchHistory.value.filter(item => item.query !== query)

    const newItem: SearchHistoryItem = {
      query: query.trim(),
      timestamp: Date.now(),
      filters
    }

    searchHistory.value.unshift(newItem)

    if (searchHistory.value.length > maxHistoryItems) {
      searchHistory.value = searchHistory.value.slice(0, maxHistoryItems)
    }

    saveHistory()
  }

  const removeFromHistory = (query: string) => {
    searchHistory.value = searchHistory.value.filter(item => item.query !== query)
    saveHistory()
  }

  const clearHistory = () => {
    searchHistory.value = []
    saveHistory()
  }

  const recentHistory = computed(() => {
    return searchHistory.value.slice(0, 3)
  })

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "À l'instant"
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours)
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`
    } else {
      const days = Math.floor(diffInHours / 24)
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`
    }
  }

  if (process.client) {
    loadHistory()
  }

  return {
    searchHistory,
    recentHistory,
    addToHistory,
    removeFromHistory,
    clearHistory,
    formatDate
  }
}
