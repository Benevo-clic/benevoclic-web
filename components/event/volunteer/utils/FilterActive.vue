<script setup lang="ts">
import {SlidersHorizontal, X} from "lucide-vue-next";
import type {
  AnnouncementStatus,
  FilterAnnouncement,
  PublicationInterval,
  SortOption
} from "~/common/interface/filter.interface";
import {watch, ref} from "vue";



const props = defineProps<{
  filters: {
    status?: AnnouncementStatus | undefined,
    hoursEventFrom?: string | undefined,
    hoursEventTo?: string | undefined,
    dateEventFrom?: string | undefined,
    dateEventTo?: string | undefined,
    publicationInterval?: PublicationInterval | undefined,
    datePublicationFrom?: string | undefined,
    datePublicationTo?: string | undefined,
    tags?: string[] | undefined,
    latitude?: number | undefined,
    longitude?: number | undefined,
    radius?: number | undefined,
    page?: number | undefined,
    limit?: number | undefined,
    sort?: SortOption | undefined
  },
  selectedTags?: string[],
  selectedTypes?: string[],
  hasActiveFilters?: boolean
}>()


let filters = ref<FilterAnnouncement>({
  status: props.filters.status,
  hoursEventFrom: props.filters.hoursEventFrom,
  hoursEventTo: props.filters.hoursEventTo,
  dateEventFrom: props.filters.dateEventFrom,
  dateEventTo: props.filters.dateEventTo,
  publicationInterval: props.filters.publicationInterval,
  datePublicationFrom: props.filters.datePublicationFrom,
  datePublicationTo: props.filters.datePublicationTo,
  tags: props.filters.tags || [],
  radius: props.filters.radius || 0,
  page: props.filters.page || 1,
  limit: props.filters.limit || 9,
  sort: props.filters.sort
})

watch(props, (newFilters: any) => {
    filters.value = {
      status: newFilters.filters.status,
      hoursEventFrom: newFilters.filters.hoursEventFrom,
      hoursEventTo: newFilters.filters.hoursEventTo,
      dateEventFrom: newFilters.filters.dateEventFrom,
      dateEventTo: newFilters.filters.dateEventTo,
      publicationInterval: newFilters.filters.publicationInterval,
      datePublicationFrom: newFilters.filters.datePublicationFrom,
      datePublicationTo: newFilters.filters.datePublicationTo,
      tags: newFilters.filters.tags || [],
      radius: newFilters.filters.radius || 0,
      page: newFilters.filters.page || 1,
      limit: newFilters.filters.limit || 9,
      sort: newFilters.filters.sort
    }
  }, { deep: true, immediate: true })


const emit = defineEmits<{
  (event: 'status'): void
  (event: 'sort'): void
  (event: 'dateEvent'): void
  (event: 'hoursEvent'): void
  (event: 'datePublication'): void
  (event: 'publicationInterval'): void
  (event: 'radius'): void
  (event: 'resetFilters'): void
  (event: 'selectedTags', tags: string): void
  (event: 'selectedTypes', types: string): void
}>()

const selectedTags = ref<string[] | undefined >([])
const selectedTypes = ref<string[]>([])

const getStatusLabel = (status: AnnouncementStatus) => {
  switch (status) {
    case 'ACTIVE': return 'Actif'
    case 'COMPLETED': return 'Terminé'
    case 'INACTIVE': return 'Inactif'
    default: return status
  }
}

const getSortLabel = (sort: SortOption) => {
  switch (sort) {
    case 'dateEvent_asc': return 'Date événement (croissant)'
    case 'dateEvent_desc': return 'Date événement (décroissant)'
    case 'datePublication_desc': return 'Date publication (récent)'
    default: return sort
  }
}

const getIntervalLabel = (interval: PublicationInterval) => {
  switch (interval) {
    case '1h': return 'Dernière heure'
    case '5h': return '5 dernières heures'
    case '1d': return 'Dernière journée'
    case '1w': return 'Dernière semaine'
    case '1M': return 'Dernier mois'
    default: return interval
  }
}

const removeStatus = () => {
  filters.value.status = undefined
  emit('status')
}

const removeSort = () => {
  filters.value.sort = undefined
  emit('sort')
}

