<template>
  <div v-if="showAlert" class="fixed top-4 right-4 z-[9999] max-w-sm">
    <div class="alert" :class="alertClass">
      <div class="flex items-center gap-3">
        <div class="flex-shrink-0">
          <svg
            v-if="type === 'warning'"
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <svg
            v-else-if="type === 'info'"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="stroke-current shrink-0 w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            v-else-if="type === 'error'"
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div class="flex-1">
          <h4 class="font-bold">
            {{ title }}
          </h4>
          <p class="text-sm">
            {{ message }}
          </p>
        </div>
        <div class="flex-shrink-0">
          <button class="btn btn-ghost btn-xs" @click="closeAlert">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      <div v-if="showActions" class="mt-3 flex gap-2">
        <button class="btn btn-primary btn-xs" @click="openCookieSettings">
          Paramétrer les cookies
        </button>
        <button class="btn btn-ghost btn-xs" @click="closeAlert">Plus tard</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'

  interface Props {
    type?: 'warning' | 'info' | 'error'
    title: string
    message: string
    showActions?: boolean
    autoClose?: boolean
    duration?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'warning',
    showActions: true,
    autoClose: true,
    duration: 5000
  })

  const showAlert = ref(false)

  const alertClass = computed(() => {
    switch (props.type) {
      case 'warning':
        return 'alert-warning'
      case 'info':
        return 'alert-info'
      case 'error':
        return 'alert-error'
      default:
        return 'alert-warning'
    }
  })

  const closeAlert = () => {
    showAlert.value = false
  }

  const openCookieSettings = () => {
    // Émettre un événement pour ouvrir les paramètres de cookies
    window.dispatchEvent(new CustomEvent('openCookieSettings'))
    closeAlert()
  }

  const showAlertWithDelay = () => {
    setTimeout(() => {
      showAlert.value = true

      if (props.autoClose) {
        setTimeout(() => {
          closeAlert()
        }, props.duration)
      }
    }, 1000) // Délai pour laisser le temps à l'utilisateur de voir les changements
  }

  // Exposer des méthodes pour contrôler l'alerte depuis l'extérieur
  defineExpose({
    show: () => {
      showAlert.value = true
    },
    hide: closeAlert,
    showWithDelay: showAlertWithDelay
  })

  onMounted(() => {
    // Écouter les événements de permissions manquantes
    window.addEventListener('permissionDenied', (event: any) => {
      if (event.detail?.type === props.type) {
        showAlertWithDelay()
      }
    })
  })
</script>

<style scoped>
  .alert {
    animation: slideInRight 0.3s ease-out;
  }

  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  /* Responsive */
  @media (max-width: 640px) {
    .alert {
      max-width: calc(100vw - 2rem);
      right: 1rem;
      left: 1rem;
    }
  }
</style>
