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
          <h3 class="text-lg font-semibold mb-2">🍪 Gestion des cookies</h3>
          <p class="text-sm text-base-content/80 mb-4 md:mb-0">
            Nous utilisons des cookies pour améliorer votre expérience sur notre site. Certains sont
            nécessaires au fonctionnement du site, tandis que d'autres nous aident à comprendre
            comment vous l'utilisez. Vous pouvez accepter tous les cookies ou personnaliser vos
            préférences.
            <NuxtLink to="/confidentialite" class="text-primary hover:underline">
              En savoir plus
            </NuxtLink>
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button class="btn btn-outline btn-sm" @click="openSettings">Personnaliser</button>
          <button class="btn btn-primary btn-sm" @click="acceptAll">Accepter tout</button>
          <button class="btn btn-ghost btn-sm" @click="rejectNonEssential">
            Refuser non essentiels
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de paramétrage des cookies -->
  <dialog ref="settingsModal" class="modal">
    <div class="modal-box max-w-2xl">
      <h3 class="font-bold text-lg mb-4">Paramètres des cookies</h3>

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
              <span class="label-text font-semibold">Cookies essentiels</span>
              <p class="text-xs text-base-content/70 mt-1">
                Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être
                désactivés. Ils permettent notamment de vous authentifier et de sécuriser votre
                navigation.
                <span class="text-warning font-medium"
                  >Sans ces cookies, vous ne pourrez pas vous connecter à votre compte.</span
                >
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
              <span class="label-text font-semibold">Cookies de personnalisation</span>
              <p class="text-xs text-base-content/70 mt-1">
                Ces cookies nous permettent de vous proposer des contenus adaptés à vos centres
                d'intérêt, de mémoriser vos préférences d'affichage et d'utiliser votre localisation
                pour des services géolocalisés.
                <span class="text-info font-medium"
                  >Nécessaire pour la géolocalisation et les données personnelles.</span
                >
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
              <span class="label-text font-semibold">Cookies analytiques</span>
              <p class="text-xs text-base-content/70 mt-1">
                Ces cookies nous permettent de mesurer l'audience de notre site et d'améliorer son
                fonctionnement. Ils sont utilisés par Firebase Analytics pour générer des
                statistiques anonymes.
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
              <span class="label-text font-semibold">Cookies tiers</span>
              <p class="text-xs text-base-content/70 mt-1">
                Ces cookies sont déposés par des services tiers comme Google Fonts ou les réseaux
                sociaux. Ils permettent notamment d'afficher des polices personnalisées et de
                partager du contenu.
              </p>
            </div>
          </label>
        </div>
      </div>

      <div class="modal-action">
        <button class="btn btn-ghost" @click="closeSettings">Annuler</button>
        <button class="btn btn-primary" @click="saveSettings">Enregistrer</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>Fermer</button>
    </form>
  </dialog>

  <!-- Modal d'alerte pour les permissions manquantes -->
  <dialog ref="permissionModal" class="modal">
    <div class="modal-box max-w-lg">
      <h3 class="font-bold text-lg mb-4 text-warning">⚠️ Permissions requises</h3>
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
            <h4 class="font-bold">Authentification impossible</h4>
            <p class="text-sm">Vous devez accepter les cookies essentiels pour vous connecter.</p>
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
            <h4 class="font-bold">Géolocalisation désactivée</h4>
            <p class="text-sm">
              Acceptez les cookies de personnalisation pour utiliser la géolocalisation.
            </p>
          </div>
        </div>
      </div>
      <div class="modal-action">
        <button class="btn btn-ghost" @click="closePermissionModal">Fermer</button>
        <button class="btn btn-primary" @click="openSettings">Paramétrer les cookies</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>Fermer</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'

  // Référence au modal des paramètres
  const settingsModal = ref<HTMLDialogElement | null>(null)
  const permissionModal = ref<HTMLDialogElement | null>(null)

  // État d'affichage de la bannière
  const showBanner = ref(false)

  // Préférences locales pour le modal (copie des préférences actuelles)
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

  // Initialiser les préférences locales
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

  // Actions utilisateur
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

  // Afficher le modal de permissions si nécessaire
  function showPermissionModal() {
    if (!permissions.value.canAuthenticate || !permissions.value.canUseLocation) {
      permissionModal.value?.showModal()
    }
  }

  // Initialisation
  onMounted(async () => {
    try {
      const { usePermissions } = await import('~/composables/usePermissions')
      const permissionsComposable = usePermissions()

      // Afficher la bannière si l'utilisateur n'a pas encore consenti
      showBanner.value = !permissionsComposable.hasConsented.value

      // Initialiser les préférences locales
      await initLocalPreferences()

      // Écouter les changements de permissions
      watch(
        () => permissionsComposable.permissions.value,
        newPermissions => {
          permissions.value = newPermissions

          // Si l'utilisateur a consenti mais n'a pas les permissions nécessaires
          if (
            permissionsComposable.hasConsented.value &&
            (!newPermissions.canAuthenticate || !newPermissions.canUseLocation)
          ) {
            // Afficher le modal d'alerte après un délai pour laisser le temps à l'utilisateur de voir les changements
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

    // Ajouter un écouteur d'événement pour ouvrir les paramètres depuis le footer
    window.addEventListener('openCookieSettings', () => {
      openSettings()
    })
  })

  // Exposer des méthodes pour permettre de réafficher la bannière si nécessaire
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
