<template>
  <form class="space-y-6" @submit.prevent="submit">
    <!-- Required Fields Note -->
    <div class="text-sm text-gray-500 mb-2">
      {{ t('eventForm.required_fields_note') }} <span class="text-error">*</span> {{ t('eventForm.are_required') }}
    </div>

    <!-- Validation Errors -->
    <div v-if="formErrors.length > 0" class="alert alert-error shadow-lg mb-4">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current flex-shrink-0 h-6 w-6"
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
        <div>
          <h3 class="font-bold">{{ t('eventForm.validation_errors.title') }}</h3>
          <ul class="mt-1 list-disc list-inside">
            <li v-for="(error, index) in formErrors" :key="index">
              {{ error }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Event Name -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">{{ t('eventForm.fields.event_name.label') }} <span class="text-error">*</span></span>
      </label>
      <input
        v-model="formState.nameEvent"
        type="text"
        class="input input-bordered w-full"
        :class="{ 'input-error': invalidFields.nameEvent }"
        :placeholder="t('eventForm.fields.event_name.placeholder')"
        :aria-label="t('eventForm.aria_labels.input_field')"
      />
    </div>

    <!-- Description -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">{{ t('eventForm.fields.description.label') }} <span class="text-error">*</span></span>
      </label>
      <textarea
        v-model="formState.description"
        class="textarea textarea-bordered h-24 w-full"
        :class="{ 'textarea-error': invalidFields.description }"
        :placeholder="t('eventForm.fields.description.placeholder')"
        :aria-label="t('eventForm.aria_labels.text_area')"
      />
    </div>

    <!-- Date and Time -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">{{ t('eventForm.fields.event_date.label') }} <span class="text-error">*</span></span>
        </label>
        <input
          v-model="formState.dateEvent"
          type="date"
          class="input input-bordered w-full"
          :class="{ 'input-error': invalidFields.dateEvent }"
          :aria-label="t('eventForm.aria_labels.input_field')"
        />
      </div>
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">{{ t('eventForm.fields.event_time.label') }} <span class="text-error">*</span></span>
        </label>
        <input
          v-model="formState.hoursEvent"
          type="time"
          class="input input-bordered w-full"
          :class="{ 'input-error': invalidFields.hoursEvent }"
          :aria-label="t('eventForm.aria_labels.input_field')"
        />
      </div>
    </div>

    <AddressInput @address-selected="selectAddress" />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">{{ t('eventForm.fields.city.label') }} <span class="text-error">*</span></span>
        </label>
        <input
          v-model="formState.addressAnnouncement.city"
          type="text"
          class="input input-bordered w-full"
          :class="{ 'input-error': invalidFields.city }"
          :placeholder="t('eventForm.fields.city.placeholder')"
          :aria-label="t('eventForm.aria_labels.input_field')"
        />
      </div>
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">{{ t('eventForm.fields.postal_code.label') }} <span class="text-error">*</span></span>
        </label>
        <input
          v-model="formState.addressAnnouncement.postalCode"
          type="text"
          class="input input-bordered w-full"
          :class="{ 'input-error': invalidFields.postalCode }"
          :placeholder="t('eventForm.fields.postal_code.placeholder')"
          :aria-label="t('eventForm.aria_labels.input_field')"
        />
      </div>
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">{{ t('eventForm.fields.country.label') }}</span>
        </label>
        <input
          v-model="formState.addressAnnouncement.country"
          type="text"
          class="input input-bordered w-full"
          :placeholder="t('eventForm.fields.country.placeholder')"
          :aria-label="t('eventForm.aria_labels.input_field')"
        />
      </div>
    </div>

    <!-- Participants and Volunteers -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">{{ t('eventForm.fields.max_participants.label') }}</span>
        </label>
        <input
          v-model.number="formState.maxParticipants"
          type="number"
          class="input input-bordered w-full"
          min="0"
          :aria-label="t('eventForm.aria_labels.number')"
        />
      </div>
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">{{ t('eventForm.fields.max_volunteers.label') }}</span>
        </label>
        <input
          v-model.number="formState.maxVolunteers"
          type="number"
          class="input input-bordered w-full"
          min="0"
          :aria-label="t('eventForm.aria_labels.number')"
        />
      </div>
    </div>

    <!-- Tags -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">{{ t('eventForm.fields.tags.label') }}</span>
      </label>
      <div class="flex">
        <input
          v-model="tagsInput"
          type="text"
          class="input input-bordered w-full"
          :placeholder="t('eventForm.fields.tags.placeholder')"
          :aria-label="t('eventForm.aria_labels.input_field')"
          @keydown.enter.prevent="addTag"
        />
        <button type="button" class="btn btn-primary ml-2" @click="addTag">{{ t('eventForm.fields.tags.add_button') }}</button>
      </div>
      <div class="flex flex-wrap gap-2 mt-2">
        <div v-for="(tag, index) in formState.tags" :key="index" class="badge badge-primary gap-1">
          {{ tag }}
          <button type="button" class="btn btn-xs btn-circle" @click="removeTag(index)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Status -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">{{ t('eventForm.fields.status.label') }}</span>
      </label>
      <select
        v-model="formState.status"
        class="select select-bordered w-full"
        :aria-label="t('eventForm.aria_labels.selection')"
      >
        <option v-for="status in statusOptions" :key="status.value" :value="status.value">
          {{ status.label }}
        </option>
      </select>
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-4 mt-6">
      <button type="button" class="btn btn-ghost" @click="cancel">{{ t('eventForm.actions.cancel') }}</button>
      <button type="submit" class="btn btn-primary" :class="{ loading: loading }">
        {{ announcement ? t('eventForm.actions.update') : t('eventForm.actions.continue') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
  import { ref, reactive, watch } from 'vue'
  import type { Announcement } from '~/common/interface/event.interface'
  import { EventStatus } from '~/common/enums/event.enum'
  import { useAssociationAuth } from '~/composables/useAssociation'
  import { useUser } from '~/composables/auth/useUser'
  import AddressInput from '~/components/common/AddressInput.vue'

  const { t } = useI18n()

  const props = defineProps<{
    announcement?: Announcement | null
    loading?: boolean
  }>()

  const { association } = useAssociationAuth()
  const user = useUser()

  const emit = defineEmits(['submit', 'cancel'])

  const statusOptions = Object.values(EventStatus).map(status => ({
    label: status,
    value: status
  }))

  const createInitialState = () => ({
    nameEvent: '',
    description: '',
    associationId: '',
    associationName: '',
    dateEvent: '',
    datePublication: new Date().toISOString().split('T')[0],
    hoursEvent: '',
    addressAnnouncement: {
      address: '',
      city: '',
      postalCode: '',
      country: ''
    },
    locationAnnouncement: {
      type: 'Point',
      coordinates: [0, 0]
    },
    maxParticipants: 0,
    maxVolunteers: 0,
    tags: [] as string[],
    status: EventStatus.ACTIVE
  })

  const formState = reactive(createInitialState())
  const tagsInput = ref('')

  watch(
    () => props.announcement,
    newVal => {
      if (newVal) {
        Object.assign(formState, {
          ...newVal,
          dateEvent: newVal.dateEvent ? newVal.dateEvent.split('T')[0] : '',
          addressAnnouncement:
            newVal.addressAnnouncement || createInitialState().addressAnnouncement,
          tags: newVal.tags || []
        })
      } else {
        Object.assign(formState, createInitialState())
      }
    },
    { immediate: true }
  )

  function cancel() {
    initFormState()
    emit('cancel')
  }

  function initFormState() {
    Object.assign(formState, createInitialState())
    tagsInput.value = ''
    formErrors.value = []
    invalidFields.value = {}
  }

  function submitEvent() {
    emit('submit', formState)
    initFormState()
  }

  const addTag = () => {
    if (tagsInput.value && !formState.tags.includes(tagsInput.value)) {
      formState.tags.push(tagsInput.value)
      tagsInput.value = ''
    }
  }

  const removeTag = (index: number) => {
    formState.tags.splice(index, 1)
  }

  const formErrors = ref<string[]>([])

  const invalidFields = ref<Record<string, boolean>>({})

  const selectAddress = (address: {
    properties: {
      address: string
      city: string
      postcode: string
    }
    geometry: {
      coordinates: [number, number]
    }
  }) => {
    formState.addressAnnouncement.address = address.properties.address
    formState.addressAnnouncement.postalCode = address.properties.postcode
    formState.addressAnnouncement.city = address.properties.city
    formState.addressAnnouncement.country = 'France'
    formState.locationAnnouncement.coordinates = [
      address.geometry.coordinates[0],
      address.geometry.coordinates[1]
    ]
  }

  const validateForm = (): boolean => {
    formErrors.value = []
    invalidFields.value = {}

    if (!formState.nameEvent) {
      formErrors.value.push(t('eventForm.validation_errors.event_name'))
      invalidFields.value.nameEvent = true
    }
    if (!formState.description) {
      formErrors.value.push(t('eventForm.validation_errors.description'))
      invalidFields.value.description = true
    }
    if (!formState.dateEvent) {
      formErrors.value.push(t('eventForm.validation_errors.event_date'))
      invalidFields.value.dateEvent = true
    } else {
      const eventDate = new Date(formState.dateEvent)
      const publicationDate = new Date(formState.datePublication)

      eventDate.setHours(0, 0, 0, 0)
      publicationDate.setHours(0, 0, 0, 0)

      if (eventDate < publicationDate) {
        formErrors.value.push(t('eventForm.validation_errors.date_before_publication'))
        invalidFields.value.dateEvent = true
      }
    }
    if (!formState.hoursEvent) {
      formErrors.value.push(t('eventForm.validation_errors.event_time'))
      invalidFields.value.hoursEvent = true
    }
    if (!formState.addressAnnouncement.address) {
      formErrors.value.push(t('eventForm.validation_errors.address'))
      invalidFields.value.address = true
    }
    if (!formState.addressAnnouncement.city) {
      formErrors.value.push(t('eventForm.validation_errors.city'))
      invalidFields.value.city = true
    }
    if (!formState.addressAnnouncement.postalCode) {
      formErrors.value.push(t('eventForm.validation_errors.postal_code'))
      invalidFields.value.postalCode = true
    }

    return formErrors.value.length === 0
  }

  const scrollToFirstError = () => {
    const errorFields = document.querySelectorAll('.input-error, .textarea-error')
    if (errorFields.length > 0) {
      errorFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' })
      ;(errorFields[0] as HTMLElement).focus()
    }
  }

  const submit = () => {
    formState.associationName = computed(() => association.value?.associationName || '').value
    formState.associationId =
      computed(() => association.value?.associationId).value || user.getUserId || ''
    if (validateForm()) {
      submitEvent()
    } else {
      setTimeout(scrollToFirstError, 100)
    }
  }
</script>

<style scoped></style>
