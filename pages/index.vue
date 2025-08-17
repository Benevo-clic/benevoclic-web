<script setup lang="ts">
  import { onMounted, ref, computed, onUnmounted, watch } from 'vue'
  import { Search, X, SlidersHorizontal } from 'lucide-vue-next'
  import {
    definePageMeta,
    useHead,
    useAnnouncement,
    useVolunteerAuth,
    useAssociationAuth
  } from '#imports'

  const { t } = useI18n()
  import { useUserLocation } from '~/composables/useUserLocation'
  import NoConnectedAnnouncementList from '~/components/event/noConnected/NoConnectedAnnouncementList.vue'
  import VolunteerEventFilters from '~/components/event/volunteer/VolunteerEventFilters.vue'
  import type { Announcement } from '~/common/interface/event.interface'
  import type { FilterAnnouncement } from '~/common/interface/filter.interface'
  import Hero from '~/components/home/hero.vue'
  import Statistique from '~/components/home/statistique.vue'
  import Announcements from '~/components/home/announcements.vue'
  import Advantage from '~/components/home/advantage.vue'
  import HowItWorks from '~/components/home/HowItWorks.vue'
  import CtaComponent from '~/components/home/ctaComponent.vue'

  definePageMeta({
    middleware: ['auth'],
    layout: 'header'
  })

  useHead({
    title: 'Benevoclic - Espace Bénévole | Participez à des événements solidaires',
    meta: [
      {
        name: 'description',
        content:
          'Découvrez des événements et missions adaptés à vos compétences et disponibilités. Rejoignez la communauté Benevoclic, aidez les associations et participez à des actions solidaires.'
      },
      {
        name: 'keywords',
        content:
          'bénévolat, missions, événements, volontariat, engagement citoyen, aide, solidarité, compétences, personnes dans le besoin'
      }
    ]
  })

  const announcement = useAnnouncement()
  const associations = useAssociationAuth()
  const volunteers = useVolunteerAuth()
  const featuredEvents = ref<Announcement[]>([])
  const isLoading = ref(true)
  const error = ref<string | null>(null)
  const currentSlideIndex = ref(0)
  const countAssociation = ref(0)
  const countVolunteer = ref(0)

  const totalEvents = ref(0)
  const totalAssociations = ref(0)
  const totalVolunteerSlots = ref(0)

  // Nouvelles variables pour la recherche
  const showSearchResults = ref(false)
  const searchAnnouncements = ref<Announcement[]>([])
  const searchLoading = ref(false)
  const searchError = ref<string | null>(null)
  const searchTotalAnnouncements = ref(0)
  const currentSearchPage = ref(1)
  const pageSize = 9
  const searchTotalPages = computed(() => Math.ceil(searchTotalAnnouncements.value / pageSize))

  const isVisible = ref<{ [key: string]: boolean }>({
    hero: true,
    search: false,
    stats: false,
    events: false,
    benefits: false,
    howItWorks: false,
    cta: false
  })
  const animatedStats = ref<{ [key: string]: number }>({
    events: 0,
    associations: 0,
    volunteers: 0
  })
  const statsAnimationStarted = ref(false)

  let observers: IntersectionObserver[] = []

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
  })

  // Variables pour la recherche rapide (synchronisées avec sharedFilters)
  const searchQuery = computed({
    get: () => sharedFilters.value.nameEvent || '',
    set: (value: string) => {
      sharedFilters.value.nameEvent = value || undefined
      sharedFilters.value.description = value || undefined
      sharedFilters.value.associationName = value || undefined
    }
  })

  const searchTimeout = ref<NodeJS.Timeout | null>(null)

  const filteredEventsCount = ref<number>(0)
  const isCounting = ref<boolean>(false)
  const countTimeout = ref<NodeJS.Timeout | null>(null)

  const useCurrentLocation = ref<boolean>(false)
  const locationRadius = ref<number>(5)
  const userCurrentLocation = ref<any>(null)
  const currentLatitude = ref<number>()
  const currentLongitude = ref<number>()
  const canUseLocation = ref<boolean>(false)
  const resetLocation = ref(false)
  const startSearching = ref(false)

  async function fetchFeaturedEvents() {
    isLoading.value = true
    try {
      const fetchFilter: FilterAnnouncement = {
        page: 1,
        limit: 9,
        sort: 'dateEvent_asc'
      }

      const response = await announcement.filterAnnouncement(fetchFilter)
      if (response && response.annonces) {
        featuredEvents.value = response.annonces

        totalEvents.value = response.meta.total || 0

        const uniqueAssociations = new Set()
        let volunteerSlots = 0

        response.annonces.forEach(event => {
          if (event.associationId) {
            uniqueAssociations.add(event.associationId)
          }
          volunteerSlots += (event.maxVolunteers || 0) - (event.nbVolunteers || 0)
        })

        totalAssociations.value = uniqueAssociations.size
        totalVolunteerSlots.value = volunteerSlots
      }

      countAssociation.value = await associations.getNumberOfAssociations()
      countVolunteer.value = await volunteers.getNumberOfVolunteers()
    } catch (err: any) {
      error.value = err?.message || 'Erreur lors de la récupération des événements'
      process.env.NODE_ENV !== 'production' &&
        console.error('Erreur lors de la récupération des événements:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function searchEvents(page = 1) {
    startSearching.value = true

    searchLoading.value = true
    if (page === 1) {
      showSearchResults.value = true
    }

    try {
      const filters: FilterAnnouncement = {
        ...sharedFilters.value,
        page,
        limit: pageSize
      }

      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
      ) as FilterAnnouncement

      const response = await announcement.filterAnnouncement(cleanFilters)
      if (response && response.annonces) {
        searchAnnouncements.value = response.annonces
        searchTotalAnnouncements.value = response.meta?.total || 0
        currentSearchPage.value = page

        if (page === 1) {
          setTimeout(() => {
            const searchSection = document.getElementById('search-section')
            if (searchSection) {
              searchSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              })
            }
          }, 100)
        }
      }
    } catch (err: any) {
      process.env.NODE_ENV !== 'production' && console.error('Erreur lors de la recherche:', err)

      if (err?.status === 400) {
        searchError.value =
          'Les critères de recherche ne sont pas valides. Veuillez vérifier vos filtres.'
      } else if (err?.status === 500) {
        searchError.value = 'Erreur serveur. Veuillez réessayer plus tard.'
      } else {
        searchError.value = err?.message || 'Erreur lors de la recherche'
      }
    } finally {
      searchLoading.value = false
    }
  }

  async function handleSearchFilter(filters: FilterAnnouncement) {
    searchLoading.value = true

    try {
      sharedFilters.value = {
        ...sharedFilters.value,
        ...filters,
        page: 1,
        limit: pageSize
      }

      const cleanFilters = Object.fromEntries(
        Object.entries(sharedFilters.value).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      ) as FilterAnnouncement

      const response = await announcement.filterAnnouncement(cleanFilters)
      if (response && response.annonces) {
        searchAnnouncements.value = response.annonces
        searchTotalAnnouncements.value = response.meta?.total || 0
        currentSearchPage.value = 1
      }
    } catch (err: any) {
      process.env.NODE_ENV !== 'production' && console.error('Erreur lors de la recherche:', err)

      // Gestion spécifique des erreurs
      if (err?.status === 400) {
        searchError.value =
          'Les critères de recherche ne sont pas valides. Veuillez vérifier vos filtres.'
      } else if (err?.status === 500) {
        searchError.value = 'Erreur serveur. Veuillez réessayer plus tard.'
      } else {
        searchError.value = err?.message || 'Erreur lors de la recherche'
      }
    } finally {
      searchLoading.value = false
    }
  }

  function closeSearchResults() {
    showSearchResults.value = false
    startSearching.value = false

    setTimeout(() => {
      searchAnnouncements.value = []
      searchError.value = null
      searchTotalAnnouncements.value = 0
      currentSearchPage.value = 1
    }, 500)

    const searchSection = document.getElementById('search-section')
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
    }

    // Réinitialiser les variables locales
    useCurrentLocation.value = false
    locationRadius.value = 5
    resetLocation.value = true
    searchError.value = null

    // Réinitialiser les compteurs
    filteredEventsCount.value = 0
    isCounting.value = false
  }

  function goToSearchPage(page: number) {
    if (page >= 1 && page <= searchTotalPages.value) {
      searchEvents(page)
      // Scroll vers les résultats
      setTimeout(() => {
        const searchResults = document.querySelector('.search-results')
        if (searchResults) {
          searchResults.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  async function countFilteredEvents() {
    if (countTimeout.value) {
      clearTimeout(countTimeout.value)
    }

    countTimeout.value = setTimeout(async () => {
      isCounting.value = true

      try {
        const filters: Partial<FilterAnnouncement> = {
          ...sharedFilters.value,
          page: 1,
          limit: 9
        }

        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null)
        ) as FilterAnnouncement

        const response = await announcement.filterAnnouncement(cleanFilters)
        filteredEventsCount.value = response?.meta?.total || 0
      } catch (error) {
        process.env.NODE_ENV !== 'production' &&
          console.error('Erreur lors du comptage des événements:', error)
        filteredEventsCount.value = 0
      } finally {
        isCounting.value = false
      }
    }, 500)
  }

  const hasActiveFilters = computed(() => {
    return (
      sharedFilters.value.nameEvent ||
      sharedFilters.value.dateEventFrom ||
      sharedFilters.value.dateEventTo ||
      sharedFilters.value.status ||
      sharedFilters.value.sort ||
      (sharedFilters.value.tags && sharedFilters.value.tags.length > 0) ||
      sharedFilters.value.latitude ||
      sharedFilters.value.longitude ||
      sharedFilters.value.radius
    )
  })

  const userLocation = useUserLocation()

  const checkLocationPermissions = async () => {
    try {
      const { usePermissions } = await import('~/composables/usePermissions')
      const { hasPermission, loadCookiePreferences } = usePermissions()

      loadCookiePreferences()
      canUseLocation.value = hasPermission('canUseLocation')

      if (!canUseLocation.value) {
        process.env.NODE_ENV !== 'production' &&
          console.log('Cookies de personnalisation non acceptés - géolocalisation désactivée')
      }
    } catch (err) {
      process.env.NODE_ENV !== 'production' &&
        console.warn('Impossible de vérifier les permissions de géolocalisation:', err)
      canUseLocation.value = false
    }
  }

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
        process.env.NODE_ENV !== 'production' && console.log('Aucune position obtenue')
      }
    } catch (error) {
      process.env.NODE_ENV !== 'production' && console.error('Error getting user location:', error)
    }
  }

  function triggerCount() {
    countFilteredEvents()
  }

  function animateCounters() {
    if (statsAnimationStarted.value) {
      return
    }
    statsAnimationStarted.value = true

    const duration = 2000 // 2 seconds
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps

      // Easing function for smoother animation
      const easeOutQuad = (t: number) => t * (2 - t)
      const easedProgress = easeOutQuad(progress)

      animatedStats.value.events = Math.round(easedProgress * totalEvents.value)
      animatedStats.value.associations = Math.round(easedProgress * countAssociation.value)
      animatedStats.value.volunteers = Math.round(easedProgress * countVolunteer.value)

      if (step >= steps) {
        clearInterval(timer)
        animatedStats.value.events = totalEvents.value
        animatedStats.value.associations = countAssociation.value
        animatedStats.value.volunteers = countVolunteer.value
      }
    }, interval)
  }

  function setupScrollObservers() {
    const sections = [
      { id: 'search-section', key: 'search' },
      { id: 'stats-section', key: 'stats' },
      { id: 'events-section', key: 'events' },
      { id: 'benefits-section', key: process.env.key?.toUpperCase() || 'benefits' },
      { id: 'how-it-works-section', key: process.env.key?.toUpperCase() || 'howItWorks' },
      { id: 'cta-section', key: 'cta' }
    ]

    sections.forEach(section => {
      const element = document.getElementById(section.id)
      if (!element) {
        return
      }

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              isVisible.value[section.key] = true

              // Start counter animation when stats section becomes visible
              if (section.key === 'stats' && !statsAnimationStarted.value) {
                animateCounters()
              }
            }
          })
        },
        { threshold: 0.2 }
      ) // Trigger when 20% of the element is visible

      observer.observe(element)
      observers.push(observer)
    })
  }

  onMounted(async () => {
    await fetchFeaturedEvents()

    if (featuredEvents.value.length > 0) {
      currentSlideIndex.value = 0
      setTimeout(() => {
        window.location.hash = 'hero-section'
      }, 100)
    }

    setTimeout(() => {
      setupScrollObservers()
    }, 200)

    filteredEventsCount.value = totalEvents.value

    await userLocation.initializeLocation()
    await checkLocationPermissions()
    await initLocation()
  })

  watch(
    [sharedFilters],
    () => {
      triggerCount()
    },
    { deep: true }
  )

  onUnmounted(() => {
    observers.forEach(observer => observer.disconnect())
    observers = []

    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value)
    }

    if (countTimeout.value) {
      clearTimeout(countTimeout.value)
    }
  })
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
    <main
      id="main-content"
      class="volunteer-content"
      role="main"
      aria-label="Page d'accueil Bénévole"
    >
      <!-- Section Hero -->
      <Hero :start-searching="startSearching" />

      <!-- Section Recherche Rapide -->
      <section id="search-section" class="py-12 px-4 bg-base-100">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-10 slide-in-up" :class="{ visible: isVisible.search }" v-if="!startSearching">
            <h2 class="text-3xl font-bold mb-4">{{ t('volunteerPage.search.title') }}</h2>
            <p class="text-base-content/70 max-w-2xl mx-auto">
              {{ t('volunteerPage.search.description') }}
            </p>
          </div>

          <!-- Barre de recherche simple -->
          <div
            class="bg-base-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 slide-in-up delay-200"
            :class="{ visible: isVisible.search }"
          >
            <div class="form-control mb-6">
              <label class="label">
                <span class="label-text font-medium">{{ t('homePage.search.label') }}</span>
              </label>
              <div class="relative">
                <Search
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50"
                />
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="t('homePage.search.placeholder')"
                  class="input input-bordered w-full pl-10 focus:border-primary transition-colors duration-300"
                  @keyup.enter="() => searchEvents()"
                />
              </div>
            </div>

            <!-- Compteur d'événements filtrés -->
            <div v-if="hasActiveFilters" class="mb-4 text-center">
              <div
                class="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/10 text-primary rounded-full text-sm sm:text-base"
              >
                <div v-if="isCounting" class="loading loading-spinner loading-sm" />
                <span v-else class="font-medium">
                  <span class="hidden sm:inline"
                    >{{ filteredEventsCount }} {{ filteredEventsCount !== 1 ? t('homePage.results.count.events_found_plural') : t('homePage.results.count.events_found') }}</span
                  >
                  <span class="sm:hidden"
                    >{{ filteredEventsCount }} {{ filteredEventsCount !== 1 ? t('homePage.results.count.results') : t('homePage.results.count.result') }}</span
                  >
                </span>
              </div>
            </div>

            <!-- Boutons d'action -->
            <div class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                :disabled="searchLoading"
                class="btn btn-primary px-4 sm:px-8 group hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                @click="() => searchEvents()"
              >
                <Search
                  v-if="!searchLoading"
                  class="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300"
                />
                <div v-else class="loading loading-spinner loading-sm mr-2" />
                <span class="hidden sm:inline">{{
                  searchLoading ? t('homePage.search.button.searching') : t('homePage.search.button.find_events')
                }}</span>
                <span class="sm:hidden">{{ searchLoading ? t('homePage.search.button.searching') : t('homePage.search.button.search') }}</span>
              </button>

              <button
                class="btn btn-outline px-4 sm:px-6 group hover:scale-105 transition-transform duration-300 text-sm sm:text-base"
                :disabled="!hasActiveFilters"
                @click="resetAllFilters"
              >
                <X class="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span class="hidden sm:inline">{{ t('homePage.search.reset.desktop') }}</span>
                <span class="sm:hidden">{{ t('homePage.search.reset.mobile') }}</span>
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
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6"
            >
              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <h3 class="text-xl sm:text-2xl font-bold">{{ t('homePage.results.title') }}</h3>
                <div class="flex flex-wrap gap-2">
                  <div class="badge badge-primary text-xs sm:text-sm">
                    {{ searchTotalAnnouncements }} {{ searchTotalAnnouncements !== 1 ? t('homePage.results.count.results') : t('homePage.results.count.result') }}
                  </div>
                  <div v-if="hasActiveFilters" class="badge badge-secondary text-xs sm:text-sm">
                    <SlidersHorizontal class="w-3 h-3 mr-1" />
                    <span class="hidden sm:inline">{{ t('homePage.results.filters.active') }}</span>
                    <span class="sm:hidden">{{ t('homePage.results.filters.mobile') }}</span>
                  </div>
                </div>
              </div>
              <button
                class="btn btn-ghost btn-sm self-end sm:self-auto"
                :aria-label="t('homePage.close_results')"
                @click="closeSearchResults"
              >
                <X class="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <!-- Filtres avancés pour les résultats -->
            <div class="bg-base-100 rounded-lg shadow-md p-6 mb-6">
              <VolunteerEventFilters
                :announcements="searchAnnouncements"
                :filterannouncement="sharedFilters"
                @filter="handleSearchFilter"
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
                  class="join-item btn btn-sm sm:btn-md focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
                  :disabled="currentSearchPage === 1"
                  :aria-label="`Aller à la page précédente (page ${currentSearchPage - 1})`"
                  :aria-disabled="currentSearchPage === 1"
                  @click="goToSearchPage(currentSearchPage - 1)"
                  @keyup.enter="goToSearchPage(currentSearchPage - 1)"
                  @keyup.space.prevent="goToSearchPage(currentSearchPage - 1)"
                >
                  <span aria-hidden="true">«</span>
                  <span class="sr-only">Page précédente</span>
                </button>
                <button
                  class="join-item btn btn-sm sm:btn-md"
                  disabled
                  aria-current="page"
                  aria-label="Page actuelle"
                >
                  <span class="sr-only">Page actuelle : </span>
                  <span class="hidden sm:inline"
                    >Page {{ currentSearchPage }} / {{ searchTotalPages }}</span
                  >
                  <span class="sm:hidden">{{ currentSearchPage }}/{{ searchTotalPages }}</span>
                </button>
                <button
                  class="join-item btn btn-sm sm:btn-md focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
                  :disabled="currentSearchPage === searchTotalPages"
                  :aria-label="`Aller à la page suivante (page ${currentSearchPage + 1})`"
                  :aria-disabled="currentSearchPage === searchTotalPages"
                  @click="goToSearchPage(currentSearchPage + 1)"
                  @keyup.enter="goToSearchPage(currentSearchPage + 1)"
                  @keyup.space.prevent="goToSearchPage(currentSearchPage + 1)"
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
      <Statistique
        :start-searching="startSearching"
        :is-visible="isVisible.stats"
        :animated-stats="{
          events: animatedStats.events,
          associations: animatedStats.associations,
          volunteers: animatedStats.volunteers
        }"
      />

      <!-- Section Événements à venir -->
      <Announcements
        :start-searching="startSearching"
        :is-visible="isVisible.events"
        :animated-stats="{
          events: animatedStats.events,
          associations: animatedStats.associations,
          volunteers: animatedStats.volunteers
        }"
        :featured-events="featuredEvents"
        :is-loading="isLoading"
        :error="error"
      />

      <!-- Section Avantages -->
      <Advantage :start-searching="startSearching" :is-visible="isVisible.benefits" />

      <!-- Section Comment ça marche -->
      <HowItWorks :start-searching="startSearching" :is-visible="isVisible.howItWorks" />

      <!-- Section CTA -->
      <CtaComponent :start-searching="startSearching" :is-visible="isVisible.cta" />
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

    .fade-in,
    .slide-in-left,
    .slide-in-right,
    .slide-in-up,
    .slide-in-down {
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

  /* Transitions pour startSearching */
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .fade-slide-enter-from {
    opacity: 0;
    transform: translateY(30px);
  }

  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-30px);
  }

  .fade-slide-enter-to,
  .fade-slide-leave-from {
    opacity: 1;
    transform: translateY(0);
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
