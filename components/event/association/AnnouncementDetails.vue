<template>
  <div v-if="props.announcement" class="space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">
        {{ props.announcement.nameEvent }}
      </h1>
      <button class="btn btn-primary" @click="$emit('edit')">
        {{ t('announcementDetails.actions.edit') }}
      </button>
    </div>
    <div class="text-gray-500">
      {{ props.announcement.dateEvent }} à {{ props.announcement.hoursEvent }}
    </div>
    <div class="text-base-content">
      {{ props.announcement.description }}
    </div>
    <div class="flex flex-wrap gap-2 mt-2">
      <span
        v-for="tag in props.announcement.tags"
        :key="tag"
        class="badge badge-outline text-base-content border-base-content"
        :aria-label="`${t('announcementDetails.tag_aria_label')} ${tag}`"
        >{{ tag }}</span
      >
    </div>
    <div class="mt-2">
      <strong>{{ t('announcementDetails.location') }}</strong>
      {{ props.announcement.addressAnnouncement?.city }}
    </div>
    <div class="mt-2">
      <strong>{{ t('announcementDetails.status') }}</strong> {{ props.announcement.status }}
    </div>
  </div>
  <div v-else class="text-center text-gray-400">{{ t('announcementDetails.no_announcement') }}</div>
</template>

<script setup lang="ts">
  import type { Announcement } from '~/common/interface/event.interface'

  const { t } = useI18n()

  const props = defineProps<{ announcement: Announcement | null }>()
</script>
