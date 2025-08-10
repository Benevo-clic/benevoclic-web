<template>
  <div class="p-4 bg-base-200 rounded-lg">
    <h3 class="text-lg font-semibold mb-4">Statut Firebase</h3>

    <div class="space-y-2 mb-4">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full" :class="firebaseReady ? 'bg-success' : 'bg-error'" />
        <span>Firebase: {{ firebaseReady ? 'Prêt' : 'Non initialisé' }}</span>
      </div>

      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full" :class="authReady ? 'bg-success' : 'bg-warning'" />
        <span>Authentification: {{ authReady ? 'Disponible' : 'Non disponible' }}</span>
      </div>

      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full" :class="analyticsReady ? 'bg-success' : 'bg-warning'" />
        <span>Analytics: {{ analyticsReady ? 'Activé' : 'Désactivé' }}</span>
      </div>
    </div>

    <!-- Bouton de test Google -->
    <button
      class="btn btn-primary btn-sm w-full"
      :disabled="!firebaseReady"
      @click="testGoogleLogin"
    >
      Test Connexion Google
    </button>

    <!-- Résultat du test -->
    <div
      v-if="testResult"
      class="mt-4 p-3 rounded"
      :class="testResult.success ? 'bg-success/20' : 'bg-error/20'"
    >
      <div class="font-medium">
        {{ testResult.success ? '✅ Succès' : '❌ Erreur' }}
      </div>
      <div class="text-sm">
        {{ testResult.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  const firebaseReady = ref(false)
  const authReady = ref(false)
  const analyticsReady = ref(false)
  const testResult = ref<{ success: boolean; message: string } | null>(null)

  onMounted(async () => {
    try {
      // Essayer d'abord le plugin Firebase avec permissions
      const { $firebase } = useNuxtApp()
      let firebase = null

      if ($firebase) {
        firebase = await $firebase
      }

      // Fallback vers Firebase de base si nécessaire
      if (!firebase) {
        const { $firebaseBase } = useNuxtApp()
        if ($firebaseBase) {
          firebase = await $firebaseBase
        }
      }

      if (firebase) {
        firebaseReady.value = true
        authReady.value = !!firebase.auth
        analyticsReady.value = !!(firebase as any).analytics && (firebase as any).analyticsEnabled
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de Firebase:', error)
    }
  })

  const testGoogleLogin = async () => {
    testResult.value = null

    try {
      // Importer la fonction depuis le store utilisateur
      const { loginWithGoogle } = await import('~/stores/user/user.store')

      // Tester la connexion Google (sans réellement se connecter)
      const user = await loginWithGoogle()

      testResult.value = {
        success: true,
        message: `Connexion Google réussie pour ${user.email}`
      }
    } catch (error: any) {
      testResult.value = {
        success: false,
        message: `Erreur: ${error.message}`
      }
    }
  }
</script>
