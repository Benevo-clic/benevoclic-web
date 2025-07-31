<template>
  <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 sm:flex-none">
      <input 
        type="date" 
        v-model="from" 
        class="input input-sm border rounded flex-1 sm:w-auto min-w-0" 
      aria-label="Champ de saisie">
      <span class="hidden sm:inline text-base-content opacity-70">—</span>
      <input 
        type="date" 
        v-model="to" 
        class="input input-sm border rounded flex-1 sm:w-auto min-w-0" 
      aria-label="Champ de saisie">
    </div>
    <button 
      class="btn btn-sm btn-primary w-full sm:w-auto sm:ml-2" 
      @click="emitRange"
    >
      Filtrer
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue: { from: string, to: string } }>()
const emit = defineEmits(['update:modelValue', 'change'])

const from = ref(props.modelValue.from)
const to = ref(props.modelValue.to)

watch([from, to], () => emit('update:modelValue', { from: from.value, to: to.value }))

function emitRange() { 
  emit('change', { from: from.value, to: to.value }) 
}
</script>

<style scoped>
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
input[type="date"] {
  min-width: 0;
  width: 100%;
}

/* Ensure proper date input sizing */
input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
}

/* Mobile-specific styling */
@media (max-width: 640px) {
  input[type="date"] {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
</style> 