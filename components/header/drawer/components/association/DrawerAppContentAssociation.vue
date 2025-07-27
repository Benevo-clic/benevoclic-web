<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { navigateTo, useRoute } from '#app'
import {
  Pencil,
  Bell,
  CircleHelp,
  UserRound,
  ClipboardList,
  CalendarIcon,
  Globe,
  Settings,
  SunIcon,
  LayoutDashboard as DashboardIcon,
  MoonIcon} from 'lucide-vue-next'
import { useUser } from '~/composables/auth/useUser'
import LanguageComponent from "~/components/header/utils/components/LanguageComponent.vue";
import { useTheme } from "~/composables/useTheme";
import {useAssociationAuth} from "~/composables/useAssociation";
import {useNavigation} from "~/composables/useNavigation";
const { logout: signOut, user ,initializeUser} = useUser()
const {association: association,getAssociationInfo} =useAssociationAuth()
const { setLocale,t, locale } = useI18n()
const { toggleTheme, isDarkTheme } = useTheme()
const route = useRoute()
const { navigateToRoute } = useNavigation()


onMounted(async () => {
  await initializeUser()
  await getAssociationInfo()
})

const showLanguageMenu = ref(false)
const flag = ref('🇫🇷')

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(`${path}/`)
}


const props = defineProps<{
  isAuthenticated: boolean
  menuOpen: boolean
  displayProfile?: boolean
}>()
const emit = defineEmits(['closeDrawer'])


const profileImage = ref<string | null>(null)

async function handleLogout() {
  await signOut()
  emit('closeDrawer')
  await navigateToRoute('/')

}

function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => { profileImage.value = reader.result as string }
    reader.readAsDataURL(file)
  }
}

function goTo(path: string) {
  emit('closeDrawer')
  navigateTo(path)
}

async function changeLanguage(lo: 'fr' | 'en' | 'es', flagEmoji: string) {
  await setLocale(lo)
  showLanguageMenu.value = false
  flag.value = flagEmoji

  localStorage.setItem('locale', lo)
  localStorage.setItem('flag', flagEmoji)
}

const profileImageUrl = computed(() => {
  return  user.value?.avatarFileKey
})

const toggleBodyScroll = (disable: boolean) => {
  if (disable) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

watch(() => props.menuOpen, (isOpen) => {
  toggleBodyScroll(isOpen)
})

watch(() => route.path, () => {
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale && locale.value !== savedLocale) {
    setLocale(savedLocale as 'fr' | 'en' | 'es')
  }
})

onMounted(() => {
  if (props.menuOpen) {
    toggleBodyScroll(true)
  }

  const savedLocale = localStorage.getItem('locale')
  const savedFlag = localStorage.getItem('flag')

  if (savedLocale) {
    setLocale(savedLocale as 'fr' | 'en' | 'es')
    flag.value = savedFlag || '🇫🇷'
  }
})

onUnmounted(() => {
  toggleBodyScroll(false)
})

function toggleLanguageMenu() {
  showLanguageMenu.value = !showLanguageMenu.value
}

