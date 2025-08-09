<template>
  <component :is="tag" :id="id" :class="titleClass" :aria-level="ariaLevel">
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  class?: string;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  level: 1
})

const tag = computed(() => `h${props.level}`)
const titleClass = computed(() => props.class || '')
const ariaLevel = computed(() => props.level)
</script>

<style scoped>
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  padding: 0;
  font-weight: 600;
  line-height: 1.2;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

h4 {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
}

h5 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

h6 {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}
</style>
