<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <!-- Sidebar with search panel and menu -->
    <div class="md:col-span-1 space-y-6">
      <SearchMenu />
      <SearchPanel @search="handleSearch" />
    </div>

    <!-- Main content with search history -->
    <div class="md:col-span-3">
      <div class="bg-base-100 rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold mb-6 text-base-content">Search History</h1>

        <SearchHistory
          :search-history="searchHistory"
          @repeat="repeatSearch"
          @remove="removeFromHistory"
          @clear="clearHistory"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import SearchPanel from '~/components/search/SearchPanel.vue'
  import SearchHistory from '~/components/search/SearchHistory.vue'
  import SearchMenu from '~/components/search/SearchMenu.vue'

  definePageMeta({
    middleware: ['auth'],
    layout: 'app'
  })

  // Mock search history data - would be fetched from API or store in a real app
  const searchHistory = ref([
    {
      query: 'Environmental volunteering',
      location: 'Paris',
      category: 'Environment',
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
    },
    {
      query: 'Food distribution',
      location: 'Lyon',
      category: 'Social',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
    },
    {
      query: 'Teaching assistance',
      location: 'Marseille',
      category: 'Education',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() // 3 days ago
    }
  ])

  // Function to handle new search
  function handleSearch(searchData: any) {
    // In a real app, this would navigate to the search results page
    // and add the search to history
    const newSearch = {
      query: searchData.query,
      location: searchData.location,
      category: searchData.category,
      date: new Date().toISOString()
    }

    searchHistory.value.unshift(newSearch)

    // Navigate to search results
    navigateTo('/search')
  }

  // Function to repeat a search
  function repeatSearch(search: any) {
    // Update the search date
    search.date = new Date().toISOString()

    // Move to the top of history
    const index = searchHistory.value.findIndex(
      s =>
        s.query === search.query && s.location === search.location && s.category === search.category
    )

    if (index > -1) {
      searchHistory.value.splice(index, 1)
      searchHistory.value.unshift(search)
    }

    // Navigate to search results
    navigateTo('/search')
  }

  // Function to remove a search from history
  function removeFromHistory(index: number) {
    searchHistory.value.splice(index, 1)
  }

  // Function to clear all search history
  function clearHistory() {
    searchHistory.value = []
  }
</script>
