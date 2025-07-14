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
</script>

<template>
  <VerifSiretAssociation
      @association-exists="verifyAssociation"
      v-if="!associationExists && isAssociation"
  />

  <form class="space-y-4" @submit.prevent="handleLogin" v-if="!isAssociation || associationExists">
    <div class="form-control">
      <label class="label">
        <span class="label-text">{{t('auth.email')}}</span>
      </label>
      <input
          v-model="form.email"
          type="email"
          :placeholder="t('auth.email')"
          class="input input-bordered w-full"
          autocomplete="email"
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">{{t('auth.password')}}</span>
      </label>
      <input
          v-model="form.password"
          type="password"
          :placeholder="t('auth.placeholder_password')"
          class="input input-bordered w-full"
          autocomplete="current-password"
      />
      <div class="text-right mt-1">
        <button
          type="button"
          class="text-primary text-xs hover:underline"
          @click="$emit('forgot-password', form.email)"
        >
          {{ t('auth.forgot_password') }}
        </button>
      </div>
    </div>

    <button type="submit" class="btn btn-primary w-full" :disabled="loading">
      <span v-if="loading" class="loading loading-spinner loading-sm"></span>
      <span v-else>{{t('auth.login.title')}}</span>
    </button>

  </form>

  <!-- Message de confirmation ou d'erreur -->
  <div v-if="forgotPasswordSent" class="alert alert-success mt-2">
    {{ t('auth.forgot_password_sent') }}
  </div>
  <div v-if="forgotPasswordError" class="alert alert-error mt-2">
    {{ forgotPasswordError }}
  </div>
</template>

<style scoped>

</style>