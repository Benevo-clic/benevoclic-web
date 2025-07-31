<template>
  <dialog ref="modalRef" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">Marquer la présence</h3>
      <p class="py-2">Souhaitez-vous marquer {{ personName }} comme {{ isPresent ? 'absent' : 'présent' }} ?</p>

      <div class="form-control mt-4">
        <label class="label cursor-pointer justify-start gap-3">
          <input 
            type="checkbox" 
            class="checkbox checkbox-primary" 
            v-model="isPresent"
          aria-label="Champ de saisie">
          <span class="label-text">{{ isPresent ? 'Présent' : 'Absent' }}</span>
        </label>
      </div>

      <div class="modal-action">
        <button @click="closeModal" class="btn btn-ghost">Annuler</button>
        <button @click="confirmPresence" class="btn btn-primary" :disabled="loading">
          <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
          Confirmer
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>Fermer</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  personId: string;
  personName: string;
  isVolunteer: boolean;
  initialPresence?: boolean;
  loading?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  confirm: [personId: string, isPresent: boolean, isVolunteer: boolean];
  close: [];
}>();

const modalRef = ref<HTMLDialogElement | null>(null);
const isPresent = ref(props.initialPresence || false);
const loading = ref(false);

// Reset isPresent when initialPresence changes
watch(() => props.initialPresence, (newValue) => {
  isPresent.value = newValue || false;
});

function showModal() {
  modalRef.value?.showModal();
}

function closeModal() {
  modalRef.value?.close();
  emit('close');
}

function confirmPresence() {
  loading.value = true;
  emit('confirm', props.personId, isPresent.value, props.isVolunteer);
  setTimeout(() => {
    loading.value = false;
    closeModal();
  }, 1000); // Simulate a delay for the confirmation action
}

defineExpose({
  showModal,
  closeModal
});
</script>

<style scoped>
.modal-box {
  max-width: 32rem;
}
</style>
