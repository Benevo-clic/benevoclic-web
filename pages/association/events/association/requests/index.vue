<script setup lang="ts">
import { ref } from 'vue';
import RequestItem from '~/components/event/association/RequestItem.vue';
import {definePageMeta} from "#imports";

definePageMeta({
  middleware: ['auth'],
  layout: 'header',
})

const tab = ref<'event' | 'association'>('event');

// Exemple de données mockées (à remplacer par un fetch réel)
const eventRequests = ref([
  {
    id: '1',
    volunteer: { name: 'Alice Dupont', email: 'alice@email.com', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    eventName: 'Collecte de vêtements',
    type: 'event',
  },
  {
    id: '2',
    volunteer: { name: 'Bob Martin', email: 'bob@email.com', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    eventName: 'Nettoyage de plage',
    type: 'event',
  },
  {
    id: '1',
    volunteer: { name: 'Alice Dupont', email: 'alice@email.com', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
    eventName: 'Collecte de vêtements',
    type: 'event',
  },
  {
    id: '2',
    volunteer: { name: 'Bob Martin', email: 'bob@email.com', avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
    eventName: 'Nettoyage de plage',
    type: 'event',
  }
]);

const associationRequests = ref([
  {
    id: '3',
    volunteer: { name: 'Claire Dubois', email: 'claire@email.com', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
    type: 'association',
  },
]);

function acceptRequest(id: string) {
  // Logique d'acceptation
  alert('Accepté: ' + id);
}
function refuseRequest(id: string) {
  // Logique de refus
  alert('Refusé: ' + id);
}
</script>

<template>
  <div class="container mx-auto px-2 md:px-4 py-6 max-w-2xl">
    <h1 class="text-2xl font-bold mb-6">Demandes</h1>
    <div role="tablist" class="tabs tabs-bordered mb-6">
      <a role="tab" :class="['tab', tab === 'event' ? 'tab-active' : '']" @click="tab = 'event'">Demandes de participation à un événement</a>
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
          @accept="acceptRequest(req.id)"
          @refuse="refuseRequest(req.id)"
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
          @accept="acceptRequest(req.id)"
          @refuse="refuseRequest(req.id)"
        />
      </div>
      <div v-else class="text-gray-400">Aucune demande d'adhésion.</div>
    </div>
  </div>
</template>

<style scoped>

</style>