<script setup lang="ts">
import { definePageMeta, useHead, useAnnouncement,useVolunteerAuth,useAssociationAuth, navigateTo } from "#imports";
import { onMounted, ref, computed, onUnmounted, watch } from 'vue';
import { Users, HeartHandshake, ArrowRight, Search, Award, Clock, Shield, ChevronDown, ChevronRight, MapPin, X, SlidersHorizontal } from 'lucide-vue-next';
import { useUserLocation } from '~/composables/useUserLocation';
import NoConnectedAnnouncementCard from "~/components/event/noConnected/NoConnectedAnnouncementCard.vue";
import NoConnectedAnnouncementList from "~/components/event/noConnected/NoConnectedAnnouncementList.vue";
import VolunteerEventFilters from "~/components/event/volunteer/VolunteerEventFilters.vue";
import type { Announcement } from "~/common/interface/event.interface";
import type { FilterAnnouncement } from "~/common/interface/filter.interface";



definePageMeta({
  middleware: ['auth'],
  layout: 'header'
})

useHead({
  title: 'Benevoclic - Espace Bénévole | Participez à des événements solidaires',
  meta: [
    {
      name: 'description',
      content: 'Découvrez des événements et missions adaptés à vos compétences et disponibilités. Rejoignez la communauté Benevoclic, aidez les associations et participez à des actions solidaires.'
    },
    {
      name: 'keywords',
      content: 'bénévolat, missions, événements, volontariat, engagement citoyen, aide, solidarité, compétences, personnes dans le besoin'
    }
  ]
})

