<template>
  <dialog ref="modalRef" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">{{ t('presenceModal.title') }}</h3>
      <p class="py-2">
        {{ t('presenceModal.message', { name: personName, status: isPresent ? t('presenceModal.status.absent') : t('presenceModal.status.present') }) }}
      </p>

      <div class="form-control mt-4">
        <label class="label cursor-pointer justify-start gap-3">
          <input
            v-model="isPresent"
            type="checkbox"
            class="checkbox checkbox-primary"
            :aria-label="t('presenceListModal.search.aria_label')"
          />
          <span class="label-text">{{ isPresent ? t('presenceModal.checkbox.present') : t('presenceModal.checkbox.absent') }}</span>
        </label>
      </div>

      <div class="modal-action">
        <button class="btn btn-ghost" @click="closeModal">{{ t('presenceModal.actions.cancel') }}</button>
        <button class="btn btn-primary" :disabled="loading" @click="confirmPresence">
          <span v-if="loading" class="loading loading-spinner loading-xs mr-2" />
          {{ t('presenceModal.actions.confirm') }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>{{ t('presenceModal.actions.cancel') }}</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'

  const { t } = useI18n()

  interface Props {
    personId: string
    personName: string
    isVolunteer: boolean
    initialPresence?: boolean
    loading?: boolean
  }

  const props = defineProps<Props>()
  const emit = defineEmits<{
    confirm: [personId: string, isPresent: boolean, isVolunteer: boolean]
    close: []
  }>()

  const modalRef = ref<HTMLDialogElement | null>(null)
  const isPresent = ref(props.initialPresence || false)
  const loading = ref(props.loading)

  // Reset isPresent when initialPresence changes
  watch(
    () => props.initialPresence,
    newValue => {
      isPresent.value = newValue || false
    }
  )

  function showModal() {
    modalRef.value?.showModal()
  }

  function closeModal() {
    modalRef.value?.close()
    emit('close')
  }

  function confirmPresence() {
    loading.value = true
    emit('confirm', props.personId, isPresent.value, props.isVolunteer)
    setTimeout(() => {
      loading.value = false
      closeModal()
    }, 1000) // Simulate a delay for the confirmation action
  }

  defineExpose({
    showModal,
    closeModal
  })
</script>

<style scoped>
  .modal-box {
    max-width: 32rem;
  }
</style>
