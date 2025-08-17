<template>
  <div class="bg-base-100 rounded-lg shadow-md p-4" role="search" aria-label="Panneau de recherche">
    <h2 id="search-panel-heading" class="text-xl font-semibold mb-4 text-base-content">
      {{ t('searchPanel.title') }}
    </h2>

    <!-- Search form -->
    <form class="space-y-4" aria-labelledby="search-panel-heading" @submit.prevent="performSearch">
      <div class="form-control">
        <label for="search-input" class="label">
          <span class="label-text text-base-content">{{ t('searchPanel.search.label') }}</span>
        </label>
        <div class="input-group">
          <input
            id="search-input"
            v-model="searchQuery"
            type="text"
            :placeholder="t('searchPanel.search.placeholder')"
            class="input input-bordered w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-describedby="search-description"
            autocomplete="off"
            @keyup.enter="performSearch"
          />
          <button
            type="submit"
            class="btn btn-square focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            :aria-label="t('searchPanel.search.button')"
            @click="performSearch"
          >
            <Search class="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <div id="search-description" class="text-sm text-base-content opacity-70 mt-1">
          {{ t('searchPanel.search.description') }}
        </div>
      </div>

      <!-- Filters -->
      <fieldset class="grid grid-cols-1 md:grid-cols-2 gap-4" aria-labelledby="filters-heading">
        <legend id="filters-heading" class="sr-only">{{ t('searchPanel.filters.heading') }}</legend>

        <div class="form-control">
          <label for="category-select" class="label">
            <span class="label-text text-base-content">{{
              t('searchPanel.filters.category.label')
            }}</span>
          </label>
          <select
            id="category-select"
            v-model="filters.category"
            class="select select-bordered w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            :aria-label="t('searchPanel.filters.category.aria_label')"
          >
            <option value="">{{ t('searchPanel.filters.category.all') }}</option>
            <option value="environmental">
              {{ t('searchPanel.filters.category.environmental') }}
            </option>
            <option value="humanitarian">
              {{ t('searchPanel.filters.category.humanitarian') }}
            </option>
            <option value="education">{{ t('searchPanel.filters.category.education') }}</option>
            <option value="health">{{ t('searchPanel.filters.category.health') }}</option>
            <option value="community">{{ t('searchPanel.filters.category.community') }}</option>
          </select>
        </div>

        <div class="form-control">
          <label for="location-select" class="label">
            <span class="label-text text-base-content">{{ t('searchPanel.labels.location') }}</span>
          </label>
          <select
            id="location-select"
            v-model="filters.location"
            class="select select-bordered w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            :aria-label="t('searchPanel.aria.filterByLocation')"
          >
            <option value="">{{ t('searchPanel.options.allLocations') }}</option>
            <option value="paris">Paris</option>
            <option value="lyon">Lyon</option>
            <option value="marseille">Marseille</option>
            <option value="bordeaux">Bordeaux</option>
            <option value="lille">Lille</option>
          </select>
        </div>

        <div class="form-control">
          <label for="date-range-select" class="label">
            <span class="label-text text-base-content">{{ t('searchPanel.labels.period') }}</span>
          </label>
          <select
            id="date-range-select"
            v-model="filters.dateRange"
            class="select select-bordered w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            :aria-label="t('searchPanel.aria.filterByPeriod')"
          >
            <option value="">{{ t('searchPanel.options.anytime') }}</option>
            <option value="today">{{ t('searchPanel.options.today') }}</option>
            <option value="this-week">{{ t('searchPanel.options.thisWeek') }}</option>
            <option value="this-month">{{ t('searchPanel.options.thisMonth') }}</option>
            <option value="next-month">{{ t('searchPanel.options.nextMonth') }}</option>
            <option value="custom">{{ t('searchPanel.options.custom') }}</option>
          </select>
        </div>

        <div class="form-control">
          <label for="type-select" class="label">
            <span class="label-text text-base-content">{{ t('searchPanel.labels.type') }}</span>
          </label>
          <select
            id="type-select"
            v-model="filters.type"
            class="select select-bordered w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            :aria-label="t('searchPanel.aria.filterByType')"
          >
            <option value="">{{ t('searchPanel.options.allTypes') }}</option>
            <option value="missions">{{ t('searchPanel.options.missions') }}</option>
            <option value="organizations">{{ t('searchPanel.options.organizations') }}</option>
            <option value="events">{{ t('searchPanel.options.events') }}</option>
          </select>
        </div>
      </fieldset>

      <!-- Custom date range (shown only when custom is selected) -->
      <fieldset
        v-if="filters.dateRange === 'custom'"
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
        aria-labelledby="custom-date-heading"
      >
        <legend id="custom-date-heading" class="sr-only">
          {{ t('searchPanel.legend.customPeriod') }}
        </legend>

        <div class="form-control">
          <label for="start-date" class="label">
            <span class="label-text text-base-content">{{
              t('searchPanel.labels.startDate')
            }}</span>
          </label>
          <input
            id="start-date"
            v-model="filters.startDate"
            type="date"
            class="input input-bordered w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            :aria-label="t('searchPanel.aria.selectStartDate')"
          />
        </div>

        <div class="form-control">
          <label for="end-date" class="label">
            <span class="label-text text-base-content">{{ t('searchPanel.labels.endDate') }}</span>
          </label>
          <input
            id="end-date"
            v-model="filters.endDate"
            type="date"
            class="input input-bordered w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            :aria-label="t('searchPanel.aria.selectEndDate')"
          />
        </div>
      </fieldset>

      <!-- Action buttons -->
      <div
        class="flex justify-end gap-2"
        role="group"
        :aria-label="t('searchPanel.aria.searchActions')"
      >
        <button
          type="button"
          class="btn btn-outline focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
          :aria-label="t('searchPanel.aria.resetAllFilters')"
          @click="resetFilters"
        >
          {{ t('searchPanel.buttons.reset') }}
        </button>
        <button
          type="submit"
          class="btn btn-primary focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
          :aria-label="t('searchPanel.aria.searchWithCurrentFilters')"
          @click="performSearch"
        >
          {{ t('searchPanel.buttons.search') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { Search } from 'lucide-vue-next'

  const { t } = useI18n()

  const emit = defineEmits(['search'])

  const searchQuery = ref('')
  const filters = ref({
    category: '',
    location: '',
    dateRange: '',
    type: '',
    startDate: '',
    endDate: ''
  })

  function performSearch() {
    emit('search', {
      query: searchQuery.value,
      filters: { ...filters.value }
    })
  }

  function resetFilters() {
    searchQuery.value = ''
    filters.value = {
      category: '',
      location: '',
      dateRange: '',
      type: '',
      startDate: '',
      endDate: ''
    }
    // Émettre une recherche vide pour réinitialiser les résultats
    emit('search', {
      query: '',
      filters: { ...filters.value }
    })
  }
</script>
