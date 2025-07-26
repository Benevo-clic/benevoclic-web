<template>
  <div>
<!--    <div v-if="showHistory && filterHistory.length && !hasActiveFilters" class="w-full mt-6 mb-4">-->
<!--      <div class="text-lg font-bold mb-4">Recherches récentes</div>-->
<!--      <div class="flex gap-4 overflow-x-auto pb-2">-->
<!--        <div-->
<!--            v-for="(h, idx) in filterHistory"-->
<!--            :key="'history-' + idx"-->
<!--            class="rounded-xl border border-base-200 bg-base-100 p-4 min-w-[220px] shadow flex flex-col relative flex-shrink-0 cursor-pointer hover:shadow-lg transition-shadow"-->
<!--            @click="applyHistory(idx)"-->
<!--        >-->
<!--          <button-->
<!--              class="absolute top-2 right-2 btn btn-xs btn-ghost z-10"-->
<!--              @click.stop="removeHistory(idx)"-->
<!--              aria-label="Supprimer cette recherche"-->
<!--          >-->
<!--            <X class="w-4 h-4" />-->
<!--          </button>-->
<!--          <div class="font-bold text-base mb-1 truncate">-->
<!--            {{ filterTitle(h) }}-->
<!--          </div>-->
<!--          <div class="text-xs text-base-content/70 mb-2">Critères</div>-->
<!--          <div class="flex items-center gap-1 text-xs text-base-content/80">-->
<!--            <span>-->
<!--              {{ getFilterCriteria(h) }}-->
<!--            </span>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
    <div>
      <!-- Conteneur principal des filtres -->
      <div class="w-full">
        <FilterActive
            :has-active-filters="Boolean(hasActiveFilters)"
            :filters="filters as any"
            :selected-tags="selectedTags"
            :selected-types="selectedTypes"
            @date-event="removeDateEvent"
            @hours-event="removeHoursEvent"
            @date-publication="removeDatePublication"
            @publication-interval="removePublicationInterval"
            @radius="removeRadius"
            @status="removeStatus"
            @sort="removeSort"
            @tag="removeTag"
            @type="removeType"
            @reset-filters="resetFilters"
        />

        <!-- Boutons de filtres -->
        <div class="w-full">
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
                  <a @click.stop="applySort(sortOption.value)">
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
                  <a @click.stop="applyStatus(statusOption.value)">
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
            <div class="relative inline-block text-left">
              <button
                  @click="toggleDropdown"
                  class="btn btn-sm rounded-full flex items-center gap-2 min-w-max transition-all duration-200"
                  :class="selectedTags.length > 0 ? 'btn-accent' : 'btn-outline'"
              >
                <span>Type d'annonce</span>
                <ChevronRight class="w-3 h-3" />
              </button>

              <div
                  v-if="isOpen"
                  class="absolute mt-2 w-56 rounded-md shadow-lg bg-base-100 z-50"
                  @click.stop
              >
                <ul class="menu p-2 text-sm">
                  <li v-for="tag in availableTags" :key="tag">
                    <a @click.stop="toggleTag(tag)">
                      <input type="checkbox" :checked="selectedTags.includes(tag)" class="checkbox checkbox-xs mr-2" />
                      {{ tag }}
                    </a>
                  </li>
                  <li v-if="!showCustomInput">
                    <button @click.stop="openCustomInput" class="text-primary font-semibold cursor-pointer">
                      <span>Autre</span>
                    </button>
                  </li>
                  <li v-else>
                    <div class="flex items-center gap-2 mt-2">
                      <input
                          v-model="customTag"
                          @keydown.enter.prevent="addCustomTag"
                          type="text"
                          class="input input-sm input-bordered w-full"
                          placeholder="Nouveau type…"
                          ref="customInputRef"
                      />
                      <button class="btn btn-sm btn-ghost" @click="cancelCustomInput" title="Annuler">✕</button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <LocationButton
                :filters="filters"
                @update:filters="onFilterUpdate"
                :reset-location="resetLocation"
            />
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
          <div class="flex md:hidden gap-2 w-full">
            <button
                :class="[
      'btn btn-sm rounded-full flex items-center gap-1 justify-center basis-1/3',
      showMap ? 'btn-primary' : 'btn-outline'
    ]"
                @click="toggleMap"
            >
              <Map class="w-4 h-4" />
              <span class="text-sm">Carte</span>
            </button>

            <LocationButton
                :filters="filters"
                @update:filters="onFilterUpdate"
                :reset-location="resetLocation"
                :is-mobile="true"
            />

            <button
                class="btn btn-sm btn-outline rounded-full flex items-center gap-1 justify-center basis-1/3"
                @click="openMobileFilters"
            >
              <SlidersHorizontal class="w-4 h-4" />
              <span class="text-sm">Filtres</span>
            </button>
          </div>

        </div>

        <!-- Drawer Mobile -->
        <div v-if="mobileFiltersOpen" class="fixed inset-0 z-50 md:hidden">
          <!-- Overlay -->
          <div class="absolute inset-0 bg-black/50" @click="closeMobileFilters"></div>

          <!-- Drawer -->
          <div class="absolute right-0 top-0 h-full w-80 bg-base-100 shadow-xl p-4 overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-bold">Filtres</h3>
              <button @click="closeMobileFilters" class="btn btn-ghost btn-sm">
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Contenu du drawer -->
            <div class="space-y-6">
              <!-- Trier par -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Trier par</span>
                </label>
                <div class="relative">
                  <button
                    :class="[
                      'group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-left',
                      showSortMenu ? 'bg-primary/20 text-primary border-l-4 border-primary shadow-sm' : 'hover:bg-base-200 hover:shadow-sm'
                    ]"
                    @click="toggleSortMenu"
                  >
                    <div class="p-2 rounded-lg bg-base-200 group-hover:bg-base-300 transition-colors">
                      <SortAsc class="w-4 h-4" />
                    </div>
                    <span class="font-medium">
                      {{ getSortLabel() }}
                    </span>
                  </button>
                  <!-- Dropdown Sort -->
                  <div v-if="showSortMenu" class="absolute left-0 mt-2 z-20 bg-base-100 rounded-xl shadow-lg border border-base-300 min-w-48">
                    <div class="p-2 space-y-1">
                      <button
                        v-for="sortOption in sortOptions"
                        :key="sortOption.value"
                        :class="[
                          'flex items-center gap-3 p-2 rounded-lg w-full text-left transition-colors',
                          filters.sort === sortOption.value ? 'bg-primary/20 text-primary' : 'hover:bg-base-200'
                        ]"
                        @click="applySort(sortOption.value); showSortMenu = false"
                      >
                        <input
                          type="radio"
                          :checked="filters.sort === sortOption.value"
                          class="radio radio-sm radio-primary"
                        />
                        <span class="text-sm">{{ sortOption.label }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Statut -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Statut</span>
                </label>
                <div class="relative">
                  <button
                    :class="[
                      'group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-left',
                      showStatusMenu ? 'bg-primary/20 text-primary border-l-4 border-primary shadow-sm' : 'hover:bg-base-200 hover:shadow-sm'
                    ]"
                    @click="toggleStatusMenu"
                  >
                    <div class="p-2 rounded-lg bg-base-200 group-hover:bg-base-300 transition-colors">
                      <CircleDot class="w-4 h-4" />
                    </div>
                    <span class="font-medium">
                      {{ getStatusLabel() }}
                    </span>
                  </button>
                  <!-- Dropdown Status -->
                  <div v-if="showStatusMenu" class="absolute left-0 mt-2 z-20 bg-base-100 rounded-xl shadow-lg border border-base-300 min-w-48">
                    <div class="p-2 space-y-1">
                      <button
                        v-for="statusOption in statusOptions"
                        :key="statusOption.value"
                        :class="[
                          'flex items-center gap-3 p-2 rounded-lg w-full text-left transition-colors',
                          filters.status === statusOption.value ? 'bg-primary/20 text-primary' : 'hover:bg-base-200'
                        ]"
                        @click="applyStatus(statusOption.value); showStatusMenu = false"
                      >
                        <input
                          type="radio"
                          :checked="filters.status === statusOption.value"
                          class="radio radio-sm radio-primary"
                        />
                        <span class="text-sm">{{ statusOption.label }}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Type d'annonce -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Type d'annonce</span>
                </label>
                <div class="relative">
                  <button
                    :class="[
                      'group flex items-center gap-3 p-3 rounded-xl transition-all duration-200 w-full text-left',
                      showTagsMenu ? 'bg-primary/20 text-primary border-l-4 border-primary shadow-sm' : 'hover:bg-base-200 hover:shadow-sm'
                    ]"
                    @click="toggleTagsMenu"
                  >
                    <div class="p-2 rounded-lg bg-base-200 group-hover:bg-base-300 transition-colors">
                      <Tag class="w-4 h-4" />
                    </div>
                    <span class="font-medium">
                      {{ getTagsLabel() }}
                    </span>
                  </button>
                  <!-- Dropdown Tags -->
                  <div v-if="showTagsMenu" class="absolute left-0 mt-2 z-20 bg-base-100 rounded-xl shadow-lg border border-base-300 min-w-48 max-h-64 overflow-y-auto">
                    <div class="p-2 space-y-1">
                      <button
                        v-for="tag in availableTags"
                        :key="tag"
                        :class="[
                          'flex items-center gap-3 p-2 rounded-lg w-full text-left transition-colors',
                          selectedTags.includes(tag) ? 'bg-primary/20 text-primary' : 'hover:bg-base-200'
                        ]"
                        @click="toggleTag(tag)"
                      >
                        <input
                          type="checkbox"
                          :checked="selectedTags.includes(tag)"
                          class="checkbox checkbox-sm checkbox-primary"
                        />
                        <span class="text-sm">{{ tag }}</span>
                      </button>

                      <!-- Ajout de tag personnalisé -->
                      <div class="border-t border-base-300 pt-2 mt-2">
                        <div v-if="!showCustomInput">
                          <button
                            @click="openCustomInput"
                            class="flex items-center gap-3 p-2 rounded-lg w-full text-left text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Plus class="w-4 h-4" />
                            <span class="text-sm font-medium">Ajouter un type...</span>
                          </button>
                        </div>
                        <div v-else class="flex items-center gap-2 p-2">
                          <input
                            v-model="customTag"
                            @keydown.enter.prevent="addCustomTag"
                            type="text"
                            class="input input-sm input-bordered flex-1"
                            placeholder="Nouveau type…"
                            ref="customInputRef"
                          />
                          <button class="btn btn-sm btn-primary" @click="addCustomTag">+</button>
                          <button class="btn btn-sm btn-ghost" @click="cancelCustomInput">✕</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <!-- Filtres avancés -->
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-medium">Filtres avancés</span>
                </label>
                <button
                  @click="showAdvancedFilters = true; closeMobileFilters()"
                  class="btn btn-outline w-full"
                >
                  <SlidersHorizontal class="w-4 h-4 mr-2" />
                  Configurer les filtres avancés
                </button>
              </div>

              <!-- Actions -->
              <div class="flex gap-2 pt-4 border-t border-base-300">
                <button 
                  @click="resetFilters" 
                  class="btn btn-ghost flex-1"
                >
                  Réinitialiser
                </button>
                <button 
                  @click="closeMobileFilters" 
                  class="btn btn-primary flex-1"
                >
                  Appliquer
                </button>
              </div>
            </div>
          </div>
        </div>

          <!-- Carte -->
          <div v-if="showMap" class="w-full mt-4" @click.stop>
            <MultiMarkerMap :locations="locations" :eventsData="eventsData" />
          </div>
        </div>

      <!-- Drawer Filtres Avancés Global -->
      <AdvancedFilters
          :show-advanced-filters="showAdvancedFilters"
          :filters="tempAdvancedFilters"
          @apply-filters="applyFiltersAdvanced"
          @reset-filters="resetFilters"
          @close-filters="closeAdvancedFilters"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, defineEmits, watch, nextTick } from 'vue'
