<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-base-100 rounded-2xl shadow-lg p-8">
        <div class="text-center mb-6">
          <div
            class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-base-content">
            Créer un compte Admin
          </h1>
          <p class="text-base-content/70">
            Accédez à l'espace d'administration
          </p>
        </div>

        <form class="space-y-6" @submit.prevent="handleRegister">
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-base-content mb-2"
            >
              Email
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="input input-bordered w-full"
              placeholder="admin@example.com"
              required
            >
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-base-content mb-2"
            >
              Mot de passe
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              class="input input-bordered w-full"
              placeholder="••••••••"
              required
            >
            <p class="text-xs text-base-content/60 mt-1">
              Minimum 8 caractères
            </p>
          </div>

          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-base-content mb-2"
            >
              Confirmer le mot de passe
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              class="input input-bordered w-full"
              placeholder="••••••••"
              required
            >
          </div>

          <button
            type="submit"
            class="btn btn-primary w-full"
            :disabled="loading || !isFormValid"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm" />
            {{ loading ? "Création en cours..." : "Créer le compte admin" }}
          </button>
        </form>

        <!-- Message d'erreur -->
        <div
          v-if="errorMessage"
          class="mt-4 p-3 bg-error/10 text-error rounded-lg text-sm"
        >
          {{ errorMessage }}
        </div>

        <!-- Lien vers la connexion -->
        <div class="mt-6 text-center">
          <p class="text-base-content/70 text-sm">
            Déjà un compte admin ?
            <button class="link link-primary" @click="goToLogin">
              Se connecter
            </button>
          </p>
        </div>

        <!-- Lien vers l'accueil -->
        <div class="mt-4 text-center">
          <button class="link link-neutral text-sm" @click="goToHome">
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { RegisterPayload } from '~/common/types/register.type'
import { useUser } from '~/composables/auth/useUser'
import { RoleUser } from '~/common/enums/role.enum'

const router = useRouter()
const useAdmin = useUser()
const form = ref({ email: '', password: '', confirmPassword: '' })
const loading = ref(false)
const errorMessage = ref('')
const isEmailVerified = ref(false)

const isFormValid = computed(() => {
  return (
    form.value.email &&
    form.value.password &&
    form.value.confirmPassword &&
    form.value.password === form.value.confirmPassword &&
    form.value.password.length >= 8
  )
})

async function handleRegister () {
  if (!isFormValid.value) {
    errorMessage.value = 'Veuillez remplir tous les champs correctement'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    isEmailVerified.value = await useAdmin.register({
      email: form.value.email,
      password: form.value.password,
      role: RoleUser.ADMIN
    } as RegisterPayload)
    if (!isEmailVerified.value) {
      navigateTo({
        path: '/auth/VerifyEmailPage'
      })
    }
  } catch (error: any) {
    console.error("❌ Erreur lors de l'inscription admin:", error)
    errorMessage.value =
      error?.data?.message || "Une erreur est survenue lors de l'inscription"
  } finally {
    loading.value = false
  }
}

function goToLogin () {
  router.push('/admin/login')
}

function goToHome () {
  router.push('/')
}

definePageMeta({
  title: 'Inscription Admin'
})
</script>
