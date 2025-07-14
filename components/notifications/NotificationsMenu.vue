<template>
  <div class="bg-base-100 rounded-lg shadow-md p-4">
    <h2 class="text-xl font-semibold mb-4 text-base-content">{{ t('drawer-content.notifications_support.title') }}</h2>
    <ul class="menu menu-vertical w-full">
      <li v-if="isAuthenticated">
        <NuxtLink to="/notifications" class="flex items-center gap-2 p-2 rounded hover:bg-base-200">
          <Bell class="w-5 h-5" />
          {{ t('drawer-content.notifications_support.notifications') }}
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/help" class="flex items-center gap-2 p-2 rounded hover:bg-base-200">
          <CircleHelp class="w-5 h-5" />
          {{ t('drawer-content.notifications_support.help') }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Bell, CircleHelp } from 'lucide-vue-next'
import {useUser} from "~/composables/auth/useUser";
const { t } = useI18n()
const { isAuthenticated } = useUser()

</script>