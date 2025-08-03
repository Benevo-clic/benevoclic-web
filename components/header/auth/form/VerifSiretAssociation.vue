<script setup lang="ts">
import {useAssociationAuth} from "~/composables/useAssociation";
import {Info} from "lucide-vue-next";

import {reactive, ref} from "vue";
const association = useAssociationAuth()
const {t} = useI18n()

// Generate unique IDs for accessibility
const siretInputId = `siret-input-${Math.random().toString(36).substr(2, 9)}`
const siretDescriptionId = `siret-description-${Math.random().toString(36).substr(2, 9)}`
const siretErrorId = `siret-error-${Math.random().toString(36).substr(2, 9)}`
const siretSuccessId = `siret-success-${Math.random().toString(36).substr(2, 9)}`

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

// Gestion de la navigation clavier
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    verifyAssociation()
  }
}
</script>

<template>
  <form 
    class="space-y-4" 
    @submit.prevent="verifyAssociation"
    aria-labelledby="siret-form-title"
  >
    <h2 id="siret-form-title" class="sr-only">Vérification du numéro SIRET</h2>
    
    <div class="form-control">
      <label :for="siretInputId" class="label">
        <span class="label-text">
          SIRET <span class="text-error" aria-label="Champ obligatoire">*</span>
        </span>
        <div class="tooltip" :data-tip="t('auth.register.association_siret_status_description')">
          <Info class="w-4 h-4" aria-hidden="true" />
        </div>
      </label>
      <input
          :id="siretInputId"
          v-model="form.siret"
          type="text"
          :placeholder="t('auth.register.association_siret_status_placeholder')"
          :class="['input input-bordered w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none', { 'input-error': !isValid }]"
          :aria-describedby="!isValid ? siretErrorId : (associationExists ? siretSuccessId : siretDescriptionId)"
          :aria-invalid="!isValid"
          :aria-required="true"
          @keydown="handleKeydown"
          maxlength="14"
          pattern="[0-9]{14}"
          autocomplete="off"
      />
      <div 
        v-if="!isValid" 
        :id="siretErrorId" 
        class="text-error text-sm mt-1"
        role="alert"
        aria-live="polite"
        aria-atomic="true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        {{ errorMessage }}
      </div>
      <div 
        v-if="isValid && associationExists" 
        :id="siretSuccessId" 
        class="text-success text-sm mt-1"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ t('auth.register.association_siret_status_good') }}
      </div>
      <div 
        v-if="isValid && !associationExists && !errorMessage" 
        :id="siretDescriptionId" 
        class="text-xs text-gray-500 mt-1"
      >
        Saisissez le numéro SIRET de votre association (14 chiffres)
      </div>
    </div>

    <button 
      type="submit" 
      class="btn btn-primary w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none" 
      :disabled="loading"
      :aria-describedby="loading ? 'verify-loading' : undefined"
    >
      <span v-if="loading" class="loading loading-spinner loading-sm" aria-hidden="true"></span>
      <span v-else>Continuer</span>
    </button>
    <div id="verify-loading" class="sr-only" v-if="loading">
      Vérification du SIRET en cours...
    </div>

  </form>
</template>

<style scoped>
/* Amélioration de l'accessibilité pour les inputs */
.input:focus-visible {
  border-color: #eb5577;
  box-shadow: 0 0 0 2px rgba(235, 85, 119, 0.2);
}

.input-error:focus-visible {
  border-color: #f87272;
  box-shadow: 0 0 0 2px rgba(248, 114, 114, 0.2);
}

/* Amélioration du contraste pour les utilisateurs en mode high-contrast */
@media (prefers-contrast: more) {
  .input {
    border-width: 2px;
  }
  
  .tooltip {
    border: 1px solid currentColor;
  }
}

/* Respect des préférences de réduction de mouvement */
@media (prefers-reduced-motion: reduce) {
  .loading {
    animation: none;
  }
  
  .input {
    transition: none;
  }
}
</style>
