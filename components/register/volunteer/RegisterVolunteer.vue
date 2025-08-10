<script setup lang="ts">
  import { ref } from 'vue'
  import UploadImageForm from '~/components/register/volunteer/form/UploadImageForm.vue'
  import { useUser } from '~/composables/auth/useUser'
  import ErrorPopup from '~/components/utils/ErrorPopup.vue'
  import { useNavigation } from '~/composables/useNavigation'

  const user = useUser()
  const { navigateToRoute } = useNavigation()

  const isSubmittedForm = ref(false)
  const imageBase64 = ref<File | null>(null)
  const currentStep = ref(1)

  const showErrorModal = ref(false)
  const errorType = ref<'4xx' | '5xx' | null>(null)

  function handleReload() {
    window.location.reload()
  }
  async function handleGoHome() {
    await navigateToRoute('/')
  }

  async function saveBase64(base64: File) {
    imageBase64.value = base64
    try {
      await user.updateAvatar(base64)
      navigateTo('/volunteer')
    } catch (error) {
      handleError(error)
    }
  }

  function skipBase64() {
    imageBase64.value = null
    navigateTo('/volunteer')
  }

  function submitForm(value: boolean) {
    isSubmittedForm.value = value
  }

  function handleStep(step: number) {
    currentStep.value = step
  }

  function handleError(error: any) {
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
</script>

<template>
  <div class="flex flex-col items-center justify-center bg-base-200 text-base-content">
    <progress class="progress progress-primary w-full mb-6" :value="currentStep" max="100" />

    <div class="min-h-[85vh] flex flex-col md:flex-row items-center justify-center gap-8 px-4">
      <RegisterVolunteerFormRegisterInfoVolunteerForm
        v-if="!isSubmittedForm"
        @submit="submitForm"
        @current-step="handleStep"
      />
      <UploadImageForm v-else @uploaded="saveBase64" @skipped="skipBase64" />

      <div class="hidden md:flex flex-col justify-center items-center w-1/2">
        <img src="/images/volunteer-info.png" alt="Illustration" class="w-full max-w-xl mx-auto" />
      </div>
    </div>
    <ErrorPopup
      :show-error-modal="showErrorModal"
      :error-type="errorType"
      @reload="handleReload"
      @go-home="handleGoHome"
    />
  </div>
</template>

<style scoped lang="scss">
  /* Pas de styles complémentaires pour ce parent */
</style>
