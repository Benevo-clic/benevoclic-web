<template>
  <div>
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
            aria-label="Champ de saisie">
          </div>
        </div>
        <VolunteersList :volunteers="filteredVolunteers" @right-action="handleRemoveVolunteer" />
      </div>
    </div>
    <ErrorPopup
        :show-error-modal="showErrorModal"
        :error-type="errorType"
        @reload="handleReload"
        @goHome="handleGoHome"
    />
  </div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import VolunteersList from '~/components/event/association/VolunteersList.vue'
import { useAssociationAuth } from '~/composables/useAssociation'
import { Search } from 'lucide-vue-next'
import ErrorPopup from "~/components/utils/ErrorPopup.vue";
import {useNavigation} from "~/composables/useNavigation";

definePageMeta({
  middleware: ['auth'],
  layout: 'app'
})

interface Volunteer {
  volunteerId: string;
  volunteerName: string;
}

const useAssociation = useAssociationAuth()
const {navigateToRoute} = useNavigation()


onMounted(async () => {
  await useAssociation.getAssociationInfo()
})

const volunteers = ref<Volunteer[] | null>(null)
const search = ref('')

const loading = computed(() => volunteers.value === null || useAssociation.loading.value )
const associationId = ref<string | null>(null)
const showErrorModal = ref(false);
const errorType = ref<'4xx' | '5xx' | null>(null);




watch(
  () => useAssociation.association.value,
  (association) => {
    if (association?.volunteers) {
      volunteers.value = association.volunteers
    }
  },
  { immediate: true }
)

onMounted(async () => {
  try {
     await initData()
  }catch (error) {
    handleError(error)
  }
})


async function initData(){
  if (!useAssociation.association.value?.associationId) {
    await useAssociation.getAssociationInfo()
  } else {
    volunteers.value = useAssociation.association.value?.volunteers || []
    associationId.value = useAssociation.association.value.associationId || null
  }
}

function handleReload() {
  window.location.reload();
}
async function handleGoHome() {
  await navigateToRoute('/');
}

function handleError(error: any) {
  if (error?.response?.status >= 500 && error?.response?.status < 600) {
    errorType.value = '5xx';
    showErrorModal.value = true;
  } else if (error?.response?.status >= 400 && error?.response?.status < 500) {
    errorType.value = '4xx';
    showErrorModal.value = true;
  } else {
    console.error('Erreur inattendue:', error);
  }
}

const filteredVolunteers = computed(() => {
  if (!volunteers.value) return []
  if (!search.value.trim()) return volunteers.value
  return volunteers.value.filter(v =>
    v.volunteerName.toLowerCase().includes(search.value.trim().toLowerCase())
  )
})

async function handleRemoveVolunteer(volunteerId: string) {
  if(!associationId.value) {
    return
  }
  try {
    await useAssociation.removeVolunteerFromAssociation(associationId.value,volunteerId)
  }catch (error) {
    handleError(error)
  }
}
</script> 