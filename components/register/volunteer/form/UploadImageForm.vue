<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const preview = ref<string | null>(null)
  const fileInput = ref<File | null>(null)
  // eslint-disable-next-line func-call-spacing
  const uploaded = defineEmits<{
    (e: 'uploaded', base64: File): void
    (e: 'skipped'): void
  }>()

  function onFileChange(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0] ?? null
    fileInput.value = file

    if (!file) {
      preview.value = null
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      preview.value = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  function finishUpload() {
    const file = fileInput.value
    if (file) {
      uploaded('uploaded', file)
    }
  }

  function skipUpload() {
    uploaded('skipped')
  }
</script>

<template>
  <div class="upload-image-form flex flex-col items-center">
    <!-- Instruction message -->
    <p class="mb-2 text-center text-primary font-medium">
      {{ t('auth.uploadImageForm.instruction') }}
    </p>
    <p class="mb-4 text-center text-base-content">
      {{ t('auth.uploadImageForm.message') }}
    </p>

    <label
      class="upload-box flex flex-col items-center justify-center border-dashed border-2 border-base-300 rounded-lg p-6 cursor-pointer hover:border-primary transition-colors"
    >
      <input
        type="file"
        accept="image/*"
        class="hidden"
        aria-label="Champ de saisie"
        @change="onFileChange"
      />
      <div v-if="preview">
        <img :src="preview" alt="Preview" class="mb-2 max-h-48 rounded-full object-cover" />
        <p class="text-sm text-base-content opacity-70">
          {{ t('auth.uploadImageForm.changeImage') }}
        </p>
      </div>
      <div v-else class="flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v6m3-3H9m3-9a4 4 0 00-4 4v1h8v-1a4 4 0 00-4-4z"
          />
        </svg>
        <p class="mt-2 text-sm text-gray-500">
          {{ t('auth.uploadImageForm.clickToUpload') }}
        </p>
      </div>
    </label>

    <!-- Action buttons -->
    <div class="mt-6 flex gap-4">
      <button class="btn btn-primary" @click="finishUpload">
        {{ t('auth.uploadImageForm.finish') }}
      </button>
      <button class="btn btn-secondary" @click="skipUpload">
        {{ t('auth.uploadImageForm.skip') }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .upload-box {
    width: 100%;
    max-width: 300px;
  }
</style>
