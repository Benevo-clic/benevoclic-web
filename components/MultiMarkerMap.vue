<template>
  <div class="multi-marker-map-container">
    <div ref="mapContainer" class="map-container">
      <!-- Bouton de rafraîchissement -->
      <button
        v-if="expandedCity"
        class="refresh-btn"
        title="Afficher toutes les villes"
        @click="resetToCities"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0114.13-3.36L23 10" />
          <path d="M20.49 15A9 9 0 015.87 18.36L1 14" />
        </svg>
      </button>
      <!-- Contrôles de zoom personnalisés -->
      <div class="zoom-controls">
        <button class="zoom-btn zoom-in" title="Zoomer" @click="zoomIn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </button>
        <button class="zoom-btn zoom-out" title="Dézoomer" @click="zoomOut">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13H5v-2h14v2z" />
          </svg>
        </button>
        <!-- Bouton pour basculer vers les tuiles alternatives -->
        <button
          v-if="tileErrorCount > 0"
          class="zoom-btn tile-switch"
          title="Changer de source de carte"
          @click="switchToAlternativeTiles"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path
              d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
            />
            <path d="M3 21v-5h5" />
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
  locations: LocationGeoJson[];
  eventsData: {
    name: string;
    description: string;
    date: string;
    location: string;
    coordinates: [number, number];
    id: string;
  }[];
}>()

const { $maplibregl } = useNuxtApp()
const mapContainer = ref<HTMLElement>()
const map = ref<any>(null)
const markers = ref<any[]>([])
const expandedCity = ref<string | null>(null)
const tileErrorCount = ref(0)
const maxTileErrors = 5
const hasSwitchedTiles = ref(false)

const zoomIn = () => {
  if (map.value) { map.value.zoomIn() }
}

const zoomOut = () => {
  if (map.value) { map.value.zoomOut() }
}

const clearMarkers = () => {
  markers.value.forEach(marker => marker.remove())
  markers.value = []
}

