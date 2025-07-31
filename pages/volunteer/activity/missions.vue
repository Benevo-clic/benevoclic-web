<template>
  <div class="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
    <!-- Loading overlay -->
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

    <!-- Main container -->
    <div v-else class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Header section -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-base-content mb-2">
          {{ t('drawer-content.activity.my_missions') }}
        </h1>
        <p class="text-base-content opacity-70">Gérez vos missions et participations</p>
      </div>

      <!-- Filter and search section -->
      <div class="bg-base-100 rounded-2xl shadow-lg p-6 mb-8 backdrop-blur-sm border border-base-300">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Search input -->
          <div class="flex-1">
            <div class="relative">
              <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Rechercher des missions..."
                  class="input input-bordered w-full pl-12 pr-4 h-12 bg-base-200 border-base-300 focus:border-primary transition-all duration-300" aria-label="Champ de saisie">
              <Search class="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content opacity-50" />
            </div>
          </div>

          <!-- Filter dropdown -->
          <div class="lg:w-48">
            <select
                v-model="filter"
                class="select select-bordered w-full h-12 bg-base-200 border-base-300 focus:border-primary transition-all duration-300"
             aria-label="Sélection">
              <option value="all">Toutes les missions</option>
              <option value="participant">Participe</option>
              <option value="waiting">En attente</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Missions grid -->
      <div class="w-full">
        <div v-if="filteredAnnouncements.length > 0" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div
              v-for="announcement in filteredAnnouncements"
              :key="announcement._id"
              class="group bg-base-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-base-300 overflow-hidden"
          >
            <!-- Card header with status -->
            <div class="relative p-6 pb-4">
              <div class="flex justify-between items-start mb-4">
                <div class="flex-1">
                  <h2 class="text-xl font-bold text-base-content group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {{ announcement.nameEvent }}
                  </h2>
                  <p class="text-base-content opacity-70 mt-1 font-medium">
                    {{ announcement.associationName }}
                  </p>
                </div>

                <!-- Status badge -->
                <div class="ml-4">
                  <div
                      class="badge badge-lg font-semibold px-3 py-2"
                      :class="{
                    'badge-success': isVolunteerInVolunteerList(announcement),
                    'badge-warning': isVolunteerInWaitingList(announcement),
                    'badge-info': !isVolunteerInVolunteerList(announcement) && !isVolunteerInWaitingList(announcement)
                  }"
                  >
                    {{
                      isVolunteerInVolunteerList(announcement) ? 'Participe' :
                          isVolunteerInWaitingList(announcement) ? 'En attente' :
                              'Disponible'
                    }}
                  </div>
                </div>
              </div>

              <!-- Event details -->
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                    <Calendar class="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-base-content">{{ announcement.dateEvent }}</p>
                    <p class="text-xs text-base-content opacity-60">Date de l'événement</p>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="flex items-center justify-center w-8 h-8 bg-secondary/10 rounded-lg">
                    <MapPin class="w-4 h-4 text-secondary" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-base-content">{{ announcement.addressAnnouncement?.city }}</p>
                    <p class="text-xs text-base-content opacity-60">Localisation</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card footer -->
            <div class="px-6 pb-6">
              <div class="pt-4 border-t border-base-300 flex gap-2">
                <button
                    class="btn btn-primary flex-1 group-hover:btn-secondary transition-all duration-300"
                    @click="goDetail(announcement._id)"
                >
                  <span>Détails</span>
                  <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
                <button
                    v-if="isVolunteerInVolunteerList(announcement) || isVolunteerInWaitingList(announcement)"
                    class="btn btn-error btn-outline flex-1"
                    @click="cancelVolunteer(announcement)"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-16">
          <div class="max-w-md mx-auto">
            <div class="w-24 h-24 mx-auto mb-6 bg-base-200 rounded-full flex items-center justify-center">
              <Box class="w-12 h-12 text-base-content opacity-40" />
            </div>
            <h3 class="text-2xl font-bold text-base-content mb-3">Aucune mission trouvée</h3>
            <p class="text-base-content opacity-70 mb-8 leading-relaxed">
              Vous n'avez pas encore participé à des missions. Découvrez les événements disponibles et commencez votre aventure !
            </p>
          </div>
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
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import { Search, Calendar, MapPin, Box } from 'lucide-vue-next'
import ErrorPopup from "~/components/utils/ErrorPopup.vue";
import {useNavigation} from "~/composables/useNavigation";
import {useVolunteerAuth} from "~/composables/useVolunteer";
import {useUser} from "~/composables/auth/useUser";
import type {Announcement} from "~/common/interface/event.interface";
import {useAnnouncement} from "~/composables/useAnnouncement";
import {navigateTo} from "#app";
const {navigateToRoute} = useNavigation()
const {getUserId, initializeUser} = useUser()
let announcements = ref<Announcement[]>([])


const useVolunteer = useVolunteerAuth()
const announcementUse = useAnnouncement()
const filter = ref<'all' | 'participant' | 'waiting'>('all')
const searchQuery = ref('')



definePageMeta({
  middleware: ['auth'],
  layout: 'app'
})

const showErrorModal = ref(false);
const errorType = ref<'4xx' | '5xx' | null>(null);

function handleReload() {
  window.location.reload();
}
function handleGoHome() {
  navigateToRoute('/');
}

function isVolunteerInWaitingList(announcement: Announcement): boolean | undefined {
  if(!getUserId)
    return false
  return announcement.volunteersWaiting?.some(v => v.id === getUserId);
}

function isVolunteerInVolunteerList(announcement: Announcement): boolean | undefined {
  if(!getUserId)
    return false
  return announcement.volunteers?.some(v => v.id === getUserId);
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
      announcements.value = await useVolunteer.getVolunteerAnnouncements(getUserId);
    } else {
      console.warn("User ID is not available, announcements cannot be fetched.");
    }
  } catch (error) {
    handleError(error);
  }
}
const { t } = useI18n()


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

const filteredAnnouncements = computed(() => {
  return announcements.value
      .filter(a => {
        if (filter.value === 'participant') return isVolunteerInVolunteerList(a)
        if (filter.value === 'waiting') return isVolunteerInWaitingList(a)
        return isVolunteerInVolunteerList(a) || isVolunteerInWaitingList(a)
      })
      .filter(a => a.nameEvent.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

async function cancelVolunteer(announcement: Announcement) {
  if (!announcement._id || !getUserId) {
    return;
  }
  try {
    if(isVolunteerInVolunteerList(announcement)){
      await announcementUse.removeVolunteer(announcement._id, getUserId);
    } else if(isVolunteerInWaitingList(announcement)){
      await announcementUse.removeVolunteerWaiting(announcement._id, getUserId);
    } else {
      console.warn("L'utilisateur n'est pas dans la liste des participants ou en attente.");
      return;
    }
    announcements.value = announcements.value.filter(a => a._id !== announcement._id);
  } catch (error) {
    handleError(error);
    return;
  }
}

function goDetail(announcementId: string) {
  navigateTo(`/volunteer/events/announcement/${announcementId}`)
}
</script>
<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth animations */
.group:hover .group-hover\:translate-x-1 {
  transform: translateX(0.25rem);
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: hsl(var(--b2));
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--bc) / 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--bc) / 0.5);
}
</style>