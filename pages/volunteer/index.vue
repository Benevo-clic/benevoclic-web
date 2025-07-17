<template>
    <div class="mx-auto px-4 py-6 max-w-screen-2xl w-full">
      <!-- Section filtres -->
      <client-only>
        <div class="bg-base-100 rounded-lg shadow-md p-6 w-full">
          <div class="flex flex-col items-center w-full">
            <VolunteerEventFilters
                class="mb-4 w-full"
                :announcements="announcements"
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
            <VolunteerAnnouncementList
                :announcements="announcements"
                :error="error.value"
                :loading="loading"
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
      <ErrorPopup
          :show-error-modal="showErrorModal"
          :error-type="errorType"
          @reload="handleReload"
          @goHome="handleGoHome"
      />
    </div>
</template>

<script setup lang="ts">
import {definePageMeta, useAnnouncement, useFavoritesAnnouncement, useNavigation} from "#imports";
import {onMounted, computed, ref} from 'vue';
import VolunteerEventFilters from '~/components/event/volunteer/VolunteerEventFilters.vue';
import VolunteerAnnouncementList from "~/components/event/volunteer/VolunteerAnnouncementList.vue";
import {useUser} from "~/composables/auth/useUser";
import ErrorPopup from "~/components/utils/ErrorPopup.vue";

definePageMeta({
  middleware: ['auth'],
  layout: 'header'
})

const announcement = useAnnouncement();
const useFavorite = useFavoritesAnnouncement();
const { user , initializeUser} = useUser()
const {navigateToRoute} = useNavigation()


const announcements = ref<any[]>([]);
const loading = ref(false);
const error = computed(() => announcement.error);
const showErrorModal = ref(false);
const errorType = ref<'4xx' | '5xx' | null>(null);
const currentPage = ref(1);
const pageSize = 9;
const totalAnnouncements = ref(0);

async function fetchAnnouncements(page = 1) {
  loading.value = true;
  try {
    const all = announcement.getAnnouncements.value;
    const filtered = all.filter((a: any) => a.status !== 'INACTIVE');
    totalAnnouncements.value = filtered.length;
    const start = (page - 1) * pageSize;
    announcements.value = filtered.slice(start, start + pageSize);
  }catch (error){
    handleError(error);
    return;
  } finally {
    loading.value = false;
  }
}

const totalPages = computed(() => Math.ceil(totalAnnouncements.value / pageSize));

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchAnnouncements(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

onMounted(async () => {
  await initData();
  await fetchAnnouncements(1);
});

function handleReload() {
  window.location.reload();
}
async function handleGoHome() {
  await navigateToRoute('/');
}



async function initData() {
  try {
    await announcement.fetchAllAnnouncements();
    await initializeUser();
    if (user.value) {
      await useFavorite.fetchAllFavoritesOfVolunteer(user.value.userId);
    }
  } catch (error) {
    handleError(error);
    return;
  }
}

function handleError(error: any) {
  if (error?.response?.status >= 500 && error?.response?.status < 600) {
    errorType.value = '5xx';
    showErrorModal.value = true;
  } else if (error?.response?.status >= 400 && error?.response?.status < 500) {
    errorType.value = '4xx';
    showErrorModal.value = true;
  } else {
    console.error('Erreur inattendue:', error);
  }
}
</script>