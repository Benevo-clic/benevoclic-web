<script setup lang="ts">
import { ref } from 'vue'
import { useAnnouncementStore } from '~/stores/announcement.store'
import type { CreateAnnouncementDto } from '~/common/interface/event.interface'
import { useAnnouncement } from '~/composables/useAnnouncement'
import UploadCoverForm from '~/components/event/association/UploadCoverForm.vue'
import EventForm from '~/components/event/association/EventForm.vue'
import { useNavigation } from '~/composables/useNavigation'
import ErrorPopup from '~/components/utils/ErrorPopup.vue'

const store = useAnnouncementStore()
const announcementAuth = useAnnouncement()
const { navigateToRoute } = useNavigation()

const isRegistered = ref(false)

const showErrorModal = ref(false)
const errorType = ref<'4xx' | '5xx' | null>(null)

const emit = defineEmits(['closeModal'])

const handleSubmit = async (formData: CreateAnnouncementDto) => {
  try {
    await announcementAuth.createAnnouncement(formData)
    isRegistered.value = true
  } catch (error) {
    handleError(error)
  }
}

const closeModal = () => {
  emit('closeModal')
}

const submitCover = () => {
  emit('closeModal')
  navigateToRoute('/association/dashboard')
}

function handleReload () {
  window.location.reload()
}
function handleGoHome () {
  navigateToRoute('/association/dashboard')
}

function handleError (error: any) {
  if (error?.response?.status >= 500 && error?.response?.status < 600) {
    errorType.value = '5xx'
    showErrorModal.value = true
  } else if (error?.response?.status >= 400 && error?.response?.status < 500) {
    errorType.value = '4xx'
    showErrorModal.value = true
  } else {
    console.error('Erreur inattendue:', error)
  }
}

async function handleFileChange (file: File) {
  try {
    await announcementAuth.uploadImageCover(file)
  } catch (error) {
    handleError(error)
  }
}
</script>

<template>
  <div class="min-h-[85vh] items-center justify-center gap-8 px-4 py-6">
    <h2 class="text-2xl font-bold mb-6 text-center">
      {{
        store.currentAnnouncement
          ? "Modifier l'événement"
          : "Créer un nouvel événement"
      }}
    </h2>

    <EventForm
      v-if="!isRegistered"
      :announcement="store.currentAnnouncement"
      @submit="handleSubmit"
      @cancel="closeModal"
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
      @go-home="handleGoHome"
    />
  </div>
</template>

<style scoped></style>
