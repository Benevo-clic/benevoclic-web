<template>
  <div class="relative">
    <button
      class="btn btn-ghost btn-circle relative"
      @click="toggleDropdown"
      :aria-label="`Notifications${unreadCount > 0 ? `, ${unreadCount} non lues` : ''}`"
    >
      <Bell class="w-6 h-6" />
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center text-xs font-bold bg-error text-error-content rounded-full px-1"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-80 bg-base-100 rounded-xl shadow-xl border border-base-300 z-50 max-h-96 overflow-hidden"
    >
      <div class="p-3 border-b border-base-300 flex items-center justify-between">
        <h3 class="font-semibold text-base-content">Notifications</h3>
        <button
          v-if="unreadCount > 0"
          class="btn btn-xs btn-ghost"
          @click="handleMarkAllAsRead"
        >
          Tout marquer comme lu
        </button>
      </div>

      <div class="overflow-y-auto max-h-72">
        <div v-if="isLoading" class="flex justify-center p-4">
          <span class="loading loading-spinner loading-sm"></span>
        </div>

        <div v-else-if="notifications.length === 0" class="p-4 text-center text-base-content/60">
          <BellOff class="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p class="text-sm">Aucune notification</p>
        </div>

        <div v-else>
          <div
            v-for="notification in notifications.slice(0, 5)"
            :key="notification.id"
            class="p-3 border-b border-base-200 hover:bg-base-200 cursor-pointer transition-colors"
            :class="{ 'bg-primary/5': !notification.isRead }"
            @click="handleClick(notification)"
          >
            <div class="flex items-start gap-3">
              <div
                class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                :class="getIconBgClass(notification.type)"
              >
                <component
                  :is="getNotificationIcon(notification.type)"
                  class="w-6 h-6 text-primary"
                  aria-hidden="true"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-base-content line-clamp-2">{{ notification.message }}</p>
                <p class="text-xs text-base-content/50 mt-1">{{ formatRelative(notification.createdAt) }}</p>
              </div>
              <div v-if="!notification.isRead" class="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-2"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-base-200">
        <NuxtLink
          :to="userRole === 'ASSOCIATION' ? '/association/notifications' : '/volunteer/notifications'"
          class="flex items-center justify-center gap-2 p-3 text-sm font-medium text-primary hover:bg-base-50 transition-colors"
          @click="isOpen = false"
        >
          {{ t('notifications.view_all') }}
          <ArrowRight class="w-4 h-4" />
        </NuxtLink>
      </div>
    </div>

    <!-- Overlay to close dropdown -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40"
      @click="isOpen = false"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Bell, Check, Trash2, ArrowRight, UserPlus, Users, Handshake } from 'lucide-vue-next'
import { useNotifications, type Notification } from '~/composables/useNotifications'
import { useUser } from '~/composables/auth/useUser'

const { t } = useI18n()
const { user } = useUser()

const userRole = computed(() => user.value?.role)

const {
  notifications,
  unreadCount,
  isLoading,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  init,
  disconnectSocket,
} = useNotifications()

const isOpen = ref(false)

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

async function handleClick(notification: Notification) {
  if (!notification.isRead) {
    await markAsRead(notification.id)
  }
  isOpen.value = false
  if (notification.redirectUrl) {
    navigateTo(notification.redirectUrl)
  }
}

async function handleMarkAllAsRead() {
  await markAllAsRead()
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'VOLUNTEER_REQUEST':
      return Handshake
    case 'PARTICIPANT_REQUEST':
      return Users
    case 'MEMBERSHIP_REQUEST':
      return UserPlus
    default:
      return Bell
  }
}

function getIconBgClass(type: string) {
  switch (type) {
    case 'VOLUNTEER_REQUEST':
      return 'bg-primary/20 text-primary'
    case 'PARTICIPANT_REQUEST':
      return 'bg-secondary/20 text-secondary'
    case 'MEMBERSHIP_REQUEST':
      return 'bg-accent/20 text-accent'
    default:
      return 'bg-base-200 text-base-content'
  }
}

  const { formatRelative } = useDate()


onMounted(() => {
  init()
})

onUnmounted(() => {
  disconnectSocket()
})
</script>
