<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuth } from '~/composables/auth/useAuth'
const auth = useAuth()
const loading = ref(false)
const form = reactive({
  email: '',
  password: ''
})
const isAssociation = ref(false)
const isRegister = ref(false)

function toggleCheck() {
  isAssociation.value = !isAssociation.value
}

definePageMeta({
  middleware: ['guest'], //,
})

async function handleLogin() {
  loading.value = true
  try {
    await auth.login(form)
  } catch (error) {
    console.error('Erreur de connexion:', error)
  } finally {
    loading.value = false
  }
}

async function handleGoogleLogin() {
  console.log('handleGoogleLogin')
  try {
    await auth.loginWithGoogle()
  } catch (error) {
    console.error('Erreur de connexion Google:', error)
  }
}

function handleCheckboxChange(value: boolean) {
  isAssociation.value = value
}
function handleRegisterChange(value: boolean) {
  isRegister.value = value
}


</script>


<template>
  <div class="min-h-[85vh] flex flex-col md:flex-row items-center justify-center gap-8 px-4">
    <!-- Formulaire en premier sur mobile -->

    <HeaderAuthFormLoginForm
        :form="form"
        :loading="loading"
        :handle-login="handleLogin"
        :handle-google-login="handleGoogleLogin"
        @toggle-check="handleCheckboxChange"
        :checked="isAssociation"
        @toggle-register="handleRegisterChange"
    />

    <!-- Image + lien association (desktop uniquement) -->
    <div class="hidden md:flex flex-col justify-center items-center w-1/2">
      <img
          src="/images/illustration-login-association.png"
          alt="Illustration"
          class="w-full max-w-xl mx-auto"
          v-if="!isAssociation"
      />
      <img
          src="/images/illustration-login-volunteer.png"
          alt="Illustration"
          class="w-full max-w-xl mx-auto"
          v-if="isAssociation"
      />
      <h1 class="text-xl sm:text-2xl font-bold mb-2">
        Vous <span v-if="!isAssociation">n'</span> êtes <span v-if="!isAssociation">pas</span> une association ?
      </h1>
      <button
          @click="toggleCheck"
          class="text-base sm:text-lg text-primary hover:underline mt-1"
          v-if="isAssociation"
      >
        {{ !isRegister ? 'Se connecter' : 'Inscrivez-vous' }}
        en tant qu'association
      </button>
      <button
          @click="toggleCheck"
          class="text-base sm:text-lg font-bold  mt-1"
          v-if="!isAssociation"
      >
        Cliquer <span class="text-primary hover:underline">ici pour vous {{ !isRegister ? 'connecter' : 'inscrire' }}
      </span>
      </button>

    </div>
  </div>
</template>



<style scoped lang="scss">

</style>