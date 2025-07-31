<template>
  <div class="home-page">
    <!-- Contenu principal -->
    <main class="home-content" role="main" aria-label="Page d'accueil Benevoclic">
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
            aria-live="polite" aria-atomic="true"
            aria-label="Chargement en cours"
        >
          <img
              src="/logo.png"
              alt="Logo Benevoclic - Chargement en cours"
              class="w-24 h-24 animate-spin"
              aria-hidden="true"
          />
          <span class="sr-only">Chargement en cours...</span>
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
          <div class="join">
            <button
              class="join-item btn"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
              :aria-label="`Aller à la page précédente (page ${currentPage - 1})`"
              :aria-disabled="currentPage === 1"
            >
              <span aria-hidden="true">«</span>
              <span class="sr-only">Page précédente</span>
            </button>
            <button class="join-item btn" disabled aria-current="page">
              <span class="sr-only">Page actuelle : </span>
              Page {{ currentPage }} / {{ totalPages }}
            </button>
            <button
              class="join-item btn"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
              :aria-label="`Aller à la page suivante (page ${currentPage + 1})`"
              :aria-disabled="currentPage === totalPages"
            >
              <span aria-hidden="true">»</span>
              <span class="sr-only">Page suivante</span>
            </button>
          </div>
        </nav>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {definePageMeta, useAnnouncement} from "#imports";
import {onMounted, computed, ref} from 'vue';
import VolunteerEventFilters from '~/components/event/volunteer/VolunteerEventFilters.vue';
import type {FilterAnnouncement} from "~/common/interface/filter.interface";
import NoConnectedAnnouncementList from "~/components/event/noConnected/NoConnectedAnnouncementList.vue";

definePageMeta({
  middleware: ['auth'],
  layout: 'header'
})

// Configuration SEO spécifique à la page d'accueil
useHead({
  title: 'Benevoclic - Trouvez des missions de bénévolat près de chez vous',
  meta: [
    { 
      name: 'description', 
      content: 'Découvrez des missions de bénévolat dans votre région. Rejoignez des associations et participez à des actions solidaires. Inscription gratuite.' 
    },
    { name: 'keywords', content: 'bénévolat, missions, association, volontariat, engagement, solidarité, actions sociales' },
    { property: 'og:title', content: 'Benevoclic - Trouvez des missions de bénévolat près de chez vous' },
    { property: 'og:description', content: 'Découvrez des missions de bénévolat dans votre région. Rejoignez des associations et participez à des actions solidaires.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://www.benevoclic.fr' },
    { name: 'twitter:title', content: 'Benevoclic - Trouvez des missions de bénévolat près de chez vous' },
    { name: 'twitter:description', content: 'Découvrez des missions de bénévolat dans votre région. Rejoignez des associations et participez à des actions solidaires.' }
  ],
  link: [
    { rel: 'canonical', href: 'https://www.benevoclic.fr' }
  ]
});

// Configuration Schema.org pour la page d'accueil
useSchemaOrg([
  defineWebPage({
    name: 'Accueil - Benevoclic',
    description: 'Trouvez des missions de bénévolat près de chez vous',
    url: 'https://www.benevoclic.fr',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Accueil',
          item: 'https://www.benevoclic.fr'
        }
      ]
    }
  }),
  defineOrganization({
    name: 'Benevoclic',
    url: 'https://www.benevoclic.fr',
    logo: 'https://www.benevoclic.fr/logo_benevoclic.png',
    description: 'Plateforme de bénévolat connectant associations et volontaires'
  })
]);

const announcement = useAnnouncement();

const announcements = ref<any[]>([]);
const loading = ref(false);
const error = computed(() => announcement.error);
const currentPage = ref(1);
const pageSize = 9;
const totalAnnouncements = ref(0);
const currentFilters = ref<FilterAnnouncement>({
  page: 1,
  limit: pageSize
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  await fetchAnnouncements(1);
}

async function handleTypeFilter(type: string) {
  currentFilters.value.tags = [type];
  currentPage.value = 1;
  await fetchAnnouncements(1);
}

const isLoading = ref(true);

onMounted(async () => {
  await fetchAnnouncements(1);
  isLoading.value = false;
});

</script>

<style scoped>
</style>
