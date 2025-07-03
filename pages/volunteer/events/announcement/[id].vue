<template>
  <div ref="scrollContainer" class="relative">
    <div v-if="loading" class="flex justify-center items-center h-32">
      <span class="loading loading-bars loading-xl"></span>
    </div>
    <div v-else class="container mx-auto px-2 md:px-4 py-6 max-w-4xl">
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
      <!-- Informations de l'association -->
      <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6 relative">
        <div class="flex items-center gap-3 mb-2">
          <div v-if="announcement?.associationLogo?.data" class="avatar">
            <div class="ring-primary ring-offset-base-100 w-14 rounded-full ring-2 ring-offset-2">
              <img :src="profileImageUrl" alt="Logo association" />
            </div>
          </div>
          <div v-else class="avatar placeholder">
            <div class="w-14 h-14 rounded-full bg-base-300 text-base-content ring-primary ring-offset-base-100 ring-2 ring-offset-2">
              <span class="text-lg font-bold">{{ announcement?.associationName?.charAt(0) || 'A' }}</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-base font-semibold text-base-content truncate">{{ announcement?.associationName }}</p>
          </div>
          <!-- Bouton Adhérer -->
          <div class="flex-shrink-0">
            <button 
              class="btn btn-sm"
              :class="followButtonClass"
              @click="toggleFollowAssociation"
            >
              <UserPlus v-if="!isFollowing" class="w-4 h-4 mr-1" />
              <Clock v-else-if="isFollowingPending" class="w-4 h-4 mr-1" />
              <UserCheck v-else class="w-4 h-4 mr-1" />
              {{ followButtonText }}
            </button>
          </div>
        </div>
      </div>

      <!-- Infos principales -->
      <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6 relative">
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
      </div>

      <!-- Boutons d'action de participation -->
      <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6">
        <h2 class="text-xl font-bold mb-4">Participer à cet événement</h2>
        <div v-if="loadingVolunteer" class="flex justify-center items-center">
          <span class="loading loading-spinner loading-md"></span>
        </div>
        <div v-else class="flex flex-col sm:flex-row gap-3">

          <button
              class="btn btn-neutral flex-1"
              :disabled="!canParticipateAsVolunteer"
              @click="cancelVolunteerParticipationWaitingList"
              v-if="isAlreadyVolunteerWaiting"
          >
            <HeartHandshake class="w-5 h-5 mr-2" />
            Bénévole
            <span  class="badge badge-warning ml-2">En attente</span>
          </button>
          <button
              class="btn btn-neutral flex-1"
              @click="cancelVolunteerParticipation"
              v-else-if="isAlreadyVolunteer"
          >
            <HeartHandshake class="w-5 h-5 mr-2" />
            Bénévole
            <span  class="badge badge-success ml-2">Annuler</span>
          </button>
          <button
              class="btn btn-primary flex-1"
              :disabled="!canParticipateAsVolunteer"
              @click="participateAsVolunteer"
              v-else
          >
            <HeartHandshake class="w-5 h-5 mr-2" />
            Bénévole
            <span v-if="!canParticipateAsVolunteer" class="badge badge-warning ml-2">Complet</span>
          </button>
          <button 
            class="btn btn-secondary flex-1" 
            :disabled="!canParticipateAsParticipant"
            @click="participateAsParticipant"
            v-if="!alreadyParticipating"
          >
            <Users class="w-5 h-5 mr-2" />
            Participer
            <span v-if="!canParticipateAsParticipant" class="badge badge-warning ml-2">Complet</span>
          </button>
          <button
            class="btn btn-neutral flex-1"
            @click="cancelParticipation"
            v-else>
            <Users class="w-5 h-5 mr-2" />
            Participer
            <span  class="badge badge-secondary ml-2">Annuler</span>
          </button>
        </div>
      </div>


      <!-- Galerie photo -->

      <!-- Carte interactive -->
      <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6">
        <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
          <MapPin class="w-5 h-5 text-primary" />
          Localisation
        </h3>
        <div class="h-64 md:h-80 rounded-lg overflow-hidden bg-base-200 relative">
          <!-- Placeholder pour la carte -->
          <div class="w-full h-full flex items-center justify-center">
            <div class="text-center">
              <MapPin class="w-12 h-12 mx-auto mb-2 text-primary" />
              <p class="text-base-content/70">{{ announcement?.locationAnnouncement?.address || 'Adresse non disponible' }}</p>
              <p class="text-sm text-base-content/50">{{ announcement?.locationAnnouncement?.city }}, {{ announcement?.locationAnnouncement?.postalCode }}</p>
            </div>
          </div>
          <!-- Bouton pour ouvrir dans Google Maps -->
          <button 
            class="btn btn-primary btn-sm absolute bottom-4 right-4"
            @click="openInGoogleMaps"
          >
            <ExternalLink class="w-4 h-4 mr-1" />
            Voir sur la carte
          </button>
        </div>
      </div>

      <!-- Informations pratiques -->
      <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6">
        <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
          <Info class="w-5 h-5 text-primary" />
          Informations pratiques
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <Calendar class="w-5 h-5 text-primary" />
              <div>
                <p class="font-medium">Date et heure</p>
                <p class="text-sm text-base-content/70">{{ formatDate(announcement?.dateEvent) }} à {{ announcement?.hoursEvent }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <MapPin class="w-5 h-5 text-primary" />
              <div>
                <p class="font-medium">Adresse</p>
                <p class="text-sm text-base-content/70">{{ announcement?.locationAnnouncement?.address }}</p>
                <p class="text-sm text-base-content/70">{{ announcement?.locationAnnouncement?.city }}, {{ announcement?.locationAnnouncement?.postalCode }}</p>
              </div>
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <Users class="w-5 h-5 text-primary" />
              <div>
                <p class="font-medium">Places disponibles</p>
                <p class="text-sm text-base-content/70">{{ remainingParticipants }} participants, {{ remainingVolunteers }} bénévoles</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Tag class="w-5 h-5 text-primary" />
              <div>
                <p class="font-medium">Type d'événement</p>
                <p class="text-sm text-base-content/70">{{ announcement?.tags?.join(', ') || 'Général' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal pour les photos -->

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
import { ref, onMounted, computed, onUnmounted, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import {definePageMeta} from "#imports";
import {EventStatus} from "~/common/enums/event.enum";
import {
  HeartHandshake, Users, Calendar, Clock, MapPin, ExternalLink, Info,
  Tag, UserPlus, UserCheck
} from 'lucide-vue-next'
import {useAnnouncement} from '~/composables/useAnnouncement';
import {useVolunteerAuth} from "~/composables/useVolunteer";
import type { AssociationVolunteerFollow } from '~/common/interface/volunteer.interface';

const route = useRoute();
const announcementUse = useAnnouncement();
const volunteerUse = useVolunteerAuth();
const loading = ref(true);
const loadingVolunteer = computed(() => announcementUse.loading.value)
const announcement = announcementUse.getCurrentAnnouncement;

const volunteerId = computed(() => volunteerUse.volunteer?.value?.volunteerId);
const associationId = computed(() => announcement.value?.associationId);

// Listes réactives pour l'état d'adhésion
const associationsWaitingList = ref<AssociationVolunteerFollow[]>([]);
const associationsFollowingList = ref<AssociationVolunteerFollow[]>([]);

const isFollowingPending = computed(() =>
  associationsWaitingList.value.some(a => a.associationId === associationId.value)
);
const isFollowing = computed(() =>
  associationsFollowingList.value.some(a => a.associationId === associationId.value)
);

const followButtonText = computed(() => {
  if (isFollowingPending.value) return 'Attente de validation';
  if (isFollowing.value) return 'Adhérent';
  return 'Adhérer';
});

const followButtonClass = computed(() => {
  if (isFollowingPending.value) return 'btn-warning';
  if (isFollowing.value) return 'btn-success';
  return 'btn-primary';
});

async function refreshFollowState() {
  if (!volunteerId.value) return;
  associationsWaitingList.value = await volunteerUse.getAllAssociationsToWaitingList(volunteerId.value);
  associationsFollowingList.value = await volunteerUse.getAllAssociationsFollowingList(volunteerId.value);
}

onMounted(async () => {
  await fetchAnnouncement();
  if (volunteerUse.volunteer.value?.volunteerId) {
    await refreshFollowState();
  } else {
    const stop = watch(
      () => volunteerUse.volunteer.value?.volunteerId,
      async (id) => {
        if (id) {
          await nextTick();
          await refreshFollowState();
          stop();
        }
      },
      { immediate: true }
    );
    if (!volunteerUse.volunteer.value) {
      await volunteerUse.getVolunteerInfo();
    }
  }
});

async function fetchAnnouncement() {
  if (route.params.id) {
    announcementUse.invalidateCache();
    await announcementUse.fetchAnnouncementById(route.params.id as string);
    loading.value = announcementUse.loading.value;
  }
}

async function toggleFollowAssociation() {
  if (!volunteerId.value || !associationId.value) return;
  if (isFollowingPending.value) {
    await volunteerUse.removeVolunteerFromWaitingListAssociation(associationId.value);
  } else if (isFollowing.value) {
    await volunteerUse.removeVolunteerFromAssociation(associationId.value, volunteerId.value);
  }else {
    await volunteerUse.addVolunteerToWaitingListAssociation(associationId.value, {
      id: volunteerId.value,
      name: volunteerUse.volunteer.value?.firstName + ' ' + volunteerUse.volunteer.value?.lastName
    });
  }
  await refreshFollowState();
}

const remainingParticipants = computed(() => {
  const max = announcement.value?.maxParticipants || 0;
  const current = announcement.value?.nbParticipants || 0;
  return Math.max(0, max - current);
});

const remainingVolunteers = computed(() => {
  const max = announcement.value?.maxVolunteers || 0;
  const current = announcement.value?.nbVolunteers || 0;
  return Math.max(0, max - current);
});

const canParticipateAsVolunteer = computed(() => remainingVolunteers.value > 0);
const canParticipateAsParticipant = computed(() => remainingParticipants.value > 0);
const alreadyParticipating = computed(() => {
  const volunteerId = volunteerUse.volunteer?.value?.volunteerId;
  return announcement.value?.participants?.some(p => p.id === volunteerId) || false;
});
const isAlreadyVolunteerWaiting = computed(() => {
  const volunteerId = volunteerUse.volunteer?.value?.volunteerId;
  return announcement.value?.volunteersWaiting?.some(v => v.id === volunteerId) || false;
});

const isAlreadyVolunteer = computed(() => {
  const volunteerId = volunteerUse.volunteer?.value?.volunteerId;
  return announcement.value?.volunteers?.some(v => v.id === volunteerId) || false;
});

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

function participateAsVolunteer() {
  if(!announcement.value?._id || !volunteerUse.volunteer?.value?.volunteerId) {
    console.error('Aucun événement sélectionné pour la participation');
    return;
  }
  if(!canParticipateAsVolunteer.value) {
    console.warn('Aucune place disponible pour participer en tant que bénévole');
    return;
  }

  if(isAlreadyVolunteerWaiting.value) {
    console.warn('Vous êtes déjà inscrit à cet événement en tant que bénévole');
    return;
  }

  announcementUse.addVolunteerWaiting(announcement.value?._id, {
    id: volunteerUse.volunteer?.value?.volunteerId,
    name: volunteerUse.volunteer?.value?.firstName + ' ' + volunteerUse.volunteer?.value?.lastName,
  });

}

function participateAsParticipant() {
  if(!announcement.value?._id || !volunteerUse.volunteer?.value?.volunteerId) {
    console.error('Aucun événement sélectionné pour la participation');
    return;
  }
  if(!alreadyParticipating.value){
    console.log('Participation en tant que participant');
  } else {
    console.warn('Vous êtes déjà inscrit à cet événement en tant que participant');
    return;
  }

  announcementUse.addParticipant(announcement.value?._id, {
    id: volunteerUse.volunteer?.value?.volunteerId,
    name: volunteerUse.volunteer?.value?.firstName + ' ' + volunteerUse.volunteer?.value?.lastName,
  });

}


function cancelParticipation() {
  if(!announcement.value?._id || !volunteerUse.volunteer?.value?.volunteerId) {
    console.error('Aucun événement sélectionné pour l\'annulation de participation');
    return;
  }
  announcementUse.removeParticipant(announcement.value?._id, volunteerUse.volunteer?.value?.volunteerId);
}

function cancelVolunteerParticipationWaitingList() {
  if(!announcement.value?._id || !volunteerUse.volunteer?.value?.volunteerId) {
    console.error('Aucun événement sélectionné pour l\'annulation de participation en tant que bénévole');
    return;
  }
  announcementUse.removeVolunteerWaiting(announcement.value?._id, volunteerUse.volunteer?.value?.volunteerId);
}

function cancelVolunteerParticipation() {
  if(!announcement.value?._id || !volunteerUse.volunteer?.value?.volunteerId) {
    console.error('Aucun événement sélectionné pour l\'annulation de participation en tant que bénévole');
    return;
  }
  announcementUse.removeVolunteer(announcement.value?._id, volunteerUse.volunteer?.value?.volunteerId);
}

function openInGoogleMaps() {
  const address = announcement.value?.locationAnnouncement?.address;
  const city = announcement.value?.locationAnnouncement?.city;
  const postalCode = announcement.value?.locationAnnouncement?.postalCode;
  
  if (address && city) {
    const fullAddress = `${address}, ${city} ${postalCode || ''}`;
    const encodedAddress = encodeURIComponent(fullAddress);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(googleMapsUrl, '_blank');
  }
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

.bg-base-100 {
  transition: transform 0.2s ease-in-out;
}

.bg-base-100:hover {
  transform: translateY(-2px);
}

.badge {
  transition: all 0.2s ease-in-out;
}

@media (max-width: 640px) {
  .btn {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
  }
}
</style>