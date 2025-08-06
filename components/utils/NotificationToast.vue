<template>
  <div v-if="show" class="toast toast-end z-50">
    <div class="alert" :class="alertClass">
      <component :is="icon" class="w-5 h-5" />
      <span>{{ message }}</span>
      <button 
        @click="close" 
        class="btn btn-sm btn-circle btn-ghost"
        aria-label="Fermer la notification"
      >
        <X class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-vue-next'

interface Props {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  show: boolean
}

const props = withDefaults(defineProps<Props>(), {
  duration: 5000,
  show: false
})

const emit = defineEmits<{
  close: []
}>()

const show = ref(props.show)

const alertClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'alert-success'
    case 'error':
      return 'alert-error'
    case 'warning':
      return 'alert-warning'
    case 'info':
      return 'alert-info'
    default:
      return 'alert-info'
  }
})

const icon = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckCircle
    case 'error':
      return AlertCircle
    case 'warning':
      return AlertCircle
    case 'info':
      return Info
    default:
      return Info
  }
})

function close() {
  show.value = false
  emit('close')
}

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => {
      close()
    }, props.duration)
  }
})

watch(() => props.show, (newValue) => {
  show.value = newValue
})
</script> 