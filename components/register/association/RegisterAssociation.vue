<script setup lang="ts">
  import UploadImageForm from '~/components/register/volunteer/form/UploadImageForm.vue'
  import RegisterInfoAssociationForm from '~/components/register/association/form/RegisterInfoAssociationForm.vue'
  import { useUser } from '~/composables/auth/useUser'

  const user = useUser()

  const isSubmittedForm = ref(false)
  const image = ref<File | null>(null)
  const currentStep = ref(1)

  function saveFile(file: File) {
    image.value = file
    try {
      user.updateAvatar(file)
      navigateTo('/association/dashboard')
    } catch (error) {
      navigateTo('/association/dashboard')
      process.env.NODE_ENV !== 'production' && console.error('Error updating avatar:', error)
    }
  }

  function skipFile() {
    image.value = null
    navigateTo('/association/dashboard')
  }

  function submitForm(value: boolean) {
    isSubmittedForm.value = value
  }

  function handleStep(step: number) {
    currentStep.value = step
  }
</script>

<template>
  <div class="flex flex-col items-center justify-center bg-base-200 text-base-content">
    <progress class="progress progress-primary w-full mb-6" :value="currentStep" max="100" />

    <div class="min-h-[85vh] flex flex-col md:flex-row items-center justify-center gap-8 px-4">
      <RegisterInfoAssociationForm
        v-if="!isSubmittedForm"
        @submit="submitForm"
        @current-step="handleStep"
      />
      <UploadImageForm v-else @uploaded="saveFile" @skipped="skipFile" />

      <div class="hidden md:flex flex-col justify-center items-center w-1/2">
        <img
          src="/images/volunteer-info.png"
          alt="Illustration"
          class="w-full max-w-xl mx-auto"
          onerror="this.src='/images/volunteer-info.png'"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  /* Pas de styles complémentaires pour ce parent */
</style>
