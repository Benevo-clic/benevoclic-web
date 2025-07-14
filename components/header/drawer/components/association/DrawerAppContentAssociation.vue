<script setup lang="ts">
import {computed, onMounted, onUnmounted, ref, watch} from 'vue'
import {navigateTo, useRoute} from '#app'
import {
  Bell,
  CalendarIcon,
  CircleHelp,
  ClipboardList,
  Globe,
  LayoutDashboard as DashboardIcon,
  MoonIcon,
  Pencil,
  Settings,
  SunIcon,
  UserRound
} from 'lucide-vue-next'
import {useUser} from '~/composables/auth/useUser'
import LanguageComponent from "~/components/header/utils/components/LanguageComponent.vue";
import {useTheme} from "~/composables/useTheme";
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

async function changeLanguage(lo: 'fr' | 'en' | 'es', flagEmoji: string) {
  await setLocale(lo)
  showLanguageMenu.value = false
  flag.value = flagEmoji

  localStorage.setItem('locale', lo)
  localStorage.setItem('flag', flagEmoji)
}

const profileImageUrl = computed(() => {
  return user.value?.avatarFileKey
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
  <nav class=" pl-4 pr-4 pb-4"  >
    <div class="flex gap-4 justify-end w-full pb-4" >
      <div>
        <h3 class="font-semibold text-lg">{{ association?.associationName }} </h3>
        <p class="text-sm text-base-content opacity-70">{{ user?.email }}</p>
      </div>
      <label for="avatar-upload" class="cursor-pointer" v-if="props.displayProfile">
        <img :src="profileImageUrl" alt="avatar" class="w-12 h-12 rounded-full border-2 border-primary object-cover mb-2" />
        <input id="avatar-upload" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
      </label>
    </div>
  </nav>
  <hr class="pb-2"/>
  <!-- Sections -->
  <nav class="flex-1 min-h-0 overflow-y-auto px-4 py-2 space-y-4" >
    <!-- Account -->
    <div class="space-y-2">
      <h4 class="font-medium text-base-content text-xs uppercase">{{t('drawer-content.account.title')}}</h4>
      <ul class="space-y-1">
        <li><button @click="navigateTo('/association/account/profile'); emit('closeDrawer')" :class="['flex items-center gap-2 p-2 rounded hover:bg-base-200 w-full', isActive('/association/account/profile') ? 'bg-base-200 border-l-4 border-primary' : '']"><UserRound class="w-5 h-5"/>{{t('drawer-content.account.view_profile')}}</button></li>
        <li><button @click="navigateTo('/association/account/edit'); emit('closeDrawer')" :class="['flex items-center gap-2 p-2 rounded hover:bg-base-200 w-full', isActive('/association/account/edit') ? 'bg-base-200 border-l-4 border-primary' : '']"><Pencil class="w-5 h-5"/>{{t('drawer-content.account.edit_profile')}}</button></li>
        <li><button @click="navigateTo('/association/account/settings'); emit('closeDrawer')" :class="['flex items-center gap-2 p-2 rounded hover:bg-base-200 w-full', isActive('/association/account/settings') ? 'bg-base-200 border-l-4 border-primary' : '']"><Settings class="w-5 h-5"/>{{t('drawer-content.account.settings')}}</button></li>
      </ul>
    </div>
    <!-- Activity -->
    <div class="space-y-2" >
      <h4 class="font-medium text-base-content text-xs uppercase">{{t('drawer-content.activity.title')}}</h4>
      <ul class="space-y-1">
        <li><button @click="navigateTo('/association/activity/dashboard'); emit('closeDrawer')" :class="['flex items-center gap-2 p-2 rounded hover:bg-base-200 w-full', isActive('/association/activity/dashboard') ? 'bg-base-200 border-l-4 border-primary' : '']"><DashboardIcon class="w-5 h-5"/>{{t('drawer-content.activity.dashboard')}}</button></li>
        <li><button @click="navigateTo('/association/events/association/manage'); emit('closeDrawer')" :class="['flex items-center gap-2 p-2 rounded hover:bg-base-200 w-full', isActive('/association/events/association/manage') ? 'bg-base-200 border-l-4 border-primary' : '']"><CalendarIcon class="w-5 h-5"/>{{t('drawer-content.activity.manage-event')}}</button></li>
        <li><button @click="navigateTo('/association/events/association/requests'); emit('closeDrawer')" :class="['flex items-center gap-2 p-2 rounded hover:bg-base-200 w-full', isActive('/association/events/association/requests') ? 'bg-base-200 border-l-4 border-primary' : '']"><ClipboardList class="w-5 h-5"/>{{t('drawer-content.activity.requests')}}</button></li>
      </ul>

    </div>
    <!-- Notifications & Support -->
    <div class="space-y-2" >
      <h4 class="font-medium text-base-content text-xs uppercase">{{t('drawer-content.notifications_support.title')}}</h4>
      <ul class="space-y-1">
        <li><button @click="navigateTo('/notifications'); emit('closeDrawer')" :class="['flex items-center gap-2 p-2 rounded hover:bg-base-200 w-full', isActive('/notifications') ? 'bg-base-200 border-l-4 border-primary' : '']"><Bell class="w-5 h-5"/>{{t('drawer-content.notifications_support.notifications')}}</button></li>
        <li><button @click="navigateTo('/help'); emit('closeDrawer')" :class="['flex items-center gap-2 p-2 rounded hover:bg-base-200 w-full', isActive('/help') ? 'bg-base-200 border-l-4 border-primary' : '']"><CircleHelp class="w-5 h-5"/>{{t('drawer-content.notifications_support.help')}}</button></li>
      </ul>
    </div>
    <!-- App -->
    <div class="space-y-2">
      <h4 class="font-medium text-base-content text-xs uppercase">{{t('drawer-content.app.title')}}</h4>
      <ul class="space-y-1">
        <li class="relative">
          <button
              :class="['flex items-center gap-2 p-2 rounded hover:bg-base-200 w-full', showLanguageMenu ? 'bg-base-200 border-l-4 border-primary' : '']"
              @click="toggleLanguageMenu"
          >
            <span>{{ flag }}</span>
            <Globe class="w-5 h-5"/> {{t('drawer-content.app.language')}}
          </button>
          <LanguageComponent
              :show-language-menu="showLanguageMenu"
              class="absolute left-0 mt-0"
              @change-language="changeLanguage"
          />
        </li>

        <li><button :class="['flex items-center gap-2 p-2 rounded hover:bg-base-200 w-full', isDarkTheme() ? 'bg-base-200 border-l-4 border-primary' : '']">
          <label class="swap swap-rotate cursor-pointer">
            <input 
              type="checkbox" 
              aria-label="Toggle theme" 
              :checked="isDarkTheme()" 
              @change="toggleTheme" 
            />
            <SunIcon class="swap-on w-5 h-5 text-warning"></SunIcon>
            <MoonIcon class="swap-off w-5 h-5 text-base-content"/>
          </label>
          <span>{{t('drawer-content.app.theme')}}</span>
        </button>
        </li>
      </ul>
    </div>
  </nav>

  <!-- Footer -->
  <div class="p-4">
    <button
        @click="handleLogout"
        class="btn btn-primary w-full"
    >
      {{t('drawer-content.logout')}}
    </button>
  </div>
</template>

<style scoped>
/* Active menu item styles */
.border-l-4.border-primary {
  padding-left: 6px; /* Adjust padding to account for the border */
  transition: all 0.2s ease-in-out;
}
</style>
