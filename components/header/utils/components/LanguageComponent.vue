<script setup lang="ts">

const emit = defineEmits(['changeLanguage'])
const props = defineProps<{
  showLanguageMenu: boolean
}>()
const changeLanguage = (lang: string) => {
  emit('changeLanguage', lang)
}

</script>

<template>
  <div v-if="props.showLanguageMenu" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 absolute top-full right-0 z-50 mt-2">
    <ul class="menu menu-compact">
      <li><button @click="changeLanguage('fr')" class="w-full text-left">🇫🇷 Français</button></li>
      <li><button @click="changeLanguage('en')" class="w-full text-left">🇬🇧 English</button></li>
      <li><button @click="changeLanguage('es')" class="w-full text-left">🇪🇸 Español</button></li>
    </ul>
  </div>
</template>

<style scoped>

</style>