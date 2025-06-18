<template>
  <div class="bg-base-100 rounded-lg shadow-md p-4">
    <h2 class="text-xl font-semibold mb-4 text-base-content">Search</h2>
    <ul class="menu menu-vertical w-full">
      <li>
        <NuxtLink to="/search" class="flex items-center gap-2 p-2 rounded hover:bg-base-200">
          <Search class="w-5 h-5" />
          Search
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/search/history" class="flex items-center gap-2 p-2 rounded hover:bg-base-200">
          <Clock class="w-5 h-5" />
          Search History
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { Search, Clock } from 'lucide-vue-next'
</script>