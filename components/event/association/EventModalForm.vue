<script setup lang="ts">
import { useAnnouncementStore } from '~/stores/announcement.store';
import type { CreateAnnouncementDto} from '~/common/interface/event.interface';
import {useAnnouncement} from "~/composables/useAnnouncement";
import UploadCoverForm from "~/components/event/association/UploadCoverForm.vue";
import EventForm from "~/components/event/association/EventForm.vue";
import {ref} from "vue";
import {useNavigation} from "~/composables/useNavigation";
import ErrorPopup from "~/components/utils/ErrorPopup.vue";

const store = useAnnouncementStore();
const announcementAuth = useAnnouncement();
const {navigateToRoute} = useNavigation()

const isRegistered = ref(false);

const showErrorModal = ref(false);
const errorType = ref<'4xx' | '5xx' | null>(null);

const emit = defineEmits(['closeModal'])

const handleSubmit = async (formData: CreateAnnouncementDto) => {
  try {
    await announcementAuth.createAnnouncement(formData);
    isRegistered.value = true;
  } catch (error) {
    handleError(error);
    return;
  }
};

const closeModal = () => {
  store.closeCreateModal();
  emit('closeModal');
};

const submitCover= () => {
  store.closeCreateModal();
  emit('closeModal');
  navigateToRoute('/association/events/association/manage');
};


function handleReload() {
  window.location.reload();
}
function handleGoHome() {
  navigateToRoute('/association/events/association/manage');
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

async function handleFileChange(file: File) {
  try {
    await announcementAuth.uploadImageCover(file);
  }catch (error) {
    handleError(error);
    return;
  }
}

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
      @submit-cover="handleFileChange"
    />
    <ErrorPopup
        :show-error-modal="showErrorModal"
        :error-type="errorType"
        @reload="handleReload"
        @goHome="handleGoHome"
    />
  </div>
</template>

<style scoped>
</style>
