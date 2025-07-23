<template>
  <div class="bg-white rounded-lg shadow p-4">
    <canvas ref="canvas"></canvas>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'
const props = defineProps<{ labels: string[], data: number[], colors?: string[] }>()
const canvas = ref<HTMLCanvasElement>()
let chart: Chart | null = null
onMounted(() => renderChart())
watch(() => [props.labels, props.data], renderChart)
function renderChart() {
  if (!canvas.value) return
  if (chart) chart.destroy()
  chart = new Chart(canvas.value, {
    type: 'pie',
    data: {
      labels: props.labels,
      datasets: [{
        data: props.data,
        backgroundColor: props.colors || ['#2563eb', '#10b981', '#f59e42']
      }]
    },
    options: { responsive: true }
  })
}
</script> 