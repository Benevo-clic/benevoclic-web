<template>
  <div role="application" aria-label="Benevoclic - Application de bénévolat" class="min-h-screen flex flex-col">
    <!-- Liens de saut pour la navigation clavier -->
    <AccessibleNavigation />
    
    <!-- Loading state -->
    <div
        v-if="isLoading"
        class="fixed inset-0 bg-base-200 bg-opacity-80 z-[1000] flex items-center justify-center"
        role="status"
        aria-live="polite"
        aria-label="Chargement de l'application"
    >
      <div class="flex flex-col items-center gap-4">
        <img
            src="/logo.png"
            alt="Logo Benevoclic - Chargement en cours"
            class="w-24 h-24 animate-spin"
            aria-hidden="true"
        />
        <span class="text-base-content font-medium">Chargement de l'application...</span>
      </div>
    </div>

    <!-- Main layout -->
    <div v-else class="flex flex-col min-h-screen">
      <!-- Header -->
      <Header />
      
      <!-- Main content area with fixed height -->
      <main 
        class="flex-1 p-1 overflow-auto min-h-[calc(100vh-120px)]" 
        role="main" 
        id="main-content"
        aria-label="Contenu principal de l'application"
      >
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

// Configuration SEO globale pour l'application
useHead({
  htmlAttrs: {
    lang: 'fr',
    dir: 'ltr'
  },
  meta: [
    { name: 'application-name', content: 'Benevoclic' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'apple-mobile-web-app-title', content: 'Benevoclic' },
    { name: 'msapplication-TileColor', content: '#eb5577' },
    { name: 'msapplication-config', content: '/browserconfig.xml' }
  ],
  link: [
    { rel: 'manifest', href: '/manifest.json' },
    { rel: 'apple-touch-icon', href: '/logo_benevoclic.png' },
    { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#eb5577' }
  ]
})

// Données structurées pour l'organisation
useSchemaOrg([
  defineOrganization({
    name: 'Benevoclic',
    url: 'https://www.benevoclic.fr',
    logo: 'https://www.benevoclic.fr/logo_benevoclic.png',
    description: 'Plateforme de mise en relation entre bénévoles, associations et personnes dans le besoin',
    sameAs: [
      'https://www.facebook.com/benevoclic',
      'https://www.linkedin.com/company/benevoclic'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['French', 'English', 'Spanish']
    }
  })
])

onMounted(async () => {
  await initializeUser()
  isLoading.value = false
})
</script>
