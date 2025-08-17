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
              {{ t('settings.subtitle') }}
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
                :aria-label="t('settings.navigation.section')"
              >
                <component :is="section.icon" class="w-4 h-4 mr-2" />
                {{ section.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="lg:col-span-3">
          <!-- Loading state -->
          <div
            v-if="isDeleting"
            class="fixed inset-0 bg-base-200 bg-opacity-90 z-[1000] flex items-center justify-center backdrop-blur-sm"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            <div class="flex flex-col items-center space-y-4">
              <img src="/logo.png" alt="" class="w-16 h-16 sm:w-20 sm:h-20 animate-spin" />
              <div class="text-base-content opacity-70 text-sm sm:text-base">
                {{ t('settings.deletion.inProgress') }}
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
                    {{ t('settings.privacy.description') }}
                  </p>
                </div>
              </div>

              <div class="space-y-6">
                <div class="form-control">
                  <label class="label cursor-pointer justify-between">
                    <div>
                      <span class="label-text font-medium">
                        {{ t('settings.privacy.profile_visibility') }}
                      </span>
                      <p class="text-xs text-base-content/70">
                        {{ t('settings.privacy.profile_visibility_description') }}
                      </p>
                    </div>
                    <input
                      v-model="settings.profileVisibility"
                      type="checkbox"
                      class="toggle toggle-primary"
                      :aria-label="t('settings.form.inputField')"
                    />
                  </label>
                </div>

                <div class="form-control">
                  <label class="label cursor-pointer justify-between">
                    <div>
                      <span class="label-text font-medium">
                        {{ t('settings.privacy.location_sharing') }}
                      </span>
                      <p class="text-xs text-base-content/70">
                        {{ t('settings.privacy.location_sharing_description') }}
                      </p>
                    </div>
                    <input
                      v-model="settings.locationSharing"
                      type="checkbox"
                      class="toggle toggle-primary"
                      :aria-label="t('settings.form.inputField')"
                    />
                  </label>
                </div>

                <div class="form-control">
                  <label class="label cursor-pointer justify-between">
                    <div>
                      <span class="label-text font-medium">
                        {{ t('settings.privacy.activity_sharing') }}
                      </span>
                      <p class="text-xs text-base-content/70">
                        {{ t('settings.privacy.activity_sharing_description') }}
                      </p>
                    </div>
                    <input
                      v-model="settings.activitySharing"
                      type="checkbox"
                      class="toggle toggle-primary"
                      :aria-label="t('settings.form.inputField')"
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
                  <User class="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h2 class="text-xl font-semibold text-base-content">
                    {{ t('settings.account.title') }}
                  </h2>
                  <p class="text-base-content/70">
                    {{ t('settings.account.description') }}
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

                <!-- Delete Account -->
                <div class="bg-base-200 rounded-lg p-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="font-medium text-base-content">
                        {{ t('settings.account.delete_account') }}
                      </h3>
                      <p class="text-sm text-base-content/70">
                        {{ t('settings.account.delete_account_description') }}
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
                    {{ t('settings.security.description') }}
                  </p>
                </div>
              </div>

              <div class="space-y-6">
                <div class="form-control">
                  <label class="label cursor-pointer justify-between">
                    <div>
                      <span class="label-text font-medium">
                        {{ t('settings.security.two_factor') }}
                      </span>
                      <p class="text-xs text-base-content/70">
                        {{ t('settings.security.two_factor_description') }}
                      </p>
                    </div>
                    <input
                      v-model="settings.twoFactor"
                      type="checkbox"
                      class="toggle toggle-primary"
                      :aria-label="t('settings.form.inputField')"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- fallback -->
          <div v-else class="bg-base-100 rounded-xl shadow-lg border border-base-300 p-6">
            {{ t('common.select_a_section') }}
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
          {{ t('settings.delete_confirmation.message') }}
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
          <!-- ... champs inchangés ... -->
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
  import { Shield, User, Lock, Key, Trash2, Save, AlertTriangle } from 'lucide-vue-next'
  import { useUser } from '~/composables/auth/useUser'
  import { useVolunteerAuth } from '~/composables/useVolunteer'
  import { useNavigation } from '~/composables/useNavigation'
  import { useSettingsStore } from '~/stores/settings.store'
  import ErrorPopup from '~/components/utils/ErrorPopup.vue'

  definePageMeta({ layout: 'app' })

  const { t } = useI18n()
  const auth = useUser()
  const volunteer = useVolunteerAuth()
  const { navigateToRoute } = useNavigation()

  type SectionId = 'privacy' | 'account' | 'security'
  type Section = { id: SectionId; label: string; icon: any }
  const isSaving = ref(false)
  const activeSection = ref<SectionId>('privacy')
  const deleteConfirmationModal = ref<HTMLDialogElement | null>(null)
  const passwordChangeModal = ref<HTMLDialogElement | null>(null)
  const showErrorModal = ref(false)
  const errorType = ref<'4xx' | '5xx' | null>(null)
  const isDeleting = ref(false)

  // Sections de paramètres (3 éléments)
  const sections = ref<Section[]>([
    { id: 'privacy', label: t('settings.sections.privacy'), icon: Shield },
    { id: 'account', label: t('settings.sections.account'), icon: User },
    { id: 'security', label: t('settings.sections.security'), icon: Lock }
  ])

  // Password change form data
  const passwordForm = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const passwordError = ref<string | null>(null)

  // Settings store
  const settingsStore = useSettingsStore()

  // Local settings for form state
  const settings = ref({
    profileVisibility: true,
    locationSharing: false,
    activitySharing: true,
    twoFactor: false
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
    await initData()
  })

  async function initData() {
    try {
      if (!auth.getUserId) {
        await auth.initializeUser()
      }
      if (auth.getUserId) {
        await volunteer.getVolunteerInfo()
        // Load settings from store
        await settingsStore.loadVolunteer()
        // Update local settings with store data
        settings.value = { ...settingsStore.volunteer }
      }
    } catch (error) {
      handleError(error)
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

  function showDeleteConfirmation() {
    deleteConfirmationModal.value?.showModal()
  }

  function cancelDelete() {
    deleteConfirmationModal.value?.close()
  }

  async function removeUser() {
    return await auth.removeUser()
  }

  async function confirmDelete() {
    if (isDeleting.value) return
    isDeleting.value = true

    try {
      deleteConfirmationModal.value?.close()
      await removeUser()
      if (typeof window !== 'undefined') {
        window.location.replace('/')
        return
      }
    } catch (err) {
      handleError(err)
      isDeleting.value = false
    } finally {
      isDeleting.value = false
    }
  }

  async function saveSettings() {
    isSaving.value = true
    try {
      // Save settings to store - only pass the modifiable fields
      const modifiableSettings = {
        profileVisibility: settings.value.profileVisibility,
        locationSharing: settings.value.locationSharing,
        activitySharing: settings.value.activitySharing,
        twoFactor: settings.value.twoFactor
      }
      await settingsStore.saveVolunteer(modifiableSettings)
      // Update local settings with response
      settings.value = { ...settingsStore.volunteer }
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
      process.env.NODE_ENV !== 'production' && console.error(t('settings.errors.unexpected'), error)
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
