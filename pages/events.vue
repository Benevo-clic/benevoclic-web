<template>
  <div class="home-page">
    <!-- Skip link pour l'accessibilité -->
    <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Passer au contenu principal"
    >
      Passer au contenu principal
    </a>

    <!-- Contenu principal -->
    <main id="main-content" class="home-content" role="main" aria-label="Page d'accueil Benevoclic">
      <div class="mx-auto px-4 py-6 max-w-screen-2xl w-full">
        <!-- Section filtres -->
        <section aria-labelledby="filters-heading">
          <h2 id="filters-heading" class="sr-only">Filtres de recherche</h2>
          <client-only>
            <div class="bg-base-100 rounded-lg shadow-md p-6 w-full">
              <div class="flex flex-col items-center w-full">
                <VolunteerEventFilters
                    class="mb-4 w-full"
                    :announcements="announcements"
                    @map="handleMapToggle"
                    @filter="handleFilter"
                    @type="handleTypeFilter"
                    :filterannouncement="filterAnnouncement"
                />
              </div>
            </div>
          </client-only>
        </section>

        <!-- Section de chargement -->
        <div
            v-if="isLoading"
            class="fixed inset-0 bg-base-200 bg-opacity-80 z-[1000] flex items-center justify-center"
            role="status"
            aria-live="polite"
            aria-atomic="true"
            aria-label="Chargement en cours"
        >
          <div class="flex flex-col items-center gap-4">
            <img
                src="/logo.png"
                alt="Logo Benevoclic - Chargement en cours"
                class="w-24 h-24 animate-spin"
                aria-hidden="true"
            />
            <span class="text-base-content font-medium">Chargement en cours...</span>
          </div>
        </div>

        <!-- Section résultats -->
        <section v-else aria-labelledby="results-heading">
          <h2 id="results-heading" class="sr-only">Résultats de recherche</h2>
          <div class="bg-base-100 rounded-lg shadow-md p-6 w-full mt-4">
            <NoConnectedAnnouncementList
                :announcements="announcements"
                :total-announcements="totalAnnouncements"
                :error="error.value"
                :loading="loading"
            />
          </div>
        </section>

        <!-- Pagination -->
        <nav
            v-if="totalPages > 1"
            class="flex justify-center mt-6"
            role="navigation"
            aria-label="Navigation des pages"
        >
          <div class="join" role="group" aria-label="Contrôles de pagination">
            <button
                class="join-item btn focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
                :disabled="currentPage === 1"
                @click="goToPage(currentPage - 1)"
                @keyup.enter="goToPage(currentPage - 1)"
                @keyup.space.prevent="goToPage(currentPage - 1)"
                :aria-label="`Aller à la page précédente (page ${currentPage - 1})`"
                :aria-disabled="currentPage === 1"
            >
              <span aria-hidden="true">«</span>
              <span class="sr-only">Page précédente</span>
            </button>
            <button
                class="join-item btn"
                disabled
                aria-current="page"
                aria-label="Page actuelle"
            >
              <span class="sr-only">Page actuelle : </span>
              Page {{ currentPage }} / {{ totalPages }}
            </button>
            <button
                class="join-item btn focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
                :disabled="currentPage === totalPages"
                @click="goToPage(currentPage + 1)"
                @keyup.enter="goToPage(currentPage + 1)"
                @keyup.space.prevent="goToPage(currentPage + 1)"
                :aria-label="`Aller à la page suivante (page ${currentPage + 1})`"
                :aria-disabled="currentPage === totalPages"
            >
              <span aria-hidden="true">»</span>
              <span class="sr-only">Page suivante</span>
            </button>
          </div>
        </nav>

        <!-- Message d'état pour les lecteurs d'écran -->
        <div
            v-if="announcements.length === 0 && !loading && !error.value"
            class="sr-only"
            aria-live="polite"
        >
          Aucun résultat trouvé pour votre recherche
        </div>
        <div
            v-if="error.value"
            class="sr-only"
            aria-live="assertive"
        >
          Erreur lors du chargement des annonces
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {definePageMeta, useAnnouncement} from "#imports";
import {onMounted, computed, ref, watch} from 'vue';
import VolunteerEventFilters from '~/components/event/volunteer/VolunteerEventFilters.vue';
import type {FilterAnnouncement} from "~/common/interface/filter.interface";
import NoConnectedAnnouncementList from "~/components/event/noConnected/NoConnectedAnnouncementList.vue";
import type {Announcement} from "~/common/interface/event.interface";

