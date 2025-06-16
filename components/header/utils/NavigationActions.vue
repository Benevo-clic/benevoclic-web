<script setup lang="ts">
import {ref, onMounted, watch} from 'vue'
import LanguageComponent from "~/components/header/utils/components/LanguageComponent.vue";
import LocationContextComponent from "~/components/header/utils/components/LocationContextComponent.vue";

const {setLocale, locale} = useI18n()
const route = useRoute()

const showLanguageMenu = ref(false)
const flag = ref('🇫🇷')

// Initialize locale from localStorage on component mount
onMounted(() => {
  const savedLocale = localStorage.getItem('locale')
  const savedFlag = localStorage.getItem('flag')

  if (savedLocale) {
    setLocale(savedLocale as 'fr' | 'en' | 'es')
    flag.value = savedFlag || '🇫🇷'
  }
})

// Watch for route changes to ensure locale persists across navigation
watch(() => route.path, () => {
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale && locale.value !== savedLocale) {
    setLocale(savedLocale as 'fr' | 'en' | 'es')
  }
})

async function changeLanguage(lo: 'fr' | 'en' | 'es', flagEmoji: string) {
  await setLocale(lo)
  showLanguageMenu.value = false
  flag.value = flagEmoji

  localStorage.setItem('locale', lo)
  localStorage.setItem('flag', flagEmoji)
}

function toggleLanguageMenu(value: boolean) {
  showLanguageMenu.value = value
}
</script>

<template>
  <div class="relative">
    <LocationContextComponent @toggle-language-menu="toggleLanguageMenu" :flag="flag" />
    <LanguageComponent @change-language="changeLanguage" :show-language-menu="showLanguageMenu" />
  </div>
</template>
