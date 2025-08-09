<template>
  <div>
    <FilterActive
      :has-active-filters="Boolean(hasActiveFilters)"
      :filters="filters as any"
      @date-event="() => {}"
      @hours-event="() => {}"
      @date-publication="() => {}"
      @publication-interval="() => {}"
      @radius="() => {}"
      @status="() => {}"
      @sort="removeSort"
      @tag="() => {}"
      @type="() => {}"
      @reset-filters="resetFilters"
    />
    <div
      class="w-full flex flex-col sm:flex-row sm:items-center sm:justify-start gap-2"
    >
      <!-- Bouton Trier -->
      <div class="dropdown dropdown-bottom">
        <button
          tabindex="0"
          class="btn btn-sm rounded-full flex items-center gap-2 min-w-max transition-all duration-200"
          :class="filters.sort ? 'btn-secondary' : 'btn-outline'"
        >
          <SortAsc class="w-4 h-4" />
          Trier par
          <ChevronRight class="w-3 h-3" />
        </button>
        <ul
          class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-sm z-50"
        >
          <li v-for="sortOption in sortOptions" :key="sortOption.value">
            <a @click="applySort(sortOption.value)">
              <input
                type="checkbox"
                :checked="filters.sort === sortOption.value"
                class="checkbox checkbox-xs mr-2"
                aria-label="Champ de saisie"
              >
              {{ sortOption.label }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SortAsc, ChevronRight } from 'lucide-vue-next'
import { computed, defineEmits, ref } from 'vue'
import type {
  FilterAnnouncement,
  SortOption
} from '~/common/interface/filter.interface'
import FilterActive from '~/components/event/volunteer/utils/FilterActive.vue'

const emit = defineEmits<{
  (e: 'filter', filters: FilterAnnouncement): void;
}>()

const filters = ref<FilterAnnouncement>({
  status: undefined,
  page: 1,
  limit: 9,
  sort: undefined
})

const sortOptions = ref([
  {
    value: 'dateEvent_asc' as SortOption,
    label: "Date d'événement (croissant)"
  },
  {
    value: 'dateEvent_desc' as SortOption,
    label: "Date d'événement (décroissant)"
  },
  {
    value: 'datePublication_desc' as SortOption,
    label: 'Date de publication (récent)'
  }
])

const hasActiveFilters = computed(() => {
  return filters.value.status || filters.value.sort
})

const removeSort = () => {
  filters.value.sort = undefined
  applyFilters()
}

const applyFilters = () => {
  const filtersToSend = { ...filters.value }

  delete filtersToSend.cityCoordinates

  if (filtersToSend.radius && filtersToSend.radius > 0) {
    filtersToSend.radius = filtersToSend.radius * 1000
  }
  emit('filter', filtersToSend)
}

const resetFilters = () => {
  filters.value = {
    status: undefined,
    page: 1,
    limit: 9,
    sort: undefined
  }
  applyFilters()
}

const applySort = (sort: SortOption) => {
  filters.value.sort = sort
  applyFilters()
}
</script>

<style scoped>
.flex::-webkit-scrollbar {
  display: none;
}
</style>
