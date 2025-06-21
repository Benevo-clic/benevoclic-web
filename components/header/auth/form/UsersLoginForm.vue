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

}>()



function verifyAssociation(value:boolean) {
  associationExists.value = value
  emit('associationExists', associationExists.value)
}


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
      />
    </div>

    <button type="submit" class="btn btn-primary w-full" :disabled="loading">
      <span v-if="loading" class="loading loading-spinner loading-sm"></span>
      <span v-else>{{t('auth.login.title')}}</span>
    </button>

  </form>

</template>

<style scoped>

</style>