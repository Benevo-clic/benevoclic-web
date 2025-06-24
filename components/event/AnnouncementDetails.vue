<template>
  <div v-if="announcement" class="space-y-4">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">{{ announcement.nameEvent }}</h1>
      <button class="btn btn-primary" @click="$emit('edit')">Modifier</button>
    </div>
    <div class="text-gray-500">{{ announcement.dateEvent }} à {{ announcement.hoursEvent }}</div>
    <div class="text-base-content">{{ announcement.description }}</div>
    <div class="flex flex-wrap gap-2 mt-2">
      <span v-for="tag in announcement.tags" :key="tag" class="badge badge-outline">{{ tag }}</span>
    </div>
    <div class="mt-2">
      <strong>Lieu :</strong> {{ announcement.locationAnnouncement?.city }}
    </div>
    <div class="mt-2">
      <strong>Statut :</strong> {{ announcement.status }}
    </div>
  </div>
  <div v-else class="text-center text-gray-400">Aucune annonce sélectionnée.</div>
</template>

<script setup lang="ts">
import type { Announcement } from '~/common/interface/event.interface';
const props = defineProps<{ announcement: Announcement | null }>();
</script> 