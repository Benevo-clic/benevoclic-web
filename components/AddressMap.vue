<template>
  <div class="address-map-container">
    <!-- Champ de recherche avec autocomplete -->
    <div class="search-container">
      <input
        v-model="query"
        @input="searchAddresses"
        @focus="showSuggestions = true"
        placeholder="Rechercher une adresse..."
        class="search-input"
        type="text"
      />
      
      <!-- Suggestions d'adresses -->
      <div v-if="showSuggestions && suggestions.length > 0" class="suggestions-container">
        <div
          v-for="suggestion in suggestions"
          :key="suggestion.properties.id"
          @click="selectAddress(suggestion)"
          class="suggestion-item"
        >
          <div class="suggestion-text">
            {{ suggestion.properties.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- Conteneur de la carte -->
    <div ref="mapContainer" class="map-container">
      <!-- Contrôles de zoom personnalisés -->
      <div class="zoom-controls">
        <button 
          @click="zoomIn" 
          class="zoom-btn zoom-in"
          title="Zoomer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>
        <button 
          @click="zoomOut" 
          class="zoom-btn zoom-out"
          title="Dézoomer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13H5v-2h14v2z"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Info-bulle pour indiquer que le marqueur est cliquable -->
    <div v-if="selectedAddress" class="map-info">
      <p class="text-sm text-gray-600 mb-2">
        <span class="font-medium">Adresse sélectionnée :</span> {{ selectedAddress }}
      </p>
      <p class="text-xs text-gray-500">
        💡 Cliquez sur le marqueur rouge pour ouvrir dans Google Maps
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface AddressFeature {
  properties: {
    id: string
    label: string
    name: string
    postcode: string
    city: string
    context: string
  }
  geometry: {
    coordinates: [number, number]
  }
}

interface AddressResponse {
  features: AddressFeature[]
}

const { $maplibregl } = useNuxtApp()

// Réactivité
const query = ref('')
const suggestions = ref<AddressFeature[]>([])
const showSuggestions = ref(false)
const mapContainer = ref<HTMLElement>()
const map = ref<any>(null)
const marker = ref<any>(null)
const selectedAddress = ref<string>('')

// Debounce pour la recherche
let searchTimeout: NodeJS.Timeout

// Recherche d'adresses avec l'API Adresse d'Étalab
const searchAddresses = async () => {
  if (!query.value || query.value.length < 3) {
    suggestions.value = []
    return
  }

  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search?q=${encodeURIComponent(query.value)}&limit=5`
      )
      const data: AddressResponse = await response.json()
      suggestions.value = data.features
    } catch (error) {
      console.error('Erreur lors de la recherche d\'adresses:', error)
      suggestions.value = []
    }
  }, 300)
}

// Fonction pour ouvrir Google Maps
const openGoogleMaps = (lat: number, lng: number, address: string) => {
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15`
  window.open(googleMapsUrl, '_blank')
}

// Fonctions de zoom
const zoomIn = () => {
  if (map.value) {
    map.value.zoomIn()
  }
}

const zoomOut = () => {
  if (map.value) {
    map.value.zoomOut()
  }
}

// Sélection d'une adresse
const selectAddress = (address: AddressFeature) => {
  query.value = address.properties.label
  selectedAddress.value = address.properties.label
  suggestions.value = []
  showSuggestions.value = false
  
  const [lng, lat] = address.geometry.coordinates
  
  // Initialiser la carte si elle n'existe pas
  if (!map.value) {
    initMap(lng, lat, address.properties.label)
  } else {
    // Centrer la carte sur les nouvelles coordonnées
    map.value.setCenter([lng, lat])
    
    // Mettre à jour ou créer le marqueur
    if (marker.value) {
      marker.value.setLngLat([lng, lat])
    } else {
      marker.value = new $maplibregl.Marker()
        .setLngLat([lng, lat])
        .addTo(map.value)
    }
  }
}

// Initialisation de la carte
const initMap = (lng: number, lat: number, address: string) => {
  if (!mapContainer.value) return

  map.value = new $maplibregl.Map({
    container: mapContainer.value,
    style: {
      version: 8,
      sources: {
        'osm': {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors'
        }
      },
      layers: [
        {
          id: 'osm-tiles',
          type: 'raster',
          source: 'osm',
          minzoom: 0,
          maxzoom: 20
        }
      ]
    },
    center: [lng, lat],
    zoom: 15,
    // Activer les contrôles de zoom
    zoomControl: true,
    // Activer la navigation au clavier
    keyboard: true,
    // Activer le double-clic pour zoomer
    doubleClickZoom: true,
    // Activer le scroll pour zoomer
    scrollZoom: true,
    // Activer le drag pour déplacer la carte
    dragPan: true,
    // Activer le drag avec la molette pour zoomer
    dragRotate: false,
    // Limites de zoom
    minZoom: 3,
    maxZoom: 18
  })

  // Ajouter le marqueur avec gestionnaire de clic
  marker.value = new $maplibregl.Marker()
    .setLngLat([lng, lat])
    .addTo(map.value)

  // Ajouter un gestionnaire de clic sur le marqueur
  marker.value.getElement().addEventListener('click', () => {
    openGoogleMaps(lat, lng, address)
  })

  // Ajouter un style pour indiquer que le marqueur est cliquable
  marker.value.getElement().style.cursor = 'pointer'
}

// Fermer les suggestions quand on clique ailleurs
onMounted(() => {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.search-container')) {
      showSuggestions.value = false
    }
  })
})

// Nettoyer la carte au démontage
onUnmounted(() => {
  if (map.value) {
    map.value.remove()
  }
})
</script>

<style scoped>
.address-map-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-container {
  position: relative;
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.suggestions-container {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-top: none;
  border-radius: 0 0 0.375rem 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background-color: #f9fafb;
}

.suggestion-text {
  font-size: 0.875rem;
  color: #374151;
}

.map-container {
  width: 100%;
  height: 400px;
  border-radius: 0.375rem;
  overflow: hidden;
  position: relative;
}

.zoom-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.zoom-btn {
  width: 32px;
  height: 32px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #374151;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.zoom-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.zoom-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.zoom-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.map-info {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  border-left: 4px solid #3b82f6;
}
</style> 