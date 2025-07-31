<template>
  <div
      class="group card bg-base-100 shadow-lg hover:shadow-xl border border-base-300 hover:border-primary/20 rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden text-base"
      @click="goToDetails"
  >
    <!-- Image de couverture -->
    <div class="relative overflow-hidden">
      <figure class="h-36 bg-gradient-to-br from-base-200 to-base-300">
        <img
            v-if="announcement.announcementImage"
            :src="coverImageUrl"
            alt="Image de l'événement"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div v-else class="w-full h-full flex flex-col items-center justify-center text-base-content/60">
          <div class="avatar placeholder mb-2">
            <div class="bg-base-300 text-base-content rounded-full w-12">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p class="text-sm font-medium">Aucune image</p>
        </div>
      </figure>

      <!-- Badge de statut -->
      <div class="absolute top-2 right-2">
        <div class="badge badge-sm" :class="statusBadgeClass">
          {{ announcement.status }}
        </div>
      </div>
    </div>

    <div class="card-body p-5">

      <!-- Titre -->
      <h3 class="card-title text-lg font-bold mb-3 line-clamp-1 group-hover:text-primary transition-colors">
        {{ announcement.nameEvent }}
      </h3>

      <!-- Description -->
      <p class="text-sm text-base-content/70 mb-4 line-clamp-2 leading-relaxed">
        {{ truncatedDescription }}
      </p>

      <!-- Infos principales -->
      <div class="flex items-center gap-4 mb-4 text-sm flex-wrap">
        <!-- Date / Heure -->
        <div class="flex items-center gap-2">
          <Calendar class="h-4 w-4 text-primary" />
          <span class="font-medium">{{ new Date(announcement.dateEvent).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) }}</span>
          <span class="text-base-content/60">•</span>
          <span>{{ announcement.hoursEvent }}</span>
        </div>

        <!-- Ville -->
        <div v-if="announcement.addressAnnouncement?.city" class="flex items-center gap-2">
          <MapPin class="h-4 w-4 text-secondary" />
          <span class="truncate max-w-[100px]">{{ announcement.addressAnnouncement.city }}</span>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="flex gap-6 mb-4 text-sm">
        <div class="flex items-center gap-2">
          <Users class="h-4 w-4 text-primary" />
          <span class="font-medium">{{announcement.nbParticipants}}/{{ announcement.maxParticipants }}</span>
          <span class="text-base-content/60">participants</span>
        </div>

        <div class="flex items-center gap-2">
          <HeartHandshake class="h-4 w-4 text-secondary" />
          <span class="font-medium">{{announcement.nbVolunteers}}/{{ announcement.maxVolunteers }}</span>
          <span class="text-base-content/60">bénévoles</span>
        </div>
      </div>

      <!-- Tags et CTA -->
      <div class="flex items-center justify-between">
        <!-- Tags -->
        <div v-if="announcement.tags?.length" class="flex flex-wrap gap-2">
          <div
              v-for="tag in announcement.tags.slice(0, 2)"
              :key="tag"
              class="badge badge-outline text-sm hover:badge-primary transition-colors text-base-content border-base-content focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-1"
              tabindex="0"
              role="button"
              :aria-label="`Filtrer par tag : ${tag}`"
          >
            <span class="text-base-content/70 group-hover:text-primary transition-colors">{{ tag }}</span>
          </div>
          <div v-if="announcement.tags.length > 2" class="badge badge-ghost text-sm text-neutral">
            <span class="text-base-content/70 group-hover:text-primary transition-colors">+{{ announcement.tags.length - 2 }}</span>
          </div>
        </div>

        <!-- Bouton Détails -->
        <div class="btn btn-primary btn-sm gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Détails
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
import {HeartHandshake,Users,Calendar,MapPin} from 'lucide-vue-next'
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

const coverImageUrl = computed(() => {
  return  props.announcement.announcementImage;
});


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
