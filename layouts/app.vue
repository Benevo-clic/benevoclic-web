<template>
  <div role="application" aria-label="Benevoclic - Application de bénévolat" class="min-h-screen flex flex-col">
    <!-- Liens de saut pour la navigation clavier -->
    <AccessibleNavigation />
    
    <!-- Loading state -->
    <div
        v-if="isLoading"
        class="fixed inset-0 bg-base-200 bg-opacity-80 z-[1000] flex items-center justify-center"
    >
      <img
          src="/logo.png"
          alt="Chargement…"
          class="w-24 h-24 animate-spin"
      />
    </div>

    <!-- Main layout -->
    <div v-else class="flex flex-col min-h-screen">
      <!-- Header -->
      <Header />
      
      <!-- Main content area with fixed height -->
      <main class="flex-1 p-1 overflow-auto min-h-[calc(100vh-120px)]" role="main" id="main-content">
        <slot />
      </main>
    </div>
    
    <CookieConsent />
    
    <GlobalPermissionAlert />
  </div>
</template>

<script setup>
import { useUser } from '~/composables/auth/useUser'
import Header from '~/components/header/Header.vue'
import CookieConsent from '~/components/CookieConsent.vue'
import GlobalPermissionAlert from '~/components/utils/GlobalPermissionAlert.vue'
import AccessibleNavigation from '~/components/utils/AccessibleNavigation.vue'
import { onMounted, ref } from 'vue'

const { isAuthenticated, userRole, initializeUser } = useUser()
const isLoading = ref(true)

onMounted(async () => {
  await initializeUser()
  isLoading.value = false
})
</script>
