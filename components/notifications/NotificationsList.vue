<template>
  <div class="bg-base-100 rounded-xl shadow-lg border border-base-300">
    <!-- Header avec statistiques -->
    <div class="p-6 border-b border-base-300">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-base-content">{{ $t('notifications.title') }}</h2>
          <p class="text-base-content/70 mt-1">{{ $t('notifications.subtitle') }}</p>
        </div>
        
        <!-- Statistiques rapides -->
        <div class="flex gap-3">
          <div class="stat bg-base-200 rounded-lg px-4 py-2 text-center">
            <div class="stat-value text-primary text-lg font-bold">{{ unreadCount }}</div>
            <div class="stat-desc text-xs text-base-content/70">{{ $t('notifications.unread') }}</div>
          </div>
          <div class="stat bg-base-200 rounded-lg px-4 py-2 text-center">
            <div class="stat-value text-base-content text-lg font-bold">{{ notifications.length }}</div>
            <div class="stat-desc text-xs text-base-content/70">{{ $t('notifications.total') }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions rapides -->
    <div class="p-4 border-b border-base-300 bg-base-50">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <!-- Filtres -->
        <div class="flex flex-wrap gap-2">
          <button 
            v-for="filter in filters" 
            :key="filter.value"
            @click="activeFilter = filter.value"
            class="btn btn-sm transition-all duration-200"
            :class="activeFilter === filter.value ? 'btn-primary' : 'btn-outline'"
          >
            <component :is="filter.icon" class="w-4 h-4 mr-1" />
            {{ filter.label }}
            <span class="badge badge-sm ml-1">{{ filter.count }}</span>
          </button>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button 
            v-if="hasUnread"
            @click="markAllAsRead" 
            class="btn btn-sm btn-ghost text-success hover:bg-success/10"
            :disabled="isLoading"
          >
            <Check class="w-4 h-4 mr-1" />
            {{ $t('notifications.mark_all_read') }}
          </button>
          <button 
            v-if="notifications.length > 0"
            @click="clearAll" 
            class="btn btn-sm btn-ghost text-error hover:bg-error/10"
            :disabled="isLoading"
          >
            <Trash2 class="w-4 h-4 mr-1" />
            {{ $t('notifications.clear_all') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Liste des notifications -->
    <div class="p-4">
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="loading loading-spinner loading-lg text-primary"></div>
      </div>
      
      <div v-else-if="filteredNotifications.length > 0" class="space-y-3">
        <TransitionGroup 
          name="notification" 
          tag="div" 
          class="space-y-3"
        >
          <div 
            v-for="notification in filteredNotifications" 
            :key="notification.id" 
            class="group bg-base-100 border border-base-300 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:border-primary/20"
            :class="{
              'border-l-4 border-l-primary bg-primary/5': !notification.read,
              'opacity-75': notification.read
            }"
          >
            <div class="flex items-start gap-4">
              <!-- Icône avec badge -->
              <div class="relative flex-shrink-0">
                <div class="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <component :is="getIconForType(notification.type)" class="w-6 h-6" :class="getIconColor(notification.type)" />
                </div>
                <div v-if="!notification.read" class="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-base-100"></div>
              </div>

              <!-- Contenu -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-base-content line-clamp-1 group-hover:text-primary transition-colors">
                      {{ notification.title }}
                    </h3>
                    <p class="text-sm text-base-content/70 mt-1 line-clamp-2">
                      {{ notification.message }}
                    </p>
                    <div class="flex items-center gap-3 mt-2">
                      <span class="text-xs text-base-content/50 flex items-center gap-1">
                        <Clock class="w-3 h-3" />
                        {{ formatDate(notification.date) }}
                      </span>
                      <span v-if="!notification.read" class="badge badge-sm badge-primary">
                        {{ $t('notifications.new') }}
                      </span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                      v-if="!notification.read"
                      @click="markAsRead(notification)" 
                      class="btn btn-ghost btn-xs text-success hover:bg-success/10"
                      :title="$t('notifications.mark_read')"
                    >
                      <Check class="w-4 h-4" />
                    </button>
                    <button 
                      @click="removeNotification(notification.id)"
                      class="btn btn-ghost btn-xs text-error hover:bg-error/10"
                      :title="$t('notifications.delete')"
                    >
                      <X class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <!-- Actions contextuelles -->
                <div v-if="notification.actionUrl" class="flex justify-end mt-3 pt-3 border-t border-base-200">
                  <button 
                    @click="navigateTo(notification.actionUrl)"
                    class="btn btn-sm btn-outline btn-primary"
                  >
                    {{ notification.actionText || $t('notifications.view') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- État vide -->
      <div v-else class="text-center py-12">
        <div class="w-24 h-24 mx-auto mb-4 rounded-full bg-base-200 flex items-center justify-center">
          <Bell class="w-12 h-12 text-base-content/30" />
        </div>
        <h3 class="text-lg font-semibold text-base-content mb-2">
          {{ $t('notifications.no_notifications') }}
        </h3>
        <p class="text-base-content/70 max-w-md mx-auto">
          {{ getEmptyStateMessage() }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Bell, 
  Check, 
  X, 
  MessageSquare, 
  Calendar, 
  Award, 
  AlertCircle, 
  Clock,
  Trash2,
  Heart,
  Users,
  MapPin
} from 'lucide-vue-next'

// Props and emits
const emit = defineEmits(['update'])

// State
const isLoading = ref(false)
const activeFilter = ref('all')

// Données de test (à remplacer par des données réelles)
const notifications = ref([
  {
    id: 1,
    type: 'message',
    title: 'Nouveau message de l\'association Ocean Conservation',
    message: 'Vous avez reçu un message concernant votre participation à l\'événement de nettoyage de plage.',
    date: '2024-01-15T14:30:00',
    read: false,
    actionUrl: '/messages/1',
    actionText: 'Lire le message'
  },
  {
    id: 2,
    type: 'event',
    title: 'Rappel d\'événement',
    message: 'L\'événement "Distribution alimentaire" commence demain à 9h00. N\'oubliez pas vos gants !',
    date: '2024-01-14T09:15:00',
    read: false,
    actionUrl: '/volunteer/activity/participations',
    actionText: 'Voir l\'événement'
  },
  {
    id: 3,
    type: 'achievement',
    title: 'Réalisation débloquée !',
    message: 'Félicitations ! Vous avez complété 5 missions. Continuez comme ça !',
    date: '2024-01-10T16:45:00',
    read: true,
    actionUrl: '/volunteer/account/profile',
    actionText: 'Voir mes réalisations'
  },
  {
    id: 4,
    type: 'alert',
    title: 'Événement annulé',
    message: 'L\'événement "Plantation d\'arbres" a été annulé en raison des conditions météorologiques.',
    date: '2024-01-05T11:20:00',
    read: true,
    actionUrl: '/volunteer/activity/missions',
    actionText: 'Trouver d\'autres missions'
  },
  {
    id: 5,
    type: 'mission',
    title: 'Nouvelle mission disponible',
    message: 'Une nouvelle mission "Sensibilisation environnementale" est disponible dans votre région.',
    date: '2024-01-03T08:30:00',
    read: false,
    actionUrl: '/volunteer/activity/missions',
    actionText: 'Voir la mission'
  }
])

// Computed properties
const unreadCount = computed(() => {
  return notifications.value.filter(notification => !notification.read).length
})

const hasUnread = computed(() => {
  return unreadCount.value > 0
})

const filters = computed(() => [
  { value: 'all', label: 'Toutes', icon: Bell, count: notifications.value.length },
  { value: 'unread', label: 'Non lues', icon: AlertCircle, count: unreadCount.value },
  { value: 'message', label: 'Messages', icon: MessageSquare, count: getCountByType('message') },
  { value: 'event', label: 'Événements', icon: Calendar, count: getCountByType('event') },
  { value: 'mission', label: 'Missions', icon: MapPin, count: getCountByType('mission') },
  { value: 'achievement', label: 'Réalisations', icon: Award, count: getCountByType('achievement') }
])

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'all') {
    return notifications.value
  } else if (activeFilter.value === 'unread') {
    return notifications.value.filter(notification => !notification.read)
  } else {
    return notifications.value.filter(notification => notification.type === activeFilter.value)
  }
})

// Methods
function getCountByType(type: string): number {
  return notifications.value.filter(notification => notification.type === type).length
}

function markAsRead(notification: any) {
  notification.read = true
  emit('update', notifications.value)
}

function markAllAsRead() {
  isLoading.value = true
  setTimeout(() => {
    notifications.value.forEach(notification => {
      notification.read = true
    })
    emit('update', notifications.value)
    isLoading.value = false
  }, 300)
}

function removeNotification(id: number) {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
    emit('update', notifications.value)
  }
}

