<template>
  <div v-if="loading" class="flex items-center justify-center h-screen">
    <div class="loading loading-spinner loading-lg"></div>
  </div>
  <div v-else class="max-w-screen bg-base-200 py-8 flex flex-col items-center">
    <div class="w-full max-w-3xl mx-auto px-4">
      <h1 class="text-2xl md:text-3xl font-bold text-center mb-8 text-base-content">Liste des bénévoles de l'association</h1>
      <div class="mb-6 flex justify-center">
        <div class="relative w-[90%] max-w-2xl">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search class="w-5 h-5 text-base-content/60" />
          </span>
          <input
            v-model="search"
            type="text"
            placeholder="Rechercher un bénévole par nom..."
            class="input input-bordered w-full pl-10 bg-base-100 rounded-xl shadow focus:ring-2 focus:ring-primary/40 focus:outline-none"
          />
        </div>
      </div>
        <VolunteersList :volunteers="filteredVolunteers" @right-action="handleRemoveVolunteer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import VolunteersList from '~/components/event/association/VolunteersList.vue'
import { useAssociationAuth } from '~/composables/useAssociation'
import { Search } from 'lucide-vue-next'

definePageMeta({
  middleware: ['auth'],
  layout: 'app'
})

interface Volunteer {
  id: string;
  name: string;
}

const useAssociation = useAssociationAuth()
const volunteers = ref<Volunteer[] | null>(null)
const search = ref('')
// const associationId = ref<string | null>(null)

// Le loading est vrai tant que volunteers est null OU que useAssociation.loading est true
const loading = computed(() => volunteers.value === null || useAssociation.loading.value )
const associationId = ref<string | null>(null)

// Surveille l'association pour mettre à jour les bénévoles dès que la donnée arrive
watch(
  () => useAssociation.association.value,
  (association) => {
    if (association?.volunteers) {
      volunteers.value = association.volunteers
    }
  },
  { immediate: true }
)

onMounted(() => {
  // Si pas d'association en cache, on déclenche le chargement
  if (!useAssociation.association.value?.associationId) {
    useAssociation.getAssociationInfo()
  } else {
    // Si déjà en cache, on met à jour volunteers
    volunteers.value = useAssociation.association.value?.volunteers || []
    associationId.value = useAssociation.association.value.associationId || null
  }
})

const filteredVolunteers = computed(() => {
  if (!volunteers.value) return []
  if (!search.value.trim()) return volunteers.value
  return volunteers.value.filter(v =>
    v.name.toLowerCase().includes(search.value.trim().toLowerCase())
  )
})

function handleRemoveVolunteer(volunteerId: string) {
  if(!associationId.value) {
    return
  }
  useAssociation.removeVolunteerFromAssociation(associationId.value,volunteerId)
}
</script> 