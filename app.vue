<script setup lang="ts">
import Footer from './layouts/footer.vue';
import CookieConsent from './components/CookieConsent.vue';

// Configuration SEO globale
useHead({
  title: 'Benevoclic - Plateforme de bénévolat',
  meta: [
    { name: 'description', content: 'Connectez-vous avec des associations et participez à des missions de bénévolat' },
    { name: 'keywords', content: 'bénévolat, association, volontariat, engagement, solidarité' },
    { property: 'og:title', content: 'Benevoclic - Plateforme de bénévolat' },
    { property: 'og:description', content: 'Connectez-vous avec des associations et participez à des missions de bénévolat' },
    { property: 'og:image', content: '/logo_benevoclic.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Benevoclic - Plateforme de bénévolat' },
    { name: 'twitter:description', content: 'Connectez-vous avec des associations et participez à des missions de bénévolat' }
  ],
  link: [
    { rel: 'canonical', href: 'https://benevoclic.app' }
  ]
});

// Configuration Schema.org globale
useSchemaOrg([
  defineWebSite({
    name: 'Benevoclic',
    url: 'https://benevoclic.app',
    description: 'Plateforme de bénévolat connectant associations et volontaires',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://benevoclic.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  })
]);
</script>

<template>
  <div id="app" class="min-h-screen flex flex-col">
    <!-- Skip to main content link for accessibility -->
    <a 
      href="#main-content" 
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
      aria-label="Passer au contenu principal"
    >
      Passer au contenu principal
    </a>
    
    <NuxtLayout>
      <main id="main-content" role="main" class="flex-1 min-h-[calc(100vh-120px)]">
        <NuxtPage />
      </main>
      <Footer />
      <CookieConsent />
    </NuxtLayout>
  </div>
</template>

<style>
/* Styles pour l'accessibilité */
:focus {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}

/* Amélioration du contraste pour le mode sombre */
@media (prefers-color-scheme: dark) {
  :focus {
    outline-color: #60A5FA;
  }
}

/* Animation de transition de page */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* Styles pour les lecteurs d'écran */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Amélioration de l'accessibilité pour les éléments interactifs */
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
}
</style>
