<template>
  <div 
    class="w-full h-full flex items-center justify-center" 
    role="img" 
    :aria-label="chartDescription"
    :aria-describedby="`chart-description-${uniqueId}`"
  >
    <canvas 
      ref="canvas" 
      class="max-w-full max-h-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none" 
      tabindex="0"
      :aria-label="chartDescription"
    ></canvas>
    <div :id="`chart-description-${uniqueId}`" class="sr-only">
      {{ chartDescription }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps<{ 
  labels: string[], 
  data: number[], 
  colors?: string[],
  title?: string
}>()

const canvas = ref<HTMLCanvasElement>()
let chart: Chart | null = null

// Generate unique ID for accessibility
const uniqueId = Math.random().toString(36).substr(2, 9)

// Computed description for screen readers
const chartDescription = computed(() => {
  if (!props.labels.length || !props.data.length) {
    return 'Graphique en cours de chargement'
  }
  
  const total = props.data.reduce((sum, value) => sum + value, 0)
  const segments = props.labels.map((label, index) => {
    const value = props.data[index]
    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
    return `${label}: ${value} (${percentage}%)`
  }).join(', ')
  
  return `${props.title || 'Graphique circulaire'} - ${segments}`
})

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
            },
            generateLabels: function(chart) {
              const data = chart.data
              if (data.labels && data.labels.length && data.datasets && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const dataset = data.datasets[0]
                  const value = dataset.data[i] as number
                  const total = (dataset.data as number[]).reduce((sum: number, val: number) => sum + (val || 0), 0)
                  const percentage = total > 0 ? ((value || 0) / total * 100).toFixed(1) : '0'
                  
                  // Gestion sûre des couleurs
                  const backgroundColor = Array.isArray(dataset.backgroundColor) 
                    ? dataset.backgroundColor[i] as string
                    : dataset.backgroundColor as string || '#2563eb'
                  
                  return {
                    text: `${label}: ${value || 0} (${percentage}%)`,
                    fillStyle: backgroundColor,
                    strokeStyle: backgroundColor,
                    lineWidth: 0,
                    hidden: false,
                    index: i
                  }
                })
              }
              return []
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || ''
              const value = context.parsed
              const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0)
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
              return `${label}: ${value} (${percentage}%)`
            }
          }
        }
      }
    }
  })
}

// Gestion de la navigation clavier
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    // Focus sur le canvas pour permettre l'interaction
    canvas.value?.focus()
  }
}
</script>

<style scoped>
/* Ensure canvas fits within container */
canvas {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* Amélioration de l'accessibilité pour le canvas */
canvas:focus-visible {
  outline: 2px solid #eb5577;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Amélioration du contraste pour les utilisateurs en mode high-contrast */
@media (prefers-contrast: more) {
  canvas {
    border: 2px solid currentColor;
  }
}

/* Respect des préférences de réduction de mouvement */
@media (prefers-reduced-motion: reduce) {
  canvas {
    transition: none;
  }
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