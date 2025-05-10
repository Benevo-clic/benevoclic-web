<script setup lang="ts">
const { t } = useI18n()


const props = defineProps<{
  isAssociation: boolean,
  isRegister: boolean
}>()

const registerModal = ref<HTMLDialogElement | null>(null)
const isRegisterMode = ref(false)


function handleRegister() {
  if (registerModal.value) {
    registerModal.value.showModal()
    isRegisterMode.value = true
  } else {
    console.log('registerModal est null')
  }
}

// Exposer les méthodes directement
defineExpose({
  openRegisterModal: handleRegister
})

</script>

<template>

  <!-- Modal REGISTER -->
  <dialog ref="registerModal" class="modal">
    <div class="modal-box w-11/12 max-w-7xl" @click.stop>
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="registerModal?.close()">✕</button>
      <RegisterAssociation v-if="props.isAssociation" />

      <RegisterVolunteer v-else :is-register="props.isRegister"/>
    </div>
  </dialog>
</template>
