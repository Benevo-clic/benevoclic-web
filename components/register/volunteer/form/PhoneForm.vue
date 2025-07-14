<script setup lang="ts">
import BaseFormField from './BaseFormField.vue'

const props = defineProps<{
  modelValue: string
  error?: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <BaseFormField
    :model-value="props.modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :error="props.error"
    label="Téléphone"
    placeholder="Ex: 0612345678"
  />
</template>