import { Map, SortAsc, ChevronRight, SlidersHorizontal, CircleDot, Tag, Plus, X } from 'lucide-vue-next';
import type {Announcement} from "~/common/interface/event.interface";
import type {FilterAnnouncement, AnnouncementStatus, SortOption} from "~/common/interface/filter.interface";
import {useUserLocation} from "~/composables/useUserLocation";
import FilterActive from "~/components/event/volunteer/utils/FilterActive.vue";
import AdvancedFilters from "~/components/event/volunteer/utils/AdvancedFilters.vue";
import LocationButton from "~/components/event/volunteer/utils/LocationButton.vue";

const props = defineProps<{
  announcements: Announcement[];
  tags?: string[];
}>()

const emit = defineEmits<{
  (e: 'filter', filters: FilterAnnouncement): void;
  (e: 'type', type: string): void;
  (e: 'map'): void;
}>()

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
const announcement = useAnnouncement()

const isOpen = ref(false)
const searchTimeout = ref<NodeJS.Timeout | null>(null)
const userCurrentLocation = ref<any>(null)
const currentLatitude = ref<number | undefined>(undefined)
const currentLongitude = ref<number | undefined>(undefined)
const resetLocation = ref(false)


let currentFilterSearch = ref<FilterAnnouncement>();

