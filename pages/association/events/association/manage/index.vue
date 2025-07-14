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

  </div>
</template>

<script setup lang="ts">
import {definePageMeta} from "#imports";
import ReadOnlyEventList from '~/components/event/association/ReadOnlyEventList.vue';
import EventFilters from '~/components/event/association/EventFilters.vue';
import { useAnnouncement } from "~/composables/useAnnouncement";
import {onMounted} from "vue";
import {useUser} from "~/composables/auth/useUser";

definePageMeta({
  middleware: ['auth'],
  layout: 'header',
})

const announcement = useAnnouncement()
const {getUserId, initializeUser} = useUser()


const announcements = computed(() => announcement.getAnnouncements)
const loading = computed(() => announcement.loading)
const error =  computed(() => announcement.error)

onMounted(async () => {
  if (!getUserId) {
    await initializeUser();
  }
  if(getUserId) {
    await announcement.fetchAnnouncements(getUserId);
  } else {
    console.warn("User ID is not available, announcements cannot be fetched.");
  }
});

</script>
