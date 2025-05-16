<script setup lang="ts">
const { t } = useI18n()


const props = defineProps<{
  isAssociation: boolean
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

defineExpose({
  openRegisterModal: handleRegister
})

</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 p-4">
    <div class="w-full max-w-xl">
      <RegisterAssociation v-if="props.isAssociation" />
      <RegisterVolunteer v-else />
    </div>
  </div>
</template>

<style scoped>
/* Centrage vertical et horizontal, fond léger */
.bg-gray-50 {
  background-color: #f9fafb;
}
</style>

