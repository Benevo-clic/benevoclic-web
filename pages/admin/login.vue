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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-base-content">{{ t('adminLogin.title') }}</h1>
          <p class="text-base-content/70">{{ t('adminLogin.subtitle') }}</p>
        </div>

        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="email" class="block text-sm font-medium text-base-content mb-2">
              {{ t('adminLogin.form.email.label') }}
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              class="input input-bordered w-full"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-base-content mb-2">
              {{ t('adminLogin.form.password.label') }}
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              class="input input-bordered w-full"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary w-full" :disabled="loading || !isFormValid">
            <span v-if="loading" class="loading loading-spinner loading-sm" />
            {{
              loading ? t('adminLogin.form.submit.loading') : t('adminLogin.form.submit.default')
            }}
          </button>
        </form>

        <!-- Message d'erreur -->
        <div v-if="errorMessage" class="mt-4 p-3 bg-error/10 text-error rounded-lg text-sm">
          {{ errorMessage }}
        </div>

        <!-- Lien vers l'inscription -->
        <div class="mt-6 text-center">
          <p class="text-base-content/70 text-sm">
            {{ t('adminLogin.links.no_account') }}
            <button class="link link-primary" @click="goToRegister">
              {{ t('adminLogin.links.create_account') }}
            </button>
          </p>
        </div>

        <!-- Lien vers l'accueil -->
        <div class="mt-4 text-center">
          <button class="link link-neutral text-sm" @click="goToHome">
            {{ t('adminLogin.links.back_home') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { RoleUser } from '~/common/enums/role.enum'
  import { useUser } from '~/composables/auth/useUser'

  const { t } = useI18n()

  const router = useRouter()
  const { login } = useUser()
  const form = ref({ email: '', password: '' })
  const loading = ref(false)
  const errorMessage = ref('')

  const isFormValid = computed(() => {
    return form.value.email && form.value.password && form.value.password.length >= 6
  })

  async function handleLogin() {
    if (!isFormValid.value) {
      errorMessage.value = 'Veuillez remplir tous les champs correctement'
      return
    }

    loading.value = true
    errorMessage.value = ''

    try {
      // Utiliser l'API de connexion existante
      await login({
        email: form.value.email,
        password: form.value.password,
        role: RoleUser.ADMIN
      })
    } catch (error: any) {
      process.env.NODE_ENV !== 'production' &&
        console.error('❌ Erreur lors de la connexion admin:', error)
      errorMessage.value =
        error?.data?.message || error?.message || 'Email ou mot de passe incorrect'
    } finally {
      loading.value = false
    }
  }

  function goToRegister() {
    router.push('/admin/register')
  }

  function goToHome() {
    router.push('/')
  }

  // Empêcher l'initialisation automatique sur la page de login
  definePageMeta({
    title: 'Connexion Admin'
  })
</script>
