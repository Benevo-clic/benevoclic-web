<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import {  useRoute } from '#app'
import {

  Globe,
  SunIcon,
  MoonIcon,
  UserRound} from 'lucide-vue-next'

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
  <div class="flex flex-col h-full">
    <!-- Welcome Section - Header fixe -->
    <div class="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-base-300 flex-shrink-0">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-2xl flex items-center justify-center">
          <UserRound class="w-8 h-8 text-primary" />
        </div>
        <h3 class="font-bold text-lg text-base-content mb-2">
          Bienvenue sur BeneVoclic
        </h3>
        <p class="text-sm text-base-content/70">
          Connectez-vous pour accéder à toutes les fonctionnalités
        </p>
      </div>
    </div>

    <!-- Navigation avec design moderne - Contenu scrollable -->
    <nav class="flex-1 overflow-y-auto">
      <div class="p-4 space-y-6 pb-4">
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

    <!-- Footer avec authentification - Footer fixe -->
    <div class="p-6 border-t border-base-300 bg-base-100/50 backdrop-blur-sm flex-shrink-0">
      <div class="space-y-3">
        <HeaderAuthModalAuth />
      </div>
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
