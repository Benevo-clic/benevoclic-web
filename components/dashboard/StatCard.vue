<template>
  <div class="bg-white rounded-lg shadow p-4 flex flex-col items-center">
    <div class="text-2xl font-bold text-blue-600">
      {{ value }}
    </div>
    <div class="text-gray-500 text-sm">
      {{ label }}
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ value: number | string; label: string }>()
</script>
