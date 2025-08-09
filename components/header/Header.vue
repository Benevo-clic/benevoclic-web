<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  Sun as SunIcon,
  HomeIcon,
  HeartIcon,
  Moon as MoonIcon,
  Bell as BellIcon
  , AlignJustify
} from 'lucide-vue-next'

import { navigateTo } from '#app'
import { useI18n } from 'vue-i18n'
import { useUser } from '~/composables/auth/useUser'
import NavigationActions from '~/components/header/utils/NavigationActions.vue'
import DrawerContent from '~/components/header/drawer/DrawerContent.vue'
import DrawerAppContentVolunteer from '~/components/header/drawer/components/volunteer/DrawerAppContentVolunteer.vue'
import { useTheme } from '~/composables/useTheme'
import DrawerAppContentAssociation from '~/components/header/drawer/components/association/DrawerAppContentAssociation.vue'
import AssociationBottomBar from '~/components/header/AssociationBottomBar.vue'
import type { RoleUser } from '~/common/enums/role.enum'

const auth = useUser()
const isAuthenticated = computed(() => auth.isAuthenticated.value)
const { t } = useI18n()
const { toggleTheme, isDarkTheme } = useTheme()

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

let mediaQuery: MediaQueryList | undefined
let handler: ((e: MediaQueryListEvent) => void) | undefined

const profileImageUrl = computed(() => {
  return img.value
})

onUnmounted(() => {
  if (mediaQuery && handler) {
    mediaQuery.removeEventListener('change', handler)
  }
})

