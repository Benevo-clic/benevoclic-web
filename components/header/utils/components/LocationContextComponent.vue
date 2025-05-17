<script setup lang="ts">

import {ChevronDown, Earth, MapPin} from "lucide-vue-next";
import {ref} from "vue";

const currentCity = ref('Rio, Brazil')
const showCityMenu = ref(false)
const showLanguageMenu = ref(false)

const cities = ['Rio, Brazil', 'Paris, France', 'London, UK', 'New York, USA']


const emit = defineEmits<{
  (e: 'toggle-language-menu', show: boolean): void
}>()

function selectCity(city: string) {
  currentCity.value = city
  showCityMenu.value = false
}

function toggleLanguageMenu() {
  showLanguageMenu.value = (!showLanguageMenu.value && !showCityMenu.value)
  emit('toggle-language-menu', showLanguageMenu.value)
}

</script>

<template>
  <div class="flex items-center">

    <!-- Bouton de sélection de ville -->
    <button @click="showCityMenu = (!showCityMenu && !showLanguageMenu)"
            class="btn btn-secondary btn-md  px-0 py-0 flex items-center gap-1">
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

    <button @click="toggleLanguageMenu"
            class="btn btn-secondary  btn-md ml-1 px-2 py-0 flex items-center gap-1" :class="{ 'bg-blue-100': showLanguageMenu }">
      <Earth class="text-gray-700  w-6 h-6" />
    </button>
  </div>

</template>

<style scoped>

</style>