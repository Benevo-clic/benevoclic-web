<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-base-200 py-8"
  >
    <div class="w-full max-w-2xl mx-auto px-2 p-6">
      <h1 class="text-3xl font-bold mb-8 text-center text-base-content">
        {{ t("drawer-content.account.edit_profile") }}
      </h1>

      <!-- Alert messages -->
      <div
        v-if="alertStatus === 'success'"
        role="alert"
        class="alert alert-success mb-4 shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{{ alertMessage }}</span>
        <button class="btn btn-sm btn-ghost" @click="alertStatus = null">
          ×
        </button>
      </div>
      <div
        v-if="alertStatus === 'error'"
        role="alert"
        class="alert alert-error mb-4 shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{{ alertMessage }}</span>
        <button class="btn btn-sm btn-ghost" @click="alertStatus = null">
          ×
        </button>
      </div>

      <!-- Avatar/logo -->
      <div class="flex flex-col items-center mb-8">
        <div
          class="w-32 h-32 rounded-full overflow-hidden bg-base-300 relative group mb-2 shadow-lg border-4 border-base-200"
        >
          <img
            v-if="profileImageUrl"
            :src="profileImageUrl"
            alt="Photo de profil"
            class="w-full h-full object-cover"
            width="200"
            height="200"
            loading="lazy"
            decoding="async"
          >
          <div v-else class="w-full h-full flex items-center justify-center">
            <UserRound class="w-16 h-16 text-base-content opacity-50" />
          </div>
          <div
            class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <label
              for="profile-image"
              class="cursor-pointer text-white text-sm font-medium flex flex-col items-center"
            >
              <Upload class="w-6 h-6 mx-auto mb-1" />
              Changer
            </label>
            <input
              id="profile-image"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleImageChange"
            >
          </div>
        </div>
        <span class="text-base-content/70 text-sm">Photo de profil</span>
      </div>

      <form class="space-y-6" @submit.prevent="saveProfile">
        <!-- Infos personnelles -->
        <div
          class="bg-base-100 rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base-content">{{
                t("auth.volunteer.first_name")
              }}</span>
            </label>
            <input
              v-model="form.firstName"
              type="text"
              class="input input-bordered w-full"
              aria-label="Champ de saisie"
            >
          </div>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base-content">{{
                t("auth.volunteer.name")
              }}</span>
            </label>
            <input
              v-model="form.lastName"
              type="text"
              class="input input-bordered w-full"
              aria-label="Champ de saisie"
            >
          </div>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base-content">{{
                t("auth.volunteer.birthdate")
              }}</span>
            </label>
            <input
              v-model="form.birthDate"
              type="date"
              class="input input-bordered w-full"
              aria-label="Champ de saisie"
            >
          </div>
        </div>

        <!-- Contact -->
        <div
          class="bg-base-100 rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base-content">{{
                t("auth.volunteer.phone")
              }}</span>
            </label>
            <input
              v-model="form.phone"
              type="tel"
              class="input input-bordered w-full"
              aria-label="Champ de saisie"
            >
          </div>
        </div>

        <!-- Localisation -->
        <div
          class="bg-base-100 rounded-xl shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base-content">{{
                t("auth.volunteer.city")
              }}</span>
            </label>
            <input
              v-model="form.city"
              type="text"
              class="input input-bordered w-full"
              aria-label="Champ de saisie"
            >
          </div>
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base-content">{{
                t("auth.volunteer.postal_code")
              }}</span>
            </label>
            <input
              v-model="form.postalCode"
              type="text"
              class="input input-bordered w-full"
              aria-label="Champ de saisie"
            >
          </div>
        </div>

        <!-- Bio -->
        <div class="bg-base-100 rounded-xl shadow p-6">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text text-base-content">{{
                t("auth.volunteer.bio")
              }}</span>
            </label>
            <textarea
              v-model="form.bio"
              class="textarea textarea-bordered h-24 w-full"
              aria-label="Zone de texte"
            />
          </div>
        </div>

        <!-- Submit button -->
        <div class="flex justify-end">
          <button
            type="submit"
            class="btn btn-primary btn-wide"
            :disabled="!isFormChanged"
          >
            <span
              v-if="isImageUploading"
              class="loading loading-spinner loading-xs mr-2"
            />
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
    <ErrorPopup
      :show-error-modal="showErrorModal"
      :error-type="errorType"
      @reload="handleReload"
      @go-home="handleGoHome"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Upload, UserRound } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { isEqual } from 'lodash'
