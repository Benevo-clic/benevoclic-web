<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import NameFirstNameForm from './NameFirstNameForm.vue'
  import PhoneForm from './PhoneForm.vue'
  import BirthDateForm from './BirthDateForm.vue'
  import CityForm from './CityForm.vue'
  import PostalCodeForm from './PostalCodeForm.vue'
  import BioForm from './BioForm.vue'
  import type {
    CreateVolunteerDto,
    FormFieldsVolunteer
  } from '~/common/interface/register.interface'
  import { useUser } from '~/composables/auth/useUser'
  import { useVolunteerAuth } from '~/composables/useVolunteer'
  import { useNavigation } from '~/composables/useNavigation'
  import ErrorPopup from '~/components/utils/ErrorPopup.vue'
  import { useAuthStore } from '@/stores/auth/auth.store'
  import { useSettingsStore } from '~/stores/settings.store'

  const { t } = useI18n()

  const { user, updateIsCompleted } = useUser()
  const authStore = useAuthStore()
  const { registerVolunteer } = useVolunteerAuth()
  const { navigateToRoute } = useNavigation()
  const settingsStore = useSettingsStore()

  const showErrorModal = ref(false)
  const errorType = ref<'4xx' | '5xx' | null>(null)

  function handleReload() {
    window.location.reload()
  }
  async function handleGoHome() {
    await authStore.deleteCookies()
    await navigateToRoute('/')
  }

  interface Step {
    component: Component
    field: keyof (FormFieldsVolunteer & { nameFirstName: string })
    validate: (value: string) => string
  }

  // eslint-disable-next-line func-call-spacing
  const emit = defineEmits<{
    (e: 'submit', isSend: boolean): void
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

        if (!name) {
          return t('registerInfoVolunteerForm.validation.lastName.required')
        }
        if (name.length < 2) {
          return t('registerInfoVolunteerForm.validation.lastName.min_length')
        }

        if (!firstName) {
          return t('registerInfoVolunteerForm.validation.firstName.required')
        }
        if (firstName.length < 2) {
          return t('registerInfoVolunteerForm.validation.firstName.min_length')
        }

        return ''
      }
    },
    {
      component: PhoneForm,
      field: 'phone',
      validate: (value: string) => {
        if (!value) {
          return t('registerInfoVolunteerForm.validation.phone.required')
        }
        if (!/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(value)) {
          return t('registerInfoVolunteerForm.validation.phone.invalid_format')
        }
        return ''
      }
    },
    {
      component: BirthDateForm,
      field: 'birthDate',
      validate: (value: string) =>
        !value ? t('registerInfoVolunteerForm.validation.birthDate.required') : ''
    },
    {
      component: CityForm,
      field: 'city',
      validate: (value: string) => {
        if (!value) {
          return t('registerInfoVolunteerForm.validation.city.required')
        }
        if (value.length < 2) {
          return t('registerInfoVolunteerForm.validation.city.min_length')
        }
        return ''
      }
    },
    {
      component: PostalCodeForm,
      field: 'postalCode',
      validate: (value: string) => {
        if (!value) {
          return t('registerInfoVolunteerForm.validation.postalCode.required')
        }
        if (!/^[0-9]{5}$/.test(value)) {
          return t('registerInfoVolunteerForm.validation.postalCode.invalid_format')
        }
        return ''
      }
    },
    {
      component: BioForm,
      field: 'bio',
      validate: (value: string) => {
        if (value.length < 10) {
          return t('registerInfoVolunteerForm.validation.bio.min_length')
        }
        return ''
      }
    }
  ]

  const loading = ref(false)
  const isError = ref(false)

  function validateCurrentStep(): boolean {
    const step = steps[currentStep.value]
    const error = step.validate(
      formData[step.field as keyof (FormFieldsVolunteer & { nameFirstName: string })]
    )
    errors[step.field as keyof (FormFieldsVolunteer & { nameFirstName: string })] = error
    return !error
  }

  function handleInput(
    field: keyof (FormFieldsVolunteer & { nameFirstName: string }),
    value: string
  ) {
    formData[field] = value
    errors[field] = ''

    if (field === 'nameFirstName') {
      const parts = value.split('|')
      formData.lastName = parts[0] || ''
      formData.firstName = parts[1] || ''
    }
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

  // Utilitaire : retire les champs vides/indéfinis pour alléger le payload
  function compact<T extends Record<string, any>>(obj: T): T {
    const out: Record<string, any> = {}
    for (const [k, v] of Object.entries(obj)) {
      if (v !== '' && v !== undefined && v !== null) out[k] = v
    }
    return out as T
  }

  const submitForm = async (): Promise<void> => {
    if (loading.value) return // évite les doubles soumissions
    loading.value = true
    isError.value = false

    try {
      const u = user.value
      if (!u?.email) throw new Error('User is not authenticated or email is missing')

      const payload = compact({
        email: u.email,
        lastName: formData.lastName,
        firstName: formData.firstName,
        phone: formData.phone,
        birthDate: formData.birthDate,
        city: formData.city,
        postalCode: formData.postalCode,
        bio: formData.bio
      }) satisfies CreateVolunteerDto

      // 1) Création/inscription du volontaire
      await registerVolunteer(payload)

      // 2) Ces deux opérations peuvent se faire en parallèle
      await Promise.all([updateIsCompleted(u.userId, true), settingsStore.loadVolunteer()])

      emit('submit', true)
    } catch (err) {
      process.env.NODE_ENV !== 'production' && console.error('Error submitting form:', err)
      isError.value = true
      handleError(err)
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <div class="w-full max-w-md mx-auto p-4">
    <h1 class="text-3xl font-bold mb-2">{{ t('registerInfoVolunteerForm.title') }}</h1>
    <p class="text-base text-gray-600 mb-4">{{ t('registerInfoVolunteerForm.subtitle') }}</p>

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
        <span class="text-secondary-content font-bold">{{
          t('registerInfoVolunteerForm.actions.previous')
        }}</span>
      </button>

      <button :disabled="loading" class="btn btn-primary" @click="next">
        <span v-if="loading" class="loading loading-spinner mr-2" />
        {{
          currentStep < steps.length - 1
            ? t('registerInfoVolunteerForm.actions.next')
            : t('registerInfoVolunteerForm.actions.submit')
        }}
      </button>
    </div>

    <p v-if="isError" class="text-red-600 mt-4">
      {{ t('registerInfoVolunteerForm.error.general') }}
    </p>
    <ErrorPopup
      :show-error-modal="showErrorModal"
      :error-type="errorType"
      @reload="handleReload"
      @go-home="handleGoHome"
    />
  </div>
</template>
