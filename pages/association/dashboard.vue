<script setup lang="ts">
  import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
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

  const { getUserId, initializeUser, user } = useUser()
  const {
    fetchDashboard,
    loadingDashboard,
    error,
    mainMetrics,
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

  const associationId = computed(() => user.value?.userId || null)

  const dateRange = ref({ from: '2024-01-01', to: '2025-12-31' })
  const chartType = ref<'bar' | 'line'>('bar')
  const activeTab = ref('overview')
  const showErrorModal = ref(false)
  const errorType = ref<'4xx' | '5xx' | null>(null)
  const refreshInterval = ref<NodeJS.Timeout | null>(null)
  const isAutoRefreshActive = ref(false)

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

  async function initData() {
    try {
      if (!getUserId) {
        await initializeUser()
      }

      if (associationId.value) {
        await fetchDashboard(associationId.value, currentFilter.value)
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
    refreshInterval.value = setInterval(refreshData, 2 * 60 * 1000)
    isAutoRefreshActive.value = true
  }

  function stopAutoRefresh() {
    if (refreshInterval.value) {
      clearInterval(refreshInterval.value)
      refreshInterval.value = null
    }
    isAutoRefreshActive.value = false
  }

  watch(
    dateRange,
    async () => {
      if (associationId.value) {
        await fetchDashboard(associationId.value, currentFilter.value)
      }
    },
    { deep: true }
  )

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
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-base-200/90 z-[1000] flex items-center justify-center backdrop-blur-sm"
    >
      <div class="flex flex-col items-center gap-4 p-4">
        <div class="loading loading-spinner loading-lg text-primary"></div>
        <div class="text-base-content/70 text-sm sm:text-base text-center px-4">
          Chargement de votre tableau de bord...
        </div>
      </div>
    </div>

    <div class="container mx-auto max-w-screen-2xl px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <!-- Header section -->
      <div class="mb-6 sm:mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
          <div class="flex-1 min-w-0">
            <h1
              class="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-2 leading-tight truncate"
            >
              Tableau de bord
            </h1>
            <p class="text-sm sm:text-base text-base-content/70 leading-relaxed">
              Analysez vos performances et améliorez votre impact
            </p>
          </div>

          <!-- Action buttons -->
          <div class="flex flex-wrap items-center gap-2 lg:flex-shrink-0">
            <button
              @click="refreshData"
              :disabled="isLoading"
              class="btn btn-primary btn-sm sm:btn-md"
            >
              <svg
                class="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span class="hidden sm:inline">Actualiser</span>
            </button>

            <div class="flex items-center gap-2">
              <label class="label cursor-pointer gap-2">
                <span class="label-text text-xs sm:text-sm hidden sm:inline">Auto-refresh</span>
                <span class="label-text text-xs sm:inline sm:hidden">Auto</span>
                <input
                  type="checkbox"
                  :checked="isAutoRefreshActive"
                  class="toggle"
                  @change="isAutoRefreshActive ? stopAutoRefresh() : startAutoRefresh()"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div
        class="card bg-base-100 rounded-xl sm:rounded-2xl shadow-lg px-4 py-3 sm:px-5 sm:py-4 lg:px-6 lg:py-5 mb-6 sm:mb-8 border border-base-300"
      >
        <div class="grid gap-4 sm:gap-5 lg:gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div class="min-w-0">
            <h2
              class="text-base sm:text-lg font-semibold text-base-content mb-1 sm:mb-2 leading-tight"
            >
              Période d'analyse
            </h2>
            <p class="text-xs sm:text-sm text-base-content/70 leading-relaxed line-clamp-2">
              Sélectionnez la période pour analyser vos données
            </p>
          </div>

          <div class="w-full lg:w-auto lg:shrink-0 min-w-0">
            <div class="w-full max-w-full lg:max-w-none">
              <div class="sm:inline-flex sm:items-center sm:gap-3">
                <DateRangePicker
                  v-model="dateRange"
                  class="w-full sm:w-auto sm:min-w-[18rem] md:min-w-[20rem] lg:min-w-[22rem]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="error" class="alert alert-error mb-6 break-words">
        <svg
          class="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div class="min-w-0 flex-1">
          <h3 class="font-bold text-sm sm:text-base">Erreur de chargement</h3>
          <div class="text-xs sm:text-sm mt-1 break-words">{{ error }}</div>
        </div>
      </div>

      <div class="tabs tabs-boxed bg-base-200 mb-7">
        <a
          @click="activeTab = 'overview'"
          :class="['tab flex-1 text-center mb-2', activeTab === 'overview' ? 'tab-active' : '']"
        >
          Vue d'ensemble
        </a>
        <a
          @click="activeTab = 'analytics'"
          :class="['tab flex-1 text-center mb-2', activeTab === 'analytics' ? 'tab-active' : '']"
        >
          Analyses détaillées
        </a>
        <a
          @click="activeTab = 'recommendations'"
          :class="[
            'tab flex-1 text-center mb-2',
            activeTab === 'recommendations' ? 'tab-active' : ''
          ]"
        >
          Recommandations
        </a>
      </div>

      <div v-if="activeTab === 'overview' && hasData">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div
            class="stat bg-base-100 rounded-xl shadow-lg border border-base-300 p-4 sm:p-6 w-full"
          >
            <div class="stat-figure text-primary mb-2">
              <svg
                class="w-6 h-6 sm:w-8 sm:h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div class="stat-title text-sm sm:text-base font-medium">Événements</div>
            <div class="stat-value text-primary text-2xl sm:text-3xl lg:text-4xl truncate">
              {{ mainMetrics.totalAnnouncements }}
            </div>
          </div>

          <div
            class="stat bg-base-100 rounded-xl shadow-lg border border-base-300 p-4 sm:p-6 w-full"
          >
            <div class="stat-figure text-success mb-2">
              <svg
                class="w-6 h-6 sm:w-8 sm:h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div class="stat-title text-sm sm:text-base font-medium">Participants</div>
            <div class="stat-value text-success text-2xl sm:text-3xl lg:text-4xl truncate">
              {{ mainMetrics.totalParticipants }}
            </div>
          </div>

          <div
            class="stat bg-base-100 rounded-xl shadow-lg border border-base-300 p-4 sm:p-6 w-full"
          >
            <div class="stat-figure text-warning mb-2">
              <svg
                class="w-6 h-6 sm:w-8 sm:h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <div class="stat-title text-sm sm:text-base font-medium">Bénévoles</div>
            <div class="stat-value text-warning text-2xl sm:text-3xl lg:text-4xl truncate">
              {{ mainMetrics.totalVolunteers }}
            </div>
          </div>

          <div
            class="stat bg-base-100 rounded-xl shadow-lg border border-base-300 p-4 sm:p-6 w-full"
          >
            <div class="stat-figure text-info mb-2">
              <svg
                class="w-6 h-6 sm:w-8 sm:h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div class="stat-title text-sm sm:text-base font-medium">Taux d'engagement</div>
            <div class="stat-value text-info text-2xl sm:text-3xl lg:text-4xl truncate">
              {{ mainMetrics.engagementRate }}%
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div
            class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-base-300 w-full overflow-hidden"
          >
            <div
              class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3"
            >
              <h3 class="text-base sm:text-lg font-semibold text-base-content leading-tight">
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
            <div
              class="w-full min-h-[260px] sm:min-h-[320px] md:min-h-[360px] lg:min-h-[400px] xl:min-h-[440px]"
            >
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
                class="flex items-center justify-center h-full text-base-content/50 text-center px-4"
              >
                Aucune donnée disponible
              </div>
            </div>
          </div>

          <!-- Répartition bénévoles/participants -->
          <div
            class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-base-300 w-full overflow-hidden"
          >
            <h3
              class="text-base sm:text-lg font-semibold text-base-content mb-4 sm:mb-6 leading-tight"
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
                class="flex items-center justify-center h-full text-base-content/50 text-center px-4"
              >
                Aucune donnée disponible
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Analysis -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <!-- Taux d'atteinte des objectifs -->
          <div
            class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-base-300 w-full"
          >
            <h3
              class="text-base sm:text-lg font-semibold text-base-content mb-4 sm:mb-6 leading-tight"
            >
              Performance par type d'événement
            </h3>
            <div class="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto pr-1">
              <div
                v-for="obj in objectives"
                :key="obj.id"
                class="bg-base-200 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-base-300 transition-colors duration-200"
              >
                <ObjectiveProgress
                  :title="obj.title"
                  :covered="obj.covered"
                  :planned="obj.planned"
                />
              </div>
              <div
                v-if="objectives.length === 0"
                class="text-center text-base-content/50 py-8 px-4"
              >
                Aucun événement disponible
              </div>
            </div>
          </div>

          <!-- Croissance des bénévoles -->
          <div
            class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-base-300 w-full overflow-hidden"
          >
            <h3
              class="text-base sm:text-lg font-semibold text-base-content mb-4 sm:mb-6 leading-tight"
            >
              Croissance de votre communauté
            </h3>
            <div
              class="w-full min-h-[260px] sm:min-h-[320px] md:min-h-[360px] lg:min-h-[400px] xl:min-h-[440px]"
            >
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
                class="flex items-center justify-center h-full text-base-content/50 text-center px-4"
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
            <div class="bg-base-100 rounded-xl shadow-lg p-4 sm:p-6 border border-base-300 w-full">
              <h3 class="text-base sm:text-lg font-semibold text-base-content mb-4 leading-tight">
                Statistiques des annonces
              </h3>
              <div class="stats stats-vertical lg:stats-horizontal shadow w-full">
                <div class="stat">
                  <div class="stat-title text-xs sm:text-sm">Total</div>
                  <div class="stat-value text-primary text-lg sm:text-xl truncate">
                    {{ announcementStats?.totalAnnouncements || 0 }}
                  </div>
                </div>
                <div class="stat">
                  <div class="stat-title text-xs sm:text-sm">Actives</div>
                  <div class="stat-value text-success text-lg sm:text-xl truncate">
                    {{ announcementStats?.activeAnnouncements || 0 }}
                  </div>
                </div>
                <div class="stat">
                  <div class="stat-title text-xs sm:text-sm">Complétées</div>
                  <div class="stat-value text-info text-lg sm:text-xl truncate">
                    {{ announcementStats?.completedAnnouncements || 0 }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Participant Stats -->
            <div class="bg-base-100 rounded-xl shadow-lg p-4 sm:p-6 border border-base-300 w-full">
              <h3 class="text-base sm:text-lg font-semibold text-base-content mb-4 leading-tight">
                Statistiques des participants
              </h3>
              <div class="stats stats-vertical lg:stats-horizontal shadow w-full">
                <div class="stat">
                  <div class="stat-title text-xs sm:text-sm">Participants uniques</div>
                  <div class="stat-value text-primary text-lg sm:text-xl truncate">
                    {{ participantStats?.totalUniqueParticipants || 0 }}
                  </div>
                </div>
                <div class="stat">
                  <div class="stat-title text-xs sm:text-sm">Total participations</div>
                  <div class="stat-value text-success text-lg sm:text-xl truncate">
                    {{ participantStats?.totalParticipations || 0 }}
                  </div>
                </div>
                <div class="stat">
                  <div class="stat-title text-xs sm:text-sm">Taux de rétention</div>
                  <div class="stat-value text-info text-lg sm:text-xl truncate">
                    {{ participantStats?.retentionRate || 0 }}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Volunteer Stats -->
          <div class="space-y-6">
            <div class="bg-base-100 rounded-xl shadow-lg p-4 sm:p-6 border border-base-300 w-full">
              <h3 class="text-base sm:text-lg font-semibold text-base-content mb-4 leading-tight">
                Statistiques des bénévoles
              </h3>
              <div class="stats stats-vertical lg:stats-horizontal shadow w-full">
                <div class="stat">
                  <div class="stat-title text-xs sm:text-sm">Bénévoles uniques</div>
                  <div class="stat-value text-primary text-lg sm:text-xl truncate">
                    {{ volunteerStats?.totalUniqueVolunteers || 0 }}
                  </div>
                </div>
                <div class="stat">
                  <div class="stat-title text-xs sm:text-sm">Total participations</div>
                  <div class="stat-value text-success text-lg sm:text-xl truncate">
                    {{ volunteerStats?.totalVolunteerParticipations || 0 }}
                  </div>
                </div>
                <div class="stat">
                  <div class="stat-title text-xs sm:text-sm">En attente</div>
                  <div class="stat-value text-warning text-lg sm:text-xl truncate">
                    {{ volunteerStats?.volunteersInWaitingList || 0 }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Engagement Stats -->
            <div class="bg-base-100 rounded-xl shadow-lg p-4 sm:p-6 border border-base-300 w-full">
              <h3 class="text-base sm:text-lg font-semibold text-base-content mb-4 leading-tight">
                Statistiques d'engagement
              </h3>
              <div class="stats stats-vertical lg:stats-horizontal shadow w-full">
                <div class="stat">
                  <div class="stat-title text-xs sm:text-sm">Taux global</div>
                  <div class="stat-value text-primary text-lg sm:text-xl truncate">
                    {{ engagementStats?.overallEngagementRate || 0 }}
                  </div>
                </div>
                <div class="stat">
                  <div class="stat-title text-xs sm:text-sm">Taux de remplissage</div>
                  <div class="stat-value text-success text-lg sm:text-xl truncate">
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
          <h3
            class="text-base sm:text-lg font-semibold text-base-content mb-4 sm:mb-6 leading-tight"
          >
            Recommandations d'amélioration
          </h3>

          <div
            v-if="recommendations.length > 0"
            class="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            <div
              v-for="rec in recommendations"
              :key="rec.type"
              class="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:shadow-lg transition-shadow duration-200"
            >
              <div class="card-body p-4 sm:p-6">
                <div class="flex items-center gap-2 sm:gap-3 mb-3">
                  <div class="badge badge-primary text-xs sm:text-sm">
                    {{
                      rec.priority === 'high'
                        ? 'Priorité haute'
                        : rec.priority === 'medium'
                          ? 'Priorité moyenne'
                          : 'Priorité basse'
                    }}
                  </div>
                </div>
                <h4 class="font-semibold text-base-content text-sm sm:text-base leading-tight mb-2">
                  {{ rec.title }}
                </h4>
                <p class="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                  {{ rec.description }}
                </p>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 px-4">
            <div class="text-success text-4xl sm:text-6xl mb-4">🎉</div>
            <h4 class="text-base sm:text-lg font-semibold text-base-content mb-2 leading-tight">
              Excellent travail !
            </h4>
            <p class="text-sm sm:text-base text-base-content/70 leading-relaxed">
              Vos performances sont optimales. Continuez sur cette lancée !
            </p>
          </div>
        </div>
      </div>

      <!-- No Data State -->
      <div v-if="!hasData && !isLoading && !error" class="text-center py-8 sm:py-12 px-4">
        <div class="text-base-content/50 text-4xl sm:text-6xl mb-4">📊</div>
        <h3 class="text-lg sm:text-xl font-semibold text-base-content mb-2 leading-tight">
          Aucune donnée disponible
        </h3>
        <p class="text-sm sm:text-base text-base-content/70 mb-6 leading-relaxed">
          Commencez par créer des annonces pour voir vos statistiques ici.
        </p>
        <button class="btn btn-primary btn-sm sm:btn-md">Créer une annonce</button>
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
    transition: transform 0.2s ease-in-out;
  }

  /* Prevent horizontal scroll */
  * {
    box-sizing: border-box;
  }

  /* Responsive typography */
  .stat-value {
    font-weight: 700;
    line-height: 1.2;
  }
  .stat-title {
    font-weight: 500;
    line-height: 1.4;
  }

  /* Full width utilization */
  .stats {
    width: 100% !important;
  }
  .stat {
    flex: 1;
    min-width: 0;
  }

  /* Ensure charts take full width */
  .w-full {
    width: 100% !important;
  }

  /* Improved spacing and readability */
  .leading-tight {
    line-height: 1.25;
  }
  .leading-relaxed {
    line-height: 1.6;
  }

  /* Chart container responsiveness (fallback for components) */
  @media (max-width: 640px) {
    .stat-value {
      font-size: 1.5rem !important;
    }
    .stat-title {
      font-size: 0.75rem !important;
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
    .bg-base-100:hover {
      transform: none;
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

  /* Better button responsiveness */
  .btn {
    transition: all 0.2s ease-in-out;
  }
  .btn:active {
    transform: scale(0.98);
  }

  /* Improved tab navigation */
  .tabs {
    display: flex;
    width: 100%;
    gap: 0;
  }

  .tabs .tab {
    transition: all 0.2s ease-in-out;
    flex: 1;
    min-width: 0;
    padding: 0.75rem 0.5rem;
    text-align: center;
    text-decoration: none;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .tabs .tab-active {
    background-color: rgb(235, 85, 119) !important;
    color: hsl(var(--pc)) !important;
    font-weight: 600;
    box-shadow: 0 2px 4px rgb(235, 85, 119);
    transform: translateY(-1px);
  }

  /* Ensure tabs are responsive */
  @media (max-width: 640px) {
    .tabs .tab {
      padding: 0.5rem 0.25rem;
      font-size: 0.875rem;
    }
  }

  @media (max-width: 480px) {
    .tabs .tab {
      padding: 0.5rem 0.125rem;
      font-size: 0.75rem;
    }
  }

  /* Better loading state */
  .loading {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* Accessibility focus */
  .btn:focus,
  .tab:focus {
    outline: 2px solid hsl(var(--p));
    outline-offset: 2px;
  }

  /* Label styling for better readability */
  .label {
    align-items: center;
    gap: 0.5rem;
  }

  .label-text {
    font-weight: 500;
    color: hsl(var(--bc));
  }

  /* Mobile optimizations */
  @media (max-width: 640px) {
    .label {
      gap: 0.25rem;
    }
  }
</style>
