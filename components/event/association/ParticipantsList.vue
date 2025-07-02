<template>
  <div>
    <h3 class="text-lg font-bold mb-4">Participants</h3>
    <div v-if="props.participants && props.participants.length" class="space-y-3">
      <ParticipantCard
        v-for="participant in props.participants"
        :key="participant.id"
        :participant="participant"
        @left-action="handleLeftAction"
        @right-action="handleRightAction"
      />
    </div>
    <div v-else class="text-center py-8 text-base-content/60">
      <div class="avatar placeholder mb-3">
        <div class="bg-base-300 text-base-content rounded-full w-16">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
      </div>
      <p class="text-sm font-medium">Aucun participant pour cette annonce</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import ParticipantCard from "~/components/event/association/ParticipantCard.vue";

interface Participant {
  id: string;
  name: string;
}

const props = defineProps<{
  participants: Participant[] | undefined;
}>();

const emit = defineEmits<{
  leftAction: [participant: Participant];
  rightAction: [participant: Participant];
}>();


function handleLeftAction(participant: Participant) {
  emit('leftAction', participant);
}

function handleRightAction(participant: Participant) {
  emit('rightAction', participant);
}
</script> 