<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Sun as SunIcon, Moon as MoonIcon, Bell as BellIcon, Heart as HeartIcon, Clock as ClockIcon, HelpCircle as HelpIcon, X as XIcon, Search as SearchIcon } from 'lucide-vue-next'

import {useUser} from "~/composables/auth/useUser";
import NavigationActions from "~/components/header/utils/NavigationActions.vue";
import {AlignJustify} from "lucide-vue-next";
import DrawerContent from "~/components/header/drawer/DrawerContent.vue";
import DrawerAppContent from "~/components/header/drawer/components/DrawerAppContent.vue";
import { useTheme } from "~/composables/useTheme";
import {navigateTo} from "#app";
import { useRecentSearches } from "~/composables/useRecentSearches";
const { isAuthenticated } = useUser()
const { t } = useI18n()
const {  toggleTheme, isDarkTheme } = useTheme()

const menuOpen = ref(false)
const showLoginModal = ref(false)
const showRecentSearches = ref(false)
const searchQuery = ref('')
const loginModal = ref<HTMLDialogElement | null>(null)

const auth = useUser()
const { recentSearches, addRecentSearch, clearRecentSearches } = useRecentSearches()

const props = defineProps<
    {
      optionsOpen?: boolean
    }
>()

const profileImageUrl = computed(() => {
  const img = auth.user.value?.imageProfile
  if (img?.data && img.contentType) {
    return `data:${img.contentType};base64,${img.data}`
  }
  return ''
})

const handleDrawerClose = () => {
  menuOpen.value = !menuOpen.value
}

watch(
    () => isAuthenticated,
    (isAuth) => {
      if (isAuth) {
        showLoginModal.value = false
      }
    }
)


watch(
    () => isAuthenticated,
    (isAuth) => {
      if (isAuth) {
        showLoginModal.value = false
      }
    }
)

// Function to handle search submission
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    addRecentSearch(searchQuery.value.trim())
    // Here you would typically perform the actual search
    // For now, we're just saving the search query
    console.log('Searching for:', searchQuery.value)
  }
}

// Function to handle clicking on a recent search
const selectRecentSearch = (search: string) => {
  searchQuery.value = search
  showRecentSearches.value = false
  // Optionally perform the search immediately
  handleSearch()
}

// Toggle recent searches dropdown
const toggleRecentSearches = () => {
  showRecentSearches.value = !showRecentSearches.value
}

// Close recent searches dropdown when clicking outside
const closeRecentSearches = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.recent-searches-container') && !target.closest('.recent-searches-button')) {
    showRecentSearches.value = false
  }
}

onMounted(() => {
  const mediaQuery = window.matchMedia('(min-width: 1253px)')

  const handler = (e: MediaQueryListEvent) => {
    if (e.matches) {
      menuOpen.value = false
    }
  }

  mediaQuery.addEventListener('change', handler)

  if (mediaQuery.matches) {
    menuOpen.value = false
  }

  // Add event listener to close dropdown when clicking outside
  document.addEventListener('click', closeRecentSearches)

  onUnmounted(() => {
    mediaQuery.removeEventListener('change', handler)
    document.removeEventListener('click', closeRecentSearches)
  })
})


function handleFavorites() {
  if(isAuthenticated.value) {
    loginModal.value?.showModal()
  } else {
    navigateTo('/activity/favorites')
  }
}

function handleNotifications() {
  if(isAuthenticated.value) {
    loginModal.value?.showModal()
  } else {
    navigateTo('/notifications')
  }
}



</script>

<template>
  <header>
    <!-- Login Modal -->
    <dialog ref="loginModal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">{{t('auth.login_required')}}</h3>
        <p class="py-4">{{t('auth.login_to_access')}}</p>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <HeaderAuthModalAuth />
        </div>
      </div>
    </dialog>

    <!-- Top bar -->
    <div class="bg-base-100 shadow-sm px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <NuxtLink to="/" class="w-14 rounded-full overflow-hidden">
          <img src="/logo_benevoclic.png" alt="Logo" class="w-full h-auto" />
        </NuxtLink>
      </div>

      <div class="flex items-center gap-3">
        <!-- Location -->
        <div class="flex items-center gap-1 text-base-content">
          <NavigationActions />
        </div>
        <!-- Theme toggle -->
        <label class="swap swap-rotate cursor-pointer">
          <input 
            type="checkbox" 
            aria-label="Toggle theme" 
            :checked="isDarkTheme()" 
            @change="toggleTheme" 
          />
          <SunIcon class="swap-on w-7 h-7 text-warning"/>
          <MoonIcon class="swap-off w-7 h-7 text-base-content"/>
        </label>

        <!-- Notifications -->
        <div class="indicator hidden sm:flex mr-2">
          <button class="btn btn-ghost btn-circle px-0 py-0 flex items-center gap-1" @click="handleNotifications">
            <span class="indicator-item badge badge-primary text-base-content" >
              12
            </span>
            <BellIcon class="w-6 h-6" />
          </button>
        </div>
        <div class="hidden sm:flex items-center gap-6">
          <div v-if="isAuthenticated" class="flex items-center gap-2">
            <HeaderAuthModalAuth  />
          </div>
          <div
              v-else
          >
            <!-- Avatar -->
            <div class="dropdown dropdown-end">
              <label tabindex="0" class="btn btn-ghost btn-circle avatar">
                <div class="w-11/12 rounded-full overflow-hidden">
                  <img
                      :src="profileImageUrl"
                      alt="Photo de profil"
                      class="w-12 h-12 rounded-full object-cover"
                  />

                </div>
              </label>
              <ul tabindex="0" class="menu menu-sm dropdown-content mt-2 p-2 shadow bg-base-100 text-base-content rounded-box w-70 absolute right-0 z-50">

                <DrawerAppContent
                    :is-authenticated="isAuthenticated"
                    :menu-open="menuOpen"
                    :display-profile="false"
                />
              </ul>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <DrawerContent :is-authenticated="isAuthenticated" :menu-open="menuOpen"  @close-drawer="menuOpen = false" />

        <button class="sm:hidden btn btn-neutral-content btn-square" @click.prevent="handleDrawerClose">
          <AlignJustify class="icon-burger-button text-base-content w-8 h-8" />
        </button>

      </div>
    </div>

    <!-- Bottom bar -->
    <div class="bg-base-200 border-t-2 border-b-2 border-base-300 px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4" v-if="!props.optionsOpen">
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

      <div class="w-full md:w-auto flex justify-center md:justify-end flex-wrap text-base-content">
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
        <button class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1" @click="navigateTo('/help')">
          <HelpIcon class="w-6 h-6"  /> {{t('header.volunteer.help')}}
        </button>
      </div>
    </div>


    <!-- Mobile drawer content -->
<!--    <DrawerContent v-if="menuOpen" @close-drawer="menuOpen = false" />-->
  </header>
</template>

<style scoped>
header {
  position: sticky;
  top: 0;
  z-index: 50;
}
</style>
