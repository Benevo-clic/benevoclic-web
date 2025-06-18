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
      :value="modelValue"
      @input="onInput"
      class="textarea textarea-bordered h-24"
      :class="{ 'textarea-error': error }"
      placeholder="Ex. Passionné·e de bénévolat et de musique"
    ></textarea>
    <label v-if="error" class="label">
      <span class="label-text-alt text-error">{{ error }}</span>
    </label>
  </div>
</template>