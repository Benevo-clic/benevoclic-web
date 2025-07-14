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
    label="Ville"
    placeholder="Ex: Paris"
  />
</template>

