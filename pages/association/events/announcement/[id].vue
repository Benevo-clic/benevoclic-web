<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center h-32">
      <span class="loading loading-bars loading-xl"></span>
    </div>
    <div v-else class="container mx-auto px-2 md:px-4 py-6 max-w-3xl">
      <!-- Photo de couverture -->
      <div class="relative w-full aspect-[3/1] rounded-xl overflow-hidden mb-4 bg-base-200 flex items-center justify-center">
        <img v-if="announcement?.announcementImage?.data" :src="coverImageUrl" alt="Photo de couverture" class="object-cover w-full h-full" />
        <div v-else class="w-full h-full flex flex-col items-center justify-center text-base-content/60">
          <div class="avatar placeholder mb-2">
            <div class="bg-neutral text-neutral-content rounded-full w-16">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p class="text-sm font-medium">Aucune image</p>
        </div>
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
        <!-- Boutons d'action -->
        <div class="flex justify-end gap-2 mt-4">
          <button class="btn btn-primary" @click="openEditModal">Modifier l'évènement</button>
          <button class="btn btn-error" @click="showDeleteConfirmation">Supprimer</button>
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
    <dialog ref="deleteConfirmationModal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">{{ $t('announcements.delete_confirmation.title') }}</h3>
        <p class="py-4">{{ $t('announcements.delete_confirmation.message') }}</p>
        <div class="modal-action">
          <button @click="cancelDelete" class="btn">{{ $t('announcements.delete_confirmation.cancel') }}</button>
          <button @click="confirmDelete" class="btn btn-error">{{ $t('announcements.delete_confirmation.confirm') }}</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAnnouncementStore } from '~/stores/announcement.store';
import AnnouncementEditForm from '~/components/event/AnnouncementEditForm.vue';
import VolunteersList from '~/components/event/VolunteersList.vue';
import ParticipantsList from '~/components/event/ParticipantsList.vue';
import type { Announcement } from '~/common/interface/event.interface';
import {definePageMeta} from "#imports";
import {EventStatus} from "~/common/enums/event.enum";
const deleteConfirmationModal = ref<HTMLDialogElement | null>(null)


const route = useRoute();
const router = useRouter();
const announcementStore = useAnnouncementStore();
const announcement = ref<Announcement | null>(null);
const loading = ref(true);
const editModalOpen = ref(false);
const tab = ref<'participants' | 'volunteers'>('participants');

definePageMeta({
  middleware: ['auth'],
  layout: 'header',
})

onMounted(fetchAnnouncement);

async function fetchAnnouncement() {
  console.log('Fetching announcement with ID:', route.params.id);
  if (route.params.id) {
    await announcementStore.fetchAnnouncementById(route.params.id as string);
    announcement.value = announcementStore.currentAnnouncement || null;
    loading.value = announcementStore.loading;
  }
}

function openEditModal() {
  editModalOpen.value = true;
}

function showDeleteConfirmation() {
  deleteConfirmationModal.value?.showModal()
}


function closeEditModal() {
  editModalOpen.value = false;
}

function refresh() {
  fetchAnnouncement();
  closeEditModal();
}

function cancelDelete() {
  deleteConfirmationModal.value?.close()
}

function confirmDelete() {
  // Close the modal
  deleteConfirmationModal.value?.close()

  // Proceed with account deletion
  announcementDelete()
}

async function announcementDelete() {
  if (!announcement.value) return;
    await announcementStore.removeAnnouncement(announcement.value._id);
    navigateTo('/association/events/association/manage');
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