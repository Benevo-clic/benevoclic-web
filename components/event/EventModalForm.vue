<script setup lang="ts">
import { useAnnouncementStore } from '~/stores/announcement.store';
import type { CreateAnnouncementDto} from '~/common/interface/event.interface';
import {useAnnouncement} from "~/composables/useAnnouncement";
import UploadCoverForm from "~/components/event/UploadCoverForm.vue";

const store = useAnnouncementStore();
const announcementAuth = useAnnouncement();
const isRegistered = ref(false);


const emit = defineEmits(['closeModal'])

const handleSubmit = async (formData: CreateAnnouncementDto) => {
  try {
    await announcementAuth.createAnnouncement(formData);
    isRegistered.value = true;
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

const closeModal = () => {
  store.closeCreateModal();
  emit('closeModal');
};

const submitCover= () => {
  store.closeCreateModal();
  emit('closeModal');
  navigateTo('/association/events/manage');
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
      v-if="!isRegistered"
    />
    <UploadCoverForm 
      v-else
      @ignore="closeModal"
      @finish="submitCover"
    />
  </div>
</template>

<style scoped>
/* Add any custom styles here */
</style>
