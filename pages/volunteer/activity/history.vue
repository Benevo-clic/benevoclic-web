<template>
  <div class="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-base-200 bg-opacity-90 z-[1000] flex items-center justify-center backdrop-blur-sm"
    >
      <div class="flex flex-col items-center space-y-4">
        <img
          src="/logo.png"
          alt="Chargement…"
          class="w-20 h-20 animate-spin"
        />
        <div class="text-base-content opacity-70">Chargement en cours...</div>
              </div>
            </div>
            
    <div v-else class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-base-content mb-2">
          {{ t('drawer-content.activity.history') }}
        </h1>
        <p class="text-base-content opacity-70">Retrouvez ici toutes vos missions et participations passées</p>
      </div>

      <!-- Filter and search -->
      <div class="bg-base-100 rounded-2xl shadow-lg p-6 mb-8 border border-base-300">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher dans l'historique..."
              class="input input-bordered w-full pl-12 pr-4 h-12 bg-base-200 border-base-300 focus:border-primary transition-all duration-300"
              v-model="searchQuery"
            aria-label="Champ de saisie">
            <Search class="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content opacity-50" />
          </div>
          <div class="lg:w-48">
            <select
              class="select select-bordered w-full h-12 bg-base-200 border-base-300 focus:border-primary transition-all duration-300"
              v-model="filterType"
             aria-label="Sélection">
              <option value="all">Toutes les activités</option>
              <option value="mission">Missions</option>
              <option value="participation">Participations</option>
            </select>
          </div>
        </div>
          </div>
          
          <!-- Timeline -->
      <div class="flex justify-center">
        <div class="w-full md:w-4/5">
          <div v-if="displayedItems.length > 0" class="relative">
            <!-- Timeline line -->
            <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-base-300"></div>
            <div class="space-y-8">
              <div
                v-for="(item, index) in displayedItems"
                :key="index"
                class="relative flex items-start group"
              >
                <!-- Timeline period (in the dot) -->
                <div class="flex flex-col items-center z-10">
                  <div class="w-16 h-16 rounded-full bg-base-100 border-4 border-primary flex flex-col items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span class="text-xs text-primary font-bold text-center leading-tight">
                      {{ getPeriod(item) }}
                    </span>
                  </div>
                  <div v-if="index < displayedItems.length - 1" class="flex-1 w-0.5 bg-base-300 mt-1"></div>
                </div>
                <!-- Timeline card -->
                <div class="ml-6 flex-1">
                  <div class="bg-base-100 rounded-2xl shadow-lg border border-base-300 p-6 transition-all duration-300 group-hover:shadow-2xl">
                    <div class="flex justify-between items-center mb-2">
                      <h3 class="font-semibold text-lg text-base-content group-hover:text-primary transition-colors duration-300">
                        {{ item.nameEvent }}
                      </h3>
                      <span class="text-sm text-base-content opacity-70">{{ formatDate(item.dateEvent) }}</span>
                    </div>
                    <p class="text-base-content mb-4 line-clamp-3">
                      {{ item.description || 'Aucune description.' }}
                    </p>
                    <div class="flex gap-2 justify-end">
                      <button
                        class="btn btn-primary btn-sm group-hover:btn-secondary transition-all duration-300"
                        @click="goDetail(item._id)"
                      >
                        Détail
                        <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </button>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Empty state -->
          <div v-else class="text-center py-16">
            <div class="max-w-md mx-auto">
              <div class="w-24 h-24 mx-auto mb-6 bg-base-200 rounded-full flex items-center justify-center">
                <Clock class="w-12 h-12 text-base-content opacity-40" />
              </div>
              <h3 class="text-2xl font-bold text-base-content mb-3">Aucun historique trouvé</h3>
              <p class="text-base-content opacity-70 mb-8 leading-relaxed">
                Votre historique d'activités apparaîtra ici dès que vous aurez participé à des missions.
              </p>
            </div>
          </div>
          <!-- Load more button -->
          <div v-if="displayCount < filteredItems.length" class="flex justify-center mt-8">
            <button class="btn btn-outline" @click="loadMore">Charger plus</button>
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

<script setup lang="ts">
import {ref, computed, watch, onMounted} from 'vue'
import { Search, Clock } from 'lucide-vue-next'
import {useUser} from "~/composables/auth/useUser";
import {useVolunteerAuth} from "~/composables/useVolunteer";
import {useAnnouncement} from "~/composables/useAnnouncement";
import type {Announcement} from "~/common/interface/event.interface";
import {useNavigation} from "~/composables/useNavigation";
import ErrorPopup from "~/components/utils/ErrorPopup.vue";
const {getUserId, initializeUser} = useUser()
const {navigateToRoute} = useNavigation()

definePageMeta({
  middleware: ['auth'],
  layout: 'app'
})

const { t } = useI18n()

const useVolunteer = useVolunteerAuth()
const announcementUse = useAnnouncement()
let announcements = ref<Announcement[]>([])

const searchQuery = ref('')
const filterType = ref<'all' | 'mission' | 'participation'>('all')

const showErrorModal = ref(false);
const errorType = ref<'4xx' | '5xx' | null>(null);

function handleReload() {
  window.location.reload();
}
function handleGoHome() {
  navigateToRoute('/');
}

const isLoading = ref(true);

onMounted(async () => {
  await initData();
  isLoading.value = false;
});

async function initData() {
  try {
    if (!getUserId) {
      await initializeUser();
    }
    if(getUserId) {
      announcements.value = await useVolunteer.getPastVolunteerAnnouncement(getUserId);
    } else {
      console.warn("User ID is not available, announcements cannot be fetched.");
    }
  } catch (error) {
    handleError(error);
  }
}

const displayCount = ref(5)

const filteredItems = computed(() => {
  return announcements.value
      .filter(a => {
        if (filterType.value === 'mission') return isVolunteerAnnouncement(a)
        if (filterType.value === 'participation') return isParticipationAnnouncement(a)
        return isVolunteerAnnouncement(a) || isParticipationAnnouncement(a)
      })
      .filter(a => a.nameEvent.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

function isVolunteerAnnouncement(announcement: Announcement): boolean | undefined {
  if(!getUserId)
    return false;
  return announcement.volunteers?.some(
    volunteer => volunteer.id === getUserId
  )
}

function isParticipationAnnouncement(announcement: Announcement): boolean | undefined {
  if(!getUserId)
    return false;
  return announcement.participants?.some(participation => participation.id === getUserId)
}

const displayedItems = computed(() => filteredItems.value.slice(0, displayCount.value))

watch([searchQuery, filterType], () => {
  displayCount.value = 5
})

function loadMore() {
  displayCount.value = Math.min(displayCount.value + 2, filteredItems.value.length)
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

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Affiche la période (date ou intervalle) dans le cercle
function getPeriod(item: Announcement): string {
  // Si tu as startDate et endDate, adapte ici
  if (item.dateEvent) {
    const date = new Date(item.dateEvent)
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' })
  }
  return 'N/A'
}

function goDetail(id: string) {
  navigateToRoute(`/volunteer/events/announcement/${id}`)
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.group:hover .group-hover\:scale-110 {
  transform: scale(1.10);
}
</style>