watch(
    () => announcement.getCurrentFilter.value,
    async (newFilter) => {
      currentFilterSearch.value = {
        ...newFilter,
      };
    }
)

const tempAdvancedFilters = ref<Partial<FilterAnnouncement>>({
  dateEventFrom: undefined,
  dateEventTo: undefined,
  hoursEventFrom: undefined,
  hoursEventTo: undefined,
  datePublicationFrom: undefined,
  datePublicationTo: undefined,
  publicationInterval: undefined
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      customInputRef.value?.focus()
    })
  }
}
const initLocation = async () => {
  try {
    const location = await userLocation.getUserLocation()
    if (location) {
      currentLatitude.value = location.latitude
      currentLongitude.value = location.longitude
      userCurrentLocation.value = {
        place_id: 'current_location',
        display_name: 'Ma position actuelle',
        city: location.city || 'Position détectée',
        lat: location.latitude.toString(),
        lon: location.longitude.toString()
      }
      resetLocation.value = true;
    }

  } catch (error) {
    console.error('Error getting user location:', error)
  }
}

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

watch(filters, (newFilters) => {
  tempAdvancedFilters.value = {
    dateEventFrom: newFilters.dateEventFrom,
    dateEventTo: newFilters.dateEventTo,
    hoursEventFrom: newFilters.hoursEventFrom,
    hoursEventTo: newFilters.hoursEventTo,
    datePublicationFrom: newFilters.datePublicationFrom,
    datePublicationTo: newFilters.datePublicationTo,
    publicationInterval: newFilters.publicationInterval
  }
}, { deep: true, immediate: true })


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
      filters.value.publicationInterval
})

