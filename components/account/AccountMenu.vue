<template>
  <div class="bg-base-100 rounded-lg shadow-md p-4">
    <h2 class="text-xl font-semibold mb-4 text-base-content">{{ t('drawer-content.account.title') }}</h2>
    <ul class="menu menu-vertical w-full">
      <li>
        <NuxtLink to="/account/profile" class="flex items-center gap-2 p-2 rounded hover:bg-base-200">
          <UserRound class="w-5 h-5" />
          {{ t('drawer-content.account.view_profile') }}
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/account/edit" class="flex items-center gap-2 p-2 rounded hover:bg-base-200">
          <Pencil class="w-5 h-5" />
          {{ t('drawer-content.account.edit_profile') }}
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/account/settings" class="flex items-center gap-2 p-2 rounded hover:bg-base-200">
          <Settings class="w-5 h-5" />
          {{ t('drawer-content.account.settings') }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { UserRound, Pencil, Settings } from 'lucide-vue-next'
const { t } = useI18n()

</script>