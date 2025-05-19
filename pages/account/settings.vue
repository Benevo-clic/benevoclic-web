<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <!-- Sidebar menu (visible only on desktop) -->
    <div class="hidden md:block">
      <AccountMenu />
    </div>
    
    <!-- Main content -->
    <div class="md:col-span-3">
      <div class="bg-base-100 rounded-lg shadow-md p-6">
        <h1 class="text-2xl font-bold mb-6 text-base-content">{{ $t('drawer-content.account.settings') }}</h1>
        
        <!-- Settings sections -->
        <div class="space-y-8">
          <!-- Notifications settings -->
          <div class="bg-base-200 p-4 rounded-lg">
            <h2 class="text-lg font-semibold mb-4 text-base-content">Notifications</h2>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-base-content">Email Notifications</h3>
                  <p class="text-sm text-base-content opacity-70">Receive email notifications about new missions</p>
                </div>
                <input type="checkbox" v-model="settings.emailNotifications" class="toggle toggle-primary" />
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-base-content">Push Notifications</h3>
                  <p class="text-sm text-base-content opacity-70">Receive push notifications on your device</p>
                </div>
                <input type="checkbox" v-model="settings.pushNotifications" class="toggle toggle-primary" />
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-base-content">Mission Updates</h3>
                  <p class="text-sm text-base-content opacity-70">Get notified about updates to missions you're participating in</p>
                </div>
                <input type="checkbox" v-model="settings.missionUpdates" class="toggle toggle-primary" />
              </div>
            </div>
          </div>
          
          <!-- Privacy settings -->
          <div class="bg-base-200 p-4 rounded-lg">
            <h2 class="text-lg font-semibold mb-4 text-base-content">Privacy</h2>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-base-content">Profile Visibility</h3>
                  <p class="text-sm text-base-content opacity-70">Make your profile visible to other users</p>
                </div>
                <input type="checkbox" v-model="settings.profileVisibility" class="toggle toggle-primary" />
              </div>
              
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-base-content">Location Sharing</h3>
                  <p class="text-sm text-base-content opacity-70">Share your location with mission organizers</p>
                </div>
                <input type="checkbox" v-model="settings.locationSharing" class="toggle toggle-primary" />
              </div>
            </div>
          </div>
          
          <!-- Account settings -->
          <div class="bg-base-200 p-4 rounded-lg">
            <h2 class="text-lg font-semibold mb-4 text-base-content">Account</h2>
            
            <div class="space-y-4">
              <div>
                <h3 class="font-medium text-base-content mb-2">Change Password</h3>
                <button class="btn btn-outline btn-primary btn-sm">Change Password</button>
              </div>
              
              <div>
                <h3 class="font-medium text-base-content mb-2">Delete Account</h3>
                <button class="btn btn-outline btn-error btn-sm">Delete Account</button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Save button -->
        <div class="flex justify-end mt-6">
          <button @click="saveSettings" class="btn btn-primary">Save Settings</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AccountMenu from '~/components/account/AccountMenu.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'app'
})

// Mock settings data - would be fetched from API in a real app
const settings = ref({
  emailNotifications: true,
  pushNotifications: false,
  missionUpdates: true,
  profileVisibility: true,
  locationSharing: false
})

function saveSettings() {
  // Save settings to API
  console.log('Saving settings:', settings.value)
  // Show success message
}
</script>