<template>
  <div
    class="bg-base-100 rounded-lg shadow-md p-4"
    role="search"
    aria-label="Panneau de recherche"
  >
    <h2
      id="search-panel-heading"
      class="text-xl font-semibold mb-4 text-base-content"
    >
      Recherche
    </h2>

    <!-- Search form -->
    <form
      class="space-y-4"
      aria-labelledby="search-panel-heading"
      @submit.prevent="performSearch"
    >
      <div class="form-control">
        <label for="search-input" class="label">
          <span class="label-text text-base-content">Rechercher</span>
        </label>
        <div class="input-group">
          <input
            id="search-input"
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher des missions, organisations..."
            class="input input-bordered w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-describedby="search-description"
            autocomplete="off"
            @keyup.enter="performSearch"
          >
          <button
            type="submit"
            class="btn btn-square focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Lancer la recherche"
            @click="performSearch"
          >
            <Search class="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <div
          id="search-description"
          class="text-sm text-base-content opacity-70 mt-1"
        >
          Tapez vos mots-clés pour trouver des missions et organisations
        </div>
      </div>

      <!-- Filters -->
      <fieldset
        class="grid grid-cols-1 md:grid-cols-2 gap-4"
        aria-labelledby="filters-heading"
      >
        <legend id="filters-heading" class="sr-only">
          Filtres de recherche
        </legend>

        <div class="form-control">
          <label for="category-select" class="label">
            <span class="label-text text-base-content">Catégorie</span>
          </label>
          <select
            id="category-select"
            v-model="filters.category"
            class="select select-bordered w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Filtrer par catégorie"
          >
            <option value="">
              Toutes les catégories
            </option>
            <option value="environmental">
              Environnement
            </option>
            <option value="humanitarian">
              Humanitaire
            </option>
            <option value="education">
              Éducation
            </option>
            <option value="health">
              Santé
            </option>
            <option value="community">
              Communauté
            </option>
          </select>
        </div>

        <div class="form-control">
          <label for="location-select" class="label">
            <span class="label-text text-base-content">Localisation</span>
          </label>
          <select
            id="location-select"
            v-model="filters.location"
            class="select select-bordered w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Filtrer par localisation"
          >
            <option value="">
              Toutes les localisations
            </option>
            <option value="paris">
              Paris
            </option>
            <option value="lyon">
              Lyon
            </option>
            <option value="marseille">
              Marseille
            </option>
            <option value="bordeaux">
              Bordeaux
            </option>
            <option value="lille">
              Lille
            </option>
          </select>
        </div>

        <div class="form-control">
          <label for="date-range-select" class="label">
            <span class="label-text text-base-content">Période</span>
          </label>
          <select
            id="date-range-select"
            v-model="filters.dateRange"
            class="select select-bordered w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Filtrer par période"
          >
            <option value="">
              N'importe quand
            </option>
            <option value="today">
              Aujourd'hui
            </option>
            <option value="this-week">
              Cette semaine
            </option>
            <option value="this-month">
              Ce mois
            </option>
            <option value="next-month">
              Mois prochain
            </option>
            <option value="custom">
              Période personnalisée
            </option>
          </select>
        </div>

        <div class="form-control">
          <label for="type-select" class="label">
            <span class="label-text text-base-content">Type</span>
          </label>
          <select
            id="type-select"
            v-model="filters.type"
            class="select select-bordered w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Filtrer par type"
          >
            <option value="">
              Tous les types
            </option>
            <option value="missions">
              Missions
            </option>
            <option value="organizations">
              Organisations
            </option>
            <option value="events">
              Événements
            </option>
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
          Période personnalisée
        </legend>

        <div class="form-control">
          <label for="start-date" class="label">
            <span class="label-text text-base-content">Date de début</span>
          </label>
          <input
            id="start-date"
            v-model="filters.startDate"
            type="date"
            class="input input-bordered w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Sélectionner la date de début"
          >
        </div>

        <div class="form-control">
          <label for="end-date" class="label">
            <span class="label-text text-base-content">Date de fin</span>
          </label>
          <input
            id="end-date"
            v-model="filters.endDate"
            type="date"
            class="input input-bordered w-full focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Sélectionner la date de fin"
          >
        </div>
      </fieldset>

      <!-- Action buttons -->
      <div
        class="flex justify-end gap-2"
        role="group"
        aria-label="Actions de recherche"
      >
        <button
          type="button"
          class="btn btn-outline focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
          aria-label="Réinitialiser tous les filtres"
          @click="resetFilters"
        >
          Réinitialiser
        </button>
        <button
          type="submit"
          class="btn btn-primary focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
          aria-label="Lancer la recherche avec les filtres actuels"
          @click="performSearch"
        >
          Rechercher
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from 'lucide-vue-next'

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

function performSearch () {
  emit('search', {
    query: searchQuery.value,
    filters: { ...filters.value }
  })
}

function resetFilters () {
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
