<template>
  <div v-if="loading" class="flex items-center justify-center h-screen">
    <div class="loading loading-spinner loading-lg"></div>
  </div>
  <div v-else class="max-w-screen bg-base-200 py-8 flex flex-col items-center">
    <div class="w-full max-w-3xl mx-auto px-4">
      <h1 class="text-2xl md:text-3xl font-bold text-center mb-8 text-base-content">
        Associations que je suis
      </h1>
      <div class="mb-6 flex justify-center">
        <div class="relative w-[90%] max-w-2xl">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search class="w-5 h-5 text-base-content/60" />
          </span>
          <input
            v-model="search"
            type="text"
            placeholder="Rechercher une association..."
            class="input input-bordered w-full pl-10 bg-base-100 rounded-xl shadow focus:ring-2 focus:ring-primary/40 focus:outline-none"
          />
        </div>
      </div>
      <VolunteersList :volunteers="filteredAssociations" @right-action="handleRemoveVolunteer"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import VolunteersList from '~/components/event/association/VolunteersList.vue'
import { Search } from 'lucide-vue-next'
import { useVolunteerAuth } from '~/composables/useVolunteer'
import { useVolunteerAuthStore } from '~/stores/volunteer.store'
import type { AssociationVolunteerFollow } from '~/common/interface/volunteer.interface'
import {useUser} from "~/composables/auth/useUser";

definePageMeta({
  middleware: ['auth'],
  layout: 'app'
})

const useVolunteer = useVolunteerAuth()
const volunteerStore = useVolunteerAuthStore()
const { getUserId } = useUser();

const search = ref('')

const associationsFollowing = computed<AssociationVolunteerFollow[] | null>(() => volunteerStore.getAssociationsFollowingList)
const loading = computed(() => associationsFollowing.value === null || useVolunteer.loading.value)

console.log("Associations Following:", useVolunteer.loading.value)

onMounted(async () => {
  if (getUserId) {
    await useVolunteer.getAllAssociationsFollowingList(getUserId)
  }
})

const filteredAssociations = computed(() => {
  if (!associationsFollowing.value) return []
  let list = associationsFollowing.value.map((a: AssociationVolunteerFollow) => ({
    id: a.associationId,
    name: a.associationName
  }))
  if (!search.value.trim()) return list
  return list.filter((a: { id: string; name: string }) =>
    a.name.toLowerCase().includes(search.value.trim().toLowerCase())
  )
})

function handleRemoveVolunteer(associationId: string) {
  if(!getUserId) {
    console.error("User ID is not available")
    return
  }
  useVolunteer.removeVolunteerFromAssociation(associationId, getUserId)
}
</script>