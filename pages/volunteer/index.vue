<template>
    <div class="mx-auto px-4 py-6 max-w-screen-2xl w-full">
      <client-only>
        <div class="bg-base-100 rounded-lg shadow-md p-6 w-full">
          <div class="flex flex-col items-center w-full">
            <VolunteerEventFilters
                class="mb-4 w-full"
                :announcements="announcements"
                @map="handleMapToggle"
                @filter="handleFilter"
                @type="handleTypeFilter"
            />
          </div>
        </div>
      </client-only>

      <div class="bg-base-100 rounded-lg shadow-md p-6 w-full mt-4">
            <VolunteerAnnouncementList
                :announcements="announcements"
                :total-announcements="totalAnnouncements"
                :error="error.value"
                :loading="loading"
            />
        </div>
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
</template>

<script setup lang="ts">
import {definePageMeta, useAnnouncement, useFavoritesAnnouncement, useNavigation} from "#imports";
import {onMounted, computed, ref} from 'vue';
import VolunteerEventFilters from '~/components/event/volunteer/VolunteerEventFilters.vue';
import VolunteerAnnouncementList from "~/components/event/volunteer/VolunteerAnnouncementList.vue";
import {useUser} from "~/composables/auth/useUser";
import type {FilterAnnouncement} from "~/common/interface/filter.interface";

definePageMeta({
  middleware: ['auth'],
  layout: 'header'
})

const announcement = useAnnouncement();
const useFavorite = useFavoritesAnnouncement();
const { user , initializeUser} = useUser()

const announcements = ref<any[]>([]);
const loading = ref(false);
const error = computed(() => announcement.error);
const currentPage = ref(1);
const pageSize = 9;
const totalAnnouncements = ref(0);
const currentFilters = ref<FilterAnnouncement>({
  page: 1,
  limit: pageSize
});

let currentFilterSearch = ref<FilterAnnouncement>();

watch(
  () => announcement.getCurrentFilter.value,
  async (newFilter) => {
    currentFilterSearch.value = {
      ...newFilter,
    };
    await fetchAnnouncements(1);
  }
)

async function fetchAnnouncements(page = 1) {
  loading.value = true;
  try {
    const base = { page, limit: pageSize };
    const overrides = currentFilterSearch.value
        ? {
          associationName: currentFilterSearch.value.associationName,
          nameEvent:       currentFilterSearch.value.nameEvent,
          description:     currentFilterSearch.value.description,
        }
        : {};
    const filters = {
      ...currentFilters.value,
      ...overrides,
      ...base
    };
    currentFilters.value = filters;

    const response = await announcement.filterAnnouncement(filters);
    const {
      annonces = [],
      meta: { total = 0 } = {}
    } = response || {};

    announcements.value      = annonces;
    totalAnnouncements.value = total;
  } catch (error) {
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

function handleMapToggle() {
}

async function handleFilter(filters: FilterAnnouncement) {
  currentFilters.value = {
    ...filters,
    page: currentPage.value,
    limit: pageSize
  };
  currentPage.value = 1;
  await fetchAnnouncements(1);
}

async function handleTypeFilter(type: string) {
  currentFilters.value.tags = [type];
  currentPage.value = 1;
  await fetchAnnouncements(1);
}

onMounted(async () => {
  await initData();
});

async function initData() {
  try {
    await initializeUser();
    if (user.value) {
      await useFavorite.fetchAllFavoritesOfVolunteer(user.value.userId);
    }
  } catch (error) {
    return;
  }
}
</script>
