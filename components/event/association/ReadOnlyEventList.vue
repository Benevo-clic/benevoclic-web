<template>
  <div class="space-y-4">
    <div v-if="props.loading" class="flex justify-center items-center h-32">
      <span class="loading loading-bars loading-xl" />
    </div>
    <div v-else-if="props.totalItems === 0" class="text-center text-gray-500">
      <img
        src="/images/no_data.png"
        :alt="t('readOnlyEventList.illustration_alt')"
        class="w-full max-w-xl mx-auto"
        onerror="this.src='/images/volunteer-info.png'"
      />
    </div>
    <div v-else-if="props.error" class="p-4 text-red-600 bg-red-100 rounded-md">
      <p>{{ t('readOnlyEventList.error_message') }} {{ props.error }}</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl1285:grid-cols-3 gap-4">
      <div class="col-span-full">
        <h2 class="text-lg font-semibold mb-0">{{ props.totalItems }} {{ t('readOnlyEventList.announcements_count') }}</h2>
      </div>
      <!-- Optimisation avec v-memo basé sur les propriétés critiques -->
      <ReadOnlyEventCard
        v-for="announcement in props.announcements"
        :key="announcement._id"
        v-memo="[announcement]"
        :announcement="announcement"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Announcement } from '../../../common/interface/event.interface'
  import ReadOnlyEventCard from './ReadOnlyEventCard.vue'

  const { t } = useI18n()

  const props = defineProps<{
    announcements: Announcement[]
    error: string | null
    loading: boolean
    totalItems: number
  }>()
</script>
