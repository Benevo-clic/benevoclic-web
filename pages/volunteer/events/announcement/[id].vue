<template>
  <div ref="scrollContainer" class="relative">
    <div v-if="loading" class="flex justify-center items-center h-32">
      <span class="loading loading-bars loading-xl" />
    </div>
    <div v-else class="container mx-auto px-2 md:px-4 py-6 max-w-4xl">
      <!-- Photo de couverture moderne -->
      <div
        class="relative w-full aspect-[3/1] rounded-2xl overflow-hidden mb-6 bg-base-200 flex items-center justify-center shadow-md"
      >
        <div v-if="!announcement">
          <div class="flex flex-col items-center justify-center w-full h-full text-base-content/60">
            <div class="w-16 h-16 mb-3 flex items-center justify-center bg-base-300 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"
                />
              </svg>
            </div>
            <p class="text-sm font-medium">
              {{ t('volunteerAnnouncement.announcement.notFound') }}
            </p>
          </div>
        </div>

        <img
          v-else-if="announcement?.announcementImage"
          :src="coverImageUrl"
          :alt="t('volunteerAnnouncement.cover.alt')"
          class="object-cover w-full h-full transition-transform duration-500"
        />
        <div
          v-else
          class="w-full h-full flex flex-col items-center justify-center text-base-content/60"
        >
          <div class="avatar placeholder mb-3">
            <div class="bg-base-300 text-base-content rounded-full w-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <p class="text-sm font-medium">{{ t('volunteerAnnouncement.announcement.noImage') }}</p>
        </div>
        <!-- Status badge overlay -->
        <div class="absolute top-3 right-3">
          <div
            class="badge badge focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            :class="statusBadgeClass"
          >
            {{ announcement?.status }}
          </div>
        </div>
      </div>
      <!-- Informations de l'association -->
      <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6 relative">
        <div class="flex items-center gap-3 mb-2">
          <div v-if="announcement?.associationLogo" class="avatar">
            <div class="ring-primary ring-offset-base-100 w-14 rounded-full ring-2 ring-offset-2">
              <img :src="profileImageUrl" :alt="t('volunteerAnnouncement.association.logo_alt')" />
            </div>
          </div>
          <div v-else class="avatar placeholder">
            <div
              class="w-14 h-14 rounded-full bg-base-300 text-base-content ring-primary ring-offset-base-100 ring-2 ring-offset-2"
            >
              <span class="text-lg font-bold">{{
                announcement?.associationName?.charAt(0) || 'A'
              }}</span>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-base font-semibold text-base-content truncate">
              {{ announcement?.associationName }}
            </p>
          </div>
          <!-- Bouton Adhérer -->
          <div class="flex-shrink-0">
            <button
              class="btn btn-sm focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
              :class="followButtonClass"
              @click="toggleFollowAssociation"
              @keyup.enter="toggleFollowAssociation"
              @keyup.space.prevent="toggleFollowAssociation"
              @mouseenter="hovering = true"
              @mouseleave="hovering = false"
            >
              <UserPlus v-if="!isFollowing" class="w-4 h-4 mr-1" />
              <Clock v-else-if="isFollowingPending" class="w-4 h-4 mr-1" />
              <UserCheck v-else class="w-4 h-4 mr-1" />
              {{ followButtonText }}
            </button>
          </div>
        </div>
      </div>

      <!-- Infos principales -->
      <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6 relative">
        <h1 class="text-2xl font-bold mb-2 line-clamp-2">
          {{ announcement?.nameEvent }}
        </h1>
        <div class="flex flex-wrap gap-2 text-sm text-base-content/70 mb-2">
          <span class="flex items-center gap-1"
            ><Calendar class="h-4 w-4 text-primary" />{{
              formatDate(announcement?.dateEvent)
            }}</span
          >
          <span v-if="announcement?.hoursEvent" class="flex items-center gap-1"
            ><Clock class="h-4 w-4 text-primary" />{{ announcement.hoursEvent }}</span
          >
          <span v-if="announcement?.addressAnnouncement?.city" class="flex items-center gap-1"
            ><MapPin class="h-4 w-4 text-secondary" />{{
              announcement.addressAnnouncement.city
            }}</span
          >
        </div>
        <div class="mb-3 text-base-content/90">
          {{ announcement?.description }}
        </div>
        <div
          v-for="tag in announcement?.tags"
          :key="tag"
          class="badge badge-outline text-sm hover:badge focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none mr-1"
          tabindex="0"
          role="button"
          :aria-label="`Filtrer par tag : ${tag}`"
        >
          <span class="text-base-content/70 group-hover:text-primary transition-colors">{{
            tag
          }}</span>
        </div>
        <!-- Statistiques -->
        <div class="flex gap-4 mt-4 mb-2">
          <div class="flex items-center gap-1 text-xs">
            <Users class="h-4 w-4 text-primary" />
            <span class="font-medium">{{
              ParticipantAvailable(announcement as Announcement)
            }}</span>
            <span class="text-base-content/60">{{
              t('volunteerAnnouncement.event.participants')
            }}</span>
          </div>
          <div class="flex items-center gap-1 text-xs">
            <HeartHandshake class="h-4 w-4 text-secondary" />
            <span class="font-medium">{{ volunteerAvailable(announcement as Announcement) }}</span>
            <span class="text-base-content/60">{{
              t('volunteerAnnouncement.event.volunteers')
            }}</span>
          </div>
        </div>
      </div>

      <!-- Boutons d'action de participation -->
      <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6">
        <h2 class="text-xl font-bold mb-4">{{ t('volunteerAnnouncement.participation.title') }}</h2>
        <div v-if="loadingVolunteer" class="flex justify-center items-center">
          <span class="loading loading-spinner loading-md" />
        </div>
        <div v-else class="flex flex-col sm:flex-row gap-3">
          <button
            v-if="isCompleted"
            class="btn btn-primary flex-1 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            :disabled="isCompleted"
          >
            <HeartHandshake class="w-5 h-5 mr-2" />
            {{ t('volunteerAnnouncement.participation.volunteer') }}
          </button>
          <button
            v-else-if="isAlreadyVolunteerWaiting"
            class="btn btn-neutral flex-1 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            :disabled="!canParticipateAsVolunteer"
            @click="cancelVolunteerParticipationWaitingList"
            @keyup.enter="cancelVolunteerParticipationWaitingList"
            @keyup.space.prevent="cancelVolunteerParticipationWaitingList"
          >
            <HeartHandshake class="w-5 h-5 mr-2" />
            {{ t('volunteerAnnouncement.participation.volunteer') }}
            <span
              class="badge badge focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
              >{{ t('volunteerAnnouncement.participation.waiting') }}</span
            >
          </button>
          <button
            v-else-if="isAlreadyVolunteer"
            class="btn btn-neutral flex-1 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            @click="cancelVolunteerParticipation"
            @keyup.enter="cancelVolunteerParticipation"
            @keyup.space.prevent="cancelVolunteerParticipation"
          >
            <HeartHandshake class="w-5 h-5 mr-2" />
            {{ t('volunteerAnnouncement.participation.volunteer') }}
            <span
              class="badge badge focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
              >{{ t('volunteerAnnouncement.participation.cancel') }}</span
            >
          </button>
          <button
            v-else
            class="btn btn-primary flex-1 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            :disabled="!canParticipateAsVolunteer"
            @click="participateAsVolunteer"
            @keyup.enter="participateAsVolunteer"
            @keyup.space.prevent="participateAsVolunteer"
          >
            <HeartHandshake class="w-5 h-5 mr-2" />
            {{ t('volunteerAnnouncement.participation.volunteer') }}
            <span
              v-if="!canParticipateAsVolunteer"
              class="badge badge focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
              >{{ t('volunteerAnnouncement.participation.full') }}</span
            >
          </button>
          <button
            v-if="isCompleted"
            class="btn btn-secondary flex-1 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            :disabled="isCompleted"
          >
            <Users class="w-5 h-5 mr-2" />
            {{ t('volunteerAnnouncement.participation.participate') }}
          </button>
          <button
            v-else-if="!alreadyParticipating"
            class="btn btn-secondary flex-1 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            :disabled="!canParticipateAsParticipant"
            @click="participateAsParticipant"
            @keyup.enter="participateAsParticipant"
            @keyup.space.prevent="participateAsParticipant"
          >
            <Users class="w-5 h-5 mr-2" />
            {{ t('volunteerAnnouncement.participation.participate') }}
            <span
              v-if="!canParticipateAsParticipant"
              class="badge badge focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
              >{{ t('volunteerAnnouncement.participation.full') }}</span
            >
          </button>
          <button
            v-else
            class="btn btn-neutral flex-1 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            @click="cancelParticipation"
            @keyup.enter="cancelParticipation"
            @keyup.space.prevent="cancelParticipation"
          >
            <Users class="w-5 h-5 mr-2" />
            {{ t('volunteerAnnouncement.participation.participate') }}
            <span
              class="badge badge focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
              >{{ t('volunteerAnnouncement.participation.cancel') }}</span
            >
          </button>
        </div>

        <!-- Bouton Signaler pour les volontaires connectés -->
        <div
          v-if="volunteerUse.volunteer?.value?.volunteerId"
          class="mt-4 pt-4 border-t border-base-300"
        >
          <button
            class="btn btn-outline btn-error btn-sm w-full focus-visible:ring-2 focus-visible:ring-error/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            @click="openReportModal"
            @keyup.enter="openReportModal"
            @keyup.space.prevent="openReportModal"
          >
            <AlertTriangle class="w-4 h-4 mr-2" />
            {{ t('volunteerAnnouncement.report.title') }}
          </button>
        </div>
      </div>

      <!-- Galerie photo -->

      <!-- Carte interactive -->
      <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6">
        <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
          <MapPin class="w-5 h-5 text-primary" />
          {{ t('volunteerAnnouncement.location.title') }}
        </h3>
        <div class="h-64 md:h-80 rounded-lg overflow-hidden bg-base-200 relative">
          <!-- Placeholder pour la carte -->

          <div ref="mapContainer" class="map-container">
            <!-- Contrôles de zoom personnalisés -->
            <div class="zoom-controls">
              <button
                class="zoom-btn zoom-in focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
                title="Zoomer"
                @click="zoomIn"
                @keyup.enter="zoomIn"
                @keyup.space.prevent="zoomIn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
              </button>
              <button
                class="zoom-btn zoom-out focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
                title="Dézoomer"
                @click="zoomOut"
                @keyup.enter="zoomOut"
                @keyup.space.prevent="zoomOut"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13H5v-2h14v2z" />
                </svg>
              </button>
            </div>
          </div>
          <!-- Bouton pour ouvrir dans Google Maps -->
          <button
            class="btn btn-primary btn-sm absolute bottom-4 right-4 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            @click="openInGoogleMaps"
            @keyup.enter="openInGoogleMaps"
            @keyup.space.prevent="openInGoogleMaps"
          >
            <ExternalLink class="w-4 h-4 mr-1" />
            {{ t('volunteerAnnouncement.location.viewOnMap') }}
          </button>
        </div>
      </div>

      <!-- Informations pratiques -->
      <div class="bg-base-100 rounded-xl shadow-lg p-6 mb-6">
        <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
          <Info class="w-5 h-5 text-primary" />
          {{ t('volunteerAnnouncement.practicalInfo.title') }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <Calendar class="w-5 h-5 text-primary" />
              <div>
                <p class="font-medium">{{ t('volunteerAnnouncement.practicalInfo.dateTime') }}</p>
                <p class="text-sm text-base-content/70">
                  {{ formatDate(announcement?.dateEvent) }} {{ announcement?.hoursEvent }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <MapPin class="w-5 h-5 text-primary" />
              <div>
                <p class="font-medium">{{ t('volunteerAnnouncement.practicalInfo.address') }}</p>
                <p class="text-sm text-base-content/70">
                  {{ announcement?.addressAnnouncement?.address }}
                </p>
                <p class="text-sm text-base-content/70">
                  {{ announcement?.addressAnnouncement?.city }},
                  {{ announcement?.addressAnnouncement?.postalCode }}
                </p>
              </div>
            </div>
          </div>
          <div class="space-y-3">
            <div class="flex items-center gap-3">
              <Users class="w-5 h-5 text-primary" />
              <div>
                <p class="font-medium">{{ t('volunteerAnnouncement.practicalInfo.places') }}</p>
                <p class="text-sm text-base-content/70">
                  {{ remainingParticipants }}
                  {{ t('volunteerAnnouncement.practicalInfo.participants') }},
                  {{ remainingVolunteers }}
                  {{ t('volunteerAnnouncement.practicalInfo.volunteers') }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Tag class="w-5 h-5 text-primary" />
              <div>
                <p class="font-medium">{{ t('volunteerAnnouncement.practicalInfo.eventType') }}</p>
                <p class="text-sm text-base-content/70">
                  {{
                    announcement?.tags?.join(', ') ||
                    t('volunteerAnnouncement.practicalInfo.general')
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ErrorPopup
      :show-error-modal="showErrorModal"
      :error-type="errorType"
      @reload="handleReload"
      @go-home="handleGoHome"
    />

    <!-- Modal de signalement -->
    <ReportModal
      :is-open="showReportModal"
      :announcement-id="announcement?._id"
      :announcement-title="announcement?.nameEvent"
      :user-email="userEmail.value"
      @close="closeReportModal"
      @submitted="handleReportSubmitted"
    />

    <!-- Notification Toast -->
    <NotificationToast
      :show="showNotification"
      :message="notificationMessage"
      :type="notificationType"
      @close="closeNotification"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, onUnmounted, watch, nextTick } from 'vue'
  import { useRoute } from 'vue-router'
  import {
    HeartHandshake,
    Users,
    Calendar,
    Clock,
    MapPin,
    ExternalLink,
    Info,
    Tag,
    UserPlus,
    UserCheck,
    AlertTriangle
  } from 'lucide-vue-next'
  import { definePageMeta, useNavigation, useNuxtApp, useSettingsStore } from '#imports'
  import { EventStatus } from '~/common/enums/event.enum'
  import { useAnnouncement } from '~/composables/useAnnouncement'
  import { useVolunteerAuth } from '~/composables/useVolunteer'
  import type { AssociationVolunteerFollow } from '~/common/interface/volunteer.interface'
  import ErrorPopup from '~/components/utils/ErrorPopup.vue'
  import ReportModal from '~/components/utils/ReportModal.vue'
  import NotificationToast from '~/components/utils/NotificationToast.vue'
  import { useUser } from '~/composables/auth/useUser'
  import type { Announcement } from '~/common/interface/event.interface'

  const { t } = useI18n()

  const route = useRoute()
  const announcementUse = useAnnouncement()
  const volunteerUse = useVolunteerAuth()
  const user = useUser()
  const { navigateToRoute } = useNavigation()

  const loading = ref(true)
  const loadingVolunteer = computed(() => announcementUse.loading.value)
  const announcement = announcementUse.getCurrentAnnouncement

  const volunteerId = computed(() => volunteerUse.volunteer?.value?.volunteerId)
  const volunteerEmail = computed(() => user.user.value?.email)
  const associationId = computed(() => announcement.value?.associationId)

  // Listes réactives pour l'état d'adhésion
  const associationsWaitingList = ref<AssociationVolunteerFollow[]>([])
  const associationsFollowingList = ref<AssociationVolunteerFollow[]>([])

  const isFollowingPending = computed(() =>
    associationsWaitingList.value.some(a => a.associationId === associationId.value)
  )
  const isFollowing = computed(() =>
    associationsFollowingList.value.some(a => a.associationId === associationId.value)
  )

  const hovering = ref(false)

  const followButtonClass = computed(() => {
    if (isFollowingPending.value) {
      return 'btn-warning'
    }
    return isFollowing.value ? 'btn-success' : 'btn-primary'
  })

  const followButtonText = computed(() => {
    if (isFollowingPending.value) {
      return t('volunteerAnnouncement.association.leave')
    }
    return isFollowing.value
      ? t('volunteerAnnouncement.association.leave')
      : t('volunteerAnnouncement.association.join')
  })

  // Modal de signalement
  const showReportModal = ref(false)

  // Notifications
  const showNotification = ref(false)
  const notificationMessage = ref('')
  const notificationType = ref<'success' | 'error' | 'info' | 'warning'>('info')

  // Email de l'utilisateur (pour l'instant, on utilise une valeur par défaut)
  const userEmail = computed(() => {
    return volunteerEmail
  })

  function volunteerAvailable(announcement: Announcement): string {
    if (announcement.maxVolunteers !== -1) {
      return `${announcement?.nbVolunteers}/${announcement?.maxVolunteers}`
    }
    return `${announcement?.nbVolunteers}`
  }

  function ParticipantAvailable(announcement: Announcement): string {
    if (announcement.maxParticipants !== -1) {
      return `${announcement?.nbParticipants}/${announcement?.maxParticipants}`
    }
    return `${announcement?.nbParticipants}`
  }

  function openReportModal() {
    showReportModal.value = true
  }

  function closeReportModal() {
    showReportModal.value = false
  }

  function showNotificationToast(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info'
  ) {
    notificationMessage.value = message
    notificationType.value = type
    showNotification.value = true
  }

  function closeNotification() {
    showNotification.value = false
  }

  function handleReportSubmitted(success: boolean) {
    if (success) {
      showNotificationToast(t('volunteerAnnouncement.report.successMessage'), 'success')
    } else {
      showNotificationToast(t('volunteerAnnouncement.report.errorMessage'), 'error')
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
      process.env.NODE_ENV !== 'production' &&
        console.error("Erreur lors de la participation du volontaire à l'événement:", error)
    }
  }

  async function refreshFollowState() {
    if (!volunteerId.value) {
      return
    }
    try {
      associationsWaitingList.value = await volunteerUse.getAllAssociationsToWaitingList(
        volunteerId.value
      )
      associationsFollowingList.value = await volunteerUse.getAllAssociationsFollowingList(
        volunteerId.value
      )
    } catch (error: any) {
      handleError(error)
    }
  }

  onMounted(async () => {
    await fetchAnnouncement()
    if (volunteerUse.volunteer.value?.volunteerId) {
      await refreshFollowState()
    } else {
      const stop = watch(
        () => volunteerUse.volunteer.value?.volunteerId,
        async id => {
          if (id) {
            await nextTick()
            await refreshFollowState()
            stop()
          }
        },
        { immediate: true }
      )
      if (!volunteerUse.volunteer.value) {
        await volunteerUse.getVolunteerInfo()
      }
    }
    initMap(
      announcement.value?.locationAnnouncement?.coordinates[0] || 0,
      announcement.value?.locationAnnouncement?.coordinates[1] || 0,
      announcement.value?.addressAnnouncement?.address || ''
    )
  })

  async function fetchAnnouncement() {
    try {
      if (route.params.id) {
        announcementUse.invalidateCache()
        await announcementUse.fetchAnnouncementById(route.params.id as string)
        loading.value = announcementUse.loading.value
      }
    } catch (error) {
      handleError(error)
    }
  }

  async function toggleFollowAssociation() {
    try {
      if (!volunteerId.value || !associationId.value) {
        return
      }
      if (isFollowingPending.value) {
        await volunteerUse.removeVolunteerFromWaitingListAssociation(associationId.value)
      } else if (isFollowing.value) {
        await volunteerUse.removeVolunteerFromAssociation(associationId.value, volunteerId.value)
      } else {
        await volunteerUse.addVolunteerToWaitingListAssociation(associationId.value, {
          volunteerId: volunteerId.value,
          volunteerName:
            volunteerUse.volunteer.value?.firstName + ' ' + volunteerUse.volunteer.value?.lastName
        })
      }
      await refreshFollowState()
    } catch (error: any) {
      handleError(error)
    }
  }

  const remainingParticipants = computed(() => {
    const max = announcement.value?.maxParticipants || 0
    const current = announcement.value?.nbParticipants || 0
    if (announcement.value?.maxParticipants === -1) {
      return 1
    }
    return Math.max(0, max - current)
  })

  const remainingVolunteers = computed(() => {
    const max = announcement.value?.maxVolunteers || 0
    const current = announcement.value?.nbVolunteers || 0
    if (announcement.value?.maxVolunteers === -1) {
      return 1
    }
    return Math.max(0, max - current)
  })

  const canParticipateAsVolunteer = computed(() => remainingVolunteers.value > 0)
  const canParticipateAsParticipant = computed(() => remainingParticipants.value > 0)
  const alreadyParticipating = computed(() => {
    const volunteerId = volunteerUse.volunteer?.value?.volunteerId
    return announcement.value?.participants?.some(p => p.id === volunteerId) || false
  })
  const isAlreadyVolunteerWaiting = computed(() => {
    const volunteerId = volunteerUse.volunteer?.value?.volunteerId
    return announcement.value?.volunteersWaiting?.some(v => v.id === volunteerId) || false
  })

  const isAlreadyVolunteer = computed(() => {
    const volunteerId = volunteerUse.volunteer?.value?.volunteerId
    return announcement.value?.volunteers?.some(v => v.id === volunteerId) || false
  })

  const profileImageUrl = computed(() => {
    return announcement.value?.associationLogo
  })

  const isCompleted = computed(() => {
    return (
      announcement.value?.status === EventStatus.COMPLETED &&
      !announcement.value?.volunteers?.some(v => v.id === volunteerId.value) &&
      !announcement.value?.participants?.some(v => v.id === volunteerId.value)
    )
  })

  const scrollContainer = ref<HTMLElement | null>(null)
  const showScrollDown = ref(false)
  const showScrollUp = ref(false)

  const showErrorModal = ref(false)
  const errorType = ref<'4xx' | '5xx' | null>(null)

  function handleReload() {
    window.location.reload()
  }

  function handleGoHome() {
    navigateToRoute('/volunteer')
  }

  definePageMeta({
    middleware: ['auth'],
    layout: 'header'
  })

  async function participateAsVolunteer() {
    if (!announcement.value?._id || !volunteerUse.volunteer?.value?.volunteerId) {
      process.env.NODE_ENV !== 'production' &&
        console.error('Aucun événement sélectionné pour la participation')
      return
    }
    if (!canParticipateAsVolunteer.value) {
      process.env.NODE_ENV !== 'production' &&
        console.warn('Aucune place disponible pour participer en tant que bénévole')
      return
    }

    if (isAlreadyVolunteerWaiting.value) {
      process.env.NODE_ENV !== 'production' &&
        console.warn('Vous êtes déjà inscrit à cet événement en tant que bénévole')
      return
    }

    try {
      await announcementUse.addVolunteerWaiting(announcement.value?._id, {
        id: volunteerUse.volunteer?.value?.volunteerId,
        name:
          volunteerUse.volunteer?.value?.firstName + ' ' + volunteerUse.volunteer?.value?.lastName
      })
    } catch (error) {
      handleError(error)
    }
  }

  async function participateAsParticipant() {
    if (!announcement.value?._id || !volunteerUse.volunteer?.value?.volunteerId) {
      process.env.NODE_ENV !== 'production' &&
        console.error('Aucun événement sélectionné pour la participation')
      return
    }
    if (!alreadyParticipating.value) {
      process.env.NODE_ENV !== 'production' && console.log('Participation en tant que participant')
    } else {
      process.env.NODE_ENV !== 'production' &&
        console.warn('Vous êtes déjà inscrit à cet événement en tant que participant')
      return
    }

    try {
      await announcementUse.addParticipant(announcement.value?._id, {
        id: volunteerUse.volunteer?.value?.volunteerId,
        name:
          volunteerUse.volunteer?.value?.firstName + ' ' + volunteerUse.volunteer?.value?.lastName
      })
    } catch (error: any) {
      handleError(error)
    }
  }

  async function cancelParticipation() {
    if (!announcement.value?._id || !volunteerUse.volunteer?.value?.volunteerId) {
      process.env.NODE_ENV !== 'production' &&
        console.error("Aucun événement sélectionné pour l'annulation de participation")
      return
    }
    try {
      await announcementUse.removeParticipant(
        announcement.value?._id,
        volunteerUse.volunteer?.value?.volunteerId
      )
    } catch (error) {
      handleError(error)
    }
  }

  async function cancelVolunteerParticipationWaitingList() {
    if (!announcement.value?._id || !volunteerUse.volunteer?.value?.volunteerId) {
      process.env.NODE_ENV !== 'production' &&
        console.error(
          "Aucun événement sélectionné pour l'annulation de participation en tant que bénévole"
        )
      return
    }
    try {
      await announcementUse.removeVolunteerWaiting(
        announcement.value?._id,
        volunteerUse.volunteer?.value?.volunteerId
      )
    } catch (error) {
      handleError(error)
    }
  }

  async function cancelVolunteerParticipation() {
    if (!announcement.value?._id || !volunteerUse.volunteer?.value?.volunteerId) {
      process.env.NODE_ENV !== 'production' &&
        console.error(
          "Aucun événement sélectionné pour l'annulation de participation en tant que bénévole"
        )
      return
    }
    try {
      await announcementUse.removeVolunteer(
        announcement.value?._id,
        volunteerUse.volunteer?.value?.volunteerId
      )
    } catch (error) {
      handleError(error)
    }
  }

  function openInGoogleMaps() {
    const address = announcement.value?.addressAnnouncement?.address
    const city = announcement.value?.addressAnnouncement?.city
    const postalCode = announcement.value?.addressAnnouncement?.postalCode

    if (address && city) {
      const fullAddress = `${address}, ${city} ${postalCode || ''}`
      const encodedAddress = encodeURIComponent(fullAddress)
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
      window.open(googleMapsUrl, '_blank')
    }
  }

  const coverImageUrl = computed(() => {
    return announcement.value?.announcementImage
  })

  function formatDate(dateString?: string) {
    if (!dateString) {
      return ''
    }
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    return new Date(dateString).toLocaleDateString('fr-FR', options)
  }

  const statusBadgeClass = computed(() => {
    switch (announcement.value?.status) {
      case EventStatus.ACTIVE:
        return 'badge-success'
      case EventStatus.INACTIVE:
        return 'badge-warning'
      case EventStatus.COMPLETED:
        return 'badge-neutral'
      default:
        return 'badge-primary'
    }
  })

  // Fonctions de zoom
  const zoomIn = () => {
    if (map.value) {
      map.value.zoomIn()
    }
  }

  const zoomOut = () => {
    if (map.value) {
      map.value.zoomOut()
    }
  }

  function checkScrollIndicators() {
    const el = document.documentElement
    if (el.scrollHeight > window.innerHeight + 10) {
      showScrollDown.value = window.scrollY + window.innerHeight < el.scrollHeight - 10
      showScrollUp.value = window.scrollY > 10
    } else {
      showScrollDown.value = false
      showScrollUp.value = false
    }
  }

  const { $maplibregl } = useNuxtApp()

  const mapContainer = ref<HTMLElement>()
  const map = ref<any>(null)
  const marker = ref<any>(null)

  const openGoogleMaps = (lat: number, lng: number, address: string) => {
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15`
    window.open(googleMapsUrl, '_blank')
  }

  const initMap = (lng: number, lat: number, address: string) => {
    if (!mapContainer.value) {
      return
    }

    map.value = new $maplibregl.Map({
      container: mapContainer.value,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 20
          }
        ]
      },
      center: [lng, lat],
      zoom: 15,
      zoomControl: true,
      keyboard: true,
      doubleClickZoom: true,
      scrollZoom: true,
      dragPan: true,
      dragRotate: false,
      minZoom: 3,
      maxZoom: 18
    })

    marker.value = new $maplibregl.Marker().setLngLat([lng, lat]).addTo(map.value)

    marker.value.getElement().addEventListener('click', () => {
      openGoogleMaps(lat, lng, address)
    })

    marker.value.getElement().style.cursor = 'pointer'
  }

  onMounted(() => {
    checkScrollIndicators()
    window.addEventListener('scroll', checkScrollIndicators, { passive: true })
    window.addEventListener('resize', checkScrollIndicators)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', checkScrollIndicators)
    window.removeEventListener('resize', checkScrollIndicators)
  })
</script>

<style scoped>
  .map-container {
    width: 100%;
    height: 400px;
    border-radius: 0.375rem;
    overflow: hidden;
    position: relative;
  }

  .zoom-controls {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .zoom-btn {
    width: 32px;
    height: 32px;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #374151;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .zoom-btn:hover {
    background: #f9fafb;
    border-color: #9ca3af;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .zoom-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .zoom-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .map-info {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    border-left: 4px solid #3b82f6;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .bg-base-100 {
    transition: transform 0.2s ease-in-out;
  }

  .bg-base-100:hover {
    transform: translateY(-2px);
  }

  .badge {
    transition: all 0.2s ease-in-out;
  }

  @media (max-width: 640px) {
    .btn {
      font-size: 0.875rem;
      padding: 0.5rem 1rem;
    }
  }
</style>
