<template>
  <div ref="dropdownRef" class="relative location-dropdown-container">
    <!-- Bouton principal -->
    <button
        @click="toggleLocationDropdown"
        :class="[
    'btn btn-sm rounded-full flex items-center justify-center gap-1 basis-1/3',
    hasLocationFilter ? 'btn-success' : 'btn-outline'
  ]"
    >
      <MapPin class="w-4 h-4" />
      <span class="text-sm">Lieu</span>
    </button>

    <!-- Desktop Dropdown -->
    <div 
      v-if="showLocationDropdown"
      class="absolute top-full left-0 mt-2 p-6 shadow-lg bg-base-100 rounded-box w-96 z-50"
      :class="[isMobile ? 'absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-base-100 rounded-box shadow-xl border border-base-300 z-50'
              : 'absolute top-full left-0 mt-2 p-6 shadow-lg bg-base-100 rounded-box w-96 z-50']"
    >
      <!-- Search Input -->
      <div class="p-6 space-y-4">
        <!-- Search Input -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Rechercher une ville</span>
          </label>
          <div class="relative">
            <MapPin class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
            <input
                type="text"
                v-model="locationSearch"
                placeholder="Rechercher une ville..."
                class="input input-bordered w-full pl-10"
                @input="searchLocation"
            />
          </div>
        </div>

        <!-- Search Results -->
        <div v-if="locationSearchResults.length" class="form-control">
          <label class="label">
            <span class="label-text font-medium">Résultats</span>
          </label>
          <div class="border border-base-300 rounded-lg overflow-hidden max-h-32 overflow-y-auto location-search-results">
            <div class="space-y-0">
              <div
                  v-for="result in locationSearchResults"
                  :key="result.place_id"
                  @click="selectLocation(result)"
                  class="p-3 hover:bg-base-200 cursor-pointer border-b border-base-200 last:border-b-0 flex items-center justify-between search-result-item"
                  data-search-result
              >
                <span class="font-medium text-sm">{{ formatCityName(result) }}</span>
                <ChevronRight class="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Locations -->
        <div v-if="selectedLocations.length" class="form-control">
          <label class="label">
            <span class="label-text font-medium">Villes sélectionnées</span>
          </label>
          <div v-if="selectedLocations.length > 1" class="alert alert-info alert-sm mb-2">
            <div class="text-xs">
              <strong>Note:</strong> Seule la première ville est prise en compte.
            </div>
          </div>
          <div class="space-y-2 selected-locations">
            <div
                v-for="(loc, index) in selectedLocations"
                :key="loc.place_id"
                @click="makeActive(index)"
                class="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center justify-between cursor-pointer"
                :class="{ 'ring-2 ring-primary': isCityActive(index) }"
            >
              <span class="font-medium text-sm">
                {{ formatCityName(loc) }}
                <span v-if="isCityActive(index)" class="text-primary ml-1">(active)</span>
              </span>
              <button @click="removeLocation(index)" class="btn btn-ghost btn-xs">
                <X class="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <!-- Current Location -->
        <div v-if="userCurrentLocation" class="form-control">
          <label class="label">
            <span class="label-text font-medium">Ma position</span>
          </label>
          <div class="card bg-base-200">
            <div class="card-body p-3">
              <div class="flex items-center gap-3">
                <input
                    type="radio"
                    name="location-type-mobile"
                    :checked="useCurrentLocation"
                    @change="toggleCurrentLocation"
                    class="radio radio-primary radio-sm"
                />
                <div class="flex-1">
                  <div class="font-medium text-sm">Ma position actuelle</div>
                  <div class="text-xs text-base-content/70">{{ userCurrentLocation.city || 'Position détectée' }}</div>
                </div>
                <MapPin class="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>
        </div>

        <!-- Permission Alert -->
        <div v-if="!canUseLocation" class="alert alert-warning alert-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h4 class="font-bold">Géolocalisation désactivée</h4>
            <p class="text-xs">Acceptez les cookies de personnalisation pour utiliser votre position.</p>
            <button @click="openCookieSettings" class="btn btn-primary btn-xs mt-2">
              Paramétrer les cookies
            </button>
          </div>
        </div>

        <!-- Radius Slider -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Rayon de recherche</span>
          </label>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm">Dans un rayon de</span>
              <span class="text-sm font-medium">{{ locationRadius }} km</span>
            </div>
            <input
                type="range"
                min="0"
                max="200"
                v-model.number="locationRadius"
                class="range range-sm range-primary w-full"
                @input="updateLocationFilter"
            />
            <div class="flex justify-between text-xs text-base-content/50">
              <span>0 km</span>
              <span>200 km</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 pt-2">
          <button @click="onClear" class="btn btn-outline btn-sm flex-1">
            Effacer
          </button>
          <button @click="onApply" class="btn btn-primary btn-sm flex-1">
            Valider
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { MapPin, ChevronRight, X } from 'lucide-vue-next';
import { useUserLocation } from '~/composables/useUserLocation';
import type { FilterAnnouncement } from '~/common/interface/filter.interface';

const props = defineProps<{
  filters: FilterAnnouncement;
  resetLocation?: boolean;
  isMobile?: boolean;
}>();
const emits = defineEmits<{ (e: 'update:filters', newFilters: FilterAnnouncement): void }>();

watch(
  () => props.resetLocation,
  (newVal) => {
    if (newVal) {
      onClear();
    }
  },
  { immediate: true }
)

const dropdownRef = ref<HTMLElement | null>(null);
const showLocationDropdown = ref(false);
const locationSearch = ref('');
const locationSearchResults = ref<any[]>([]);
const selectedLocations = ref<any[]>([]);
const useCurrentLocation = ref(false);
const locationRadius = ref(props.filters.radius || 5);

