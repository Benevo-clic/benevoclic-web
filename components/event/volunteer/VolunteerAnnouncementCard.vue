<template>
  <div class="group card bg-base-100 shadow-lg border border-base-300 rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden relative text-base"
       @click="goToDetails"
  >
    <!-- Image de couverture -->
    <div class="relative overflow-hidden">
      <figure class="h-36 bg-gradient-to-br from-base-200 to-base-300">
        <img
            v-if="announcement.announcementImage?.data"
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

      <!-- Bouton favoris -->
      <button
          class="absolute top-2 right-2 z-10 btn btn-circle btn-sm bg-base-100/80 hover:bg-error/20 transition"
          @click.stop="toggleFavorite"
      >
        <span v-if="favorite">
          <Heart class="w-6 h-6 text-error fill-error" />
        </span>
        <span v-else>
          <Heart class="h-6 w-6 text-base-content/60" />
        </span>
      </button>
    </div>

    <div class="card-body p-5">
      <!-- Association info -->
      <div class="flex items-center gap-3 mb-2">
        <div class="avatar">
          <div class="w-12 h-12 rounded-full">
            <img
                v-if="announcement.associationLogo?.data"
                :src="associationImageUrl"
                :alt="announcement.associationName || 'Association'"
            />
            <div v-else class="w-full h-full bg-base-300 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
        <div class="flex flex-col">
          <span class="font-medium text-sm">{{ announcement.associationName || 'Association' }}</span>
          <span class="text-xs text-base-content/60">Organisateur</span>
        </div>
      </div>

      <!-- Titre -->
      <h3 class="card-title text-lg font-bold mb-1 line-clamp-1 group-hover:text-primary transition-colors">
        {{ announcement.nameEvent }}
      </h3>



      <!-- Description -->
      <p class="text-sm text-base-content/70 mb-1 line-clamp-2 leading-relaxed">
        {{ announcement.description }}
      </p>

      <!-- Date & Lieu -->
      <div class="flex items-center flex-wrap gap-4 mb-4 text-sm">
        <div class="flex items-center gap-2">
          <Calendar class="h-4 w-4 text-primary" />
          <span class="font-medium">{{ new Date(announcement.dateEvent).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) }}</span>
          <span class="text-base-content/60">•</span>
          <span>{{ announcement.hoursEvent }}</span>
        </div>
        <div v-if="announcement.locationAnnouncement?.city" class="flex items-center gap-2">
          <MapPin class="h-4 w-4 text-secondary" />
          <span class="truncate max-w-[100px]">{{ announcement.locationAnnouncement.city }}</span>
        </div>
      </div>

      <!-- Participants & Bénévoles -->
      <div class="flex gap-6 mb-4 text-sm">
        <div class="flex items-center gap-2">
          <Users class="h-4 w-4 text-primary" />
          <span class="font-medium">{{ announcement.nbParticipants }}/{{ announcement.maxParticipants }}</span>
          <span class="text-base-content/60">participants</span>
        </div>
        <div class="flex items-center gap-2">
          <HeartHandshake class="h-4 w-4 text-secondary" />
          <span class="font-medium">{{ announcement.nbVolunteers }}/{{ announcement.maxVolunteers }}</span>
          <span class="text-base-content/60">bénévoles</span>
        </div>
      </div>

      <!-- Tags -->
      <div class="flex items-center justify-between">
        <!-- Tags -->
        <div v-if="announcement.tags?.length" class="flex flex-wrap gap-2">
          <div
              v-for="tag in announcement.tags.slice(0, 2)"
              :key="tag"
              class="badge badge-outline text-sm hover:badge-primary transition-colors"
          >
            {{ tag }}
          </div>
          <div v-if="announcement.tags.length > 2" class="badge badge-ghost text-sm">
            +{{ announcement.tags.length - 2 }}
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
import { computed, watch, ref } from 'vue';
import type { Announcement } from '~/common/interface/event.interface';
import { Heart, HeartHandshake, Users, Calendar, MapPin } from 'lucide-vue-next';
import {navigateTo} from "#app";

const props = defineProps<{
  announcement: Announcement,
  isFavorite?: boolean
}>();

const favorite = ref(props.isFavorite);

watch(
    () => props.isFavorite,
    (newValue) => {
      favorite.value = newValue;
    },
    { immediate: true }
)

const coverImageUrl = computed(() => {
  const img = props.announcement.announcementImage;
  if (img?.data && img.contentType) {
    return `data:${img.contentType};base64,${img.data}`
  }
  return ''
});

const associationImageUrl = computed(() => {
  const img = props.announcement.associationLogo;
  if (img?.data && img.contentType) {
    return `data:${img.contentType};base64,${img.data}`
  }
  return ''
});

const emit = defineEmits(['favorite', 'participate']);

function toggleFavorite() {
  favorite.value = !favorite.value;
  emit('favorite', props.announcement);
}

function participate() {
  emit('participate', props.announcement);
}

function goToDetails() {
  navigateTo(`/volunteer/events/announcement/${props.announcement._id}`)
}
</script> 