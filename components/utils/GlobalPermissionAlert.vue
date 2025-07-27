<template>
  <div class="fixed top-4 right-4 z-[9999] max-w-sm space-y-2">
    <div 
      v-for="alert in activeAlerts" 
      :key="alert.id"
      class="alert transition-all duration-300"
      :class="getAlertClass(alert.type)"
    >
      <div class="flex items-center gap-3">
        <div class="flex-shrink-0">
          <svg v-if="alert.type === 'warning'" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <svg v-else-if="alert.type === 'info'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <svg v-else-if="alert.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="flex-1">
          <h4 class="font-bold">{{ alert.title }}</h4>
          <p class="text-sm">{{ alert.message }}</p>
        </div>
        <div class="flex-shrink-0">
          <button @click="removeAlert(alert.id)" class="btn btn-ghost btn-xs">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div v-if="alert.showActions" class="mt-3 flex gap-2">
        <button @click="openCookieSettings" class="btn btn-primary btn-xs">
          Paramétrer les cookies
        </button>
        <button @click="removeAlert(alert.id)" class="btn btn-ghost btn-xs">
          Plus tard
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Alert {
  id: string
  type: 'warning' | 'info' | 'error'
  title: string
  message: string
  showActions?: boolean
  autoClose?: boolean
  duration?: number
}

const activeAlerts = ref<Alert[]>([])
let alertCounter = 0

const getAlertClass = (type: string) => {
  switch (type) {
    case 'warning':
      return 'alert-warning'
    case 'info':
      return 'alert-info'
    case 'error':
      return 'alert-error'
    default:
      return 'alert-warning'
  }
}

const addAlert = (alert: Omit<Alert, 'id'>) => {
  const newAlert: Alert = {
    ...alert,
    id: `alert-${++alertCounter}`,
    autoClose: alert.autoClose ?? true,
    duration: alert.duration ?? 5000
  }
  
  activeAlerts.value.push(newAlert)
  
  if (newAlert.autoClose) {
    setTimeout(() => {
      removeAlert(newAlert.id)
    }, newAlert.duration)
  }
}

const removeAlert = (id: string) => {
  const index = activeAlerts.value.findIndex(alert => alert.id === id)
  if (index > -1) {
    activeAlerts.value.splice(index, 1)
  }
}

const openCookieSettings = () => {
  window.dispatchEvent(new CustomEvent('openCookieSettings'))
  // Fermer toutes les alertes
  activeAlerts.value = []
}

const handlePermissionDenied = (event: any) => {
  const { type, permission, message } = event.detail
  
  let title = ''
  let alertMessage = message
  
  switch (permission) {
    case 'canAuthenticate':
      title = 'Authentification impossible'
      alertMessage = 'Vous devez accepter les cookies essentiels pour vous connecter.'
      break
    case 'canUseLocation':
      title = 'Géolocalisation désactivée'
      alertMessage = 'Acceptez les cookies de personnalisation pour utiliser la géolocalisation.'
      break
    case 'canUseAnalytics':
      title = 'Analytics désactivés'
      alertMessage = 'Acceptez les cookies analytiques pour améliorer votre expérience.'
      break
    default:
      title = 'Permission requise'
  }
  
  addAlert({
    type,
    title,
    message: alertMessage,
    showActions: true,
    autoClose: false
  })
}

onMounted(() => {
  // Écouter les événements de permissions manquantes
  window.addEventListener('permissionDenied', handlePermissionDenied)
  
  // Écouter les événements pour ouvrir les paramètres de cookies
  window.addEventListener('openCookieSettings', () => {
    // Émettre un événement pour ouvrir les paramètres
    window.dispatchEvent(new CustomEvent('openCookieSettings'))
  })
})

onUnmounted(() => {
  window.removeEventListener('permissionDenied', handlePermissionDenied)
})

// Exposer des méthodes pour contrôler les alertes depuis l'extérieur
defineExpose({
  addAlert,
  removeAlert,
  openCookieSettings
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