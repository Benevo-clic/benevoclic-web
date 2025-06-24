<template>
  <div class="space-y-4">
    <div v-if="props.error" class="p-4 text-red-600 bg-red-100 rounded-md">
        <p>Une erreur est survenue: {{ props.error }}</p>
    </div>
    <div v-else-if="props.announcements.length === 0" class="text-center text-gray-500">
        <p>Aucune annonce à afficher pour le moment.</p>
    </div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <ReadOnlyEventCard
        v-for="announcement in props.announcements"
        :key="announcement._id"
        :announcement="announcement"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ReadOnlyEventCard from './ReadOnlyEventCard.vue';
import type {Announcement} from "~/common/interface/event.interface";

const props = defineProps<
    {
        announcements: Announcement[];
        error: string | null;
    }
>()




</script>
