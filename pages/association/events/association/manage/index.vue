<template>
  <div>
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
            :loading="loading.value"
            :error="error.value"
        />
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import {definePageMeta, useAnnouncement} from "#imports";

import ReadOnlyEventList from '~/components/event/ReadOnlyEventList.vue';
import EventFilters from '~/components/event/EventFilters.vue';

definePageMeta({
  middleware: ['auth'],
  layout: 'header',
})

const announcement = useAnnouncement()

const announcements =  computed(() => announcement.getAnnouncements)
const loading = computed(() => announcement.loading)
const error =  computed(() => announcement.error)


</script>