definePageMeta({
  title: 'Accueil',
  description: 'Trouvez des missions de bénévolat et des événements solidaires près de chez vous',
  layout: 'header'
})

// Configuration SEO spécifique à la page d'accueil
useHead({
  title: 'Benevoclic - Trouvez des missions de bénévolat et des événements solidaires',
  meta: [
    {
      name: 'description',
      content: 'Découvrez des missions de bénévolat, des événements solidaires et des associations près de chez vous. Rejoignez la communauté Benevoclic pour faire du bien autour de vous.'
    },
    {
      name: 'keywords',
      content: 'bénévolat, missions, événements solidaires, associations, entraide, volontariat, engagement citoyen'
    },
    {
      property: 'og:title',
      content: 'Benevoclic - Trouvez des missions de bénévolat et des événements solidaires'
    },
    {
      property: 'og:description',
      content: 'Découvrez des missions de bénévolat, des événements solidaires et des associations près de chez vous.'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:url',
      content: 'https://www.benevoclic.fr'
    },
    {
      name: 'twitter:title',
      content: 'Benevoclic - Trouvez des missions de bénévolat'
    },
    {
      name: 'twitter:description',
      content: 'Découvrez des missions de bénévolat et des événements solidaires près de chez vous.'
    }
  ],
  // Données structurées Schema.org
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Benevoclic",
        "description": "Plateforme de mise en relation entre bénévoles, associations et personnes dans le besoin",
        "url": "https://www.benevoclic.fr",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.benevoclic.fr/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Benevoclic",
          "url": "https://www.benevoclic.fr"
        }
      })
    }
  ]
})

const announcement = useAnnouncement();

let announcements = ref<Announcement[]>([]);
const loading = ref(false);
const error = computed(() => announcement.error);
const currentPage = ref(1);
const pageSize = 9;
const totalAnnouncements = ref(0);
let filterAnnouncement  = announcement.getCurrentFilter.value
let currentFilters = ref<FilterAnnouncement>({
  page: 1,
  limit: pageSize,
  ...filterAnnouncement
});

let currentFilterSearch = ref<FilterAnnouncement>();

watch(
    () => announcement.getCurrentFilter.value,
    async (newFilter) => {
      currentFilterSearch.value = {
        ...newFilter,
      };
      await fetchAnnouncements(1);
    }
)

async function fetchAnnouncements(page = 1) {
  loading.value = true;
  try {
    const base = { page, limit: pageSize };
    const overrides = currentFilterSearch.value
        ? {
          associationName: currentFilterSearch.value.associationName,
          nameEvent:       currentFilterSearch.value.nameEvent,
          description:     currentFilterSearch.value.description,
        }
        : {};
    const filters = {
      ...currentFilters.value,
      ...overrides,
      ...base
    };
    currentFilters.value = filters;

    const response = await announcement.filterAnnouncement(filters);
    const {
      annonces = [],
      meta: { total = 0 } = {}
    } = response || {};

    announcements.value = annonces;
    totalAnnouncements.value = total;
  } catch (error) {
    return;
  } finally {
    loading.value = false;
  }
}

const totalPages = computed(() => Math.ceil(totalAnnouncements.value / pageSize));

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchAnnouncements(page);
    // Amélioration de l'accessibilité pour le scroll
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

function handleMapToggle() {
}

async function handleFilter(filters: FilterAnnouncement) {
  currentFilters.value = {
    ...filters,
    page: currentPage.value,
    limit: pageSize
  };
  currentPage.value = 1;
  console.log('Current Filters:', currentFilters.value);
  // await fetchAnnouncements(1);
}

async function handleTypeFilter(type: string) {
  currentFilters.value.tags = [type];
  currentPage.value = 1;
  await fetchAnnouncements(1);
}

const isLoading = ref(true);

onMounted(async () => {
  announcements.value = announcement.getAnnouncements?.value
  isLoading.value = false;
});

</script>

<style scoped>
/* Amélioration de l'accessibilité pour les éléments interactifs */
.btn:focus-visible {
  outline: 2px solid #eb5577;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Amélioration du contraste pour les utilisateurs en mode high-contrast */
@media (prefers-contrast: more) {
  .btn {
    border-width: 2px;
  }
}

/* Respect des préférences de réduction de mouvement */
@media (prefers-reduced-motion: reduce) {
  .animate-spin {
    animation: none;
  }

  html {
    scroll-behavior: auto;
  }
}

/* Amélioration du focus pour le skip link */
a:focus-visible {
  outline: 2px solid #eb5577;
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
