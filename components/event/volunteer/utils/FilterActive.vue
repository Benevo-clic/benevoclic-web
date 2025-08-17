<script setup lang="ts">
  import { SlidersHorizontal, X } from 'lucide-vue-next'
  import { watch, ref } from 'vue'
  import type {
    AnnouncementState,
    AnnouncementStatus,
    FilterAnnouncement,
    PublicationInterval,
    SortOption
  } from '~/common/interface/filter.interface'

  const { t } = useI18n()

  const props = defineProps<{
    filters: {
      status?: AnnouncementStatus | undefined
      hoursEventFrom?: string | undefined
      hoursEventTo?: string | undefined
      dateEventFrom?: string | undefined
      dateEventTo?: string | undefined
      publicationInterval?: PublicationInterval | undefined
      datePublicationFrom?: string | undefined
      datePublicationTo?: string | undefined
      tags?: string[] | undefined
      latitude?: number | undefined
      longitude?: number | undefined
      radius?: number | undefined
      page?: number | undefined
      limit?: number | undefined
      sort?: SortOption | undefined
      stateEvent?: AnnouncementState | undefined
    }
    selectedTags?: string[]
    selectedTypes?: string[]
    hasActiveFilters?: boolean
  }>()

  const filters = ref<FilterAnnouncement & { stateEvent?: AnnouncementState }>({
    status: props.filters.status,
    stateEvent: props.filters.stateEvent,
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

  watch(
    props,
    (newFilters: any) => {
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
    },
    { deep: true, immediate: true }
  )

  // eslint-disable-next-line func-call-spacing
  const emit = defineEmits<{
    (event: 'status'): void
    (event: 'stateEvent'): void
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

  const localSelectedTags = ref<string[] | undefined>([])
  const localSelectedTypes = ref<string[]>([])

  const getStatusLabel = (status: AnnouncementStatus) => {
    switch (status) {
      case 'ACTIVE':
        return t('filterActive.status.active')
      case 'COMPLETED':
        return t('filterActive.status.completed')
      case 'INACTIVE':
        return t('filterActive.status.inactive')
      default:
        return status
    }
  }

  const getStateEventLabel = (state: AnnouncementState) => {
    switch (state) {
      case 'NOW':
        return t('filterActive.stateEvent.now')
      case 'PAST':
        return t('filterActive.stateEvent.past')
      case 'UPCOMING':
        return t('filterActive.stateEvent.upcoming')
      default:
        return state
    }
  }

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case 'dateEvent_asc':
        return t('filterActive.sort.dateEventAsc')
      case 'dateEvent_desc':
        return t('filterActive.sort.dateEventDesc')
      case 'datePublication_desc':
        return t('filterActive.sort.datePublicationDesc')
      default:
        return sort
    }
  }

  const getIntervalLabel = (interval: PublicationInterval) => {
    switch (interval) {
      case '1h':
        return t('filterActive.interval.lastHour')
      case '5h':
        return t('filterActive.interval.last5Hours')
      case '1d':
        return t('filterActive.interval.lastDay')
      case '1w':
        return t('filterActive.interval.lastWeek')
      case '1M':
        return t('filterActive.interval.lastMonth')
      default:
        return interval
    }
  }

  const removeStatus = () => {
    filters.value.status = undefined
    emit('status')
  }

  const removeStateEvent = () => {
    filters.value.stateEvent = undefined
    emit('stateEvent')
  }

  const removeSort = () => {
    filters.value.sort = undefined
    emit('sort')
  }

  const removeTag = (tag: string) => {
    localSelectedTags.value = props.selectedTags?.filter(t => t !== tag)
    emit('selectedTags', tag)
  }

  const removeType = (type: string) => {
    localSelectedTypes.value = props.selectedTypes?.filter(t => t !== type) || []
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
      stateEvent: undefined,
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
    localSelectedTags.value = []
    localSelectedTypes.value = []
    emit('resetFilters')
  }
</script>

<template>
  <div v-if="props.hasActiveFilters" class="mb-4 p-4 bg-base-200 rounded-lg border border-base-300">
    <h4 class="text-sm font-medium mb-3 text-base-content/70 flex items-center gap-2">
      <SlidersHorizontal class="w-4 h-4" />
      {{ t('filterActive.labels.activeFilters') }}:
    </h4>
    <div class="flex flex-wrap gap-2">
      <!-- Statut -->
      <div v-if="props.filters.status" class="badge badge-primary gap-1">
        {{ getStatusLabel(props.filters.status) }}
        <button class="btn btn-ghost btn-xs p-0 h-4 w-4" @click="removeStatus">
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- État de l'événement -->
      <div v-if="props.filters.stateEvent" class="badge badge-secondary gap-1">
        {{ getStateEventLabel(props.filters.stateEvent) }}
        <button class="btn btn-ghost btn-xs p-0 h-4 w-4" @click="removeStateEvent">
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Tri -->
      <div v-if="props.filters.sort" class="badge badge-secondary gap-1">
        {{ getSortLabel(props.filters.sort) }}
        <button class="btn btn-ghost btn-xs p-0 h-4 w-4" @click="removeSort">
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Tags -->
      <div v-for="tag in props.selectedTags" :key="tag" class="badge badge-accent gap-1">
        {{ tag }}
        <button class="btn btn-ghost btn-xs p-0 h-4 w-4" @click="removeTag(tag)">
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Types d'association -->
      <div v-for="type in localSelectedTypes" :key="type" class="badge badge-info gap-1">
        {{ type }}
        <button class="btn btn-ghost btn-xs p-0 h-4 w-4" @click="removeType(type)">
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Date événement -->
      <div
        v-if="props.filters.dateEventFrom || props.filters.dateEventTo"
        class="badge badge-warning gap-1"
      >
        {{ t('filterActive.labels.eventDate') }}
        <button class="btn btn-ghost btn-xs p-0 h-4 w-4" @click="removeDateEvent">
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Heure événement -->
      <div
        v-if="props.filters.hoursEventFrom || props.filters.hoursEventTo"
        class="badge badge-warning gap-1"
      >
        {{ t('filterActive.labels.eventTime') }}
        <button class="btn btn-ghost btn-xs p-0 h-4 w-4" @click="removeHoursEvent">
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Date publication -->
      <div
        v-if="props.filters.datePublicationFrom || props.filters.datePublicationTo"
        class="badge badge-error gap-1"
      >
        {{ t('filterActive.labels.publicationDate') }}
        <button class="btn btn-ghost btn-xs p-0 h-4 w-4" @click="removeDatePublication">
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Intervalle publication -->
      <div v-if="props.filters.publicationInterval" class="badge badge-error gap-1">
        {{ getIntervalLabel(props.filters.publicationInterval) }}
        <button class="btn btn-ghost btn-xs p-0 h-4 w-4" @click="removePublicationInterval">
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Rayon -->
      <div
        v-if="props.filters.radius && props.filters.radius !== 10"
        class="badge badge-success gap-1"
      >
        {{ props.filters.radius }}km
        <button class="btn btn-ghost btn-xs p-0 h-4 w-4" @click="removeRadius">
          <X class="w-3 h-3" />
        </button>
      </div>

      <!-- Bouton tout effacer -->
      <button
        class="btn btn-outline btn-xs"
        type="button"
        @click="resetFilters"
      >
        Tout effacer
      </button>
    </div>
  </div>
</template>

<style scoped></style>
