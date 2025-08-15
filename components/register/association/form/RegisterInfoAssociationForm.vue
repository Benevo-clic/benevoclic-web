<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import PhoneForm from '../../volunteer/form/PhoneForm.vue'
  import CityForm from '../../volunteer/form/CityForm.vue'
  import PostalCodeForm from '../../volunteer/form/PostalCodeForm.vue'
  import BioForm from '../../volunteer/form/BioForm.vue'
  import AssociationNameForm from './AssociationNameForm.vue'
  import AssociationTypeForm from './AssociationTypeForm.vue'
  import { useAssociationAuth } from '~/composables/useAssociation'
  import type {
    CreateAssociationDto,
    FormFieldsAssociation
  } from '~/common/interface/register.interface'
  import { useUser } from '~/composables/auth/useUser'
  import ErrorPopup from '~/components/utils/ErrorPopup.vue'
  import { useNavigation } from '~/composables/useNavigation'
  import { useAuthStore } from '~/stores/auth/auth.store'
  import { useSettingsStore } from '~/stores/settings.store'

  const { user, updateIsCompleted } = useUser()
  const authStore = useAuthStore()

  const { registerAssociation } = useAssociationAuth()
  const { navigateToRoute } = useNavigation()
  const settingsStore = useSettingsStore()

  const showErrorModal = ref(false)
  const errorType = ref<'4xx' | '5xx' | null>(null)

  function handleReload() {
    window.location.reload()
  }
  function handleGoHome() {
    authStore.deleteCookies()
    navigateToRoute('/')
  }

  interface Step {
    component: Component
    field: keyof FormFieldsAssociation
    validate: (value: string) => string
  }

  // eslint-disable-next-line func-call-spacing
  const emit = defineEmits<{
    (e: 'submit', isSend: boolean): void
    (e: 'currentStep', step: number): void
  }>()

  function handleError(error: any) {
    if (error?.response?.status >= 500 && error?.response?.status < 600) {
      errorType.value = '5xx'
      showErrorModal.value = true
    } else if (error?.response?.status >= 400 && error?.response?.status < 500) {
      errorType.value = '4xx'
      showErrorModal.value = true
    } else {
      process.env.NODE_ENV !== 'production' && console.error('Erreur inattendue:', error)
    }
  }

  const formData = reactive<FormFieldsAssociation>({
    associationName: '',
    phone: '',
    bio: '',
    city: '',
    postalCode: '',
    country: 'France',
    type: ''
  })

  const errors = reactive<Record<keyof FormFieldsAssociation, string>>({
    associationName: '',
    phone: '',
    bio: '',
    city: '',
    postalCode: '',
    country: '',
    type: ''
  })

  const currentStep = ref(0)

  const steps: Step[] = [
    {
      component: AssociationNameForm,
      field: 'associationName',
      validate: (value: string) => {
        if (!value) {
          return "Le nom de l'association est requis"
        }
        if (value.length < 2) {
          return 'Le nom doit contenir au moins 2 caractères'
        }
        return ''
      }
    },
    {
      component: PhoneForm,
      field: 'phone',
      validate: (value: string) => {
        if (!value) {
          return 'Le téléphone est requis'
        }
        if (!/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(value)) {
          return 'Format de téléphone invalide'
        }
        return ''
      }
    },
    {
      component: AssociationTypeForm,
      field: 'type',
      validate: (value: string) => {
        if (!value) {
          return "Le type d'association est requis"
        }
        return ''
      }
    },
    {
      component: CityForm,
      field: 'city',
      validate: (value: string) => {
        if (!value) {
          return 'La ville est requise'
        }
        if (value.length < 2) {
          return 'La ville doit contenir au moins 2 caractères'
        }
        return ''
      }
    },
    {
      component: PostalCodeForm,
      field: 'postalCode',
      validate: (value: string) => {
        if (!value) {
          return 'Le code postal est requis'
        }
        if (!/^[0-9]{5}$/.test(value)) {
          return 'Le code postal doit contenir 5 chiffres'
        }
        return ''
      }
    },
    {
      component: BioForm,
      field: 'bio',
      validate: (value: string) => {
        if (value.length < 10) {
          return 'La description doit contenir au moins 10 caractères'
        }
        return ''
      }
    }
  ]

  const loading = ref(false)
  const isError = ref(false)

  function validateCurrentStep(): boolean {
    const step = steps[currentStep.value]
    const error = step.validate(formData[step.field] as string)
    errors[step.field] = error
    return !error
  }

  function handleInput(field: keyof FormFieldsAssociation, value: string) {
    formData[field] = value
    errors[field] = ''
  }

  function next() {
    if (!validateCurrentStep()) {
      return
    }

    if (currentStep.value < steps.length - 1) {
      currentStep.value++
      emit('currentStep', (currentStep.value / steps.length) * 100)
    } else {
      submitForm()
    }
  }

  function prev() {
    if (currentStep.value > 0) {
      currentStep.value--
      emit('currentStep', (currentStep.value / steps.length) * 100)
    }
  }

  // util: enlève les champs vides/undefined/null
  function compact<T extends Record<string, any>>(obj: T): T {
    const out: Record<string, any> = {}
    for (const [k, v] of Object.entries(obj)) {
      if (v !== '' && v !== undefined && v !== null) out[k] = v
    }
    return out as T
  }

  const submitForm = async (): Promise<void> => {
    if (loading.value) return // évite la double soumission
    loading.value = true
    isError.value = false

    try {
      const u = user.value
      if (!u?.userId || !u?.email) {
        throw new Error('User not authenticated or email missing')
      }

      const payload = compact({
        email: u.email,
        associationName: formData.associationName,
        phone: formData.phone,
        bio: formData.bio,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
        type: formData.type
      }) satisfies CreateAssociationDto

      await registerAssociation(payload)

      await Promise.all([updateIsCompleted(u.userId, true), settingsStore.loadAssociation()])

      emit('submit', true)
    } catch (err) {
      process.env.NODE_ENV !== 'production' &&
        console.error('Error submitting association form:', err)
      isError.value = true
      handleError(err)
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <div class="w-full max-w-md mx-auto p-4">
    <h1 class="text-3xl font-bold mb-2">🚀 Enregistrement de votre association</h1>
    <p class="text-base text-gray-600 mb-4">Complétez les informations étape par étape 😊</p>

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
        :disabled="currentStep === 0 || loading"
        class="btn btn-secondary disabled:cursor-not-allowed"
        @click="prev"
      >
        <span class="text-secondary-content font-bold">Précédent</span>
      </button>

      <button :disabled="loading" class="btn btn-primary" @click="next">
        <span v-if="loading" class="loading loading-spinner mr-2" />
        {{ currentStep < steps.length - 1 ? 'Suivant' : 'Envoyer' }}
      </button>
    </div>

    <p v-if="isError" class="text-red-600 mt-4">Une erreur est survenue. Réessayez plus tard.</p>
    <ErrorPopup
      :show-error-modal="showErrorModal"
      :error-type="errorType"
      @reload="handleReload"
      @go-home="handleGoHome"
    />
  </div>
</template>
