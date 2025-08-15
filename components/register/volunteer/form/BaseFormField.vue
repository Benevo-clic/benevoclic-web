<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    modelValue: string
    error?: string
    label: string
    placeholder: string
    required?: boolean
    type?: string
    autocomplete?: string
  }>()

  // eslint-disable-next-line func-call-spacing
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  const inputId = computed(
    () => `base-form-field-${props.label?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'input'}`
  )
  const errorId = computed(() => `${inputId.value}-error`)
  const descriptionId = computed(() => `${inputId.value}-description`)

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement
    emit('update:modelValue', target.value)
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      emit('update:modelValue', (e.target as HTMLInputElement).value)
    }
  }
</script>

<template>
  <div class="form-control w-full">
    <label :for="inputId" class="label">
      <span class="label-text">
        {{ props.label }}
        <span v-if="required" class="text-error" aria-label="Champ obligatoire">*</span>
      </span>
    </label>
    <input
      :id="inputId"
      :value="props.modelValue"
      :type="type || 'text'"
      :placeholder="placeholder"
      :required="required"
      :autocomplete="autocomplete"
      class="input input-bordered w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
      :class="{ 'input-error': error }"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="props.error ? errorId : autocomplete ? descriptionId : undefined"
      :aria-required="required"
      @input="handleInput"
      @keydown="handleKeydown"
    />
    <div v-if="autocomplete && !props.error" :id="descriptionId" class="text-xs text-gray-500 mt-1">
      Saisissez votre {{ props.label.toLowerCase() }}
    </div>
    <div
      v-if="props.error"
      :id="errorId"
      class="label"
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <span class="label-text-alt text-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 inline mr-1"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        {{ props.error }}
      </span>
    </div>
  </div>
</template>

<style scoped>
  /* Amélioration de l'accessibilité pour les inputs */
  .input:focus-visible {
    border-color: #eb5577;
    box-shadow: 0 0 0 2px rgba(235, 85, 119, 0.2);
  }

  .input-error:focus-visible {
    border-color: #f87272;
    box-shadow: 0 0 0 2px rgba(248, 114, 114, 0.2);
  }

  /* Amélioration du contraste pour les utilisateurs en mode high-contrast */
  @media (prefers-contrast: more) {
    .input {
      border-width: 2px;
    }

    .label-text-alt {
      font-weight: bold;
    }
  }

  /* Respect des préférences de réduction de mouvement */
  @media (prefers-reduced-motion: reduce) {
    .input {
      transition: none;
    }
  }
</style>
