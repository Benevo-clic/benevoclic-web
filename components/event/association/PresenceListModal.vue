<template>
  <dialog ref="modalRef" class="modal">
    <div class="modal-box max-w-4xl">
      <h3 class="font-bold text-xl mb-6">Gestion des présences</h3>
      
      <!-- Tabs for participants and volunteers -->
      <div role="tablist" class="tabs tabs-bordered mb-4">
        <a 
          role="tab" 
          :class="['tab', activeTab === 'participants' ? 'tab-active' : '']" 
          @click="activeTab = 'participants'"
        >
          Participants
        </a>
        <a 
          role="tab" 
          :class="['tab', activeTab === 'volunteers' ? 'tab-active' : '']" 
          @click="activeTab = 'volunteers'"
        >
          Bénévoles
        </a>
      </div>
      
      <!-- Search bar -->
      <div class="form-control mb-4">
        <div class="input-group">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Rechercher..." 
            class="input input-bordered w-full"
          />
        </div>
      </div>
      
      <!-- Participants list -->
      <div v-if="activeTab === 'participants'" class="max-h-96 overflow-y-auto">
        <div v-if="filteredParticipants.length === 0" class="text-center py-8 text-base-content/60">
          <p class="text-sm font-medium">Aucun participant trouvé</p>
        </div>
        <div v-else class="space-y-3">
          <div 
            v-for="participant in filteredParticipants" 
            :key="participant.id"
            class="flex items-center justify-between p-3 bg-base-200 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div class="avatar placeholder">
                <div class="w-10 h-10 rounded-full bg-base-300 text-base-content flex items-center justify-center">
                  <span class="text-sm font-bold">{{ participant.name.charAt(0).toUpperCase() }}</span>
                </div>
              </div>
              <div>
                <p class="font-medium">{{ participant.name }}</p>
              </div>
            </div>
            <label class="cursor-pointer flex items-center gap-2">
              <input 
                type="checkbox" 
                class="checkbox checkbox-primary" 
                :checked="participant.isPresent"
                @change="togglePresence(participant, 'participant')"
              />
              <span class="label-text">{{ participant.isPresent ? 'Présent' : 'Absent' }}</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Volunteers list -->
      <div v-if="activeTab === 'volunteers'" class="max-h-96 overflow-y-auto">
        <div v-if="filteredVolunteers.length === 0" class="text-center py-8 text-base-content/60">
          <p class="text-sm font-medium">Aucun bénévole trouvé</p>
        </div>
        <div v-else class="space-y-3">
          <div 
            v-for="volunteer in filteredVolunteers" 
            :key="volunteer.id"
            class="flex items-center justify-between p-3 bg-base-200 rounded-lg"
          >
            <div class="flex items-center gap-3">
              <div class="avatar placeholder">
                <div class="w-10 h-10 rounded-full bg-base-300 text-base-content flex items-center justify-center">
                  <span class="text-sm font-bold">{{ volunteer.name.charAt(0).toUpperCase() }}</span>
                </div>
              </div>
              <div>
                <p class="font-medium">{{ volunteer.name }}</p>
              </div>
            </div>
            <label class="cursor-pointer flex items-center gap-2">
              <input 
                type="checkbox" 
                class="checkbox checkbox-primary" 
                :checked="volunteer.isPresent"
                @change="togglePresence(volunteer, 'volunteer')"
              />
              <span class="label-text">{{ volunteer.isPresent ? 'Présent' : 'Absent' }}</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Modal actions -->
      <div class="modal-action">
        <button @click="closeModal" class="btn btn-ghost">Fermer</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>Fermer</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { InfoVolunteer } from '~/common/interface/event.interface';
import { useAnnouncement } from '~/composables/useAnnouncement';

interface Props {
  announcementId: string;
  participants?: InfoVolunteer[];
  volunteers?: InfoVolunteer[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  update: [];
}>();

const modalRef = ref<HTMLDialogElement | null>(null);
const activeTab = ref<'participants' | 'volunteers'>('participants');
const searchQuery = ref('');
const announcement = useAnnouncement();

// Create local copies of the participants and volunteers arrays
const localParticipants = ref<InfoVolunteer[]>([]);
const localVolunteers = ref<InfoVolunteer[]>([]);

// Initialize local copies when props change
watch(() => props.participants, (newParticipants) => {
  if (newParticipants) {
    localParticipants.value = JSON.parse(JSON.stringify(newParticipants));
  }
}, { immediate: true });

watch(() => props.volunteers, (newVolunteers) => {
  if (newVolunteers) {
    localVolunteers.value = JSON.parse(JSON.stringify(newVolunteers));
  }
}, { immediate: true });

// Filtered lists based on search query
const filteredParticipants = computed(() => {
  if (!searchQuery.value) return localParticipants.value;
  const query = searchQuery.value.toLowerCase();
  return localParticipants.value.filter(p => 
    p.name.toLowerCase().includes(query)
  );
});

const filteredVolunteers = computed(() => {
  if (!searchQuery.value) return localVolunteers.value;
  const query = searchQuery.value.toLowerCase();
  return localVolunteers.value.filter(v => 
    v.name.toLowerCase().includes(query)
  );
});

// Toggle presence status
async function togglePresence(person: InfoVolunteer, type: 'participant' | 'volunteer') {
  try {
    const updatedPerson = {
      ...person,
      isPresent: !person.isPresent
    };
    
    if (type === 'participant') {
      await announcement.updatePresentParticipant(props.announcementId, updatedPerson);
      // Update local copy
      const index = localParticipants.value.findIndex(p => p.id === person.id);
      if (index !== -1) {
        localParticipants.value[index].isPresent = updatedPerson.isPresent;
      }
    } else {
      await announcement.updatePresentVolunteer(props.announcementId, updatedPerson);
      // Update local copy
      const index = localVolunteers.value.findIndex(v => v.id === person.id);
      if (index !== -1) {
        localVolunteers.value[index].isPresent = updatedPerson.isPresent;
      }
    }
    
    emit('update');
  } catch (error) {
    console.error('Error updating presence status:', error);
  }
}

function showModal() {
  modalRef.value?.showModal();
}

function closeModal() {
  modalRef.value?.close();
  emit('close');
}

defineExpose({
  showModal
});
</script>

<style scoped>
.modal-box {
  width: 90%;
  max-width: 800px;
}

/* Custom scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}
</style>