<script setup lang="ts">
  import { reactive, ref, watch, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'
  import UsersLoginForm from '~/components/header/auth/form/UsersLoginForm.vue'
  import UserRegisterForm from '~/components/header/auth/form/UserRegisterForm.vue'
  import { useUser } from '~/composables/auth/useUser'
  import { RoleUser } from '~/common/enums/role.enum'
  import { useVolunteerAuth } from '~/composables/useVolunteer'

  const auth = useUser()
  const volunteer = useVolunteerAuth()

  const { t } = useI18n()

  onMounted(async () => {
    await auth.initializeUser()
    await volunteer.getVolunteerInfo()
  })

  const loading = ref(false)
  const isError = ref(false)
  const associationExists = ref(false)
  const messageError = ref('')
  const showCookieAlert = ref(false)
  const termsAccepted = ref(false)

  const form = reactive({
    email: '',
    password: '',
    role: RoleUser.VOLUNTEER
  })

  const { checked, isRegister } = defineProps<{
    checked: boolean
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
      process.env.NODE_ENV !== 'production' &&
        console.warn('Impossible de vérifier les permissions de cookies:', err)
    }

    loading.value = true
    try {
      const response = await auth.login({
        email: form.email,
        password: form.password,
        role: isAssociation.value ? RoleUser.ASSOCIATION : RoleUser.VOLUNTEER
      })
      if (response.idToken) {
        switch (isAssociation.value) {
          case true:
            break
          case false:
            const volunteerInfo = await volunteer.getVolunteerInfo()
            if (!volunteerInfo?.volunteerId) {
              navigateTo({
                path: '/auth/registerVolunteer'
              })
            }
            break
        }
      }

      isError.value = false
    } catch (error) {
      isError.value = true
      messageError.value = t('auth.login.error.invalid_credentials')
      process.env.NODE_ENV !== 'production' && console.error('Erreur de connexion:', error)
    } finally {
      loading.value = false
    }
  }

  const openCookieSettings = () => {
    window.dispatchEvent(new CustomEvent('openCookieSettings'))
    showCookieAlert.value = false
  }

  const emit = defineEmits<{
    (e: 'toggle-check', isChecked: boolean): void
    (e: 'toggle-register', isRegisterMode: boolean): void
  }>()

  const isAssociation = ref(false)
  const isRegisterMode = ref(isRegister)

  watch(
    () => checked,
    value => {
      isAssociation.value = value
    }
  )

  watch(
    () => isRegister,
    newVal => {
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
      if (isAssociation.value && !associationExists.value) {
        isError.value = true
        messageError.value = t('auth.register.association_siret_status')
      } else {
        await auth.loginWithGoogle(
          isAssociation.value ? RoleUser.ASSOCIATION : RoleUser.VOLUNTEER,
          isRegisterMode.value,
          termsAccepted.value
        )
        isError.value = false
      }
    } catch (error: any) {
      process.env.NODE_ENV !== 'production' && console.error('Erreur de connexion Google:', error)
      isError.value = true
      messageError.value = error?.message || t('auth.login.error.invalid_credentials')
    }
  }

  function toggleVerifyEmail(value: boolean) {
    if (value) {
      navigateTo({
        path: '/auth/VerifyEmailPage'
      })
    }
    isError.value = false
  }

  function verifyAssociation(value: boolean) {
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
  <div class="w-full max-w-md" role="main" aria-labelledby="login-title">
    <h1 id="login-title" class="text-3xl font-bold mb-2">
      {{ t('auth.title') }} <br />
      <span class="text-primary">{{ t('auth.title_2') }} 👋</span>
    </h1>

    <p v-if="!isRegisterMode" id="login-description" class="text-base text-gray-600 mb-6">
      {{ t('auth.login.description') }}
    </p>
    <p v-else id="register-description" class="text-base text-gray-600 mb-6">
      {{ t('auth.register.description') }}
    </p>

    <!-- Alerte pour les cookies essentiels -->
    <div
      v-if="showCookieAlert"
      role="alert"
      class="alert alert-warning mb-4"
      aria-live="polite"
      aria-atomic="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
      <div>
        <h4 class="font-bold">Cookies essentiels requis</h4>
        <p class="text-sm">Vous devez accepter les cookies essentiels pour vous connecter.</p>
        <button
          class="btn btn-primary btn-xs mt-2 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
          type="button"
          aria-label="Ouvrir les paramètres de cookies"
          @click="openCookieSettings"
        >
          Paramétrer les cookies
        </button>
      </div>
    </div>

    <div
      v-if="isError && !showCookieAlert"
      role="alert"
      class="alert alert-error mb-4"
      aria-live="polite"
      aria-atomic="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ messageError }}</span>
    </div>

    <div
      v-if="associationExists"
      role="alert"
      class="alert alert-success mb-4"
      aria-live="polite"
      aria-atomic="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ t('auth.login.siret.success') }}</span>
    </div>

    <!-- Texte + switch utilisateur -->
    <fieldset class="mb-4">
      <legend class="text-primary font-bold mb-2">
        {{
          t(
            isAssociation
              ? 'auth.register.association_status_true'
              : 'auth.register.association_status_false'
          )
        }}
      </legend>
      <label class="flex items-center gap-3 cursor-pointer">
        <input
          v-model="isAssociation"
          type="checkbox"
          class="toggle border-indigo-600 bg-indigo-500 checked:border-orange-500 checked:bg-orange-400 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
          :aria-label="
            isAssociation ? 'Basculer vers mode bénévole' : 'Basculer vers mode association'
          "
          @change="handleCheckboxChange"
        />
        <span class="text-sm">
          {{ isAssociation ? 'Mode Association' : 'Mode Bénévole' }}
        </span>
      </label>
    </fieldset>

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
    <div class="divider" role="separator" aria-label="Ou">
      {{ t('auth.or') }}
    </div>

    <!-- Case à cocher pour les conditions générales (visible uniquement en mode inscription) -->
    <div v-if="isRegisterMode" class="form-control mb-4">
      <label class="label cursor-pointer justify-start gap-3">
        <input
          v-model="termsAccepted"
          type="checkbox"
          class="checkbox checkbox-primary checkbox-sm focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
          :aria-describedby="isRegisterMode ? 'terms-description' : undefined"
        />
        <span class="label-text text-sm">
          J'accepte les
          <a
            href="/mentions-legales"
            target="_blank"
            class="text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Ouvrir les conditions générales d'utilisation dans un nouvel onglet"
          >
            conditions générales d'utilisation
          </a>
          et la
          <a
            href="/confidentialite"
            target="_blank"
            class="text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Ouvrir la politique de confidentialité dans un nouvel onglet"
          >
            politique de confidentialité
          </a>
        </span>
      </label>
      <div id="terms-description" class="text-xs text-gray-500 mt-1">
        Vous devez accepter les conditions pour continuer
      </div>
    </div>

    <!-- Login with Google -->
    <button
      type="button"
      class="btn btn-outline w-full flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
      :disabled="isRegisterMode && !termsAccepted"
      :aria-describedby="isRegisterMode && !termsAccepted ? 'google-disabled-reason' : undefined"
      @click="handleGoogleLogin"
    >
      <img
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        class="w-5 h-5 mr-2"
        alt="Logo Google"
        aria-hidden="true"
      />
      {{ t('auth.login.login_with_google') }}
    </button>
    <div v-if="isRegisterMode && !termsAccepted" id="google-disabled-reason" class="sr-only">
      Vous devez accepter les conditions générales pour vous connecter avec Google
    </div>

    <!-- Switch vers inscription / connexion -->
    <p class="text-center text-sm text-gray-600 mt-4">
      <span v-if="isRegisterMode">{{ t('auth.register.already_have_account') }}</span>
      <span v-else>{{ t('auth.login.no_account') }} </span>
      <button
        class="text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
        type="button"
        :aria-label="isRegisterMode ? 'Basculer vers la connexion' : 'Basculer vers l\'inscription'"
        @click="toggleRegisterMode"
      >
        {{ isRegisterMode ? t('auth.login.title') : t('auth.login.register') }}
      </button>
    </p>

    <!-- Version mobile -->
    <div v-if="isRegisterMode" class="text-center mt-8 md:hidden">
      <h2 class="text-xl sm:text-2xl font-bold mb-2">
        {{
          t(isAssociation ? 'auth.register.association_true' : 'auth.register.association_false')
        }}
      </h2>

      <button
        v-if="isAssociation"
        class="text-base sm:text-lg text-primary hover:underline mt-1 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
        type="button"
        :aria-label="'Basculer vers ' + t('auth.register.association_register')"
        @click="toggleUserType"
      >
        {{ t('auth.register.association_register') }}
      </button>
      <button
        v-if="!isAssociation"
        class="text-base sm:text-lg mt-1 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
        type="button"
        :aria-label="'Basculer vers mode association'"
        @click="toggleUserType"
      >
        {{ t('auth.register.click_here') }}
        <span class="text-primary hover:underline">
          {{ t('auth.register.info_click_here') }}
        </span>
      </button>
    </div>

    <!-- Message de confirmation ou d'erreur -->
    <div
      v-if="forgotPasswordSent"
      class="alert alert-success mt-2"
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ t('auth.forgot_password_sent') }}
    </div>
    <div
      v-if="forgotPasswordError"
      class="alert alert-error mt-2"
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ forgotPasswordError }}
    </div>

    <p class="text-center text-xs text-gray-400 mt-6">© 2024 TOUS DROITS RÉSERVÉS</p>
  </div>
</template>

<style scoped></style>
