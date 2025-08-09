<template>
  <div
    v-if="!isReady"
    class="fixed inset-0 bg-base-200 bg-opacity-80 z-[1000] flex items-center justify-center"
  >
    <img src="/logo.png" alt="Chargement…" class="w-24 h-24 animate-spin">
  </div>
  <div v-else class="mx-auto px-4 py-6 max-w-screen-2xl w-full">
    <div class="container mx-auto px-4 w-full">
      <div class="bg-base-100 rounded-lg shadow-md p-6 w-full">
        <div class="flex flex-col items-start w-full">
          <VolunteerEventFavoritesFilters class="mb-4" @filter="handleFilter" />
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-4">
      <div class="bg-base-100 rounded-lg shadow-md p-6">
        <VolunteerAnnouncementFavoritesList
          :announcement-favorites="paginatedFavorites"
          :error="error.value"
          :loading="loading.value"
        />

        <!-- Pagination DaisyUI -->
        <div class="flex justify-center mt-6">
          <div class="join">
            <button
              class="join-item btn"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
            >
              «
            </button>
            <button class="join-item btn" disabled>
              Page {{ currentPage }} / {{ totalPages }}
            </button>
            <button
              class="join-item btn"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import {
  definePageMeta,
  useAnnouncement,
  useFavoritesAnnouncement
} from '#imports'
import { useUser } from '~/composables/auth/useUser'
import VolunteerEventFavoritesFilters from '~/components/event/volunteer/VolunteerEventFavoritesFilters.vue'
import VolunteerAnnouncementFavoritesList from '~/components/event/volunteer/VolunteerAnnouncementFavoritesList.vue'
import type { Announcement } from '~/common/interface/event.interface'
import type { FilterAnnouncement } from '~/common/interface/filter.interface'

definePageMeta({
  middleware: ['auth'],
  layout: 'header'
})

const announcement = useAnnouncement()
const favStore = useFavoritesAnnouncement()
const { user } = useUser()

const loading = computed(() => announcement.loading)
const error = computed(() => announcement.error)

const pageSize = 9
const currentPage = ref(1)
const currentFilter = ref({
  page: 1,
  limit: pageSize,
  sort: 'datePublication_desc' as FilterAnnouncement['sort'],
  status: '' as FilterAnnouncement['status'] | undefined
})

const allFavorites = computed(() => {
  return favStore.getFavoriteVolunteers.value
})

const filteredFavorites = computed(() => {
  let list = allFavorites.value.slice()
  if (currentFilter.value.status) {
    list = list.filter(a => a.status === currentFilter.value.status)
  }
  switch (currentFilter.value.sort) {
    case 'dateEvent_asc':
      list.sort(
        (a, b) =>
          new Date(a.dateEvent).getTime() - new Date(b.dateEvent).getTime()
      )
      break
    case 'dateEvent_desc':
      list.sort(
        (a, b) =>
          new Date(b.dateEvent).getTime() - new Date(a.dateEvent).getTime()
      )
      break
    case 'datePublication_desc':
      list.sort(
        (a, b) =>
          new Date(b.datePublication).getTime() -
          new Date(a.datePublication).getTime()
      )
      break
  }
  return list
})

const totalPages = computed(() =>
  Math.ceil(filteredFavorites.value.length / pageSize)
)
const paginatedFavorites = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredFavorites.value.slice(start, start + pageSize)
})

function goToPage (page: number) {
  if (page < 1 || page > totalPages.value) {
    return
  }
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleFilter (filters: FilterAnnouncement) {
  currentFilter.value = {
    sort: filters.sort,
    status: filters.status || undefined,
    page: 1,
    limit: pageSize
  }
  currentPage.value = 1
}

const isReady = ref(false)

onMounted(async () => {
  if (user.value) {
    await favStore.findAllFavoritesAnnouncementsByVolunteerId(
      user.value.userId
    )
  }
  isReady.value = true
})
</script>
