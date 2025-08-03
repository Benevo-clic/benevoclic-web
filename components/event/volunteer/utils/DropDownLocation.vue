<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { MapPin, ChevronRight, X } from 'lucide-vue-next';
import { useUserLocation } from '~/composables/useUserLocation';
import type { FilterAnnouncement } from '~/common/interface/filter.interface';

const props = defineProps<{
  filters: FilterAnnouncement;
  resetLocation?: boolean;
  isMobile?: boolean;
  dropdownStyle?: Record<string, string>;
  showLocationDropdown?: boolean;
}>();
const emits = defineEmits<{ 
  (e: 'update:filters', newFilters: FilterAnnouncement): void;
  (e: 'close'): void;
}>();

// États réactifs
const locationSearch = ref('');
const locationSearchResults = ref<any[]>([]);
const selectedLocations = ref<any[]>([]);
const useCurrentLocation = ref(false);
const locationRadius = ref(props.filters.radius || 5);

const userLocation = useUserLocation();
const userCurrentLocation = ref<any>(null);
const currentLatitude = ref<number | null>(null);
const currentLongitude = ref<number | null>(null);
const canUseLocation = ref(false);

const searchTimeout = ref<number | null>(null);

// Computed
const hasLocationFilter = computed(
    () => useCurrentLocation.value || selectedLocations.value.length > 0
);
const isCityActive = (index: number) => !useCurrentLocation.value && index === 0;

const dropdownStyle = computed(() => {
  return props.dropdownStyle || {
    position: 'absolute',
    top: '0px',
    left: '0px',
    zIndex: '9999',
    minWidth: '320px',
  };
});

const formatCityName = (result: any) => {
  const addr = result.address || {};
  return (
      addr.city || addr.town || addr.village || addr.municipality ||
      result.display_name?.split(',')[0]?.trim() || ''
  );
};

// Fonctions
const openCookieSettings = () => {
  window.dispatchEvent(new CustomEvent('openCookieSettings'));
};

const checkLocationPermissions = async () => {
  try {
    const { usePermissions } = await import('~/composables/usePermissions');
    const { hasPermission, loadCookiePreferences } = usePermissions();
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
    const location = await userLocation.getUserLocation();
    if (location) {
      currentLatitude.value = location.latitude;
      currentLongitude.value = location.longitude;
      userCurrentLocation.value = {
        place_id: 'current_location',
        display_name: 'Ma position actuelle',
        city: location.city || 'Position détectée',
        lat: location.latitude.toString(),
        lon: location.longitude.toString(),
      };
    } else {
      console.log('Aucune position obtenue');
    }
  } catch (error) {
    console.error('Error getting user location:', error);
  }
};

const debounce = (fn: Function, delay = 300) => {
  return (...args: any[]) => {
    if (searchTimeout.value) clearTimeout(searchTimeout.value);
    searchTimeout.value = window.setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

const performLocationSearch = async () => {
  if (locationSearch.value.length < 2) {
    locationSearchResults.value = [];
    return;
  }
  try {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            locationSearch.value
        )}&countrycodes=fr&limit=10&addressdetails=1`
    );
    const data = await res.json();
    locationSearchResults.value = data
        .filter((i: any) => {
          const validTypes = ['city', 'town', 'village', 'municipality', 'administrative'];
          const hasValidType = validTypes.includes(i.type);
          const hasCityAddress = i.address && (
              i.address.city ||
              i.address.town ||
              i.address.village ||
              i.address.municipality
          );
          const isCityLevel = i.place_rank && i.place_rank <= 16;
          return hasValidType || hasCityAddress || isCityLevel;
        })
        .slice(0, 5);
  } catch (error) {
    console.error('Erreur lors de la recherche de villes:', error);
    locationSearchResults.value = [];
  }
};

const onSearchInput = debounce(() => {
  performLocationSearch();
}, 500);

const selectLocation = (loc: any) => {
  if (!selectedLocations.value.some(l => l.place_id === loc.place_id)) {
    selectedLocations.value.push(loc);
  }
  useCurrentLocation.value = false;
  locationSearch.value = '';
  locationSearchResults.value = [];
};

const makeActive = (i: number) => {
  useCurrentLocation.value = false;
  if (i !== 0) selectedLocations.value.unshift(selectedLocations.value.splice(i, 1)[0]);
};

const removeLocation = (i: number) => {
  selectedLocations.value.splice(i, 1);
};

const toggleCurrentLocation = () => {
  useCurrentLocation.value = !useCurrentLocation.value;
};

function updateLocationFilter() {
  try {
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
  } catch (error) {
    console.error('Erreur lors de la mise à jour du filtre de localisation:', error);
  }
}

const onApply = () => {
  updateLocationFilter();
  emits('close');
};

const onClear = () => {
  selectedLocations.value = [];
  useCurrentLocation.value = false;
  locationRadius.value = props.filters.radius || 5;
  updateLocationFilter();
  emits('close');
};

// Watchers
watch(
    () => props.resetLocation,
    (newVal) => {
      if (newVal) onClear();
    },
    { immediate: true }
);

watch([useCurrentLocation, selectedLocations, locationRadius], updateLocationFilter);

// Lifecycles
onMounted(async () => {
  try {
    await userLocation.initializeLocation();
    await checkLocationPermissions();
    await initLocation();
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la géolocalisation:', error);
  }
});

onUnmounted(() => {
  if (searchTimeout.value) clearTimeout(searchTimeout.value);
});
</script>

<template>
  <div
      v-if="showLocationDropdown"
      ref="portalDropdown"
      :style="dropdownStyle"
      class="location-dropdown-portal p-6 shadow-lg bg-base-100 rounded-box max-w-[95vw] w-96"
      role="dialog"
      aria-modal="true"
  >
    <!-- Contenu -->
    <div class="space-y-4">
      <!-- Recherche de ville -->
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
              @input="onSearchInput"
              aria-label="Recherche de ville"
          />
        </div>
      </div>

      <!-- Résultats -->
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
                role="button"
                tabindex="0"
            >
              <span class="font-medium text-sm">{{ formatCityName(result) }}</span>
              <ChevronRight class="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <!-- Villes sélectionnées -->
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
              role="button"
              tabindex="0"
          >
                <span class="font-medium text-sm">
                  {{ formatCityName(loc) }}
                  <span v-if="isCityActive(index)" class="text-primary ml-1">(active)</span>
                </span>
            <button @click.stop="removeLocation(index)" class="btn btn-ghost btn-xs" aria-label="Supprimer la ville">
              <X class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <!-- Position actuelle -->
      <div v-if="userCurrentLocation" class="form-control">
        <label class="label">
          <span class="label-text font-medium">Ma position</span>
        </label>
        <div class="card bg-base-200">
          <div class="card-body p-3">
            <div class="flex items-center gap-3">
              <input
                  type="radio"
                  name="location-type"
                  :checked="useCurrentLocation"
                  @change="toggleCurrentLocation"
                  class="radio radio-primary radio-sm"
                  aria-label="Utiliser ma position actuelle"
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

      <!-- Permission -->
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

      <!-- Rayon -->
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
              aria-label="Rayon de recherche"
          />
          <div class="flex justify-between text-xs text-base-content/50">
            <span>0 km</span>
            <span>200 km</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
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
</template>

<style scoped>
.location-dropdown-portal {
  /* Renforcer au cas où */
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.2);
  border-radius: 0.75rem;
  background-clip: padding-box;
}
</style>
