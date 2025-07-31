<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import DateRangePicker from '~/components/dashboard/DateRangePicker.vue'
import TimeSeriesChart from '~/components/dashboard/TimeSeriesChart.vue'
import PieChart from '~/components/dashboard/PieChart.vue'
import ObjectiveProgress from '~/components/dashboard/ObjectiveProgress.vue'
import { mockEvents } from '~/mock/mockEvents'
import { mockAssociations } from '~/mock/mockAssociations'
import {definePageMeta, useAnnouncement, useNavigation} from "#imports";
import {useUser} from "~/composables/auth/useUser";
import ErrorPopup from "~/components/utils/ErrorPopup.vue";

const dateRange = ref({ from: '2024-06-01', to: '2024-06-30' })
const chartType = ref<'bar' | 'line'>('bar')

definePageMeta({
  middleware: ['auth'],
  layout: 'header',
})

const isLoading = ref(true);
const {getUserId, initializeUser} = useUser()
const announcement = useAnnouncement()
const {navigateToRoute} = useNavigation()
const showErrorModal = ref(false);
const errorType = ref<'4xx' | '5xx' | null>(null);

onMounted(async () => {
  await initData()
  isLoading.value = false;
});

async function initData() {
  try {
    console.log("Initializing user data...");
    if (!getUserId) {
      await initializeUser();
    }
    console.log("Fetching announcements for user ID:", getUserId);
    if(getUserId) {
      await announcement.fetchAnnouncements(getUserId);
    } else {
      console.warn("User ID is not available, announcements cannot be fetched.");
    }
  } catch (error) {
    handleError(error);
  }
}

function handleReload() {
  window.location.reload();
}

async function handleGoHome() {
  await navigateToRoute('/');
}

function handleError(error: any) {
  if (error?.response?.status >= 500 && error?.response?.status < 600) {
    errorType.value = '5xx';
    showErrorModal.value = true;
  } else if (error?.response?.status >= 400 && error?.response?.status < 500) {
    errorType.value = '4xx';
    showErrorModal.value = true;
  } else {
    console.error('Erreur inattendue:', error);
  }
}

// Computed properties for metrics
const totalAnnouncements = computed(() => mockEvents.length)

const totalVolunteers = computed(() =>
  Array.from(new Set(mockAssociations.flatMap(a => a.volunteers?.map(v => v.id) || []))).length
)

const totalParticipants = computed(() =>
  mockEvents.reduce((sum, e) => sum + (e.nbParticipants || (e.participants?.length || 0)), 0)
)

const engagementRate = computed(() => {
  const total = totalVolunteers.value + totalParticipants.value
  return total > 0 ? Math.round((totalVolunteers.value / total) * 100) : 0
})

const retentionRate = computed(() => {
  // Calcul du taux de rétention basé sur les bénévoles qui participent à plusieurs événements
  const volunteerParticipation = new Map()
  mockEvents.forEach(event => {
    event.volunteers?.forEach(volunteer => {
      volunteerParticipation.set(volunteer.id, (volunteerParticipation.get(volunteer.id) || 0) + 1)
    })
  })
  const multiEventVolunteers = Array.from(volunteerParticipation.values()).filter(count => count > 1).length
  return totalVolunteers.value > 0 ? Math.round((multiEventVolunteers / totalVolunteers.value) * 100) : 0
})

const averageObjectiveCompletion = computed(() => {
  const objectives = mockEvents.map(e => ({
    covered: e.nbParticipants || (e.participants?.length || 0),
    planned: e.maxParticipants || 100
  }))
  const totalCompletion = objectives.reduce((sum, obj) => sum + (obj.covered / obj.planned), 0)
  return objectives.length > 0 ? Math.round((totalCompletion / objectives.length) * 100) : 0
})

const announcementsSeries = computed(() => {
  const map = new Map()
  mockEvents.forEach(e => {
    map.set(e.datePublication, (map.get(e.datePublication) || 0) + 1)
  })
  return {
    labels: Array.from(map.keys()),
    data: Array.from(map.values())
  }
})

const volunteersSeries = computed(() => {
  let total = 0
  const map = new Map()
  mockEvents.forEach(e => {
    total += e.nbVolunteers || (e.volunteers?.length || 0)
    map.set(e.datePublication, total)
  })
  return {
    labels: Array.from(map.keys()),
    data: Array.from(map.values())
  }
})

