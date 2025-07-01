<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <!-- Sidebar menu (visible only on desktop) -->
    <div class="hidden md:block">
      <AccountMenuAssociation />
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
                <button @click="showPasswordChangeModal" class="btn btn-outline btn-primary btn-sm">Change Password</button>
              </div>

              <div>
                <h3 class="font-medium text-base-content mb-2">Delete Account</h3>
                <button @click="showDeleteConfirmation" class="btn btn-outline btn-error btn-sm">Delete Account</button>
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

  <!-- Delete Account Confirmation Modal -->
  <dialog ref="deleteConfirmationModal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ $t('drawer-content.account.delete_confirmation.title') }}</h3>
      <p class="py-4">{{ $t('drawer-content.account.delete_confirmation.message') }}</p>
      <div class="modal-action">
        <button @click="cancelDelete" class="btn">{{ $t('drawer-content.account.delete_confirmation.cancel') }}</button>
        <button @click="confirmDelete" class="btn btn-error">{{ $t('drawer-content.account.delete_confirmation.confirm') }}</button>
      </div>
    </div>
  </dialog>

  <!-- Change Password Modal -->
  <dialog ref="passwordChangeModal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{{ $t('drawer-content.account.password_change.title') }}</h3>
      <p class="py-2">{{ $t('drawer-content.account.password_change.message') }}</p>

      <form @submit.prevent="changePassword" class="space-y-4 py-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ $t('drawer-content.account.password_change.old_password') }}</span>
          </label>
          <input
            type="password"
            v-model="passwordForm.oldPassword"
            class="input input-bordered"
            required
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ $t('drawer-content.account.password_change.new_password') }}</span>
          </label>
          <input
            type="password"
            v-model="passwordForm.newPassword"
            class="input input-bordered"
            required
            minlength="8"
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ $t('drawer-content.account.password_change.confirm_password') }}</span>
          </label>
          <input
            type="password"
            v-model="passwordForm.confirmPassword"
            class="input input-bordered"
            required
          />
        </div>

        <div v-if="passwordError" class="text-error text-sm mt-2">
          {{ passwordError }}
        </div>

        <div class="modal-action">
          <button type="button" @click="cancelPasswordChange" class="btn">
            {{ $t('drawer-content.account.password_change.cancel') }}
          </button>
          <button type="submit" class="btn btn-primary" :disabled="isPasswordFormInvalid">
            {{ $t('drawer-content.account.password_change.confirm') }}
          </button>
        </div>
      </form>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {useUser} from "~/composables/auth/useUser";
import { useAssociationAuth } from '~/composables/useAssociation'

definePageMeta({
  middleware: ['auth'],
  layout: 'app'
})

const { t } = useI18n()

const auth = useUser()
const association = useAssociationAuth()
const deleteConfirmationModal = ref<HTMLDialogElement | null>(null)
const passwordChangeModal = ref<HTMLDialogElement | null>(null)

// Password change form data
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Password error message
const passwordError = ref<string | null>(null)

// Computed property to check if the password form is valid
const isPasswordFormInvalid = computed(() => {
  return !passwordForm.oldPassword ||
         !passwordForm.newPassword ||
         !passwordForm.confirmPassword ||
         passwordForm.newPassword !== passwordForm.confirmPassword ||
         passwordForm.newPassword.length < 8
})

// Function to show the password change modal
function showPasswordChangeModal() {
  // Reset form and errors
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordError.value = null

  // Show modal
  passwordChangeModal.value?.showModal()
}

// Function to cancel password change
function cancelPasswordChange() {
  passwordChangeModal.value?.close()
}

// Function to handle password change form submission
async function changePassword() {
  if (isPasswordFormInvalid.value) {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      passwordError.value = t('drawer-content.account.password_change.error.password_mismatch')
    } else if (passwordForm.newPassword.length < 8) {
      passwordError.value = t('drawer-content.account.password_change.error.weak_password')
    }
    return
  }

  passwordError.value = null

  try {
    await auth.updatePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })

    // Close modal on success
    passwordChangeModal.value?.close()

    // Show success message (could use a toast or alert)
    alert(t('drawer-content.account.password_change.success'))
  } catch (error: any) {
    // Display error message
    passwordError.value = error.message || t('drawer-content.account.password_change.error.general')
  }
}

// Function to show the delete confirmation dialog
function showDeleteConfirmation() {
  deleteConfirmationModal.value?.showModal()
}

// Function to cancel the deletion
function cancelDelete() {
  deleteConfirmationModal.value?.close()
}

// Function to confirm and proceed with deletion
function confirmDelete() {
  // Close the modal
  deleteConfirmationModal.value?.close()

  // Proceed with account deletion
  removeUser()
}

// Function to remove the user account
function removeUser() {
  auth.removeUser()
  association.removeAssociation()
}

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
