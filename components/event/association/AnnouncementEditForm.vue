<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    <div
      class="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-2xl relative"
      style="max-height:90vh; overflow-y:auto;"
    >
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="$emit('close')">✕</button>
      <h2 class="text-xl font-bold mb-4">{{ form._id ? 'Modifier' : 'Créer' }} une annonce</h2>
      <form @submit.prevent="save">
        <div
            class="w-full h-80 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer relative overflow-hidden"
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

        <div class="mb-2">
          <label class="block mb-1">Titre</label>
          <input v-model="form.nameEvent" class="input input-bordered w-full" required />
        </div>
        <div class="mb-2">
          <label class="block mb-1">Description</label>
          <textarea v-model="form.description" class="textarea textarea-bordered w-full" required />
        </div>
        <div class="mb-2 flex gap-2">
          <div class="flex-1">
            <label class="block mb-1">Date</label>
            <input v-model="form.dateEvent" type="date" class="input input-bordered w-full" required />
          </div>
          <div class="flex-1">
            <label class="block mb-1">Heure</label>
            <input v-model="form.hoursEvent" type="time" class="input input-bordered w-full" required />
          </div>
        </div>
        <div class="mb-2 flex gap-2">
          <div class="flex-1">
            <label class="block mb-1">Nombre max. de participants</label>
            <input v-model.number="form.maxParticipants" type="number" min="0" class="input input-bordered w-full" />
          </div>
          <div class="flex-1">
            <label class="block mb-1">Nombre max. de bénévoles</label>
            <input v-model.number="form.maxVolunteers" type="number" min="0" class="input input-bordered w-full" />
          </div>
        </div>
        <div class="mb-2">
          <label class="block mb-1">Tags (séparés par des virgules)</label>
          <input v-model="tagsInput" class="input input-bordered w-full" />
        </div>
        <div class="mb-2 grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label class="block mb-1">Ville</label>
            <input v-model="form.locationAnnouncement!.city" class="input input-bordered w-full" />
          </div>
          <div>
            <label class="block mb-1">Code postal</label>
            <input v-model="form.locationAnnouncement!.postalCode" class="input input-bordered w-full" />
          </div>
          <div>
            <label class="block mb-1">Adresse</label>
            <input v-model="form.locationAnnouncement!.address" class="input input-bordered w-full" />
          </div>
          <div>
            <label class="block mb-1">Pays</label>
            <input v-model="form.locationAnnouncement!.country" class="input input-bordered w-full" />
          </div>
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Statut</span>
          </label>
          <select
              v-model="form.status"
              class="select select-bordered w-full"
          >
            <option v-for="status in statusOptions" :key="status.value" :value="status.value">
              {{ status.label }}
            </option>
          </select>
        </div>
        <div class="flex gap-2 mt-4">
          <button class="btn btn-primary flex-1" type="submit">Enregistrer</button>
          <button class="btn btn-ghost flex-1" type="button" @click="$emit('close')">Annuler</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Announcement } from '~/common/interface/event.interface';
import { useAnnouncementStore } from '~/stores/announcement.store';
import {EventStatus} from "~/common/enums/event.enum";

const props = defineProps<{ announcement: Announcement | null }>();
const emit = defineEmits(['close', 'saved']);
const store = useAnnouncementStore();

const form = ref<Partial<Announcement>>({
  nameEvent: '',
  description: '',
  dateEvent: '',
  hoursEvent: '',
  tags: [],
  locationAnnouncement: { address: '', city: '', postalCode: '', country: '' },
  status: EventStatus.INACTIVE,
  maxParticipants: 0,
  maxVolunteers: 0,
});
const tagsInput = ref('');
const imageFile = ref<File|null>(null);
const coverPhotoPreview = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const statusOptions = Object.values(EventStatus).map(status => ({ label: status, value: status }));

watch(() => props.announcement, (a) => {
  if (a) {
    form.value = {
      ...a,
      tags: a.tags ? [...a.tags] : [],
      locationAnnouncement: {
        address: a.locationAnnouncement?.address || '',
        city: a.locationAnnouncement?.city || '',
        postalCode: a.locationAnnouncement?.postalCode || '',
        country: a.locationAnnouncement?.country || '',
        lat: a.locationAnnouncement?.lat,
        lng: a.locationAnnouncement?.lng,
      },
      status: a.status || EventStatus.INACTIVE,
      maxParticipants: a.maxParticipants ?? 0,
      maxVolunteers: a.maxVolunteers ?? 0,
    };
    tagsInput.value = a.tags ? a.tags.join(', ') : '';
    if (a.announcementImage) {
      coverPhotoPreview.value = a.announcementImage;
    } else {
      coverPhotoPreview.value = null;
    }
  } else {
    form.value = {
      _id: '',
      nameEvent: '',
      description: '',
      dateEvent: '',
      hoursEvent: '',
      tags: [],
      locationAnnouncement: { address: '', city: '', postalCode: '', country: '' },
      status: EventStatus.INACTIVE,
      maxParticipants: 0,
      maxVolunteers: 0,
    };
    tagsInput.value = '';
    coverPhotoPreview.value = null;
  }
}, { immediate: true });


const triggerFileInput = () => {
  fileInput.value?.click();
};


const handleFileChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  imageFile.value = file;
  await store.uploadImageCover(file);
  const reader = new FileReader()
  reader.onload = () => {
    coverPhotoPreview.value = reader.result as string
  };
  reader.readAsDataURL(file);
};

const removeCoverPhoto = () => {
  coverPhotoPreview.value = null;
  imageFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

async function save() {
  try {
  form.value.tags = tagsInput.value.split(',').map((t: string) => t.trim()).filter(Boolean);

  if (form.value._id && props.announcement) {
    const updatedFields: any = {};
    const original = props.announcement;
    const keys: (keyof Announcement)[] = ['nameEvent', 'description', 'dateEvent', 'hoursEvent', 'status', 'maxParticipants', 'maxVolunteers'];
    for (const key of keys) {
      if (form.value[key] !== original[key]) {
        updatedFields[key] = form.value[key];
      }
    }
    if (JSON.stringify(form.value.tags) !== JSON.stringify(original.tags)) {
      updatedFields.tags = form.value.tags;
    }
    if (JSON.stringify(form.value.locationAnnouncement) !== JSON.stringify(original.locationAnnouncement)) {
      updatedFields.locationAnnouncement = form.value.locationAnnouncement;
    }
    if (Object.keys(updatedFields).length > 0) {
      await store.updateAnnouncement(form.value._id, updatedFields);
    }
  }
    
    // Émettre l'événement saved seulement après que tout soit terminé
  emit('saved');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    // Vous pouvez ajouter ici une gestion d'erreur pour l'utilisateur
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
</script> 