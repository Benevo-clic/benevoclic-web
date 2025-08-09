<template>
  <form
    :class="formClass"
    :aria-label="ariaLabel"
    :aria-describedby="ariaDescribedby"
    @submit="handleSubmit"
  >
    <slot />
  </form>
</template>

<script setup lang="ts">
interface Props {
  ariaLabel?: string;
  ariaDescribedby?: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: 'Formulaire'
})

const emit = defineEmits<{
  submit: [event: Event];
}>()

const formClass = computed(() => props.class || '')

const handleSubmit = (event: Event) => {
  emit('submit', event)
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Amélioration de l'accessibilité des champs */
form :deep(input),
form :deep(select),
form :deep(textarea) {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

form :deep(input:focus),
form :deep(select:focus),
form :deep(textarea:focus) {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

form :deep(label) {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

form :deep(.error) {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}
</style>
