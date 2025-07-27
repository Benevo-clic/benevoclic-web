<script setup lang="ts">
import {reactive, ref, watch, onMounted} from 'vue'
import UsersLoginForm from "~/components/header/auth/form/UsersLoginForm.vue"
import UserRegisterForm from "~/components/header/auth/form/UserRegisterForm.vue"
import {useUser} from "~/composables/auth/useUser";
import {RoleUser} from "~/common/enums/role.enum";
import {useVolunteerAuth} from "~/composables/useVolunteer";
import {useI18n} from 'vue-i18n'

const auth = useUser()
const volunteer = useVolunteerAuth()

const { t } = useI18n()

onMounted(async () => {
  await auth.initializeUser()
  await volunteer.getVolunteerInfo()
})

const loading = ref(false)
let isError = ref(false)
const associationExists = ref(false)
const messageError = ref('')
const showCookieAlert = ref(false)
const termsAccepted = ref(false)

const form = reactive({
  email: '',
  password: '',
  role: RoleUser.VOLUNTEER,
})

const { checked,isRegister } = defineProps<{
  checked: boolean,
  isRegister: boolean
}>()

async function handleLogin() {
  // Vérifier les permissions de cookies avant la connexion
  try {
    const { usePermissions } = await import('~/composables/usePermissions')
    const { hasPermission } = usePermissions()
    
    if (!hasPermission('canAuthenticate')) {
      showCookieAlert.value = true
      messageError.value = 'Vous devez accepter les cookies essentiels pour vous connecter'
      isError.value = true
      return
    }
  } catch (err) {
    console.warn('Impossible de vérifier les permissions de cookies:', err)
  }

  loading.value = true
  try {
    const response = await auth.login({
      email: form.email,
      password: form.password,
      role: isAssociation.value ? RoleUser.ASSOCIATION : RoleUser.VOLUNTEER,
    })
    if(response.idToken){
      switch(isAssociation.value){
        case true:
          break
        case false:
          const volunteerInfo = await volunteer.getVolunteerInfo()
          if (!volunteerInfo?.volunteerId) {
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
    messageError.value = t('auth.login.error.invalid_credentials')
    console.error('Erreur de connexion:', error)
  } finally {
    loading.value = false
  }
}

const openCookieSettings = () => {
  window.dispatchEvent(new CustomEvent('openCookieSettings'))
  showCookieAlert.value = false
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
    },
    { immediate: true }
)

function handleCheckboxChange() {
  emit('toggle-check', isAssociation.value)
}

function toggleRegisterMode() {
  emit('toggle-register', !isRegisterMode.value)
}

function toggleUserType() {
  isAssociation.value = !isAssociation.value
}

async function handleGoogleLogin() {
  try {
    if(isAssociation.value && !associationExists.value){
      isError.value = true
      messageError.value = t('auth.register.association_siret_status')
    }else{
      await auth.loginWithGoogle(
        isAssociation.value ? RoleUser.ASSOCIATION : RoleUser.VOLUNTEER,
        isRegisterMode.value, // Passer le mode (inscription/connexion)
        termsAccepted.value
      )
      isError.value = false
    }

  } catch (error: any) {
    console.error('Erreur de connexion Google:', error)
    isError.value = true
    messageError.value = error?.message || t('auth.login.error.invalid_credentials')
  }
}

function toggleVerifyEmail(value: boolean) {

  if(value){
    navigateTo(
        {
          path: '/auth/VerifyEmailPage',
        }
    )
  }
  isError.value = false
}

function verifyAssociation(value:boolean) {
  associationExists.value = value
  isError.value = false
}


const forgotPasswordEmail = ref('')
const forgotPasswordSent = ref(false)
const forgotPasswordError = ref('')

async function handleForgotPassword(email: string) {
  forgotPasswordError.value = ''
  forgotPasswordSent.value = false
  forgotPasswordEmail.value = email || form.email
  if (!forgotPasswordEmail.value) {
    forgotPasswordError.value = t('auth.forgot_password_enter_email')
    return
  }
  try {
    await auth.forgotPassword(forgotPasswordEmail.value)
    forgotPasswordSent.value = true
  } catch (e: any) {
    forgotPasswordError.value = t('auth.forgot_password_error')
  }
}

</script>

<template>
  <div class="w-full max-w-md" >
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

    <!-- Alerte pour les cookies essentiels -->
    <div role="alert" class="alert alert-warning mb-4" v-if="showCookieAlert">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <div>
        <h4 class="font-bold">Cookies essentiels requis</h4>
        <p class="text-sm">Vous devez accepter les cookies essentiels pour vous connecter.</p>
        <button @click="openCookieSettings" class="btn btn-primary btn-xs mt-2">
          Paramétrer les cookies
        </button>
      </div>
    </div>

    <div role="alert" class="alert alert-error mb-4" v-if="isError && !showCookieAlert">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{messageError}}
    </div>

    <div role="alert" class="alert alert-success mb-4" v-if="associationExists">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{t('auth.register.association_siret_success')}}</span>
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
        :is-association="isAssociation"
        @association-exists="verifyAssociation"
        @forgot-password="handleForgotPassword"
    />

    <UserRegisterForm
        v-if="isRegisterMode"
        :form="form"
        :is-association="isAssociation"
        @email-verified="toggleVerifyEmail"
        @association-exists="verifyAssociation"
    />

    <!-- Divider -->
    <div class="divider">{{t('auth.or')}}</div>

    <!-- Case à cocher pour les conditions générales (visible uniquement en mode inscription) -->
    <div class="form-control mb-4" v-if="isRegisterMode">
      <label class="label cursor-pointer justify-start gap-3">
        <input 
          type="checkbox" 
          v-model="termsAccepted"
          class="checkbox checkbox-primary checkbox-sm" 
        />
        <span class="label-text text-sm">
          J'accepte les 
          <a href="/mentions-legales" target="_blank" class="text-primary hover:underline">
            conditions générales d'utilisation
          </a> 
          et la 
          <a href="/confidentialite" target="_blank" class="text-primary hover:underline">
            politique de confidentialité
          </a>
        </span>
      </label>
    </div>

    <!-- Login with Google -->
    <button 
      type="button" 
      class="btn btn-outline w-full flex items-center justify-center" 
      @click="handleGoogleLogin"
      :disabled="isRegisterMode && !termsAccepted"
    >
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

    <!-- Message de confirmation ou d'erreur -->
    <div v-if="forgotPasswordSent" class="alert alert-success mt-2">
      {{ t('auth.forgot_password_sent') }}
    </div>
    <div v-if="forgotPasswordError" class="alert alert-error mt-2">
      {{ forgotPasswordError }}
    </div>

    <p class="text-center text-xs text-gray-400 mt-6">
      © 2024 TOUS DROITS RÉSERVÉS
    </p>
  </div>

</template>

<style scoped>

</style>