const pieData = computed(() => {
  const volunteers = totalVolunteers.value
  const participants = totalParticipants.value
  return { volunteers, participants }
})

const objectives = computed(() =>
  mockEvents.map(e => ({
    id: e.id,
    title: e.nameEvent,
    covered: e.nbParticipants || (e.participants?.length || 0),
    planned: e.maxParticipants || 100
  }))
)

const cumulativeSeries = volunteersSeries
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200 overflow-x-hidden">
    <!-- Loading overlay -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-base-200 bg-opacity-90 z-[1000] flex items-center justify-center backdrop-blur-sm"
    >
      <div class="flex flex-col items-center space-y-4">
        <img
          src="/logo.png"
          alt="Chargement…"
          class="w-16 h-16 sm:w-20 sm:h-20 animate-spin"
        />
        <div class="text-base-content opacity-70 text-sm sm:text-base">Chargement en cours...</div>
      </div>
    </div>

    <!-- Main container -->
    <div class="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8 max-w-7xl overflow-x-hidden">
      <!-- Header section -->
      <div class="mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content mb-2 break-words">
          Tableau de bord
        </h1>
        <p class="text-sm sm:text-base text-base-content opacity-70 break-words">
          Analysez vos performances et améliorez votre impact
        </p>
      </div>

      <!-- Date Range Picker -->
      <div class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <div class="flex flex-col gap-4">
          <div class="flex-1">
            <h2 class="text-base sm:text-lg font-semibold text-base-content mb-2 break-words">Période d'analyse</h2>
            <p class="text-xs sm:text-sm text-base-content opacity-70 break-words">Sélectionnez la période pour analyser vos données</p>
          </div>
          <div class="w-full min-w-0">
            <DateRangePicker v-model="dateRange" />
          </div>
        </div>
      </div>

      <!-- Key Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-base-300 min-w-0">
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </div>
            <div class="text-right min-w-0 flex-1 ml-3">
              <div class="text-xl sm:text-2xl font-bold text-base-content truncate">{{ totalAnnouncements }}</div>
              <div class="text-xs sm:text-sm text-base-content opacity-70 truncate">Événements</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="text-xs sm:text-sm text-success font-medium">+12%</div>
            <div class="text-xs text-base-content opacity-70 truncate">vs mois dernier</div>
          </div>
        </div>

        <div class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-base-300 min-w-0">
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-success/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="text-right min-w-0 flex-1 ml-3">
              <div class="text-xl sm:text-2xl font-bold text-base-content truncate">{{ totalVolunteers }}</div>
              <div class="text-xs sm:text-sm text-base-content opacity-70 truncate">Bénévoles</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="text-xs sm:text-sm text-success font-medium">+8%</div>
            <div class="text-xs text-base-content opacity-70 truncate">vs mois dernier</div>
          </div>
        </div>

        <div class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-base-300 min-w-0">
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-warning/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
              </svg>
            </div>
            <div class="text-right min-w-0 flex-1 ml-3">
              <div class="text-xl sm:text-2xl font-bold text-base-content truncate">{{ totalParticipants }}</div>
              <div class="text-xs sm:text-sm text-base-content opacity-70 truncate">Participants</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="text-xs sm:text-sm text-success font-medium">+15%</div>
            <div class="text-xs text-base-content opacity-70 truncate">vs mois dernier</div>
          </div>
        </div>

        <div class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border border-base-300 min-w-0">
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <div class="w-10 h-10 sm:w-12 sm:h-12 bg-info/10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="text-right min-w-0 flex-1 ml-3">
              <div class="text-xl sm:text-2xl font-bold text-base-content truncate">{{ engagementRate }}%</div>
              <div class="text-xs sm:text-sm text-base-content opacity-70 truncate">Taux d'engagement</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="text-xs sm:text-sm text-success font-medium">+5%</div>
            <div class="text-xs text-base-content opacity-70 truncate">vs mois dernier</div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        <!-- Évolution des événements -->
        <div class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 min-w-0">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
            <h3 class="text-base sm:text-lg font-semibold text-base-content break-words">Évolution des événements</h3>
            <div class="flex gap-2 flex-shrink-0">
              <button 
                @click="chartType = 'bar'"
                :class="['btn btn-xs sm:btn-sm', chartType === 'bar' ? 'btn-primary' : 'btn-outline']"
              >
                Barres
              </button>
              <button 
                @click="chartType = 'line'"
                :class="['btn btn-xs sm:btn-sm', chartType === 'line' ? 'btn-primary' : 'btn-outline']"
              >
                Ligne
              </button>
            </div>
          </div>
          <div class="h-64 sm:h-80 w-full overflow-hidden">
            <TimeSeriesChart
              :labels="announcementsSeries.labels"
              :data="announcementsSeries.data"
              label="Événements publiés"
              :type="chartType"
              color="#2563eb"
            />
          </div>
        </div>

        <!-- Répartition bénévoles/participants -->
        <div class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 min-w-0">
          <h3 class="text-base sm:text-lg font-semibold text-base-content mb-4 sm:mb-6 break-words">Répartition de votre communauté</h3>
          <div class="h-64 sm:h-80 w-full overflow-hidden">
            <PieChart
              :labels="['Bénévoles actifs', 'Participants']"
              :data="[pieData.volunteers, pieData.participants]"
              :colors="['#10b981', '#f59e42']"
            />
          </div>
        </div>
      </div>

      <!-- Performance Analysis -->
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        <!-- Taux d'atteinte des objectifs -->
        <div class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 min-w-0">
          <h3 class="text-base sm:text-lg font-semibold text-base-content mb-4 sm:mb-6 break-words">Taux d'atteinte des objectifs</h3>
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
          </div>
        </div>

        <!-- Croissance des bénévoles -->
        <div class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 min-w-0">
          <h3 class="text-base sm:text-lg font-semibold text-base-content mb-4 sm:mb-6 break-words">Croissance de votre communauté</h3>
          <div class="h-64 sm:h-80 w-full overflow-hidden">
            <TimeSeriesChart
              :labels="cumulativeSeries.labels"
              :data="cumulativeSeries.data"
              label="Bénévoles cumulés"
              type="line"
              color="#f59e42"
            />
          </div>
        </div>
      </div>

      <!-- Insights & Recommendations -->
      <div class="bg-base-100 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 min-w-0">
        <h3 class="text-base sm:text-lg font-semibold text-base-content mb-4 sm:mb-6 break-words">Recommandations d'amélioration</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          <div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-primary/20 min-w-0">
            <div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div class="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-3 h-3 sm:w-4 sm:h-4 text-primary-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h4 class="font-semibold text-base-content text-sm sm:text-base break-words">Engagement</h4>
            </div>
            <p class="text-xs sm:text-sm text-base-content opacity-70 break-words">
              Votre taux d'engagement est de {{ engagementRate }}%. 
              <span class="font-medium text-primary">Publiez plus de contenu interactif</span> pour l'améliorer.
            </p>
          </div>

          <div class="bg-gradient-to-br from-success/10 to-success/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-success/20 min-w-0">
            <div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div class="w-6 h-6 sm:w-8 sm:h-8 bg-success rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-3 h-3 sm:w-4 sm:h-4 text-success-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h4 class="font-semibold text-base-content text-sm sm:text-base break-words">Rétention</h4>
            </div>
            <p class="text-xs sm:text-sm text-base-content opacity-70 break-words">
              {{ retentionRate }}% de vos bénévoles participent régulièrement.
              <span class="font-medium text-success">Créez des programmes de fidélisation</span>.
            </p>
          </div>

          <div class="bg-gradient-to-br from-warning/10 to-warning/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-warning/20 min-w-0">
            <div class="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div class="w-6 h-6 sm:w-8 sm:h-8 bg-warning rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                <svg class="w-3 h-3 sm:w-4 sm:h-4 text-warning-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h4 class="font-semibold text-base-content text-sm sm:text-base break-words">Objectifs</h4>
            </div>
            <p class="text-xs sm:text-sm text-base-content opacity-70 break-words">
              {{ averageObjectiveCompletion }}% d'atteinte moyenne des objectifs.
              <span class="font-medium text-warning">Ajustez vos objectifs</span> pour plus de réalisme.
            </p>
          </div>
        </div>
      </div>

      <!-- Error popup -->
      <ErrorPopup
        :show-error-modal="showErrorModal"
        :error-type="errorType"
        @reload="handleReload"
        @goHome="handleGoHome"
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

.grid > div:nth-child(1) { animation-delay: 0.1s; }
.grid > div:nth-child(2) { animation-delay: 0.2s; }
.grid > div:nth-child(3) { animation-delay: 0.3s; }
.grid > div:nth-child(4) { animation-delay: 0.4s; }

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