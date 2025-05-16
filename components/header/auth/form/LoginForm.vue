<script setup lang="ts">
import {reactive, ref, watch} from 'vue'
import UsersLoginForm from "~/components/header/auth/form/UsersLoginForm.vue"
import UserRegisterForm from "~/components/header/auth/form/UserRegisterForm.vue"
import {ShieldX} from "lucide-vue-next";
import {useUser} from "~/composables/auth/useUser";
import {RoleUser} from "~/common/enums/role.enum";
import VerifEmailForm from "~/components/header/auth/form/VerifEmailForm.vue";
import {useVolunteerAuth} from "~/composables/auth/volunteerAuth";

const auth = useUser()
const volunteer = useVolunteerAuth()

const {t} = useI18n()


const loading = ref(false)
let isError = ref(false)
const verifyEmail = ref(false)

const form = reactive({
  email: '',
  password: ''
})

const { checked,isRegister } = defineProps<{
  checked: boolean,
  isRegister: boolean
}>()

async function handleLogin() {
  loading.value = true
  try {
    const response = await auth.login(form)
    if(response.idToken){
      switch(isAssociation.value){
        case true:
          break
        case false:
          const volunteerInfo = await volunteer.getVolunteerInfo()
          if (!volunteerInfo.volunteerId) {
            navigateTo(
                {
                  path: '/auth/registerVolunteer',
                }
            )
          }
          break

      }
    }

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
const isRegisterMode = ref(isRegister)

watch(() => checked, (value) => {
  isAssociation.value = value
})

watch(
    () => isRegister,
    (newVal) => {
      isRegisterMode.value = newVal
      console.log('watch triggered:', isRegisterMode.value)
    },
    { immediate: true }
)


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

    await auth.loginWithGoogle(isAssociation.value ? RoleUser.ASSOCIATION : RoleUser.VOLUNTEER)
  } catch (error) {
    console.error('Erreur de connexion Google:', error)
  }
}

function toggleVerifyEmail(value: boolean) {
  verifyEmail.value = value
}

</script>

<template>
  <div class="w-full max-w-md" v-if="!verifyEmail">
    <h1 class="text-3xl font-bold mb-2">
      {{t('auth.title')}} <br />
      <span class="text-primary">{{t('auth.title_2')}} 👋</span>
    </h1>

    <p class="text-base text-gray-600 mb-6" v-if="!isRegisterMode">
      {{t('auth.login.description')}}
    </p>
    <p class="text-base text-gray-600 mb-6" v-else>
      {{t('auth.register.description')}}
    </p>

    <div class="alert alert-error flex items-center gap-4 mb-4 shadow-md border border-red-200 rounded-lg px-4 py-3 w-full" v-if="isError">
      <ShieldX class="w-6 h-6 sm:w-8 sm:h-8 md:w-8 md:h-8 text-red-600" />
      <p class="text-sm text-red-900 font-semibold">
        {{t('auth.login.error.invalid_credentials')}}
      </p>
    </div>

    <!-- Texte + switch utilisateur -->
    <h4 class="text-primary font-bold" >
      {{ t(isAssociation ? 'auth.register.association_status_true' : 'auth.register.association_status_false') }}
    </h4>
    <input
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

    <UserRegisterForm
        v-if="isRegisterMode"
        :form="form"
        :is-association="isAssociation"
        @email-verified="toggleVerifyEmail"
    />

    <!-- Divider -->
    <div class="divider">{{t('auth.or')}}</div>

    <!-- Login with Google -->
    <button type="button" class="btn btn-outline w-full flex items-center justify-center" @click="handleGoogleLogin">
      <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          class="w-5 h-5 mr-2"
          alt="Google"
      />
      {{t('auth.login.login_with_google')}}
    </button>

    <!-- Switch vers inscription / connexion -->
    <p class="text-center text-sm text-gray-600 mt-4">
      <span v-if="isRegisterMode">{{t('auth.register.already_have_account')}}</span>
      <span v-else>{{t('auth.login.no_account')}} </span>
      <button class="text-primary hover:underline" @click="toggleRegisterMode">
        {{ isRegisterMode ? t('auth.login.title') : t('auth.login.register') }}
      </button>
    </p>

    <!-- Version mobile -->
    <div class="text-center mt-8 md:hidden" v-if="isRegisterMode">
      <h1 class="text-xl sm:text-2xl font-bold mb-2">
        {{ t(isAssociation ? 'auth.register.association_true' : 'auth.register.association_false') }}
      </h1>

      <button
          @click="toggleUserType"
          class="text-base sm:text-lg text-primary hover:underline mt-1"
          v-if="isAssociation"
      >
        {{t('auth.register.association_register')}}
      </button>
      <button
          @click="toggleUserType"
          class="text-base sm:text-lg  mt-1"
          v-if="!isAssociation"
      >
        {{t('auth.register.click_here')}} <span class="text-primary hover:underline"> {{t('auth.register.info_click_here')}}
      </span>
      </button>
    </div>

    <p class="text-center text-xs text-gray-400 mt-6">
      © 2024 TOUS DROITS RÉSERVÉS
    </p>
  </div>
  <VerifEmailForm v-if="verifyEmail" />

</template>

<style scoped>

</style>