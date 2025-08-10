<template>
  <div class="bg-base-100 rounded-lg shadow-md p-4">
    <h2 class="text-xl font-semibold mb-4 text-base-content">
      {{ t('drawer-content.activity.title') }}
    </h2>
    <ul class="menu menu-vertical w-full">
      <li>
        <NuxtLink
          to="/volunteer/activity/missions"
          class="flex items-center gap-2 p-2 rounded hover:bg-base-200"
        >
          <Box class="w-5 h-5" />
          {{ t('drawer-content.activity.my_missions') }}
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/volunteer/activity/participations"
          class="flex items-center gap-2 p-2 rounded hover:bg-base-200"
        >
          <ClipboardList class="w-5 h-5" />
          {{ t('drawer-content.activity.my_participations') }}
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/volunteer/activity/favorites"
          class="flex items-center gap-2 p-2 rounded hover:bg-base-200"
        >
          <Heart class="w-5 h-5" />
          {{ t('drawer-content.activity.my_favorites') }}
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          to="/volunteer/activity/history"
          class="flex items-center gap-2 p-2 rounded hover:bg-base-200"
        >
          <Clock class="w-5 h-5" />
          {{ t('drawer-content.activity.history') }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { Box, ClipboardList, Heart, Clock } from 'lucide-vue-next'

  const { t } = useI18n()
</script>
