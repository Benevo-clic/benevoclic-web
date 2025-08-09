<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RoleUser } from '~/common/enums/role.enum'
import { useUser } from '~/composables/auth/useUser'
import VerifSiretAssociation from '~/components/header/auth/form/VerifSiretAssociation.vue'

const { t } = useI18n()

const loading = ref(false)
const associationExists = ref(false)

const user = useUser()

const { isAssociation } = defineProps<{
  isAssociation: boolean;
}>()

const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const errorMessage = ref('')
const termsAccepted = ref(false)

const emit = defineEmits<{
  (e: 'emailVerified', isVerified: boolean): void;
  (e: 'associationExists', isVerified: boolean): void;
}>()

const isEmailVerified = ref(false)

// Generate unique IDs for accessibility
const emailId = `register-email-${Math.random().toString(36).substr(2, 9)}`
const passwordId = `register-password-${Math.random().toString(36).substr(2, 9)}`
const confirmPasswordId = `register-confirm-password-${Math.random().toString(36).substr(2, 9)}`
const termsId = `register-terms-${Math.random().toString(36).substr(2, 9)}`

async function handleRegister () {
  errorMessage.value = ''

  if (form.password !== form.confirmPassword) {
    errorMessage.value = t('auth.register.error.password_mismatch')
    return
  }

  if (form.password.length < 8) {
    errorMessage.value = t('auth.register.error.weak_password')
    return
  }

  if (!termsAccepted.value) {
    errorMessage.value = t('auth.register.error.terms_not_accepted')
    return
  }

  loading.value = true

  try {
    await user.register({
      email: form.email,
      password: form.password,
      role: isAssociation ? RoleUser.ASSOCIATION : RoleUser.VOLUNTEER
    })
    isEmailVerified.value = true
    emit('emailVerified', isEmailVerified.value)
  } catch (error) {
    console.error('Erreur de connexion:', error)
    errorMessage.value = "Une erreur est survenue lors de l'inscription."
    isEmailVerified.value = false
    emit('emailVerified', isEmailVerified.value)
  } finally {
    loading.value = false
  }
}

function verifyAssociation (value: boolean) {
  associationExists.value = value
  emit('associationExists', associationExists.value)
}
</script>

<template>
  <VerifSiretAssociation
    v-if="!associationExists && isAssociation"
    @association-exists="verifyAssociation"
  />

  <form
    v-if="!isAssociation || associationExists"
    class="space-y-4"
    aria-labelledby="register-form-title"
    @submit.prevent="handleRegister"
  >
    <h2 id="register-form-title" class="sr-only">
      Formulaire d'inscription
    </h2>

    <div class="form-control">
      <label :for="emailId" class="label">
        <span class="label-text">{{ t("auth.email") }}
          <span class="text-error" aria-label="Champ obligatoire">*</span></span>
      </label>
      <input
        :id="emailId"
        v-model="form.email"
        type="email"
        :placeholder="t('auth.email')"
        class="input input-bordered w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
        required
        aria-required="true"
        autocomplete="email"
        aria-describedby="email-description"
      >
      <div id="email-description" class="text-xs text-gray-500 mt-1">
        Saisissez votre adresse email
      </div>
    </div>

    <div class="form-control">
      <label :for="passwordId" class="label">
        <span class="label-text">{{ t("auth.password") }}
          <span class="text-error" aria-label="Champ obligatoire">*</span></span>
      </label>
      <input
        :id="passwordId"
        v-model="form.password"
        type="password"
        :placeholder="t('auth.placeholder_password')"
        class="input input-bordered w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
        required
        aria-required="true"
        autocomplete="new-password"
        aria-describedby="password-description"
      >
      <div id="password-description" class="text-xs text-gray-500 mt-1">
        Le mot de passe doit contenir au moins 8 caractères
      </div>
    </div>

    <div class="form-control">
      <label :for="confirmPasswordId" class="label">
        <span class="label-text">{{ t("auth.confirm_password") }}
          <span class="text-error" aria-label="Champ obligatoire">*</span></span>
      </label>
      <input
        :id="confirmPasswordId"
        v-model="form.confirmPassword"
        type="password"
        :placeholder="t('auth.confirm_password')"
        class="input input-bordered w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
        required
        aria-required="true"
        autocomplete="new-password"
        :aria-describedby="
          form.password !== form.confirmPassword && form.confirmPassword
            ? 'password-mismatch'
            : 'confirm-password-description'
        "
      >
      <div id="confirm-password-description" class="text-xs text-gray-500 mt-1">
        Confirmez votre mot de passe
      </div>
      <div
        v-if="form.password !== form.confirmPassword && form.confirmPassword"
        id="password-mismatch"
        class="text-xs text-error mt-1"
      >
        Les mots de passe ne correspondent pas
      </div>
    </div>

    <!-- Case à cocher pour les conditions générales -->
    <div class="form-control">
      <label :for="termsId" class="label cursor-pointer justify-start gap-3">
        <input
          :id="termsId"
          v-model="termsAccepted"
          type="checkbox"
          class="checkbox checkbox-primary checkbox-sm focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
          required
          aria-required="true"
          aria-describedby="terms-description"
        >
        <span class="label-text text-sm">
          J'accepte les
          <a
            href="/mentions-legales"
            target="_blank"
            class="text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Ouvrir les conditions générales d'utilisation dans un nouvel onglet"
          >
            conditions générales d'utilisation
          </a>
          et la
          <a
            href="/confidentialite"
            target="_blank"
            class="text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Ouvrir la politique de confidentialité dans un nouvel onglet"
          >
            politique de confidentialité
          </a>
        </span>
      </label>
      <div id="terms-description" class="text-xs text-gray-500 mt-1">
        Vous devez accepter les conditions pour continuer
      </div>
    </div>

    <!-- Message d'erreur -->
    <div
      v-if="errorMessage"
      class="alert alert-error"
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ errorMessage }}</span>
    </div>

    <button
      type="submit"
      class="btn btn-primary w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
      :disabled="loading || !termsAccepted"
      :aria-describedby="
        loading
          ? 'register-loading'
          : !termsAccepted
            ? 'register-disabled'
            : undefined
      "
    >
      <span
        v-if="loading"
        class="loading loading-spinner loading-sm"
        aria-hidden="true"
      />
      <span v-else>{{ t("auth.continue") }}</span>
    </button>
    <div v-if="loading" id="register-loading" class="sr-only">
      Inscription en cours...
    </div>
    <div v-if="!termsAccepted" id="register-disabled" class="sr-only">
      Vous devez accepter les conditions générales pour continuer
    </div>
  </form>
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

/* Amélioration du contraste pour les liens */
a:focus-visible {
  text-decoration: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 2px;
}
</style>
