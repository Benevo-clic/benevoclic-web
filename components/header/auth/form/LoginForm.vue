<script setup lang="ts">
import { ref, watch } from 'vue'
import VolunteerLoginForm from "~/components/header/auth/form/login/VolunteerLoginForm.vue"
import AssociationLoginForm from "~/components/header/auth/form/login/AssociationLoginForm.vue"
import VolunteerRegisterForm from "~/components/header/auth/form/register/VolunteerRegisterForm.vue"
import AssociationRegisterForm from "~/components/header/auth/form/register/AssociationRegisterForm.vue"

const { form, loading, checked, handleLogin, handleGoogleLogin } = defineProps<{
  form: Record<string, any>
  loading: boolean
  checked: boolean
  handleLogin: () => Promise<void>
  handleGoogleLogin: () => Promise<void>
}>()

const emit = defineEmits<{
  (e: 'toggle-check', isChecked: boolean): void;
  (e: 'toggle-register', isRegisterMode: boolean): void;
}>()

const isAssociation = ref(false)
const isRegisterMode = ref(false)

watch(() => checked, (value) => {
  isAssociation.value = value
})

function handleCheckboxChange() {
  emit('toggle-check', isAssociation.value)
}


function toggleRegisterMode() {
  isRegisterMode.value = !isRegisterMode.value
  emit('toggle-register', isRegisterMode.value)

}

function toggleUserType() {
  isAssociation.value = !isAssociation.value
}


</script>

<template>
  <div class="w-full max-w-md">
    <h1 class="text-3xl font-bold mb-2">
      Content de <br />
      <span class="text-primary">vous revoir 👋</span>
    </h1>

    <p class="text-base text-gray-600 mb-6">
      Aujourd’hui est un nouveau jour. C’est vous qui lui donnez sa forme.
      Connectez-vous pour gérer vos projets.
    </p>

    <!-- Texte + switch utilisateur -->
    <h4 class="text-primary font-bold">
      Je <span v-if="isAssociation">suis</span><span v-else>ne suis pas</span> une association
    </h4>
    <input
        type="checkbox"
        v-model="isAssociation"
        @change="handleCheckboxChange"
        class="toggle border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400"
    />

    <!-- Forms dynamiques -->
    <VolunteerLoginForm
        v-if="!isAssociation && !isRegisterMode"
        :form="form"
        :handle-login="handleLogin"
        :loading="loading"
    />

    <VolunteerRegisterForm
        v-if="!isAssociation && isRegisterMode"
        :form="form"
    />

    <AssociationLoginForm
        v-if="isAssociation && !isRegisterMode"
        :form="form"
        :handle-login="handleLogin"
        :loading="loading"
    />

    <AssociationRegisterForm
        v-if="isAssociation && isRegisterMode"
        :form="form"
    />

    <!-- Divider -->
    <div class="divider">ou</div>

    <!-- Login with Google -->
    <button type="button" class="btn btn-outline w-full flex items-center justify-center" @click="handleGoogleLogin">
      <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          class="w-5 h-5 mr-2"
          alt="Google"
      />
      Se connecter avec Google
    </button>

    <!-- Switch vers inscription / connexion -->
    <p class="text-center text-sm text-gray-600 mt-4">
      <span v-if="isRegisterMode">Déjà inscrit ?</span>
      <span v-else>Vous n’avez pas de compte ?</span>
      <button class="text-primary hover:underline" @click="toggleRegisterMode">
        {{ isRegisterMode ? 'Se connecter' : 'Inscrivez-vous' }}
      </button>
    </p>

    <!-- Version mobile -->
    <div class="text-center mt-8 md:hidden">
      <h1 class="text-xl sm:text-2xl font-bold mb-2">
        Vous <span v-if="!isAssociation">n'</span>êtes <span v-if="!isAssociation">pas</span> une association ?
      </h1>
      <button
          @click="toggleUserType"
          class="text-base sm:text-lg text-primary hover:underline mt-1"
      >
        {{ isRegisterMode ? 'Passer au compte volontaire' : 'Se connecter en tant qu\'association' }}
      </button>
    </div>

    <p class="text-center text-xs text-gray-400 mt-6">
      © 2024 TOUS DROITS RÉSERVÉS
    </p>
  </div>
</template>

<style scoped>

</style>