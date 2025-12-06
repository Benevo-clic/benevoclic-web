<template>
  <div class="min-h-screen bg-base-200">
    <div class="container mx-auto px-4 py-6 max-w-7xl">
      <!-- Header de la page -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-base-content">
              {{ t('notifications.title') }}
            </h1>
            <p class="text-base-content/70 mt-2">
              {{ t('notifications.description') }}
            </p>
          </div>
          <div class="flex gap-2">
            <button
              class="btn btn-outline btn-sm"
              :disabled="isLoading"
              @click="fetchNotifications"
            >
              <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': isLoading }" />
              {{ t('notifications.refresh') }}
            </button>
          </div>
        </div>
      </div>

        <!-- Contenu principal -->
        <div class="col-span-1">
          <NotificationsList 
            :notifications="notifications" 
            :is-loading="isLoading"
            user-role="ASSOCIATION"
            @mark-as-read="markAsRead"
            @mark-all-read="markAllAsRead"
            @delete="deleteNotification"
            @refresh="fetchNotifications"
          />
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { RefreshCw } from 'lucide-vue-next'
  import NotificationsList from '~/components/notifications/NotificationsList.vue'
  import { useNotifications } from '~/composables/useNotifications'

  definePageMeta({
    layout: 'app',
    middleware: ['auth']
  })

  const { t } = useI18n()
  const { 
    notifications, 
    isLoading, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    init 
  } = useNotifications()

  onMounted(() => {
    init()
  })
</script>
