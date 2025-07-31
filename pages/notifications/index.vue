<template>
  <div class="min-h-screen bg-base-200">
    <div class="container mx-auto px-4 py-6 max-w-7xl">
      <!-- Header de la page -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-base-content">{{ $t('notifications.title') }}</h1>
            <p class="text-base-content/70 mt-2">{{ $t('notifications.description') }}</p>
          </div>
          <div class="flex gap-2">
            <button 
              @click="refreshNotifications"
              class="btn btn-outline btn-sm"
              :disabled="isLoading"
            >
              <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': isLoading }" />
              {{ $t('notifications.refresh') }}
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar avec statistiques et paramètres -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Statistiques avancées -->
          <NotificationsStats :notifications="notifications" />

          <!-- Paramètres de notifications -->
          <div class="bg-base-100 rounded-xl shadow-lg border border-base-300 p-6">
            <h3 class="text-lg font-semibold text-base-content mb-4">{{ $t('notifications.settings.title') }}</h3>
            <div class="space-y-4">
              <div class="form-control">
                <label class="label cursor-pointer justify-between">
                  <div>
                    <span class="label-text font-medium">{{ $t('notifications.settings.email') }}</span>
                    <p class="text-xs text-base-content/70">{{ $t('notifications.settings.email_description') }}</p>
                  </div>
                  <input 
                    type="checkbox" 
                    v-model="settings.email" 
                    class="toggle toggle-primary" 
                    @change="saveSettings"
                  aria-label="Champ de saisie">
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer justify-between">
                  <div>
                    <span class="label-text font-medium">{{ $t('notifications.settings.push') }}</span>
                    <p class="text-xs text-base-content/70">{{ $t('notifications.settings.push_description') }}</p>
                  </div>
                  <input 
                    type="checkbox" 
                    v-model="settings.push" 
                    class="toggle toggle-primary" 
                    @change="saveSettings"
                  aria-label="Champ de saisie">
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer justify-between">
                  <div>
                    <span class="label-text font-medium">{{ $t('notifications.settings.mission_updates') }}</span>
                    <p class="text-xs text-base-content/70">{{ $t('notifications.settings.mission_updates_description') }}</p>
                  </div>
                  <input 
                    type="checkbox" 
                    v-model="settings.missionUpdates" 
                    class="toggle toggle-primary" 
                    @change="saveSettings"
                  aria-label="Champ de saisie">
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer justify-between">
                  <div>
                    <span class="label-text font-medium">{{ $t('notifications.settings.messages') }}</span>
                    <p class="text-xs text-base-content/70">{{ $t('notifications.settings.messages_description') }}</p>
                  </div>
                  <input 
                    type="checkbox" 
                    v-model="settings.messages" 
                    class="toggle toggle-primary" 
                    @change="saveSettings"
                  aria-label="Champ de saisie">
                </label>
              </div>

              <div class="form-control">
                <label class="label cursor-pointer justify-between">
                  <div>
                    <span class="label-text font-medium">{{ $t('notifications.settings.achievements') }}</span>
                    <p class="text-xs text-base-content/70">{{ $t('notifications.settings.achievements_description') }}</p>
                  </div>
                  <input 
                    type="checkbox" 
                    v-model="settings.achievements" 
                    class="toggle toggle-primary" 
                    @change="saveSettings"
                  aria-label="Champ de saisie">
                </label>
              </div>
            </div>

            <div class="mt-6 pt-4 border-t border-base-300">
              <button 
                @click="saveSettings"
                class="btn btn-primary btn-sm w-full"
                :disabled="isSaving"
              >
                <Save class="w-4 h-4 mr-2" />
                {{ isSaving ? $t('notifications.settings.saving') : $t('notifications.settings.save') }}
              </button>
            </div>
          </div>

          <!-- Filtres rapides -->
          <div class="bg-base-100 rounded-xl shadow-lg border border-base-300 p-6">
            <h3 class="text-lg font-semibold text-base-content mb-4">{{ $t('notifications.quick_filters') }}</h3>
            <div class="space-y-2">
              <button 
                v-for="filter in quickFilters" 
                :key="filter.value"
                @click="applyQuickFilter(filter.value)"
                class="btn btn-outline btn-sm w-full justify-start"
                :class="activeQuickFilter === filter.value ? 'btn-primary' : ''"
              >
                <component :is="filter.icon" class="w-4 h-4 mr-2" />
                {{ filter.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="lg:col-span-3">
          <NotificationsList 
            @update="handleNotificationsUpdate" 
            :key="refreshKey"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  RefreshCw, 
  Save, 
  Bell, 
  MessageSquare, 
  Calendar, 
  Award, 
  AlertCircle, 
  MapPin,
  Clock,
  Star
} from 'lucide-vue-next'
import NotificationsList from '~/components/notifications/NotificationsList.vue'
import NotificationsStats from '~/components/notifications/NotificationsStats.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'app'
})

const { t } = useI18n()

// State
const isLoading = ref(false)
const isSaving = ref(false)
const refreshKey = ref(0)
const activeQuickFilter = ref('all')

// Paramètres de notifications
const settings = ref({
  email: true,
  push: false,
  missionUpdates: true,
  messages: true,
  achievements: true
})

// Filtres rapides
const quickFilters = ref([
  { value: 'all', label: 'Toutes les notifications', icon: Bell },
  { value: 'unread', label: 'Non lues', icon: AlertCircle },
  { value: 'today', label: "Aujourd'hui", icon: Clock },
  { value: 'messages', label: 'Messages', icon: MessageSquare },
  { value: 'events', label: 'Événements', icon: Calendar },
  { value: 'missions', label: 'Missions', icon: MapPin },
  { value: 'achievements', label: 'Réalisations', icon: Award },
  { value: 'important', label: 'Importantes', icon: Star }
])

// Données de notifications (mock data)
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

// Methods
function refreshNotifications() {
  isLoading.value = true
  refreshKey.value++
  
  // Simuler un rafraîchissement
  setTimeout(() => {
    isLoading.value = false
    // Ici, vous feriez un appel API pour récupérer les nouvelles notifications
  }, 1000)
}

function saveSettings() {
  isSaving.value = true
  
  // Simuler une sauvegarde
  setTimeout(() => {
    isSaving.value = false
    // Ici, vous feriez un appel API pour sauvegarder les paramètres
    console.log('Paramètres sauvegardés:', settings.value)
  }, 1000)
}

function handleNotificationsUpdate(updatedNotifications: any[]) {
  // Mettre à jour les notifications
  notifications.value = updatedNotifications
}

function applyQuickFilter(filter: string) {
  activeQuickFilter.value = filter
  // Ici, vous pourriez passer le filtre au composant NotificationsList
  console.log('Filtre appliqué:', filter)
}

onMounted(() => {
  // Charger les paramètres depuis l'API ou le localStorage
  const savedSettings = localStorage.getItem('notificationSettings')
  if (savedSettings) {
    settings.value = { ...settings.value, ...JSON.parse(savedSettings) }
  }
})
</script>

<style scoped>
.stat {
  transition: all 0.2s ease-in-out;
}

.stat:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn {
  transition: all 0.2s ease-in-out;
}

.btn:hover {
  transform: translateY(-1px);
}
</style>
