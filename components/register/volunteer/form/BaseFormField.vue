<script setup lang="ts">
defineProps<{
  modelValue: string
  error?: string
  label: string
  placeholder: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="form-control w-full">
    <label class="label">
      <span class="label-text">{{ label }}</span>
    </label>
    <input
      :value="modelValue"
      @input="handleInput"
      type="text"
      :placeholder="placeholder"
      class="input input-bordered w-full"
      :class="{ 'input-error': error }"
    />
    <label v-if="error" class="label">
      <span class="label-text-alt text-error">{{ error }}</span>
    </label>
  </div>
</template> 