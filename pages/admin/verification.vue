<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUser } from '~/composables/auth/useUser'

  interface StatusMessage {
    type: 'success' | 'warning' | 'error'
    text: string
  }

  const router = useRouter()
  const userUse = useUser()
  const refreshing = ref(false)
  const statusMessage = ref<StatusMessage | null>(null)

  async function refreshPage() {
    refreshing.value = true
    statusMessage.value = null

    try {
      // Appeler l'API pour vérifier le statut d'approbation
      const response = await userUse.checkAdminApprovalStatus()

      if (response) {
        statusMessage.value = {
          type: 'success',
          text: 'Votre compte est approuvé ! Vous allez être redirigé vers le dashboard.'
        }

        // Rediriger vers le dashboard après un délai
        setTimeout(() => {
          router.push('/admin')
        }, 2000)
      } else {
        statusMessage.value = {
          type: 'warning',
          text: "Votre compte n'a pas encore été approuvé. Veuillez patienter ou contacter un super administrateur."
        }
      }
    } catch (error: any) {
      process.env.NODE_ENV !== 'production' &&
        console.error('Erreur lors de la vérification:', error)
      statusMessage.value = {
        type: 'error',
        text: error?.data?.message || 'Erreur lors de la vérification. Veuillez réessayer.'
      }
    } finally {
      refreshing.value = false
    }
  }

  function goToLogin() {
    router.push('/admin/login')
  }

  function goToHome() {
    router.push('/')
  }

  definePageMeta({
    title: 'Vérification Admin'
  })
</script>

<template>
  <div class="min-h-screen bg-base-200 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="bg-base-100 rounded-2xl shadow-lg p-8">
        <div class="text-center mb-8">
          <!-- Icône d'attente -->
          <div
            class="w-20 h-20 bg-warning/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-10 w-10 text-warning"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h1 class="text-2xl font-bold text-base-content mb-3">Compte en attente d'approbation</h1>

          <p class="text-base-content/70 leading-relaxed">
            Votre compte administrateur a été créé avec succès, mais il nécessite une approbation
            par un super administrateur avant de pouvoir accéder au dashboard.
          </p>
        </div>

        <!-- Informations supplémentaires -->
        <div class="bg-info/5 border border-info/20 rounded-lg p-4 mb-6">
          <div class="flex items-start space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-info mt-0.5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 class="font-semibold text-base-content mb-1">Que se passe-t-il maintenant ?</h3>
              <ul class="text-sm text-base-content/70 space-y-1">
                <li>• Un super administrateur va examiner votre demande</li>
                <li>• Vous recevrez une notification par email une fois approuvé</li>
                <li>• Vous pourrez alors vous connecter normalement</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="space-y-4">
          <button class="btn btn-primary w-full" :disabled="refreshing" @click="refreshPage">
            <span v-if="refreshing" class="loading loading-spinner loading-sm" />
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {{ refreshing ? 'Vérification en cours...' : "Vérifier l'approbation" }}
          </button>

          <button class="btn btn-outline btn-neutral w-full" @click="goToLogin">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Retour à la connexion
          </button>
        </div>

        <!-- Lien vers l'accueil -->
        <div class="mt-6 text-center">
          <button class="link link-neutral text-sm" @click="goToHome">← Retour à l'accueil</button>
        </div>

        <!-- Message de statut -->
        <div
          v-if="statusMessage"
          class="mt-4 p-3 rounded-lg text-sm"
          :class="{
            'bg-success/10 text-success': statusMessage.type === 'success',
            'bg-warning/10 text-warning': statusMessage.type === 'warning',
            'bg-error/10 text-error': statusMessage.type === 'error'
          }"
        >
          {{ statusMessage.text }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* Animation pour l'icône d'attente */
  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .w-20.h-20 svg {
    animation: pulse 2s ease-in-out infinite;
  }
</style>
