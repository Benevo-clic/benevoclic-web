<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import {
  Pencil,
  Bell,
  CircleHelp,
  UserRound,
  Box,
  ClipboardList,
  Clock,
  Globe,
  Settings,
  SunIcon,
  MoonIcon} from 'lucide-vue-next'
import { useUser } from '~/composables/auth/useUser'
import {useVolunteerAuth} from "~/composables/auth/volunteerAuth";
import LanguageComponent from "~/components/header/utils/components/LanguageComponent.vue";
const { logout: signOut, user } = useUser()
const {volunteer} =useVolunteerAuth()
const { setLocale,t } = useI18n()

const showLanguageMenu = ref(false)


const props = defineProps({
  isAuthenticated: Boolean,
  menuOpen: Boolean,
  displayProfile: Boolean,
})
const emit = defineEmits(['closeDrawer'])

const placeholderUrl = computed(() => {
  const initial = volunteer?.firstName?.charAt(0).toUpperCase() || 'U'
  return `https://ui-avatars.com/api/?name=${initial}&background=0D8ABC&color=fff&size=128`
})
const profileImage = ref<string | null>(null)
const imageSrc = computed(() => profileImage.value || placeholderUrl.value)

function handleLogout() {
  signOut()
  emit('closeDrawer')
}

function handleFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => { profileImage.value = reader.result as string }
    reader.readAsDataURL(file)
  }
}

async function changeLanguage(lo: 'fr' | 'en' | 'es') {
  await setLocale(lo)
  showLanguageMenu.value = false
}

// Function to toggle body scroll
const toggleBodyScroll = (disable: boolean) => {
  if (disable) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// Watch for changes to menuOpen prop
watch(() => props.menuOpen, (isOpen) => {
  toggleBodyScroll(isOpen)
})

// Set initial state when component is mounted
onMounted(() => {
  if (props.menuOpen) {
    toggleBodyScroll(true)
  }
})

// Clean up when component is unmounted
onUnmounted(() => {
  toggleBodyScroll(false)
})

function toggleLanguageMenu() {
  showLanguageMenu.value = !showLanguageMenu.value
  console.log('showLanguageMenu', showLanguageMenu.value)
}

</script>

<template>
  <nav class=" pl-4 pr-4 pb-4"  >
    <div class="flex gap-4 justify-end w-full pb-4" v-if="!props.isAuthenticated" >
      <div>
        <h3 class="font-semibold text-lg">{{ volunteer?.firstName }} {{ volunteer?.lastName }}</h3>
        <p class="text-sm text-gray-500">{{ user?.email }}</p>
      </div>
      <label for="avatar-upload" class="cursor-pointer" v-if="props.displayProfile">
        <img :src="imageSrc" alt="avatar" class="w-12 h-12 rounded-full border-2 border-primary object-cover mb-2" />
        <input id="avatar-upload" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
      </label>
    </div>
  </nav>
  <hr class="pb-2"/>
  <!-- Sections -->
  <nav class="flex-1 min-h-0 overflow-y-auto px-4 py-2 space-y-4">
    <!-- Account -->
    <div class="space-y-2">
      <h4 class="font-medium text-gray-600 text-xs uppercase">{{t('drawer-content.account.title')}}</h4>
      <ul class="space-y-1">
        <li><button class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 w-full"><UserRound class="w-5 h-5"/>{{t('drawer-content.account.view_profile')}}</button></li>
        <li><button class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 w-full"><Pencil class="w-5 h-5"/>{{t('drawer-content.account.edit_profile')}}</button></li>
        <li><button class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 w-full"><Settings class="w-5 h-5"/>{{t('drawer-content.account.settings')}}</button></li>
      </ul>
    </div>
    <!-- Activity -->
    <div class="space-y-2">
      <h4 class="font-medium text-gray-600 text-xs uppercase">{{t('drawer-content.activity.title')}}</h4>
      <ul class="space-y-1">
        <li><button class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 w-full"><Box class="w-5 h-5"/>{{t('drawer-content.activity.my_missions')}}</button></li>
        <li><button class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 w-full"><ClipboardList class="w-5 h-5"/>{{t('drawer-content.activity.my_participations')}}</button></li>
        <li><button class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 w-full"><Clock class="w-5 h-5"/>{{t('drawer-content.activity.history')}}</button></li>
      </ul>
    </div>
    <!-- Notifications & Support -->
    <div class="space-y-2">
      <h4 class="font-medium text-gray-600 text-xs uppercase">{{t('drawer-content.notifications_support.title')}}</h4>
      <ul class="space-y-1">
        <li><button class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 w-full"><Bell class="w-5 h-5"/>{{t('drawer-content.notifications_support.notifications')}}</button></li>
        <li><button class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 w-full"><CircleHelp class="w-5 h-5"/>{{t('drawer-content.notifications_support.help')}}</button></li>
      </ul>
    </div>
    <!-- App -->
    <div class="space-y-2">
      <h4 class="font-medium text-gray-600 text-xs uppercase">{{t('drawer-content.app.title')}}</h4>
      <ul class="space-y-1">
        <li class="relative">
          <!-- Bouton qui ouvre/ferme le menu -->
          <button
              class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 w-full"
              @click="toggleLanguageMenu"
          >
            <Globe class="w-5 h-5"/> {{t('drawer-content.app.language')}}
          </button>
          <LanguageComponent
              :show-language-menu="showLanguageMenu"
              class="absolute left-0 mt-0"
              @change-language="changeLanguage"
          />
        </li>

        <li><button class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 w-full">
          <label class="swap swap-rotate cursor-pointer">
            <input type="checkbox" aria-label="Toggle theme" />
            <SunIcon class="swap-on w-5 h-5 text-yellow-500"></SunIcon>
            <MoonIcon class="swap-off w-5 h-5 text-gray-600"/>
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
        v-if="!props.isAuthenticated"
        @click="handleLogout"
        class="btn btn-primary w-full"
    >
      {{t('drawer-content.logout')}}
    </button>
    <div v-else class="flex flex-col gap-2">
      <HeaderAuthModalAuth />
    </div>
  </div>
</template>

<style scoped>

</style>