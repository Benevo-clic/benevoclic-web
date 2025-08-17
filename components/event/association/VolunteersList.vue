<template>
  <div>
    <h3 class="text-lg font-bold mb-4">{{ t('volunteersList.title') }}</h3>
    <div v-if="props.volunteers && props.volunteers.length">
      <ParticipantOrVolunteerCard
        v-for="volunteer in props.volunteers"
        :key="volunteer.volunteerId"
        v-memo="[volunteer.volunteerId, volunteer.volunteerName, volunteer.isPresent]"
        :participant="volunteer"
        :is-volunteer="true"
        @right-action="handleRightAction"
        @presence-action="handlePresenceAction"
      />
    </div>
    <div v-else class="text-center py-8 text-base-content/60">
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        </div>
      </div>
      <p class="text-sm font-medium">{{ t('volunteersList.no_volunteers') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ParticipantOrVolunteerCard from './ParticipantOrVolunteerCard.vue'

  const { t } = useI18n()

  interface Volunteer {
    volunteerId: string
    volunteerName: string
    isPresent?: boolean
  }

  const props = defineProps<{
    volunteers: Volunteer[] | undefined
  }>()

  const emit = defineEmits<{
    rightAction: [volunteer: string]
    presenceAction: [volunteer: string, isPresent: boolean]
  }>()

  function handleRightAction(id: string) {
    emit('rightAction', id)
  }

  function handlePresenceAction(id: string, isPresent: boolean) {
    emit('presenceAction', id, isPresent)
  }
</script>
