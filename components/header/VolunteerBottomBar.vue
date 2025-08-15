<script setup lang="ts">
  import { ref } from 'vue'
  import {
    Heart as HeartIcon,
    Clock as ClockIcon,
    HelpCircle as HelpIcon,
    Search as SearchIcon,
    Home as HomeIcon
  } from 'lucide-vue-next'
  import { navigateTo } from '#app'
  import { useRecentSearches } from '~/composables/useRecentSearches'
  import { useAnnouncement } from '~/composables/useAnnouncement'
  import type { FilterAnnouncement } from '~/common/interface/filter.interface'

  const { t } = useI18n()
  const showRecentSearches = ref(false)
  const searchQuery = ref('')
  const { recentSearches, addRecentSearch, clearRecentSearches } = useRecentSearches()
  const { patchCurrentFilter } = useAnnouncement()

  const searchInputId = 'volunteer-search-input'
  const recentSearchesId = 'volunteer-recent-searches'

  const handleSearch = () => {
    if (searchQuery.value.trim()) {
      addRecentSearch(searchQuery.value.trim())
      patchCurrentFilter({
        nameEvent: searchQuery.value.trim(),
        description: searchQuery.value.trim(),
        associationName: searchQuery.value.trim()
      } as FilterAnnouncement)
    } else {
      patchCurrentFilter({
        nameEvent: '',
        description: '',
        associationName: ''
      } as FilterAnnouncement)
    }
  }

  const selectRecentSearch = (search: string) => {
    searchQuery.value = search
    showRecentSearches.value = false
    handleSearch()
  }

  const toggleRecentSearches = () => {
    showRecentSearches.value = !showRecentSearches.value
  }

  const closeRecentSearches = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (
      !target.closest('.recent-searches-container') &&
      !target.closest('.recent-searches-button')
    ) {
      showRecentSearches.value = false
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      showRecentSearches.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('click', closeRecentSearches)
  })

  onUnmounted(() => {
    document.removeEventListener('click', closeRecentSearches)
  })

  function handleFavorites() {
    navigateTo('/volunteer/activity/favorites')
  }

  function handleHome() {
    navigateTo('/volunteer')
  }
</script>

<template>
  <nav
    class="flex flex-col md:flex-row items-center justify-between gap-4"
    role="navigation"
    aria-label="Navigation bénévole"
  >
    <div class="w-full md:max-w-2xl lg:max-w-3xl flex-1">
      <div class="relative">
        <div class="flex">
          <input
            :id="searchInputId"
            v-model="searchQuery"
            type="text"
            placeholder="Search for missions or associations"
            class="input input-bordered w-full h-12 text-base focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Rechercher des missions ou associations"
            autocomplete="off"
            @keyup.enter="handleSearch"
            @keydown="handleKeydown"
          />
          <button
            class="btn btn-primary h-12 ml-2 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            :aria-describedby="searchInputId"
            aria-label="Lancer la recherche"
            @click="handleSearch"
          >
            <SearchIcon class="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>

    <div
      class="w-full md:w-auto flex justify-center md:justify-end flex-wrap text-base-content"
      role="group"
      aria-label="Actions rapides"
    >
      <button
        class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label="Aller à l'accueil bénévole"
        @click="handleHome"
      >
        <HomeIcon class="w-6 h-6" aria-hidden="true" />
        <span>{{ t('header.volunteer.home') }}</span>
      </button>
      <button
        class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label="Voir mes favoris"
        @click="handleFavorites"
      >
        <HeartIcon class="w-6 h-6" aria-hidden="true" />
        <span>{{ t('header.volunteer.favorites') }}</span>
      </button>
      <div class="relative recent-searches-container">
        <button
          class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1 recent-searches-button focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
          :aria-expanded="showRecentSearches"
          :aria-controls="recentSearchesId"
          aria-label="Voir les recherches récentes"
          @click.stop="toggleRecentSearches"
          @keydown="handleKeydown"
        >
          <ClockIcon class="w-6 h-6" aria-hidden="true" />
          <span>{{ t('header.volunteer.recent-search') }}</span>
        </button>

        <div
          v-if="showRecentSearches"
          :id="recentSearchesId"
          class="absolute right-0 mt-2 w-64 bg-base-100 shadow-lg rounded-lg z-10 p-2"
          role="dialog"
          aria-labelledby="recent-searches-title"
          aria-modal="true"
        >
          <div class="flex justify-between items-center mb-2 pb-2 border-b border-base-300">
            <h3 id="recent-searches-title" class="font-medium text-base-content">
              {{ t('header.volunteer.recent-search') }}
            </h3>
            <button
              v-if="recentSearches.length > 0"
              class="btn btn-ghost btn-xs focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
              aria-label="Effacer tout l'historique"
              @click.stop="clearRecentSearches"
            >
              {{ t('search.history.clear_all') }}
            </button>
          </div>

          <div
            v-if="recentSearches.length > 0"
            class="max-h-60 overflow-y-auto"
            role="listbox"
            aria-label="Recherches récentes"
          >
            <button
              v-for="(search, index) in recentSearches"
              :key="index"
              class="flex items-center justify-between w-full p-2 hover:bg-base-200 rounded-md mb-1 text-left focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
              role="option"
              :aria-label="`Rechercher : ${search}`"
              @click.stop="selectRecentSearch(search)"
              @keyup.enter="selectRecentSearch(search)"
              @keyup.space.prevent="selectRecentSearch(search)"
            >
              <span class="truncate">{{ search }}</span>
              <SearchIcon class="w-4 h-4 text-base-content opacity-50" aria-hidden="true" />
            </button>
          </div>

          <div
            v-else
            class="py-4 text-center text-base-content opacity-70"
            role="status"
            aria-live="polite"
          >
            {{ t('search.history.no_history_description') }}
          </div>
        </div>
      </div>
      <button
        class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label="Aide et support"
        @click="navigateTo('/help')"
      >
        <HelpIcon class="w-6 h-6" aria-hidden="true" />
        <span>{{ t('header.volunteer.help') }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
  /* Amélioration de l'accessibilité pour les éléments interactifs */
  .btn:focus-visible,
  input:focus-visible {
    outline: 2px solid #eb5577;
    outline-offset: 2px;
    border-radius: 4px;
  }

  @media (prefers-contrast: more) {
    .btn {
      border-width: 2px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .btn {
      transition: none;
    }
  }
</style>
