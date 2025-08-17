<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-base-200 py-8">
    <div class="w-11/12 md:max-w-3xl mx-auto px-4">
      <!-- Header infos -->
      <div class="flex flex-col items-center mt-12 mb-6">
        <div
          class="w-32 h-32 rounded-full border-4 border-base-100 shadow-lg bg-base-300 flex items-center justify-center overflow-hidden mb-4"
        >
          <img
            v-if="profileImageUrl"
            :src="profileImageUrl"
            :alt="t('profile.volunteer.photo')"
            class="w-full h-full object-cover"
            width="128"
            height="128"
          />
          <UserRound v-else class="w-16 h-16 text-base-content opacity-50" />
        </div>
        <h1
          class="font-bold text-base-content mb-1 text-xl sm:text-2xl md:text-3xl w-full text-center whitespace-nowrap overflow-hidden text-ellipsis"
          style="max-width: 100vw"
        >
          {{ user?.firstName }} {{ user?.lastName }}
        </h1>
        <span
          class="badge badge-outline badge-primary mb-2 text-base-content border-base-content"
          >{{
            user?.birthDate
              ? calculateAge(user.birthDate) + ' ' + t('profile.age.years')
              : t('profile.birthDate.notProvided')
          }}</span
        >
        <p class="text-base-content/80 text-center max-w-xl mb-2">
          {{ user?.bio || t('profile.bio.notProvided') }}
        </p>
        <div class="flex gap-2 mt-2">
          <NuxtLink to="/volunteer/account/edit" class="btn btn-sm btn-outline btn-primary">
            {{ t('profile.editProfile') }}
          </NuxtLink>
        </div>
      </div>

      <!-- Statistiques -->
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8 items-stretch"
      >
        <NuxtLink to="/volunteer/account/associations">
          <div
            class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center justify-center h-full"
          >
            <span class="text-2xl font-bold text-primary">{{ associationsFollowing?.length }}</span>
            <span class="text-xs text-base-content/70">{{ t('profile.stats.associations') }}</span>
          </div>
        </NuxtLink>

        <div
          class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center justify-center h-full"
        >
          <span class="text-2xl font-bold text-primary">{{ nbParticipants }}</span>
                      <span class="text-xs text-base-content/70">{{ t('profile.stats.eventsParticipated') }}</span>
        </div>

        <div
          class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center justify-center h-full"
        >
          <span class="text-2xl font-bold text-primary">{{ nbVolunteerAnnouncements }}</span>
                      <span class="text-xs text-base-content/70">{{ t('profile.stats.volunteerOpportunities') }}</span>
        </div>

        <div
          class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center justify-center h-full"
        >
          <span class="text-2xl font-bold text-primary">{{ user?.city || '-' }}</span>
                      <span class="text-xs text-base-content/70">{{ t('profile.stats.city') }}</span>
        </div>

        <div
          class="bg-base-100 rounded-xl shadow p-4 flex flex-col items-center justify-center h-full"
        >
          <span class="text-2xl font-bold text-primary">{{ user?.postalCode || '-' }}</span>
                      <span class="text-xs text-base-content/70">{{ t('profile.stats.postalCode') }}</span>
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
          <div class="flex items-center gap-2 text-base-content">
            <Phone class="w-5 h-5 text-primary" />
            <span>{{ t('profile.contact.phone') }}</span>
            <span class="font-medium">{{ user?.phone || t('profile.notProvided') }}</span>
          </div>
        </div>
        <div class="bg-base-100 rounded-xl shadow p-6 space-y-3">
          <h3 class="font-semibold mb-2 text-base-content">{{ t('profile.sections.location') }}</h3>
          <div class="flex items-center gap-2 text-base-content">
            <MapPin class="w-5 h-5 text-primary" />
            <span>{{ t('profile.location.city') }}</span>
            <span class="font-medium">{{ user?.city || t('profile.notProvided') }}</span>
          </div>
          <div class="flex items-center gap-2 text-base-content">
            <MapPin class="w-5 h-5 text-primary" />
            <span>{{ t('profile.location.postalCode') }}</span>
            <span class="font-medium">{{ user?.postalCode || t('profile.notProvided') }}</span>
          </div>
        </div>
      </div>

      <!-- Section supplémentaire : réseaux sociaux, site web, etc. -->
      <div class="bg-base-100 rounded-xl shadow p-6 flex flex-col items-center">
        <h3 class="font-semibold mb-2 text-base-content">{{ t('profile.sections.socialNetworks') }}</h3>
        <div class="flex gap-4">
          <span class="text-base-content/60">{{ t('profile.socialNetworks.noWebsite') }}</span>
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
  import { computed, ref, onMounted } from 'vue'
  import { UserRound, Mail, Phone, MapPin } from 'lucide-vue-next'
  import { useUser } from '~/composables/auth/useUser'
  import { useVolunteerAuth } from '~/composables/useVolunteer'
  import ErrorPopup from '~/components/utils/ErrorPopup.vue'
  import { useNavigation } from '~/composables/useNavigation'
  import type { AssociationVolunteerFollow } from '~/common/interface/volunteer.interface'

  const { t } = useI18n()

  definePageMeta({
    middleware: ['auth'],
    layout: 'app'
  })

  const auth = useUser()

  const {
    volunteer: user,
    getVolunteerInfo,
    getVolunteerAnnouncements,
    getAllAssociationsFollowingList
  } = useVolunteerAuth()
  const { navigateToRoute } = useNavigation()

  const showErrorModal = ref(false)
  const errorType = ref<'4xx' | '5xx' | null>(null)
  const associationsFollowing = ref<AssociationVolunteerFollow[]>()

  const nbParticipants = ref<number>(0)

  let nbVolunteerAnnouncements = ref<number>(0)

  function handleReload() {
    window.location.reload()
  }
  async function handleGoHome() {
    await navigateToRoute('/')
  }

  onMounted(async () => {
    await initData()
  })

  async function initData() {
    try {
      if (!auth.getUserId) {
        await auth.initializeUser()
      }
      if (auth.getUserId) {
        await getVolunteerInfo()
        const volunteers = await getVolunteerAnnouncements(auth.getUserId)
        nbVolunteerAnnouncements.value = volunteers.filter(a =>
          a.volunteers?.some(p => p.id === auth.getUserId)
        ).length
        nbParticipants.value = volunteers.filter(a =>
          a.participants?.some(p => p.id === auth.getUserId)
        ).length
        associationsFollowing.value = await getAllAssociationsFollowingList(auth.getUserId)
      }
    } catch (error) {
      handleError(error)
    }
  }

  const profileImageUrl = computed(() => {
    return auth.user.value?.avatarFileKey
  })

  function calculateAge(birthdate: string): number {
    const birth = new Date(birthdate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
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
</script>
