<script setup lang="ts">
  import CookieConsent from './components/CookieConsent.vue'

  // Initialiser Firebase côté client
  if (process.client) {
    onMounted(async () => {
      try {
        const { useFirebase } = await import('~/composables/useFirebase')
        const { initializeFirebase } = useFirebase()

        await initializeFirebase()
        console.log('✅ Firebase initialisé via app.vue')
      } catch (error) {
        console.error("❌ Erreur lors de l'initialisation Firebase via app.vue:", error)
      }
    })
  }

  const siteDescription =
    'Benevoclic met en relation bénévoles, associations et personnes dans le besoin : publiez et découvrez des événements solidaires, trouvez des missions et mobilisez l’entraide.'

  useHead({
    title: 'Benevoclic - Plateforme d’engagement solidaire',
    meta: [
      { name: 'description', content: siteDescription },
      {
        name: 'keywords',
        content:
          'bénévolat, association, événements solidaires, aide, entraide, missions, bénévoles'
      },
      {
        property: 'og:title',
        content: 'Benevoclic - Plateforme d’engagement solidaire'
      },
      { property: 'og:description', content: siteDescription },
      { property: 'og:image', content: '/logo_benevoclic.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'Benevoclic - Plateforme d’engagement solidaire'
      },
      { name: 'twitter:description', content: siteDescription },
      { name: 'theme-color', content: '#3B82F6' }
    ],
    link: [
      { rel: 'canonical', href: 'https://www.benevoclic.fr/' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebSite',
              url: 'https://www.benevoclic.fr/',
              name: 'Benevoclic',
              description: siteDescription,
              publisher: { '@id': 'https://www.benevoclic.fr/#organization' },
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://www.benevoclic.fr/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
              }
            },
            {
              '@type': 'Organization',
              '@id': 'https://www.benevoclic.fr/#organization',
              name: 'Benevoclic',
              url: 'https://www.benevoclic.fr/',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.benevoclic.fr/logo_benevoclic.png'
              }
            }
          ]
        })
      } as any
    ] as any
  })
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
      <CookieConsent />
    </NuxtLayout>
  </div>
</template>

<style>
  /* Styles pour l'accessibilité */
  :focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Amélioration du contraste pour le mode sombre */
  @media (prefers-color-scheme: dark) {
    :focus {
      outline-color: #60a5fa;
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
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
</style>
