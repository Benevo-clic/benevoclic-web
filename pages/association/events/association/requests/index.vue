<template>
  <div class="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200">
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
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <!-- Header section -->
      <div class="mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-base-content mb-2">
          Mes demandes
        </h1>
        <p class="text-base-content opacity-70">
          Gérez les demandes de bénévolat et d'adhésion à votre association
        </p>
      </div>

      <!-- Tabs navigation -->
      <div class="bg-base-100 rounded-2xl shadow-lg p-1 mb-8">
        <div class="flex flex-col sm:flex-row">
          <button
            @click="tab = 'event'"
            :class="[
              'flex-1 px-6 py-4 rounded-xl font-medium transition-all duration-200 text-center',
              tab === 'event'
                ? 'bg-primary text-primary-content shadow-md'
                : 'text-base-content hover:bg-base-200'
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="hidden sm:inline">Demandes de bénévolat</span>
              <span class="sm:hidden">Bénévolat</span>
            </div>
          </button>
          <button
            @click="tab = 'association'"
            :class="[
              'flex-1 px-6 py-4 rounded-xl font-medium transition-all duration-200 text-center',
              tab === 'association'
                ? 'bg-primary text-primary-content shadow-md'
                : 'text-base-content hover:bg-base-200'
            ]"
          >
            <div class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span class="hidden sm:inline">Demandes d'adhésion</span>
              <span class="sm:hidden">Adhésion</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Content sections -->
      <div class="space-y-6">
        <!-- Event requests -->
        <div v-if="tab === 'event'" class="space-y-6">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <h2 class="text-xl font-semibold text-base-content">
              Demandes de bénévolat à un événement
            </h2>
            <div class="badge badge-primary badge-md font-semibold px-4 py-2 rounded-full whitespace-nowrap">
              {{ eventRequests.length }} demande{{ eventRequests.length > 1 ? 's' : '' }}
            </div>
          </div>

          <div v-if="eventRequests.length" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="req in eventRequests"
              :key="req.id"
              class="bg-base-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300"
            >
              <RequestItem
                :volunteer="req.volunteer"
                :context="req.eventName"
                type="event"
                @accept="acceptRequestAnnouncement(req.id, req.volunteer.name)"
                @refuse="refuseRequestAnnouncement(req.id)"
              />
            </div>
          </div>

          <div v-else class="text-center py-12">
            <div class="w-24 h-24 mx-auto mb-4 bg-base-200 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-base-content opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-base-content mb-2">Aucune demande</h3>
            <p class="text-base-content opacity-70">Aucune demande de participation pour le moment.</p>
          </div>
        </div>

        <!-- Association requests -->
        <div v-else class="space-y-6">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <h2 class="text-xl font-semibold text-base-content">
              Demandes d'adhésion à l'association
            </h2>
            <div class="badge badge-primary badge-md font-semibold px-4 py-2 rounded-full whitespace-nowrap">
              {{ associationRequests.length }} demande{{ associationRequests.length > 1 ? 's' : '' }}
            </div>
          </div>

          <div v-if="associationRequests.length" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="req in associationRequests"
              :key="req.id"
              class="bg-base-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300"
            >
              <RequestItem
                :volunteer="req.volunteer"
                type="association"
                @accept="acceptRequestAssociation(req.idAssociation, req.id, req.volunteer.name)"
                @refuse="refuseRequestAssociation(req.idAssociation, req.id)"
              />
            </div>
          </div>

          <div v-else class="text-center py-12">
            <div class="w-24 h-24 mx-auto mb-4 bg-base-200 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-base-content opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-base-content mb-2">Aucune demande</h3>
            <p class="text-base-content opacity-70">Aucune demande d'adhésion pour le moment.</p>
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
import {onMounted, ref, computed, watch} from 'vue';
import RequestItem from '~/components/event/association/RequestItem.vue';
import {definePageMeta, useAnnouncement, useNavigation} from "#imports";
import {useUser} from "~/composables/auth/useUser";
import {useAssociationAuth} from '~/composables/useAssociation';
import ErrorPopup from "~/components/utils/ErrorPopup.vue";

definePageMeta({
  middleware: ['auth'],
  layout: 'header',
})

const announcement = useAnnouncement()
const { getUserById,getUserId,initializeUser } = useUser();
const {navigateToRoute} = useNavigation()

const announcements = computed(() => announcement.getAnnouncements)
const loading = ref(false);

const isLoading = ref(true);

onMounted(async () => {
  await initData()
  isLoading.value = false;
});

async function initData() {
  try {
    if (!getUserId) {
      await initializeUser();
    }
    if (getUserId) {
      loading.value = true;
      await announcement.fetchAnnouncements(getUserId);
      await buildEventRequests();
      await buildAssociationRequests();
      loading.value = false;
    }
  }catch (error) {
    loading.value = false;
    handleError(error);
  }

}

