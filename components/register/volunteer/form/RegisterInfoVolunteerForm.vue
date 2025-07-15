<script setup lang="ts">
import { ref, reactive } from 'vue'
import NameFirstNameForm from './NameFirstNameForm.vue'
import PhoneForm from './PhoneForm.vue'
import BirthDateForm from './BirthDateForm.vue'
import CityForm from './CityForm.vue'
import PostalCodeForm from './PostalCodeForm.vue'
import BioForm from './BioForm.vue'
import type {CreateVolunteerDto, FormFieldsVolunteer} from "~/common/interface/register.interface";
import {useUser} from "~/composables/auth/useUser";
import {useVolunteerAuth} from "~/composables/useVolunteer";
import {useNavigation} from "~/composables/useNavigation";
import ErrorPopup from "~/components/utils/ErrorPopup.vue";
import {useAuthStore} from "~/stores/auth/auth.store";

const { user, updateIsCompleted } = useUser()
const authStore = useAuthStore()
const { registerVolunteer } = useVolunteerAuth()
const {navigateToRoute} = useNavigation()


const showErrorModal = ref(false);
const errorType = ref<'4xx' | '5xx' | null>(null);

function handleReload() {
  window.location.reload();
}
async function handleGoHome() {
  await authStore.deleteCookies()
  await navigateToRoute('/');
}

interface Step {
  component: Component
  field: keyof (FormFieldsVolunteer & { nameFirstName: string })
  validate: (value: string) => string
}

const emit = defineEmits<{
  (e: 'submit', isSend: boolean): void,
  (e: 'currentStep', step: number): void
}>()


const formData = reactive<FormFieldsVolunteer & { nameFirstName: string }>({
  lastName: '',
  firstName: '',
  nameFirstName: '|', // Format: "name|firstName"
  phone: '',
  birthDate: '',
  city: '',
  postalCode: '',
  bio: ''
})

const errors = reactive<Record<keyof (FormFieldsVolunteer & { nameFirstName: string }), string>>({
  lastName: '',
  firstName: '',
  nameFirstName: '',
  phone: '',
  birthDate: '',
  city: '',
  postalCode: '',
  bio: ''
})

const currentStep = ref(0)

const steps: Step[] = [
  {
    component: NameFirstNameForm,
    field: 'nameFirstName',
    validate: (value: string) => {
      const parts = value.split('|')
      const name = parts[0] || ''
      const firstName = parts[1] || ''

      if (!name) return 'Le nom est requis'
      if (name.length < 2) return 'Le nom doit contenir au moins 2 caractères'

      if (!firstName) return 'Le prénom est requis'
      if (firstName.length < 2) return 'Le prénom doit contenir au moins 2 caractères'

      return ''
    }
  },
  {
    component: PhoneForm,
    field: 'phone',
    validate: (value: string) => {
      if (!value) return 'Le téléphone est requis'
      if (!/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(value)) {
        return 'Format de téléphone invalide'
      }
      return ''
    }
  },
  {
    component: BirthDateForm,
    field: 'birthDate',
    validate: (value: string) => !value ? 'La date de naissance est requise' : ''
  },
  {
    component: CityForm,
    field: 'city',
    validate: (value: string) => {
      if (!value) return 'La ville est requise'
      if (value.length < 2) return 'La ville doit contenir au moins 2 caractères'
      return ''
    }
  },
  {
    component: PostalCodeForm,
    field: 'postalCode',
    validate: (value: string) => {
      if (!value) return 'Le code postal est requis'
      if (!/^[0-9]{5}$/.test(value)) return 'Le code postal doit contenir 5 chiffres'
      return ''
    }
  },
  {
    component: BioForm,
    field: 'bio',
    validate: (value: string) => {
      if (value.length < 10) return 'La bio doit contenir au moins 10 caractères'
      return ''
    }
  }
]

const loading = ref(false)
const isError = ref(false)



function validateCurrentStep(): boolean {
  const step = steps[currentStep.value]
  const error = step.validate(formData[step.field as keyof (FormFieldsVolunteer & { nameFirstName: string })])
  errors[step.field as keyof (FormFieldsVolunteer & { nameFirstName: string })] = error
  return !error
}

function handleInput(field: keyof (FormFieldsVolunteer & { nameFirstName: string }), value: string) {
  formData[field] = value
  errors[field] = ''

  if (field === 'nameFirstName') {
    const parts = value.split('|')
    formData.lastName = parts[0] || ''
    formData.firstName = parts[1] || ''
  }
}

function next() {
  if (!validateCurrentStep()) return

  if (currentStep.value < steps.length - 1) {
    currentStep.value++
    emit('currentStep', ((currentStep.value) / steps.length) * 100)
  } else {
    submitForm()
  }
}

function prev() {
  if (currentStep.value > 0) {
    currentStep.value--
    emit('currentStep', ((currentStep.value) / steps.length) * 100)
  }
}

function handleError(error: any) {
  if (error?.response?.status >= 500 && error?.response?.status < 600) {
    errorType.value = '5xx';
    showErrorModal.value = true;
  } else if (error?.response?.status >= 400 && error?.response?.status < 500) {
    errorType.value = '4xx';
    showErrorModal.value = true;
  } else {
    console.error('Erreur inattendue:', error);
  }
}

async function submitForm() {
  loading.value = true
  isError.value = false
  try {
    if(!user.value || !user.value.email) {
      throw new Error('User is not authenticated or email is missing')
    }
    await registerVolunteer({
      email: user.value?.email ,
      lastName: formData.lastName,
      firstName: formData.firstName,
      phone: formData.phone,
      birthDate: formData.birthDate,
      city: formData.city,
      postalCode: formData.postalCode,
      bio: formData.bio
    } as CreateVolunteerDto)

    await updateIsCompleted(user.value.userId, true)
    emit('submit', true)
  } catch (error) {
    console.error('Error submitting form:', error)
    isError.value = true
    handleError(error)
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <div class="w-full max-w-md mx-auto p-4">
    <h1 class="text-3xl font-bold mb-2">🚀 On démarre l'aventure</h1>
    <p class="text-base text-gray-600 mb-4">Dis-nous un peu sur toi étape par étape 😊</p>

    <keep-alive>
      <component
          :is="steps[currentStep].component"
          :model-value="formData[steps[currentStep].field]"
          :error="errors[steps[currentStep].field]"
          @update:model-value="(value: string) => handleInput(steps[currentStep].field, value)"
      />
    </keep-alive>

    <div class="flex justify-between mt-6">
      <button
          @click="prev"
          :disabled="currentStep === 0 || loading"
          class="btn btn-secondary disabled:cursor-not-allowed"
      >
        <span class="text-secondary-content font-bold">Précédent</span>
      </button>

      <button
          @click="next"
          :disabled="loading"
          class="btn btn-primary"
      >
        <span v-if="loading" class="loading loading-spinner mr-2" />
        {{ currentStep < steps.length - 1 ? 'Suivant' : 'Envoyer' }}
      </button>
    </div>

    <p v-if="isError" class="text-red-600 mt-4">
      Une erreur est survenue. Réessayez plus tard.
    </p>
    <ErrorPopup
        :show-error-modal="showErrorModal"
        :error-type="errorType"
        @reload="handleReload"
        @goHome="handleGoHome"
    />
  </div>
</template>
