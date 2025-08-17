<template>
  <div ref="dropdownRef" class="relative location-dropdown-container inline-block">
    <!-- Bouton principal -->
    <button
      :class="[
        'btn btn-sm rounded-full flex items-center justify-center gap-1 basis-1/3',
        hasLocationFilter ? 'btn-success' : 'btn-outline'
      ]"
      :aria-label="t('locationButton.aria.placeSelector')"
      @click="toggleLocationDropdown"
    >
      <MapPin class="w-4 h-4" />
      <span class="text-sm">{{ t('locationButton.labels.place') }}</span>
    </button>

    <!-- Dropdown téléporté pour être toujours au-dessus -->
    <teleport to="body">
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
              <span class="label-text font-medium">{{
                t('locationButton.labels.searchCity')
              }}</span>
            </label>
            <div class="relative">
              <MapPin
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50"
              />
              <input
                v-model="locationSearch"
                type="text"
                :placeholder="t('locationButton.placeholders.searchCity')"
                class="input input-bordered w-full pl-10"
                :aria-label="t('locationButton.aria.citySearch')"
                @input="onSearchInput"
              />
            </div>
          </div>

          <!-- Résultats -->
          <div v-if="locationSearchResults.length" class="form-control">
            <label class="label">
              <span class="label-text font-medium">{{ t('locationButton.labels.results') }}</span>
            </label>
            <div
              class="border border-base-300 rounded-lg overflow-hidden max-h-32 overflow-y-auto location-search-results"
            >
              <div class="space-y-0">
                <div
                  v-for="result in locationSearchResults"
                  :key="result.place_id"
                  class="p-3 hover:bg-base-200 cursor-pointer border-b border-base-200 last:border-b-0 flex items-center justify-between search-result-item"
                  data-search-result
                  role="button"
                  tabindex="0"
                  @click.prevent.stop="selectLocation(result)"
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
              <span class="label-text font-medium">{{
                t('locationButton.labels.selectedCities')
              }}</span>
            </label>
            <div v-if="selectedLocations.length > 1" class="alert alert-info alert-sm mb-2">
              <div class="text-xs"><strong>Note:</strong> {{ t('locationButton.note') }}</div>
            </div>
            <div class="space-y-2 selected-locations">
              <div
                v-for="(loc, index) in selectedLocations"
                :key="loc.place_id"
                class="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center justify-between cursor-pointer"
                :class="{ 'ring-2 ring-primary': isCityActive(index) }"
                role="button"
                tabindex="0"
                @click="makeActive(index)"
              >
                <span class="font-medium text-sm">
                  {{ formatCityName(loc) }}
                  <span v-if="isCityActive(index)" class="text-primary ml-1">{{
                    t('locationButton.active')
                  }}</span>
                </span>
                <button
                  class="btn btn-ghost btn-xs"
                  :aria-label="t('locationButton.aria.removeCity')"
                  @click.stop="removeLocation(index)"
                >
                  <X class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          <!-- Position actuelle -->
          <div v-if="userCurrentLocation" class="form-control">
            <label class="label">
              <span class="label-text font-medium">{{
                t('locationButton.labels.myPosition')
              }}</span>
            </label>
            <div class="card bg-base-200">
              <div class="card-body p-3">
                <div class="flex items-center gap-3">
                  <input
                    type="radio"
                    name="location-type"
                    :checked="useCurrentLocation"
                    class="radio radio-primary radio-sm"
                    :aria-label="t('locationButton.aria.useCurrentPosition')"
                    @change="toggleCurrentLocation"
                  />
                  <div class="flex-1">
                    <div class="font-medium text-sm">
                      {{ t('locationButton.labels.myCurrentPosition') }}
                    </div>
                    <div class="text-xs text-base-content/70">
                      {{ userCurrentLocation.city || t('locationButton.detectedPosition') }}
                    </div>
                  </div>
                  <MapPin class="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>
          </div>

          <!-- Permission -->
          <div v-if="!canUseLocation" class="alert alert-warning alert-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div>
              <h4 class="font-bold">Géolocalisation désactivée</h4>
              <p class="text-xs">
                Acceptez les cookies de personnalisation pour utiliser votre position.
              </p>
              <button class="btn btn-primary btn-xs mt-2" @click="openCookieSettings">
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
                v-model.number="locationRadius"
                type="range"
                min="0"
                max="200"
                class="range range-sm range-primary w-full"
                aria-label="Rayon de recherche"
                @input="updateLocationFilter"
              />
              <div class="flex justify-between text-xs text-base-content/50">
                <span>0 km</span>
                <span>200 km</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 pt-2">
            <button class="btn btn-outline btn-sm flex-1" @click="onClear">Effacer</button>
            <button class="btn btn-primary btn-sm flex-1" @click="onApply">Valider</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
  import { MapPin, ChevronRight, X } from 'lucide-vue-next'
  import { useUserLocation } from '~/composables/useUserLocation'
  import type { FilterAnnouncement } from '~/common/interface/filter.interface'

  const { t } = useI18n()

  const props = defineProps<{
    filters: FilterAnnouncement
    resetLocation?: boolean
    isMobile?: boolean
  }>()
  const emits = defineEmits<{
    (e: 'update:filters', newFilters: FilterAnnouncement): void
  }>()

  // États réactifs
  const dropdownRef = ref<HTMLElement | null>(null)
  const portalDropdown = ref<HTMLElement | null>(null)
  const showLocationDropdown = ref(false)
  const locationSearch = ref('')
  const locationSearchResults = ref<any[]>([])
  const selectedLocations = ref<any[]>([])
  const useCurrentLocation = ref(false)
  const locationRadius = ref(props.filters.radius || 5)

  const userLocation = useUserLocation()
  const userCurrentLocation = ref<any>(null)
  const currentLatitude = ref<number | null>(null)
  const currentLongitude = ref<number | null>(null)
  const canUseLocation = ref(false)

  const searchTimeout = ref<number | null>(null)

  // Computed
  const hasLocationFilter = computed(
    () => useCurrentLocation.value || selectedLocations.value.length > 0
  )
  const isCityActive = (index: number) => !useCurrentLocation.value && index === 0

  // Styles dynamiques pour le dropdown téléporté
  const dropdownStyle = ref<Record<string, string>>({
    position: 'absolute',
    top: '0px',
    left: '0px',
    zIndex: '9999',
    minWidth: '320px'
  })

  const formatCityName = (result: any) => {
    const addr = result.address || {}
    return (
      addr.city ||
      addr.town ||
      addr.village ||
      addr.municipality ||
      result.display_name?.split(',')[0]?.trim() ||
      ''
    )
  }

  // Watchers
  watch(
    () => props.resetLocation,
    newVal => {
      if (newVal) {
        onClear()
      }
    },
    { immediate: true }
  )

  watch([useCurrentLocation, selectedLocations, locationRadius], updateLocationFilter)

  // Fonctions
  const toggleLocationDropdown = () => {
    showLocationDropdown.value = !showLocationDropdown.value
  }

  const openCookieSettings = () => {
    window.dispatchEvent(new CustomEvent('openCookieSettings'))
  }

  const checkLocationPermissions = async () => {
    try {
      const { usePermissions } = await import('~/composables/usePermissions')
      const { hasPermission, loadCookiePreferences } = usePermissions()
      loadCookiePreferences()
      canUseLocation.value = hasPermission('canUseLocation')
      if (!canUseLocation.value) {
        process.env.NODE_ENV !== 'production' &&
          console.log('Cookies de personnalisation non acceptés - géolocalisation désactivée')
      }
    } catch (err) {
      process.env.NODE_ENV !== 'production' &&
        console.warn('Impossible de vérifier les permissions de géolocalisation:', err)
      canUseLocation.value = false
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
          display_name: t('locationButton.labels.myCurrentPosition'),
          city: location.city || t('locationButton.detectedPosition'),
          lat: location.latitude.toString(),
          lon: location.longitude.toString()
        }
      } else {
        process.env.NODE_ENV !== 'production' && console.log('Aucune position obtenue')
      }
    } catch (error) {
      process.env.NODE_ENV !== 'production' && console.error('Error getting user location:', error)
    }
  }

  const updateDropdownPosition = () => {
    if (!dropdownRef.value || !showLocationDropdown.value) {
      return
    }
    const btnRect = dropdownRef.value.getBoundingClientRect()
    const isMobile = props.isMobile
    const top = btnRect.bottom + window.scrollY + 8
    let left: number

    if (isMobile) {
      // centrer horizontalement
      left = window.innerWidth / 2 - (isMobile ? 160 : 192)
    } else {
      left = btnRect.left + window.scrollX
      // éviter overflow droit
      const estimatedWidth = 384 // w-96 ~= 384px
      if (left + estimatedWidth > window.scrollX + window.innerWidth) {
        left = window.scrollX + window.innerWidth - estimatedWidth - 8
      }
      if (left < 8) {
        left = 8
      }
    }

    dropdownStyle.value = {
      position: 'absolute',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: '9999',
      width: isMobile ? '320px' : '384px'
    }
  }

  const onClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const isInsideTrigger = dropdownRef.value?.contains(target)
    const isInsidePortal = portalDropdown.value?.contains(target)
    if (!isInsideTrigger && !isInsidePortal) {
      showLocationDropdown.value = false
    }
  }

  const debounce = (fn: Function, delay = 300) => {
    return (...args: any[]) => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
      }
      searchTimeout.value = window.setTimeout(() => {
        fn(...args)
      }, delay)
    }
  }

  const performLocationSearch = async () => {
    if (locationSearch.value.length < 2) {
      locationSearchResults.value = []
      return
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationSearch.value
        )}&countrycodes=fr&limit=10&addressdetails=1`
      )
      const data = await res.json()
      locationSearchResults.value = data
        .filter((i: any) => {
          const validTypes = ['city', 'town', 'village', 'municipality', 'administrative']
          const hasValidType = validTypes.includes(i.type)
          const hasCityAddress =
            i.address &&
            (i.address.city || i.address.town || i.address.village || i.address.municipality)
          const isCityLevel = i.place_rank && i.place_rank <= 16
          return hasValidType || hasCityAddress || isCityLevel
        })
        .slice(0, 5)
    } catch (error) {
      process.env.NODE_ENV !== 'production' &&
        console.error('Erreur lors de la recherche de villes:', error)
      locationSearchResults.value = []
    }
  }

  const onSearchInput = debounce(() => {
    performLocationSearch()
  }, 500)

  const selectLocation = (loc: any) => {
    if (!selectedLocations.value.some(l => l.place_id === loc.place_id)) {
      selectedLocations.value.push(loc)
    }
    useCurrentLocation.value = false
    locationSearch.value = ''
    locationSearchResults.value = []
  }

  const makeActive = (i: number) => {
    useCurrentLocation.value = false
    if (i !== 0) {
      selectedLocations.value.unshift(selectedLocations.value.splice(i, 1)[0])
    }
  }

  const removeLocation = (i: number) => {
    selectedLocations.value.splice(i, 1)
  }

  const toggleCurrentLocation = () => {
    useCurrentLocation.value = !useCurrentLocation.value
  }

  function updateLocationFilter() {
    const filterAnnouncement: FilterAnnouncement = {
      ...props.filters,
      latitude: undefined,
      longitude: undefined,
      radius: 0
    }
    if (
      useCurrentLocation.value &&
      currentLatitude.value != null &&
      currentLongitude.value != null
    ) {
      filterAnnouncement.latitude = currentLatitude.value
      filterAnnouncement.longitude = currentLongitude.value
      filterAnnouncement.radius = locationRadius.value
    } else if (selectedLocations.value.length) {
      const l = selectedLocations.value[0]
      filterAnnouncement.latitude = parseFloat(l.lat)
      filterAnnouncement.longitude = parseFloat(l.lon)
      filterAnnouncement.radius = locationRadius.value
    }
    emits('update:filters', filterAnnouncement)
  }

  const onApply = () => {
    updateLocationFilter()
    showLocationDropdown.value = false
  }

  const onClear = () => {
    selectedLocations.value = []
    useCurrentLocation.value = false
    locationRadius.value = props.filters.radius || 5
    updateLocationFilter()
    showLocationDropdown.value = false
  }

  // Lifecycles
  onMounted(async () => {
    await userLocation.initializeLocation()
    await checkLocationPermissions()
    await initLocation()
    document.addEventListener('click', onClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', onClickOutside)
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value)
    }
  })

  // Repositionnement quand visible / resize / scroll
  watch(showLocationDropdown, async visible => {
    if (visible) {
      await nextTick()
      updateDropdownPosition()
      window.addEventListener('resize', updateDropdownPosition)
      window.addEventListener('scroll', updateDropdownPosition, true)
    } else {
      window.removeEventListener('resize', updateDropdownPosition)
      window.removeEventListener('scroll', updateDropdownPosition, true)
    }
  })
</script>

<style scoped>
  .location-dropdown-portal {
    /* Renforcer au cas où */
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.2);
    border-radius: 0.75rem;
    background-clip: padding-box;
  }
</style>
