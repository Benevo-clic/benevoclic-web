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

</script>

<template>
  <VerifSiretAssociation
      @association-exists="verifyAssociation"
      v-if="!associationExists && isAssociation"
  />

  <form class="space-y-4" @submit.prevent="handleLogin" v-if="!isAssociation || associationExists">
    <div class="form-control">
      <label :for="emailId" class="label">
        <span class="label-text">{{t('auth.email')}}</span>
      </label>
      <input
          :id="emailId"
          v-model="form.email"
          type="email"
          :placeholder="t('auth.email')"
          class="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          autocomplete="email"
          required
          aria-required="true"
      />
    </div>

    <div class="form-control">
      <label :for="passwordId" class="label">
        <span class="label-text">{{t('auth.password')}}</span>
      </label>
      <input
          :id="passwordId"
          v-model="form.password"
          type="password"
          :placeholder="t('auth.placeholder_password')"
          class="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          autocomplete="current-password"
          required
          aria-required="true"
      />
      <div class="text-right mt-1">
        <button
          type="button"
          class="text-primary text-xs hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
          @click="$emit('forgot-password', form.email)"
        >
          {{ t('auth.forgot_password') }}
        </button>
      </div>
    </div>

    <button type="submit" class="btn btn-primary w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" :disabled="loading">
      <span v-if="loading" class="loading loading-spinner loading-sm" aria-hidden="true"></span>
      <span v-else>{{t('auth.login.title')}}</span>
    </button>

  </form>

  <!-- Message de confirmation ou d'erreur -->
  <div v-if="forgotPasswordSent" class="alert alert-success mt-2" role="alert">
    {{ t('auth.forgot_password_sent') }}
  </div>
  <div v-if="forgotPasswordError" class="alert alert-error mt-2" role="alert">
    {{ forgotPasswordError }}
  </div>
</template>

<style scoped>

</style>