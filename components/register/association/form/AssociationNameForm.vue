<script setup lang="ts">
  import BaseFormField from '../../volunteer/form/BaseFormField.vue'

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
    :error="error"
    label="Nom de l'association"
    placeholder="Ex: Association pour la protection de l'environnement"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
