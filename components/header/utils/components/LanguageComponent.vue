<script setup lang="ts">
const emit = defineEmits(['changeLanguage'])
const props = defineProps<{
  showLanguageMenu: boolean;
}>()
const changeLanguage = (lang: string, flag: string) => {
  emit('changeLanguage', lang, flag)
}
</script>

<template>
  <div
    v-if="props.showLanguageMenu"
    class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 absolute top-full right-0 z-50 mt-2"
  >
    <ul class="menu menu-compact">
      <li>
        <button class="w-full text-left" @click="changeLanguage('fr', '🇫🇷')">
          🇫🇷 Français
        </button>
      </li>
      <li>
        <button class="w-full text-left" @click="changeLanguage('en', '🇬🇧')">
          🇬🇧 English
        </button>
      </li>
      <li>
        <button class="w-full text-left" @click="changeLanguage('es', '🇪🇸')">
          🇪🇸 Español
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