const addCityMarkers = () => {
  if (!map.value) { return }
  clearMarkers()
  const eventsCountByCity: Record<string, number> = {}
  const cityCoords: Record<string, [number, number]> = {}
  props.eventsData.forEach((event) => {
    eventsCountByCity[event.location] =
      (eventsCountByCity[event.location] || 0) + 1
    if (!cityCoords[event.location]) { cityCoords[event.location] = event.coordinates }
  })
  Object.entries(eventsCountByCity).forEach(([city, count]) => {
    const popup = new $maplibregl.Popup({ offset: 25 }).setText(
      `${city} (${count} événement${count > 1 ? 's' : ''}) - Cliquez pour voir les détails`
    )
    const marker = new $maplibregl.Marker({
      color: '#3b82f6',
      scale: count > 1 ? 1.2 : 0.9
    })
      .setLngLat(cityCoords[city])
      .setPopup(popup)
      .addTo(map.value)
    marker.getElement().style.cursor = 'pointer'
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
  const bounds = new $maplibregl.LngLatBounds()
  Object.values(cityCoords).forEach(coord => bounds.extend(coord))
  map.value.fitBounds(bounds, { padding: 50, maxZoom: 15 })
}

const addEventMarkers = (city: string) => {
  if (!map.value) { return }
  clearMarkers()
  const cityEvents = props.eventsData.filter(
    event => event.location === city
  )
  const cityCount = cityEvents.length
  cityEvents.forEach((event, index) => {
    const truncatedDescription =
      event.description.split(' ').slice(0, 10).join(' ') +
      (event.description.split(' ').length > 10 ? '...' : '')

    const popupContent = `
      <div style=\"padding: 8px; max-width: 250px;\">
        <h3 style=\"margin: 0 0 8px 0; font-weight: bold; color: #1f2937;\">${event.name}</h3>
        <p style=\"margin: 0 0 8px 0; color: #6b7280; font-size: 14px;\">${truncatedDescription}</p>
        <p style=\"margin: 0 0 8px 0; color: #059669; font-size: 12px;\">📅 ${event.date}</p>
        <p style=\"margin: 0; color: #3b82f6; font-size: 12px;\">📍 ${event.location}</p>
      </div>
    `
    const popup = new $maplibregl.Popup({
      offset: 25,
      maxWidth: '300px'
    }).setHTML(popupContent)
    const marker = new $maplibregl.Marker({ color: '#10b981', scale: 0.8 })
      .setLngLat(event.coordinates)
      .setPopup(popup)
      .addTo(map.value)
    marker.getElement().style.cursor = 'pointer'
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
    markerElement.addEventListener('mouseenter', () => {
      marker.togglePopup()
      if (marker.getPopup()) {
        marker.getPopup().addTo(map.value)
      }
    })
    markerElement.addEventListener('mouseleave', () => {
      marker.togglePopup()
      if (marker.getPopup()) {
        marker.getPopup().remove()
      }
    })

    markerElement.addEventListener('click', (e: MouseEvent) => {
      e.stopPropagation()
      if (marker.getPopup()) {
        marker.getPopup().remove()
      }
      goToDetails(event.id)
    })
    marker.setPopup(popup)
    markers.value.push(marker)
  })
  const bounds = new $maplibregl.LngLatBounds()
  cityEvents.forEach(event => bounds.extend(event.coordinates))
  map.value.fitBounds(bounds, { padding: 50, maxZoom: 15 })
}

const resetToCities = () => {
  expandedCity.value = null
  addCityMarkers()
}

const initMap = () => {
  if (!mapContainer.value) { return }

  try {
    // Configuration MapLibre avec gestion des workers
    const mapConfig = {
      container: mapContainer.value,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
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
      maxZoom: 18,
      // Désactiver les workers si nécessaire pour éviter les erreurs CSP
      workerClass: null,
      // Configuration pour éviter les problèmes de workers
      transformRequest: (url: string, resourceType: string) => {
        if (resourceType === 'Tile' && url.includes('openstreetmap.org')) {
          return {
            url,
            headers: {
              'User-Agent': 'BeneVoclic/1.0',
              Accept: 'image/png,image/webp,*/*',
              'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
            }
          }
        }
        return { url }
      }
    }

    map.value = new $maplibregl.Map(mapConfig)

    // Gestion des erreurs de la carte
    map.value.on('error', (e: any) => {
      console.warn('MapLibre error:', e)

      // Si c'est une erreur de worker, essayer de réinitialiser sans workers
      if (e.error && e.error.message && e.error.message.includes('Worker')) {
        console.log('Attempting to reinitialize map without workers...')
        if (map.value) {
          map.value.remove()
        }
        // Réessayer sans workers
        mapConfig.workerClass = null
        map.value = new $maplibregl.Map(mapConfig)
      }

      // Si c'est une erreur de tuile, compter et basculer si nécessaire
      if (
        e.error &&
        e.error.message &&
        e.error.message.includes('Failed to fetch') &&
        e.tile
      ) {
        tileErrorCount.value++
        console.log(
          `Tile loading error (${tileErrorCount.value}/${maxTileErrors})`
        )

        // Si trop d'erreurs et qu'on n'a pas encore basculé, essayer les tuiles alternatives
        if (tileErrorCount.value >= maxTileErrors && !hasSwitchedTiles.value) {
          console.log(
            'Too many tile errors, switching to alternative tile source...'
          )
          hasSwitchedTiles.value = true
          switchToAlternativeTiles()
        }
      }
    })

    // Gestion spécifique des erreurs de source
    map.value.on('sourcedataerror', (e: any) => {
      console.warn('Source data error:', e)
      if (e.sourceId === 'osm') {
        console.log(
          'OpenStreetMap source error, tiles may not be loading properly'
        )
      }
    })
  } catch (error) {
    console.error('Error initializing map:', error)
    // Fallback: afficher un message d'erreur à l'utilisateur
    if (mapContainer.value) {
      mapContainer.value.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f3f4f6; border-radius: 8px;">
          <div style="text-align: center; color: #6b7280;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto 16px;">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <p style="margin: 0; font-size: 14px;">Impossible de charger la carte</p>
            <p style="margin: 4px 0 0 0; font-size: 12px;">Vérifiez votre connexion internet</p>
            <button onclick="window.location.reload()" style="margin-top: 12px; padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;" type="button" focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2>Réessayer</button>
          </div>
        </div>
      `
    }
  }
}

// Fonction pour basculer vers une source de tuiles alternative
const switchToAlternativeTiles = () => {
  if (!map.value) { return }

  try {
    // Supprimer la source existante
    if (map.value.getSource('osm')) {
      map.value.removeSource('osm')
    }

    // Ajouter une nouvelle source avec des tuiles alternatives
    map.value.addSource('osm', {
      type: 'raster',
      tiles: [
        'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        'https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '© CartoDB, © Thunderforest'
    })

    console.log('Switched to alternative tile source')
  } catch (error) {
    console.error('Error switching to alternative tiles:', error)
  }
}

const goToDetails = (announcementId: string) => {
  navigateTo(`/volunteer/events/announcement/${announcementId}`)
}

onMounted(() => {
  try {
    initMap()

    // Attendre que la carte soit chargée avant d'ajouter les marqueurs
    if (map.value) {
      map.value.on('load', () => {
        try {
          addCityMarkers()
        } catch (error) {
          console.error('Error adding city markers:', error)
        }
      })

      // Gestion des clics sur la carte
      map.value.on('click', (e: any) => {
        try {
          if (expandedCity.value) { resetToCities() }
        } catch (error) {
          console.error('Error handling map click:', error)
        }
      })
    }
  } catch (error) {
    console.error('Error in onMounted:', error)
  }
})

watch(
  () => props.locations,
  () => {
    try {
      if (map.value && map.value.loaded()) {
        if (expandedCity.value) {
          addEventMarkers(expandedCity.value)
        } else {
          addCityMarkers()
        }
      } else if (map.value) {
        // Si la carte n'est pas encore chargée, attendre l'événement load
        map.value.on('load', () => {
          try {
            if (expandedCity.value) {
              addEventMarkers(expandedCity.value)
            } else {
              addCityMarkers()
            }
          } catch (error) {
            console.error('Error in map load event:', error)
          }
        })
      }
    } catch (error) {
      console.error('Error in locations watcher:', error)
    }
  },
  { deep: true }
)

onUnmounted(() => {
  clearMarkers()
  if (map.value) { map.value.remove() }
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
  transition:
    background 0.2s,
    border-color 0.2s;
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

.tile-switch {
  background: #fef3c7;
  border-color: #f59e0b;
  color: #d97706;
}

.tile-switch:hover {
  background: #fde68a;
  border-color: #d97706;
  color: #b45309;
}
</style>
