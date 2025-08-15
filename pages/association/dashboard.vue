<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { definePageMeta } from '#imports'
  import { useUser } from '~/composables/auth/useUser'
  import { useAssociationDashboard } from '~/composables/useAssociationDashboard'
  import DateRangePicker from '~/components/dashboard/DateRangePicker.vue'
  import TimeSeriesChart from '~/components/dashboard/TimeSeriesChart.vue'
  import PieChart from '~/components/dashboard/PieChart.vue'
  import ObjectiveProgress from '~/components/dashboard/ObjectiveProgress.vue'
  import ErrorPopup from '~/components/utils/ErrorPopup.vue'

  definePageMeta({
    middleware: 'auth',
    layout: 'header'
  })

  // Composables
  const { getUserId, initializeUser, user } = useUser()
  const {
    fetchDashboard,
    dashboardData,
    loadingDashboard,
    error,
    mainMetrics,
    performanceData,
    recommendations,
    timeSeriesChartData,
    pieChartData,
    announcementStats,
    participantStats,
    volunteerStats,
    engagementStats,
    eventTypeStats,
    hasData,
    isLoadingAny
  } = useAssociationDashboard()

  // Computed pour obtenir l'ID de l'association
  const associationId = computed(() => user.value?.userId || null)

  // Reactive state
  const dateRange = ref({ from: '2024-01-01', to: '2025-12-31' })
  const chartType = ref<'bar' | 'line'>('bar')
  const activeTab = ref('overview')
  const showErrorModal = ref(false)
  const errorType = ref<'4xx' | '5xx' | null>(null)
  const refreshInterval = ref<NodeJS.Timeout | null>(null)

  // Computed properties
  const currentFilter = computed(() => ({
    startDate: dateRange.value.from,
    endDate: dateRange.value.to
  }))

  const isLoading = computed(() => loadingDashboard.value || isLoadingAny.value)

  const chartData = computed(() => {
    if (!timeSeriesChartData.value) return null

    return {
      labels: timeSeriesChartData.value.labels,
      datasets: timeSeriesChartData.value.datasets
    }
  })

  const pieChartDataFormatted = computed(() => {
    if (!pieChartData.value) return null

    return {
      labels: pieChartData.value.labels,
      data: pieChartData.value.data,
      colors: pieChartData.value.colors
    }
  })

  const objectives = computed(() => {
    if (!eventTypeStats.value) return []

    return eventTypeStats.value.map(stat => ({
      id: stat.eventType,
      title: stat.eventType,
      covered: stat.averageParticipants,
      planned: stat.count,
      completionRate: stat.completionRate
    }))
  })

  // Methods
  async function initData() {
    try {
      console.log('Initializing user data...')
      if (!getUserId) {
        await initializeUser()
      }

      console.log('Fetching dashboard data for association ID:', associationId.value)
      if (associationId.value) {
        await fetchDashboard(associationId.value, currentFilter.value)

        // Log du nombre d'événements après récupération des données
        console.log('=== DASHBOARD DEBUG INFO ===')
        console.log('Association ID:', associationId.value)
        console.log("Nombre d'événements total:", mainMetrics.value?.totalAnnouncements || 0)
        console.log('Nombre de participants:', mainMetrics.value?.totalParticipants || 0)
        console.log('Nombre de bénévoles:', mainMetrics.value?.totalVolunteers || 0)
        console.log("Taux d'engagement:", mainMetrics.value?.engagementRate || 0)
        console.log('Taux de completion:', mainMetrics.value?.completionRate || 0)
        console.log('Taux de rétention:', mainMetrics.value?.retentionRate || 0)
        console.log('Statistiques des annonces:', announcementStats.value)
        console.log('Statistiques des participants:', participantStats.value)
        console.log('Statistiques des bénévoles:', volunteerStats.value)
        console.log('Données complètes du dashboard:', dashboardData.value)
        console.log('============================')
      } else {
        console.warn('Association ID is not available, dashboard cannot be fetched.')
      }
    } catch (error) {
      handleError(error)
    }
  }

  async function refreshData() {
    try {
      if (associationId.value) {
        await fetchDashboard(associationId.value, currentFilter.value)
      }
    } catch (error) {
      handleError(error)
    }
  }

  function handleReload() {
    window.location.reload()
  }

  async function handleGoHome() {
    await navigateTo('/')
  }

  function handleError(error: any) {
    if (error?.response?.status >= 500 && error?.response?.status < 600) {
      errorType.value = '5xx'
      showErrorModal.value = true
    } else if (error?.response?.status >= 400 && error?.response?.status < 500) {
      errorType.value = '4xx'
      showErrorModal.value = true
    } else {
      console.error('Erreur inattendue:', error)
    }
  }

  function startAutoRefresh() {
    // Refresh data every 5 minutes
    refreshInterval.value = setInterval(refreshData, 5 * 60 * 1000)
  }

  function stopAutoRefresh() {
    if (refreshInterval.value) {
      clearInterval(refreshInterval.value)
      refreshInterval.value = null
    }
  }

  // Watchers
  watch(
    dateRange,
    async () => {
      if (associationId.value) {
        await fetchDashboard(associationId.value, currentFilter.value)
      }
    },
    { deep: true }
  )

  // Lifecycle
  onMounted(async () => {
    await initData()
    startAutoRefresh()
  })

  onUnmounted(() => {
    stopAutoRefresh()
  })
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200 overflow-x-hidden"
  >
    <!-- Loading overlay -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-base-200 bg-opacity-90 z-[1000] flex items-center justify-center backdrop-blur-sm"
    >
      <div class="flex flex-col items-center space-y-4">
        <div class="loading loading-spinner loading-lg text-primary"></div>
        <div class="text-base-content opacity-70 text-sm sm:text-base">
          Chargement de votre tableau de bord...
        </div>
      </div>
    </div>

    <!-- Main container -->
    <div class="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8 max-w-7xl overflow-x-hidden">
      <!-- Header section -->
      <div class="mb-6 sm:mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              class="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-2 break-words"
            >
              Tableau de bord
            </h1>
            <p class="text-sm sm:text-base text-base-content opacity-70 break-words">
              Analysez vos performances et améliorez votre impact
            </p>
          </div>

          <!-- Action buttons -->
          <div class="flex gap-2">
            <button @click="refreshData" :disabled="isLoading" class="btn btn-primary btn-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Actualiser
            </button>

            <div class="dropdown dropdown-end">
              <label tabindex="0" class="btn btn-outline btn-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </label>
              <ul
                tabindex="0"
                class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li><a @click="refreshData">Actualiser les données</a></li>
                <li><a @click="startAutoRefresh">Activer l'actualisation auto</a></li>
                <li><a @click="stopAutoRefresh">Désactiver l'actualisation auto</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Date Range Picker -->
      <div
        class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-base-300"
      >
        <div class="flex flex-col gap-4">
          <div class="flex-1">
            <h2 class="text-base sm:text-lg font-semibold text-base-content mb-2 break-words">
              Période d'analyse
            </h2>
            <p class="text-xs sm:text-sm text-base-content opacity-70 break-words">
              Sélectionnez la période pour analyser vos données
            </p>
          </div>
          <div class="w-full min-w-0">
            <DateRangePicker v-model="dateRange" />
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div v-if="error" class="alert alert-error mb-6">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h3 class="font-bold">Erreur de chargement</h3>
          <div class="text-xs">{{ error }}</div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="tabs tabs-boxed bg-base-200 mb-6">
        <a
          @click="activeTab = 'overview'"
          :class="['tab', activeTab === 'overview' ? 'tab-active' : '']"
        >
          Vue d'ensemble
        </a>
        <a
          @click="activeTab = 'analytics'"
          :class="['tab', activeTab === 'analytics' ? 'tab-active' : '']"
        >
          Analyses détaillées
        </a>
        <a
          @click="activeTab = 'recommendations'"
          :class="['tab', activeTab === 'recommendations' ? 'tab-active' : '']"
        >
          Recommandations
        </a>
      </div>

      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview' && hasData">
        <!-- Key Metrics Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <!-- Total Announcements -->
          <div class="stat bg-base-100 rounded-xl shadow-lg border border-base-300">
            <div class="stat-figure text-primary">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div class="stat-title">Événements</div>
            <div class="stat-value text-primary">{{ mainMetrics.totalAnnouncements }}</div>
            <div class="stat-desc"><span class="text-success">↗︎ +12%</span> vs mois dernier</div>
          </div>

          <!-- Total Participants -->
          <div class="stat bg-base-100 rounded-xl shadow-lg border border-base-300">
            <div class="stat-figure text-success">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div class="stat-title">Participants</div>
            <div class="stat-value text-success">{{ mainMetrics.totalParticipants }}</div>
            <div class="stat-desc"><span class="text-success">↗︎ +8%</span> vs mois dernier</div>
          </div>

          <!-- Total Volunteers -->
          <div class="stat bg-base-100 rounded-xl shadow-lg border border-base-300">
            <div class="stat-figure text-warning">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <div class="stat-title">Bénévoles</div>
            <div class="stat-value text-warning">{{ mainMetrics.totalVolunteers }}</div>
            <div class="stat-desc"><span class="text-success">↗︎ +15%</span> vs mois dernier</div>
          </div>

          <!-- Engagement Rate -->
          <div class="stat bg-base-100 rounded-xl shadow-lg border border-base-300">
            <div class="stat-figure text-info">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div class="stat-title">Taux d'engagement</div>
            <div class="stat-value text-info">{{ mainMetrics.engagementRate }}%</div>
            <div class="stat-desc"><span class="text-success">↗︎ +5%</span> vs mois dernier</div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <!-- Évolution des événements -->
          <div
            class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 min-w-0 border border-base-300"
          >
            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3"
            >
              <h3 class="text-base sm:text-lg font-semibold text-base-content break-words">
                Évolution des événements
              </h3>
              <div class="flex gap-2 flex-shrink-0">
                <button
                  :class="[
                    'btn btn-xs sm:btn-sm',
                    chartType === 'bar' ? 'btn-primary' : 'btn-outline'
                  ]"
                  @click="chartType = 'bar'"
                >
                  Barres
                </button>
                <button
                  :class="[
                    'btn btn-xs sm:btn-sm',
                    chartType === 'line' ? 'btn-primary' : 'btn-outline'
                  ]"
                  @click="chartType = 'line'"
                >
                  Ligne
                </button>
              </div>
            </div>
            <div class="h-64 sm:h-80 w-full overflow-hidden">
              <TimeSeriesChart
                v-if="chartData"
                :labels="chartData.labels"
                :data="chartData.datasets[0].data"
                label="Événements publiés"
                :type="chartType"
                color="#2563eb"
              />
              <div
                v-else
                class="flex items-center justify-center h-full text-base-content opacity-50"
              >
                Aucune donnée disponible
              </div>
            </div>
          </div>

          <!-- Répartition bénévoles/participants -->
          <div
            class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 min-w-0 border border-base-300"
          >
            <h3
              class="text-base sm:text-lg font-semibold text-base-content mb-4 sm:mb-6 break-words"
            >
              Répartition de votre communauté
            </h3>
            <div class="h-64 sm:h-80 w-full overflow-hidden">
              <PieChart
                v-if="pieChartDataFormatted"
                :labels="pieChartDataFormatted.labels"
                :data="pieChartDataFormatted.data"
                :colors="pieChartDataFormatted.colors"
              />
              <div
                v-else
                class="flex items-center justify-center h-full text-base-content opacity-50"
              >
                Aucune donnée disponible
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Analysis -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <!-- Taux d'atteinte des objectifs -->
          <div
            class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 min-w-0 border border-base-300"
          >
            <h3
              class="text-base sm:text-lg font-semibold text-base-content mb-4 sm:mb-6 break-words"
            >
              Performance par type d'événement
            </h3>
            <div class="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto overflow-x-hidden">
              <div
                v-for="obj in objectives"
                :key="obj.id"
                class="bg-base-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-base-300 transition-colors duration-200 min-w-0"
              >
                <ObjectiveProgress
                  :title="obj.title"
                  :covered="obj.covered"
                  :planned="obj.planned"
                />
              </div>
              <div
                v-if="objectives.length === 0"
                class="text-center text-base-content opacity-50 py-8"
              >
                Aucun événement disponible
              </div>
            </div>
          </div>

          <!-- Croissance des bénévoles -->
          <div
            class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 min-w-0 border border-base-300"
          >
            <h3
              class="text-base sm:text-lg font-semibold text-base-content mb-4 sm:mb-6 break-words"
            >
              Croissance de votre communauté
            </h3>
            <div class="h-64 sm:h-80 w-full overflow-hidden">
              <TimeSeriesChart
                v-if="chartData"
                :labels="chartData.labels"
                :data="chartData.datasets[2].data"
                label="Bénévoles cumulés"
                type="line"
                color="#f59e42"
              />
              <div
                v-else
                class="flex items-center justify-center h-full text-base-content opacity-50"
              >
                Aucune donnée disponible
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Analytics Tab -->
      <div v-if="activeTab === 'analytics' && hasData">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <!-- Detailed Stats -->
          <div class="space-y-6">
            <!-- Announcement Stats -->
            <div class="bg-base-100 rounded-xl shadow-lg p-6 border border-base-300">
              <h3 class="text-lg font-semibold text-base-content mb-4">
                Statistiques des annonces
              </h3>
              <div class="stats stats-vertical lg:stats-horizontal shadow">
                <div class="stat">
                  <div class="stat-title">Total</div>
                  <div class="stat-value text-primary">
                    {{ announcementStats?.totalAnnouncements || 0 }}
                  </div>
                </div>
                <div class="stat">
                  <div class="stat-title">Actives</div>
                  <div class="stat-value text-success">
                    {{ announcementStats?.activeAnnouncements || 0 }}
                  </div>
                </div>
                <div class="stat">
                  <div class="stat-title">Complétées</div>
                  <div class="stat-value text-info">
                    {{ announcementStats?.completedAnnouncements || 0 }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Participant Stats -->
            <div class="bg-base-100 rounded-xl shadow-lg p-6 border border-base-300">
              <h3 class="text-lg font-semibold text-base-content mb-4">
                Statistiques des participants
              </h3>
              <div class="stats stats-vertical lg:stats-horizontal shadow">
                <div class="stat">
                  <div class="stat-title">Participants uniques</div>
                  <div class="stat-value text-primary">
                    {{ participantStats?.totalUniqueParticipants || 0 }}
                  </div>
                </div>
                <div class="stat">
                  <div class="stat-title">Total participations</div>
                  <div class="stat-value text-success">
                    {{ participantStats?.totalParticipations || 0 }}
                  </div>
                </div>
                <div class="stat">
                  <div class="stat-title">Taux de rétention</div>
                  <div class="stat-value text-info">
                    {{ participantStats?.retentionRate || 0 }}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Volunteer Stats -->
          <div class="space-y-6">
            <div class="bg-base-100 rounded-xl shadow-lg p-6 border border-base-300">
              <h3 class="text-lg font-semibold text-base-content mb-4">
                Statistiques des bénévoles
              </h3>
              <div class="stats stats-vertical lg:stats-horizontal shadow">
                <div class="stat">
                  <div class="stat-title">Bénévoles uniques</div>
                  <div class="stat-value text-primary">
                    {{ volunteerStats?.totalUniqueVolunteers || 0 }}
                  </div>
                </div>
                <div class="stat">
                  <div class="stat-title">Total participations</div>
                  <div class="stat-value text-success">
                    {{ volunteerStats?.totalVolunteerParticipations || 0 }}
                  </div>
                </div>
                <div class="stat">
                  <div class="stat-title">En attente</div>
                  <div class="stat-value text-warning">
                    {{ volunteerStats?.volunteersInWaitingList || 0 }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Engagement Stats -->
            <div class="bg-base-100 rounded-xl shadow-lg p-6 border border-base-300">
              <h3 class="text-lg font-semibold text-base-content mb-4">
                Statistiques d'engagement
              </h3>
              <div class="stats stats-vertical lg:stats-horizontal shadow">
                <div class="stat">
                  <div class="stat-title">Taux global</div>
                  <div class="stat-value text-primary">
                    {{ engagementStats?.overallEngagementRate || 0 }}
                  </div>
                </div>
                <div class="stat">
                  <div class="stat-title">Taux de remplissage</div>
                  <div class="stat-value text-success">
                    {{ engagementStats?.averageEventFillRate || 0 }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations Tab -->
      <div v-if="activeTab === 'recommendations' && hasData">
        <div
          class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-base-300"
        >
          <h3 class="text-base sm:text-lg font-semibold text-base-content mb-4 sm:mb-6 break-words">
            Recommandations d'amélioration
          </h3>

          <div
            v-if="recommendations.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
          >
            <div
              v-for="rec in recommendations"
              :key="rec.type"
              class="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
            >
              <div class="card-body">
                <div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div class="badge badge-primary">
                    {{
                      rec.priority === 'high'
                        ? 'Priorité haute'
                        : rec.priority === 'medium'
                          ? 'Priorité moyenne'
                          : 'Priorité basse'
                    }}
                  </div>
                </div>
                <h4 class="font-semibold text-base-content text-sm sm:text-base break-words">
                  {{ rec.title }}
                </h4>
                <p class="text-xs sm:text-sm text-base-content opacity-70 break-words">
                  {{ rec.description }}
                </p>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8">
            <div class="text-success text-6xl mb-4">🎉</div>
            <h4 class="text-lg font-semibold text-base-content mb-2">Excellent travail !</h4>
            <p class="text-base-content opacity-70">
              Vos performances sont optimales. Continuez sur cette lancée !
            </p>
          </div>
        </div>
      </div>

      <!-- No Data State -->
      <div v-if="!hasData && !isLoading && !error" class="text-center py-12">
        <div class="text-base-content opacity-50 text-6xl mb-4">📊</div>
        <h3 class="text-xl font-semibold text-base-content mb-2">Aucune donnée disponible</h3>
        <p class="text-base-content opacity-70 mb-6">
          Commencez par créer des annonces pour voir vos statistiques ici.
        </p>
        <button class="btn btn-primary">Créer une annonce</button>
      </div>

      <!-- Error popup -->
      <ErrorPopup
        :show-error-modal="showErrorModal"
        :error-type="errorType"
        @reload="handleReload"
        @go-home="handleGoHome"
      />
    </div>
  </div>
</template>

<style scoped>
  /* Animations personnalisées */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .grid > div {
    animation: fadeInUp 0.3s ease-out;
  }

  .grid > div:nth-child(1) {
    animation-delay: 0.1s;
  }
  .grid > div:nth-child(2) {
    animation-delay: 0.2s;
  }
  .grid > div:nth-child(3) {
    animation-delay: 0.3s;
  }
  .grid > div:nth-child(4) {
    animation-delay: 0.4s;
  }

  /* Hover effects */
  .bg-base-100:hover {
    transform: translateY(-2px);
  }

  /* Prevent horizontal scroll */
  * {
    box-sizing: border-box;
  }

  /* Responsive breakpoints */
  @media (max-width: 640px) {
    .container {
      padding-left: 0.75rem;
      padding-right: 0.75rem;
    }

    h1 {
      font-size: 1.5rem;
    }

    .btn {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
    }
  }

  @media (min-width: 641px) and (max-width: 768px) {
    .container {
      padding-left: 1rem;
      padding-right: 1rem;
    }

    h1 {
      font-size: 1.875rem;
    }
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    .container {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }

    h1 {
      font-size: 2.25rem;
    }
  }

  @media (min-width: 1025px) {
    .container {
      padding-left: 2rem;
      padding-right: 2rem;
    }

    h1 {
      font-size: 2.5rem;
    }
  }

  /* Mobile-first grid adjustments */
  @media (max-width: 639px) {
    .grid {
      grid-template-columns: 1fr;
    }

    .grid-cols-1.sm\:grid-cols-2.lg\:grid-cols-4 {
      grid-template-columns: 1fr;
    }

    .grid-cols-1.xl\:grid-cols-2 {
      grid-template-columns: 1fr;
    }

    .grid-cols-1.md\:grid-cols-2.xl\:grid-cols-3 {
      grid-template-columns: 1fr;
    }
  }

  @media (min-width: 640px) and (max-width: 767px) {
    .grid-cols-1.sm\:grid-cols-2.lg\:grid-cols-4 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 768px) and (max-width: 1279px) {
    .grid-cols-1.sm\:grid-cols-2.lg\:grid-cols-4 {
      grid-template-columns: repeat(2, 1fr);
    }

    .grid-cols-1.md\:grid-cols-2.xl\:grid-cols-3 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1280px) {
    .grid-cols-1.sm\:grid-cols-2.lg\:grid-cols-4 {
      grid-template-columns: repeat(4, 1fr);
    }

    .grid-cols-1.xl\:grid-cols-2 {
      grid-template-columns: repeat(2, 1fr);
    }

    .grid-cols-1.md\:grid-cols-2.xl\:grid-cols-3 {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  /* Chart container responsiveness */
  @media (max-width: 640px) {
    .h-64.sm\:h-80 {
      height: 16rem;
    }
  }

  @media (min-width: 641px) {
    .h-64.sm\:h-80 {
      height: 20rem;
    }
  }

  /* Scrollbar styling for objectives section */
  .max-h-96.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
  }

  .max-h-96.overflow-y-auto::-webkit-scrollbar-track {
    background: hsl(var(--b2));
    border-radius: 3px;
  }

  .max-h-96.overflow-y-auto::-webkit-scrollbar-thumb {
    background: hsl(var(--bc) / 0.3);
    border-radius: 3px;
  }

  .max-h-96.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--bc) / 0.5);
  }

  /* Touch-friendly interactions */
  @media (hover: none) and (pointer: coarse) {
    .hover\:shadow-xl:hover {
      transform: none;
    }

    .hover\:bg-base-300:hover {
      background-color: hsl(var(--b3));
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .border-base-300 {
      border-color: hsl(var(--bc));
    }

    .opacity-70 {
      opacity: 0.9;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .animate-spin {
      animation: none;
    }

    .transition-all {
      transition: none;
    }

    .animate-fadeInUp {
      animation: none;
    }
  }

  /* Prevent text overflow */
  .break-words {
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Ensure no horizontal overflow */
  .min-w-0 {
    min-width: 0;
  }

  /* Container overflow prevention */
  .overflow-x-hidden {
    overflow-x: hidden;
  }
</style>
