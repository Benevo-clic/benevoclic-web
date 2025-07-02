<template>
  <div ref="scrollContainer" class="relative">
    <div v-if="loading" class="flex justify-center items-center h-32">
      <span class="loading loading-bars loading-xl"></span>
    </div>
    <div v-else class="container mx-auto px-2 md:px-4 py-6 max-w-2xl">
      <!-- Photo de couverture moderne -->
      <div class="relative w-full aspect-[3/1] rounded-2xl overflow-hidden mb-6 bg-base-200 flex items-center justify-center shadow-md">
        <img v-if="announcement?.announcementImage?.data" :src="coverImageUrl" alt="Photo de couverture" class="object-cover w-full h-full transition-transform duration-500" />
        <div v-else class="w-full h-full flex flex-col items-center justify-center text-base-content/60">
          <div class="avatar placeholder mb-3">
            <div class="bg-base-300 text-base-content rounded-full w-16">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p class="text-sm font-medium">Aucune image</p>
        </div>
        <!-- Status badge overlay -->
        <div class="absolute top-3 right-3">
          <div class="badge badge-md" :class="statusBadgeClass">{{ announcement?.status }}</div>
        </div>
      </div>

      <!-- Infos principales -->
      <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6 relative">
        <div class="flex items-center gap-3 mb-2">
          <div v-if="announcement?.associationLogo?.data" class="avatar">
            <div class="w-10 h-10 rounded-full ring-2 ring-base-300">
              <img :src="profileImageUrl" alt="Logo association" />
            </div>
          </div>
          <div v-else class="avatar placeholder">
            <div class="w-10 h-10 rounded-full bg-base-300 text-base-content">
              <span class="text-xs font-bold">{{ announcement?.associationName?.charAt(0) || 'A' }}</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-base font-semibold text-base-content truncate">{{ announcement?.associationName }}</p>
          </div>
        </div>
        <h1 class="text-2xl font-bold mb-2 line-clamp-2">{{ announcement?.nameEvent }}</h1>
        <div class="flex flex-wrap gap-2 text-sm text-base-content/70 mb-2">
          <span class="flex items-center gap-1"><Calendar class="h-4 w-4 text-primary" />{{ formatDate(announcement?.dateEvent) }}</span>
          <span v-if="announcement?.hoursEvent" class="flex items-center gap-1"><Clock class="h-4 w-4 text-primary" />{{ announcement.hoursEvent }}</span>
          <span v-if="announcement?.locationAnnouncement?.city" class="flex items-center gap-1"><MapPin class="h-4 w-4 text-secondary" />{{ announcement.locationAnnouncement.city }}</span>
        </div>
        <div class="mb-3 text-base-content/90">{{ announcement?.description }}</div>
        <div class="flex flex-wrap gap-2 mt-2">
          <span v-for="tag in announcement?.tags" :key="tag" class="badge badge-outline badge-sm hover:badge-primary transition-colors">{{ tag }}</span>
        </div>
        <!-- Statistiques -->
        <div class="flex gap-4 mt-4 mb-2">
          <div class="flex items-center gap-1 text-xs">
            <Users class="h-4 w-4 text-primary" />
            <span class="font-medium">{{announcement?.nbParticipants}}/{{ announcement?.maxParticipants }}</span>
            <span class="text-base-content/60">participants</span>
          </div>
          <div class="flex items-center gap-1 text-xs">
            <HeartHandshake class="h-4 w-4 text-secondary" />
            <span class="font-medium">{{announcement?.nbVolunteers}}/{{ announcement?.maxVolunteers }}</span>
            <span class="text-base-content/60">bénévoles</span>
          </div>
        </div>
        <!-- Boutons d'action -->
        <div class="flex justify-end gap-2 mt-4 absolute top-4 right-4">
          <button class="btn btn-primary btn-sm" @click="openEditModal">Modifier</button>
          <button class="btn btn-error btn-sm" @click="showDeleteConfirmation">Supprimer</button>
        </div>
      </div>

      <!-- Onglets modernes -->
      <div role="tablist" class="tabs tabs-bordered mb-4 rounded-xl overflow-hidden bg-base-200">
        <a role="tab" :class="['tab', tab === 'participants' ? 'tab-active' : '']" @click="tab = 'participants'">Liste des participants</a>
        <a role="tab" :class="['tab', tab === 'volunteers' ? 'tab-active' : '']" @click="tab = 'volunteers'">Liste des bénévoles</a>
      </div>

      <!-- Contenu des onglets -->
      <div v-if="tab === 'participants'">
        <ParticipantsList :participants="announcement?.participants" @right-action="handleRightAction" />
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

    <!-- Indicateur scroll bas -->
    <transition name="fade">
      <div v-if="showScrollDown" class="fixed left-1/2 -translate-x-1/2 bottom-4 z-50 flex flex-col items-center pointer-events-none select-none">
        <div class="bg-base-200/80 rounded-full shadow p-2 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Faire défiler vers le bas">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </transition>
    <!-- Indicateur scroll haut -->
    <transition name="fade">
      <div v-if="showScrollUp" class="fixed left-1/2 -translate-x-1/2 top-4 z-50 flex flex-col items-center pointer-events-none select-none">
        <div class="bg-base-200/80 rounded-full shadow p-2 animate-bounce rotate-180">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Faire défiler vers le haut">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import AnnouncementEditForm from '~/components/event/association/AnnouncementEditForm.vue';
