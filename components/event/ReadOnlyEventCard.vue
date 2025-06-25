<template>
  <div
    class="group card bg-base-100 shadow-lg hover:shadow-xl border border-base-300 hover:border-primary/20 rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
    @click="goToDetails"
  >
    <!-- Image de couverture avec overlay -->
    <div class="relative overflow-hidden">
      <figure class="h-32 bg-gradient-to-br from-base-200 to-base-300">
        <img 
          v-if="announcement.announcementImage?.data" 
          :src="coverImageUrl" 
          alt="Image de l'événement" 
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div v-else class="w-full h-full flex flex-col items-center justify-center text-base-content/60">
          <div class="avatar placeholder mb-1">
            <div class="bg-base-300 text-base-content rounded-full w-10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p class="text-xs font-medium">Aucune image</p>
        </div>
      </figure>
      
      <!-- Status badge overlay -->
      <div class="absolute top-2 right-2">
        <div class="badge badge-xs" :class="statusBadgeClass">
          {{ announcement.status }}
        </div>
      </div>
    </div>

    <div class="card-body p-4">
      <!-- Header avec logo association -->
      <div class="flex items-center gap-2 mb-2">
        <div v-if="announcement.associationLogo?.data" class="avatar">
          <div class="w-6 h-6 rounded-full ring-1 ring-base-300">
            <img :src="profileImageUrl" alt="Logo association" />
          </div>
        </div>
        <div v-else class="avatar placeholder">
          <div class="w-6 h-6 rounded-full bg-base-300 text-base-content">
            <span class="text-xs font-bold">{{ announcement.associationName?.charAt(0) || 'A' }}</span>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-base-content truncate">{{ announcement.associationName }}</p>
        </div>
      </div>

      <!-- Titre de l'événement -->
      <h3 class="card-title text-base font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
        {{ announcement.nameEvent }}
      </h3>

      <!-- Description -->
      <p class="text-xs text-base-content/70 mb-3 line-clamp-2 leading-relaxed">
        {{ truncatedDescription }}
      </p>

      <!-- Informations principales compactes -->
      <div class="flex items-center gap-4 mb-3 text-xs">
        <!-- Date et Heure -->
        <div class="flex items-center gap-1">
          <Calendar class="h-3 w-3 text-primary" />
          <span class="font-medium">{{ new Date(announcement.dateEvent).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) }}</span>
          <span class="text-base-content/60">•</span>
          <span>{{ announcement.hoursEvent }}</span>
        </div>

        <!-- Lieu -->
        <div v-if="announcement.locationAnnouncement?.city" class="flex items-center gap-1">
          <MapPin class="h-3 w-3 text-secondary" />
          <span class="truncate max-w-[80px]">{{ announcement.locationAnnouncement.city }}</span>
        </div>
      </div>

      <!-- Statistiques compactes -->
      <div class="flex gap-4 mb-3">
        <div class="flex items-center gap-1 text-xs">
          <Users class="h-3 w-3 text-primary" />
          <span class="font-medium">{{announcement.nbParticipants}}/{{ announcement.maxParticipants }}</span>
          <span class="text-base-content/60">participants</span>
        </div>
        
        <div class="flex items-center gap-1 text-xs">
          <HeartHandshake class="h-3 w-3 text-secondary" />
          <span class="font-medium">{{announcement.nbVolunteers}}/{{ announcement.maxVolunteers }}</span>
          <span class="text-base-content/60">bénévoles</span>
        </div>
      </div>

      <!-- Tags et action -->
      <div class="flex items-center justify-between">
        <!-- Tags -->
        <div v-if="announcement.tags && announcement.tags.length > 0" class="flex gap-1">
          <div 
            v-for="tag in announcement.tags.slice(0, 2)" 
            :key="tag" 
            class="badge badge-outline badge-xs hover:badge-primary transition-colors"
          >
            {{ tag }}
          </div>
          <div v-if="announcement.tags.length > 2" class="badge badge-ghost badge-xs">
            +{{ announcement.tags.length - 2 }}
          </div>
        </div>

        <!-- Indicateur de clic -->
        <div class="btn btn-primary btn-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Détails
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Announcement } from '~/common/interface/event.interface';
import { EventStatus } from '~/common/enums/event.enum';
import {HeartHandshake,Users,Calendar,Clock,MapPin} from 'lucide-vue-next'
import { navigateTo } from '#app';

const props = defineProps<{
  announcement: Announcement;
}>();

const statusBadgeClass = computed(() => {
  switch (props.announcement.status) {
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


const profileImageUrl = computed(() => {
  const img = props.announcement.associationLogo;
  if (img?.data && img.contentType) {
    return `data:${img.contentType};base64,${img.data}`
  }
  return ''
})

const coverImageUrl = computed(() => {
  const img = props.announcement.announcementImage;
  if (img?.data && img.contentType) {
    return `data:${img.contentType};base64,${img.data}`
  }
  return ''
});

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const MAX_LEN = 100

const truncatedDescription = computed(() => {
  const desc = props.announcement.description || ''
  return desc.length > MAX_LEN
      ? desc.substring(0, MAX_LEN) + '…'
      : desc
})

function goToDetails() {
  navigateTo(`/association/events/announcement/${props.announcement._id}`)
}
</script>
