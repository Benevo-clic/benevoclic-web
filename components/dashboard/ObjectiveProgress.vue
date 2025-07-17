<template>
  <div class="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
    <div class="font-semibold">{{ title }}</div>
    <div class="w-full bg-gray-200 rounded h-3">
      <div class="bg-blue-500 h-3 rounded" :style="{ width: percent + '%' }"></div>
    </div>
    <div class="text-xs text-gray-500">{{ covered }} / {{ planned }} ({{ percent.toFixed(1) }}%)</div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ title: string, covered: number, planned: number }>()
const percent = computed(() => props.planned ? (props.covered / props.planned) * 100 : 0)
</script> 