<template>
  <div class="bg-base-100 rounded-xl shadow-lg border border-base-300 p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-base-content">
        {{ $t('notifications.statistics') }}
      </h3>
      <div class="flex gap-2">
        <button
          class="btn btn-xs"
          :class="timeRange === 'week' ? 'btn-primary' : 'btn-outline'"
          type="button"
          focus:outline-none
          focus:ring-2
          focus:ring-primary
          focus:ring-offset-2
          @click="timeRange = 'week'"
        >
          {{ $t('notifications.stats.week') }}
        </button>
        <button
          class="btn btn-xs"
          :class="timeRange === 'month' ? 'btn-primary' : 'btn-outline'"
          type="button"
          focus:outline-none
          focus:ring-2
          focus:ring-primary
          focus:ring-offset-2
          @click="timeRange = 'month'"
        >
          {{ $t('notifications.stats.month') }}
        </button>
      </div>
    </div>

    <!-- Statistiques principales -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div
        class="stat bg-base-200 rounded-lg p-4 text-center hover:shadow-md transition-all duration-200"
      >
        <div class="stat-value text-primary text-2xl font-bold">
          {{ stats.total }}
        </div>
        <div class="stat-desc text-sm text-base-content/70">
          {{ $t('notifications.total_notifications') }}
        </div>
        <div class="stat-desc text-xs text-success mt-1">
          <TrendingUp class="w-3 h-3 inline mr-1" />
          +{{ stats.increase }}%
        </div>
      </div>

      <div
        class="stat bg-base-200 rounded-lg p-4 text-center hover:shadow-md transition-all duration-200"
      >
        <div class="stat-value text-warning text-2xl font-bold">
          {{ stats.unread }}
        </div>
        <div class="stat-desc text-sm text-base-content/70">
          {{ $t('notifications.unread_notifications') }}
        </div>
        <div class="stat-desc text-xs text-warning mt-1">
          <AlertCircle class="w-3 h-3 inline mr-1" />
          {{ $t('notifications.stats.requires_attention') }}
        </div>
      </div>

      <div
        class="stat bg-base-200 rounded-lg p-4 text-center hover:shadow-md transition-all duration-200"
      >
        <div class="stat-value text-success text-2xl font-bold">
          {{ stats.today }}
        </div>
        <div class="stat-desc text-sm text-base-content/70">
          {{ $t('notifications.today') }}
        </div>
        <div class="stat-desc text-xs text-success mt-1">
          <Clock class="w-3 h-3 inline mr-1" />
          {{ $t('notifications.stats.recent') }}
        </div>
      </div>
    </div>

    <!-- Répartition par type -->
    <div class="mb-6">
      <h4 class="text-md font-medium text-base-content mb-3">
        {{ $t('notifications.stats.by_type') }}
      </h4>
      <div class="space-y-2">
        <div
          v-for="type in typeStats"
          :key="type.name"
          class="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center"
              :class="type.bgColor"
            >
              <component :is="type.icon" class="w-4 h-4" :class="type.iconColor" />
            </div>
            <div>
              <div class="font-medium text-base-content">
                {{ type.name }}
              </div>
              <div class="text-xs text-base-content/70">
                {{ type.description }}
              </div>
            </div>
          </div>
          <div class="text-right">
            <div class="font-semibold text-base-content">
              {{ type.count }}
            </div>
            <div class="text-xs text-base-content/50">{{ type.percentage }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activité récente -->
    <div>
      <h4 class="text-md font-medium text-base-content mb-3">
        {{ $t('notifications.stats.recent_activity') }}
      </h4>
      <div class="space-y-2">
        <div
          v-for="activity in recentActivity"
          :key="activity.id"
          class="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 transition-colors"
        >
          <div class="w-2 h-2 rounded-full" :class="activity.color" />
          <div class="flex-1">
            <div class="text-sm text-base-content">
              {{ activity.description }}
            </div>
            <div class="text-xs text-base-content/50">
              {{ formatTime(activity.time) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import {
    TrendingUp,
    AlertCircle,
    Clock,
    MessageSquare,
    Calendar,
    Award,
    MapPin,
    Bell
  } from 'lucide-vue-next'

  // Props
  const props = defineProps<{
    notifications: any[]
  }>()

  // State
  const timeRange = ref<'week' | 'month'>('week')

  // Computed
  const stats = computed(() => {
    const total = props.notifications.length
    const unread = props.notifications.filter(n => !n.read).length
    const today = props.notifications.filter(n => {
      const today = new Date()
      const notificationDate = new Date(n.date)
      return notificationDate.toDateString() === today.toDateString()
    }).length

    // Calculer l'augmentation (mock data)
    const increase = Math.floor(Math.random() * 20) + 5

    return { total, unread, today, increase }
  })

  const typeStats = computed(() => {
    const types = ['message', 'event', 'mission', 'achievement', 'alert']
    const total = props.notifications.length

    return types
      .map(type => {
        const count = props.notifications.filter(n => n.type === type).length
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0

        const typeConfig = {
          message: {
            name: 'Messages',
            icon: MessageSquare,
            bgColor: 'bg-info/20',
            iconColor: 'text-info'
          },
          event: {
            name: 'Événements',
            icon: Calendar,
            bgColor: 'bg-primary/20',
            iconColor: 'text-primary'
          },
          mission: {
            name: 'Missions',
            icon: MapPin,
            bgColor: 'bg-accent/20',
            iconColor: 'text-accent'
          },
          achievement: {
            name: 'Réalisations',
            icon: Award,
            bgColor: 'bg-success/20',
            iconColor: 'text-success'
          },
          alert: {
            name: 'Alertes',
            icon: AlertCircle,
            bgColor: 'bg-warning/20',
            iconColor: 'text-warning'
          }
        }[type] || {
          name: 'Autres',
          icon: Bell,
          bgColor: 'bg-base-300',
          iconColor: 'text-base-content'
        }

        return {
          name: typeConfig.name,
          description: `${count} notification${count !== 1 ? 's' : ''}`,
          count,
          percentage,
          icon: typeConfig.icon,
          bgColor: typeConfig.bgColor,
          iconColor: typeConfig.iconColor
        }
      })
      .filter(item => item.count > 0)
  })

  const recentActivity = computed(() => {
    // Simuler une activité récente basée sur les notifications
    const activities = []

    if (stats.value.unread > 0) {
      activities.push({
        id: 1,
        description: `${stats.value.unread} notification${stats.value.unread !== 1 ? 's' : ''} non lue${stats.value.unread !== 1 ? 's' : ''}`,
        time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        color: 'bg-warning'
      })
    }

    if (stats.value.today > 0) {
      activities.push({
        id: 2,
        description: `${stats.value.today} notification${stats.value.today !== 1 ? 's' : ''} reçue${stats.value.today !== 1 ? 's' : ''} aujourd'hui`,
        time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        color: 'bg-success'
      })
    }

    activities.push({
      id: 3,
      description: 'Dernière actualisation',
      time: new Date(),
      color: 'bg-info'
    })

    return activities.slice(0, 3)
  })

  // Methods
  function formatTime(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffMins < 60) {
      return `Il y a ${diffMins} minute${diffMins !== 1 ? 's' : ''}`
    } else if (diffHours < 24) {
      return `Il y a ${diffHours} heure${diffHours !== 1 ? 's' : ''}`
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  // Watchers
  watch(timeRange, newRange => {
    // Ici, vous pourriez filtrer les données selon la période sélectionnée
    process.env.NODE_ENV !== 'production' && console.log('Période sélectionnée:', newRange)
  })
</script>

<style scoped>
  .stat {
    transition: all 0.2s ease-in-out;
  }

  .stat:hover {
    transform: translateY(-2px);
  }
</style>
