<template>
  <div class="space-y-4">
    <div v-if="props.announcementFavorites?.length === 0" class="text-center text-gray-500">
      <img
        src="/images/no_data.png"
        alt="Illustration"
        class="w-full max-w-xl mx-auto"
        onerror="this.src='/images/volunteer-info.png'"
      />
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl1285:grid-cols-3 gap-4">
      <div class="col-span-full">
        <h2 class="text-lg font-semibold mb-0">
          {{ props.announcementFavorites?.length }} annonces
        </h2>
      </div>
      <!-- Optimisation avec v-memo basé sur les propriétés importantes -->
      <VolunteerAnnouncementCard
        v-for="announcement in props.announcementFavorites"
        :key="announcement._id"
        v-memo="[announcement]"
        :announcement="announcement"
        :is-favorite="true"
        :is-connected="true"
        @favorite="toggleFavorite"
      />
    </div>
    <ErrorPopup
      :show-error-modal="showErrorModal"
      :error-type="errorType"
      @reload="handleReload"
      @go-home="handleGoHome"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import type { Announcement } from '~/common/interface/event.interface'
  import VolunteerAnnouncementCard from '~/components/event/volunteer/VolunteerAnnouncementCard.vue'
  import { useFavoritesAnnouncement } from '~/composables/useFavoritesAnnouncement'
  import { useUser } from '~/composables/auth/useUser'
  import ErrorPopup from '~/components/utils/ErrorPopup.vue'
  import { useNavigation } from '~/composables/useNavigation'

  const props = defineProps<{
    announcementFavorites: Announcement[]
    error: string | null
    loading: boolean
  }>()

  const useFavorite = useFavoritesAnnouncement()
  const { user } = useUser()
  const { navigateToRoute } = useNavigation()

  const showErrorModal = ref(false)
  const errorType = ref<'4xx' | '5xx' | null>(null)

  function handleReload() {
    window.location.reload()
  }
  function handleGoHome() {
    navigateToRoute('/')
  }

  function handleError(error: any) {
    if (error?.response?.status >= 500 && error?.response?.status < 600) {
      errorType.value = '5xx'
      showErrorModal.value = true
    } else if (error?.response?.status >= 400 && error?.response?.status < 500) {
      errorType.value = '4xx'
      showErrorModal.value = true
    } else {
      process.env.NODE_ENV !== 'production' && console.error('Erreur inattendue:', error)
    }
  }

  async function refreshFavorites() {
    if (!user.value) {
      return
    }
    try {
      await useFavorite.fetchAllFavoritesOfVolunteer(user.value.userId)
    } catch (error) {
      handleError(error)
    }
  }

  async function removeFavorite(announcementId: string, volunteerId: string) {
    try {
      await useFavorite.removeByVolunteerIdAndAnnouncementId(volunteerId, announcementId)
    } catch (error) {
      handleError(error)
    }
  }

  async function toggleFavorite(announcement: Announcement) {
    if (!user.value) {
      return
    }
    await removeFavorite(announcement._id, user.value.userId)
    await refreshFavorites()
  }
</script>
