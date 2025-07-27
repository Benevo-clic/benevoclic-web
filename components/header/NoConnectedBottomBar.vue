<script setup lang="ts">
import { ref } from 'vue'
import { Heart as HeartIcon, Clock as ClockIcon, HelpCircle as HelpIcon, Search as SearchIcon, Home as HomeIcon } from 'lucide-vue-next'
import { useRecentSearches } from "~/composables/useRecentSearches";
import type {FilterAnnouncement} from "~/common/interface/filter.interface";
import {useAnnouncement} from "~/composables/useAnnouncement";

const { t } = useI18n()
const showRecentSearches = ref(false)
const searchQuery = ref('')
const { recentSearches, addRecentSearch, clearRecentSearches } = useRecentSearches()
const { patchCurrentFilter } = useAnnouncement()


const handleSearch = () => {
  if (searchQuery.value.trim()) {
    addRecentSearch(searchQuery.value.trim())
    patchCurrentFilter({
      nameEvent: searchQuery.value.trim(),
      description: searchQuery.value.trim(),
      associationName: searchQuery.value.trim(),
    } as FilterAnnouncement)
  }else{
    patchCurrentFilter({
      nameEvent: '',
      description: '',
      associationName: '',
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
  if (!target.closest('.recent-searches-container') && !target.closest('.recent-searches-button')) {
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
}

function handleHome() {
  console.log('Navigating to home 2')
}
</script>

<template>
  <!-- VOLUNTEER layout with search bar -->
  <div class="flex flex-col md:flex-row items-center justify-between gap-4">
    <!-- Search bar à gauche -->
    <div class="w-full md:max-w-2xl lg:max-w-3xl flex-1">
      <div class="relative">
        <div class="flex">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search for missions or associations"
            class="input input-bordered w-full h-12 text-base"
            @keyup.enter="handleSearch"
            id="search-input"
            aria-label="Rechercher des missions ou associations"
          />
          <button 
            class="btn btn-primary h-12 ml-2" 
            @click="handleSearch"
          >
            <SearchIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Volunteer buttons -->
    <div class="w-full md:w-auto flex justify-center md:justify-end flex-wrap text-base-content">
      <button class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1" @click="handleHome">
        <HomeIcon class="w-6 h-6"  /> {{t('header.volunteer.home')}}
      </button>
      <button class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1" @click="handleFavorites">
        <HeartIcon class="w-6 h-6"  /> {{t('header.volunteer.favorites')}}
      </button>
      <div class="relative recent-searches-container">
        <button 
          class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1 recent-searches-button" 
          @click.stop="toggleRecentSearches"
        >
          <ClockIcon class="w-6 h-6" /> {{t('header.volunteer.recent-search')}}
        </button>

        <!-- Recent searches dropdown -->
        <div 
          v-if="showRecentSearches" 
          class="absolute right-0 mt-2 w-64 bg-base-100 shadow-lg rounded-lg z-10 p-2"
        >
          <div class="flex justify-between items-center mb-2 pb-2 border-b border-base-300">
            <h3 class="font-medium text-base-content">{{t('header.volunteer.recent-search')}}</h3>
            <button 
              v-if="recentSearches.length > 0"
              class="btn btn-ghost btn-xs" 
              @click.stop="clearRecentSearches"
            >
              {{t('search.history.clear_all')}}
            </button>
          </div>

          <div v-if="recentSearches.length > 0" class="max-h-60 overflow-y-auto">
            <button 
              v-for="(search, index) in recentSearches" 
              :key="index"
              class="flex items-center justify-between w-full p-2 hover:bg-base-200 rounded-md mb-1 text-left"
              @click.stop="selectRecentSearch(search)"
            >
              <span class="truncate">{{ search }}</span>
              <SearchIcon class="w-4 h-4 text-base-content opacity-50" />
            </button>
          </div>

          <div v-else class="py-4 text-center text-base-content opacity-70">
            {{t('search.history.no_history_description')}}
          </div>
        </div>
      </div>
      <button class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1" @click="">
        <HelpIcon class="w-6 h-6"  /> {{t('header.volunteer.help')}}
      </button>
    </div>
  </div>
</template>