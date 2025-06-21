<template>
  <UForm :state="formState" @submit="submit" class="space-y-4">
    <UFormGroup label="Nom de l'événement" name="nameEvent">
      <UInput v-model="formState.nameEvent" />
    </UFormGroup>

    <UFormGroup label="Description" name="description">
      <UTextarea v-model="formState.description" />
    </UFormGroup>

    <div class="flex space-x-4">
      <UFormGroup label="Date de l'événement" name="dateEvent" class="flex-1">
        <UInput v-model="formState.dateEvent" type="date" />
      </UFormGroup>
      <UFormGroup label="Heure de l'événement" name="hoursEvent" class="flex-1">
        <UInput v-model="formState.hoursEvent" type="time" />
      </UFormGroup>
    </div>

    <UFormGroup label="Lieu (Adresse)" name="locationAddress">
      <UInput v-model="formState.locationAnnouncement.address" placeholder="123 rue de Paris" />
    </UFormGroup>
    
    <div class="flex space-x-4">
        <UFormGroup label="Ville" name="locationCity" class="flex-1">
            <UInput v-model="formState.locationAnnouncement.city" />
        </UFormGroup>
        <UFormGroup label="Code Postal" name="locationPostalCode" class="flex-1">
            <UInput v-model="formState.locationAnnouncement.postalCode" />
        </UFormGroup>
    </div>

    <div class="flex space-x-4">
      <UFormGroup label="Nombre maximum de participants" name="maxParticipants" class="flex-1">
        <UInput v-model.number="formState.maxParticipants" type="number" />
      </UFormGroup>
      <UFormGroup label="Nombre de bénévoles requis" name="maxVolunteers" class="flex-1">
        <UInput v-model.number="formState.maxVolunteers" type="number" />
      </UFormGroup>
    </div>

    <UFormGroup label="Tags" name="tags">
      <UInput v-model="tagsInput" placeholder="Ajouter un tag et appuyer sur Entrée" @keydown.enter.prevent="addTag" />
      <div class="flex flex-wrap gap-2 mt-2">
        <UBadge v-for="(tag, index) in formState.tags" :key="index" color="primary" variant="solid">
          {{ tag }}
          <UButton icon="i-heroicons-x-mark-20-solid" color="gray" variant="ghost" size="xs" @click="removeTag(index)" />
        </UBadge>
      </div>
    </UFormGroup>

    <UFormGroup label="Statut" name="status">
        <USelect v-model="formState.status" :options="statusOptions" />
    </UFormGroup>
    
    <div class="flex justify-end space-x-4">
        <UButton type="button" color="gray" @click="$emit('cancel')">Annuler</UButton>
        <UButton type="submit" :loading="loading">
            {{ announcement ? 'Mettre à jour' : 'Créer' }}
        </UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useAnnouncementStore } from '~/stores/announcement.store';
import type { Announcement, Location } from '~/common/interface/event.interface';
import { EventStatus } from '~/common/enums/event.enum';

const props = defineProps<{
  announcement?: Announcement | null;
}>();

const emit = defineEmits(['submit', 'cancel']);

const store = useAnnouncementStore();
const { loading } = store;

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
    country: 'France', // Default
  },
  maxParticipants: 0,
  maxVolunteers: 0,
  tags: [] as string[],
  status: EventStatus.DRAFT,
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

const submit = async () => {
    // We will complete the logic here to call the store
  emit('submit', formState);
};
</script> 