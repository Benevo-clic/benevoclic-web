<script setup lang="ts">
  import { ChevronDown, Earth, MapPin, Navigation, AlertCircle, Search, X } from 'lucide-vue-next'
  import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
  import { useUserLocation } from '~/composables/useUserLocation'

  const showCityMenu = ref(false)
  const showLanguageMenu = ref(false)
  const showSearch = ref(false)
  const searchQuery = ref('')
  const searchResults = ref<any[]>([])
  const isSearching = ref(false)

  const { userLocation, isLoading, error, getUserLocation, clearStoredLocation } = useUserLocation()

  const defaultCities = ['Paris, France', 'Lyon, France', 'Marseille, France', 'Toulouse, France']

  const currentCity = ref(defaultCities[0])

  const props = defineProps<{ flag: string }>()
  const emit = defineEmits<{
    (e: 'toggle-language-menu', show: boolean): void
  }>()

  // Recherche de villes françaises via l'API Etalab
  const searchFrenchCities = async (query: string) => {
    if (query.length < 2) {
      searchResults.value = []
      return
    }

    isSearching.value = true
    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&country=France&limit=10`
      )
      const data = await response.json()

      searchResults.value = data.features
        .filter((feature: any) => feature.properties.type === 'municipality')
        .map((feature: any) => ({
          name: feature.properties.name,
          city: feature.properties.city,
          postcode: feature.properties.postcode,
          coordinates: feature.geometry.coordinates,
          label: feature.properties.label
        }))
    } catch (err) {
      process.env.NODE_ENV !== 'production' && console.error('Erreur lors de la recherche:', err)
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }

  // Recherche avec debounce
  let searchTimeout: NodeJS.Timeout
  const debouncedSearch = (query: string) => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => searchFrenchCities(query), 300)
  }

  // Surveiller les changements de la recherche
  watch(searchQuery, newQuery => {
    debouncedSearch(newQuery)
  })

  const selectSearchedCity = (city: any) => {
    currentCity.value = `${city.city}, France`
    searchQuery.value = ''
    searchResults.value = []
    showSearch.value = false
    showCityMenu.value = false

    // Afficher les coordonnées dans la console
    process.env.NODE_ENV !== 'production' &&
      console.log('Ville sélectionnée:', {
        nom: city.city,
        codePostal: city.postcode,
        nomComplet: city.name,
        coordonnées: {
          longitude: city.coordinates[0],
          latitude: city.coordinates[1]
        }
      })
  }

  const toggleSearch = () => {
    showSearch.value = !showSearch.value
    if (showSearch.value) {
      searchQuery.value = ''
      searchResults.value = []
    }
  }

  function selectCity(city: string) {
    currentCity.value = city
    showCityMenu.value = false

    // Afficher les coordonnées pour les villes par défaut
    process.env.NODE_ENV !== 'production' && console.log('Ville par défaut sélectionnée:', city)

    // Optionnel : Récupérer les coordonnées via géocodage pour les villes par défaut
    fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(city)}&country=France&limit=1`
    )
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          const feature = data.features[0]
          process.env.NODE_ENV !== 'production' &&
            console.log('Coordonnées de la ville par défaut:', {
              nom: city,
              coordonnées: {
                longitude: feature.geometry.coordinates[0],
                latitude: feature.geometry.coordinates[1]
              }
            })
        }
      })
      .catch(
        err =>
          process.env.NODE_ENV !== 'production' &&
          console.error('Erreur lors de la récupération des coordonnées:', err)
      )
  }

  function toggleLanguageMenu() {
    showLanguageMenu.value = !showLanguageMenu.value && !showCityMenu.value
    emit('toggle-language-menu', showLanguageMenu.value)
  }

  const handleGetLocation = async () => {
    const location = await getUserLocation()
    if (location && location.city) {
      currentCity.value = `${location.city}, France`
    } else if (location) {
      currentCity.value = `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
    }
    showCityMenu.value = false
  }

  const handleClearLocation = () => {
    clearStoredLocation()
    currentCity.value = defaultCities[0]
  }

  watch(userLocation, loc => {
    if (loc && loc.city) {
      currentCity.value = `${loc.city}, France`
    } else if (loc) {
      currentCity.value = `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`
    }
  })

  const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.location-menu')) {
      showCityMenu.value = false
      showLanguageMenu.value = false
      showSearch.value = false
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    clearTimeout(searchTimeout)
  })
</script>

<template>
  <div class="flex items-center location-menu">
    <!-- Sélecteur de ville/géolocalisation -->
    <div class="relative">
      <button
        class="btn btn-neutral-content btn-md px-0 flex items-center gap-1"
        @click="showCityMenu = !showCityMenu && !showLanguageMenu"
      >
        <MapPin class="text-base-content w-6 h-6" />
        <span class="text-sm text-base-content">{{ currentCity }}</span>
        <ChevronDown
          :class="showCityMenu ? 'rotate-180 transition-transform' : 'transition-transform'"
          class="w-4 h-4 text-base-content"
        />
      </button>
      <!-- Menu déroulant -->
      <div
        v-if="showCityMenu && !showLanguageMenu"
        class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-80 absolute top-full left-0 z-50"
      >
        <!-- Barre de recherche -->
        <div class="mb-3">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher une ville..."
              class="input input-sm w-full pr-8"
              aria-label="Champ de saisie"
              @focus="showSearch = true"
            />
            <Search
              class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            />
          </div>

          <!-- Résultats de recherche -->
          <div v-if="showSearch && searchQuery" class="mt-2 max-h-48 overflow-y-auto">
            <div v-if="isSearching" class="text-center py-2 text-sm text-gray-500">
              Recherche en cours...
            </div>
            <div v-else-if="searchResults.length > 0" class="space-y-1">
              <button
                v-for="city in searchResults"
                :key="`${city.city}-${city.postcode}`"
                class="w-full text-left p-2 hover:bg-gray-100 rounded text-sm"
                @click="selectSearchedCity(city)"
              >
                <div class="font-medium">
                  {{ city.city }}
                </div>
                <div class="text-xs text-gray-500">{{ city.postcode }} - {{ city.name }}</div>
              </button>
            </div>
            <div v-else-if="searchQuery.length >= 2" class="text-center py-2 text-sm text-gray-500">
              Aucune ville trouvée
            </div>
          </div>
        </div>

        <!-- Bouton géolocalisation -->
        <div class="mb-2 pb-2 border-b border-gray-200">
          <button
            :disabled="isLoading"
            :class="[
              'w-full flex items-center gap-2 p-2 rounded hover:bg-gray-100',
              userLocation ? 'bg-blue-50 text-blue-700' : ''
            ]"
            @click="handleGetLocation"
          >
            <Navigation class="w-4 h-4" :class="userLocation ? 'text-blue-700' : 'text-blue-600'" />
            <span class="text-sm">
              <template v-if="isLoading">Localisation...</template>
              <template v-else-if="userLocation">Ma position définie</template>
              <template v-else>Utiliser ma position</template>
            </span>
          </button>
        </div>

        <!-- Villes par défaut -->
        <div class="mb-2">
          <div class="text-xs font-medium text-gray-600 mb-1">Villes populaires</div>
          <ul class="menu menu-compact">
            <li v-for="city in defaultCities" :key="city">
              <button class="w-full text-left p-2 hover:bg-gray-100" @click="selectCity(city)">
                {{ city }}
              </button>
            </li>
          </ul>
        </div>

        <!-- Affichage position utilisateur -->
        <div v-if="userLocation" class="mt-2 pt-2 border-t border-gray-200">
          <div class="flex items-center justify-between p-2 bg-blue-50 rounded">
            <div class="flex items-center gap-2">
              <Navigation class="w-4 h-4 text-blue-700" />
              <span class="text-xs text-blue-700">
                {{
                  userLocation.city ||
                  userLocation.latitude.toFixed(4) + ', ' + userLocation.longitude.toFixed(4)
                }}
              </span>
            </div>
            <button
              class="text-xs text-blue-600 hover:text-blue-800 underline"
              @click="handleClearLocation"
            >
              Effacer
            </button>
          </div>
        </div>

        <!-- Message d'erreur -->
        <div v-if="error" class="mt-2 p-2 bg-red-50 rounded">
          <div class="flex items-center gap-2">
            <AlertCircle class="w-4 h-4 text-red-600" />
            <span class="text-xs text-red-700">{{ error }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bouton de langue -->
    <div class="indicator hidden sm:flex">
      <button
        class="btn btn-neutral-content btn-md ml-1 px-2 flex items-center gap-1"
        :class="{ 'bg-blue-100': showLanguageMenu }"
        @click="toggleLanguageMenu"
      >
        <span class="indicator-item text-base-content mt-2 mr-2">
          {{ props.flag }}
        </span>
        <Earth class="text-base-content w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<style scoped>
  .location-menu {
    position: relative;
  }

  /* Scrollbar personnalisée pour les résultats de recherche */
  .overflow-y-auto::-webkit-scrollbar {
    width: 4px;
  }

  .overflow-y-auto::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 2px;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
</style>
