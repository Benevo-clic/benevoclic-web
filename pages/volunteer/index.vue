<template>
  <div class="mx-auto px-4 py-6 max-w-screen-xl w-full">
    <div v-if="loading.value" class="flex justify-center items-center h-32">
      <span class="loading loading-bars loading-xl"></span>
    </div>
    <div v-else-if="error.value" class="alert alert-error mb-4">{{ error }}</div>
    <template v-else>
      <div class="container mx-auto px-4 w-full">
        <div class="bg-base-100 rounded-lg shadow-md p-6 w-full">
          <div class="flex flex-col items-center w-full">
            <VolunteerEventFilters class="mb-4"
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
          />
        </div>
      </div>
    </template>

  </div>
</template>

<script setup lang="ts">
import { definePageMeta, useAnnouncement } from "#imports";
import { onMounted, computed } from 'vue';
import VolunteerAnnouncementCard from '~/components/event/volunteer/VolunteerAnnouncementCard.vue';
import VolunteerEventFilters from '~/components/event/volunteer/VolunteerEventFilters.vue';
import ReadOnlyEventList from "~/components/event/association/ReadOnlyEventList.vue";
import EventFilters from "~/components/event/association/EventFilters.vue";
import VolunteerAnnouncementList from "~/components/event/volunteer/VolunteerAnnouncementList.vue";

definePageMeta({
  middleware: ['auth'],
  layout: 'header'
})

const announcement = useAnnouncement();

const announcements = computed(() => announcement.getAnnouncements);
const loading = computed(() => announcement.loading);
const error = computed(() => announcement.error);

onMounted(async () => {
  await announcement.fetchAllAnnouncements();
});
</script>