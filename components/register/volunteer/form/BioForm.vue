<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'

  const props = defineProps<{
    modelValue: string
    error?: string
  }>()

  // eslint-disable-next-line func-call-spacing
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  function onInput(e: Event) {
    const value = (e.target as HTMLTextAreaElement).value
    emit('update:modelValue', value)
  }
</script>

<template>
  <div class="form-control w-full">
    <label class="label">
      <span class="label-text">Bio</span>
      <span class="text-sm text-gray-500 block">Présente-toi en quelques mots (facultatif)</span>
    </label>
    <textarea
      :value="props.modelValue"
      class="textarea textarea-bordered h-24"
      :class="{ 'textarea-error': props.error }"
      placeholder="Ex. Passionné·e de bénévolat et de musique"
      aria-label="Zone de texte"
      @input="onInput"
    />
    <label v-if="props.error" class="label">
      <span class="label-text-alt text-error">{{ props.error }}</span>
    </label>
  </div>
</template>
