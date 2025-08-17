<script setup lang="ts">
  import { ref, onBeforeUnmount } from 'vue'
  import { useAnnouncementStore } from '~/stores/announcement.store'
  import type { CreateAnnouncementDto } from '~/common/interface/event.interface'
  import { useAnnouncement } from '~/composables/useAnnouncement'
  import UploadCoverForm from '~/components/event/association/UploadCoverForm.vue'
  import EventForm from '~/components/event/association/EventForm.vue'
  import { useNavigation } from '~/composables/useNavigation'
  import ErrorPopup from '~/components/utils/ErrorPopup.vue'

  const { t } = useI18n()

  const store = useAnnouncementStore()
  const announcementAuth = useAnnouncement()
  const { navigateToRoute } = useNavigation()

  const isRegistered = ref(false)

  const showErrorModal = ref(false)
  const errorType = ref<'4xx' | '5xx' | null>(null)

  const emit = defineEmits(['closeModal'])

  const modalInstanceKey = ref(0)
  const eventFormKey = ref(0)
  const coverFormKey = ref(0)

  function resetState() {
    isRegistered.value = false
    showErrorModal.value = false
    errorType.value = null

    // @ts-expect-error: selon ton store
    if (typeof store.reset === 'function') store.reset()

    if ('currentAnnouncement' in store) store.currentAnnouncement = null

    modalInstanceKey.value++
    eventFormKey.value++
    coverFormKey.value++
  }

  const handleSubmit = async (formData: CreateAnnouncementDto) => {
    try {
      await announcementAuth.createAnnouncement(formData)
      isRegistered.value = true
    } catch (error) {
      handleError(error)
    }
  }

  const closeModal = () => {
    resetState()
    emit('closeModal')
  }

  const submitCover = () => {
    resetState()
    emit('closeModal')
    navigateToRoute('/association/dashboard')
  }

  function handleReload() {
    window.location.reload()
  }
  function handleGoHome() {
    resetState()
    navigateToRoute('/association/dashboard')
  }

  function handleError(error: any) {
    if (error?.response?.status >= 500 && error?.response?.status < 600) {
      errorType.value = '5xx'
      showErrorModal.value = true
    } else if (error?.response?.status >= 400 && error?.response?.status < 500) {
      errorType.value = '4xx'
      showErrorModal.value = true
    } else {
      process.env.NODE_ENV !== 'production' && console.error('Erreur inattendue:', error)
    }
  }

  async function handleFileChange(file: File) {
    try {
      await announcementAuth.uploadImageCover(file)
    } catch (error) {
      handleError(error)
    }
  }

  onBeforeUnmount(() => {
    resetState()
  })
</script>

<template>
  <div :key="modalInstanceKey" class="min-h-[85vh] items-center justify-center gap-8 px-4 py-6">
    <h2 class="text-2xl font-bold mb-6 text-center">
      {{
        store.currentAnnouncement
          ? t('eventModalForm.title.edit')
          : t('eventModalForm.title.create')
      }}
    </h2>

    <EventForm
      v-if="!isRegistered"
      :key="eventFormKey"
      :announcement="store.currentAnnouncement"
      @submit="handleSubmit"
      @cancel="closeModal"
    />

    <UploadCoverForm
      v-else
      :key="coverFormKey"
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