import { useUser } from '~/composables/auth/useUser'
import { useVolunteerAuth } from '~/composables/useVolunteer'
import ErrorPopup from '~/components/utils/ErrorPopup.vue'
import { useNavigation } from '~/composables/useNavigation'

const { t } = useI18n()

definePageMeta({
  middleware: ['auth'],
  layout: 'app'
})

const auth = useUser()
const volunteerAuth = useVolunteerAuth()
const { navigateToRoute } = useNavigation()

onMounted(async () => {
  await initData()
  initForm()
})

const form = ref({
  firstName: '',
  lastName: '',
  phone: '',
  birthDate: '',
  city: '',
  postalCode: '',
  bio: ''
})

const initialForm = ref({
  firstName: '',
  lastName: '',
  phone: '',
  birthDate: '',
  city: '',
  postalCode: '',
  bio: ''
})

const alertStatus = ref<'success' | 'error' | null>(null)
const alertMessage = ref('')
const isImageUploading = ref(false)
const showErrorModal = ref(false)
const errorType = ref<'4xx' | '5xx' | null>(null)

const profileImageUrl = computed(() => {
  return auth.user.value?.avatarFileKey
})

const isFormChanged = computed(() => {
  return !isEqual(form.value, initialForm.value)
})

async function initData () {
  try {
    if (!auth.user.value) {
      await auth.initializeUser()
    }
    if (!volunteerAuth.volunteer.value) {
      await volunteerAuth.getVolunteerInfo()
    }
  } catch (error) {
    handleError(error)
  }
}

function initForm () {
  if (volunteerAuth.volunteer.value) {
    const firstName = volunteerAuth.volunteer.value.firstName || ''
    const lastName = volunteerAuth.volunteer.value.lastName || ''
    const phone = volunteerAuth.volunteer.value.phone || ''
    const birthDate = volunteerAuth.volunteer.value.birthDate || ''
    const city = volunteerAuth.volunteer.value.city || ''
    const postalCode = volunteerAuth.volunteer.value.postalCode || ''
    const bio = volunteerAuth.volunteer.value.bio || ''

    // Update form
    form.value.firstName = firstName
    form.value.lastName = lastName
    form.value.phone = phone
    form.value.birthDate = birthDate
    form.value.city = city
    form.value.postalCode = postalCode
    form.value.bio = bio

    // Update initialForm
    initialForm.value.firstName = firstName
    initialForm.value.lastName = lastName
    initialForm.value.phone = phone
    initialForm.value.birthDate = birthDate
    initialForm.value.city = city
    initialForm.value.postalCode = postalCode
    initialForm.value.bio = bio
  }
}

function handleReload () {
  window.location.reload()
}
async function handleGoHome () {
  await navigateToRoute('/')
}

function handleImageChange (event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    // Set loading state
    isImageUploading.value = true

    // Convert image to base64
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        await auth.updateAvatar(file)
        alertStatus.value = 'success'
        alertMessage.value =
          t('drawer-content.account.profile_updated_success') ||
          'Profile image updated successfully'
        setTimeout(() => {
          alertStatus.value = null
        }, 1000 * 3)
      } catch (error) {
        // Show error alert
        alertStatus.value = 'error'
        alertMessage.value =
          t('drawer-content.account.profile_update_error') ||
          'Error updating profile image. Please try again.'
        handleError(error)
        setTimeout(() => {
          alertStatus.value = null
        }, 1000 * 3)
      } finally {
        // Reset loading state
        isImageUploading.value = false
      }
    }
    reader.readAsDataURL(file)
  }
}

function handleError (error: any) {
  if (error?.response?.status >= 500 && error?.response?.status < 600) {
    errorType.value = '5xx'
    showErrorModal.value = true
  } else if (error?.response?.status >= 400 && error?.response?.status < 500) {
    errorType.value = '4xx'
    showErrorModal.value = true
  } else {
    console.error('Erreur inattendue:', error)
  }
}

async function saveProfile () {
  try {
    await volunteerAuth.updateVolunteer(form.value, auth.user.value?.userId)

    initialForm.value = { ...form.value }

    alertStatus.value = 'success'
    alertMessage.value =
      t('drawer-content.account.profile_updated_success') ||
      'Profile updated successfully'
    setTimeout(() => {
      alertStatus.value = null
    }, 1000)
  } catch (error) {
    // Show error alert
    alertStatus.value = 'error'
    alertMessage.value =
      t('drawer-content.account.profile_update_error') ||
      'Error updating profile. Please try again.'
    handleError(error)
    setTimeout(() => {
      alertStatus.value = null
    }, 1000)
  }
}
</script>
