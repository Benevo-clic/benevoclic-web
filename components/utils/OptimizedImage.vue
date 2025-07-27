<template>
  <div 
    class="image-container" 
    :class="containerClass"
    :style="containerStyle"
  >
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      :class="imageClass"
      :width="width"
      :height="height"
      :loading="loading"
      @load="onImageLoad"
      @error="onImageError"
    />
    <div 
      v-else 
      class="placeholder"
      :class="placeholderClass"
    >
      <slot name="placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  src?: string
  alt: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  aspectRatio?: string
  containerClass?: string
  imageClass?: string
  placeholderClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: 'lazy',
  containerClass: '',
  imageClass: '',
  placeholderClass: 'bg-base-300 text-base-content/60'
})

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
}>()

const containerStyle = computed(() => {
  if (props.aspectRatio) {
    return {
      aspectRatio: props.aspectRatio
    }
  }
  return {}
})

function onImageLoad(event: Event) {
  emit('load', event)
}

function onImageError(event: Event) {
  emit('error', event)
}
</script>

<style scoped>
.image-container {
  position: relative;
  overflow: hidden;
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
</style> 