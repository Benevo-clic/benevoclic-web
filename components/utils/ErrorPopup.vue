<script setup lang="ts">
  const props = defineProps<{
    showErrorModal: boolean
    errorType: '4xx' | '5xx' | null
  }>()

  const emit = defineEmits<{
    (e: 'reload'): void
    (e: 'goHome'): void
  }>()

  const handleReload = () => {
    emit('reload')
  }
  const handleGoHome = () => {
    emit('goHome')
  }
</script>

<template>
  <template v-if="props.showErrorModal">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-base-100 rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
        <h2 class="text-xl font-bold mb-4">Erreur</h2>
        <p class="mb-6">
          <span v-if="props.errorType === '4xx'">Cette action n'est plus possible.</span>
          <span v-else-if="errorType === '5xx'">Une erreur serveur est survenue.</span>
        </p>
        <button v-if="errorType === '4xx'" class="btn btn-primary w-full" @click="handleReload">
          Recharger la page
        </button>
        <button
          v-else-if="errorType === '5xx'"
          class="btn btn-primary w-full"
          @click="handleGoHome"
        >
          Revenir à la gestion des annonces
        </button>
      </div>
    </div>
  </template>
</template>

<style scoped></style>
