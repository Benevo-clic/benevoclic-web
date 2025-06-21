<script setup lang="ts">
import { useAnnouncementStore } from '~/stores/announcement.store';
import type { Announcement } from '~/common/interface/event.interface';

const store = useAnnouncementStore();
const { loading } = store;

const emit = defineEmits(['closeModal'])

const handleSubmit = async (formData: Partial<Announcement>) => {
  try {
    if (formData.id) {
      // Update existing announcement
      await store.updateAnnouncement(formData.id, formData);
    } else {
      // Create new announcement
      await store.createAnnouncement(formData as Omit<Announcement, 'id'>);
    }
    // Close modal after successful submission
    closeModal();
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

const closeModal = () => {
  store.closeCreateModal();
  emit('closeModal');
};
</script>

<template>
  <div class="min-h-[85vh] items-center justify-center gap-8 px-4 py-6">
    <h2 class="text-2xl font-bold mb-6 text-center">
      {{ store.currentAnnouncement ? 'Modifier l\'événement' : 'Créer un nouvel événement' }}
    </h2>

    <EventForm 
      :announcement="store.currentAnnouncement" 
      @submit="handleSubmit" 
      @cancel="closeModal" 
    />
  </div>
</template>

<style scoped>
/* Add any custom styles here */
</style>
