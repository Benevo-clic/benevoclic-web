<script setup lang="ts">
import {ChevronDown, Earth, MapPin} from "lucide-vue-next"
import {ref} from 'vue'

const {locale, setLocale} = useI18n()

const currentCity = ref('Rio, Brazil')
const showCityMenu = ref(false)
const showLanguageMenu = ref(false)

const cities = ['Rio, Brazil', 'Paris, France', 'London, UK', 'New York, USA']

function selectCity(city: string) {
  currentCity.value = city
  showCityMenu.value = false
}

async function changeLanguage(lo: 'fr' | 'en' | 'es') {
  await setLocale(lo)
  showLanguageMenu.value = false
  console.log('Langue actuelle :', locale.value)
}
</script>

<template>
  <div class="relative">
    <!-- Contrôles principaux -->
    <div class="flex items-center">

      <!-- Bouton de sélection de ville -->
      <button @click="showCityMenu = (!showCityMenu && !showLanguageMenu)"
              class="btn btn-secondary btn-sm border-gray-700 px-0 py-0 flex items-center gap-1">
        <MapPin class="text-gray-700 w-6 h-6" />
        <span class="text-sm text-gray-700">{{ currentCity }}</span>
        <ChevronDown :class="showCityMenu ? 'rotate-180 transition-transform' : 'transition-transform'" class="w-4 h-4 text-gray-700" />
      </button>

      <div v-if="showCityMenu && !showLanguageMenu" class="dropdown-content menu p-2   shadow bg-base-100 rounded-box w-52 absolute top-full left-12 z-50">
        <ul class="menu menu-compact">
          <li v-for="city in cities" :key="city">
            <button @click="selectCity(city)" class="w-full text-left">{{ city }}</button>
          </li>
        </ul>
      </div>

      <button @click="showLanguageMenu = (!showLanguageMenu && !showCityMenu)"
              class="btn btn-secondary border-gray-700 btn-sm ml-1 px-2 py-0 flex items-center gap-1" :class="{ 'bg-blue-100': showLanguageMenu }">
        <Earth class="text-gray-700  w-6 h-6" />
      </button>
    </div>

    <!-- Menu déroulant des langues -->
    <div v-if="showLanguageMenu" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 absolute top-full right-0 z-50 mt-2">
      <ul class="menu menu-compact">
        <li><button @click="changeLanguage('fr')" class="w-full text-left">🇫🇷 Français</button></li>
        <li><button @click="changeLanguage('en')" class="w-full text-left">🇬🇧 English</button></li>
        <li><button @click="changeLanguage('es')" class="w-full text-left">🇪🇸 Español</button></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Plus besoin de SCSS avec DaisyUI, tout est géré via classes CSS utilitaires */
</style>
