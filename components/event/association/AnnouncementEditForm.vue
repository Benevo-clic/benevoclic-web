<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    <div
      class="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-2xl relative"
      style="max-height: 90vh; overflow-y: auto"
    >
      <button
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        @click="$emit('close')"
      >
        ✕
      </button>

      <h2 class="text-xl font-bold mb-4">{{ form._id ? 'Modifier' : 'Créer' }} une annonce</h2>

      <form @submit.prevent="save">
        <!-- --- Image de couverture (inchangé) --- -->
        <div
          class="w-full h-80 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer relative overflow-hidden"
          :class="{ 'bg-base-200': !coverPhotoPreview, 'p-0': coverPhotoPreview }"
          @click="triggerFileInput"
        >
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            accept="image/*"
            @change="handleFileChange"
          />
          <div v-if="!coverPhotoPreview" class="text-center p-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p class="mt-2 text-sm text-gray-500">Cliquez pour ajouter une photo de couverture</p>
            <p class="text-xs text-gray-400">JPG, PNG, GIF jusqu'à 10MB</p>
          </div>
          <img
            v-else
            :src="coverPhotoPreview"
            class="w-full h-full object-cover"
            alt="Cover preview"
          />
          <button
            v-if="coverPhotoPreview"
            type="button"
            class="btn btn-circle btn-sm absolute top-2 right-2 bg-base-100 opacity-80 hover:opacity-100"
            @click.stop="removeCoverPhoto"
          >
            ✕
          </button>
        </div>

        <!-- --- Titre / Description / Date / Heure (inchangé) --- -->
        <div class="mb-2">
          <label class="block mb-1">Titre</label>
          <input v-model="form.nameEvent" class="input input-bordered w-full" required />
        </div>

        <div class="mb-2">
          <label class="block mb-1">Description</label>
          <textarea v-model="form.description" class="textarea textarea-bordered w-full" required />
        </div>

        <div class="mb-2 flex flex-col md:flex-row gap-2">
          <div class="flex-1">
            <label class="block mb-1">Date</label>
            <input
              v-model="form.dateEvent"
              type="date"
              class="input input-bordered w-full"
              required
            />
          </div>
          <div class="flex-1">
            <label class="block mb-1">Heure</label>
            <input
              v-model="form.hoursEvent"
              type="time"
              class="input input-bordered w-full"
              required
            />
          </div>
        </div>

        <!-- --- Participants / Bénévoles --- -->
        <div class="mb-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          <!-- Participants -->
          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <label class="block">Nombre max. de participants</label>
              <label class="label cursor-pointer gap-2">
                <span class="label-text">Illimité</span>
                <input
                  type="checkbox"
                  class="toggle"
                  :checked="participantsIsUnlimited"
                  @change="toggleParticipantsUnlimited"
                  aria-label="Basculer illimité participants"
                />
              </label>
            </div>

            <!-- Illimité => placeholder -->
            <input
              v-if="participantsIsUnlimited"
              type="number"
              class="input input-bordered w-full"
              :class="{ 'input-error': maxParticipantsError }"
              disabled
              placeholder="Illimité"
            />
            <!-- Limité => v-model -->
            <input
              v-else
              v-model.number="form.maxParticipants"
              type="number"
              min="0"
              class="input input-bordered w-full"
              :class="{ 'input-error': maxParticipantsError }"
            />
            <p v-if="maxParticipantsError" class="text-error text-xs">
              Doit être ≥ au nombre de participants déjà inscrits ({{ minParticipants }})
            </p>
          </div>

          <!-- Bénévoles -->
          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <label class="block">Nombre max. de bénévoles</label>
              <label class="label cursor-pointer gap-2">
                <span class="label-text">Illimité</span>
                <input
                  type="checkbox"
                  class="toggle"
                  :checked="volunteersIsUnlimited"
                  @change="toggleVolunteersUnlimited"
                  aria-label="Basculer illimité bénévoles"
                />
              </label>
            </div>

            <!-- Illimité => placeholder -->
            <input
              v-if="volunteersIsUnlimited"
              type="number"
              class="input input-bordered w-full"
              :class="{ 'input-error': maxVolunteersError }"
              disabled
              placeholder="Illimité"
            />
            <!-- Limité => v-model -->
            <input
              v-else
              v-model.number="form.maxVolunteers"
              type="number"
              min="0"
              class="input input-bordered w-full"
              :class="{ 'input-error': maxVolunteersError }"
            />
            <p v-if="maxVolunteersError" class="text-error text-xs">
              Doit être ≥ au nombre de bénévoles déjà inscrits ({{ minVolunteers }})
            </p>
          </div>
        </div>

        <!-- --- Tags --- -->
        <div class="mb-2">
          <label class="block mb-1">Tags (séparés par des virgules)</label>
          <input v-model="tagsInput" class="input input-bordered w-full" />
        </div>

        <!-- --- Adresse (inchangé) --- -->
        <AddressInput
          :initial-address="form.addressAnnouncement?.address"
          @address-selected="selectAddress"
        />
        <div class="mb-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label class="block mb-1">Ville</label>
            <input v-model="form.addressAnnouncement!.city" class="input input-bordered w-full" />
          </div>
          <div>
            <label class="block mb-1">Code postal</label>
            <input
              v-model="form.addressAnnouncement!.postalCode"
              class="input input-bordered w-full"
            />
          </div>
          <div>
            <label class="block mb-1">Pays</label>
            <input
              v-model="form.addressAnnouncement!.country"
              class="input input-bordered w-full"
            />
          </div>
        </div>

        <!-- --- Statut --- -->
        <div class="form-control w-full">
          <label class="label"><span class="label-text">Statut</span></label>
          <select v-model="form.status" class="select select-bordered w-full">
            <option v-for="status in statusOptions" :key="status.value" :value="status.value">
              {{ status.label }}
            </option>
          </select>
        </div>

        <!-- --- Actions --- -->
        <div class="flex flex-col md:flex-row gap-2 mt-4">
          <button
            class="btn btn-primary flex-1"
            type="submit"
            :disabled="isSubmitDisabled"
            :title="submitDisabledReason"
          >
            Enregistrer
          </button>
          <button class="btn btn-ghost flex-1" type="button" @click="$emit('close')">
            Annuler
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
  import { ref, watch, computed } from 'vue'
  import type { Announcement } from '~/common/interface/event.interface'
  import { EventStatus } from '~/common/enums/event.enum'
  import { useAnnouncement } from '~/composables/useAnnouncement'
  import { useNavigation } from '~/composables/useNavigation'
  import ErrorPopup from '~/components/utils/ErrorPopup.vue'
  import AddressInput from '~/components/common/AddressInput.vue'

  const props = defineProps<{ announcement: Announcement | null }>()
  const emit = defineEmits(['close', 'saved'])

  const announcement = useAnnouncement()
  const { navigateToRoute } = useNavigation()

  const showErrorModal = ref(false)
  const errorType = ref<'4xx' | '5xx' | null>(null)

  function handleReload() {
    window.location.reload()
  }
  function handleGoHome() {
    navigateToRoute('/association/events/association/manage')
  }

  const form = ref<Partial<Announcement>>({
    nameEvent: '',
    description: '',
    dateEvent: '',
    hoursEvent: '',
    tags: [],
    addressAnnouncement: { address: '', city: '', postalCode: '', country: '' },
    locationAnnouncement: { type: 'Point', coordinates: [0, 0] },
    status: EventStatus.INACTIVE,
    maxParticipants: 0,
    maxVolunteers: 0
  })

  const tagsInput = ref('')
  const imageFile = ref<File | null>(null)
  const coverPhotoPreview = ref<string | null>(null)
  const fileInput = ref<HTMLInputElement | null>(null)

  const statusOptions = Object.values(EventStatus).map(status => ({ label: status, value: status }))

  const minParticipants = computed(() => props.announcement?.nbParticipants ?? 0)
  const minVolunteers = computed(() => props.announcement?.nbVolunteers ?? 0)

  const participantsIsUnlimited = computed(() => form.value.maxParticipants === -1)
  const volunteersIsUnlimited = computed(() => form.value.maxVolunteers === -1)

  function toggleParticipantsUnlimited() {
    form.value.maxParticipants = participantsIsUnlimited.value ? 0 : -1
  }

  function toggleVolunteersUnlimited() {
    form.value.maxVolunteers = volunteersIsUnlimited.value ? 0 : -1
  }

  const maxParticipantsError = computed(() => {
    const v = form.value.maxParticipants
    return v !== -1 && v != null && v < minParticipants.value
  })
  const maxVolunteersError = computed(() => {
    const v = form.value.maxVolunteers
    return v !== -1 && v != null && v < minVolunteers.value
  })

  const initialSnapshot = ref<any>(null)

  function snapshotFromForm(f: Partial<Announcement>) {
    return {
      nameEvent: f.nameEvent ?? '',
      description: f.description ?? '',
      dateEvent: f.dateEvent ?? '',
      hoursEvent: f.hoursEvent ?? '',
      status: f.status ?? EventStatus.INACTIVE,
      maxParticipants: typeof f.maxParticipants === 'number' ? f.maxParticipants : 0,
      maxVolunteers: typeof f.maxVolunteers === 'number' ? f.maxVolunteers : 0,
      tags: Array.isArray(f.tags) ? [...f.tags] : [],
      addressAnnouncement: {
        address: f.addressAnnouncement?.address ?? '',
        city: f.addressAnnouncement?.city ?? '',
        postalCode: f.addressAnnouncement?.postalCode ?? '',
        country: f.addressAnnouncement?.country ?? ''
      },
      locationAnnouncement: f.locationAnnouncement
        ? {
            type: 'Point',
            coordinates: [...(f.locationAnnouncement.coordinates as [number, number])]
          }
        : { type: 'Point', coordinates: [0, 0] }
    }
  }

  const isEditing = computed(() => !!(form.value._id && props.announcement))

  const isDirty = computed(() => {
    if (isEditing.value && initialSnapshot.value) {
      const now = snapshotFromForm(form.value)
      return JSON.stringify(now) !== JSON.stringify(initialSnapshot.value)
    }
    const f = form.value
    const requiredFilled = !!f.nameEvent && !!f.description && !!f.dateEvent && !!f.hoursEvent
    const anyNonDefault =
      (Array.isArray(f.tags) && f.tags.length > 0) ||
      !!f.addressAnnouncement?.address ||
      !!tagsInput.value
    return requiredFilled || anyNonDefault
  })

  const isFormInvalid = computed(() => maxParticipantsError.value || maxVolunteersError.value)
  const isSubmitDisabled = computed(() => isFormInvalid.value || !isDirty.value)
  const submitDisabledReason = computed(() =>
    isFormInvalid.value
      ? 'Corrigez les erreurs avant d’enregistrer'
      : !isDirty.value
        ? 'Aucun changement détecté'
        : ''
  )

  /* ============================
   I/O diverses
   ============================ */
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

  const selectAddress = (address: {
    properties: { address: string; city: string; postcode: string }
    geometry: { coordinates: [number, number] }
  }) => {
    form.value.addressAnnouncement = {
      address: address.properties.address,
      city: address.properties.city,
      postalCode: address.properties.postcode,
      country: 'France'
    }
    form.value.locationAnnouncement = {
      type: 'Point',
      coordinates: [address.geometry.coordinates[0], address.geometry.coordinates[1]]
    }
  }

  watch(
    () => props.announcement,
    a => {
      if (a) {
        form.value = {
          ...a,
          tags: a.tags ? [...a.tags] : [],
          addressAnnouncement: {
            address: a.addressAnnouncement?.address || '',
            city: a.addressAnnouncement?.city || '',
            postalCode: a.addressAnnouncement?.postalCode || '',
            country: a.addressAnnouncement?.country || ''
          },
          locationAnnouncement: a.locationAnnouncement || { type: 'Point', coordinates: [0, 0] },
          status: a.status || EventStatus.INACTIVE,
          // garder -1 s'il vient du backend
          maxParticipants: typeof a.maxParticipants === 'number' ? a.maxParticipants : 0,
          maxVolunteers: typeof a.maxVolunteers === 'number' ? a.maxVolunteers : 0
        }
        tagsInput.value = a.tags ? a.tags.join(', ') : ''
        coverPhotoPreview.value = a.announcementImage || null

        // snapshot initial pour comparaison
        initialSnapshot.value = snapshotFromForm(form.value)
      } else {
        form.value = {
          _id: '',
          nameEvent: '',
          description: '',
          dateEvent: '',
          hoursEvent: '',
          tags: [],
          addressAnnouncement: { address: '', city: '', postalCode: '', country: '' },
          locationAnnouncement: { type: 'Point', coordinates: [0, 0] },
          status: EventStatus.INACTIVE,
          maxParticipants: 0,
          maxVolunteers: 0
        }
        tagsInput.value = ''
        coverPhotoPreview.value = null
        initialSnapshot.value = null
      }
    },
    { immediate: true }
  )

  const triggerFileInput = () => {
    fileInput.value?.click()
  }
  const handleFileChange = async (event: Event) => {
    try {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) return
      imageFile.value = file
      await announcement.uploadImageCover(file)
      const reader = new FileReader()
      reader.onload = () => {
        coverPhotoPreview.value = reader.result as string
      }
      reader.readAsDataURL(file)
    } catch (error) {
      handleError(error)
    }
  }
  const removeCoverPhoto = () => {
    coverPhotoPreview.value = null
    imageFile.value = null
    if (fileInput.value) fileInput.value.value = ''
  }

  async function save() {
    try {
      form.value.tags = tagsInput.value
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)

      if (form.value._id && props.announcement) {
        const updatedFields: any = {}
        const original = props.announcement
        const keys: (keyof Announcement)[] = [
          'nameEvent',
          'description',
          'dateEvent',
          'hoursEvent',
          'status',
          'maxParticipants',
          'maxVolunteers'
        ]
        for (const key of keys) {
          if (form.value[key] !== original[key]) updatedFields[key] = form.value[key]
        }
        if (JSON.stringify(form.value.tags) !== JSON.stringify(original.tags))
          updatedFields.tags = form.value.tags
        if (
          JSON.stringify(form.value.addressAnnouncement) !==
          JSON.stringify(original.addressAnnouncement)
        )
          updatedFields.addressAnnouncement = form.value.addressAnnouncement
        if (
          JSON.stringify(form.value.locationAnnouncement) !==
          JSON.stringify(original.locationAnnouncement)
        )
          updatedFields.locationAnnouncement = form.value.locationAnnouncement

        if (Object.keys(updatedFields).length > 0) {
          await announcement.updateAnnouncement(form.value._id!, updatedFields)
        }
      }

      emit('saved')
    } catch (error) {
      process.env.NODE_ENV !== 'production' && console.error('Erreur lors de la sauvegarde:', error)
    }
  }
</script>
