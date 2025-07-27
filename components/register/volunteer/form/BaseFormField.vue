<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  error?: string
  label: string
  placeholder: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// Generate unique ID for accessibility
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="form-control w-full">
    <label :for="inputId" class="label">
      <span class="label-text">{{ label }}</span>
    </label>
    <input
      :id="inputId"
      :value="modelValue"
      @input="handleInput"
      type="text"
      :placeholder="placeholder"
      class="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      :class="{ 'input-error': error }"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="error ? `${inputId}-error` : undefined"
    />
    <label v-if="error" :id="`${inputId}-error`" class="label" role="alert">
      <span class="label-text-alt text-error">{{ error }}</span>
    </label>
  </div>
</template> 