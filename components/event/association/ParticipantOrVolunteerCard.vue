<template>
  <div
    class="bg-base-100 rounded-lg shadow-md p-4 flex gap-4 hover:shadow-lg transition-shadow mb-4"
  >
    <!-- Avatar à gauche -->
    <div class="flex-shrink-0 flex items-start">
      <div v-if="loading" class="avatar placeholder cursor-pointer" @click="openUserModal">
        <div
          class="w-16 h-16 rounded-full bg-base-300 text-base-content ring-2 ring-primary ring-offset-2 ring-offset-base-100 hover:ring-4 transition-all duration-200"
        >
          <span class="loading loading-spinner loading-sm" />
        </div>
      </div>
      <div
        v-else-if="otherUserId?.avatarFileKey"
        class="avatar cursor-pointer"
        @click="openUserModal"
      >
        <div
          class="w-16 h-16 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100 hover:ring-4 transition-all duration-200"
        >
          <img
            :src="profileImageUrl"
            :alt="`Photo de ${participant.volunteerName}`"
            class="w-full h-full object-cover rounded-full"
            width="48"
            height="48"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
      <div v-else class="avatar placeholder cursor-pointer" @click="openUserModal">
        <div
          class="w-16 h-16 rounded-full bg-base-300 text-base-content ring-2 ring-primary ring-offset-2 ring-offset-base-100 flex items-center justify-center hover:ring-4 transition-all duration-200"
        >
          <span class="text-xl font-bold">{{
            participant.volunteerName.charAt(0).toUpperCase()
          }}</span>
        </div>
      </div>
    </div>
    <!-- Infos + boutons -->
    <div class="flex-1 flex flex-col justify-between min-w-0">
      <!-- Nom et email en haut -->
      <div class="mb-4">
        <h4 class="font-semibold text-base-content text-lg truncate">
          {{ participant.volunteerName }}
        </h4>
      </div>
      <!-- Boutons en bas -->
      <div class="flex gap-2 mt-auto">
        <button
          v-if="props.participant.isPresent === undefined"
          class="btn btn-sm btn-outline flex-1"
          @click="openUserModal"
        >
          Détails
        </button>
        <button
          v-else
          class="btn btn-sm btn-outline flex-1"
          :class="participant.isPresent ? 'btn-success' : 'btn-primary'"
          @click="openPresenceModal"
        >
          {{ participant.isPresent ? 'Présent' : 'Marquer présent' }}
        </button>
        <button
          class="btn btn-sm btn-outline btn-error flex-1"
          @click="emit('rightAction', participant.volunteerId)"
        >
          Retirer
        </button>
      </div>
    </div>
    <!-- Indicateur de chargement -->
    <ErrorPopup
      :show-error-modal="showErrorModal"
      :error-type="errorType"
      @reload="handleReload"
      @go-home="handleGoHome"
    />

    <!-- Modal de présence -->
    <PresenceModal
      ref="presenceModalRef"
      :person-id="participant.volunteerId"
      :person-name="participant.volunteerName"
      :is-volunteer="isVolunteer || false"
      :initial-presence="participant.isPresent"
      :loading="loading"
      @confirm="handlePresenceConfirm"
    />

    <!-- Modal de détails utilisateur -->
    <UserDetailsModal
      :is-open="showUserModal"
      :user-id="participant.volunteerId"
      @close="closeUserModal"
      :profile-image-url="profileImageUrl"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useUser } from '~/composables/auth/useUser'
  import ErrorPopup from '~/components/utils/ErrorPopup.vue'
  import { useNavigation } from '~/composables/useNavigation'
  import PresenceModal from '~/components/event/association/PresenceModal.vue'
  import UserDetailsModal from '~/components/common/UserDetailsModal.vue'

  interface Participant {
    volunteerId: string
    volunteerName: string
    isPresent?: boolean
  }

  interface UserInfo {
    userId: string
    email: string
    avatarFileKey?: string
  }

  const props = defineProps<{
    participant: Participant
    isVolunteer?: boolean
  }>()

  const emit = defineEmits<{
    rightAction: [id: string]
    presenceAction: [id: string, isPresent: boolean]
  }>()

  const { navigateToRoute } = useNavigation()
  const { fetchUser, getUserById } = useUser()
  const userInfo = ref<UserInfo | null>(null)
  const otherUserId = ref<UserInfo | null>(null)
  const loading = ref(false)
  const presenceModalRef = ref<InstanceType<typeof PresenceModal> | null>(null)

  const showErrorModal = ref(false)
  const errorType = ref<'4xx' | '5xx' | null>(null)
  const showUserModal = ref(false)

  function handleReload() {
    window.location.reload()
  }
  function handleGoHome() {
    navigateToRoute('/')
  }

  const profileImageUrl = computed(() => {
    return otherUserId.value?.avatarFileKey
  })

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

  async function loadUserInfo() {
    if (!props.participant.volunteerId) {
      return
    }

    loading.value = true
    try {
      userInfo.value = await fetchUser()
      otherUserId.value = await getUserById(props.participant.volunteerId)
    } catch (error) {
      handleError(error)
      return
    } finally {
      loading.value = false
    }
  }

  function openPresenceModal() {
    presenceModalRef.value?.showModal()
  }

  function handlePresenceConfirm(id: string, isPresent: boolean) {
    emit('presenceAction', id, isPresent)
    presenceModalRef.value?.closeModal()
  }

  function openUserModal() {
    showUserModal.value = true
  }

  function closeUserModal() {
    showUserModal.value = false
  }

  onMounted(() => {
    loadUserInfo()
  })
</script>

<style scoped>
  .avatar img {
    transition: transform 0.2s ease-in-out;
  }

  .avatar:hover img {
    transform: scale(1.05);
  }

  .btn {
    transition: all 0.2s ease-in-out;
  }

  .btn:hover {
    transform: translateY(-1px);
  }
</style>
