<template>
  <div
    class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto"
    role="group"
    aria-labelledby="date-range-label"
  >
    <label id="date-range-label" class="sr-only">{{ t('dateRangePicker.label') }}</label>

    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 sm:flex-none">
      <div class="form-control">
        <label :for="fromInputId" class="label label-text sr-only">{{ t('dateRangePicker.from.label') }}</label>
        <input
          :id="fromInputId"
          v-model="from"
          type="date"
          class="input input-sm border rounded flex-1 sm:w-auto min-w-0 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
          :aria-describedby="fromDescriptionId"
          @keydown="handleKeydown"
        />
        <div :id="fromDescriptionId" class="sr-only">{{ t('dateRangePicker.from.description') }}</div>
      </div>

      <span class="hidden sm:inline text-base-content opacity-70" aria-hidden="true">—</span>
      <div class="form-control">
        <label :for="toInputId" class="label label-text sr-only">{{ t('dateRangePicker.to.label') }}</label>
        <input
          :id="toInputId"
          v-model="to"
          type="date"
          class="input input-sm border rounded flex-1 sm:w-auto min-w-0 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
          :aria-describedby="toDescriptionId"
          @keydown="handleKeydown"
        />
        <div :id="toDescriptionId" class="sr-only">{{ t('dateRangePicker.to.description') }}</div>
      </div>
    </div>

    <button
      class="btn btn-sm btn-primary w-full sm:w-auto sm:ml-2 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
      :aria-label="t('dateRangePicker.filter.aria_label')"
      :disabled="!isValidRange"
      :aria-describedby="!isValidRange ? 'range-error' : undefined"
      @click="emitRange"
      @keyup.enter="emitRange"
      @keyup.space.prevent="emitRange"
    >
      {{ t('dateRangePicker.filter.button') }}
    </button>

    <div v-if="!isValidRange" id="range-error" class="sr-only">
      {{ t('dateRangePicker.validation.error') }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from 'vue'

  const { t } = useI18n()

  const props = defineProps<{ modelValue: { from: string; to: string } }>()
  const emit = defineEmits(['update:modelValue', 'change'])

  // Generate unique IDs for accessibility using component instance
  const componentId = 'daterangepicker'
  const fromInputId = `${componentId}-from`
  const toInputId = `${componentId}-to`
  const fromDescriptionId = `${componentId}-from-desc`
  const toDescriptionId = `${componentId}-to-desc`

  const from = ref(props.modelValue.from)
  const to = ref(props.modelValue.to)

  // Validation de la plage de dates
  const isValidRange = computed(() => {
    if (!from.value || !to.value) {
      return true
    } // Permettre la sélection partielle
    return new Date(from.value) <= new Date(to.value)
  })

  watch([from, to], () => {
    if (isValidRange.value) {
      emit('update:modelValue', { from: from.value, to: to.value })
    }
  })

  function emitRange() {
    if (isValidRange.value) {
      emit('change', { from: from.value, to: to.value })
    }
  }

  // Gestion de la navigation clavier
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault()
      emitRange()
    }
  }
</script>

<style scoped>
  /* Amélioration de l'accessibilité pour les inputs */
  .input:focus-visible {
    border-color: #eb5577;
    box-shadow: 0 0 0 2px rgba(235, 85, 119, 0.2);
  }

  /* Amélioration du contraste pour les utilisateurs en mode high-contrast */
  @media (prefers-contrast: more) {
    .input {
      border-width: 2px;
    }

    .btn {
      border-width: 2px;
    }
  }

  /* Respect des préférences de réduction de mouvement */
  @media (prefers-reduced-motion: reduce) {
    .input {
      transition: none;
    }

    .btn {
      transition: none;
    }
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .input {
      font-size: 0.875rem;
      padding: 0.5rem;
    }

    .btn {
      font-size: 0.875rem;
      padding: 0.5rem 1rem;
    }
  }

  /* Prevent horizontal scroll */
  input[type='date'] {
    min-width: 0;
    width: 100%;
  }

  /* Ensure proper date input sizing */
  input[type='date']::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }

  /* Mobile-specific styling */
  @media (max-width: 640px) {
    input[type='date'] {
      font-size: 16px; /* Prevents zoom on iOS */
    }
  }
</style>
