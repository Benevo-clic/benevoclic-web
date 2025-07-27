<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Sun as SunIcon, Moon as MoonIcon, Bell as BellIcon} from 'lucide-vue-next'

import {useUser} from "~/composables/auth/useUser";
import NavigationActions from "~/components/header/utils/NavigationActions.vue";
import {AlignJustify} from "lucide-vue-next";
import DrawerContent from "~/components/header/drawer/DrawerContent.vue";
import DrawerAppContentVolunteer from "~/components/header/drawer/components/volunteer/DrawerAppContentVolunteer.vue";
import { useTheme } from "~/composables/useTheme";
import {navigateTo} from "#app";
import DrawerAppContentAssociation from "~/components/header/drawer/components/association/DrawerAppContentAssociation.vue";
import VolunteerBottomBar from "~/components/header/VolunteerBottomBar.vue";
import AssociationBottomBar from "~/components/header/AssociationBottomBar.vue";
import {useI18n} from "vue-i18n";
import NoConnectedBottomBar from "~/components/header/NoConnectedBottomBar.vue";
import type {RoleUser} from "~/common/enums/role.enum";
const auth = useUser()
const isAuthenticated = computed(() => auth.isAuthenticated.value)
const { t } = useI18n()
const {  toggleTheme, isDarkTheme } = useTheme()

const userRole = auth.userRole

onMounted(async () => {
  try {
    await auth.initializeUser()
    if (userRole.value) {
      role.value = userRole.value
    }
    if (auth.user.value?.avatarFileKey) {
      img.value = auth.user.value.avatarFileKey
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
})


const menuOpen = ref(false)
const showLoginModal = ref(false)
const loginModal = ref<HTMLDialogElement | null>(null)
const isLoading = computed(() => auth.isLoading.value)
const isAssociationComponentAvailable = ref(true)
const role = ref<RoleUser>()
const img = ref<string>()

let mediaQuery: MediaQueryList | undefined;
let handler: ((e: MediaQueryListEvent) => void) | undefined;

const profileImageUrl = computed(() => {
  return img.value
})

onUnmounted(() => {
  if (mediaQuery && handler) {
    mediaQuery.removeEventListener('change', handler)
  }
})

const props = defineProps<
    {
      optionsOpen?: boolean,
    }
>()



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

watch(
    () => role.value,
    (role) => {
      isAssociationComponentAvailable.value = role !== 'ASSOCIATION';
    }
)



onMounted(async () => {
  try {
     await auth.initializeUser()
    if (role.value === 'ASSOCIATION') {
      isAssociationComponentAvailable.value = false // Set to true to hide the placeholder
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    if (role.value === 'ASSOCIATION') {
      isAssociationComponentAvailable.value = false
    }
  }

  mediaQuery = window.matchMedia('(min-width: 1253px)')
  handler = (e: MediaQueryListEvent) => {
    if (e.matches) {
      menuOpen.value = false
    }
  }
  mediaQuery.addEventListener('change', handler)
  if (mediaQuery.matches) {
    menuOpen.value = false
  }
})

function handleNotifications() {
  if(isAuthenticated.value) {
    loginModal.value?.showModal()
  } else {
    navigateTo('/notifications')
  }
}

</script>

<template>
<client-only>
  <div class="bg-base-200">
  <div v-if="isLoading" class="flex justify-center py-2" role="status" aria-live="polite">
    <span class="loading loading-dots loading-xl" aria-label="Chargement en cours"></span>
  </div>
  <header v-else role="banner">
    <!-- Login Modal -->
    <dialog ref="loginModal" class="modal" role="dialog" aria-labelledby="login-modal-title" aria-describedby="login-modal-description">
      <div class="modal-box">
        <h3 id="login-modal-title" class="font-bold text-lg">{{t('auth.login_required')}}</h3>
        <p id="login-modal-description" class="py-4">{{t('auth.login_to_access')}}</p>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" aria-label="Fermer la modal">✕</button>
          </form>
          <HeaderAuthModalAuth />
        </div>
      </div>
    </dialog>

    <!-- Top bar -->
    <div class="bg-base-100 shadow-sm px-4 py-2 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <NuxtLink to="/" class="w-14 rounded-full overflow-hidden" aria-label="Accueil - Logo Benevoclic">
          <img src="/logo_benevoclic.png" alt="Logo Benevoclic" class="w-full h-auto" width="56" height="56" />
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
            aria-label="Basculer entre le thème clair et sombre"
            :checked="isDarkTheme()"
            @change="toggleTheme"
            class="sr-only"
          />
          <SunIcon class="swap-on w-7 h-7 text-warning" aria-hidden="true"/>
          <MoonIcon class="swap-off w-7 h-7 text-base-content" aria-hidden="true"/>
        </label>

        <!-- Notifications -->
        <div class="indicator hidden sm:flex mr-2">
          <button 
            class="btn btn-ghost btn-circle px-0 py-0 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" 
            @click="handleNotifications"
            aria-label="Notifications (12 nouvelles)"
          >
            <span class="indicator-item badge badge-primary text-base-content" aria-label="12 notifications">
              12
            </span>
            <BellIcon class="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
        <div class="hidden sm:flex items-center gap-6">

          <div v-if="!isAuthenticated" class="flex items-center gap-2">
            <HeaderAuthModalAuth  />
          </div>
          <div
              v-else
          >
            <!-- Avatar -->
            <div class="dropdown dropdown-end">
              <label tabindex="0" class="btn btn-ghost btn-circle avatar focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" aria-label="Menu utilisateur">
                <div class="w-11/12 rounded-full overflow-hidden">
                  <img
                      :src="profileImageUrl"
                      alt="Photo de profil utilisateur"
                      class="w-12 h-12 rounded-full object-cover"
                      width="48"
                      height="48"
                  />

                </div>
              </label>

              <ul tabindex="0" class="menu menu-sm dropdown-content mt-2 p-2 shadow bg-base-100 text-base-content rounded-box w-70 absolute right-0 z-50" role="menu">

                <DrawerAppContentVolunteer
                    :is-authenticated="!isAuthenticated"
                    :menu-open="menuOpen"
                    :display-profile="false"
                    v-if="role === 'VOLUNTEER'"
                />
                <DrawerAppContentAssociation
                    :is-authenticated="!isAuthenticated"
                    :menu-open="menuOpen"
                    :display-profile="false"
                    v-if="role === 'ASSOCIATION'"
                />
              </ul>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <DrawerContent :is-authenticated="!isAuthenticated" :menu-open="menuOpen"  @close-drawer="menuOpen = false" :role="role" />

        <button 
          class="sm:hidden btn btn-neutral-content btn-square focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" 
          @click.prevent="handleDrawerClose"
          aria-label="Ouvrir le menu de navigation"
          :aria-expanded="menuOpen.toString()"
        >
          <AlignJustify class="icon-burger-button text-base-content w-8 h-8" aria-hidden="true" />
        </button>

      </div>
    </div>

    <!-- Bottom bar -->
    <nav class="bg-base-200 border-t-2 border-b-2 border-base-300 px-4 py-3" v-if="!props.optionsOpen" role="navigation" aria-label="Navigation principale">
      <NoConnectedBottomBar v-if="!isAuthenticated"/>

      <template v-else>
        <AssociationBottomBar v-if="role === 'ASSOCIATION'" />
        <VolunteerBottomBar v-else-if="role === 'VOLUNTEER'" />
      </template>

    </nav>

  </header>
</div>
</client-only>
</template>

<style scoped>
header {
  position: sticky;
  top: 0;
  z-index: 50;
}


</style>
