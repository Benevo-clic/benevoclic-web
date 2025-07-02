<template>
  <div v-if="loadingAnnouncement.value" class="flex justify-center items-center h-32">
    <span class="loading loading-bars loading-xl"></span>
  </div>
  <div v-else class="container mx-auto px-2 md:px-4 py-6 max-w-2xl">
    <h1 class="text-2xl font-bold mb-6">Demandes</h1>
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
          @accept="acceptRequestAssociation(req.id)"
          @refuse="refuseRequestAssociation(req.id)"
        />
      </div>
      <div v-else class="text-gray-400">Aucune demande d'adhésion.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, computed, watch} from 'vue';
import RequestItem from '~/components/event/association/RequestItem.vue';
import {definePageMeta, useAnnouncement} from "#imports";
import {useUser} from "~/composables/auth/useUser";
import {useAssociationAuth} from '~/composables/useAssociation';

definePageMeta({
  middleware: ['auth'],
  layout: 'header',
})

const announcement = useAnnouncement()
const { getUserById,getUserId } = useUser();
const announcements = computed(() => announcement.getAnnouncements)
const loadingAnnouncement = computed(() => announcement.loading)
const loading = ref(false);


const tab = ref<'event' | 'association'>('event');

// Pour les demandes d'événement
const eventRequests = ref<any[]>([]);
const volunteersCache = ref<Record<string, any>>({});

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
          avatar: volunteerInfo.imageProfile?.data
            ? `data:${volunteerInfo.imageProfile.contentType};base64,${volunteerInfo.imageProfile.data}`
            : undefined,
        },
        eventName: ann.nameEvent,
        type: 'event',
      };
    })
    .filter(Boolean);
}

// Pour les demandes d'adhésion à l'association
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
        volunteer: {
          name: volunteer.name,
          email: volunteerInfo.email,
          avatar: volunteerInfo.imageProfile?.data
            ? `data:${volunteerInfo.imageProfile.contentType};base64,${volunteerInfo.imageProfile.data}`
            : undefined,
        },
        type: 'association',
      };
    })
    .filter(Boolean);
}

onMounted(async () => {
  loading.value = true;
  await announcement.fetchAnnouncements(getUserId);
  await buildEventRequests();
  await buildAssociationRequests();
  loading.value = false;
});

watch(() => announcements.value, async () => {
  await buildEventRequests();
});
watch(currentAssociation, async () => {
  await buildAssociationRequests();
});

function acceptRequestAnnouncement(id: string, volunteerName: string) {
  // announcement.addVolunteer(id)
  const volunteerId = id.split('-')[1];
  const announcementId = id.split('-')[0];
  announcement.addVolunteer(announcementId, {
    id: volunteerId,
    name: volunteerName,
  });
}
function refuseRequestAnnouncement(id: string) {
  alert('Refusé: ' + id);
}

function acceptRequestAssociation(id: string) {
  alert('Accepté: ' + id);
}
function refuseRequestAssociation(id: string) {
  alert('Refusé: ' + id);
}
</script>

<style scoped>
</style>