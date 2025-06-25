<template>
  <div class="container mx-auto px-2 md:px-4 py-6 max-w-5xl">
    <div v-if="loading.value" class="flex justify-center items-center h-32">
      <span class="loading loading-bars loading-xl"></span>
    </div>
    <div v-else>
      <div v-if="error.value" class="alert alert-error mb-4">{{ error }}</div>
      <div v-if="announcements.value.length === 0" class="text-center text-base-content/60 py-12">
        Aucune annonce à afficher pour le moment.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <VolunteerAnnouncementCard
          v-for="announcement in announcements.value"
          :announcement="announcement"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { definePageMeta, useAnnouncement } from "#imports";
import { onMounted, computed } from 'vue';
import VolunteerAnnouncementCard from '@/components/event/association/VolunteerAnnouncementCard.vue';

definePageMeta({
  middleware: ['auth'],
  layout: 'header'
})

const announcement = useAnnouncement();

const announcements = computed(() => announcement.getAnnouncements);
const loading = computed(() => announcement.loading);
const error = computed(() => announcement.error);

onMounted(async () => {
  await announcement.fetchAllAnnouncements();
});
</script>