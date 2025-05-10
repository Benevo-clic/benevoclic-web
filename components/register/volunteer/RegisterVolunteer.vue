<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import UploadImageForm from "~/components/register/volunteer/form/UploadImageForm.vue"
import {useUser} from "~/composables/auth/useUser";

const user = useUser()

const { t } = useI18n()
const props = defineProps<{
  isRegister: boolean
}>()

const imageBase64 = ref<string | null>(null)

function saveBase64(base64: string) {
  imageBase64.value = base64
  user.updateProfile(base64);
}

function skipBase64() {
  imageBase64.value = null
  console.log('Upload image ignoré')
  navigateTo("/dashboard")
}
</script>

<template>
  <div class="min-h-[85vh] flex flex-col md:flex-row items-center justify-center gap-8 px-4">
    <!-- Formulaire en premier sur mobile -->
    <RegisterVolunteerFormRegisterInfoVolunteerForm v-if="!props.isRegister" />
    <UploadImageForm
        v-else
        @uploaded="saveBase64"
        @skipped="skipBase64"
    />

    <!-- Image + lien association (desktop uniquement) -->
    <div class="hidden md:flex flex-col justify-center items-center w-1/2">
      <img
          src="/images/volunteer-info.png"
          alt="Illustration"
          class="w-full max-w-xl mx-auto"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
/* Pas de styles complémentaires pour ce parent */
</style>
