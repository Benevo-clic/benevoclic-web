<script setup lang="ts">
import { computed } from 'vue'
import BaseFormField from './BaseFormField.vue'

const props = defineProps<{
  modelValue: string;
  error?: string;
}>()

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>()

// Split the combined value into name and firstName
const name = computed(() => {
  const parts = props.modelValue.split('|')
  return parts[0] || ''
})

const firstName = computed(() => {
  const parts = props.modelValue.split('|')
  return parts[1] || ''
})

function updateName (value: string) {
  emit('update:modelValue', `${value}|${firstName.value}`)
}

function updateFirstName (value: string) {
  emit('update:modelValue', `${name.value}|${value}`)
}
</script>

<template>
  <div>
    <h3 class="text-lg font-medium mb-2">
      Vos informations personnelles
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BaseFormField
        :model-value="name"
        :error="error && name === '' ? error : ''"
        label="Nom"
        placeholder="Ex: Dupont"
        @update:model-value="updateName"
      />
      <BaseFormField
        :model-value="firstName"
        :error="props.error && firstName === '' ? props.error : ''"
        label="Prénom"
        placeholder="Ex: Jean"
        @update:model-value="updateFirstName"
      />
    </div>
  </div>
</template>
