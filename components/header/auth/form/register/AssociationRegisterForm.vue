<script setup lang="ts">
import { onUnmounted, reactive, ref } from 'vue'
import { useRegisterStore } from '~/stores/auth/register'
import { userRegisterEmailPassword } from '~/composables/auth/useRegistrerEmailPassword'
import { RoleUser } from '~/common/enums/role.enum'

const register = userRegisterEmailPassword()
const loading = ref(false)

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  role: '' as RoleUser
})

const errorMessage = ref('')

const registerStore = useRegisterStore()

onUnmounted(() => {
  registerStore.cleanup()
})

async function handleRegister() {
  errorMessage.value = ''

  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  if (form.password.length < 8) {
    errorMessage.value = 'Le mot de passe doit contenir au moins 8 caractères.'
    return
  }

  loading.value = true
  try {
    await register.register(form)
  } catch (error) {
    console.error('Erreur de connexion:', error)
    errorMessage.value = 'Une erreur est survenue lors de l’inscription.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleRegister">
    <div class="form-control">
      <label class="label">
        <span class="label-text">E-mail</span>
      </label>
      <input
          v-model="form.email"
          type="email"
          placeholder="email@example.com"
          class="input input-bordered w-full"
          required
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Mot de passe</span>
      </label>
      <input
          v-model="form.password"
          type="password"
          placeholder="Au moins 8 caractères"
          class="input input-bordered w-full"
          required
      />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Confirmer votre mot de passe</span>
      </label>
      <input
          v-model="form.confirmPassword"
          type="password"
          placeholder="Confirmez votre mot de passe"
          class="input input-bordered w-full"
          required
      />
    </div>

    <!-- Message d’erreur -->
    <p v-if="errorMessage" class="text-red-600 text-sm">{{ errorMessage }}</p>

    <button type="submit" class="btn btn-primary w-full" :disabled="loading">
      <span v-if="loading" class="loading loading-spinner loading-sm"></span>
      <span v-else>Continuer</span>
    </button>
  </form>
</template>
