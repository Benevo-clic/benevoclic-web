<template>
  <div class="bg-white rounded-lg shadow p-4">
    <canvas ref="canvas"></canvas>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import type { ChartType } from 'chart.js/auto'
const props = defineProps<{ labels: string[], data: number[], label: string, color?: string, type?: string }>()
const canvas = ref<HTMLCanvasElement>()
let chart: Chart | null = null
onMounted(() => renderChart())
watch(() => [props.labels, props.data], renderChart)
function renderChart() {
  if (!canvas.value) return
  if (chart) chart.destroy()
  chart = new Chart(canvas.value, {
    type: (props.type as ChartType) || 'line',
    data: {
      labels: props.labels,
      datasets: [{
        label: props.label,
        data: props.data,
        borderColor: props.color || '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.1)',
        fill: true,
        tension: 0.3
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  })
}
</script> 