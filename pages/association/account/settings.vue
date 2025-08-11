<template>
  <div class="min-h-screen bg-base-200">
    <div class="container mx-auto px-4 py-6 max-w-7xl">
      <!-- Header de la page -->
      <div class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-base-content">
              {{ t('settings.title') }}
            </h1>
            <p class="text-base-content/70 mt-2">
              {{ t('settings.subtitle_association') }}
            </p>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-primary btn-sm" :disabled="isSaving" @click="saveSettings">
              <Save class="w-4 h-4 mr-2" />
              {{ isSaving ? t('settings.saving') : t('settings.save') }}
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar avec menu -->
        <div class="lg:col-span-1">
          <div class="bg-base-100 rounded-xl shadow-lg border border-base-300 p-6">
            <h3 class="text-lg font-semibold text-base-content mb-4">
              {{ t('settings.navigation') }}
            </h3>
            <div class="space-y-2">
              <button
                v-for="section in sections"
                :key="section.id"
                class="btn btn-outline btn-sm w-full justify-start transition-all duration-200"
                :class="activeSection === section.id ? 'btn-primary' : ''"
                @click="activeSection = section.id"
              >
                <component :is="section.icon" class="w-4 h-4 mr-2" />
                {{ section.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="lg:col-span-3">
          <!-- Notifications settings -->
          <div v-if="isDeleted" class="flex items-center justify-center h-64">
            <div class="loading loading-spinner loading-lg text-primary" />
          </div>
          <div v-else-if="activeSection === 'notifications'" class="space-y-6">
            <div class="bg-base-100 rounded-xl shadow-lg border border-base-300 p-6">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bell class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-base-content">
                    {{ t('settings.notifications.title') }}
                  </h2>
                  <p class="text-base-content/70">
                    {{ t('settings.notifications.description_association') }}
                  </p>
                </div>
              </div>

              <div class="space-y-6">
                <div class="form-control">
                  <label class="label cursor-pointer justify-between">
                    <div>
                      <span class="label-text font-medium">{{
                        t('settings.notifications.email')
                      }}</span>
                      <p class="text-xs text-base-content/70">
                        {{ t('settings.notifications.email_description_association') }}
                      </p>
                    </div>
                    <input
                      v-model="settings.emailNotifications"
                      type="checkbox"
                      class="toggle toggle-primary"
                      aria-label="Champ de saisie"
                    />
                  </label>
                </div>

                <div class="form-control">
                  <label class="label cursor-pointer justify-between">
                    <div>
                      <span class="label-text font-medium">{{
                        t('settings.notifications.push')
                      }}</span>
                      <p class="text-xs text-base-content/70">
                        {{ t('settings.notifications.push_description') }}
                      </p>
                    </div>
                    <input
                      v-model="settings.pushNotifications"
                      type="checkbox"
                      class="toggle toggle-primary"
                      aria-label="Champ de saisie"
                    />
                  </label>
                </div>

                <div class="form-control">
                  <label class="label cursor-pointer justify-between">
                    <div>
                      <span class="label-text font-medium">{{
                        t('settings.notifications.volunteer_requests')
                      }}</span>
                      <p class="text-xs text-base-content/70">
                        {{ t('settings.notifications.volunteer_requests_description') }}
                      </p>
                    </div>
                    <input
                      v-model="settings.volunteerRequests"
                      type="checkbox"
                      class="toggle toggle-primary"
                      aria-label="Champ de saisie"
                    />
                  </label>
                </div>

                <div class="form-control">
                  <label class="label cursor-pointer justify-between">
                    <div>
                      <span class="label-text font-medium">{{
                        t('settings.notifications.event_updates')
                      }}</span>
                      <p class="text-xs text-base-content/70">
                        {{ t('settings.notifications.event_updates_description') }}
                      </p>
                    </div>
                    <input
                      v-model="settings.eventUpdates"
                      type="checkbox"
                      class="toggle toggle-primary"
                      aria-label="Champ de saisie"
                    />
                  </label>
                </div>

                <div class="form-control">
                  <label class="label cursor-pointer justify-between">
                    <div>
                      <span class="label-text font-medium">{{
                        t('settings.notifications.analytics')
                      }}</span>
                      <p class="text-xs text-base-content/70">
                        {{ t('settings.notifications.analytics_description') }}
                      </p>
                    </div>
                    <input
                      v-model="settings.analytics"
                      type="checkbox"
                      class="toggle toggle-primary"
                      aria-label="Champ de saisie"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Privacy settings -->
          <div v-else-if="activeSection === 'privacy'" class="space-y-6">
            <div class="bg-base-100 rounded-xl shadow-lg border border-base-300 p-6">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-full bg-info/20 flex items-center justify-center">
                  <Shield class="w-5 h-5 text-info" />
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-base-content">
                    {{ t('settings.privacy.title') }}
                  </h2>
                  <p class="text-base-content/70">
                    {{ t('settings.privacy.description_association') }}
                  </p>
                </div>
              </div>

              <div class="space-y-6">
                <div class="form-control">
                  <label class="label cursor-pointer justify-between">
                    <div>
                      <span class="label-text font-medium">{{
                        t('settings.privacy.profile_visibility')
                      }}</span>
                      <p class="text-xs text-base-content/70">
                        {{ t('settings.privacy.profile_visibility_description_association') }}
                      </p>
                    </div>
                    <input
                      v-model="settings.profileVisibility"
                      type="checkbox"
                      class="toggle toggle-primary"
                      aria-label="Champ de saisie"
                    />
                  </label>
                </div>

                <div class="form-control">
                  <label class="label cursor-pointer justify-between">
                    <div>
                      <span class="label-text font-medium">{{
                        t('settings.privacy.contact_info')
                      }}</span>
                      <p class="text-xs text-base-content/70">
                        {{ t('settings.privacy.contact_info_description') }}
                      </p>
                    </div>
                    <input
                      v-model="settings.contactInfoVisibility"
                      type="checkbox"
                      class="toggle toggle-primary"
                      aria-label="Champ de saisie"
                    />
                  </label>
                </div>

                <div class="form-control">
                  <label class="label cursor-pointer justify-between">
                    <div>
                      <span class="label-text font-medium">{{
                        t('settings.privacy.event_visibility')
                      }}</span>
                      <p class="text-xs text-base-content/70">
                        {{ t('settings.privacy.event_visibility_description') }}
                      </p>
                    </div>
                    <input
                      v-model="settings.eventVisibility"
                      type="checkbox"
                      class="toggle toggle-primary"
                      aria-label="Champ de saisie"
                    />
                  </label>
                </div>

                <div class="form-control">
                  <label class="label cursor-pointer justify-between">
                    <div>
                      <span class="label-text font-medium">{{
                        t('settings.privacy.volunteer_list')
                      }}</span>
                      <p class="text-xs text-base-content/70">
                        {{ t('settings.privacy.volunteer_list_description') }}
                      </p>
                    </div>
                    <input
                      v-model="settings.volunteerListVisibility"
                      type="checkbox"
                      class="toggle toggle-primary"
                      aria-label="Champ de saisie"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Account settings -->
          <div v-else-if="activeSection === 'account'" class="space-y-6">
            <div class="bg-base-100 rounded-xl shadow-lg border border-base-300 p-6">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                  <Building2 class="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-base-content">
                    {{ t('settings.account.title') }}
                  </h2>
                  <p class="text-base-content/70">
                    {{ t('settings.account.description_association') }}
                  </p>
                </div>
              </div>

              <div class="space-y-6">
                <!-- Change Password -->
                <div class="bg-base-200 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="font-medium text-base-content">
                        {{ t('settings.account.change_password') }}
                      </h3>
                      <p class="text-sm text-base-content/70">
                        {{ t('settings.account.change_password_description') }}
                      </p>
                    </div>
                    <button
                      class="btn btn-outline btn-primary btn-sm"
                      @click="showPasswordChangeModal"
                    >
                      <Key class="w-4 h-4 mr-2" />
                      {{ t('settings.account.change') }}
                    </button>
                  </div>
                </div>

                <!-- Association Info -->
                <div class="bg-base-200 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="font-medium text-base-content">
                        {{ t('settings.account.association_info') }}
                      </h3>
                      <p class="text-sm text-base-content/70">
                        {{ t('settings.account.association_info_description') }}
                      </p>
                    </div>
                    <button class="btn btn-outline btn-info btn-sm" @click="editAssociationInfo">
                      <Edit class="w-4 h-4 mr-2" />
                      {{ t('settings.account.edit') }}
                    </button>
                  </div>
                </div>

                <!-- Delete Account -->
                <div class="bg-base-200 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="font-medium text-base-content">
                        {{ t('settings.account.delete_account') }}
                      </h3>
                      <p class="text-sm text-base-content/70">
                        {{ t('settings.account.delete_account_description_association') }}
                      </p>
                    </div>
                    <button
                      class="btn btn-outline btn-error btn-sm"
                      @click="showDeleteConfirmation"
                    >
                      <Trash2 class="w-4 h-4 mr-2" />
                      {{ t('settings.account.delete') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Security settings -->
          <div v-else-if="activeSection === 'security'" class="space-y-6">
            <div class="bg-base-100 rounded-xl shadow-lg border border-base-300 p-6">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center">
                  <Lock class="w-5 h-5 text-error" />
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-base-content">
                    {{ t('settings.security.title') }}
                  </h2>
                  <p class="text-base-content/70">
                    {{ t('settings.security.description_association') }}
                  </p>
                </div>
              </div>

              <div class="space-y-6">
                <div class="form-control">
                  <label class="label cursor-pointer justify-between">
                    <div>
                      <span class="label-text font-medium">{{
                        t('settings.security.two_factor')
                      }}</span>
                      <p class="text-xs text-base-content/70">
                        {{ t('settings.security.two_factor_description') }}
                      </p>
                    </div>
                    <input
                      v-model="settings.twoFactor"
                      type="checkbox"
                      class="toggle toggle-primary"
                      aria-label="Champ de saisie"
                    />
                  </label>
                </div>

                <div class="form-control">
                  <label class="label cursor-pointer justify-between">
                    <div>
                      <span class="label-text font-medium">{{
                        t('settings.security.login_notifications')
                      }}</span>
                      <p class="text-xs text-base-content/70">
                        {{ t('settings.security.login_notifications_description') }}
                      </p>
                    </div>
                    <input
                      v-model="settings.loginNotifications"
                      type="checkbox"
                      class="toggle toggle-primary"
                      aria-label="Champ de saisie"
                    />
                  </label>
                </div>

                <div class="form-control">
                  <label class="label cursor-pointer justify-between">
                    <div>
                      <span class="label-text font-medium">{{
                        t('settings.security.siret_verification')
                      }}</span>
                      <p class="text-xs text-base-content/70">
                        {{ t('settings.security.siret_verification_description') }}
                      </p>
                    </div>
                    <input
                      v-model="settings.siretVerification"
                      type="checkbox"
                      class="toggle toggle-primary"
                      aria-label="Champ de saisie"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Organization settings -->
          <div v-else-if="activeSection === 'organization'" class="space-y-6">
            <div class="bg-base-100 rounded-xl shadow-lg border border-base-300 p-6">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                  <Users class="w-5 h-5 text-success" />
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-base-content">
                    {{ t('settings.organization.title') }}
                  </h2>
                  <p class="text-base-content/70">
                    {{ t('settings.organization.description') }}
                  </p>
                </div>
              </div>

              <div class="space-y-6">
                <div class="form-control">
                  <label class="label cursor-pointer justify-between">
                    <div>
                      <span class="label-text font-medium">{{
                        t('settings.organization.auto_approve_volunteers')
                      }}</span>
                      <p class="text-xs text-base-content/70">
                        {{ t('settings.organization.auto_approve_volunteers_description') }}
                      </p>
                    </div>
                    <input
                      v-model="settings.autoApproveVolunteers"
                      type="checkbox"
                      class="toggle toggle-primary"
                      aria-label="Champ de saisie"
                    />
                  </label>
                </div>

                <div class="form-control">
                  <label class="label cursor-pointer justify-between">
                    <div>
                      <span class="label-text font-medium">{{
                        t('settings.organization.volunteer_limits')
                      }}</span>
                      <p class="text-xs text-base-content/70">
                        {{ t('settings.organization.volunteer_limits_description') }}
                      </p>
                    </div>
                    <input
                      v-model="settings.volunteerLimits"
                      type="checkbox"
                      class="toggle toggle-primary"
                      aria-label="Champ de saisie"
                    />
                  </label>
                </div>

                <div class="form-control">
                  <label class="label cursor-pointer justify-between">
                    <div>
                      <span class="label-text font-medium">{{
                        t('settings.organization.event_approval')
                      }}</span>
                      <p class="text-xs text-base-content/70">
                        {{ t('settings.organization.event_approval_description') }}
                      </p>
                    </div>
                    <input
                      v-model="settings.eventApproval"
                      type="checkbox"
                      class="toggle toggle-primary"
                      aria-label="Champ de saisie"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Confirmation Modal -->
    <dialog ref="deleteConfirmationModal" class="modal">
      <div class="modal-box">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center">
            <AlertTriangle class="w-5 h-5 text-error" />
          </div>
          <h3 class="font-bold text-lg">
            {{ t('settings.delete_confirmation.title') }}
          </h3>
        </div>
        <p class="py-4 text-base-content/70">
          {{ t('settings.delete_confirmation.message_association') }}
        </p>
        <div class="modal-action">
          <button class="btn btn-outline" @click="cancelDelete">
            {{ t('settings.delete_confirmation.cancel') }}
          </button>
          <button class="btn btn-error" @click="confirmDelete">
            <Trash2 class="w-4 h-4 mr-2" />
            {{ t('settings.delete_confirmation.confirm') }}
          </button>
        </div>
      </div>
    </dialog>

    <!-- Change Password Modal -->
    <dialog ref="passwordChangeModal" class="modal">
      <div class="modal-box">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Key class="w-5 h-5 text-primary" />
          </div>
          <h3 class="font-bold text-lg">
            {{ t('settings.password_change.title') }}
          </h3>
        </div>
        <p class="py-2 text-base-content/70">
          {{ t('settings.password_change.message') }}
        </p>

        <form class="space-y-4 py-4" @submit.prevent="changePassword">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">{{
                t('settings.password_change.old_password')
              }}</span>
            </label>
            <input
              v-model="passwordForm.oldPassword"
              type="password"
              class="input input-bordered"
              required
              :placeholder="t('settings.password_change.old_password_placeholder')"
              aria-label="Mot de passe"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">{{
                t('settings.password_change.new_password')
              }}</span>
            </label>
            <input
              v-model="passwordForm.newPassword"
              type="password"
              class="input input-bordered"
              required
              minlength="8"
              :placeholder="t('settings.password_change.new_password_placeholder')"
              aria-label="Mot de passe"
            />
            <label class="label">
              <span class="label-text-alt text-base-content/50">{{
                t('settings.password_change.password_requirements')
              }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">{{
                t('settings.password_change.confirm_password')
              }}</span>
            </label>
            <input
              v-model="passwordForm.confirmPassword"
              type="password"
              class="input input-bordered"
              required
              :placeholder="t('settings.password_change.confirm_password_placeholder')"
              aria-label="Mot de passe"
            />
          </div>

          <div v-if="passwordError" class="alert alert-error">
            <AlertCircle class="w-4 h-4" />
            <span>{{ passwordError }}</span>
          </div>

          <div class="modal-action">
            <button type="button" class="btn btn-outline" @click="cancelPasswordChange">
              {{ t('settings.password_change.cancel') }}
            </button>
            <button type="submit" class="btn btn-primary" :disabled="isPasswordFormInvalid">
              <Save class="w-4 h-4 mr-2" />
              {{ t('settings.password_change.confirm') }}
            </button>
          </div>
        </form>
      </div>
    </dialog>

    <ErrorPopup
      :show-error-modal="showErrorModal"
      :error-type="errorType"
      @reload="handleReload"
      @go-home="handleGoHome"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, onMounted } from 'vue'
  import {
    Bell,
    Shield,
    Building2,
    Lock,
    Key,
    Trash2,
    Save,
    AlertTriangle,
    AlertCircle,
    Users,
    Edit
  } from 'lucide-vue-next'
  import { useUser } from '~/composables/auth/useUser'
  import { useAssociationAuth } from '~/composables/useAssociation'
  import { useNavigation } from '~/composables/useNavigation'
  import ErrorPopup from '~/components/utils/ErrorPopup.vue'

  definePageMeta({
    middleware: ['auth'],
    layout: 'app'
  })

  const { t } = useI18n()
  const auth = useUser()
  const association = useAssociationAuth()
  const { navigateToRoute } = useNavigation()

  // State
  const isSaving = ref(false)
  const isDeleted = ref(false)
  const activeSection = ref('notifications')
  const deleteConfirmationModal = ref<HTMLDialogElement | null>(null)
  const passwordChangeModal = ref<HTMLDialogElement | null>(null)
  const showErrorModal = ref(false)
  const errorType = ref<'4xx' | '5xx' | null>(null)

  // Sections de paramètres
  const sections = ref([
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Confidentialité', icon: Shield },
    { id: 'account', label: 'Compte', icon: Building2 },
    { id: 'security', label: 'Sécurité', icon: Lock },
    { id: 'organization', label: 'Organisation', icon: Users }
  ])

  // Password change form data
  const passwordForm = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const passwordError = ref<string | null>(null)

  // Settings data
  const settings = ref({
    emailNotifications: true,
    pushNotifications: false,
    volunteerRequests: true,
    eventUpdates: true,
    analytics: true,
    profileVisibility: true,
    contactInfoVisibility: false,
    eventVisibility: true,
    volunteerListVisibility: false,
    twoFactor: false,
    loginNotifications: true,
    siretVerification: true,
    autoApproveVolunteers: false,
    volunteerLimits: true,
    eventApproval: true
  })

  // Computed
  const isPasswordFormInvalid = computed(() => {
    return (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword ||
      passwordForm.newPassword !== passwordForm.confirmPassword ||
      passwordForm.newPassword.length < 8
    )
  })

  // Methods
  onMounted(async () => {
    try {
      await initData()
    } catch (error) {
      handleError(error)
    }
  })

  async function initData() {
    if (!auth.isInitialized) {
      await auth.initializeUser()
    }
    if (!association.association.value) {
      await association.getAssociationInfo()
    }
  }

  function handleReload() {
    window.location.reload()
  }

  async function handleGoHome() {
    await navigateToRoute('/')
  }

  function showPasswordChangeModal() {
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    passwordError.value = null
    passwordChangeModal.value?.showModal()
  }

  function cancelPasswordChange() {
    passwordChangeModal.value?.close()
  }

  async function changePassword() {
    if (isPasswordFormInvalid.value) {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        passwordError.value = t('settings.password_change.error.password_mismatch')
      } else if (passwordForm.newPassword.length < 8) {
        passwordError.value = t('settings.password_change.error.weak_password')
      }
      return
    }

    passwordError.value = null

    try {
      await auth.updatePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      })

      passwordChangeModal.value?.close()
      alert(t('settings.password_change.success'))
    } catch (error: any) {
      passwordError.value = error.message || t('settings.password_change.error.general')
      handleError(error)
    }
  }

  function editAssociationInfo() {
    // Rediriger vers la page d'édition du profil
    navigateToRoute('/association/account/edit')
  }

  function showDeleteConfirmation() {
    deleteConfirmationModal.value?.showModal()
  }

  function cancelDelete() {
    deleteConfirmationModal.value?.close()
  }

  async function confirmDelete() {
    deleteConfirmationModal.value?.close()
    await removeUser()
    await removeAssociation()
    window.location.href = '/'
  }

  async function removeAssociation() {
    isDeleted.value = true
    try {
      await association.removeAssociation()
    } catch (error) {
      isDeleted.value = false
      handleError(error)
    } finally {
      isDeleted.value = false
    }
  }

  async function removeUser() {
    isDeleted.value = true

    try {
      await auth.removeUser()
    } catch (error) {
      isDeleted.value = false
      handleError(error)
    } finally {
      isDeleted.value = false
    }
  }

  async function saveSettings() {
    isSaving.value = true
    try {
      // Simuler une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Paramètres sauvegardés:', settings.value)
    } catch (error) {
      handleError(error)
    } finally {
      isSaving.value = false
    }
  }

  function handleError(error: any) {
    if (error?.response?.status >= 500 && error?.response?.status < 600) {
      errorType.value = '5xx'
      showErrorModal.value = true
    } else if (error?.response?.status >= 400 && error?.response?.status < 500) {
      errorType.value = '4xx'
      showErrorModal.value = true
    } else {
      console.error('Erreur inattendue:', error)
    }
  }
</script>

<style scoped>
  .btn {
    transition: all 0.2s ease-in-out;
  }

  .btn:hover {
    transform: translateY(-1px);
  }

  .form-control {
    transition: all 0.2s ease-in-out;
  }

  .form-control:hover {
    transform: translateY(-1px);
  }
</style>
