<template>
  <div class="mx-auto px-4 py-6 max-w-screen-2xl w-full">
    <div class="container mx-auto px-4 w-full">
      <div class="bg-base-100 rounded-lg shadow-md p-6 w-full">
        <div class="flex flex-col items-center w-full">
          <VolunteerEventFavoritesFilters class="mb-4"
                                 @map="() => {}"
                                 @sort="() => {}"
                                 @location="() => {}"
                                 @type="() => {}"
                                 @duration="() => {}"
                                 @filters="() => {}"
          />
        </div>
      </div>
    </div>
    <div class="container mx-auto px-4 py-4">
      <div class="bg-base-100 rounded-lg shadow-md p-6">
        <VolunteerAnnouncementFavoritesList
            :announcementFavorites="announcementFavorites as Announcement[]"
            :error="error.value"
            :loading="loading.value"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {definePageMeta, useAnnouncement, useFavoritesAnnouncement} from "#imports";
import { onMounted, computed } from 'vue';
import {useUser} from "~/composables/auth/useUser";
import VolunteerEventFavoritesFilters from "~/components/event/volunteer/VolunteerEventFavoritesFilters.vue";
import VolunteerAnnouncementFavoritesList from "~/components/event/volunteer/VolunteerAnnouncementFavoritesList.vue";
import type {Announcement} from "~/common/interface/event.interface";

definePageMeta({
  middleware: ['auth'],
  layout: 'header'
})

const announcement = useAnnouncement();
const useFavorite = useFavoritesAnnouncement();
const { user, initializeUser } = useUser()

const favorites = computed(() => useFavorite.getFavorites);
const announcements = computed(() => announcement.getAnnouncements);
const loading = computed(() => announcement.loading);
const error = computed(() => announcement.error);

onMounted(async () => {
  await initializeUser();
  await announcement.fetchAllAnnouncements();
  if (user.value) {
    await useFavorite.fetchAllFavoritesOfVolunteer(user.value.userId);
  }
});

const announcementFavorites = computed(() => {
  return favorites.value.value.map(fav => {
    const announcement = announcements.value.value.find(a => a._id === fav.announcementId);
    return announcement ? { ...announcement, isFavorite: true } : null;
  }).filter(a => a?.status !== 'INACTIVE');
});

</script>