const props = defineProps<{
  optionsOpen?: boolean;
}>()

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
  () => role.value,
  (role) => {
    isAssociationComponentAvailable.value = role !== 'ASSOCIATION'
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

function handleNotifications () {
  if (isAuthenticated.value) {
    loginModal.value?.showModal()
  } else {
    navigateTo('/notifications')
  }
}

function handleUserMenuKeydown (event: KeyboardEvent) {
  if (event.key === 'Escape') {
    const dropdown = event.target as HTMLElement
    dropdown?.blur()
  }
}

function handleFavorites () {
  if (!isAuthenticated.value) {
    return
  }
  navigateTo('/volunteer/activity/favorites')
}

function handleHome () {
  navigateTo('/')
}
</script>

<template>
  <client-only>
    <div class="bg-base-200">
      <div
        v-if="isLoading"
        class="flex justify-center py-2"
        role="status"
        aria-live="polite"
      >
        <span class="loading loading-dots loading-xl" aria-hidden="true" />
        <span class="sr-only">Chargement de l'application...</span>
      </div>
      <header
        v-else
        role="banner"
        aria-label="En-tête de l'application Benevoclic"
      >
        <!-- Login Modal -->
        <dialog
          ref="loginModal"
          class="modal"
          role="dialog"
          aria-labelledby="login-modal-title"
          aria-describedby="login-modal-description"
          aria-modal="true"
        >
          <div class="modal-box">
            <h3 id="login-modal-title" class="font-bold text-lg">
              {{ t("auth.login_required") }}
            </h3>
            <p id="login-modal-description" class="py-4">
              {{ t("auth.login_to_access") }}
            </p>
            <div class="modal-action">
              <form method="dialog">
                <button
                  class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
                  aria-label="Fermer la modal"
                  @keyup.enter="loginModal?.close()"
                  @keyup.space.prevent="loginModal?.close()"
                >
                  <span aria-hidden="true">✕</span>
                </button>
              </form>
              <HeaderAuthModalAuth />
            </div>
          </div>
        </dialog>

        <!-- Top bar -->
        <div
          class="bg-base-100 shadow-sm px-4 py-2 flex items-center justify-between"
        >
          <div class="flex items-center gap-2">
            <NuxtLink
              to="/"
              class="w-14 rounded-full overflow-hidden focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
              aria-label="Accueil - Logo Benevoclic"
            >
              <img
                src="/logo_benevoclic.png"
                alt="Logo Benevoclic"
                class="w-full h-auto"
                width="56"
                height="56"
                loading="eager"
                decoding="sync"
              >
            </NuxtLink>
          </div>

          <div class="flex items-center gap-3">
            <div class="indicator hidden sm:flex mr-2">
              <button
                class="btn btn-ghost btn-circle px-0 py-0 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
                aria-label="Aller à l'accueil bénévole"
                @click="handleHome"
              >
                <HomeIcon class="w-6 h-6" aria-hidden="true" />
                <span>{{ t("header.volunteer.home") }}</span>
              </button>
            </div>
            <div class="indicator hidden sm:flex mr-2">
              <button
                v-if="isAuthenticated"
                class="btn btn-ghost btn-circle px-0 py-0 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
                aria-label="Voir mes favoris"
                @click="handleFavorites"
              >
                <HeartIcon class="w-6 h-6" aria-hidden="true" />
                <span>{{ t("header.volunteer.favorites") }}</span>
              </button>
            </div>
            <!-- Location -->
            <div class="flex items-center gap-1 text-base-content">
              <NavigationActions />
            </div>
            <!-- Theme toggle -->
            <label
              class="swap swap-rotate cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <input
                type="checkbox"
                aria-label="Basculer entre le thème clair et sombre"
                :checked="isDarkTheme()"
                class="sr-only"
                @change="toggleTheme"
                @keyup.enter="toggleTheme"
                @keyup.space.prevent="toggleTheme"
              >
              <SunIcon
                class="swap-on w-7 h-7 text-warning"
                aria-hidden="true"
              />
              <MoonIcon
                class="swap-off w-7 h-7 text-base-content"
                aria-hidden="true"
              />
            </label>

            <!-- Notifications -->
            <div class="indicator hidden sm:flex mr-2">
              <button
                v-if="isAuthenticated"
                class="btn btn-ghost btn-circle px-0 py-0 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
                aria-label="Notifications (12 nouvelles)"
                :aria-describedby="
                  isAuthenticated ? 'notifications-login-required' : undefined
                "
                @click="handleNotifications"
                @keyup.enter="handleNotifications"
                @keyup.space.prevent="handleNotifications"
              >
                <span
                  class="indicator-item badge badge-primary text-base-content"
                  aria-label="12 notifications"
                >
                  12
                </span>
                <BellIcon class="w-6 h-6" aria-hidden="true" />
              </button>
              <div id="notifications-login-required" class="sr-only">
                Connexion requise pour accéder aux notifications
              </div>
            </div>
            <div class="hidden sm:flex items-center gap-6">
              <div v-if="!isAuthenticated" class="flex items-center gap-2">
                <HeaderAuthModalAuth />
              </div>
              <div v-else>
                <!-- Avatar -->
                <div class="dropdown dropdown-end">
                  <label
                    tabindex="0"
                    class="btn btn-ghost btn-circle avatar focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
                    aria-label="Menu utilisateur"
                    :aria-expanded="false"
                    @keyup.enter="handleUserMenuKeydown"
                    @keyup.space.prevent="handleUserMenuKeydown"
                    @keydown="handleUserMenuKeydown"
                  >
                    <div class="w-11/12 rounded-full overflow-hidden">
                      <img
                        :src="profileImageUrl"
                        alt="Photo de profil utilisateur"
                        class="w-12 h-12 rounded-full object-cover"
                        width="48"
                        height="48"
                        loading="lazy"
                        decoding="async"
                      >
                    </div>
                  </label>

                  <ul
                    tabindex="0"
                    class="menu menu-sm dropdown-content mt-2 p-2 shadow bg-base-100 text-base-content rounded-box w-70 absolute right-0 z-50"
                    role="menu"
                    aria-label="Menu utilisateur"
                    @keydown="handleUserMenuKeydown"
                  >
                    <DrawerAppContentVolunteer
                      v-if="role === 'VOLUNTEER'"
                      :is-authenticated="!isAuthenticated"
                      :menu-open="menuOpen"
                      :display-profile="false"
                    />
                    <DrawerAppContentAssociation
                      v-if="role === 'ASSOCIATION'"
                      :is-authenticated="!isAuthenticated"
                      :menu-open="menuOpen"
                      :display-profile="false"
                    />
                  </ul>
                </div>
              </div>
            </div>

            <!-- Notifications -->
            <DrawerContent
              :is-authenticated="!isAuthenticated"
              :menu-open="menuOpen"
              :role="role"
              @close-drawer="menuOpen = false"
            />

            <button
              class="sm:hidden btn btn-neutral-content btn-square focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
              aria-label="Ouvrir le menu de navigation"
              :aria-controls="menuOpen ? 'mobile-menu' : undefined"
              @click.prevent="handleDrawerClose"
              @keyup.enter="handleDrawerClose"
              @keyup.space.prevent="handleDrawerClose"
            >
              <AlignJustify
                class="icon-burger-button text-base-content w-8 h-8"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <!-- Bottom bar -->
        <nav
          v-if="!props.optionsOpen"
          id="mobile-menu"
          class="bg-base-200 border-t-2 border-b-2 border-base-300"
          role="navigation"
          aria-label="Navigation principale"
        >
          <!--        <NoConnectedBottomBar v-if="!isAuthenticated"/>-->

          <AssociationBottomBar v-if="role === 'ASSOCIATION'" />
          <!--          <VolunteerBottomBar v-else-if="role === 'VOLUNTEER'" />-->
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

/* Amélioration de l'accessibilité pour les éléments interactifs */
.btn:focus-visible,
input:focus-visible,
label:focus-visible {
  outline: 2px solid #eb5577;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Amélioration du contraste pour les utilisateurs en mode high-contrast */
@media (prefers-contrast: more) {
  .btn {
    border-width: 2px;
  }

  .indicator-item {
    border-width: 2px;
  }
}

/* Respect des préférences de réduction de mouvement */
@media (prefers-reduced-motion: reduce) {
  .loading {
    animation: none;
  }

  .swap {
    transition: none;
  }
}
</style>
