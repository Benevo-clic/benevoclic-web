<script setup lang="ts">
import BaseFormField from './BaseFormField.vue'

const props = defineProps<{
  modelValue: string;
  error?: string;
}>()

// eslint-disable-next-line func-call-spacing
defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>()
</script>

<template>
  <BaseFormField
    :model-value="props.modelValue"
    :error="props.error"
    label="Ville"
    placeholder="Ex: Paris"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