import VolunteersList from '~/components/event/association/VolunteersList.vue';
import ParticipantsList from '~/components/event/association/ParticipantsList.vue';
import {definePageMeta} from "#imports";
import {EventStatus} from "~/common/enums/event.enum";
import {HeartHandshake,Users,Calendar,Clock,MapPin} from 'lucide-vue-next'
const deleteConfirmationModal = ref<HTMLDialogElement | null>(null)
import { useAnnouncement } from '~/composables/useAnnouncement';

const route = useRoute();
const useAnnouncementAuth = useAnnouncement();
const loading = ref(true);
const editModalOpen = ref(false);
const tab = ref<'participants' | 'volunteers'>('participants');

const announcement = computed(() => useAnnouncementAuth.getCurrentAnnouncement.value);

const profileImageUrl = computed(() => {
  const img = announcement.value?.associationLogo;
  if (img?.data && img.contentType) {
    return `data:${img.contentType};base64,${img.data}`
  }
  return ''
})

const scrollContainer = ref<HTMLElement | null>(null)
const showScrollDown = ref(false)
const showScrollUp = ref(false)

definePageMeta({
  middleware: ['auth'],
  layout: 'header',
})

onMounted(fetchAnnouncement);

async function fetchAnnouncement() {
  if (route.params.id) {
    useAnnouncementAuth.invalidateCache();
    await useAnnouncementAuth.fetchAnnouncementById(route.params.id as string);
    loading.value = useAnnouncementAuth.loading.value;
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
  deleteConfirmationModal.value?.close()
  announcementDelete()
}

function handleRightAction(id: string) {
  console.log(`Retirer le participant avec l'ID: ${id}`);
  if (!announcement.value) return;
  useAnnouncementAuth.removeParticipant(announcement.value?._id, id);
}

async function announcementDelete() {
  if (!announcement.value) return;
    await useAnnouncementAuth.removeAnnouncement(announcement.value._id);
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

function checkScrollIndicators() {
  const el = document.documentElement;
  // Si le contenu dépasse la fenêtre
  if (el.scrollHeight > window.innerHeight + 10) {
    showScrollDown.value = (window.scrollY + window.innerHeight) < (el.scrollHeight - 10);
    showScrollUp.value = window.scrollY > 10;
  } else {
    showScrollDown.value = false;
    showScrollUp.value = false;
  }
}

onMounted(() => {
  checkScrollIndicators();
  window.addEventListener('scroll', checkScrollIndicators, { passive: true });
  window.addEventListener('resize', checkScrollIndicators);
});

// Nettoyage
onUnmounted(() => {
  window.removeEventListener('scroll', checkScrollIndicators);
  window.removeEventListener('resize', checkScrollIndicators);
});




</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 