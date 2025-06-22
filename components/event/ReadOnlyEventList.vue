<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex justify-center items-center h-32">
      <span class="loading loading-bars loading-xl"></span>
    </div>
    <div v-else-if="error" class="p-4 text-red-600 bg-red-100 rounded-md">
        <p>Une erreur est survenue: {{ error }}</p>
    </div>
    <div v-else-if="announcements.length === 0" class="text-center text-gray-500">
        <p>Aucune annonce à afficher pour le moment.</p>
    </div>
    <div v-else>
      <ReadOnlyEventCard
        v-for="announcement in announcements" 
        :key="announcement._id"
        :announcement="announcement"
        class="mb-4"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ReadOnlyEventCard from './ReadOnlyEventCard.vue';
import { useAnnouncement } from "~/composables/useAnnouncement";



const announcement = useAnnouncement()

const announcements =  announcement.getAnnouncements
const loading = announcement.loading
const error =  announcement.error


</script>