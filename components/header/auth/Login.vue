<script setup lang="ts">
import { ref } from 'vue'


const isAssociation = ref(false)
const isRegister = ref(false)

function toggleCheck() {
  isAssociation.value = !isAssociation.value
}

definePageMeta({
  middleware: ['guest'],
})


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
        @toggle-check="handleCheckboxChange"
        :checked="isAssociation"
        @toggle-register="handleRegisterChange"
    />

    <!-- Image + lien association (desktop uniquement) -->
    <div class="hidden md:flex flex-col justify-center items-center w-1/2">
      <img
          src="/images/login-user.png"
          alt="Illustration"
          class="w-full max-w-xl mx-auto"
          v-if="!isRegister"
      />
      <img
          src="/images/illustration-login-association.png"
          alt="Illustration"
          class="w-full max-w-xl mx-auto"
          v-if="!isAssociation && isRegister"
      />
      <img
          src="/images/illustration-login-volunteer.png"
          alt="Illustration"
          class="w-full max-w-xl mx-auto"
          v-if="isAssociation && isRegister"
      />
      <h1 class="text-xl sm:text-2xl font-bold mb-2" v-if="isRegister">
        Vous <span v-if="!isAssociation">n'</span> êtes <span v-if="!isAssociation">pas</span> une association ?
      </h1>
      <button
          @click="toggleCheck"
          class="text-base sm:text-lg text-primary hover:underline mt-1"
          v-if="isAssociation && isRegister"
      >
        {{ !isRegister ? 'Se connecter' : 'Inscrivez-vous' }}
        en tant qu'association
      </button>
      <button
          @click="toggleCheck"
          class="text-base sm:text-lg font-bold  mt-1"
          v-if="!isAssociation && isRegister"
      >
        Cliquer <span class="text-primary hover:underline">ici pour vous {{ !isRegister ? 'connecter' : 'inscrire' }}
      </span>
      </button>

    </div>
  </div>
</template>



<style scoped lang="scss">

</style>