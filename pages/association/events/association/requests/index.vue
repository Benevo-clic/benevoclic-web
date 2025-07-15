<template>
  <div  class="container mx-auto px-2 md:px-2 py-6 max-w-2xl">
    <h1 class="text-2xl font-bold mb-6">Mes demandes</h1>
    <div role="tablist" class="tabs tabs-bordered mb-6">
      <a role="tab" :class="['tab', tab === 'event' ? 'tab-active' : '']" @click="tab = 'event'">Demandes de bénévolat à un événement</a>
      <a role="tab" :class="['tab', tab === 'association' ? 'tab-active' : '']" @click="tab = 'association'">Demandes d'adhésion à l'association</a>
    </div>
    <div v-if="tab === 'event'">
      <div v-if="eventRequests.length" class="space-y-4">
        <RequestItem
          v-for="req in eventRequests"
          :key="req.id"
          :volunteer="req.volunteer"
          :context="req.eventName"
          type="event"
          @accept="acceptRequestAnnouncement(req.id, req.volunteer.name)"
          @refuse="refuseRequestAnnouncement(req.id)"
        />
      </div>
      <div v-else class="text-gray-400">Aucune demande de participation.</div>
    </div>
    <div v-else>
      <div v-if="associationRequests.length" class="space-y-4">
        <RequestItem
          v-for="req in associationRequests"
          :key="req.id"
          :volunteer="req.volunteer"
          type="association"
          @accept="acceptRequestAssociation(req.idAssociation,req.id ,req.volunteer.name)"
          @refuse="refuseRequestAssociation(req.idAssociation,req.id)"
        />
      </div>
      <div v-else class="text-gray-400">Aucune demande d'adhésion.</div>
    </div>
    <ErrorPopup
        :show-error-modal="showErrorModal"
        :error-type="errorType"
        @reload="handleReload"
        @goHome="handleGoHome"
    />
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

onMounted(async () => {
  await initData()
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
      if (!associationVolunteersCache.value[volunteer.id]) {
        try {
          associationVolunteersCache.value[volunteer.id] = await getUserById(volunteer.id);
        } catch {
          associationVolunteersCache.value[volunteer.id] = null;
        }
      }
      return associationVolunteersCache.value[volunteer.id];
    })
  );

  associationRequests.value = association.volunteersWaiting
    .map((volunteer, i) => {
      const volunteerInfo = volunteerInfos[i];
      if (!volunteerInfo) return null;
      return {
        id: `${volunteer.id}`,
        idAssociation: `${association.associationId}`,
        volunteer: {
          name: volunteer.name,
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
            id: id,
            name: volunteerName,
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
</style>