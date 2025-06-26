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
        <VolunteerAnnouncementList
            :announcements="announcements.value"
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
import VolunteerAnnouncementList from "~/components/event/volunteer/VolunteerAnnouncementList.vue";
import {useUser} from "~/composables/auth/useUser";
import VolunteerEventFavoritesFilters from "~/components/event/volunteer/VolunteerEventFavoritesFilters.vue";

definePageMeta({
  middleware: ['auth'],
  layout: 'header'
})

const announcement = useAnnouncement();
const useFavorite = useFavoritesAnnouncement();
const { user } = useUser()

const announcements = computed(() => announcement.getAnnouncements);
const loading = computed(() => announcement.loading);
const error = computed(() => announcement.error);

onMounted(async () => {
  await announcement.fetchAllAnnouncements();
  if (user.value) {
    await useFavorite.fetchAllFavoritesOfVolunteer(user.value.userId);
  }
});
</script>