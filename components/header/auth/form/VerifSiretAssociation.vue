<script setup lang="ts">
import {useAssociationAuth} from "~/composables/auth/associationAuth";
import {Info} from "lucide-vue-next";

import {reactive, ref} from "vue";
const association = useAssociationAuth()
const {t} = useI18n()


const form = reactive({
  siret: ''
})
const associationExists = ref(false)
const loading = ref(false)

const emit = defineEmits<{
  (e: 'associationExists', isVerified: boolean): void;
}>()


async function verifyAssociation() {
  loading.value = true
  try {
    await association.getAssociationInfoBySiret(form.siret)
    associationExists.value = true
    emit('associationExists', associationExists.value)
  }catch (error) {
    console.error('Erreur de connexion:', error)
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
          class="input input-bordered w-full"
      />
    </div>

    <button type="submit" class="btn btn-primary w-full" :disabled="loading">
      <span v-if="loading" class="loading loading-spinner loading-sm"></span>
      <span v-else>Continuer</span>
    </button>

  </form>

</template>

<style scoped>

</style>