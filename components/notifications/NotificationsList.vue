<template>
  <div class="bg-base-100 rounded-lg shadow-md p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-base-content">Notifications</h2>
      <div class="flex gap-2">
        <button class="btn btn-sm btn-ghost" @click="markAllAsRead" v-if="hasUnread">
          Mark all as read
        </button>
        <button class="btn btn-sm btn-ghost" @click="clearAll" v-if="notifications.length > 0">
          Clear all
        </button>
      </div>
    </div>
    
    <!-- Notification filters -->
    <div class="tabs tabs-boxed bg-base-200 mb-4">
      <button 
        class="tab" 
        :class="{ 'tab-active': activeFilter === 'all' }"
        @click="activeFilter = 'all'"
      >
        All ({{ notifications.length }})
      </button>
      <button 
        class="tab" 
        :class="{ 'tab-active': activeFilter === 'unread' }"
        @click="activeFilter = 'unread'"
      >
        Unread ({{ unreadCount }})
      </button>
    </div>
    
    <!-- Notifications list -->
    <div v-if="filteredNotifications.length > 0" class="space-y-3">
      <div 
        v-for="notification in filteredNotifications" 
        :key="notification.id" 
        v-memo="[
          notification.id,
          notification.read,
          notification.title,
          notification.message,
          notification.date
        ]"
        class="p-3 rounded-lg transition-colors"
        :class="notification.read ? 'bg-base-200' : 'bg-base-200 border-l-4 border-primary'"
      >
        <div class="flex justify-between items-start">
          <div class="flex gap-3">
            <div class="avatar">
              <div class="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center">
                <component :is="getIconForType(notification.type)" class="w-5 h-5 text-base-content" />
              </div>
            </div>
            <div>
              <h3 class="font-medium text-base-content">{{ notification.title }}</h3>
              <p class="text-sm text-base-content opacity-70">{{ notification.message }}</p>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-xs text-base-content opacity-50">{{ formatDate(notification.date) }}</span>
                <span v-if="!notification.read" class="badge badge-sm badge-primary">New</span>
              </div>
            </div>
          </div>
          
          <div class="flex">
            <button class="btn btn-ghost btn-xs" @click="markAsRead(notification)" v-if="!notification.read">
              <Check class="w-4 h-4" />
            </button>
            <button class="btn btn-ghost btn-xs" @click="removeNotification(notification.id)">
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <!-- Action buttons based on notification type -->
        <div class="flex justify-end mt-3 gap-2" v-if="notification.actionUrl">
          <button class="btn btn-sm btn-outline" @click="navigateTo(notification.actionUrl)">
            {{ notification.actionText || 'View' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-else class="text-center py-8">
      <Bell class="w-12 h-12 mx-auto text-base-content opacity-30" />
      <h3 class="mt-3 text-lg font-medium text-base-content">No notifications</h3>
      <p class="mt-1 text-base-content opacity-70">
        {{ activeFilter === 'all' ? 'You have no notifications' : 'You have no unread notifications' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bell, Check, X, MessageSquare, Calendar, Award, AlertCircle } from 'lucide-vue-next'

// Props and emits
const emit = defineEmits(['update'])

// State
const activeFilter = ref('all')
const notifications = ref([
  {
    id: 1,
    type: 'message',
    title: 'New Message',
    message: 'You received a new message from Ocean Conservation Group',
    date: '2023-05-15T14:30:00',
    read: false,
    actionUrl: '/messages/1',
    actionText: 'Read Message'
  },
  {
    id: 2,
    type: 'event',
    title: 'Event Reminder',
    message: 'The Food Distribution event starts tomorrow at 9:00 AM',
    date: '2023-05-14T09:15:00',
    read: false,
    actionUrl: '/activity/participations',
    actionText: 'View Event'
  },
  {
    id: 3,
    type: 'achievement',
    title: 'Achievement Unlocked',
    message: 'You\'ve completed 5 missions! Keep up the good work.',
    date: '2023-05-10T16:45:00',
    read: true,
    actionUrl: '/profile/achievements',
    actionText: 'View Achievements'
  },
  {
    id: 4,
    type: 'alert',
    title: 'Mission Canceled',
    message: 'The Tree Planting Event has been canceled due to weather conditions.',
    date: '2023-05-05T11:20:00',
    read: true,
    actionUrl: '/activity/missions',
    actionText: 'Find New Missions'
  }
])

// Computed properties
const unreadCount = computed(() => {
  return notifications.value.filter(notification => !notification.read).length
})

const hasUnread = computed(() => {
  return unreadCount.value > 0
})

const filteredNotifications = computed(() => {
  if (activeFilter.value === 'all') {
    return notifications.value
  } else {
    return notifications.value.filter(notification => !notification.read)
  }
})

// Methods
function markAsRead(notification: any) {
  notification.read = true
  emit('update', notifications.value)
}

function markAllAsRead() {
  notifications.value.forEach(notification => {
    notification.read = true
  })
  emit('update', notifications.value)
}

function removeNotification(id: number) {
  notifications.value = notifications.value.filter(notification => notification.id !== id)
  emit('update', notifications.value)
}

function clearAll() {
  notifications.value = []
  emit('update', notifications.value)
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString()
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
    default:
      return Bell
  }
}
</script>