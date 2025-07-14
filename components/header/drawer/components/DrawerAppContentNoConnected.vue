<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import {  useRoute } from '#app'
import {

  Globe,
  SunIcon,
  MoonIcon} from 'lucide-vue-next'

import LanguageComponent from "~/components/header/utils/components/LanguageComponent.vue";
import { useTheme } from "~/composables/useTheme";
const { setLocale,t, locale } = useI18n()
const { toggleTheme, isDarkTheme } = useTheme()
const route = useRoute()

const showLanguageMenu = ref(false)
const flag = ref('🇫🇷')



const props = defineProps({
  menuOpen: Boolean,
  displayProfile: Boolean,
})
const emit = defineEmits(['closeDrawer'])


async function changeLanguage(lo: 'fr' | 'en' | 'es', flagEmoji: string) {
  await setLocale(lo)
  showLanguageMenu.value = false
  flag.value = flagEmoji

  localStorage.setItem('locale', lo)
  localStorage.setItem('flag', flagEmoji)
}


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
  <div v-bind="$attrs" class="flex flex-col h-full">


    <!-- Sections -->
    <nav class="flex-1 min-h-0 overflow-y-auto px-4 py-2 space-y-4 pt-8" >
      <!-- App -->
      <div class="space-y-2">
        <h4 class="font-medium text-base-content text-xs uppercase">{{t('drawer-content.app.title')}}</h4>
        <ul class="space-y-1">
          <li class="relative">
            <!-- Bouton qui ouvre/ferme le menu -->
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
      <div class="flex flex-col gap-2">
        <HeaderAuthModalAuth />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Active menu item styles */
.border-l-4.border-primary {
  padding-left: 6px; /* Adjust padding to account for the border */
  transition: all 0.2s ease-in-out;
}
</style>
