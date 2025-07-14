<script setup lang="ts">
import {useAssociationAuth} from "~/composables/useAssociation";
import {Info} from "lucide-vue-next";

import {reactive, ref} from "vue";
const association = useAssociationAuth()
const {t} = useI18n()


const form = reactive({
  siret: ''
})
const associationExists = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const isValid = ref(true)

const emit = defineEmits<{
  (e: 'associationExists', isVerified: boolean): void;
}>()

function validateSiret() {
  errorMessage.value = ''
  isValid.value = true

  if (!/^\d{14}$/.test(form.siret)) {
    errorMessage.value = t('auth.register.association_siret_status_error')
    isValid.value = false
    return false
  }

  return true
}

async function verifyAssociation() {
  if (!validateSiret()) {
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    await association.getAssociationInfoBySiret(form.siret)
    associationExists.value = true
    isValid.value = true
    emit('associationExists', associationExists.value)
  } catch (error) {
    console.error('Erreur de connexion:', error)
    errorMessage.value = t('auth.register.association_siret_status_error_description')
    isValid.value = false
    associationExists.value = false
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="verifyAssociation">
    <div class="form-control">
      <label class="label">
        <span class="label-text">Siret</span>
        <div class="tooltip" :data-tip="t('auth.register.association_siret_status_description')">
          <Info />
        </div>
      </label>
      <input
          v-model="form.siret"
          type="text"
          :placeholder="t('auth.register.association_siret_status_placeholder')"
          :class="['input input-bordered w-full', { 'input-error': !isValid }]"
      />
      <div v-if="!isValid" class="text-error text-sm mt-1">
        {{ errorMessage }}
      </div>
      <div v-if="isValid && associationExists" class="text-success text-sm mt-1">
        {{ t('auth.register.association_siret_status_good') }}
      </div>
    </div>

    <button type="submit" class="btn btn-primary w-full" :disabled="loading">
      <span v-if="loading" class="loading loading-spinner loading-sm"></span>
      <span v-else>Continuer</span>
    </button>

  </form>

</template>

<style scoped>

</style>