function clearAll() {
  isLoading.value = true
  setTimeout(() => {
    notifications.value = []
    emit('update', notifications.value)
    isLoading.value = false
  }, 300)
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMins < 60) {
    return `Il y a ${diffMins} minute${diffMins !== 1 ? 's' : ''}`
  } else if (diffHours < 24) {
    return `Il y a ${diffHours} heure${diffHours !== 1 ? 's' : ''}`
  } else if (diffDays < 7) {
    return `Il y a ${diffDays} jour${diffDays !== 1 ? 's' : ''}`
  } else {
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })
  }
}

function getIconForType(type: string) {
  switch (type) {
    case 'message':
      return MessageSquare
    case 'event':
      return Calendar
    case 'achievement':
      return Award
    case 'alert':
      return AlertCircle
    case 'mission':
      return MapPin
    default:
      return Bell
  }
}

function getIconColor(type: string): string {
  switch (type) {
    case 'message':
      return 'text-info'
    case 'event':
      return 'text-primary'
    case 'achievement':
      return 'text-success'
    case 'alert':
      return 'text-warning'
    case 'mission':
      return 'text-accent'
    default:
      return 'text-base-content'
  }
}

function getEmptyStateMessage(): string {
  switch (activeFilter.value) {
    case 'all':
      return 'Vous n\'avez aucune notification pour le moment. Les nouvelles notifications apparaîtront ici.'
    case 'unread':
      return 'Vous n\'avez aucune notification non lue. Toutes vos notifications ont été lues.'
    default:
      return `Vous n'avez aucune notification de type "${activeFilter.value}".`
  }
}

onMounted(() => {
  // Simuler un chargement initial
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>