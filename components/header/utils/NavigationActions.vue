<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import LanguageComponent from '~/components/header/utils/components/LanguageComponent.vue'
  import LocationContextComponent from '~/components/header/utils/components/LocationContextComponent.vue'

  const { setLocale, locale, t } = useI18n()
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
  watch(
    () => route.path,
    () => {
      const savedLocale = localStorage.getItem('locale')
      if (savedLocale && locale.value !== savedLocale) {
        setLocale(savedLocale as 'fr' | 'en' | 'es')
      }
    }
  )

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

  // Gestion de la navigation clavier
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      showLanguageMenu.value = false
    }
  }
</script>

<template>
  <div
    class="relative"
    role="group"
    :aria-label="t('navigationActions.label')"
    @keydown="handleKeydown"
  >
    <LocationContextComponent :flag="flag" @toggle-language-menu="toggleLanguageMenu" />
    <LanguageComponent :show-language-menu="showLanguageMenu" @change-language="changeLanguage" />
  </div>
</template>

<style scoped>
  /* Amélioration de l'accessibilité pour les éléments interactifs */
  :deep(.btn:focus-visible),
  :deep(input:focus-visible),
  :deep(label:focus-visible) {
    outline: 2px solid #eb5577;
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Amélioration du contraste pour les utilisateurs en mode high-contrast */
  @media (prefers-contrast: more) {
    :deep(.btn) {
      border-width: 2px;
    }
  }

  /* Respect des préférences de réduction de mouvement */
  @media (prefers-reduced-motion: reduce) {
    :deep(.transition-all) {
      transition: none;
    }
  }
</style>