const showLocationDropdown = ref(false)
const mobileFiltersOpen = ref(false)

const customTag = ref('')
const showCustomInput = ref(false)
const customInputRef = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')

function openMobileFilters() {
  mobileFiltersOpen.value = true
}

function closeMobileFilters() {
  mobileFiltersOpen.value = false
}

function addCustomTag() {
  const tag = customTag.value.trim()
  if (!tag) return
  if (!availableTags.value.includes(tag)) {
    availableTags.value.push(tag)
  }
  if (!selectedTags.value.includes(tag)) {
    selectedTags.value.push(tag)
  }
  customTag.value = ''
  showCustomInput.value = false
  updateFilters()
}

function cancelCustomInput() {
  customTag.value = ''
  showCustomInput.value = false
}

function openCustomInput() {
  console.log('showCustomInput', showCustomInput.value)
  showCustomInput.value = true
}

watch(showCustomInput, (val) => {
  if (val) nextTick(() => customInputRef.value && customInputRef.value?.focus())
})

// Watcher pour la recherche
watch(searchQuery, (newQuery) => {
  if (newQuery !== undefined) {
  }
})


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

function onFilterUpdate(newFilters: FilterAnnouncement) {
  filters.value = newFilters
  resetLocation.value = false
  updateFilters()
}

