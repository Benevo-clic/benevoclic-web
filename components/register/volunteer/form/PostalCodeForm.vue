<script setup lang="ts">
import BaseFormField from './BaseFormField.vue'

defineProps<{
  modelValue: string
  error?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <BaseFormField
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :error="error"
    label="Code postal"
    placeholder="Ex: 75001"
  />
</template>

