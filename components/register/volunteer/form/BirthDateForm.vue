<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  modelValue: string
  error?: string
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function onInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="form-control w-full">
    <label class="label">
      <span class="label-text">Date de naissance</span>
    </label>
    <input
      :value="props.modelValue"
      @input="onInput"
      type="date"
      class="input input-bordered w-full"
      :class="{ 'input-error': props.error }"
    aria-label="Champ de saisie">
    <label v-if="props.error" class="label">
      <span class="label-text-alt text-error">{{ props.error }}</span>
    </label>
  </div>
</template>

