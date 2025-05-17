<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Sun as SunIcon, Moon as MoonIcon, Bell as BellIcon, Heart as HeartIcon, Clock as ClockIcon, HelpCircle as HelpIcon } from 'lucide-vue-next'

import {useUser} from "~/composables/auth/useUser";
import NavigationActions from "~/components/header/utils/NavigationActions.vue";
import {AlignJustify} from "lucide-vue-next";
import DrawerContent from "~/components/header/drawer/DrawerContent.vue";
import DrawerAppContent from "~/components/header/drawer/components/DrawerAppContent.vue";
const { isAuthenticated, logout } = useUser()

const menuOpen = ref(false)
const showLoginModal = ref(false)

const auth = useUser()

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

  onUnmounted(() => {
    mediaQuery.removeEventListener('change', handler)
  })
})

</script>

<template>
  <header>
    <!-- Top bar -->
    <div class="bg-white shadow-sm px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <NuxtLink to="/" class="w-14 rounded-full overflow-hidden">
          <img src="/logo_benevoclic.png" alt="Logo" class="w-full h-auto" />
        </NuxtLink>
      </div>

      <div class="flex items-center gap-3">
        <!-- Location -->
        <div class="flex items-center gap-1 text-gray-600">
          <NavigationActions />
        </div>
        <!-- Theme toggle -->
        <label class="swap swap-rotate cursor-pointer">
          <input type="checkbox" aria-label="Toggle theme" />
          <SunIcon class="swap-on w-7 h-7 text-yellow-500"/>
          <MoonIcon class="swap-off w-7 h-7 text-gray-600"/>
        </label>

        <!-- Notifications -->
        <div class="indicator hidden sm:flex">
          <button class="btn btn-ghost btn-circle px-0 py-0 flex items-center gap-1">
            <span class="indicator-item badge badge-primary" >12</span>
            <BellIcon class="w-6 h-6" />
          </button>
        </div>
        <div class="hidden sm:flex items-center gap-6">
          <div v-if="isAuthenticated" class="flex items-center gap-2">
            <HeaderAuthModalAuth />
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
              <ul tabindex="0" class="menu menu-sm dropdown-content mt-2 p-2 shadow bg-white rounded-box w-70">

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

        <button class="sm:hidden btn btn-secondary btn-square" @click.prevent="handleDrawerClose">
          <AlignJustify class="icon-burger-button text-black w-8 h-8" />
        </button>

      </div>
    </div>

    <!-- Bottom bar -->
    <div class="bg-gray-100 border-t-2  border-gray-300 px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
      <!-- Search bar à gauche -->
      <div class="w-full md:max-w-2xl lg:max-w-3xl flex-1">
        <input
            type="text"
            placeholder="Search for missions or associations"
            class="input input-bordered w-full h-12 text-base"
        />
      </div>

      <div class="w-full md:w-auto flex justify-center md:justify-end flex-wrap  text-gray-700">
        <button class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1">
          <HeartIcon class="w-6 h-6" /> Favorites
        </button>
        <button class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1">
          <ClockIcon class="w-6 h-6" /> Recent Searches
        </button>
        <button class="btn btn-ghost btn-sm px-2 py-0 flex items-center gap-1">
          <HelpIcon class="w-6 h-6" /> Help
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