const userLocation = useUserLocation();
const userCurrentLocation = ref<any>(null);
const currentLatitude = ref<number>();
const currentLongitude = ref<number>();
const canUseLocation = ref(false);

const hasLocationFilter = computed(
    () => useCurrentLocation.value || selectedLocations.value.length > 0
);

const activeCity = computed(() => useCurrentLocation.value ? null : selectedLocations.value[0]);
const isCityActive = (index: number) => !useCurrentLocation.value && index === 0;

const onClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    // Ne pas fermer si on clique sur les résultats de recherche ou les éléments du dropdown
    const target = e.target as HTMLElement;
    const isSearchResult = target.closest('.search-results') || 
                          target.closest('[data-search-result]') ||
                          target.closest('.location-search-results') ||
                          target.closest('.selected-locations') ||
                          target.closest('.location-dropdown-container');
    
    if (!isSearchResult) {
      showLocationDropdown.value = false;
    }
  }
};

const toggleLocationDropdown = () => {
  showLocationDropdown.value = !showLocationDropdown.value;
};

const openCookieSettings = () => {
  window.dispatchEvent(new CustomEvent('openCookieSettings'));
};

// Vérifier les permissions de géolocalisation
const checkLocationPermissions = async () => {
  try {
    const { usePermissions } = await import('~/composables/usePermissions');
    const { hasPermission, loadCookiePreferences } = usePermissions();
    
    // S'assurer que les préférences sont chargées
    loadCookiePreferences();
    
    canUseLocation.value = hasPermission('canUseLocation');

    if (!canUseLocation.value) {
      console.log('Cookies de personnalisation non acceptés - géolocalisation désactivée');
    }
  } catch (err) {
    console.warn('Impossible de vérifier les permissions de géolocalisation:', err);
    canUseLocation.value = false;
  }
};

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
    } else {
      console.log('Aucune position obtenue');
    }

  } catch (error) {
    console.error('Error getting user location:', error)
  }
}

onMounted(async () => {
  await userLocation.initializeLocation()
  
  await checkLocationPermissions()
  
  await initLocation()
  
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside);
  if (searchTimeout.value) clearTimeout(searchTimeout.value);
});

const formatCityName = (result: any) => {
  const addr = result.address || {};
  return (
      addr.city || addr.town || addr.village || addr.municipality ||
      result.display_name.split(',')[0].trim()
  );
};

const searchTimeout = ref<number | null>(null);
const searchLocation = () => {
  if (locationSearch.value.length < 2) {
    locationSearchResults.value = [];
    return;
  }
  if (searchTimeout.value) clearTimeout(searchTimeout.value);
  searchTimeout.value = window.setTimeout(async () => {
    try {
      const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              locationSearch.value
          )}&countrycodes=fr&limit=10&addressdetails=1`
      );
      const data = await res.json();
      
      // Améliorer le filtrage pour inclure plus de types de lieux
      locationSearchResults.value = data
          .filter((i: any) => {
            // Inclure les villes, villages, municipalités
            const validTypes = ['city', 'town', 'village', 'municipality', 'administrative'];
            const hasValidType = validTypes.includes(i.type);
            
            // Ou avoir une adresse avec une ville
            const hasCityAddress = i.address && (
              i.address.city || 
              i.address.town || 
              i.address.village || 
              i.address.municipality
            );
            
            // Ou être un lieu administratif de niveau ville
            const isCityLevel = i.place_rank && i.place_rank <= 16;
            
            return hasValidType || hasCityAddress || isCityLevel;
          })
          .slice(0, 5);
    } catch (error) {
      console.error('Erreur lors de la recherche de villes:', error);
      locationSearchResults.value = [];
    }
  }, 500);
};

const selectLocation = (loc: any) => {
  if (!selectedLocations.value.some(l => l.place_id === loc.place_id)) {
    selectedLocations.value.push(loc);
  }
  useCurrentLocation.value = false;
  locationSearch.value = '';
  locationSearchResults.value = [];
  // Ne pas fermer le dropdown ici - laisser l'utilisateur voir les villes sélectionnées
};

const makeActive = (i: number) => {
  useCurrentLocation.value = false;
  if (i !== 0) selectedLocations.value.unshift(selectedLocations.value.splice(i, 1)[0]);
};

const removeLocation = (i: number) => selectedLocations.value.splice(i, 1);
const toggleCurrentLocation = () => (useCurrentLocation.value = !useCurrentLocation.value);

const updateLocationFilter = () => {
  const filterAnnouncement: FilterAnnouncement = { ...props.filters, latitude: undefined, longitude: undefined, radius: 0 };
  if (useCurrentLocation.value && currentLatitude.value != null && currentLongitude.value != null) {
    filterAnnouncement.latitude = currentLatitude.value;
    filterAnnouncement.longitude = currentLongitude.value;
    filterAnnouncement.radius = locationRadius.value;
  } else if (selectedLocations.value.length) {
    const l = selectedLocations.value[0];
    filterAnnouncement.latitude = parseFloat(l.lat);
    filterAnnouncement.longitude = parseFloat(l.lon);
    filterAnnouncement.radius = locationRadius.value;
  }
  emits('update:filters', filterAnnouncement);
};

watch([useCurrentLocation, selectedLocations, locationRadius], updateLocationFilter);

const onApply = () => {
  updateLocationFilter();
  showLocationDropdown.value = false;
};

const onClear = () => {
  selectedLocations.value = [];
  useCurrentLocation.value = false;
  locationRadius.value = props.filters.radius || 5;
  updateLocationFilter();
  showLocationDropdown.value = false;
};
</script>

<style scoped>
/* Ajoutez ici vos styles spécifiques, si besoin */
</style>