const updateFilters = () => {
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

const closeAdvancedFilters = () => {
  showAdvancedFilters.value = false
}

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
  resetLocation.value = true
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

  tempAdvancedFilters.value = {
    dateEventFrom: undefined,
    dateEventTo: undefined,
    hoursEventFrom: undefined,
    hoursEventTo: undefined,
    datePublicationFrom: undefined,
    datePublicationTo: undefined,
    publicationInterval: undefined
  }

  resetLocation.value = true
  applyFilters()
}

const applyFiltersAdvanced = (filtersAdvanced: Partial<FilterAnnouncement>) => {
  filters.value.dateEventFrom = filtersAdvanced.dateEventFrom || filters.value.dateEventFrom
  filters.value.dateEventTo = filtersAdvanced.dateEventTo || filters.value.dateEventTo
  filters.value.hoursEventFrom = filtersAdvanced.hoursEventFrom || filters.value.hoursEventFrom
  filters.value.hoursEventTo = filtersAdvanced.hoursEventTo || filters.value.hoursEventTo
  filters.value.datePublicationFrom = filtersAdvanced.datePublicationFrom || filters.value.datePublicationFrom
  filters.value.datePublicationTo = filtersAdvanced.datePublicationTo || filters.value.datePublicationTo
  filters.value.publicationInterval = filtersAdvanced.publicationInterval || filters.value.publicationInterval

  tempAdvancedFilters.value = {
    dateEventFrom: undefined,
    dateEventTo: undefined,
    hoursEventFrom: undefined,
    hoursEventTo: undefined,
    datePublicationFrom: undefined,
    datePublicationTo: undefined,
    publicationInterval: undefined
  }

  applyFilters();
}

const applyFilters = () => {
  const filtersToSend = { ...filters.value }

  delete filtersToSend.cityCoordinates

  if (filtersToSend.radius && filtersToSend.radius > 0) {
    filtersToSend.radius = filtersToSend.radius * 1000
  }
  showAdvancedFilters.value = false
  emit('filter', filtersToSend)
}

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement

  if (!target.closest('.multi-marker-map-container') && !target.closest('button')) {
    showMap.value = false
  }

  if (!target.closest('.location-dropdown-container')) {
    showLocationDropdown.value = false
  }
}

const filterHistory = ref<FilterAnnouncement[]>([])
const showHistory = ref(true)
const FILTER_HISTORY_KEY = 'filterHistory';

