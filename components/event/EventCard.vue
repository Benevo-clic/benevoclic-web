<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-bold">{{ announcement.nameEvent }}</h3>
        <UBadge :color="statusColor" variant="solid">{{ announcement.status }}</UBadge>
      </div>
      <p class="text-sm text-gray-500">{{ announcement.associationName }}</p>
    </template>

    <p class="mb-4">{{ announcement.description }}</p>

    <div class="grid grid-cols-2 gap-4 text-sm">
      <div>
        <UIcon name="i-heroicons-calendar-days" class="mr-1" />
        <strong>Date:</strong> {{ formatDate(announcement.dateEvent) }}
      </div>
      <div>
        <UIcon name="i-heroicons-clock" class="mr-1" />
        <strong>Heure:</strong> {{ announcement.hoursEvent }}
      </div>
      <div v-if="announcement.locationAnnouncement">
        <UIcon name="i-heroicons-map-pin" class="mr-1" />
        <strong>Lieu:</strong> {{ announcement.locationAnnouncement.city }}
      </div>
      <div>
        <UIcon name="i-heroicons-users" class="mr-1" />
        <strong>Bénévoles:</strong> {{ announcement.maxVolunteers }} requis
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between items-center">
        <div class="flex flex-wrap gap-2">
          <UBadge v-for="tag in announcement.tags" :key="tag" color="gray">{{ tag }}</UBadge>
        </div>
        <div class="flex space-x-2">
            <UButton icon="i-heroicons-pencil" size="sm" color="orange" variant="ghost" @click="$emit('edit', announcement)"></UButton>
            <UButton icon="i-heroicons-trash" size="sm" color="red" variant="ghost" @click="$emit('delete', announcement)"></UButton>
        </div>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Announcement } from '~/common/interface/event.interface';
import { EventStatus } from '~/common/enums/event.enum';

const props = defineProps<{
  announcement: Announcement;
}>();

defineEmits(['edit', 'delete']);

const statusColor = computed(() => {
  switch (props.announcement.status) {
    case EventStatus.PUBLISHED:
      return 'green';
    case EventStatus.DRAFT:
      return 'yellow';
    case EventStatus.CANCELLED:
      return 'red';
    case EventStatus.ARCHIVED:
      return 'gray';
    default:
      return 'blue';
  }
});

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};
</script> 