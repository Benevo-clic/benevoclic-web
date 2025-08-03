<template>
  <div class="space-y-4">
    <div v-if="props.loading" class="flex justify-center items-center h-32">
      <div class="loading loading-spinner loading-lg"></div>
    </div>
    <div v-else-if="props.announcements.length === 0 && !props.loading" class="text-center text-gray-500">
      <img
          src="/images/no_data.png"
          alt="Illustration"
          class="w-full max-w-xl mx-auto"
          onerror="this.src='/images/volunteer-info.png'"
      />
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl1285:grid-cols-3 gap-4">
      <VolunteerAnnouncementCard
          v-for="announcement in props.announcements"
          :key="announcement._id"
          :announcement="announcement"
          @favorite="toggleFavorite"
          :is-connected="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type {Announcement} from "../../../common/interface/event.interface";
import VolunteerAnnouncementCard from "../volunteer/VolunteerAnnouncementCard.vue";


const props = defineProps<
    {
      announcements: Announcement[];
      totalAnnouncements: number;
      error: string | null;
      loading: boolean;
    }
>()

async function toggleFavorite(announcement: Announcement) {
  console.log("Toggle favorite for announcement:", announcement._id);
}

</script>