const announcement = useAnnouncement();
const associations = useAssociationAuth()
const volunteers = useVolunteerAuth()
const featuredEvents = ref<Announcement[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const currentSlideIndex = ref(0);
let countAssociation = ref(0)
const countVolunteer = ref(0);

const totalEvents = ref(0);
const totalAssociations = ref(0);
const totalVolunteerSlots = ref(0);

// Nouvelles variables pour la recherche
const showSearchResults = ref(false);
const searchAnnouncements = ref<Announcement[]>([]);
const searchLoading = ref(false);
const searchError = ref<string | null>(null);
const searchTotalAnnouncements = ref(0);
const currentSearchPage = ref(1);
const pageSize = 9;
const searchTotalPages = computed(() => Math.ceil(searchTotalAnnouncements.value / pageSize));

const isVisible = ref<{ [key: string]: boolean }>({
  hero: true,
  search: false,
  stats: false,
  events: false,
  benefits: false,
  howItWorks: false,
  cta: false
});
const animatedStats = ref<{ [key: string]: number }>({
  events: 0,
  associations: 0,
  volunteers: 0
});
const statsAnimationStarted = ref(false);

let observers: IntersectionObserver[] = [];

// État partagé pour les filtres
const sharedFilters = ref<FilterAnnouncement>({
  nameEvent: undefined,
  description: undefined,
  status: undefined,
  hoursEventFrom: undefined,
  hoursEventTo: undefined,
  dateEventFrom: undefined,
  dateEventTo: undefined,
  publicationInterval: undefined,
  datePublicationFrom: undefined,
  datePublicationTo: undefined,
  tags: [],
  latitude: undefined,
  longitude: undefined,
  radius: 0,
  page: 1,
  limit: 9,
  sort: undefined
});

// Variables pour la recherche rapide (synchronisées avec sharedFilters)
const searchQuery = computed({
  get: () => sharedFilters.value.nameEvent || "",
  set: (value: string) => {
    sharedFilters.value.nameEvent = value || undefined;
    sharedFilters.value.description = value || undefined;
    sharedFilters.value.associationName = value || undefined;
  }
});

const searchTimeout = ref<NodeJS.Timeout | null>(null);

const filteredEventsCount = ref<number>(0);
const isCounting = ref<boolean>(false);
const countTimeout = ref<NodeJS.Timeout | null>(null);

const useCurrentLocation = ref<boolean>(false);
const locationRadius = ref<number>(5);
const userCurrentLocation = ref<any>(null);
const currentLatitude = ref<number>();
const currentLongitude = ref<number>();
const canUseLocation = ref<boolean>(false);
const resetLocation = ref(false);
const startSearching = ref(false);


async function fetchFeaturedEvents() {
  isLoading.value = true;
  try {
    const fetchFilter: FilterAnnouncement = {
      page: 1,
      limit: 9,
      sort: "dateEvent_asc"
    };

    const response = await announcement.filterAnnouncement(fetchFilter);
    if (response && response.annonces) {
      featuredEvents.value = response.annonces;

      totalEvents.value = response.meta.total || 0;

      const uniqueAssociations = new Set();
      let volunteerSlots = 0;

      response.annonces.forEach(event => {
        if (event.associationId) {
          uniqueAssociations.add(event.associationId);
        }
        volunteerSlots += (event.maxVolunteers || 0) - (event.nbVolunteers || 0);
      });

      totalAssociations.value = uniqueAssociations.size;
      totalVolunteerSlots.value = volunteerSlots;
    }

    countAssociation.value = await associations.getNumberOfAssociations()
    countVolunteer.value = await volunteers.getNumberOfVolunteers()
  } catch (err: any) {
    error.value = err?.message || "Erreur lors de la récupération des événements";
    console.error("Erreur lors de la récupération des événements:", err);
  } finally {
    isLoading.value = false;
  }
}

async function searchEvents(page = 1) {
  // Vérifier qu'au moins un critère de recherche est fourni
  const hasSearchCriteria = sharedFilters.value.nameEvent?.trim()
  startSearching.value = true;

  if (!hasSearchCriteria) {
    return;
  }

  searchLoading.value = true;
  if (page === 1) {
    showSearchResults.value = true;
  }
  
  try {
    const filters: FilterAnnouncement = {
      ...sharedFilters.value,
      page: page,
      limit: pageSize
    };

    // Nettoyer les propriétés undefined
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
    ) as FilterAnnouncement;

    const response = await announcement.filterAnnouncement(cleanFilters);
    if (response && response.annonces) {
      searchAnnouncements.value = response.annonces;
      searchTotalAnnouncements.value = response.meta?.total || 0;
      currentSearchPage.value = page;
      
      if (page === 1) {
        setTimeout(() => {
          const searchSection = document.getElementById('search-section');
          if (searchSection) {
            searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  } catch (err: any) {
    console.error("Erreur lors de la recherche:", err);
    
    if (err?.status === 400) {
      searchError.value = "Les critères de recherche ne sont pas valides. Veuillez vérifier vos filtres.";
    } else if (err?.status === 500) {
      searchError.value = "Erreur serveur. Veuillez réessayer plus tard.";
    } else {
      searchError.value = err?.message || "Erreur lors de la recherche";
    }
  } finally {
    searchLoading.value = false;
  }
}

async function handleSearchFilter(filters: FilterAnnouncement) {
  searchLoading.value = true;
  
  try {
    sharedFilters.value = {
      ...sharedFilters.value,
      ...filters,
      page: 1,
      limit: pageSize
    };
    
    const cleanFilters = Object.fromEntries(
      Object.entries(sharedFilters.value).filter(([_, value]) => value !== undefined && value !== null)
    ) as FilterAnnouncement;
    
    const response = await announcement.filterAnnouncement(cleanFilters);
    if (response && response.annonces) {
      searchAnnouncements.value = response.annonces;
      searchTotalAnnouncements.value = response.meta?.total || 0;
      currentSearchPage.value = 1;
    }
  } catch (err: any) {
    console.error("Erreur lors de la recherche:", err);
    
    // Gestion spécifique des erreurs
    if (err?.status === 400) {
      searchError.value = "Les critères de recherche ne sont pas valides. Veuillez vérifier vos filtres.";
    } else if (err?.status === 500) {
      searchError.value = "Erreur serveur. Veuillez réessayer plus tard.";
    } else {
      searchError.value = err?.message || "Erreur lors de la recherche";
    }
  } finally {
    searchLoading.value = false;
  }
}

function closeSearchResults() {
  showSearchResults.value = false;
  startSearching.value = false;
  
  setTimeout(() => {
    searchAnnouncements.value = [];
    searchError.value = null;
    searchTotalAnnouncements.value = 0;
    currentSearchPage.value = 1;
  }, 500);
  
  const searchSection = document.getElementById('search-section');
  if (searchSection) {
    searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function resetAllFilters() {
  sharedFilters.value = {
    nameEvent: undefined,
    description: undefined,
    status: undefined,
    hoursEventFrom: undefined,
    hoursEventTo: undefined,
    dateEventFrom: undefined,
    dateEventTo: undefined,
    publicationInterval: undefined,
    datePublicationFrom: undefined,
    datePublicationTo: undefined,
    tags: [],
    latitude: undefined,
    longitude: undefined,
    radius: 0,
    page: 1,
    limit: 9,
    sort: undefined
  };
  
  // Réinitialiser les variables locales
  useCurrentLocation.value = false;
  locationRadius.value = 5;
  resetLocation.value = true;
  searchError.value = null;
  
  // Réinitialiser les compteurs
  filteredEventsCount.value = 0;
  isCounting.value = false;
}

function goToSearchPage(page: number) {
  if (page >= 1 && page <= searchTotalPages.value) {
    searchEvents(page);
    // Scroll vers les résultats
    setTimeout(() => {
      const searchResults = document.querySelector('.search-results');
      if (searchResults) {
        searchResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }
}


async function countFilteredEvents() {
  if (countTimeout.value) {
    clearTimeout(countTimeout.value);
  }

  countTimeout.value = setTimeout(async () => {
    isCounting.value = true;
    
    try {
      const filters: Partial<FilterAnnouncement> = {
        ...sharedFilters.value,
        page: 1,
        limit: 9
      };

      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
      ) as FilterAnnouncement;

      const response = await announcement.filterAnnouncement(cleanFilters);
      filteredEventsCount.value = response?.meta?.total || 0;
    } catch (error) {
      console.error('Erreur lors du comptage des événements:', error);
      filteredEventsCount.value = 0;
    } finally {
      isCounting.value = false;
    }
  }, 500);
}

const hasActiveFilters = computed(() => {
  return sharedFilters.value.nameEvent || 
         sharedFilters.value.dateEventFrom || 
         sharedFilters.value.dateEventTo || 
         sharedFilters.value.status ||
         sharedFilters.value.sort ||
         (sharedFilters.value.tags && sharedFilters.value.tags.length > 0) ||
         sharedFilters.value.latitude ||
         sharedFilters.value.longitude ||
         sharedFilters.value.radius;
});

const userLocation = useUserLocation();

const checkLocationPermissions = async () => {
  try {
    const { usePermissions } = await import('~/composables/usePermissions');
    const { hasPermission, loadCookiePreferences } = usePermissions();

    loadCookiePreferences();
    canUseLocation.value = hasPermission('canUseLocation');

    if (!canUseLocation.value) {
      console.log('Cookies de personnalisation non acceptés - géolocalisation désactivée');
    }
  } catch (err) {
    console.warn('Impossible de vérifier les permissions de géolocalisation:', err);
    canUseLocation.value = false;
  }
};

const initLocation = async () => {
  try {
    const location = await userLocation.getUserLocation()
    if (location) {
      currentLatitude.value = location.latitude
      currentLongitude.value = location.longitude
      userCurrentLocation.value = {
        place_id: 'current_location',
        display_name: 'Ma position actuelle',
        city: location.city || 'Position détectée',
        lat: location.latitude.toString(),
        lon: location.longitude.toString()
      }
    } else {
      console.log('Aucune position obtenue');
    }
  } catch (error) {
    console.error('Error getting user location:', error)
  }
}

function triggerCount() {
  countFilteredEvents();
}

function animateCounters() {
  if (statsAnimationStarted.value) return;
  statsAnimationStarted.value = true;

  const duration = 2000; // 2 seconds
  const steps = 60;
  const interval = duration / steps;

  let step = 0;
  const timer = setInterval(() => {
    step++;
    const progress = step / steps;

    // Easing function for smoother animation
    const easeOutQuad = (t: number) => t * (2 - t);
    const easedProgress = easeOutQuad(progress);

    animatedStats.value.events = Math.round(easedProgress * totalEvents.value);
    animatedStats.value.associations = Math.round(easedProgress * countAssociation.value);
    animatedStats.value.volunteers = Math.round(easedProgress * countVolunteer.value);

    if (step >= steps) {
      clearInterval(timer);
      animatedStats.value.events = totalEvents.value;
      animatedStats.value.associations = countAssociation.value;
      animatedStats.value.volunteers = countVolunteer.value;
    }
  }, interval);
}

function setupScrollObservers() {
  const sections = [
    { id: 'search-section', key: 'search' },
    { id: 'stats-section', key: 'stats' },
    { id: 'events-section', key: 'events' },
    { id: 'benefits-section', key: 'benefits' },
    { id: 'how-it-works-section', key: 'howItWorks' },
    { id: 'cta-section', key: 'cta' }
  ];

  sections.forEach(section => {
    const element = document.getElementById(section.id);
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible.value[section.key] = true;

          // Start counter animation when stats section becomes visible
          if (section.key === 'stats' && !statsAnimationStarted.value) {
            animateCounters();
          }
        }
      });
    }, { threshold: 0.2 }); // Trigger when 20% of the element is visible

    observer.observe(element);
    observers.push(observer);
  });
}

onMounted(async () => {
  await fetchFeaturedEvents();

  // Initialize carousel to first slide
  if (featuredEvents.value.length > 0) {
    currentSlideIndex.value = 0;
    // Use setTimeout to ensure DOM is updated
    setTimeout(() => {
      window.location.hash = `search-section`;
    }, 100);
  }

  setTimeout(() => {
    setupScrollObservers();
  }, 200);

  filteredEventsCount.value = totalEvents.value;

  await userLocation.initializeLocation();
  await checkLocationPermissions();
  await initLocation();
});

watch([sharedFilters], () => {
  triggerCount();
}, { deep: true });

onUnmounted(() => {
  observers.forEach(observer => observer.disconnect());
  observers = [];
  
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  
  if (countTimeout.value) {
    clearTimeout(countTimeout.value);
  }
});
</script>

<template>
  <div class="volunteer-home">
    <!-- Skip link pour l'accessibilité -->
    <a
        href="#main-content"
        class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Passer au contenu principal"
    >
      Passer au contenu principal
    </a>

    <!-- Contenu principal -->
    <main id="main-content" class="volunteer-content" role="main" aria-label="Page d'accueil Bénévole">
      <!-- Section Hero -->
      <section class="hero min-h-[70vh] bg-gradient-to-br from-primary/10 to-secondary/10 py-16 px-4 flex items-center relative" v-if="!startSearching">
        <div class="max-w-6xl mx-auto w-full">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div class="space-y-6 slide-in-left visible">
              <h1 class="text-4xl md:text-5xl font-bold text-base-content">
                Faites la différence avec <span class="text-primary">Benevoclic</span>
              </h1>
              <p class="text-lg text-base-content/80 max-w-xl">
                Découvrez des événements et missions qui correspondent à vos compétences,
                vos centres d'intérêt et vos disponibilités. Que vous soyez bénévole ou
                personne dans le besoin, rejoignez une communauté engagée et participez
                à des projets solidaires.
              </p>
              <div class="flex flex-wrap gap-4">
                <NuxtLink to="/events" class="btn btn-primary group">
                  Découvrir les événements
                  <ArrowRight class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </NuxtLink>
                <button class="btn btn-outline hover:scale-105 transition-transform duration-300">
                  En savoir plus
                </button>
              </div>
            </div>
            <div class="relative slide-in-right visible delay-400 hidden lg:block">
              <img
                  src="/images/volunteer-info.png"
                  alt="Bénévoles en action"
                  class="w-full h-auto rounded-xl shadow-xl transform hover:scale-[1.02] transition-transform duration-500"
                  loading="lazy"
              />
            </div>
          </div>
        </div>

      </section>

      <!-- Section Recherche Rapide -->
      <section id="search-section" class="py-12 px-4 bg-base-100">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-10 slide-in-up" :class="{ 'visible': isVisible.search }">
            <h2 class="text-3xl font-bold mb-4">Trouvez l'événement qui vous correspond</h2>
            <p class="text-base-content/70 max-w-2xl mx-auto">
              Utilisez notre moteur de recherche avancé pour trouver des événements
              qui correspondent à vos besoins, que vous souhaitiez aider ou participer.
            </p>
          </div>

          <!-- Barre de recherche simple -->
          <div class="bg-base-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 slide-in-up delay-200" :class="{ 'visible': isVisible.search }">
            <div class="form-control mb-6">
              <label class="label">
                <span class="label-text font-medium">Rechercher un événement</span>
              </label>
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  placeholder="Rechercher par nom d'événement, description, nom d'association..." 
                  class="input input-bordered w-full pl-10 focus:border-primary transition-colors duration-300"
                  @keyup.enter="() => searchEvents()"
                />
              </div>
            </div>

            <!-- Compteur d'événements filtrés -->
            <div v-if="hasActiveFilters" class="mb-4 text-center">
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full">
                <div v-if="isCounting" class="loading loading-spinner loading-sm"></div>
                <span v-else class="font-medium">
                  {{ filteredEventsCount }} événement{{ filteredEventsCount !== 1 ? 's' : '' }} trouvé{{ filteredEventsCount !== 1 ? 's' : '' }}
                </span>
              </div>
            </div>

            <!-- Boutons d'action -->
            <div class="flex justify-center gap-4">
              <button 
                @click="() => searchEvents()" 
                :disabled="searchLoading"
                class="btn btn-primary px-8 group hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search v-if="!searchLoading" class="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <div v-else class="loading loading-spinner loading-sm mr-2"></div>
                {{ searchLoading ? 'Recherche en cours...' : 'Trouver des événements' }}
              </button>
              
              <button 
                @click="resetAllFilters" 
                class="btn btn-outline px-6 group hover:scale-105 transition-transform duration-300"
                :disabled="!hasActiveFilters"
              >
                <X class="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Réinitialiser
              </button>
            </div>
          </div>

          <!-- Résultats de recherche avec transition -->
          <div 
            v-if="showSearchResults" 
            class="mt-8 transition-all duration-500 ease-in-out search-results"
            :class="showSearchResults ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
          >
            <!-- Header des résultats -->
            <div class="flex justify-between items-center mb-6">
              <div class="flex items-center gap-4">
                <h3 class="text-2xl font-bold">Résultats de recherche</h3>
                <div class="badge badge-primary">
                  {{ searchTotalAnnouncements }} résultat{{ searchTotalAnnouncements !== 1 ? 's' : '' }}
                </div>
                <div v-if="hasActiveFilters" class="badge badge-secondary">
                  <SlidersHorizontal class="w-3 h-3 mr-1" />
                  Filtres actifs
                </div>
              </div>
              <button 
                @click="closeSearchResults" 
                class="btn btn-ghost btn-sm"
                aria-label="Fermer les résultats de recherche"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Filtres avancés pour les résultats -->
            <div class="bg-base-100 rounded-lg shadow-md p-6 mb-6">
              <VolunteerEventFilters
                :announcements="searchAnnouncements"
                @filter="handleSearchFilter"
                :filterannouncement="sharedFilters"
              />
            </div>

            <!-- Liste des annonces -->
            <div class="bg-base-100 rounded-lg shadow-md p-6">
              <NoConnectedAnnouncementList
                :announcements="searchAnnouncements"
                :total-announcements="searchTotalAnnouncements"
                :error="searchError"
                :loading="searchLoading"
              />
            </div>

            <!-- Pagination -->
            <nav
                v-if="searchTotalPages > 1"
                class="flex justify-center mt-6"
                role="navigation"
                aria-label="Navigation des pages de recherche"
            >
              <div class="join" role="group" aria-label="Contrôles de pagination">
                <button
                    class="join-item btn focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
                    :disabled="currentSearchPage === 1"
                    @click="goToSearchPage(currentSearchPage - 1)"
                    @keyup.enter="goToSearchPage(currentSearchPage - 1)"
                    @keyup.space.prevent="goToSearchPage(currentSearchPage - 1)"
                    :aria-label="`Aller à la page précédente (page ${currentSearchPage - 1})`"
                    :aria-disabled="currentSearchPage === 1"
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
                  Page {{ currentSearchPage }} / {{ searchTotalPages }}
                </button>
                <button
                    class="join-item btn focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
                    :disabled="currentSearchPage === searchTotalPages"
                    @click="goToSearchPage(currentSearchPage + 1)"
                    @keyup.enter="goToSearchPage(currentSearchPage + 1)"
                    @keyup.space.prevent="goToSearchPage(currentSearchPage + 1)"
                    :aria-label="`Aller à la page suivante (page ${currentSearchPage + 1})`"
                    :aria-disabled="currentSearchPage === searchTotalPages"
                >
                  <span aria-hidden="true">»</span>
                  <span class="sr-only">Page suivante</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </section>

      <!-- Section Statistiques -->
      <section id="stats-section" class="py-16 px-4 bg-base-200" v-if="!startSearching">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12 slide-in-up" :class="{ 'visible': isVisible.stats }">
            <h2 class="text-3xl font-bold mb-4">Benevoclic en chiffres</h2>
            <p class="text-base-content/70 max-w-2xl mx-auto">
              Rejoignez notre communauté grandissante et participez à des événements qui font la différence.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-base-100 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center slide-in-up delay-200" :class="{ 'visible': isVisible.stats }">
              <div class="text-4xl font-bold text-primary mb-2 counter-animate">
                {{ animatedStats.events }}
              </div>
              <div class="text-xl font-semibold mb-2">Événements</div>
              <p class="text-base-content/70">
                Événements disponibles sur notre plateforme pour vous engager et faire la différence.
              </p>
            </div>

            <div class="bg-base-100 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center slide-in-up delay-400" :class="{ 'visible': isVisible.stats }">
              <div class="text-4xl font-bold text-secondary mb-2 counter-animate">
                {{ animatedStats.associations }}
              </div>
              <div class="text-xl font-semibold mb-2">Associations</div>
              <p class="text-base-content/70">
                Associations actives qui proposent des missions et événements variés.
              </p>
            </div>

            <div class="bg-base-100 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center slide-in-up delay-600" :class="{ 'visible': isVisible.stats }">
              <div class="text-4xl font-bold text-accent mb-2 counter-animate">
                {{ animatedStats.volunteers }}
              </div>
              <div class="text-xl font-semibold mb-2">
                Bénévole<span v-if="animatedStats.volunteers > 1">s</span>
                &
                participant<span v-if="animatedStats.volunteers > 1">s</span>
              </div>
              <p class="text-base-content/70">
                Nombre de bénévoles et participants engagés dans des actions solidaires.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Section Événements à venir -->
      <section id="events-section" class="py-16 px-4 bg-base-100"  v-if="!startSearching">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12 slide-in-up" :class="{ 'visible': isVisible.events }">
            <h2 class="text-3xl font-bold mb-4">Événements à venir</h2>
            <p class="text-base-content/70 max-w-2xl mx-auto">
              Découvrez les prochains événements et rejoignez-les en tant que bénévole ou participant.
            </p>
          </div>

          <div v-if="isLoading" class="flex justify-center items-center h-64">
            <div class="loading loading-spinner loading-lg text-primary"></div>
          </div>

          <div v-else-if="error" class="alert alert-error shadow-lg slide-in-up" :class="{ 'visible': isVisible.events }">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{{ error }}</span>
            </div>
          </div>

          <div v-else-if="featuredEvents.length === 0" class="text-center py-12 slide-in-up" :class="{ 'visible': isVisible.events }">
            <img
              src="/images/no_data.png"
              alt="Aucun événement trouvé"
              class="w-full max-w-md mx-auto mb-4"
              loading="lazy"
            />
            <p class="text-lg text-base-content/70">Aucun événement à venir pour le moment.</p>
          </div>

          <div v-else class="w-full slide-in-up" :class="{ 'visible': isVisible.events }">
            <!-- Carousel pour les événements à venir -->
              <div class="carousel w-full rounded-box relative">
                <div
                    v-for="(event, index) in featuredEvents"
                    :key="event._id"
                    :id="`event-slide-${index}`"
                    class="carousel-item relative w-full md:w-1/2 lg:w-1/3 px-2"
                >
                  <NoConnectedAnnouncementCard
                      :announcement="event"
                      class="w-full h-full"
                  />
                </div>
              </div>
          </div>

        </div>
      </section>

      <!-- Section Avantages -->
      <section id="benefits-section" class="py-16 px-4 bg-base-200" v-if="!startSearching">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12 slide-in-up" :class="{ 'visible': isVisible.benefits }">
            <h2 class="text-3xl font-bold mb-4">Pourquoi rejoindre Benevoclic ?</h2>
            <p class="text-base-content/70 max-w-2xl mx-auto">
              Notre plateforme permet aux associations de promouvoir leurs événements
              et de connecter à la fois les bénévoles et les personnes dans le besoin
              avec des actions solidaires qui leur correspondent.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Carte 1 -->
            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] slide-in-up" :class="{ 'visible': isVisible.benefits }">
              <div class="card-body">
                <div class="flex items-center gap-4 mb-4">
                  <div class="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300">
                    <Search class="h-6 w-6 text-primary" />
                  </div>
                  <h3 class="card-title text-xl">Trouvez facilement</h3>
                </div>
                <p class="text-base-content/70">
                  Accédez à des milliers d'événements et de missions filtrés selon vos
                  besoins, préférences et votre localisation, que vous cherchiez à aider
                  ou à participer.
                </p>
              </div>
            </div>

            <!-- Carte 2 -->
            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] slide-in-up delay-200" :class="{ 'visible': isVisible.benefits }">
              <div class="card-body">
                <div class="flex items-center gap-4 mb-4">
                  <div class="p-3 rounded-lg bg-secondary/20 group-hover:bg-secondary/30 transition-colors duration-300">
                    <Clock class="h-6 w-6 text-secondary" />
                  </div>
                  <h3 class="card-title text-xl">Gérez votre temps</h3>
                </div>
                <p class="text-base-content/70">
                  Choisissez des missions adaptées à vos disponibilités,
                  qu'il s'agisse d'un engagement ponctuel ou régulier.
                </p>
              </div>
            </div>

            <!-- Carte 3 -->
            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] slide-in-up delay-400" :class="{ 'visible': isVisible.benefits }">
              <div class="card-body">
                <div class="flex items-center gap-4 mb-4">
                  <div class="p-3 rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-colors duration-300">
                    <Award class="h-6 w-6 text-accent" />
                  </div>
                  <h3 class="card-title text-xl">Développez vos compétences</h3>
                </div>
                <p class="text-base-content/70">
                  Mettez en pratique vos talents ou acquérez de nouvelles
                  compétences valorisables dans votre parcours.
                </p>
              </div>
            </div>

            <!-- Carte 4 -->
            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] slide-in-up delay-200" :class="{ 'visible': isVisible.benefits }">
              <div class="card-body">
                <div class="flex items-center gap-4 mb-4">
                  <div class="p-3 rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300">
                    <Users class="h-6 w-6 text-primary" />
                  </div>
                  <h3 class="card-title text-xl">Rejoignez une communauté</h3>
                </div>
                <p class="text-base-content/70">
                  Connectez-vous avec d'autres bénévoles partageant vos valeurs
                  et élargissez votre réseau.
                </p>
              </div>
            </div>

            <!-- Carte 5 -->
            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] slide-in-up delay-400" :class="{ 'visible': isVisible.benefits }">
              <div class="card-body">
                <div class="flex items-center gap-4 mb-4">
                  <div class="p-3 rounded-lg bg-secondary/20 group-hover:bg-secondary/30 transition-colors duration-300">
                    <HeartHandshake class="h-6 w-6 text-secondary" />
                  </div>
                  <h3 class="card-title text-xl">Faites la différence</h3>
                </div>
                <p class="text-base-content/70">
                  Contribuez concrètement à des causes qui vous tiennent à cœur
                  et ayez un impact positif sur la société.
                </p>
              </div>
            </div>

            <!-- Carte 6 -->
            <div class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] slide-in-up delay-600" :class="{ 'visible': isVisible.benefits }">
              <div class="card-body">
                <div class="flex items-center gap-4 mb-4">
                  <div class="p-3 rounded-lg bg-accent/20 group-hover:bg-accent/30 transition-colors duration-300">
                    <Shield class="h-6 w-6 text-accent" />
                  </div>
                  <h3 class="card-title text-xl">Sécurité garantie</h3>
                </div>
                <p class="text-base-content/70">
                  Toutes les associations sont vérifiées et les missions sont
                  encadrées pour assurer votre sécurité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section Comment ça marche -->
      <section id="how-it-works-section" class="py-16 px-4 bg-base-100"  v-if="!startSearching">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-12 slide-in-up" :class="{ 'visible': isVisible.howItWorks }">
            <h2 class="text-3xl font-bold mb-4">Comment ça marche ?</h2>
            <p class="text-base-content/70 max-w-2xl mx-auto">
              Participer à un événement ou rejoindre une mission n'a jamais été aussi simple.
              Suivez ces étapes pour trouver l'événement qui vous correspond, que vous soyez
              bénévole ou personne à la recherche d'aide.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <!-- Ligne de connexion entre les étapes (visible uniquement sur desktop) -->
            <div class="absolute top-8 left-0 w-full h-1 bg-base-300 hidden md:block z-0">
              <div class="absolute top-0 left-0 h-full bg-primary transition-all duration-1000" 
                   :style="{ width: isVisible.howItWorks ? '100%' : '0%' }"></div>
            </div>

            <!-- Étape 1 -->
            <div class="flex flex-col items-center text-center slide-in-up" :class="{ 'visible': isVisible.howItWorks }">
              <div class="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg transform transition-transform duration-300 hover:scale-110 z-10">
                1
              </div>
              <h3 class="text-xl font-bold mb-3">Trouvez un événement</h3>
              <p class="text-base-content/70">
                Parcourez les annonces ou utilisez les filtres pour trouver
                un événement qui correspond à vos besoins ou compétences.
              </p>
            </div>

            <!-- Étape 2 -->
            <div class="flex flex-col items-center text-center slide-in-up delay-300" :class="{ 'visible': isVisible.howItWorks }">
              <div class="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg transform transition-transform duration-300 hover:scale-110 z-10">
                2
              </div>
              <h3 class="text-xl font-bold mb-3">Inscrivez-vous en quelques clics</h3>
              <p class="text-base-content/70">
                Inscrivez-vous à l'événement directement via la plateforme.
                Vous pouvez préciser votre rôle (bénévole ou participant) et ajouter un message.
              </p>
            </div>

            <!-- Étape 3 -->
            <div class="flex flex-col items-center text-center slide-in-up delay-600" :class="{ 'visible': isVisible.howItWorks }">
              <div class="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg transform transition-transform duration-300 hover:scale-110 z-10">
                3
              </div>
              <h3 class="text-xl font-bold mb-3">Participez</h3>
              <p class="text-base-content/70">
                Une fois votre inscription confirmée, vous recevrez tous les détails
                pour participer à l'événement, que ce soit en tant que bénévole ou bénéficiaire.
              </p>
            </div>
          </div>
        </div>
      </section>


      <!-- Section CTA -->
      <section id="cta-section" class="py-16 px-4 bg-base-100" v-if="!startSearching">
        <div class="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 md:p-12 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 slide-in-up" :class="{ 'visible': isVisible.cta }">
          <h2 class="text-3xl font-bold mb-4">Prêt à participer ?</h2>
          <p class="text-base-content/80 max-w-2xl mx-auto mb-8">
            Des centaines d'associations proposent des événements pour tous. Trouvez dès maintenant
            un événement qui vous correspond, que vous souhaitiez aider comme bénévole
            ou participer comme bénéficiaire.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink to="#search-section" class="btn btn-primary btn-lg group hover:scale-105 transition-transform duration-300">
              Découvrir les événements
              <ArrowRight class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

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
  .transition-all,
  .transition-shadow,
  .transition-transform,
  .transition-colors {
    transition: none !important;
  }

  html {
    scroll-behavior: auto;
  }

  .animate-bounce {
    animation: none !important;
  }

  .fade-in, .slide-in-left, .slide-in-right, .slide-in-up, .slide-in-down {
    opacity: 1 !important;
    transform: none !important;
  }
}

