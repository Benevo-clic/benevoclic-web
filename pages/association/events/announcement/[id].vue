<template>
  <div ref="scrollContainer" class="relative">
    <!-- Loading state -->
    <div v-if="loading" class="min-h-screen flex justify-center items-center">
      <img src="/logo.png" alt="Chargement…" class="w-24 h-24 animate-spin" />
    </div>

    <!-- Content when loaded -->
    <div v-else class="container mx-auto px-3 md:px-6 py-8 max-w-4xl">
      <!-- Hero section with cover image -->
      <div
        class="relative w-full rounded-3xl overflow-hidden mb-8 bg-gradient-to-r from-primary/5 to-secondary/5"
      >
        <!-- Cover image -->
        <div class="aspect-[16/6] md:aspect-[16/5] lg:aspect-[16/4] overflow-hidden">
          <img
            v-if="announcement?.announcementImage"
            :src="coverImageUrl"
            alt="Photo de couverture"
            class="object-cover w-full h-full transition-all duration-700 hover:scale-105"
          />
          <div
            v-else
            class="w-full h-full flex flex-col items-center justify-center text-base-content/60 bg-base-200"
          >
            <div class="avatar placeholder mb-3">
              <div
                class="bg-base-300 text-base-content rounded-full w-20 h-20 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-10 w-10"
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
            <p class="text-sm font-medium">Aucune image disponible</p>
          </div>
        </div>

        <!-- Status badge overlay -->
        <div class="absolute top-4 right-4">
          <div class="badge badge-lg shadow-md" :class="statusBadgeClass">
            {{ announcement?.status }}
          </div>
        </div>
      </div>

      <!-- Main content area -->
      <div class="space-y-6">
        <!-- Main info -->
        <div class="space-y-6">
          <!-- Association and event info card -->
          <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div class="card-body p-6">
              <!-- Association info -->
              <div class="flex items-center gap-4 mb-4">
                <div v-if="announcement?.associationLogo" class="avatar">
                  <div
                    class="w-14 h-14 rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100"
                  >
                    <img
                      :src="profileImageUrl"
                      alt="Logo de l'association"
                      width="64"
                      height="64"
                      loading="lazy"
                      decoding="async"
                      class="object-cover"
                    />
                  </div>
                </div>
                <div v-else class="avatar placeholder">
                  <div
                    class="w-14 h-14 rounded-full bg-primary/10 text-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100"
                  >
                    <span class="text-lg font-bold">{{
                      announcement?.associationName?.charAt(0) || 'A'
                    }}</span>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-lg font-semibold text-base-content truncate">
                    {{ announcement?.associationName }}
                  </p>
                </div>
              </div>

              <!-- Event title -->
              <h1 class="text-3xl font-bold mb-4 text-base-content truncate">
                {{ announcement?.nameEvent }}
              </h1>

              <!-- Event metadata -->
              <div class="flex flex-wrap gap-3 mb-4">
                <div class="badge badge-lg badge-primary gap-2">
                  <Calendar class="h-4 w-4" />
                  {{ formatDate(announcement?.dateEvent) }}
                </div>
                <div v-if="announcement?.hoursEvent" class="badge badge-lg badge-primary gap-2">
                  <Clock class="h-4 w-4" />
                  {{ announcement.hoursEvent }}
                </div>
                <div
                  v-if="announcement?.addressAnnouncement?.city"
                  class="badge badge-lg badge-primary gap-2"
                >
                  <MapPin class="h-4 w-4" />
                  {{ announcement.addressAnnouncement.city }}
                </div>
              </div>

              <!-- Event description -->
              <div class="prose prose-sm max-w-none mb-6">
                <p>{{ announcement?.description }}</p>
              </div>

              <div
                v-if="announcement?.tags?.length"
                class="flex flex-row gap-2 overflow-x-auto whitespace-nowrap"
              >
                <div
                  v-for="tag in announcement.tags"
                  :key="tag"
                  class="badge badge-outline text-sm hover:badge-primary transition-colors text-base-content border-base-content focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-1 mr-1"
                  tabindex="0"
                  role="button"
                  :aria-label="`Filtrer par tag : ${tag}`"
                >
                  <span
                    class="text-base-content/70 dark:text-white/80 group-hover:text-primary transition-colors"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div
            class="bg-base-100 rounded-xl shadow-lg p-6 mb-6 flex flex-wrap justify-center gap-3"
          >
            <button
              class="btn btn-primary gap-2 hover:scale-105 transition-transform"
              @click="openPresenceModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Gérer les présences
            </button>
            <button
              class="btn btn-secondary gap-2 hover:scale-105 transition-transform"
              @click="openEditModal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Modifier
            </button>
            <button
              class="btn btn-error gap-2 hover:scale-105 transition-transform"
              @click="showDeleteConfirmation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Supprimer
            </button>
          </div>
        </div>

        <!-- Stats and additional info -->
        <div class="space-y-6">
          <!-- Stats card -->
          <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div class="card-body p-6">
              <h2 class="card-title text-xl mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Statistiques
              </h2>

              <!-- Participants stats -->
              <div class="stat bg-base-200 rounded-box p-4 mb-3">
                <div class="stat-figure text-secondary">
                  <Users class="h-8 w-8" />
                </div>
                <div class="stat-title">Participants</div>
                <div class="stat-value text-primary">
                  {{ ParticipantAvailable(announcement) }}
                </div>
                <div class="stat-desc">Personnes inscrites à l'événement</div>
              </div>

              <!-- Volunteers stats -->
              <div class="stat bg-base-200 rounded-box p-4">
                <div class="stat-figure text-secondary">
                  <HeartHandshake class="h-8 w-8" />
                </div>
                <div class="stat-title">Bénévoles</div>
                <div class="stat-value text-secondary">
                  {{ volunteerAvailable(announcement) }}
                </div>
                <div class="stat-desc">Personnes aidant à l'organisation</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs section -->
      <div class="mt-8">
        <!-- Tabs navigation -->
        <div class="tabs tabs-boxed bg-base-200 p-1 rounded-t-xl justify-center">
          <a
            role="tab"
            :class="[
              'tab tab-lg gap-2 transition-all duration-300',
              tab === 'participants' ? 'tab-active' : ''
            ]"
            @click="tab = 'participants'"
          >
            <Users class="h-5 w-5" />
            Participants
          </a>
          <a
            role="tab"
            :class="[
              'tab tab-lg gap-2 transition-all duration-300',
              tab === 'volunteers' ? 'tab-active' : ''
            ]"
            @click="tab = 'volunteers'"
          >
            <HeartHandshake class="h-5 w-5" />
            Bénévoles
          </a>
        </div>

        <!-- Tab content with animation -->
        <div class="bg-base-100 rounded-b-xl shadow-xl p-6 min-h-[300px]">
          <transition name="fade" mode="out-in">
            <div v-if="tab === 'participants'" key="participants">
              <ParticipantsList
                :participants="announcement?.participants"
                @right-action="handleRightAction"
                @presence-action="handlePresenceActionParticipant"
              />
            </div>
            <div v-else key="volunteers">
              <VolunteersList
                :volunteers="
                  announcement?.volunteers?.map(volunteer => {
                    return {
                      volunteerId: volunteer.id,
                      volunteerName: volunteer.name,
                      isPresent: volunteer.isPresent
                    }
                  })
                "
                @right-action="handleRightActionVolunteer"
                @presence-action="handlePresenceActionVolunteer"
              />
            </div>
          </transition>
        </div>
      </div>

      <!-- Modal édition annonce -->
      <AnnouncementEditForm
        v-if="editModalOpen"
        :announcement="announcement"
        @close="closeEditModal"
        @saved="refresh"
      />
    </div>
    <dialog ref="deleteConfirmationModal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">
          {{ t('announcements.delete_confirmation.title') }}
        </h3>
        <p class="py-4">
          {{ t('announcements.delete_confirmation.message') }}
        </p>
        <div class="modal-action">
          <button class="btn" @click="cancelDelete">
            {{ t('announcements.delete_confirmation.cancel') }}
          </button>
          <button class="btn btn-error" @click="confirmDelete">
            {{ t('announcements.delete_confirmation.confirm') }}
          </button>
        </div>
      </div>
    </dialog>

    <!-- Indicateur scroll bas -->
    <transition name="fade">
      <div
        v-if="showScrollDown"
        class="fixed left-1/2 -translate-x-1/2 bottom-4 z-50 flex flex-col items-center pointer-events-none select-none"
      >
        <div class="bg-base-200/80 rounded-full shadow p-2 animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-label="Faire défiler vers le bas"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </transition>
    <!-- Indicateur scroll haut -->
    <transition name="fade">
      <div
        v-if="showScrollUp"
        class="fixed left-1/2 -translate-x-1/2 top-4 z-50 flex flex-col items-center pointer-events-none select-none"
      >
        <div class="bg-base-200/80 rounded-full shadow p-2 animate-bounce rotate-180">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-label="Faire défiler vers le haut"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </transition>
    <ErrorPopup
      :show-error-modal="showErrorModal"
      :error-type="errorType"
      @reload="handleReload"
      @go-home="handleGoHome"
    />

    <!-- Presence Modal -->
    <PresenceListModal
      ref="presenceModalRef"
      :announcement-id="announcement?._id || ''"
      :participants="announcement?.participants"
      :volunteers="announcement?.volunteers"
      @close="handleModalClose"
      @update="handleModalUpdate"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, onUnmounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { HeartHandshake, Users, Calendar, Clock, MapPin } from 'lucide-vue-next'
  import AnnouncementEditForm from '~/components/event/association/AnnouncementEditForm.vue'
  import VolunteersList from '~/components/event/association/VolunteersList.vue'
  import ParticipantsList from '~/components/event/association/ParticipantsList.vue'
  import { definePageMeta, useNavigation } from '#imports'
  import { EventStatus } from '~/common/enums/event.enum'
  import { useAnnouncement } from '~/composables/useAnnouncement'
  import ErrorPopup from '~/components/utils/ErrorPopup.vue'
  import PresenceListModal from '~/components/event/association/PresenceListModal.vue'
  import type { Announcement } from '~/common/interface/event.interface'
  const deleteConfirmationModal = ref<HTMLDialogElement | null>(null)
  const { t } = useI18n()

  const route = useRoute()
  const useAnnouncementAuth = useAnnouncement()
  const { navigateToRoute } = useNavigation()
  const loading = ref(true)
  const editModalOpen = ref(false)
  const tab = ref<'participants' | 'volunteers'>('participants')
  const presenceModalRef = ref<InstanceType<typeof PresenceListModal> | null>(null)

  const announcement = ref<Announcement | null>(null)

  const profileImageUrl = computed(() => {
    return announcement.value?.associationLogo
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
    navigateToRoute('/association/events/association/manage')
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

  definePageMeta({
    middleware: ['auth'],
    layout: 'header'
  })

  onMounted(async () => {
    await initData()
  })

  function volunteerAvailable(announcement: Announcement | null): string {
    if (!announcement) return '0'
    if (announcement.maxVolunteers !== -1) {
      return `${announcement.nbVolunteers || 0}/${announcement.maxVolunteers}`
    }
    return `${announcement.nbVolunteers || 0}`
  }

  function ParticipantAvailable(announcement: Announcement | null): string {
    if (!announcement) return '0'
    if (announcement.maxParticipants !== -1) {
      return `${announcement.nbParticipants || 0}/${announcement.maxParticipants}`
    }
    return `${announcement.nbParticipants || 0}`
  }

  async function initData() {
    try {
      if (route.params.id) {
        await fetchAnnouncement()
      } else {
        navigateTo('/association/events/association/manage')
      }
    } catch (error) {
      handleError(error)
    }
  }

  async function fetchAnnouncement() {
    try {
      useAnnouncementAuth.invalidateCache()
      const response = await useAnnouncementAuth.fetchAnnouncementById(route.params.id as string)
      if (response) {
        announcement.value = response
      }
      loading.value = useAnnouncementAuth.loading.value
      return response
    } catch (error) {
      handleError(error)
    }
  }

  function openEditModal() {
    editModalOpen.value = true
  }

  function showDeleteConfirmation() {
    deleteConfirmationModal.value?.showModal()
  }

  function closeEditModal() {
    editModalOpen.value = false
  }

  function refresh() {
    fetchAnnouncement()
    closeEditModal()
  }

  function cancelDelete() {
    deleteConfirmationModal.value?.close()
  }

  function confirmDelete() {
    deleteConfirmationModal.value?.close()
    announcementDelete()
  }

  async function handleRightAction(id: string) {
    if (!announcement.value) {
      return
    }
    try {
      await useAnnouncementAuth.removeParticipant(announcement.value?._id, id)
      announcement.value.participants =
        announcement.value.participants?.filter(p => p.id !== id) || []
    } catch (error) {
      handleError(error)
    }
  }

  async function handleRightActionVolunteer(id: string) {
    if (!announcement.value) {
      return
    }
    try {
      await useAnnouncementAuth.removeVolunteer(announcement.value?._id, id)
      announcement.value.volunteers = announcement.value.volunteers?.filter(v => v.id !== id) || []
    } catch (error) {
      handleError(error)
    }
  }

  async function handlePresenceActionParticipant(id: string, isPresent: boolean) {
    if (!announcement.value) {
      return
    }
    try {
      const participant = {
        id,
        name: announcement.value.participants?.find(p => p.id === id)?.name || '',
        isPresent
      }
      await useAnnouncementAuth.updatePresentParticipant(announcement.value._id, participant)
      await fetchAnnouncement() // Refresh the data
    } catch (error) {
      handleError(error)
    }
  }

  async function handlePresenceActionVolunteer(id: string, isPresent: boolean) {
    if (!announcement.value) {
      return
    }
    try {
      const volunteer = {
        id,
        name: announcement.value.volunteers?.find(v => v.id === id)?.name || '',
        isPresent
      }
      await useAnnouncementAuth.updatePresentVolunteer(announcement.value._id, volunteer)
      await fetchAnnouncement() // Refresh the data
    } catch (error) {
      handleError(error)
    }
  }

  async function announcementDelete() {
    if (!announcement.value) {
      return
    }
    try {
      await useAnnouncementAuth.removeAnnouncement(announcement.value._id)
      navigateTo('/association/events/association/manage')
    } catch (error) {
      handleError(error)
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

  // Presence modal functions
  function openPresenceModal() {
    if (announcement.value) {
      presenceModalRef.value?.showModal()
    } else {
      console.warn('No announcement available to manage presence.')
    }
  }

  function handleModalClose() {
    // Any cleanup needed after closing the modal
  }

  async function handleModalUpdate() {
    await fetchAnnouncement()
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
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }

  /* Card hover effects */
  .card {
    transition: all 0.3s ease;
  }

  .card:hover {
    transform: translateY(-5px);
  }

  /* Badge hover effects */
  .badge {
    transition: all 0.2s ease;
  }

  /* Button animations */
  .btn {
    transition: all 0.3s ease;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.2);
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .card-body {
      padding: 1rem;
    }

    .stat {
      padding: 0.75rem;
    }

    .stat-value {
      font-size: 1.5rem;
    }
  }
</style>
