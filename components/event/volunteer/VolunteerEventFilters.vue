<template>
  <div class="w-full">
    <!-- Filtres sélectionnés -->
    <div v-if="hasActiveFilters" class="mb-4 p-4 bg-base-200 rounded-lg border border-base-300">
      <h4 class="text-sm font-medium mb-3 text-base-content/70 flex items-center gap-2">
        <SlidersHorizontal class="w-4 h-4" />
        Filtres actifs:
      </h4>
      <div class="flex flex-wrap gap-2">
        <!-- Statut -->
        <div v-if="filters.status" class="badge badge-primary gap-1">
          {{ getStatusLabel(filters.status) }}
          <button @click="removeStatus" class="btn btn-ghost btn-xs p-0 h-4 w-4">
            <X class="w-3 h-3" />
          </button>
        </div>

        <!-- Tri -->
        <div v-if="filters.sort" class="badge badge-secondary gap-1">
          {{ getSortLabel(filters.sort) }}
          <button @click="removeSort" class="btn btn-ghost btn-xs p-0 h-4 w-4">
            <X class="w-3 h-3" />
          </button>
        </div>

        <!-- Tags -->
        <div v-for="tag in selectedTags" :key="tag" class="badge badge-accent gap-1">
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
        <div v-if="filters.dateEventFrom || filters.dateEventTo" class="badge badge-warning gap-1">
          Date événement
          <button @click="removeDateEvent" class="btn btn-ghost btn-xs p-0 h-4 w-4">
            <X class="w-3 h-3" />
          </button>
        </div>

        <!-- Heure événement -->
        <div v-if="filters.hoursEventFrom || filters.hoursEventTo" class="badge badge-warning gap-1">
          Heure événement
          <button @click="removeHoursEvent" class="btn btn-ghost btn-xs p-0 h-4 w-4">
            <X class="w-3 h-3" />
          </button>
        </div>

        <!-- Date publication -->
        <div v-if="filters.datePublicationFrom || filters.datePublicationTo" class="badge badge-error gap-1">
          Date publication
          <button @click="removeDatePublication" class="btn btn-ghost btn-xs p-0 h-4 w-4">
            <X class="w-3 h-3" />
          </button>
        </div>

        <!-- Intervalle publication -->
        <div v-if="filters.publicationInterval" class="badge badge-error gap-1">
          {{ getIntervalLabel(filters.publicationInterval) }}
          <button @click="removePublicationInterval" class="btn btn-ghost btn-xs p-0 h-4 w-4">
            <X class="w-3 h-3" />
          </button>
        </div>

        <!-- Rayon -->
        <div v-if="filters.radius && filters.radius !== 10" class="badge badge-success gap-1">
          {{ filters.radius }}km
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

    <!-- Boutons de filtres -->
    <div class="w-full flex flex-wrap justify-center gap-2">
      <!-- Desktop -->
      <div class="hidden md:flex flex-wrap gap-2 items-center justify-center w-full max-w-full">
        <button 
          class="btn btn-sm rounded-full flex items-center gap-2 min-w-max transition-all duration-200" 
          :class="showMap ? 'btn-primary' : 'btn-outline'"
          @click="toggleMap"
        >
          <Map class="w-4 h-4" />
          Carte
        </button>

        <!-- Trier par -->
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
          <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-sm z-50">
            <li v-for="sortOption in sortOptions" :key="sortOption.value">
              <a @click="applySort(sortOption.value)">
                <input 
                  type="checkbox" 
                  :checked="filters.sort === sortOption.value" 
                  class="checkbox checkbox-xs mr-2" 
                />
                {{ sortOption.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Statut -->
        <div class="dropdown dropdown-bottom">
          <button 
            tabindex="0" 
            class="btn btn-sm rounded-full flex items-center gap-2 min-w-max transition-all duration-200"
            :class="filters.status ? 'btn-primary' : 'btn-outline'"
          >
            Statut
            <ChevronRight class="w-3 h-3" />
          </button>
          <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-sm z-50">
            <li v-for="statusOption in statusOptions" :key="statusOption.value">
              <a @click="applyStatus(statusOption.value)">
                <input 
                  type="checkbox" 
                  :checked="filters.status === statusOption.value" 
                  class="checkbox checkbox-xs mr-2" 
                />
                {{ statusOption.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Type d'association -->
        <div class="dropdown dropdown-bottom">
          <button 
            tabindex="0" 
            class="btn btn-sm rounded-full flex items-center gap-2 min-w-max transition-all duration-200"
            :class="selectedTypes.length > 0 ? 'btn-info' : 'btn-outline'"
          >
            Type d'association
            <ChevronRight class="w-3 h-3" />
          </button>
          <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-sm z-50">
            <li v-for="type in availableTypes" :key="type">
              <a @click="toggleType(type)">
                <input type="checkbox" :checked="selectedTypes.includes(type)" class="checkbox checkbox-xs mr-2" />
                {{ type }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Tags -->
        <div class="dropdown dropdown-bottom">
          <button 
            tabindex="0" 
            class="btn btn-sm rounded-full flex items-center gap-2 min-w-max transition-all duration-200"
            :class="selectedTags.length > 0 ? 'btn-accent' : 'btn-outline'"
          >
            Tags
            <ChevronRight class="w-3 h-3" />
          </button>
          <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-sm z-50">
            <li v-for="tag in availableTags" :key="tag">
              <a @click="toggleTag(tag)">
                <input type="checkbox" :checked="selectedTags.includes(tag)" class="checkbox checkbox-xs mr-2" />
                {{ tag }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Filtres avancés -->
        <button 
          class="btn btn-sm rounded-full flex items-center gap-2 min-w-max transition-all duration-200"
          :class="hasAdvancedFilters ? 'btn-warning' : 'btn-outline'"
          @click="showAdvancedFilters = true"
        >
          <SlidersHorizontal class="w-4 h-4" />
          Filtres avancés
        </button>
      </div>

      <!-- Mobile -->
      <div class="flex md:hidden flex-wrap gap-2 items-center justify-center w-full max-w-full">
        <button 
          class="btn btn-sm rounded-full flex items-center gap-2 min-w-max transition-all duration-200"
          :class="showMap ? 'btn-primary' : 'btn-outline'"
          @click="toggleMap"
        >
          <Map class="w-4 h-4" />
          Carte
        </button>

        <!-- Dropdown Filtres Mobile -->
        <div class="dropdown dropdown-bottom">
          <button tabindex="0" class="btn btn-outline btn-sm rounded-full flex items-center gap-2 min-w-max">
            <SlidersHorizontal class="w-4 h-4" />
            Filtres
          </button>
          <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-sm z-50">
            <li>
              <div class="dropdown dropdown-right">
                <button tabindex="0" class="btn btn-outline btn-sm rounded-full flex items-center gap-2 min-w-max w-full">
                  Trier par
                  <ChevronRight class="w-3 h-3" />
                </button>
                <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-sm">
                  <li v-for="sortOption in sortOptions" :key="sortOption.value">
                    <a @click="applySort(sortOption.value)">
                      <input 
                        type="checkbox" 
                        :checked="filters.sort === sortOption.value" 
                        class="checkbox checkbox-xs mr-2" 
                      />
                      {{ sortOption.label }}
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div class="dropdown dropdown-right">
                <button tabindex="0" class="btn btn-outline btn-sm rounded-full flex items-center gap-2 min-w-max w-full">
                  Statut
                  <ChevronRight class="w-3 h-3" />
                </button>
                <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-sm">
                  <li v-for="statusOption in statusOptions" :key="statusOption.value">
                    <a @click="applyStatus(statusOption.value)">
                      <input 
                        type="checkbox" 
                        :checked="filters.status === statusOption.value" 
                        class="checkbox checkbox-xs mr-2" 
                      />
                      {{ statusOption.label }}
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div class="dropdown dropdown-right">
                <button tabindex="0" class="btn btn-outline btn-sm rounded-full flex items-center gap-2 min-w-max w-full">
                  Type d'association
                  <ChevronRight class="w-3 h-3" />
                </button>
                <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-sm">
                  <li v-for="type in availableTypes" :key="type">
                    <a @click="toggleType(type)">
                      <input type="checkbox" :checked="selectedTypes.includes(type)" class="checkbox checkbox-xs mr-2" />
                      {{ type }}
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <div class="dropdown dropdown-right">
                <button tabindex="0" class="btn btn-outline btn-sm rounded-full flex items-center gap-2 min-w-max w-full">
                  Tags
                  <ChevronRight class="w-3 h-3" />
                </button>
                <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-sm">
                  <li v-for="tag in availableTags" :key="tag">
                    <a @click="toggleTag(tag)">
                      <input type="checkbox" :checked="selectedTags.includes(tag)" class="checkbox checkbox-xs mr-2" />
                      {{ tag }}
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li>
              <button @click="showAdvancedFilters = true" class="btn btn-outline btn-sm w-full">
                Filtres avancés
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Carte -->
      <div v-if="showMap" class="w-full mt-4" @click.stop>
        <MultiMarkerMap :locations="locations" :eventsData="eventsData" />
      </div>
    </div>
  </div>

  <!-- Drawer Filtres Avancés Global -->
  <Teleport to="body">
    <div v-if="showAdvancedFilters" class="fixed inset-0 z-50 flex">
      <!-- Overlay -->
      <div 
        class="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
        @click="showAdvancedFilters = false"
      ></div>
      
      <!-- Drawer Content -->
      <div class="fixed right-0 top-0 h-full w-96 bg-base-100 shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div class="flex flex-col h-full">
          <!-- Header -->
          <div class="flex justify-between items-center p-6 border-b border-base-300">
            <h3 class="text-lg font-semibold">Filtres avancés</h3>
            <button @click="showAdvancedFilters = false" class="btn btn-ghost btn-sm">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <div class="space-y-6">
              <!-- Date de l'événement -->
              <div class="card bg-base-200 shadow-sm">
                <div class="card-body p-4">
                  <h4 class="font-medium mb-3">Date de l'événement</h4>
                  <div class="space-y-3">
                    <div>
                      <label class="label">
                        <span class="label-text text-sm">Du:</span>
                      </label>
                      <input type="date" v-model="filters.dateEventFrom" class="input input-bordered input-sm w-full" />
                    </div>
                    <div>
                      <label class="label">
                        <span class="label-text text-sm">Au:</span>
                      </label>
                      <input type="date" v-model="filters.dateEventTo" class="input input-bordered input-sm w-full" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Heure de l'événement -->
              <div class="card bg-base-200 shadow-sm">
                <div class="card-body p-4">
                  <h4 class="font-medium mb-3">Heure de l'événement</h4>
                  <div class="space-y-3">
                    <div>
                      <label class="label">
                        <span class="label-text text-sm">De:</span>
                      </label>
                      <input type="time" v-model="filters.hoursEventFrom" class="input input-bordered input-sm w-full" />
                    </div>
                    <div>
                      <label class="label">
                        <span class="label-text text-sm">À:</span>
                      </label>
                      <input type="time" v-model="filters.hoursEventTo" class="input input-bordered input-sm w-full" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Date de publication -->
              <div class="card bg-base-200 shadow-sm">
                <div class="card-body p-4">
                  <h4 class="font-medium mb-3">Date de publication</h4>
                  <div class="space-y-3">
                    <div>
                      <label class="label">
                        <span class="label-text text-sm">Du:</span>
                      </label>
                      <input type="date" v-model="filters.datePublicationFrom" class="input input-bordered input-sm w-full" />
                    </div>
                    <div>
                      <label class="label">
                        <span class="label-text text-sm">Au:</span>
                      </label>
                      <input type="date" v-model="filters.datePublicationTo" class="input input-bordered input-sm w-full" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Intervalle de publication -->
              <div class="card bg-base-200 shadow-sm">
                <div class="card-body p-4">
                  <h4 class="font-medium mb-3">Intervalle de publication</h4>
                  <select v-model="filters.publicationInterval" class="select select-bordered select-sm w-full">
                    <option value="">Tous</option>
                    <option value="1h">Dernière heure</option>
                    <option value="5h">5 dernières heures</option>
                    <option value="1d">Dernière journée</option>
                    <option value="1w">Dernière semaine</option>
                    <option value="1M">Dernier mois</option>
                  </select>
                </div>
              </div>

              <!-- Localisation -->
              <div class="card bg-base-200 shadow-sm">
                <div class="card-body p-4">
                  <h4 class="font-medium mb-3">Rayon de recherche</h4>
                  <div class="space-y-3">
                    <input type="range" min="1" max="250" v-model.number="filters.radius" class="range range-sm" />
                    <div class="text-sm text-center font-medium">{{ filters.radius }} km</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-6 border-t border-base-300">
            <div class="flex flex-col gap-2">
              <button @click="applyFilters" class="btn btn-primary btn-sm">
                Appliquer les filtres
              </button>
              <button @click="resetFilters" class="btn btn-outline btn-sm">
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, defineEmits } from 'vue'
import { Map, SortAsc, ChevronRight, SlidersHorizontal, X } from 'lucide-vue-next';
import type {Announcement} from "~/common/interface/event.interface";
import type {FilterAnnouncement, AnnouncementStatus, PublicationInterval, SortOption} from "~/common/interface/filter.interface";
import {useUserLocation} from "~/composables/useUserLocation";

const props = defineProps<{
  announcements: Announcement[];
  tags?: string[];
}>()

const emit = defineEmits<{
  (e: 'filter', filters: FilterAnnouncement): void;
  (e: 'type', type: string): void;
  (e: 'map'): void;
}>()

// Map related
const showMap = ref(false)

const locations = computed(() => {
  return props.announcements
    .filter(announcement => announcement.locationAnnouncement)
    .map(announcement => announcement.locationAnnouncement!)
})

const eventsData = computed(() => {
  return props.announcements
    .filter(announcement => announcement.locationAnnouncement)
    .map(announcement => ({
      name: announcement.nameEvent,
      description: announcement.description,
      date: announcement.dateEvent,
      location: announcement.addressAnnouncement?.city || 'Localisation inconnue',
      coordinates: announcement.locationAnnouncement!.coordinates,
      id: announcement._id
    }))
})

// Filter related
const showAdvancedFilters = ref(false)
const selectedTags = ref<string[]>([])
const selectedTypes = ref<string[]>([])
const userLocation = useUserLocation()

const currentLocation = computed(async () => await userLocation.getUserLocation())
let currentLatitude = ref<number | undefined>(undefined)
let currentLongitude = ref<number | undefined>(undefined)
// init latitude and longitude from user location
const initLocation = async () => {
  const location = await currentLocation.value
  if (location) {
    currentLatitude.value = location.latitude
    currentLongitude.value = location.longitude
    filters.value.latitude = currentLatitude.value
    filters.value.longitude = currentLongitude.value
  }
}

// Use props tags if provided, otherwise use default tags
const availableTags = computed(() => {
  return props.tags || ['Urgent', 'Bénévolat', 'Formation', 'Événement', 'Collecte', 'Sensibilisation']
})

const availableTypes = ref(['Humanitaire', 'Environnement', 'Sport', 'Culture', 'Éducation', 'Santé'])

const sortOptions = ref([
  { value: 'dateEvent_asc' as SortOption, label: 'Date d\'événement (croissant)' },
  { value: 'dateEvent_desc' as SortOption, label: 'Date d\'événement (décroissant)' },
  { value: 'datePublication_desc' as SortOption, label: 'Date de publication (récent)' }
])

const statusOptions = ref([
  { value: 'ACTIVE' as AnnouncementStatus, label: 'Actif' },
  { value: 'COMPLETED' as AnnouncementStatus, label: 'Terminé' }
])

const filters = ref<FilterAnnouncement>({
  status: undefined,
  hoursEventFrom: undefined,
  hoursEventTo: undefined,
  dateEventFrom: undefined,
  dateEventTo: undefined,
  publicationInterval: undefined,
  datePublicationFrom: undefined,
  datePublicationTo: undefined,
  tags: [],
  latitude: currentLatitude.value,
  longitude: currentLongitude.value,
  radius: 0,
  page: 1,
  limit: 9,
  sort: undefined
})

// Computed properties
const hasActiveFilters = computed(() => {
  return filters.value.status || 
         filters.value.sort || 
         selectedTags.value.length > 0 ||
         selectedTypes.value.length > 0 ||
         filters.value.dateEventFrom || 
         filters.value.dateEventTo ||
         filters.value.hoursEventFrom || 
         filters.value.hoursEventTo ||
         filters.value.datePublicationFrom || 
         filters.value.datePublicationTo ||
         filters.value.publicationInterval ||
         (filters.value.radius)
})

const hasAdvancedFilters = computed(() => {
  return filters.value.dateEventFrom || 
         filters.value.dateEventTo ||
         filters.value.hoursEventFrom || 
         filters.value.hoursEventTo ||
         filters.value.datePublicationFrom || 
         filters.value.datePublicationTo ||
         filters.value.publicationInterval ||
         (filters.value.radius)
})

// Helper functions
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

// Methods
const toggleMap = () => {
  showMap.value = !showMap.value
  emit('map')
}

const toggleTag = (tag: string) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag)
  } else {
    selectedTags.value.push(tag)
  }
  updateFilters()
}

const toggleType = (type: string) => {
  if (selectedTypes.value.includes(type)) {
    selectedTypes.value = selectedTypes.value.filter(t => t !== type)
  } else {
    selectedTypes.value.push(type)
  }
  updateFilters()
}

const updateFilters = () => {
  // Combine tags and types for the API
  const allTags = [...selectedTags.value, ...selectedTypes.value]
  filters.value.tags = allTags.length > 0 ? allTags : undefined
  applyFilters()
}

const applySort = (sort: SortOption) => {
  filters.value.sort = sort
  applyFilters()
}

const applyStatus = (status: AnnouncementStatus) => {
  filters.value.status = status
  applyFilters()
}

// Remove filter methods
const removeStatus = () => {
  filters.value.status = undefined
  applyFilters()
}

const removeSort = () => {
  filters.value.sort = undefined
  applyFilters()
}

const removeTag = (tag: string) => {
  selectedTags.value = selectedTags.value.filter(t => t !== tag)
  updateFilters()
}

const removeType = (type: string) => {
  selectedTypes.value = selectedTypes.value.filter(t => t !== type)
  updateFilters()
}

const removeDateEvent = () => {
  filters.value.dateEventFrom = undefined
  filters.value.dateEventTo = undefined
  applyFilters()
}

const removeHoursEvent = () => {
  filters.value.hoursEventFrom = undefined
  filters.value.hoursEventTo = undefined
  applyFilters()
}

const removeDatePublication = () => {
  filters.value.datePublicationFrom = undefined
  filters.value.datePublicationTo = undefined
  applyFilters()
}

const removePublicationInterval = () => {
  filters.value.publicationInterval = undefined
  applyFilters()
}

const removeRadius = () => {
  filters.value.radius = 0
  applyFilters()
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
    latitude: currentLatitude.value,
    longitude: currentLongitude.value,
    radius: 0,
    page: 1,
    limit: 9,
    sort: undefined
  }
  selectedTags.value = []
  selectedTypes.value = []
  applyFilters()
}

const applyFilters = () => {
  // Log selected filters to console
  showAdvancedFilters.value = false
  
  // Convert radius from kilometers to meters before sending to backend
  const filtersToSend = { ...filters.value }
  if (filtersToSend.radius && filtersToSend.radius > 0) {
    filtersToSend.radius = filtersToSend.radius * 1000 // Convert km to meters
  }
  
  emit('filter', filtersToSend)
}

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.multi-marker-map-container') && !target.closest('button')) {
    showMap.value = false
  }
}
onMounted(async () => {
  await initLocation()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.flex::-webkit-scrollbar {
  display: none;
}

/* Animation pour les boutons actifs */
.btn {
  transition: all 0.2s ease-in-out;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style> 
