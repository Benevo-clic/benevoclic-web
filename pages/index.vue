<script setup lang="ts">
import {useAnnouncement} from "~/composables/useAnnouncement";
import VolunteerEventFilters from "~/components/event/volunteer/VolunteerEventFilters.vue";
import {computed, onMounted, ref} from "vue";
import NoConnectedAnnouncementList from "~/components/event/noConnected/NoConnectedAnnouncementList.vue";

const announcement = useAnnouncement()

const allAnnouncements = computed(() => announcement.getAnnouncements.value)
const loading = computed(() => announcement.loading);
const error = computed(() => announcement.error);

const currentPage = ref(1);
const pageSize = 9;

const paginatedItems = computed(() => {
  const all = allAnnouncements.value;
  const filtered = all.filter((a: any) => a.status !== 'INACTIVE');
  const start = (currentPage.value - 1) * pageSize;
  return filtered.slice(start, start + pageSize);
});

const totalPages = computed(() => {
  const all = allAnnouncements.value;
  const filtered = all.filter((a: any) => a.status !== 'INACTIVE');
  return Math.ceil(filtered.length / pageSize);
});

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

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
                  :announcements="allAnnouncements.filter(a => a.status !== 'INACTIVE')"
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
              :announcements="paginatedItems"
              :error="error.value"
              :loading="loading.value"
          />
        </div>
        <!-- Pagination DaisyUI -->
        <div class="flex justify-center mt-6">
          <div class="join">
            <button
              class="join-item btn"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >«</button>
            <button class="join-item btn" disabled>
              Page {{ currentPage }} / {{ totalPages }}
            </button>
            <button
              class="join-item btn"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >»</button>
          </div>
        </div>
      </div>
    </main>

  </div>
</template>

<style scoped>

</style>
