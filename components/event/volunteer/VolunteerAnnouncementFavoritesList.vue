<template>
  <div class="space-y-4">
    <div v-if="props.loading" class="flex justify-center items-center h-32">
      <span class="loading loading-bars loading-xl"></span>
    </div>
    <div v-else-if="props.error" class="p-4 text-red-600 bg-red-100 rounded-md">
      <p>Une erreur est survenue: {{ props.error }}</p>
    </div>
    <div v-else-if="props.announcementFavorites?.length === 0" class="text-center text-gray-500">
      <p>Aucune annonce à afficher pour le moment.</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl1285:grid-cols-3 gap-4">
      <div class="col-span-full">
        <h2 class="text-lg font-semibold mb-0">
          {{ props.announcementFavorites?.length }} annonces
        </h2>
      </div>
      <VolunteerAnnouncementCard
          v-for="announcement in props.announcementFavorites"
          :key="announcement._id"
          :announcement="announcement"
          :is-favorite="true"
          @favorite="toggleFavorite"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type {Announcement} from "~/common/interface/event.interface";
import VolunteerAnnouncementCard from "~/components/event/volunteer/VolunteerAnnouncementCard.vue";
import {useFavoritesAnnouncement} from "~/composables/useFavoritesAnnouncement";
import {useUser} from "~/composables/auth/useUser";

const props = defineProps<
    {
      announcementFavorites: Announcement[];
      error: string | null;
      loading: boolean;
    }
>()
const useFavorite = useFavoritesAnnouncement();
const { user } = useUser()

watch(
    () => props.announcementFavorites,
    (newAnnouncements) => {
      console.log("New announcements received:", newAnnouncements);
    },
    { immediate: true }
)

async function refreshFavorites() {
  if (!user.value) return
  await useFavorite.fetchAllFavoritesOfVolunteer(user.value.userId)
}


async function removeFavorite(announcementId: string , volunteerId: string) {
  try {
    await useFavorite.removeByVolunteerIdAndAnnouncementId(announcementId, volunteerId);
  } catch (error) {
    console.error("Error removing favorite:", error);
  }
}

async function toggleFavorite(announcement: Announcement) {
  if (!user.value) return

  await removeFavorite(announcement._id, user.value.userId)
  await refreshFavorites()
}

</script>
