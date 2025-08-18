<template>
  <div
    class="bg-base-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300 p-6"
  >
    <!-- Header avec photo de profil et informations -->
    <div class="flex items-start gap-4 mb-6">
      <!-- Photo de profil -->
      <div
        class="flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200"
        @click="handleAvatarClick"
        @keyup.enter="handleAvatarClick"
        @keyup.space.prevent="handleAvatarClick"
        role="button"
        tabindex="0"
        :aria-label="t('requestItem.clickToViewVolunteerDetails')"
      >
        <div
          class="w-16 h-16 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100 overflow-hidden bg-base-200"
        >
          <img
            :src="props.volunteer.avatar || '/images/default-avatar.png'"
            :alt="t('requestItem.volunteer_avatar_alt')"
            class="w-full h-full object-cover"
            @error="
              event => {
                const target = event.target as HTMLImageElement
                target.src = '/images/default-avatar.png'
              }
            "
          />
        </div>
      </div>

      <!-- Informations du bénévole -->
      <div class="flex-1 min-w-0">
        <h3 class="font-bold text-lg text-base-content mb-1">
          {{ props.volunteer.name }}
        </h3>
        <p class="text-sm text-base-content opacity-70 mb-2 break-all">
          {{ props.volunteer.email }}
        </p>

        <!-- Contexte de l'événement -->
        <div v-if="type === 'event' && context" class="flex items-center gap-2">
          <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="text-sm text-primary font-medium">
            {{ t('requestItem.event_context') }} <span class="font-semibold">{{ context }}</span>
          </span>
        </div>

        <!-- Contexte de l'association -->
        <div v-else-if="type === 'association'" class="flex items-center gap-2">
          <svg class="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span class="text-sm text-secondary font-medium">
            {{ t('requestItem.association_context') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Boutons d'action en bas -->
    <div class="flex gap-3 pt-4 border-t border-base-300">
      <button
        class="btn btn-success flex-1 gap-2 hover:scale-105 transition-transform duration-200"
        @click="$emit('accept')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        {{ t('requestItem.actions.accept') }}
      </button>
      <button
        class="btn btn-error flex-1 gap-2 hover:scale-105 transition-transform duration-200"
        @click="$emit('refuse')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        {{ t('requestItem.actions.refuse') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  const { t } = useI18n()

  const props = defineProps<{
    volunteer: { id: string; name: string; email: string; avatar: string }
    context?: string
    type: 'event' | 'association'
  }>()

  const emit = defineEmits<{
    accept: []
    refuse: []
    openUserModal: [volunteerId: string]
  }>()

  function handleAvatarClick() {
    emit('openUserModal', props.volunteer.id)
  }
</script>

<style scoped>
  /* Animation d'entrée */
  .card {
    animation: slideInUp 0.3s ease-out;
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Hover effects */
  .card:hover {
    transform: translateY(-2px);
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    .card {
      padding: 1rem;
    }

    .avatar {
      width: 3rem;
      height: 3rem;
    }

    .btn {
      font-size: 0.875rem;
      padding: 0.5rem 1rem;
    }
  }
</style>
