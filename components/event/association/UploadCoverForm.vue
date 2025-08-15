<script setup lang="ts">
  import { ref } from 'vue'

  // eslint-disable-next-line func-call-spacing
  const emit = defineEmits<{
    (e: 'ignore'): void
    (e: 'finish'): void
    (e: 'closeModal'): void
    (e: 'submitCover', file: File): void
  }>()

  const coverPhotoPreview = ref<string | null>(null)
  const coverPhotoFile = ref<File | null>(null)
  const fileInput = ref<HTMLInputElement | null>(null)
  const isUploading = ref(false)

  const triggerFileInput = () => {
    fileInput.value?.click()
  }

  const handleFileChange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) {
      return
    }
    coverPhotoFile.value = file
    emit('submitCover', file)
    const reader = new FileReader()
    reader.onload = () => {
      coverPhotoPreview.value = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  const removeCoverPhoto = () => {
    coverPhotoPreview.value = null
    coverPhotoFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }

  const handleIgnore = () => {
    emit('ignore')
    coverPhotoPreview.value = null
    coverPhotoFile.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }

  const handleFinish = () => {
    if (coverPhotoPreview.value) {
      isUploading.value = true
      try {
        emit('finish')
      } catch (error) {
        process.env.NODE_ENV !== 'production' &&
          console.error('Error uploading cover image:', error)
      } finally {
        isUploading.value = false
      }
    } else {
      emit('finish')
    }
  }
</script>

<template>
  <div class="w-full mb-6">
    <div
      class="w-full h-80 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer relative overflow-hidden"
      :class="{ 'bg-base-200': !coverPhotoPreview, 'p-0': coverPhotoPreview }"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        accept="image/*"
        aria-label="Champ de saisie"
        @change="handleFileChange"
      />

      <div v-if="!coverPhotoPreview" class="text-center p-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12 mx-auto text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p class="mt-2 text-sm text-gray-500">Cliquez pour ajouter une photo de couverture</p>
        <p class="text-xs text-gray-400">JPG, PNG, GIF jusqu'à 10MB</p>
      </div>

      <img
        v-if="coverPhotoPreview"
        :src="coverPhotoPreview"
        class="w-full h-full object-cover"
        alt="Cover preview"
      />

      <button
        v-if="coverPhotoPreview"
        type="button"
        class="btn btn-circle btn-sm absolute top-2 right-2 bg-base-100 opacity-80 hover:opacity-100"
        @click.stop="removeCoverPhoto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end space-x-4 mt-6">
      <button type="button" class="btn btn-ghost" @click="handleIgnore">Ignorer</button>
      <button
        type="button"
        class="btn btn-primary"
        :class="{ loading: isUploading }"
        @click="handleFinish"
      >
        Terminer
      </button>
    </div>
  </div>
</template>

<style scoped></style>
