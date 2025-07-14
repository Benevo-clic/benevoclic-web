<script setup lang="ts">
import {useAnnouncement} from "~/composables/useAnnouncement";
import VolunteerEventFilters from "~/components/event/volunteer/VolunteerEventFilters.vue";
import {computed, onMounted} from "vue";
import NoConnectedAnnouncementList from "~/components/event/noConnected/NoConnectedAnnouncementList.vue";

const announcement = useAnnouncement()

const allAnnouncements = computed(() => announcement.getAnnouncements.value)
const loading = computed(() => announcement.loading);
const error = computed(() => announcement.error);

async function fetchAnnouncements() {
  try {
     await announcement.fetchAllAnnouncements();
  } catch (error) {
    console.error("Error fetching announcements:", error);
  }
}

onMounted(async () => {
  await fetchAnnouncements();
})

</script>

<template>
  <div class="home-page">
    <!-- Header -->
    <Header />

    <!-- Contenu principal -->
    <main class="home-content">
      <div class="mx-auto px-4 py-6 max-w-screen-2xl w-full">
        <!-- Section filtres -->
        <client-only>
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
        </client-only>

        <div class="bg-base-100 rounded-lg shadow-md p-6 w-full mt-4">
          <NoConnectedAnnouncementList
              :announcements="allAnnouncements.filter(a => a.status !== 'INACTIVE')"
              :error="error.value"
              :loading="loading.value"
          />
        </div>
      </div>
    </main>

  </div>
</template>

<style scoped>

</style>
