<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex justify-center items-center h-32">
        <p>Chargement des annonces...</p>
    </div>
    <div v-else-if="error" class="p-4 text-red-600 bg-red-100 rounded-md">
        <p>Une erreur est survenue: {{ error }}</p>
    </div>
    <div v-else-if="announcements.length === 0" class="text-center text-gray-500">
        <p>Aucune annonce à afficher pour le moment.</p>
    </div>
    <div v-else>
      <EventCard
        v-for="announcement in announcements" 
        :key="announcement.id"
        :announcement="announcement"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        class="mb-4"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useAnnouncementStore } from '~/stores/announcement.store';
import EventCard from './EventCard.vue';
import type { Announcement } from '~/common/interface/event.interface';

const props = defineProps<{
    associationId?: string;
}>();

const emit = defineEmits(['edit', 'delete']);

const store = useAnnouncementStore();

const announcements = computed(() => store.getAnnouncements);
const loading = computed(() => store.loading);
const error = computed(() => store.error);

onMounted(() => {
  store.fetchAnnouncements(props.associationId);
});
</script> 