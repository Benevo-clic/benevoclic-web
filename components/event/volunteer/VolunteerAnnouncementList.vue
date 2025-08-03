<template>
  <div class="space-y-4">
    <div v-if="props.announcements.length === 0" class="text-center text-gray-500">
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
          {{ props.totalAnnouncements }} annonces
        </h2>
      </div>
      <VolunteerAnnouncementCard
          v-for="announcement in props.announcements"
          :key="announcement._id"
          :announcement="announcement"
          :is-favorite="favoriteIds.includes(announcement._id)"
          @favorite="toggleFavorite"
          :is-connected="true"
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
import type {Announcement} from "~/common/interface/event.interface";
import VolunteerAnnouncementCard from "~/components/event/volunteer/VolunteerAnnouncementCard.vue";
import {useFavoritesAnnouncement} from "~/composables/useFavoritesAnnouncement";
import {useUser} from "~/composables/auth/useUser";
import {computed, ref} from 'vue'
import ErrorPopup from "~/components/utils/ErrorPopup.vue";
import {useNavigation} from "~/composables/useNavigation";

const props = defineProps<
    {
      announcements: Announcement[];
      error: string | null;
      totalAnnouncements: number;
      loading: boolean;
    }
>()
const useFavorite = useFavoritesAnnouncement();
const { user } = useUser()
const {navigateToRoute} = useNavigation()

const showErrorModal = ref(false);
const errorType = ref<'4xx' | '5xx' | null>(null);

function handleReload() {
  window.location.reload();
}
function handleGoHome() {
  navigateToRoute('/');
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

const favoriteIds = computed(() => useFavorite.getFavorites.value.map(fav => fav.announcementId));
console.log("Favorite IDs:", favoriteIds.value);

async function refreshFavorites() {
  if (!user.value) return
  try {
    await useFavorite.fetchAllFavoritesOfVolunteer(user.value.userId)
  }catch (error) {
    handleError(error);
    return;
  }
}

async function addFavorite( announcementId: string , volunteerId: string) {
  try {
    await useFavorite.addFavorite(announcementId, volunteerId);
  } catch (error) {
    handleError(error);
    return;
  }
}

async function removeFavorite(announcementId: string , volunteerId: string) {
  try {
    await useFavorite.removeByVolunteerIdAndAnnouncementId(volunteerId,announcementId);
  } catch (error) {
    handleError(error);
    return;
  }
}

async function toggleFavorite(announcement: Announcement) {
  if (!user.value) return
  const isFav = favoriteIds.value.includes(announcement._id)
  if (isFav) {
    await removeFavorite(announcement._id, user.value.userId)
  } else {
    await addFavorite(announcement._id, user.value.userId)
  }
  await refreshFavorites()
}

</script>
