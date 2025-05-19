<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <!-- Sidebar menu (visible only on desktop) -->
    <div class="hidden md:block">
      <NotificationsMenu />
    </div>

    <!-- Main content -->
    <div class="md:col-span-3">
      <div class="bg-base-100 rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold mb-6 text-base-content">{{ t('drawer-content.notifications_support.notifications') }}</h1>

        <!-- Notifications settings -->
        <div class="mb-8">
          <h2 class="text-lg font-semibold mb-4 text-base-content">Notification Settings</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center justify-between bg-base-200 p-4 rounded-lg">
              <div>
                <h3 class="font-medium text-base-content">Email Notifications</h3>
                <p class="text-sm text-base-content opacity-70">Receive notifications via email</p>
              </div>
              <input type="checkbox" v-model="settings.email" class="toggle toggle-primary" />
            </div>

            <div class="flex items-center justify-between bg-base-200 p-4 rounded-lg">
              <div>
                <h3 class="font-medium text-base-content">Push Notifications</h3>
                <p class="text-sm text-base-content opacity-70">Receive push notifications on your device</p>
              </div>
              <input type="checkbox" v-model="settings.push" class="toggle toggle-primary" />
            </div>

            <div class="flex items-center justify-between bg-base-200 p-4 rounded-lg">
              <div>
                <h3 class="font-medium text-base-content">Mission Updates</h3>
                <p class="text-sm text-base-content opacity-70">Get notified about changes to missions</p>
              </div>
              <input type="checkbox" v-model="settings.missionUpdates" class="toggle toggle-primary" />
            </div>

            <div class="flex items-center justify-between bg-base-200 p-4 rounded-lg">
              <div>
                <h3 class="font-medium text-base-content">Messages</h3>
                <p class="text-sm text-base-content opacity-70">Get notified about new messages</p>
              </div>
              <input type="checkbox" v-model="settings.messages" class="toggle toggle-primary" />
            </div>
          </div>

          <div class="flex justify-end mt-4">
            <button class="btn btn-primary" @click="saveSettings">Save Settings</button>
          </div>
        </div>

        <!-- Notifications list -->
        <NotificationsList @update="handleNotificationsUpdate" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NotificationsList from '~/components/notifications/NotificationsList.vue'
import NotificationsMenu from '~/components/notifications/NotificationsMenu.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'app'
})
const { t } = useI18n()

// Notification settings
const settings = ref({
  email: true,
  push: false,
  missionUpdates: true,
  messages: true
})

// Methods
function saveSettings() {
  // In a real app, this would make an API call to save the settings
  console.log('Saving notification settings:', settings.value)
  // Show success message
}

function handleNotificationsUpdate(updatedNotifications: any[]) {
  // In a real app, this would make an API call to update the notifications
  console.log('Notifications updated:', updatedNotifications)
}
</script>
