<template>
  <div class="mx-auto px-4 py-6 max-w-screen-xl w-full">
    <div v-if="loading.value" class="flex justify-center items-center h-32">
      <span class="loading loading-bars loading-xl"></span>
    </div>
    <div v-else-if="error.value" class="alert alert-error mb-4">{{ error }}</div>
    <template v-else>
      <div class="container mx-auto px-4 w-full">
        <div class="bg-base-100 rounded-lg shadow-md p-6 w-full">
          <div class="flex flex-col items-center w-full">
            <EventFilters class="mb-4 w-full max-w-4xl" />
          </div>
        </div>
      </div>
      <div class="container mx-auto px-4 py-4">
        <div class="bg-base-100 rounded-lg shadow-md p-6">
          <ReadOnlyEventList
              :announcements="announcements.value"
              :error="error.value"
          />
        </div>
      </div>
    </template>
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
const {user,fetchUser} = useUser()

const announcements =  computed(() => announcement.getAnnouncements)
const loading = computed(() => announcement.loading)
const error =  computed(() => announcement.error)

onMounted(async () => {
  await fetchUser()
  await announcement.fetchAnnouncements(user?.value?.userId);
});

</script>
