<template>
  <div class="mx-auto px-4 py-6 max-w-screen-2xl w-full">
    <!-- Section filtres -->
    <div class="bg-base-100 rounded-lg shadow-md p-6 w-full">
      <div class="flex flex-col items-center w-full">
        <VolunteerEventFilters
            class="mb-4 w-full"
            @map="() => {}"
            @sort="() => {}"
            @location="() => {}"
            @type="() => {}"
            @duration="() => {}"
            @filters="() => {}"
        />
      </div>
    </div>
    <div class="bg-base-100 rounded-lg shadow-md p-6 w-full mt-4">
          <VolunteerAnnouncementList
              :announcements="announcements.value.filter(a => a.status !== 'INACTIVE')"
              :error="error.value"
              :loading="loading.value"
          />
      </div>
  </div>
</template>

<script setup lang="ts">
import {definePageMeta, useAnnouncement, useFavoritesAnnouncement} from "#imports";
import { onMounted, computed } from 'vue';
import VolunteerEventFilters from '~/components/event/volunteer/VolunteerEventFilters.vue';
import VolunteerAnnouncementList from "~/components/event/volunteer/VolunteerAnnouncementList.vue";
import {useUser} from "~/composables/auth/useUser";

definePageMeta({
  middleware: ['auth'],
  layout: 'header'
})

const announcement = useAnnouncement();
const useFavorite = useFavoritesAnnouncement();
const { user , initializeUser} = useUser()

const announcements = computed(() => announcement.getAnnouncements);
const loading = computed(() => announcement.loading);
const error = computed(() => announcement.error);

onMounted(async () => {
  await announcement.fetchAllAnnouncements();
  await initializeUser();
  if (user.value) {
    await useFavorite.fetchAllFavoritesOfVolunteer(user.value.userId);
  }
});
</script>