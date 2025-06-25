<template>
  <div class="group card bg-base-100 shadow-lg border border-base-300 rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden relative">
    <!-- Image de couverture -->
    <div class="relative overflow-hidden">
      <figure class="h-32 bg-gradient-to-br from-base-200 to-base-300">
        <img v-if="announcement.announcementImage?.data" :src="coverImageUrl" alt="Image de l'événement" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
      <!-- Icône coeur favoris -->
      <button class="absolute top-2 right-2 z-10 btn btn-circle btn-sm bg-base-100/80 hover:bg-error/20 transition" @click.stop="$emit('favorite', announcement)">
        <span v-if="isFavorite">
          <!-- Heart filled SVG -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-error" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.5 16 21 16 21H12Z" />
          </svg>
        </span>
        <span v-else>
          <Heart class="h-6 w-6 text-base-content/60" />
        </span>
      </button>
    </div>
    <div class="card-body p-4">
      <h3 class="card-title text-base font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
        {{ announcement.nameEvent }}
      </h3>
      <p class="text-xs text-base-content/70 mb-3 line-clamp-2 leading-relaxed">
        {{ announcement.description }}
      </p>
      <div class="flex items-center gap-4 mb-3 text-xs">
        <div class="flex items-center gap-1">
          <Calendar class="h-3 w-3 text-primary" />
          <span class="font-medium">{{ new Date(announcement.dateEvent).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) }}</span>
          <span class="text-base-content/60">•</span>
          <span>{{ announcement.hoursEvent }}</span>
        </div>
        <div v-if="announcement.locationAnnouncement?.city" class="flex items-center gap-1">
          <MapPin class="h-3 w-3 text-secondary" />
          <span class="truncate max-w-[80px]">{{ announcement.locationAnnouncement.city }}</span>
        </div>
      </div>
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
      <div v-if="announcement.tags && announcement.tags.length > 0" class="flex gap-1">
        <div v-for="tag in announcement.tags.slice(0, 2)" :key="tag" class="badge badge-outline badge-xs hover:badge-primary transition-colors">
          {{ tag }}
        </div>
        <div v-if="announcement.tags.length > 2" class="badge badge-ghost badge-xs">
          +{{ announcement.tags.length - 2 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Announcement } from '~/common/interface/event.interface';
import { Heart, HeartHandshake, Users, Calendar, MapPin } from 'lucide-vue-next';

const props = defineProps<{
  announcement: Announcement,
  isFavorite?: boolean
}>();

const coverImageUrl = computed(() => {
  const img = props.announcement.announcementImage;
  if (img?.data && img.contentType) {
    return `data:${img.contentType};base64,${img.data}`
  }
  return ''
});
</script> 