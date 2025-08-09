<template>
  <div
    class="bg-white rounded-lg shadow p-4 flex flex-col gap-2"
    role="region"
    aria-labelledby="objective-title"
  >
    <div id="objective-title" class="font-semibold">
      {{ title }}
    </div>
    <div
      class="w-full bg-gray-200 rounded h-3"
      role="progressbar"
      :aria-valuenow="percent"
      :aria-valuemin="0"
      :aria-valuemax="100"
      :aria-label="`Progression de ${title}`"
      :aria-describedby="`progress-description-${uniqueId}`"
    >
      <div
        class="bg-blue-500 h-3 rounded transition-all duration-300"
        :style="{ width: percent + '%' }"
        :aria-label="`${percent.toFixed(1)}% complété`"
      />
    </div>
    <div
      :id="`progress-description-${uniqueId}`"
      class="text-xs text-gray-500"
      aria-live="polite"
    >
      {{ covered }} / {{ planned }} ({{ percent.toFixed(1) }}%)
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string;
  covered: number;
  planned: number;
}>()

// Generate unique ID for accessibility
const uniqueId = Math.random().toString(36).substr(2, 9)

const percent = computed(() =>
  props.planned ? (props.covered / props.planned) * 100 : 0
)
</script>

<style scoped>
/* Amélioration de l'accessibilité pour les barres de progression */
[role="progressbar"] {
  position: relative;
}

[role="progressbar"]:focus-visible {
  outline: 2px solid #eb5577;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Amélioration du contraste pour les utilisateurs en mode high-contrast */
@media (prefers-contrast: more) {
  .bg-gray-200 {
    border: 1px solid currentColor;
  }

  .bg-blue-500 {
    border: 1px solid currentColor;
  }
}

/* Respect des préférences de réduction de mouvement */
@media (prefers-reduced-motion: reduce) {
  .transition-all {
    transition: none;
  }
}

/* Amélioration de la visibilité pour les utilisateurs daltoniens */
@media (prefers-contrast: more) {
  .bg-blue-500 {
    background-color: #000 !important;
  }
}
</style>
