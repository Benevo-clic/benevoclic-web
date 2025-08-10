<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <!-- Sidebar with search panel and menu -->
    <aside class="md:col-span-1 space-y-6" role="complementary" aria-label="Panneau de recherche">
      <SearchMenu />
      <SearchPanel @search="handleSearch" />
    </aside>

    <!-- Main content with search results -->
    <main class="md:col-span-3" role="main" aria-label="Résultats de recherche">
      <div class="bg-base-100 rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold mb-2 text-base-content">Search Results</h1>
        <p v-if="searchPerformed" class="text-base-content opacity-70 mb-6">
          {{ searchResults.length }} results found for "{{ currentSearch.query }}"
        </p>
        <p v-else class="text-base-content opacity-70 mb-6">
          Use the search panel to find missions and organizations
        </p>

        <!-- Search results -->
        <div v-if="searchPerformed && searchResults.length > 0" class="space-y-4">
          <!-- Results tabs -->
          <div
            class="tabs tabs-boxed bg-base-200 mb-4"
            role="tablist"
            aria-label="Filtrer les résultats"
          >
            <button
              class="tab focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
              :class="{ 'tab-active': activeTab === 'all' }"
              role="tab"
              :aria-selected="activeTab === 'all'"
              :aria-controls="'tabpanel-all'"
              aria-label="Tous les résultats"
              @click="activeTab = 'all'"
              @keyup.enter="activeTab = 'all'"
              @keyup.space.prevent="activeTab = 'all'"
            >
              All ({{ searchResults.length }})
            </button>
            <button
              class="tab focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
              :class="{ 'tab-active': activeTab === 'missions' }"
              role="tab"
              :aria-selected="activeTab === 'missions'"
              :aria-controls="'tabpanel-missions'"
              aria-label="Missions uniquement"
              @click="activeTab = 'missions'"
              @keyup.enter="activeTab = 'missions'"
              @keyup.space.prevent="activeTab = 'missions'"
            >
              Missions ({{ missionResults.length }})
            </button>
            <button
              class="tab focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
              :class="{ 'tab-active': activeTab === 'organizations' }"
              role="tab"
              :aria-selected="activeTab === 'organizations'"
              :aria-controls="'tabpanel-organizations'"
              aria-label="Organisations uniquement"
              @click="activeTab = 'organizations'"
              @keyup.enter="activeTab = 'organizations'"
              @keyup.space.prevent="activeTab = 'organizations'"
            >
              Organizations ({{ organizationResults.length }})
            </button>
          </div>

          <!-- Mission results -->
          <div
            v-if="activeTab === 'all' || activeTab === 'missions'"
            :id="'tabpanel-' + (activeTab === 'all' ? 'all' : 'missions')"
            role="tabpanel"
            :aria-labelledby="'tab-' + (activeTab === 'all' ? 'all' : 'missions')"
          >
            <div
              v-for="result in filteredResults"
              v-show="result.type === 'mission' || activeTab === 'all'"
              :key="result.id"
              class="card bg-base-200 shadow-sm mb-4"
            >
              <div class="card-body p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="badge badge-sm">Mission</span>
                      <h2 class="card-title text-base-content">
                        {{ result.title }}
                      </h2>
                    </div>
                    <p class="text-base-content opacity-70">
                      {{ result.organization }}
                    </p>
                    <div class="flex items-center gap-2 mt-2">
                      <Calendar class="w-4 h-4 text-base-content opacity-70" aria-hidden="true" />
                      <time class="text-sm text-base-content opacity-70" :datetime="result.date">{{
                        result.date
                      }}</time>
                    </div>
                    <div class="flex items-center gap-2 mt-1">
                      <MapPin class="w-4 h-4 text-base-content opacity-70" aria-hidden="true" />
                      <span class="text-sm text-base-content opacity-70">{{
                        result.location
                      }}</span>
                    </div>
                  </div>

                  <button
                    class="btn btn-ghost btn-circle focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
                    :aria-label="result.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                    :aria-pressed="result.isFavorite"
                    @click="toggleFavorite(result)"
                    @keyup.enter="toggleFavorite(result)"
                    @keyup.space.prevent="toggleFavorite(result)"
                  >
                    <Heart
                      class="w-5 h-5"
                      :class="result.isFavorite ? 'text-error fill-error' : 'text-base-content'"
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <p class="text-base-content mt-2">
                  {{ result.description }}
                </p>

                <div class="card-actions justify-end mt-4">
                  <button
                    class="btn btn-sm btn-outline focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    View Details
                  </button>
                  <button
                    class="btn btn-sm btn-primary focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Organization results -->
          <div
            v-if="activeTab === 'all' || activeTab === 'organizations'"
            :id="'tabpanel-' + (activeTab === 'all' ? 'all' : 'organizations')"
            role="tabpanel"
            :aria-labelledby="'tab-' + (activeTab === 'all' ? 'all' : 'organizations')"
          >
            <div
              v-for="result in filteredResults"
              v-show="result.type === 'organization' || activeTab === 'all'"
              :key="result.id"
              class="card bg-base-200 shadow-sm mb-4"
            >
              <div class="card-body p-4">
                <div class="flex justify-between items-start">
                  <div class="flex gap-3">
                    <div class="avatar">
                      <div class="w-12 h-12 rounded-full bg-base-300">
                        <img
                          v-if="result.logo"
                          :src="result?.logo"
                          :alt="`Logo de ${result.name}`"
                          width="48"
                          height="48"
                          loading="lazy"
                          decoding="async"
                          class="w-12 h-12 object-cover rounded-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <span class="badge badge-sm">Organization</span>
                        <h2 class="font-semibold text-base-content">
                          {{ result.name }}
                        </h2>
                      </div>
                      <p class="text-sm text-base-content opacity-70">
                        {{ result.category }}
                      </p>
                      <p class="text-sm text-base-content opacity-70 mt-1">
                        {{ result.location }}
                      </p>
                    </div>
                  </div>

                  <button
                    class="btn btn-ghost btn-circle focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
                    :aria-label="result.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                    :aria-pressed="result.isFavorite"
                    @click="toggleFavorite(result)"
                    @keyup.enter="toggleFavorite(result)"
                    @keyup.space.prevent="toggleFavorite(result)"
                  >
                    <Heart
                      class="w-5 h-5"
                      :class="result.isFavorite ? 'text-error fill-error' : 'text-base-content'"
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <p class="text-base-content mt-2">
                  {{ result.description }}
                </p>

                <div class="card-actions justify-end mt-4">
                  <button
                    class="btn btn-sm btn-outline focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="searchPerformed" class="text-center py-12" role="status" aria-live="polite">
          <Search class="w-16 h-16 mx-auto text-base-content opacity-30" aria-hidden="true" />
          <h3 class="mt-4 text-lg font-medium text-base-content">No results found</h3>
          <p class="mt-2 text-base-content opacity-70">Try adjusting your search criteria</p>
        </div>

        <!-- Initial state -->
        <div v-else class="text-center py-12" role="status" aria-live="polite">
          <Search class="w-16 h-16 mx-auto text-base-content opacity-30" aria-hidden="true" />
          <h3 class="mt-4 text-lg font-medium text-base-content">Start searching</h3>
          <p class="mt-2 text-base-content opacity-70">
            Use the search panel to find missions and organizations
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Search, Calendar, MapPin, Heart } from 'lucide-vue-next'
  import SearchPanel from '~/components/search/SearchPanel.vue'
  import SearchMenu from '~/components/search/SearchMenu.vue'

  definePageMeta({
    layout: 'app'
  })

  const searchPerformed = ref(false)
  const currentSearch = ref({
    query: '',
    filters: {}
  })
  const activeTab = ref('all')

  // Mock search results - would be fetched from API in a real app
  const searchResults = ref([
    {
      id: 1,
      type: 'mission',
      title: 'Beach Cleanup',
      organization: 'Ocean Conservation Group',
      date: '2023-06-15',
      location: 'Miami Beach, FL',
      description: 'Join us for a day of cleaning up the beach and protecting marine life.',
      isFavorite: false
    },
    {
      id: 2,
      type: 'mission',
      title: 'Food Distribution',
      organization: 'Community Food Bank',
      date: '2023-05-20',
      location: 'Downtown Community Center',
      description: 'Help distribute food to those in need in our community.',
      isFavorite: true
    },
    {
      id: 3,
      type: 'organization',
      name: 'Ocean Conservation Group',
      category: 'Environmental',
      location: 'Miami, FL',
      description: 'Dedicated to protecting marine ecosystems and promoting sustainable practices.',
      logo: null,
      isFavorite: false
    },
    {
      id: 4,
      type: 'organization',
      name: 'Community Food Bank',
      category: 'Humanitarian',
      location: 'New York, NY',
      description: 'Fighting hunger and providing food assistance to vulnerable populations.',
      logo: null,
      isFavorite: true
    }
  ])

  const missionResults = computed(() => {
    return searchResults.value.filter(result => result.type === 'mission')
  })

  const organizationResults = computed(() => {
    return searchResults.value.filter(result => result.type === 'organization')
  })

  const filteredResults = computed(() => {
    if (activeTab.value === 'all') {
      return searchResults.value
    } else if (activeTab.value === 'missions') {
      return missionResults.value
    } else {
      return organizationResults.value
    }
  })

  function handleSearch(searchData: any) {
    // In a real app, this would make an API call with the search parameters
    console.log('Searching with:', searchData)
    currentSearch.value = searchData
    searchPerformed.value = true

    // For demo purposes, we're just using the mock data
    // In a real app, searchResults would be updated with the API response
  }

  function toggleFavorite(result: any) {
    result.isFavorite = !result.isFavorite
    // In a real app, this would make an API call to update the favorite status
  }
</script>

<style scoped>
  /* Amélioration de l'accessibilité pour les éléments interactifs */
  .btn:focus-visible,
  .tab:focus-visible {
    outline: 2px solid #eb5577;
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Amélioration du contraste pour les utilisateurs en mode high-contrast */
  @media (prefers-contrast: more) {
    .btn {
      border-width: 2px;
    }

    .tab {
      border-width: 2px;
    }
  }

  /* Respect des préférences de réduction de mouvement */
  @media (prefers-reduced-motion: reduce) {
    .btn {
      transition: none;
    }

    .tab {
      transition: none;
    }
  }
</style>
