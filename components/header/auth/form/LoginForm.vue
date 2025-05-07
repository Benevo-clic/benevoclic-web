<script setup lang="ts">
import {reactive, ref, watch} from 'vue'
import UsersLoginForm from "~/components/header/auth/form/login/UsersLoginForm.vue"
import VolunteerRegisterForm from "~/components/header/auth/form/register/VolunteerRegisterForm.vue"
import AssociationRegisterForm from "~/components/header/auth/form/register/AssociationRegisterForm.vue"
import {ShieldX} from "lucide-vue-next";
import {useAuth} from "~/composables/auth/useAuth";
const auth = useAuth()


const loading = ref(false)
let isError = ref(false)

const form = reactive({
  email: '',
  password: ''
})

const { checked } = defineProps<{
  checked: boolean
}>()

async function handleLogin() {
  loading.value = true
  try {
    const res = await auth.login(form)
    isError.value = false
  } catch (error) {
    isError.value = true
    console.error('Erreur de connexion:', error)
  } finally {
    loading.value = false
  }
}

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

async function handleGoogleLogin() {
  try {
    await auth.loginWithGoogle()
  } catch (error) {
    console.error('Erreur de connexion Google:', error)
  }
}

</script>

<template>
  <div class="w-full max-w-md">
    <h1 class="text-3xl font-bold mb-2">
      Content de <br />
      <span class="text-primary">vous revoir 👋</span>
    </h1>

    <p class="text-base text-gray-600 mb-6" v-if="!isRegisterMode">
      Aujourd’hui est un nouveau jour. C’est vous qui lui donnez sa forme. Connectez-vous pour gérer vos projets.
    </p>
    <p class="text-base text-gray-600 mb-6" v-else>
      Inscrivez-vous gratuitement pour rejoindre la communauté et agir pour des causes qui vous tiennent à cœur.
    </p>

    <div class="alert alert-error flex items-center gap-4 mb-4 shadow-md border border-red-200 rounded-lg px-4 py-3 w-full" v-if="isError">
      <ShieldX class="w-6 h-6 sm:w-8 sm:h-8 md:w-8 md:h-8 text-red-600" />
      <p class="text-sm text-red-900 font-semibold">
        Votre adresse e-mail ou votre mot de passe est incorrect.
      </p>
    </div>



    <!-- Texte + switch utilisateur -->
    <h4 class="text-primary font-bold" v-if="isRegisterMode">
      Je <span v-if="!isAssociation">suis</span><span v-else>ne suis pas</span> une association
    </h4>
    <input
        v-if="isRegisterMode"
        type="checkbox"
        v-model="isAssociation"
        @change="handleCheckboxChange"
        class="toggle border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400"
    />

    <!-- Forms dynamiques -->
    <UsersLoginForm
        v-if="!isRegisterMode"
        :form="form"
        :handle-login="handleLogin"
        :loading="loading"
    />

    <VolunteerRegisterForm
        v-if="!isAssociation && isRegisterMode"
        :form="form"
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
      <span v-if="isRegisterMode">Déjà inscrit ? </span>
      <span v-else>Vous n’avez pas de compte ? </span>
      <button class="text-primary hover:underline" @click="toggleRegisterMode">
        {{ isRegisterMode ? 'Se connecter' : 'Inscrivez-vous' }}
      </button>
    </p>

    <!-- Version mobile -->
    <div class="text-center mt-8 md:hidden" v-if="isRegisterMode">
      <h1 class="text-xl sm:text-2xl font-bold mb-2">
        Vous <span v-if="!isAssociation">n'</span>êtes <span v-if="!isAssociation">pas</span> une association ?
      </h1>

      <button
          @click="toggleUserType"
          class="text-base sm:text-lg text-primary hover:underline mt-1"
          v-if="isAssociation"
      >
        {{ !isRegisterMode ? 'Se connecter' : 'Inscrivez-vous' }}
        en tant qu'association
      </button>
      <button
          @click="toggleUserType"
          class="text-base sm:text-lg  mt-1"
          v-if="!isAssociation"
      >
        Cliquer <span class="text-primary hover:underline">ici pour vous {{ !isRegisterMode ? 'connecter' : 'inscrire' }}
      </span>
      </button>
    </div>

    <p class="text-center text-xs text-gray-400 mt-6">
      © 2024 TOUS DROITS RÉSERVÉS
    </p>
  </div>
</template>

<style scoped>

</style>