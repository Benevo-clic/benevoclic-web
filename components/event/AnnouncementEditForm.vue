<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="$emit('close')">✕</button>
      <h2 class="text-xl font-bold mb-4">{{ form._id ? 'Modifier' : 'Créer' }} une annonce</h2>
      <form @submit.prevent="save">
        <div class="mb-2">
          <label class="block mb-1">Image de couverture</label>
          <input type="file" accept="image/*" @change="onImageChange" class="file-input file-input-bordered w-full" />
          <div v-if="imagePreview" class="mt-2">
            <img :src="imagePreview" alt="Aperçu" class="w-full h-32 object-cover rounded" />
          </div>
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
        <div class="mb-2">
          <label class="block mb-1">Tags (séparés par des virgules)</label>
          <input v-model="tagsInput" class="input input-bordered w-full" />
        </div>
        <div class="mb-2">
          <label class="block mb-1">Lieu (ville)</label>
          <input v-model="form.locationAnnouncement.city" class="input input-bordered w-full" />
        </div>
        <div class="mb-2">
          <label class="block mb-1">Statut</label>
          <select v-model="form.status" class="select select-bordered w-full">
            <option value="PENDING">En attente</option>
            <option value="ACTIVE">Active</option>
            <option value="CLOSED">Clôturée</option>
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

const props = defineProps<{ announcement: Announcement | null }>();
const emit = defineEmits(['close', 'saved']);
const store = useAnnouncementStore();

const form = ref<any>({
  _id: '',
  nameEvent: '',
  description: '',
  dateEvent: '',
  hoursEvent: '',
  tags: [],
  locationAnnouncement: { city: '' },
  status: 'PENDING',
});
const tagsInput = ref('');
const imageFile = ref<File|null>(null);
const imagePreview = ref<string|null>(null);

watch(() => props.announcement, (a) => {
  if (a) {
    form.value = { ...a, tags: a.tags ? [...a.tags] : [], locationAnnouncement: { ...a.locationAnnouncement }, status: a.status };
    tagsInput.value = a.tags ? a.tags.join(', ') : '';
    if (a.announcementImage?.data && a.announcementImage?.contentType) {
      imagePreview.value = `data:${a.announcementImage.contentType};base64,${a.announcementImage.data}`;
    } else {
      imagePreview.value = null;
    }
  } else {
    form.value = { _id: '', nameEvent: '', description: '', dateEvent: '', hoursEvent: '', tags: [], locationAnnouncement: { city: '' }, status: 'PENDING' };
    tagsInput.value = '';
    imagePreview.value = null;
  }
}, { immediate: true });

function onImageChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    imageFile.value = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      imagePreview.value = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

async function save() {
  form.value.tags = tagsInput.value.split(',').map((t: string) => t.trim()).filter(Boolean);
  if (form.value._id) {
    await store.updateAnnouncement(form.value._id, form.value);
    if (imageFile.value) {
      const base64 = await fileToBase64(imageFile.value);
      await store.uploadImageCover(base64);
    }
  } else {
    await store.createAnnouncement(form.value);
  }
  emit('saved');
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