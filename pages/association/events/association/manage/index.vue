<template>
<div class="app-container">
  <div
      v-if="isLoading"
      class="fixed inset-0 bg-base-200 bg-opacity-80 z-[1000] flex items-center justify-center"
  >
    <img
        src="/logo.png"
        alt="Chargement…"
        class="w-24 h-24 animate-spin"
    />
  </div>
  <div v-else class="mx-auto  py-6 max-w-screen-2xl w-full">
    <client-only>

    <div class="container mx-auto px-4 w-full">
      <div class="bg-base-100 rounded-lg shadow-md p-6 w-full">
        <div class="flex flex-col items-center w-full">
          <EventFilters class="mb-4 w-full max-w-4xl" @update:filters="handleFilterUpdate" />
        </div>
      </div>
    </div>
    </client-only>

    <div  class="mx-auto px-4 py-5 max-w-10xl">
      <div class="bg-base-100 rounded-2xl shadow-md p-6">
        <ReadOnlyEventList
            :announcements="paginatedAnnouncements"
            :error="error.value"
            :loading="loading.value"
        />
        <!-- Pagination DaisyUI -->
        <div class="flex justify-center mt-6" v-if="totalPages > 1">
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
    </div>
    <ErrorPopup
        :show-error-modal="showErrorModal"
        :error-type="errorType"
        @reload="handleReload"
        @goHome="handleGoHome"
    />
  </div>
</div>
</template>

<script setup lang="ts">
import {definePageMeta, useNavigation} from "#imports";
import ReadOnlyEventList from '~/components/event/association/ReadOnlyEventList.vue';
import EventFilters from '~/components/event/association/EventFilters.vue';
import { useAnnouncement } from "~/composables/useAnnouncement";
import {onMounted, ref, computed, watch} from "vue";
import {useUser} from "~/composables/auth/useUser";
import ErrorPopup from "~/components/utils/ErrorPopup.vue";
import type {FilterAnnouncement, FilterAssociationAnnouncement} from "~/common/interface/filter.interface";

definePageMeta({
  middleware: ['auth'],
  layout: 'header',
})

const announcement = useAnnouncement()
const {getUserId, initializeUser} = useUser()
const {navigateToRoute} = useNavigation()

const isLoading = ref(true);
const totalItems = ref(0);
const currentFilters = ref<FilterAssociationAnnouncement>({
  associationId: '',
  page: 1,
  limit: 9
});

onMounted(async () => {
  await initData()
  isLoading.value = false;
});



const announcements = computed(() => announcement.getAnnouncements)
const loading = computed(() => announcement.loading)
const error =  computed(() => announcement.error)
const showErrorModal = ref(false);
const errorType = ref<'4xx' | '5xx' | null>(null);
const currentPage = ref(1);
const pageSize = 9;

const paginatedAnnouncements = computed(() => {
  return announcements.value.value || [];
});

const totalPages = computed(() => {
  return Math.ceil(totalItems.value / pageSize);
});

async function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    currentFilters.value.page = page;
    await fetchFilteredAnnouncements();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function handleReload() {
  window.location.reload();
}
async function handleGoHome() {
  await navigateToRoute('/');
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


async function handleFilterUpdate(filters: FilterAnnouncement) {
  try {
    currentPage.value = 1;
    currentFilters.value = {
      ...currentFilters.value,
      ...filters,
      associationId: getUserId || '',
      page: 1,
      limit: pageSize
    };
    await fetchFilteredAnnouncements();
  } catch (error) {
    handleError(error);
  }
}

async function fetchFilteredAnnouncements() {
  try {
    if (!currentFilters.value.associationId) {
      console.warn("Association ID is not available, announcements cannot be filtered.");
      return;
    }
    const response = await announcement.filterAssociationAnnouncementByAssociationId(currentFilters.value);
    if (response && response.meta) {
      totalItems.value = response.meta.total;
    }
  } catch (error) {
    handleError(error);
  }
}

async function initData() {
  try {
    if (!getUserId) {
      await initializeUser();
    }
    if(getUserId) {
      currentFilters.value.associationId = getUserId;
      await fetchFilteredAnnouncements();
    } else {
      console.warn("User ID is not available, announcements cannot be fetched.");
    }
  } catch (error) {
    handleError(error);
  }
}

</script>