/* Amélioration du focus pour le skip link */
a:focus-visible {
  outline: 2px solid #eb5577;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Custom animations */
.fade-in {
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
}

.fade-in.visible {
  opacity: 1;
}

.slide-in-left {
  opacity: 0;
  transform: translateX(-50px);
  transition: all 0.8s ease-out;
}

.slide-in-right {
  opacity: 0;
  transform: translateX(50px);
  transition: all 0.8s ease-out;
}

.slide-in-up {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s ease-out;
}

.slide-in-down {
  opacity: 0;
  transform: translateY(-50px);
  transition: all 0.8s ease-out;
}

.slide-in-left.visible,
.slide-in-right.visible,
.slide-in-up.visible,
.slide-in-down.visible {
  opacity: 1;
  transform: translate(0);
}

/* Delay classes */
.delay-200 {
  transition-delay: 200ms;
}

.delay-400 {
  transition-delay: 400ms;
}

.delay-600 {
  transition-delay: 600ms;
}

.delay-800 {
  transition-delay: 800ms;
}

/* Counter animation */
@keyframes countUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.counter-animate {
  animation: countUp 0.5s ease-out forwards;
}

/* Search results transition */
.search-results-enter-active,
.search-results-leave-active {
  transition: all 0.5s ease-in-out;
}

.search-results-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.search-results-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Smooth scroll to search results */
html {
  scroll-behavior: smooth;
}

/* Focus styles for better accessibility */
.search-results:focus-within {
  outline: 2px solid #eb5577;
  outline-offset: 2px;
  border-radius: 8px;
}
</style>