watch(filters, (newFilters) => {
  const filterWithoutLocation = {
    ...newFilters,
    latitude: undefined,
    longitude: undefined,
    radius: 0
  };
  const isEmpty = (
    (!filterWithoutLocation.status && !filterWithoutLocation.sort && (!filterWithoutLocation.tags || filterWithoutLocation.tags.length === 0) &&
      !filterWithoutLocation.dateEventFrom && !filterWithoutLocation.dateEventTo && !filterWithoutLocation.hoursEventFrom && !filterWithoutLocation.hoursEventTo &&
      !filterWithoutLocation.datePublicationFrom && !filterWithoutLocation.datePublicationTo && !filterWithoutLocation.publicationInterval &&
      (!filterWithoutLocation.latitude || filterWithoutLocation.radius === 0) &&
        filterWithoutLocation.page === 1 && filterWithoutLocation.limit === 9)
  );

  if (isEmpty) return;

  let criteriaCount = 0;
  if (filterWithoutLocation.status) criteriaCount++;
  if (filterWithoutLocation.sort) criteriaCount++;
  if (filterWithoutLocation.tags && filterWithoutLocation.tags.length > 0) criteriaCount++;
  if (filterWithoutLocation.dateEventFrom || filterWithoutLocation.dateEventTo) criteriaCount++;
  if (filterWithoutLocation.hoursEventFrom || filterWithoutLocation.hoursEventTo) criteriaCount++;
  if (filterWithoutLocation.datePublicationFrom || filterWithoutLocation.datePublicationTo) criteriaCount++;
  if (filterWithoutLocation.publicationInterval) criteriaCount++;

  if (criteriaCount <= 3) return;

  let history: FilterAnnouncement[] = [];
  try {
    history = JSON.parse(localStorage.getItem(FILTER_HISTORY_KEY) || '[]')
  } catch {}

  const isDifferentEnough = history.every(existingFilter => {
    let differences = 0;

    if (filterWithoutLocation.status !== existingFilter.status) differences++;
    if (filterWithoutLocation.sort !== existingFilter.sort) differences++;
    if (JSON.stringify(filterWithoutLocation.tags) !== JSON.stringify(existingFilter.tags)) differences++;
    if (filterWithoutLocation.dateEventFrom !== existingFilter.dateEventFrom) differences++;
    if (filterWithoutLocation.dateEventTo !== existingFilter.dateEventTo) differences++;
    if (filterWithoutLocation.hoursEventFrom !== existingFilter.hoursEventFrom) differences++;
    if (filterWithoutLocation.hoursEventTo !== existingFilter.hoursEventTo) differences++;
    if (filterWithoutLocation.datePublicationFrom !== existingFilter.datePublicationFrom) differences++;
    if (filterWithoutLocation.datePublicationTo !== existingFilter.datePublicationTo) differences++;
    if (filterWithoutLocation.publicationInterval !== existingFilter.publicationInterval) differences++;

    return differences >= 3;
  });

  if (!isDifferentEnough) return;
  if(currentFilterSearch.value){
    filterWithoutLocation.nameEvent = currentFilterSearch.value?.nameEvent
    filterWithoutLocation.description = currentFilterSearch.value?.description;
    filterWithoutLocation.associationName = currentFilterSearch.value?.associationName
  }

  const newHistory = [filterWithoutLocation, ...history.filter(h => JSON.stringify(h) !== JSON.stringify(filterWithoutLocation))]

  filterHistory.value = newHistory.slice(0, 3)
  localStorage.setItem(FILTER_HISTORY_KEY, JSON.stringify(filterHistory.value))
}, { deep: true })

onMounted(async () => {
  await initLocation()
  document.addEventListener('click', handleClickOutside)
  let history: FilterAnnouncement[] = [];
  try {
    history = JSON.parse(localStorage.getItem(FILTER_HISTORY_KEY) || '[]')
  } catch {}
  history = history.filter(h => {
    const isOnlyLocation = (
        !!h.latitude && !!h.longitude &&
        (!h.status && !h.sort && (!h.tags || h.tags.length === 0) &&
            !h.dateEventFrom && !h.dateEventTo && !h.hoursEventFrom && !h.hoursEventTo &&
            !h.datePublicationFrom && !h.datePublicationTo && !h.publicationInterval)
    );
    return !isOnlyLocation;
  });
  if (history.length) {
    filterHistory.value = history.slice(0, 3)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)

  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
})


