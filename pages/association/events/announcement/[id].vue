<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center h-32">
      <span class="loading loading-bars loading-xl"></span>
    </div>
    <div v-else class="container mx-auto px-2 md:px-4 py-6 max-w-3xl">
      <!-- Photo de couverture -->
      <div class="relative w-full aspect-[3/1] rounded-xl overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
        <img v-if="announcement?.announcementImage?.data" :src="coverImageUrl" alt="Photo de couverture" class="object-cover w-full h-full" />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-400">Aucune image</div>
        <button class="absolute bottom-2 right-2 btn btn-sm btn-primary" @click="openEditModal">Modifier l'évènement</button>
      </div>

      <!-- Infos principales -->
      <div class="bg-base-100 rounded-lg shadow-md p-4 mb-4">
        <div class="flex items-center justify-between mb-2">
          <h1 class="text-2xl font-bold mb-2">{{ announcement?.nameEvent }}</h1>
          <div class="badge badge-soft"  :class="statusBadgeClass">{{ announcement?.status }}</div>
        </div>

        <div class="flex flex-wrap gap-2 text-sm text-gray-500 mb-2">
          <span>{{ formatDate(announcement?.dateEvent) }}</span>
          <span v-if="announcement?.hoursEvent">• {{ announcement.hoursEvent }}</span>
          <span v-if="announcement?.locationAnnouncement?.city">• {{ announcement.locationAnnouncement.city }}</span>
        </div>
        <div class="mb-2">{{ announcement?.description }}</div>
        <div class="flex flex-wrap gap-2 mt-2">
          <span v-for="tag in announcement?.tags" :key="tag" class="badge badge-outline">{{ tag }}</span>
        </div>
      </div>

      <!-- Onglets -->
      <div role="tablist" class="tabs tabs-bordered mb-4">
        <a role="tab" :class="['tab', tab === 'participants' ? 'tab-active' : '']" @click="tab = 'participants'">Liste des participants</a>
        <a role="tab" :class="['tab', tab === 'volunteers' ? 'tab-active' : '']" @click="tab = 'volunteers'">Liste des bénévoles</a>
      </div>

      <!-- Contenu des onglets -->
      <div v-if="tab === 'participants'">
        <ParticipantsList :participants="announcement?.participants" />
      </div>
      <div v-else>
        <VolunteersList :volunteers="announcement?.volunteers" />
      </div>

      <!-- Modal édition annonce -->
      <AnnouncementEditForm v-if="editModalOpen" :announcement="announcement" @close="closeEditModal" @saved="refresh" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAnnouncementStore } from '~/stores/announcement.store';
import AnnouncementEditForm from '~/components/event/AnnouncementEditForm.vue';
import VolunteersList from '~/components/event/VolunteersList.vue';
import ParticipantsList from '~/components/event/ParticipantsList.vue';
import type { Announcement } from '~/common/interface/event.interface';
import {definePageMeta} from "#imports";
import {EventStatus} from "~/common/enums/event.enum";

const route = useRoute();
const announcementStore = useAnnouncementStore();
const announcement = ref<Announcement | null>(null);
const loading = ref(true);
const editModalOpen = ref(false);
const tab = ref<'participants' | 'volunteers'>('participants');

definePageMeta({
  middleware: ['auth'],
  layout: 'header',
})

async function fetchAnnouncement() {
  if (route.params.id) {
    await announcementStore.fetchAnnouncementById(route.params.id as string);
    announcement.value = announcementStore.currentAnnouncement || null;
    loading.value = announcementStore.loading;
  }
}

function openEditModal() {
  editModalOpen.value = true;
}
function closeEditModal() {
  editModalOpen.value = false;
}
function refresh() {
  fetchAnnouncement();
  closeEditModal();
}

const coverImageUrl = computed(() => {
  const img = announcement.value?.announcementImage;
  if (img?.data && img.contentType) {
    return `data:${img.contentType};base64,${img.data}`;
  }
  return '';
});

function formatDate(dateString?: string) {
  if (!dateString) return '';
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}

onMounted(fetchAnnouncement);

const statusBadgeClass = computed(() => {
  switch (announcement.value?.status) {
    case EventStatus.ACTIVE:
      return 'badge-success';
    case EventStatus.INACTIVE:
      return 'badge-warning';
    case EventStatus.COMPLETED:
      return 'badge-neutral';
    default:
      return 'badge-primary';
  }
});

</script> 