const removeTag = (tag: string) => {
  selectedTags.value = props.selectedTags?.filter(t => t !== tag)
  emit('selectedTags', tag)
}

const removeType = (type: string) => {
  selectedTypes.value = props.selectedTypes?.filter(t => t !== type)
  emit('selectedTypes', type)
}

const removeDateEvent = () => {
  filters.value.dateEventFrom = undefined
  filters.value.dateEventTo = undefined
  emit('dateEvent')
}

const removeHoursEvent = () => {
  filters.value.hoursEventFrom = undefined
  filters.value.hoursEventTo = undefined
  emit('hoursEvent')
}

const removeDatePublication = () => {
  filters.value.datePublicationFrom = undefined
  filters.value.datePublicationTo = undefined
  emit('datePublication')
}

const removePublicationInterval = () => {
  filters.value.publicationInterval = undefined
  emit('publicationInterval')
}

const removeRadius = () => {
  filters.value.radius = 0
  emit('radius')
}

const resetFilters = () => {
  filters.value = {
    status: undefined,
    hoursEventFrom: undefined,
    hoursEventTo: undefined,
    dateEventFrom: undefined,
    dateEventTo: undefined,
    publicationInterval: undefined,
    datePublicationFrom: undefined,
    datePublicationTo: undefined,
    tags: [],
    radius: 0,
    page: 1,
    limit: 9,
    sort: undefined
  }
  selectedTags.value = []
  selectedTypes.value = []
  emit('resetFilters')
}

</script>

<template>
  <div v-if="props.hasActiveFilters" class="mb-4 p-4 bg-base-200 rounded-lg border border-base-300">
    <h4 class="text-sm font-medium mb-3 text-base-content/70 flex items-center gap-2">
      <SlidersHorizontal class="w-4 h-4" />
      Filtres actifs:
    </h4>
    <div class="flex flex-wrap gap-2">
      <!-- Statut -->
      <div v-if="props.filters.status" class="badge badge-primary gap-1">
        {{ getStatusLabel(props.filters.status) }}
        <button @click="removeStatus" class="btn btn-ghost btn-xs p-0 h-4 w-4">
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Tri -->
      <div v-if="props.filters.sort" class="badge badge-secondary gap-1">
        {{ getSortLabel(props.filters.sort) }}
        <button @click="removeSort" class="btn btn-ghost btn-xs p-0 h-4 w-4">
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Tags -->
      <div v-for="tag in props.selectedTags" :key="tag" class="badge badge-accent gap-1">
        {{ tag }}
        <button @click="removeTag(tag)" class="btn btn-ghost btn-xs p-0 h-4 w-4">
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Types d'association -->
      <div v-for="type in selectedTypes" :key="type" class="badge badge-info gap-1">
        {{ type }}
        <button @click="removeType(type)" class="btn btn-ghost btn-xs p-0 h-4 w-4">
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Date événement -->
      <div v-if="props.filters.dateEventFrom || props.filters.dateEventTo" class="badge badge-warning gap-1">
        Date événement
        <button @click="removeDateEvent" class="btn btn-ghost btn-xs p-0 h-4 w-4">
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Heure événement -->
      <div v-if="props.filters.hoursEventFrom || props.filters.hoursEventTo" class="badge badge-warning gap-1">
        Heure événement
        <button @click="removeHoursEvent" class="btn btn-ghost btn-xs p-0 h-4 w-4">
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Date publication -->
      <div v-if="props.filters.datePublicationFrom || props.filters.datePublicationTo" class="badge badge-error gap-1">
        Date publication
        <button @click="removeDatePublication" class="btn btn-ghost btn-xs p-0 h-4 w-4">
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Intervalle publication -->
      <div v-if="props.filters.publicationInterval" class="badge badge-error gap-1">
        {{ getIntervalLabel(props.filters.publicationInterval) }}
        <button @click="removePublicationInterval" class="btn btn-ghost btn-xs p-0 h-4 w-4">
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Rayon -->
      <div v-if="props.filters.radius && props.filters.radius !== 10" class="badge badge-success gap-1">
        {{ props.filters.radius }}km
        <button @click="removeRadius" class="btn btn-ghost btn-xs p-0 h-4 w-4">
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Bouton tout effacer -->
      <button @click="resetFilters" class="btn btn-outline btn-xs">
        Tout effacer
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>