<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import {RoleUser} from "~/common/enums/role.enum";
import { useRegisterStore } from '~/stores/user/register.store';

const loading = ref(false)
const form = reactive({
  email: '',
  password: '',
  role: '' as RoleUser
})
definePageMeta({
  middleware: ['guest'], // Solution temporaire pour le typage
  layout:'header'
})

const registerStore = useRegisterStore();

// Nettoyer l'observateur lors de la destruction du composant
onUnmounted(() => {
  registerStore.cleanup();
});


</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
      <h2 class="text-center text-3xl font-bold">Create account</h2>

      <form @submit.prevent="" class="mt-8 space-y-6">
        <div class="space-y-4">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
                v-model="form.email"
                type="email"
                required
                class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300"
                placeholder="Email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Mot de passe</label>
            <input
                v-model="form.password"
                type="password"
                required
                class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300"
                placeholder="Mot de passe"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Confirmer votre mot de passe</label>
            <input
                v-model="form.password"
                type="password"
                required
                class="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300"
                placeholder="Mot de passe"
            />
          </div>
        </div>

        <div>
          <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>

</style>