<template>
  <div class="multi-marker-map-container">
    <div ref="mapContainer" class="map-container">
      <!-- Bouton de rafraîchissement -->
      <button
        v-if="expandedCity"
        class="refresh-btn"
        @click="resetToCities"
        title="Afficher toutes les villes"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="23 4 23 10 17 10"></polyline>
          <polyline points="1 20 1 14 7 14"></polyline>
          <path d="M3.51 9a9 9 0 0114.13-3.36L23 10"></path>
          <path d="M20.49 15A9 9 0 015.87 18.36L1 14"></path>
        </svg>
      </button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { LocationGeoJson } from '~/common/interface/event.interface'

const props = defineProps<{
  locations: LocationGeoJson[],
  eventsData: {
    name: string,
    description: string,
    date: string,
    location: string,
    coordinates: [number, number]
  }[]
}>()

const { $maplibregl } = useNuxtApp()
const mapContainer = ref<HTMLElement>()
const map = ref<any>(null)
const markers = ref<any[]>([])
const expandedCity = ref<string | null>(null)

const openGoogleMaps = (lat: number, lng: number, label: string) => {
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15`
  window.open(googleMapsUrl, '_blank')
}

const zoomIn = () => {
  if (map.value) map.value.zoomIn()
}

const zoomOut = () => {
  if (map.value) map.value.zoomOut()
}

const clearMarkers = () => {
  markers.value.forEach(marker => marker.remove())
  markers.value = []
}

const addCityMarkers = () => {
  if (!map.value) return
  clearMarkers()
  // Calculer le nombre d'événements par ville
  const eventsCountByCity: Record<string, number> = {}
  const cityCoords: Record<string, [number, number]> = {}
  props.eventsData.forEach(event => {
    eventsCountByCity[event.location] = (eventsCountByCity[event.location] || 0) + 1
    // On prend la première coordonnée trouvée pour la ville
    if (!cityCoords[event.location]) cityCoords[event.location] = event.coordinates
  })
  Object.entries(eventsCountByCity).forEach(([city, count]) => {
    const popup = new $maplibregl.Popup({ offset: 25 }).setText(`${city} (${count} événement${count > 1 ? 's' : ''}) - Cliquez pour voir les détails`)
    const marker = new $maplibregl.Marker({ color: '#3b82f6', scale: count > 1 ? 1.2 : 0.9 })
      .setLngLat(cityCoords[city])
      .setPopup(popup)
      .addTo(map.value)
    marker.getElement().style.cursor = 'pointer'
    // Badge du nombre d'événements
    const markerElement = marker.getElement()
    const countElement = document.createElement('div')
    countElement.className = 'marker-count'
    countElement.textContent = count.toString()
    countElement.style.cssText = `
      position: absolute;
      top: -8px;
      right: -8px;
      background: #ef4444;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      border: 2px solid white;
    `
    markerElement.appendChild(countElement)
    marker.getElement().addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation()
      expandedCity.value = city
      addEventMarkers(city)
    })
    markers.value.push(marker)
  })
  // Adapter la vue à tous les marqueurs de ville
  const bounds = new $maplibregl.LngLatBounds()
  Object.values(cityCoords).forEach(coord => bounds.extend(coord))
  map.value.fitBounds(bounds, { padding: 50, maxZoom: 15 })
}

const addEventMarkers = (city: string) => {
  if (!map.value) return
  clearMarkers()
  // Filtrer les événements de la ville
  const cityEvents = props.eventsData.filter(event => event.location === city)
  const cityCount = cityEvents.length
  cityEvents.forEach((event, index) => {
    const popupContent = `
      <div style=\"padding: 8px; max-width: 250px;\">
        <h3 style=\"margin: 0 0 8px 0; font-weight: bold; color: #1f2937;\">${event.name}</h3>
        <p style=\"margin: 0 0 8px 0; color: #6b7280; font-size: 14px;\">${event.description}</p>
        <p style=\"margin: 0 0 8px 0; color: #059669; font-size: 12px;\">📅 ${event.date}</p>
        <p style=\"margin: 0; color: #3b82f6; font-size: 12px;\">📍 ${event.location}</p>
      </div>
    `
    const popup = new $maplibregl.Popup({ offset: 25, maxWidth: '300px' }).setHTML(popupContent)
    const marker = new $maplibregl.Marker({ color: '#10b981', scale: 0.8 })
      .setLngLat(event.coordinates)
      .setPopup(popup)
      .addTo(map.value)
    marker.getElement().style.cursor = 'pointer'
    // Numéro de l'événement
    const markerElement = marker.getElement()
    const numberElement = document.createElement('div')
    numberElement.className = 'event-marker-number'
    numberElement.textContent = (index + 1).toString()
    numberElement.style.cssText = `
      position: absolute;
      top: -6px;
      right: -6px;
      background: #059669;
      color: white;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
      border: 1px solid white;
    `
    markerElement.appendChild(numberElement)
    marker.getElement().addEventListener('click', () => {
      openGoogleMaps(event.coordinates[1], event.coordinates[0], event.name)
    })
    markers.value.push(marker)
  })
  // Adapter la vue à tous les événements de la ville
  const bounds = new $maplibregl.LngLatBounds()
  cityEvents.forEach(event => bounds.extend(event.coordinates))
  map.value.fitBounds(bounds, { padding: 50, maxZoom: 15 })
}

const resetToCities = () => {
  expandedCity.value = null
  addCityMarkers()
}

const initMap = () => {
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
    center: props.locations.length
      ? props.locations[0].coordinates
      : [2.3522, 48.8566], // Paris par défaut
    zoom: 5,
    minZoom: 3,
    maxZoom: 18
  })
}

onMounted(() => {
  initMap()
  map.value?.on('load', addCityMarkers)
  // Fermer la vue détaillée si on clique sur la carte (hors marqueur)
  setTimeout(() => {
    if (map.value) {
      map.value.on('click', (e: any) => {
        if (expandedCity.value) resetToCities()
      })
    }
  }, 500)
})

watch(
  () => props.locations,
  () => {
    if (map.value?.loaded()) {
      if (expandedCity.value) {
        addEventMarkers(expandedCity.value)
      } else {
        addCityMarkers()
      }
    } else {
      map.value?.on('load', addCityMarkers)
    }
  },
  { deep: true }
)

onUnmounted(() => {
  clearMarkers()
  if (map.value) map.value.remove()
})
</script>

<style scoped>
.multi-marker-map-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}
.map-container {
  width: 100%;
  height: 500px;
  border-radius: 0.375rem;
  overflow: hidden;
  position: relative;
}
.refresh-btn {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 1100;
  background: white;
  border: 1.5px solid #3b82f6;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.08);
  color: #3b82f6;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.refresh-btn:hover {
  background: #eff6ff;
  border-color: #2563eb;
  color: #2563eb;
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
</style> 