<template>
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
            <VolunteerAnnouncementList
                :announcements="announcements.value.filter(a => a.status !== 'INACTIVE')"
                :error="error.value"
                :loading="loading.value"
            />
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
onMounted(async () => {
  await initData();
});

const announcement = useAnnouncement();
const useFavorite = useFavoritesAnnouncement();
const { user , initializeUser} = useUser()
const {navigateToRoute} = useNavigation()


const announcements = computed(() => announcement.getAnnouncements);
const loading = computed(() => announcement.loading);
const error = computed(() => announcement.error);
const showErrorModal = ref(false);
const errorType = ref<'4xx' | '5xx' | null>(null);

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