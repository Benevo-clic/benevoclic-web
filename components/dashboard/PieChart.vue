<template>
  <div class="w-full h-full flex items-center justify-center">
    <canvas ref="canvas" class="max-w-full max-h-full"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps<{ 
  labels: string[], 
  data: number[], 
  colors?: string[] 
}>()

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
        backgroundColor: props.colors || ['#2563eb', '#10b981', '#f59e42'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: { 
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12
            }
          }
        }
      }
    }
  })
}
</script>

<style scoped>
/* Ensure canvas fits within container */
canvas {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  canvas {
    max-height: 200px;
  }
}

@media (min-width: 641px) and (max-width: 1024px) {
  canvas {
    max-height: 250px;
  }
}

@media (min-width: 1025px) {
  canvas {
    max-height: 300px;
  }
}
</style> 