function applyHistory(idx: number) {
  if (filterHistory.value[idx]) {
    const selectedFilter = filterHistory.value[idx];

    filters.value = { ...selectedFilter };

    if (selectedFilter.tags && selectedFilter.tags.length > 0) {
      const tags = selectedFilter.tags.filter(tag => availableTags.value.includes(tag));
      const types = selectedFilter.tags.filter(type => availableTypes.value.includes(type));
      selectedTags.value = tags;
      selectedTypes.value = types;
    } else {
      selectedTags.value = [];
      selectedTypes.value = [];
    }

    filterHistory.value = [];
    showHistory.value = false;
    localStorage.removeItem(FILTER_HISTORY_KEY);

    console.log('Applying history filter:', filters.value);
    emit('filter', filters.value);
  }
}

function removeHistory(idx: number) {
  filterHistory.value.splice(idx, 1);
  localStorage.setItem(FILTER_HISTORY_KEY, JSON.stringify(filterHistory.value));
  if (filterHistory.value.length === 0) showHistory.value = false;
}

function filterTitle(f: FilterAnnouncement) {
  return (f.nameEvent || f.description || 'Recherche');
}

function getFilterCriteria(filter: FilterAnnouncement) {
  const criteria: string[] = [];

  if (filter.status) {
    criteria.push(filter.status);
  }
  if (filter.sort) {
    const sortLabel = sortOptions.value.find(s => s.value === filter.sort)?.label;
    criteria.push(sortLabel?.split('(')[0].trim() || '');
  }
  if (filter.tags && filter.tags.length > 0) {
    criteria.push(filter.tags.slice(0, 2).join(', '));
  }
  if (filter.dateEventFrom || filter.dateEventTo) {
    const from = filter.dateEventFrom ? new Date(filter.dateEventFrom).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : '';
    const to = filter.dateEventTo ? new Date(filter.dateEventTo).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : '';
    criteria.push(`${from} - ${to}`);
  }
  if (filter.hoursEventFrom || filter.hoursEventTo) {
    const from = filter.hoursEventFrom ? new Date(filter.hoursEventFrom).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';
    const to = filter.hoursEventTo ? new Date(filter.hoursEventTo).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';
    criteria.push(`${from} - ${to}`);
  }
  if (filter.datePublicationFrom || filter.datePublicationTo) {
    const from = filter.datePublicationFrom ? new Date(filter.datePublicationFrom).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : '';
    const to = filter.datePublicationTo ? new Date(filter.datePublicationTo).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : '';
    criteria.push(`${from} - ${to}`);
  }
  if (filter.publicationInterval) {
    criteria.push(filter.publicationInterval);
  }
  if (filter.radius && filter.radius > 0) {
    criteria.push(`${filter.radius} km`);
  }

  return criteria.slice(0, 2).join(' • ');
}

const showSortMenu = ref(false)
const showStatusMenu = ref(false)
const showTagsMenu = ref(false)

const getSortLabel = () => {
  const sortOption = sortOptions.value.find(s => s.value === filters.value.sort)
  return sortOption ? sortOption.label : 'Trier par'
}

const getStatusLabel = () => {
  const statusOption = statusOptions.value.find(s => s.value === filters.value.status)
  return statusOption ? statusOption.label : 'Statut'
}

const getTagsLabel = () => {
  if (selectedTags.value.length === 0) {
    return 'Type d\'annonce';
  }
  if (selectedTags.value.length === 1) {
    return selectedTags.value[0];
  }
  return `${selectedTags.value.length} types`;
}

const toggleSortMenu = () => {
  showSortMenu.value = !showSortMenu.value
}

const toggleStatusMenu = () => {
  showStatusMenu.value = !showStatusMenu.value
}

const toggleTagsMenu = () => {
  showTagsMenu.value = !showTagsMenu.value
}
</script>

<style scoped>
.flex::-webkit-scrollbar {
  display: none;
}

.btn {
  transition: all 0.2s ease-in-out;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style> 
