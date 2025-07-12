<script setup lang="ts">
import { reactive, ref} from 'vue'
import {RoleUser} from '~/common/enums/role.enum'
import {useUser} from "~/composables/auth/useUser";
import VerifSiretAssociation from "~/components/header/auth/form/VerifSiretAssociation.vue";
import {useI18n} from "vue-i18n";

const {t} = useI18n()

const loading = ref(false)
const associationExists = ref(false)


const user = useUser()

const {isAssociation} = defineProps<{
  isAssociation: boolean
}>()


const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})

const errorMessage = ref('')

const emit = defineEmits<{
  (e: 'emailVerified', isVerified: boolean): void;
  (e: 'associationExists', isVerified: boolean): void;

}>()
const isEmailVerified = ref(false)



async function handleRegister() {
  errorMessage.value = ''

  if (form.password !== form.confirmPassword) {
    errorMessage.value = t('auth.register.error.password_mismatch')
    return
  }

  if (form.password.length < 8) {
    errorMessage.value = t('auth.register.error.weak_password')
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
    errorMessage.value = 'Une erreur est survenue lors de l’inscription.'
    isEmailVerified.value = false
    emit('emailVerified', isEmailVerified.value)
  } finally {
    loading.value = false
  }
}


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

  <form class="space-y-4" @submit.prevent="handleRegister" v-if="!isAssociation || associationExists">
    <div class="form-control">
      <label class="label">
        <span class="label-text">{{t('auth.email')}}</span>
      </label>
      <input
          v-model="form.email"
          type="email"
          :placeholder="t('auth.email')"
          class="input input-bordered w-full"
          required
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
          required
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">{{t('auth.confirm_password')}}</span>
      </label>
      <input
          v-model="form.confirmPassword"
          type="password"
          :placeholder="t('auth.confirm_password')"
          class="input input-bordered w-full"
          required
      />
    </div>

    <!-- Message d’erreur -->
    <p v-if="errorMessage" class="text-error text-sm">{{ errorMessage }}</p>

    <button type="submit" class="btn btn-primary w-full" :disabled="loading">
      <span v-if="loading" class="loading loading-spinner loading-sm"></span>
      <span v-else>{{t('auth.continue')}}</span>
    </button>
  </form>
</template>