const tab = ref<'event' | 'association'>('event');

const eventRequests = ref<any[]>([]);
const volunteersCache = ref<Record<string, any>>({});
const showErrorModal = ref(false);
const errorType = ref<'4xx' | '5xx' | null>(null);

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

async function buildEventRequests() {
  eventRequests.value = [];
  volunteersCache.value = {};

  const anns = announcements.value?.value || [];
  const allVolunteers = anns.flatMap(ann =>
    (ann.volunteersWaiting || []).map(volunteer => ({ ann, volunteer }))
  );

  const volunteerInfos = await Promise.all(
    allVolunteers.map(async ({ volunteer }) => {
      if (!volunteersCache.value[volunteer.id]) {
        try {
          volunteersCache.value[volunteer.id] = await getUserById(volunteer.id);
        } catch {
          volunteersCache.value[volunteer.id] = null;
        }
      }
      return volunteersCache.value[volunteer.id];
    })
  );

  eventRequests.value = allVolunteers
    .map(({ ann, volunteer }, i) => {
      const volunteerInfo = volunteerInfos[i];
      if (!volunteerInfo) return null;
      return {
        id: `${ann._id}-${volunteer.id}`,
        volunteer: {
          name: volunteer.name,
          email: volunteerInfo.email,
          avatar: volunteerInfo.avatarFileKey,
        },
        eventName: ann.nameEvent,
        type: 'event',
      };
    })
    .filter(Boolean);
}

const associationRequests = ref<any[]>([]);
const associationVolunteersCache = ref<Record<string, any>>({});
const associationStore = useAssociationAuth();
const currentAssociation = computed(() => associationStore.association.value);

async function buildAssociationRequests() {
  associationRequests.value = [];
  associationVolunteersCache.value = {};

  const association = currentAssociation.value;
  if (!association?.volunteersWaiting?.length) return;

  const volunteerInfos = await Promise.all(
    association.volunteersWaiting.map(async (volunteer) => {
      if (!associationVolunteersCache.value[volunteer.volunteerId]) {
        try {
          associationVolunteersCache.value[volunteer.volunteerId] = await getUserById(volunteer.volunteerId);
        } catch {
          associationVolunteersCache.value[volunteer.volunteerId] = null;
        }
      }
      return associationVolunteersCache.value[volunteer.volunteerId];
    })
  );

  associationRequests.value = association.volunteersWaiting
    .map((volunteer, i) => {
      const volunteerInfo = volunteerInfos[i];
      if (!volunteerInfo) return null;
      return {
        id: `${volunteer.volunteerId}`,
        idAssociation: `${association.associationId}`,
        volunteer: {
          name: volunteer.volunteerName,
          email: volunteerInfo.email,
          avatar: volunteerInfo.avatarFileKey,
        },
        type: 'association',
      };
    })
    .filter(Boolean);
}



watch(() => announcements.value, async () => {
  await buildEventRequests();
});

watch(currentAssociation, async () => {
  await buildAssociationRequests();
});

async function acceptRequestAnnouncement(id: string, volunteerName: string) {
  const volunteerId = id.split('-')[1];
  const announcementId = id.split('-')[0];
  try {
    await announcement.addVolunteer(announcementId, {
      id: volunteerId,
      name: volunteerName,
    });
    eventRequests.value = eventRequests.value.filter(req => req.id !== id);
  }catch (error) {
    handleError(error);
  }

}
async function refuseRequestAnnouncement(id: string) {
  const volunteerId = id.split('-')[1];
  const announcementId = id.split('-')[0];
  try {
    await announcement.removeVolunteerWaiting(announcementId, volunteerId);
    eventRequests.value = eventRequests.value.filter(req => req.id !== id);
  }catch (error) {
    handleError(error);
  }

}

async function acceptRequestAssociation(idAssociation: string,id: string, volunteerName: string) {
    try {
      await associationStore.addVolunteerToAssociation(
          idAssociation,
          {
            volunteerId: id,
            volunteerName: volunteerName,
          }
      )
      associationRequests.value = associationRequests.value.filter(req => req.id !== id);
    }catch (error) {
      handleError(error);
    }
}
async function refuseRequestAssociation(associationId: string, id: string) {
  try {
    await associationStore.removeAssociationVolunteerWaiting(associationId,id);
    associationRequests.value = associationRequests.value.filter(req => req.id !== id);
  }catch (error) {
    handleError(error);
  }
}
</script>

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
.grid > div:nth-child(5) { animation-delay: 0.5s; }
.grid > div:nth-child(6) { animation-delay: 0.6s; }

/* Hover effects */
.grid > div:hover {
  transform: translateY(-4px);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  h1 {
    font-size: 1.875rem;
  }
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1025px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>