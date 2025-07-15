<template>
  <div class="mx-auto  py-6 max-w-screen-2xl w-full">
      <div class="container mx-auto px-4 w-full">
        <div class="bg-base-100 rounded-lg shadow-md p-6 w-full">
          <div class="flex flex-col items-center w-full">
            <EventFilters class="mb-4 w-full max-w-4xl" />
          </div>
        </div>
      </div>
    <div class="mx-auto px-4 py-5 max-w-10xl">
      <div class="bg-base-100 rounded-2xl shadow-md p-6">
          <ReadOnlyEventList
              :announcements="announcements.value"
              :error="error.value"
              :loading="loading.value"
          />

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
import {definePageMeta, useNavigation} from "#imports";
import ReadOnlyEventList from '~/components/event/association/ReadOnlyEventList.vue';
import EventFilters from '~/components/event/association/EventFilters.vue';
import { useAnnouncement } from "~/composables/useAnnouncement";
import {onMounted, ref} from "vue";
import {useUser} from "~/composables/auth/useUser";
import ErrorPopup from "~/components/utils/ErrorPopup.vue";

definePageMeta({
  middleware: ['auth'],
  layout: 'header',
})

const announcement = useAnnouncement()
const {getUserId, initializeUser} = useUser()
const {navigateToRoute} = useNavigation()

onMounted(async () => {
  await initData()
});



const announcements = computed(() => announcement.getAnnouncements)
const loading = computed(() => announcement.loading)
const error =  computed(() => announcement.error)
const showErrorModal = ref(false);
const errorType = ref<'4xx' | '5xx' | null>(null);

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


async function initData() {
  try {
    if (!getUserId) {
      await initializeUser();
    }
    if(getUserId) {
      await announcement.fetchAnnouncements(getUserId);
    } else {
      console.warn("User ID is not available, announcements cannot be fetched.");
    }
  } catch (error) {
    handleError(error);
  }
}

</script>
