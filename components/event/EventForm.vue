<template>
  <form @submit.prevent="submit" class="space-y-6">
    <!-- Cover Photo Upload Section -->
    <div class="w-full mb-6">
      <div 
        class="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer relative overflow-hidden"
        :class="{ 'bg-base-200': !coverPhotoPreview, 'p-0': coverPhotoPreview }"
        @click="triggerFileInput"
      >
        <input 
          type="file" 
          ref="fileInput" 
          class="hidden" 
          accept="image/*" 
          @change="handleFileChange"
        />

        <div v-if="!coverPhotoPreview" class="text-center p-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="mt-2 text-sm text-gray-500">Cliquez pour ajouter une photo de couverture</p>
          <p class="text-xs text-gray-400">JPG, PNG, GIF jusqu'à 10MB</p>
        </div>

        <img 
          v-if="coverPhotoPreview" 
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
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Event Name -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">Nom de l'événement</span>
      </label>
      <input 
        type="text" 
        v-model="formState.nameEvent" 
        class="input input-bordered w-full" 
        placeholder="Nom de l'événement"
      />
    </div>

    <!-- Description -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">Description</span>
      </label>
      <textarea 
        v-model="formState.description" 
        class="textarea textarea-bordered h-24 w-full" 
        placeholder="Description de l'événement"
      ></textarea>
    </div>

    <!-- Date and Time -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">Date de l'événement</span>
        </label>
        <input 
          type="date" 
          v-model="formState.dateEvent" 
          class="input input-bordered w-full" 
        />
      </div>
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">Heure de l'événement</span>
        </label>
        <input 
          type="time" 
          v-model="formState.hoursEvent" 
          class="input input-bordered w-full" 
        />
      </div>
    </div>

    <!-- Location -->
    <div class="form-control w-full">
      <label class="label">
        <span class="label-text">Lieu (Adresse)</span>
      </label>
      <input 
        type="text" 
        v-model="formState.locationAnnouncement.address" 
        class="input input-bordered w-full" 
        placeholder="123 rue de Paris" 
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">Ville</span>
        </label>
        <input 
          type="text" 
          v-model="formState.locationAnnouncement.city" 
          class="input input-bordered w-full" 
          placeholder="Ville"
        />
      </div>
      <div class="form-control w-full">
        <label class="label">
          <span class="label-text">Code Postal</span>
        </label>
        <input 
          type="text" 
          v-model="formState.locationAnnouncement.postalCode" 
          class="input input-bordered w-full" 
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
        @click=""
      >
        {{ announcement ? 'Mettre à jour' : 'Créer' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useAnnouncementStore } from '~/stores/announcement.store';
import type { Announcement, Location, Image } from '~/common/interface/event.interface';
import { EventStatus } from '~/common/enums/event.enum';

const props = defineProps<{
  announcement?: Announcement | null;
}>();

const emit = defineEmits(['submit', 'cancel']);

const store = useAnnouncementStore();
const { loading } = store;

const fileInput = ref<HTMLInputElement | null>(null);
const coverPhotoPreview = ref<string | null>(null);
const coverPhotoFile = ref<File | null>(null);

const statusOptions = Object.values(EventStatus).map(status => ({ label: status, value: status }));

const createInitialState = () => ({
  nameEvent: '',
  description: '',
  dateEvent: '',
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
  status: EventStatus.DRAFT,
  announcementImage: undefined as Image | undefined,
});

const formState = reactive(createInitialState());
const tagsInput = ref('');

watch(() => props.announcement, (newVal) => {
  if (newVal) {
    Object.assign(formState, {
        ...newVal,
        dateEvent: newVal.dateEvent.split('T')[0], // Format date for input
        locationAnnouncement: newVal.locationAnnouncement || createInitialState().locationAnnouncement,
        tags: newVal.tags || [],
    });

    // Set cover photo preview if available
    if (newVal.announcementImage?.url) {
      coverPhotoPreview.value = newVal.announcementImage.url;
    }
  } else {
    Object.assign(formState, createInitialState());
    coverPhotoPreview.value = null;
    coverPhotoFile.value = null;
  }
}, { immediate: true });

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    coverPhotoFile.value = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      coverPhotoPreview.value = e.target?.result as string;

      // Update form state with image data
      formState.announcementImage = {
        url: coverPhotoPreview.value,
        alt: file.name
      };
    };
    reader.readAsDataURL(file);
  }
};

const removeCoverPhoto = () => {
  coverPhotoPreview.value = null;
  coverPhotoFile.value = null;
  formState.announcementImage = undefined;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const addTag = () => {
  if (tagsInput.value && !formState.tags.includes(tagsInput.value)) {
    formState.tags.push(tagsInput.value);
    tagsInput.value = '';
  }
};

const removeTag = (index: number) => {
  formState.tags.splice(index, 1);
};

const submit = async () => {
  console.log('Submitting form with state:', formState);
  emit('submit', formState);
};
</script> 
