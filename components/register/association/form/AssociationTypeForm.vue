<script setup lang="ts">
  const props = defineProps<{
    modelValue: string
    error?: string
  }>()

  // eslint-disable-next-line func-call-spacing
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  const associationTypes = [
    { value: 'cultural', label: 'Culturelle' },
    { value: 'educational', label: 'Éducative' },
    { value: 'environmental', label: 'Environnementale' },
    { value: 'humanitarian', label: 'Humanitaire' },
    { value: 'social', label: 'Sociale' },
    { value: 'sports', label: 'Sportive' },
    { value: 'other', label: 'Autre' }
  ]

  function handleChange(e: Event) {
    const value = (e.target as HTMLSelectElement).value
    emit('update:modelValue', value)
  }
</script>

<template>
  <div class="form-control w-full">
    <label class="label">
      <span class="label-text">Type d'association</span>
    </label>
    <select
      :value="props.modelValue"
      class="select select-bordered w-full"
      :class="{ 'select-error': error }"
      aria-label="Sélection"
      @change="handleChange"
    >
      <option value="" disabled selected>Sélectionnez un type</option>
      <option v-for="type in associationTypes" :key="type.value" :value="type.value">
        {{ type.label }}
      </option>
    </select>
    <label v-if="error" class="label">
      <span class="label-text-alt text-error">{{ error }}</span>
    </label>
  </div>
</template>
