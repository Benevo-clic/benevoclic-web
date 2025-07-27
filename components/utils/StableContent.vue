<template>
  <div 
    class="stable-content"
    :class="contentClass"
    :style="contentStyle"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  minHeight?: string
  aspectRatio?: string
  contentClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  minHeight: '200px',
  contentClass: ''
})

const contentStyle = computed(() => {
  const style: Record<string, string> = {}
  
  if (props.minHeight) {
    style.minHeight = props.minHeight
  }
  
  if (props.aspectRatio) {
    style.aspectRatio = props.aspectRatio
  }
  
  return style
})
</script>

<style scoped>
.stable-content {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style> 