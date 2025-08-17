<template>
  <div
    v-if="showBanner"
    id="cookie-consent"
    class="fixed bottom-0 left-0 right-0 bg-base-200 shadow-lg z-50 transition-all duration-300"
    :class="{ 'translate-y-0': showBanner, 'translate-y-full': !showBanner }"
  >
    <div class="container mx-auto px-4 py-4 md:py-6">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div class="flex-1">
          <h3 class="text-lg font-semibold mb-2">{{ t('cookieConsent.banner.title') }}</h3>
          <p class="text-sm text-base-content/80 mb-4 md:mb-0">
            {{ t('cookieConsent.banner.description') }}
            <NuxtLink to="/confidentialite" class="text-primary hover:underline">
              {{ t('cookieConsent.banner.learn_more') }}
            </NuxtLink>
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button class="btn btn-outline btn-sm" @click="openSettings">
            {{ t('cookieConsent.banner.customize') }}
          </button>
          <button class="btn btn-primary btn-sm" @click="acceptAll">
            {{ t('cookieConsent.banner.accept_all') }}
          </button>
          <button class="btn btn-ghost btn-sm" @click="rejectNonEssential">
            {{ t('cookieConsent.banner.reject_non_essential') }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de paramétrage des cookies -->
  <dialog ref="settingsModal" class="modal">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-4">{{ t('cookieConsent.settings.title') }}</h3>

      <div class="space-y-6">
        <!-- Cookies essentiels -->
        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-4">
            <input
              type="checkbox"
              checked
              disabled
              class="checkbox checkbox-primary"
              aria-label="Champ de saisie"
            />
            <div>
              <span class="label-text font-semibold">{{
                t('cookieConsent.settings.essential.title')
              }}</span>
              <p class="text-xs text-base-content/70 mt-1">
                {{ t('cookieConsent.settings.essential.description') }}
                <span class="text-warning font-medium">
                  {{ t('cookieConsent.settings.essential.warning') }}
                </span>
              </p>
            </div>
          </label>
        </div>

        <!-- Cookies de personnalisation -->
        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-4">
            <input
              v-model="localPreferences.personalization"
              type="checkbox"
              class="checkbox checkbox-primary"
              aria-label="Champ de saisie"
            />
            <div>
              <span class="label-text font-semibold">{{
                t('cookieConsent.settings.personalization.title')
              }}</span>
              <p class="text-xs text-base-content/70 mt-1">
                {{ t('cookieConsent.settings.personalization.description') }}
                <span class="text-info font-medium">
                  {{ t('cookieConsent.settings.personalization.info') }}
                </span>
              </p>
            </div>
          </label>
        </div>

        <!-- Cookies analytiques -->
        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-4">
            <input
              v-model="localPreferences.analytics"
              type="checkbox"
              class="checkbox checkbox-primary"
              aria-label="Champ de saisie"
            />
            <div>
              <span class="label-text font-semibold">{{
                t('cookieConsent.settings.analytics.title')
              }}</span>
              <p class="text-xs text-base-content/70 mt-1">
                {{ t('cookieConsent.settings.analytics.description') }}
              </p>
            </div>
          </label>
        </div>

        <!-- Cookies tiers -->
        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-4">
            <input
              v-model="localPreferences.thirdParty"
              type="checkbox"
              class="checkbox checkbox-primary"
              aria-label="Champ de saisie"
            />
            <div>
              <span class="label-text font-semibold">{{
                t('cookieConsent.settings.third_party.title')
              }}</span>
              <p class="text-xs text-base-content/70 mt-1">
                {{ t('cookieConsent.settings.third_party.description') }}
              </p>
            </div>
          </label>
        </div>
      </div>

      <div class="modal-action">
        <button class="btn btn-ghost" @click="closeSettings">
          {{ t('cookieConsent.settings.actions.cancel') }}
        </button>
        <button class="btn btn-primary" @click="saveSettings">
          {{ t('cookieConsent.settings.actions.save') }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>{{ t('cookieConsent.settings.actions.cancel') }}</button>
    </form>
  </dialog>

  <!-- Modal d'alerte pour les permissions manquantes -->
  <dialog ref="permissionModal" class="modal">
    <div class="modal-box max-w-lg">
      <h3 class="font-bold text-lg mb-4 text-warning">
        {{ t('cookieConsent.permissions.title') }}
      </h3>
      <div class="space-y-4">
        <div v-if="!permissions.canAuthenticate" class="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div>
            <h4 class="font-bold">{{ t('cookieConsent.permissions.authentication.title') }}</h4>
            <p class="text-sm">{{ t('cookieConsent.permissions.authentication.description') }}</p>
          </div>
        </div>

        <div v-if="!permissions.canUseLocation" class="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="stroke-current shrink-0 w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4 class="font-bold">{{ t('cookieConsent.permissions.location.title') }}</h4>
            <p class="text-sm">
              {{ t('cookieConsent.permissions.location.description') }}
            </p>
          </div>
        </div>
      </div>
      <div class="modal-action">
        <button class="btn btn-ghost" @click="closePermissionModal">
          {{ t('cookieConsent.permissions.actions.close') }}
        </button>
        <button class="btn btn-primary" @click="openSettings">
          {{ t('cookieConsent.permissions.actions.configure') }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>{{ t('cookieConsent.permissions.actions.close') }}</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'

  const { t } = useI18n()

  const settingsModal = ref<HTMLDialogElement | null>(null)
  const permissionModal = ref<HTMLDialogElement | null>(null)

  const showBanner = ref(false)

  const localPreferences = ref({
    essential: true,
    analytics: false,
    personalization: false,
    thirdParty: false
  })

  const permissions = ref({
    canAuthenticate: true,
    canUseLocation: false,
    canUsePersonalData: false,
    canUseAnalytics: false,
    canUseThirdParty: false
  })

  const initLocalPreferences = async () => {
    try {
      const { usePermissions } = await import('~/composables/usePermissions')
      const permissionsComposable = usePermissions()
      const currentPrefs = permissionsComposable.cookiePreferences.value
      localPreferences.value = { ...currentPrefs }
    } catch (err) {
      process.env.NODE_ENV !== 'production' &&
        console.warn('Impossible de charger les préférences de cookies:', err)
    }
  }

  async function acceptAll() {
    try {
      const { usePermissions } = await import('~/composables/usePermissions')
      const { acceptAllCookies } = usePermissions()
      acceptAllCookies()
      showBanner.value = false
    } catch (err) {
      process.env.NODE_ENV !== 'production' &&
        console.warn("Impossible d'accepter tous les cookies:", err)
    }
  }

  async function rejectNonEssential() {
    try {
      const { usePermissions } = await import('~/composables/usePermissions')
      const { rejectNonEssentialCookies } = usePermissions()
      rejectNonEssentialCookies()
      showBanner.value = false
    } catch (err) {
      process.env.NODE_ENV !== 'production' &&
        console.warn('Impossible de refuser les cookies non essentiels:', err)
    }
  }

  async function openSettings() {
    await initLocalPreferences()
    settingsModal.value?.showModal()
  }

  function closeSettings() {
    settingsModal.value?.close()
  }

  async function saveSettings() {
    try {
      const { usePermissions } = await import('~/composables/usePermissions')
      const { saveCookiePreferences } = usePermissions()
      saveCookiePreferences(localPreferences.value)
      showBanner.value = false
      closeSettings()
    } catch (err) {
      process.env.NODE_ENV !== 'production' &&
        console.warn('Impossible de sauvegarder les paramètres:', err)
    }
  }

  function closePermissionModal() {
    permissionModal.value?.close()
  }

  function showPermissionModal() {
    if (!permissions.value.canAuthenticate || !permissions.value.canUseLocation) {
      permissionModal.value?.showModal()
    }
  }

  onMounted(async () => {
    try {
      const { usePermissions } = await import('~/composables/usePermissions')
      const permissionsComposable = usePermissions()

      showBanner.value = !permissionsComposable.hasConsented.value

      await initLocalPreferences()

      watch(
        () => permissionsComposable.permissions.value,
        newPermissions => {
          permissions.value = newPermissions

          if (
            permissionsComposable.hasConsented.value &&
            (!newPermissions.canAuthenticate || !newPermissions.canUseLocation)
          ) {
            setTimeout(() => {
              showPermissionModal()
            }, 1000)
          }
        },
        { immediate: true }
      )
    } catch (err) {
      process.env.NODE_ENV !== 'production' &&
        console.warn("Impossible d'initialiser le système de permissions:", err)
    }

    window.addEventListener('openCookieSettings', () => {
      openSettings()
    })
  })

  defineExpose({
    showBanner: () => {
      showBanner.value = true
    },
    openSettings,
    showPermissionModal
  })
</script>

<style scoped>
  .modal-box {
    max-width: 600px;
  }
</style>
