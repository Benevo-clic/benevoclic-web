<template>
  <div>
    <div class="max-w-3xl mx-auto px-4">
      <!-- Header infos -->
      <div class="flex flex-col items-center mt-12 mb-6">
        <div
          class="w-32 h-32 rounded-full border-4 border-base-100 shadow-lg bg-base-300 flex items-center justify-center overflow-hidden mb-4"
        >
          <img
            v-if="profileImageUrl"
            :src="profileImageUrl"
            :alt="t('profile.association.logo')"
            class="w-full h-full object-cover"
          />
          <UserRound v-else class="w-16 h-16 text-base-content opacity-50" />
        </div>
        <h1 class="text-3xl font-bold text-base-content mb-1">
          {{ user?.associationName }}
        </h1>
        <span
          class="badge badge-outline badge-primary mb-2 text-base-content border-base-content"
          >{{ user?.type || t('profile.association.typeNotProvided') }}</span
        >
        <p class="text-base-content/80 text-center max-w-xl mb-2">
          {{ user?.bio || t('profile.bio.notProvided') }}
        </p>
        <div class="flex gap-2 mt-2">
          <NuxtLink to="/association/account/edit" class="btn btn-sm btn-outline btn-primary">
            {{ t('profile.editProfile') }}
          </NuxtLink>
          <button class="btn btn-sm btn-outline btn-secondary">{{ t('profile.share') }}</button>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <NuxtLink to="/association/account/volunteers">
          <div class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center">
            <span class="text-2xl font-bold text-primary">{{ user?.volunteers?.length ?? 0 }}</span>
            <span class="text-xs text-base-content/70">{{ t('profile.stats.volunteers') }}</span>
          </div>
        </NuxtLink>
        <NuxtLink to="/association/events/association/manage">
          <div class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center">
            <span class="text-2xl font-bold text-primary">{{ nbAnnouncements }}</span>
            <span class="text-xs text-base-content/70">{{
              t('profile.stats.announcementsCreated')
            }}</span>
          </div>
        </NuxtLink>
        <div class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center">
          <span class="text-2xl font-bold text-primary">{{ creationDate }}</span>
          <span class="text-xs text-base-content/70">{{ t('profile.stats.createdOn') }}</span>
        </div>
        <div class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center">
          <span class="text-2xl font-bold text-primary">{{ user?.city || '-' }}</span>
          <span class="text-xs text-base-content/70">{{ t('profile.stats.city') }}</span>
        </div>
      </div>

      <!-- Informations détaillées -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="bg-base-100 rounded-xl shadow p-6 space-y-3">
          <h3 class="font-semibold mb-2 text-base-content">{{ t('profile.sections.contact') }}</h3>
          <div class="flex items-center gap-2 text-base-content flex-wrap min-w-0">
            <Mail class="w-5 h-5 text-primary shrink-0" />
            <span>{{ t('profile.contact.email') }}</span>
            <span class="font-medium break-all">{{ auth.user.value?.email }}</span>
          </div>
          <div class="flex items-center gap-2 text-base-content flex-wrap min-w-0">
            <Phone class="w-5 h-5 text-primary shrink-0" />
            <span>{{ t('profile.contact.phone') }}</span>
            <span class="font-medium">{{ user?.phone || t('profile.notProvided') }}</span>
          </div>
        </div>
        <div class="bg-base-100 rounded-xl shadow p-6 space-y-3">
          <h3 class="font-semibold mb-2 text-base-content">{{ t('profile.sections.location') }}</h3>
          <div class="flex items-center gap-2 text-base-content flex-wrap min-w-0">
            <Globe class="w-5 h-5 text-primary shrink-0" />
            <span>{{ t('profile.location.country') }}</span>
            <span class="font-medium">{{ user?.country || t('profile.notProvided') }}</span>
          </div>
          <div class="flex items-center gap-2 text-base-content flex-wrap min-w-0">
            <MapPin class="w-5 h-5 text-primary shrink-0" />
            <span>{{ t('profile.location.city') }}</span>
            <span class="font-medium">{{ user?.city || t('profile.notProvided') }}</span>
          </div>
          <div class="flex items-center gap-2 text-base-content flex-wrap min-w-0">
            <MapPin class="w-5 h-5 text-primary shrink-0" />
            <span>{{ t('profile.location.postalCode') }}</span>
            <span class="font-medium">{{ user?.postalCode || t('profile.notProvided') }}</span>
          </div>
        </div>
      </div>

      <!-- Section supplémentaire : réseaux sociaux, site web, etc. -->
      <div class="bg-base-100 rounded-xl shadow p-6 flex flex-col items-center">
        <h3 class="font-semibold mb-2 text-base-content">
          {{ t('profile.sections.socialNetworks') }}
        </h3>
        <div class="flex gap-4">
          <span class="text-base-content/60">{{ t('profile.socialNetworks.noWebsite') }}</span>
          <!-- Ajoute ici d'autres liens réseaux sociaux si tu les as -->
        </div>
      </div>
    </div>
    <ErrorPopup
      :show-error-modal="showErrorModal"
      :error-type="errorType"
      @reload="handleReload"
      @go-home="handleGoHome"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { Globe, Mail, MapPin, Phone, UserRound } from 'lucide-vue-next'
  import { useUser } from '~/composables/auth/useUser'
  import { useAssociationAuth } from '~/composables/useAssociation'
  import { useAnnouncement } from '~/composables/useAnnouncement'
  import ErrorPopup from '~/components/utils/ErrorPopup.vue'
  import { useNavigation } from '~/composables/useNavigation'

  const { t } = useI18n()

  definePageMeta({
    middleware: ['auth'],
    layout: 'app'
  })

  const auth = useUser()
  const { association: user, getAssociationInfo } = useAssociationAuth()
  const announcementStore = useAnnouncement()
  const { navigateToRoute } = useNavigation()

  const showErrorModal = ref(false)
  const errorType = ref<'4xx' | '5xx' | null>(null)

  function handleReload() {
    window.location.reload()
  }
  async function handleGoHome() {
    await navigateToRoute('/')
  }

  onMounted(async () => {
    try {
      await initData()
    } catch (error) {
      handleError(error)
    }
  })

  async function initData() {
    await auth.initializeUser()
    if (!user.value) {
      await getAssociationInfo()
    }
    await announcementStore.fetchAnnouncements(user.value?.associationId)
  }

  function handleError(error: any) {
    if (error?.response?.status >= 500 && error?.response?.status < 600) {
      errorType.value = '5xx'
      showErrorModal.value = true
    } else if (error?.response?.status >= 400 && error?.response?.status < 500) {
      errorType.value = '4xx'
      showErrorModal.value = true
    } else {
      process.env.NODE_ENV !== 'production' && console.error(t('profile.errors.unexpected'), error)
    }
  }

  const nbAnnouncements = computed(
    () =>
      (announcementStore.getAnnouncements.value || []).filter(
        a => a.associationId === user.value?.associationId
      ).length
  )

  const creationDate = computed(() => {
    // Fallback si createdAt n'existe pas
    if ('createdAt' in (user.value || {})) {
      // @ts-ignore
      return formatDate(user.value?.createdAt)
    }
    return '-'
  })

  const profileImageUrl = computed(() => {
    return auth.user.value?.avatarFileKey
  })

  function formatDate(dateString?: string) {
    if (!dateString) {
      return '-'
    }
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    return new Date(dateString).toLocaleDateString('fr-FR', options)
  }
</script>
