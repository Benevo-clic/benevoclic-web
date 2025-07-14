<template>
  <form @submit.prevent="submit" class="space-y-6">
    <!-- Required Fields Note -->
    <div class="text-sm text-gray-500 mb-2">
      Les champs marqués d'un <span class="text-error">*</span> sont obligatoires.
    </div>

    <!-- Validation Errors -->
    <div v-if="formErrors.length > 0" class="alert alert-error shadow-lg mb-4">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <div>
          <h3 class="font-bold">Veuillez corriger les erreurs suivantes :</h3>
          <ul class="mt-1 list-disc list-inside">
            <li v-for="(error, index) in formErrors" :key="index">{{ error }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Event Name -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">Nom de l'événement <span class="text-error">*</span></span>
      </label>
      <input 
        type="text" 
        v-model="formState.nameEvent" 
        class="input input-bordered w-full" 
        :class="{ 'input-error': invalidFields.nameEvent }"
        placeholder="Nom de l'événement"
      />
    </div>

    <!-- Description -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">Description <span class="text-error">*</span></span>
      </label>
      <textarea 
        v-model="formState.description" 
        class="textarea textarea-bordered h-24 w-full" 
        :class="{ 'textarea-error': invalidFields.description }"
        placeholder="Description de l'événement"
      ></textarea>
    </div>

    <!-- Date and Time -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">Date de l'événement <span class="text-error">*</span></span>
        </label>
        <input 
          type="date" 
          v-model="formState.dateEvent" 
          class="input input-bordered w-full" 
          :class="{ 'input-error': invalidFields.dateEvent }"
        />
      </div>
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">Heure de l'événement <span class="text-error">*</span></span>
        </label>
        <input 
          type="time" 
          v-model="formState.hoursEvent" 
          class="input input-bordered w-full" 
          :class="{ 'input-error': invalidFields.hoursEvent }"
        />
      </div>
    </div>

    <!-- Location -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">Lieu (Adresse) <span class="text-error">*</span></span>
      </label>
      <input 
        type="text" 
        v-model="formState.locationAnnouncement.address" 
        class="input input-bordered w-full" 
        :class="{ 'input-error': invalidFields.address }"
        placeholder="123 rue de Paris" 
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">Ville <span class="text-error">*</span></span>
        </label>
        <input 
          type="text" 
          v-model="formState.locationAnnouncement.city" 
          class="input input-bordered w-full" 
          :class="{ 'input-error': invalidFields.city }"
          placeholder="Ville"
        />
      </div>
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">Code Postal <span class="text-error">*</span></span>
        </label>
        <input 
          type="text" 
          v-model="formState.locationAnnouncement.postalCode" 
          class="input input-bordered w-full" 
          :class="{ 'input-error': invalidFields.postalCode }"
          placeholder="Code postal"
        />
      </div>
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">Pays</span>
        </label>
        <input 
          type="text" 
          v-model="formState.locationAnnouncement.country" 
          class="input input-bordered w-full" 
          placeholder="Pays"
        />
      </div>
    </div>

    <!-- Participants and Volunteers -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">Nombre maximum de participants</span>
        </label>
        <input 
          type="number" 
          v-model.number="formState.maxParticipants" 
          class="input input-bordered w-full" 
          min="0"
        />
      </div>
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">Nombre de bénévoles requis</span>
        </label>
        <input 
          type="number" 
          v-model.number="formState.maxVolunteers" 
          class="input input-bordered w-full" 
          min="0"
        />
      </div>
    </div>

    <!-- Tags -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">Tags</span>
      </label>
      <div class="flex">
        <input 
          type="text" 
          v-model="tagsInput" 
          class="input input-bordered w-full" 
          placeholder="Ajouter un tag et appuyer sur Entrée" 
          @keydown.enter.prevent="addTag"
        />
        <button 
          type="button" 
          class="btn btn-primary ml-2" 
          @click="addTag"
        >
          Ajouter
        </button>
      </div>
      <div class="flex flex-wrap gap-2 mt-2">
        <div v-for="(tag, index) in formState.tags" :key="index" class="badge badge-primary gap-1">
          {{ tag }}
          <button 
            type="button" 
            class="btn btn-xs btn-circle" 
            @click="removeTag(index)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Status -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">Statut</span>
      </label>
      <select 
        v-model="formState.status" 
        class="select select-bordered w-full"
      >
        <option v-for="status in statusOptions" :key="status.value" :value="status.value">
          {{ status.label }}
        </option>
      </select>
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-4 mt-6">
      <button 
        type="button" 
        class="btn btn-ghost" 
        @click="$emit('cancel')"
      >
        Annuler
      </button>
      <button 
        type="submit" 
        class="btn btn-primary" 
        :class="{ 'loading': loading }"
      >
        {{ announcement ? 'Mettre à jour' : 'Continuer' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import {ref, reactive, watch } from 'vue';
import type { Announcement } from '~/common/interface/event.interface';
import { EventStatus } from '~/common/enums/event.enum';
import {useAssociationAuth} from "~/composables/useAssociation";
import {useUser} from "~/composables/auth/useUser";

const props = defineProps<{
  announcement?: Announcement | null;
  loading?: boolean;
}>();

const {association} = useAssociationAuth()
const user = useUser()

const emit = defineEmits(['submit', 'cancel']);


const statusOptions = Object.values(EventStatus).map(status => ({ label: status, value: status }));

const createInitialState = () => ({
  nameEvent: '',
  description: '',
  associationId: '',
  associationName: '',
  dateEvent: '',
  datePublication: new Date().toISOString().split('T')[0],
  hoursEvent: '',
  locationAnnouncement: {
    address: '',
    city: '',
    postalCode: '',
    country: '',
  },
  maxParticipants: 0,
  maxVolunteers: 0,
  tags: [] as string[],
  status: EventStatus.ACTIVE
});

const formState = reactive(createInitialState());
const tagsInput = ref('');

watch(() => props.announcement, (newVal) => {
  if (newVal) {
    Object.assign(formState, {
        ...newVal,
        dateEvent: newVal.dateEvent ? newVal.dateEvent.split('T')[0] : '',
        locationAnnouncement: newVal.locationAnnouncement || createInitialState().locationAnnouncement,
        tags: newVal.tags || [],
    });

  } else {
    Object.assign(formState, createInitialState());
  }
}, { immediate: true });

const addTag = () => {
  if (tagsInput.value && !formState.tags.includes(tagsInput.value)) {
    formState.tags.push(tagsInput.value);
    tagsInput.value = '';
  }
};

const removeTag = (index: number) => {
  formState.tags.splice(index, 1);
};

const formErrors = ref<string[]>([]);

const invalidFields = ref<Record<string, boolean>>({});

const validateForm = (): boolean => {
  formErrors.value = [];
  invalidFields.value = {};

  if (!formState.nameEvent) {
    formErrors.value.push('Nom de l\'événement');
    invalidFields.value.nameEvent = true;
  }
  if (!formState.description) {
    formErrors.value.push('Description');
    invalidFields.value.description = true;
  }
  if (!formState.dateEvent) {
    formErrors.value.push('Date de l\'événement');
    invalidFields.value.dateEvent = true;
  } else {
    const eventDate = new Date(formState.dateEvent);
    const publicationDate = new Date(formState.datePublication);

    eventDate.setHours(0, 0, 0, 0);
    publicationDate.setHours(0, 0, 0, 0);

    if (eventDate < publicationDate) {
      formErrors.value.push('La date de l\'événement ne peut pas être antérieure à la date de publication');
      invalidFields.value.dateEvent = true;
    }
  }
  if (!formState.hoursEvent) {
    formErrors.value.push('Heure de l\'événement');
    invalidFields.value.hoursEvent = true;
  }
  if (!formState.locationAnnouncement.address) {
    formErrors.value.push('Adresse');
    invalidFields.value.address = true;
  }
  if (!formState.locationAnnouncement.city) {
    formErrors.value.push('Ville');
    invalidFields.value.city = true;
  }
  if (!formState.locationAnnouncement.postalCode) {
    formErrors.value.push('Code Postal');
    invalidFields.value.postalCode = true;
  }

  return formErrors.value.length === 0;
};

const scrollToFirstError = () => {
  const errorFields = document.querySelectorAll('.input-error, .textarea-error');
  if (errorFields.length > 0) {
    errorFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    (errorFields[0] as HTMLElement).focus();
  }
};

const submit = async () => {
  formState.associationName = computed(() => association.value?.associationName || '').value;
  formState.associationId = computed(() => association.value?.associationId).value || user.getUserId || '';
  if (validateForm()) {
    emit('submit', formState);
  } else {
    console.error('Veuillez corriger les erreurs suivantes:', formErrors.value);
    setTimeout(scrollToFirstError, 100);
  }
};
</script> 