</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Profile Section avec design moderne - Header fixe -->
    <div class="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-base-300 flex-shrink-0">
      <div class="flex items-center gap-4">
        <div class="flex-1">
          <h3 class="font-bold text-lg text-base-content">
            {{ association?.associationName }}
          </h3>
          <p class="text-sm text-base-content/70 flex items-center gap-2">
            <span class="w-2 h-2 bg-success rounded-full"></span>
            {{ user?.email }}
          </p>
        </div>
      </div>
    </div>

    <!-- Navigation avec design moderne - Contenu scrollable -->
    <nav class="flex-1 overflow-y-auto">
      <div class="p-4 space-y-6 pb-4">
        <!-- Account Section -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold text-base-content/50 uppercase tracking-wider px-2">
            {{ t('drawer-content.account.title') }}
          </h4>
          <div class="space-y-1">
            <button 
              @click="goTo('/association/account/profile')"
              :class="[
                'group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-left',
                isActive('/association/account/profile') 
                  ? 'bg-primary/20 text-primary border-l-4 border-primary shadow-sm' 
                  : 'hover:bg-base-200 hover:shadow-sm'
              ]"
            >
              <div class="p-2 rounded-lg bg-base-200 group-hover:bg-base-300 transition-colors">
                <UserRound class="w-4 h-4" />
              </div>
              <span class="font-medium">{{ t('drawer-content.account.view_profile') }}</span>
            </button>
            
            <button 
              @click="goTo('/association/account/edit')"
              :class="[
                'group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-left',
                isActive('/association/account/edit') 
                  ? 'bg-primary/20 text-primary border-l-4 border-primary shadow-sm' 
                  : 'hover:bg-base-200 hover:shadow-sm'
              ]"
            >
              <div class="p-2 rounded-lg bg-base-200 group-hover:bg-base-300 transition-colors">
                <Pencil class="w-4 h-4" />
              </div>
              <span class="font-medium">{{ t('drawer-content.account.edit_profile') }}</span>
            </button>
            
            <button 
              @click="goTo('/association/account/settings')"
              :class="[
                'group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-left',
                isActive('/association/account/settings') 
                  ? 'bg-primary/20 text-primary border-l-4 border-primary shadow-sm' 
                  : 'hover:bg-base-200 hover:shadow-sm'
              ]"
            >
              <div class="p-2 rounded-lg bg-base-200 group-hover:bg-base-300 transition-colors">
                <Settings class="w-4 h-4" />
              </div>
              <span class="font-medium">{{ t('drawer-content.account.settings') }}</span>
            </button>
          </div>
        </div>

        <!-- Activity Section -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold text-base-content/50 uppercase tracking-wider px-2">
            {{ t('drawer-content.activity.title') }}
          </h4>
          <div class="space-y-1">
            <button 
              @click="goTo('/association/dashboard')"
              :class="[
                'group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-left',
                isActive('/association/activity/dashboard') 
                  ? 'bg-primary/20 text-primary border-l-4 border-primary shadow-sm' 
                  : 'hover:bg-base-200 hover:shadow-sm'
              ]"
            >
              <div class="p-2 rounded-lg bg-base-200 group-hover:bg-base-300 transition-colors">
                <DashboardIcon class="w-4 h-4" />
              </div>
              <span class="font-medium">{{ t('drawer-content.activity.dashboard') }}</span>
            </button>
            
            <button 
              @click="goTo('/association/events/association/manage')"
              :class="[
                'group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-left',
                isActive('/association/events/association/manage') 
                  ? 'bg-primary/20 text-primary border-l-4 border-primary shadow-sm' 
                  : 'hover:bg-base-200 hover:shadow-sm'
              ]"
            >
              <div class="p-2 rounded-lg bg-base-200 group-hover:bg-base-300 transition-colors">
                <CalendarIcon class="w-4 h-4" />
              </div>
              <span class="font-medium">{{ t('drawer-content.activity.manage-event') }}</span>
            </button>
            
            <button 
              @click="goTo('/association/events/association/requests')"
              :class="[
                'group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-left',
                isActive('/association/events/association/requests') 
                  ? 'bg-primary/20 text-primary border-l-4 border-primary shadow-sm' 
                  : 'hover:bg-base-200 hover:shadow-sm'
              ]"
            >
              <div class="p-2 rounded-lg bg-base-200 group-hover:bg-base-300 transition-colors">
                <ClipboardList class="w-4 h-4" />
              </div>
              <span class="font-medium">{{ t('drawer-content.activity.requests') }}</span>
            </button>
          </div>
        </div>

        <!-- Notifications & Support Section -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold text-base-content/50 uppercase tracking-wider px-2">
            {{ t('drawer-content.notifications_support.title') }}
          </h4>
          <div class="space-y-1">
            <button 
              @click="goTo('/notifications')"
              :class="[
                'group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-left',
                isActive('/notifications') 
                  ? 'bg-primary/20 text-primary border-l-4 border-primary shadow-sm' 
                  : 'hover:bg-base-200 hover:shadow-sm'
              ]"
            >
              <div class="p-2 rounded-lg bg-base-200 group-hover:bg-base-300 transition-colors">
                <Bell class="w-4 h-4" />
              </div>
              <span class="font-medium">{{ t('drawer-content.notifications_support.notifications') }}</span>
            </button>
            
            <button 
              @click="goTo('/help')"
              :class="[
                'group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-left',
                isActive('/help') 
                  ? 'bg-primary/20 text-primary border-l-4 border-primary shadow-sm' 
                  : 'hover:bg-base-200 hover:shadow-sm'
              ]"
            >
              <div class="p-2 rounded-lg bg-base-200 group-hover:bg-base-300 transition-colors">
                <CircleHelp class="w-4 h-4" />
              </div>
              <span class="font-medium">{{ t('drawer-content.notifications_support.help') }}</span>
            </button>
          </div>
        </div>

        <!-- App Settings Section -->
        <div class="space-y-3">
          <h4 class="text-xs font-bold text-base-content/50 uppercase tracking-wider px-2">
            {{ t('drawer-content.app.title') }}
          </h4>
          <div class="space-y-1">
            <!-- Language -->
            <div class="relative">
              <button
                :class="[
                  'group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-left',
                  showLanguageMenu ? 'bg-primary/20 text-primary border-l-4 border-primary shadow-sm' : 'hover:bg-base-200 hover:shadow-sm'
                ]"
                @click="toggleLanguageMenu"
              >
                <div class="p-2 rounded-lg bg-base-200 group-hover:bg-base-300 transition-colors">
                  <span class="text-lg">{{ flag }}</span>
                </div>
                <span class="font-medium">{{ t('drawer-content.app.language') }}</span>
              </button>
              <LanguageComponent
                :show-language-menu="showLanguageMenu"
                class="absolute left-0 mt-2 z-20"
                @change-language="changeLanguage"
              />
            </div>

            <!-- Theme Toggle -->
            <button 
              :class="[
                'group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-left',
                isDarkTheme() ? 'bg-primary/20 text-primary border-l-4 border-primary shadow-sm' : 'hover:bg-base-200 hover:shadow-sm'
              ]"
            >
              <div class="p-2 rounded-lg bg-base-200 group-hover:bg-base-300 transition-colors">
                <label class="swap swap-rotate cursor-pointer">
                  <input 
                    type="checkbox" 
                    aria-label="Toggle theme" 
                    :checked="isDarkTheme()" 
                    @change="toggleTheme" 
                  />
                  <SunIcon class="swap-on w-4 h-4 text-warning"></SunIcon>
                  <MoonIcon class="swap-off w-4 h-4 text-base-content"/>
                </label>
              </div>
              <span class="font-medium">{{ t('drawer-content.app.theme') }}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Footer avec bouton logout moderne - Footer fixe -->
    <div class="p-6 border-t border-base-300 bg-base-100/50 backdrop-blur-sm flex-shrink-0">
      <button
        @click="handleLogout"
        class="btn btn-primary w-full rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
      >
        {{ t('drawer-content.logout') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Scrollbar personnalisée */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: hsl(var(--bc) / 0.2);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--bc) / 0.4);
}
</style>
