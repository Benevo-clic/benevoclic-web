<script setup lang="ts">
import VerifSiretAssociation from "~/components/header/auth/form/VerifSiretAssociation.vue";

const {t} = useI18n()
const {form,handleLogin,loading,isAssociation} = defineProps<{
  form: Record<string, any>,
  handleLogin: () => Promise<void>;
  loading: boolean;
  isAssociation: boolean;
}>()
const associationExists = ref(false)

const emit = defineEmits<{
  (e: 'associationExists', isVerified: boolean): void;
  (e: 'forgot-password', email: string): void;
}>()

function verifyAssociation(value:boolean) {
  associationExists.value = value
  emit('associationExists', associationExists.value)
}

const forgotPasswordSent = ref(false)
const forgotPasswordError = ref('')

// Generate unique IDs for accessibility
const emailId = `email-${Math.random().toString(36).substr(2, 9)}`
const passwordId = `password-${Math.random().toString(36).substr(2, 9)}`
const forgotPasswordId = `forgot-password-${Math.random().toString(36).substr(2, 9)}`

const handleForgotPassword = () => {
  emit('forgot-password', form.email)
}
</script>

<template>
  <VerifSiretAssociation
      @association-exists="verifyAssociation"
      v-if="!associationExists && isAssociation"
  />

  <form 
    class="space-y-4" 
    @submit.prevent="handleLogin" 
    v-if="!isAssociation || associationExists"
    aria-labelledby="login-form-title"
  >
    <h2 id="login-form-title" class="sr-only">Formulaire de connexion</h2>
    
    <div class="form-control">
      <label :for="emailId" class="label">
        <span class="label-text">{{t('auth.email')}} <span class="text-error" aria-label="Champ obligatoire">*</span></span>
      </label>
      <input
          :id="emailId"
          v-model="form.email"
          type="email"
          :placeholder="t('auth.email')"
          class="input input-bordered w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
          autocomplete="email"
          required
          aria-required="true"
          aria-describedby="email-description"
      />
      <div id="email-description" class="text-xs text-gray-500 mt-1">
        Saisissez votre adresse email
      </div>
    </div>

    <div class="form-control">
      <label :for="passwordId" class="label">
        <span class="label-text">{{t('auth.password')}} <span class="text-error" aria-label="Champ obligatoire">*</span></span>
      </label>
      <input
          :id="passwordId"
          v-model="form.password"
          type="password"
          :placeholder="t('auth.placeholder_password')"
          class="input input-bordered w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
          autocomplete="current-password"
          required
          aria-required="true"
          aria-describedby="password-description"
      />
      <div id="password-description" class="text-xs text-gray-500 mt-1">
        Saisissez votre mot de passe
      </div>
      <div class="text-right mt-1">
        <button
          :id="forgotPasswordId"
          type="button"
          class="text-primary text-xs hover:underline focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none rounded"
          @click="handleForgotPassword"
          :aria-describedby="form.email ? undefined : 'forgot-password-no-email'"
        >
          {{ t('auth.forgot_password') }}
        </button>
        <div id="forgot-password-no-email" class="sr-only" v-if="!form.email">
          Vous devez d'abord saisir votre email pour réinitialiser votre mot de passe
        </div>
      </div>
    </div>

    <button 
      type="submit" 
      class="btn btn-primary w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none" 
      :disabled="loading"
      :aria-describedby="loading ? 'login-loading' : undefined"
    >
      <span v-if="loading" class="loading loading-spinner loading-sm" aria-hidden="true"></span>
      <span v-else>{{t('auth.login.title')}}</span>
    </button>
    <div id="login-loading" class="sr-only" v-if="loading">
      Connexion en cours...
    </div>

  </form>

  <!-- Message de confirmation ou d'erreur -->
  <div 
    v-if="forgotPasswordSent" 
    class="alert alert-success mt-2" 
    role="alert"
    aria-live="polite"
    aria-atomic="true"
  >
    {{ t('auth.forgot_password_sent') }}
  </div>
  <div 
    v-if="forgotPasswordError" 
    class="alert alert-error mt-2" 
    role="alert"
    aria-live="polite"
    aria-atomic="true"
  >
    {{ forgotPasswordError }}
  </div>
</template>

<style scoped>
/* Styles pour améliorer l'accessibilité */
.form-control label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-control input:focus-visible {
  border-color: #eb5577;
  box-shadow: 0 0 0 2px rgba(235, 85, 119, 0.2);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:disabled:focus-visible {
  outline: none;
  box-shadow: none;
}
</style>