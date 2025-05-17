<script setup lang="ts">
import {ref} from 'vue'
import LanguageComponent from "~/components/header/utils/components/LanguageComponent.vue";
import LocationContextComponent from "~/components/header/utils/components/LocationContextComponent.vue";

const {setLocale} = useI18n()

const showLanguageMenu = ref(false)



async function changeLanguage(lo: 'fr' | 'en' | 'es') {
  await setLocale(lo)
  showLanguageMenu.value = false
}

function toggleLanguageMenu(value: boolean) {
  showLanguageMenu.value = value
}
</script>

<template>
  <div class="relative">
    <LocationContextComponent @toggle-language-menu="toggleLanguageMenu" />
    <LanguageComponent @change-language="changeLanguage" :show-language-menu="showLanguageMenu" />
  </div>
</template>

