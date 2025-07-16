<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Test MultiMarkerMap</h1>
    <p class="mb-4 text-gray-600">
      Cette page affiche plusieurs marqueurs MapLibre avec popup et accès Google Maps.
    </p>
    <MultiMarkerMap :locations="locations" :eventsData="eventsData" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MultiMarkerMap from '~/components/MultiMarkerMap.vue'
import type { LocationGeoJson } from '~/common/interface/event.interface'

const locations: LocationGeoJson[] = [
  { type: 'Point', coordinates: [2.3522, 48.8566] }, // Paris
  { type: 'Point', coordinates: [4.8357, 45.7640] }, // Lyon
  { type: 'Point', coordinates: [5.3698, 43.2965] }, // Marseille
  { type: 'Point', coordinates: [1.4442, 43.6047] }, // Toulouse
]

const eventsData: {
  name: string;
  description: string;
  date: string;
  location: string;
  coordinates: [number, number];
}[] = [
  {
    name: 'Événement Paris 1 - Tour Eiffel',
    description: 'Un super événement à la Tour Eiffel.',
    date: '2024-07-20',
    location: 'Paris',
    coordinates: [2.2945, 48.8584] as [number, number] // Tour Eiffel
  },
  {
    name: 'Événement Paris 2 - Louvre',
    description: 'Un autre événement au Musée du Louvre.',
    date: '2024-07-21',
    location: 'Paris',
    coordinates: [2.3376, 48.8606] as [number, number] // Louvre
  },
  {
    name: 'Événement Paris 3 - Arc de Triomphe',
    description: 'Un troisième événement à l\'Arc de Triomphe.',
    date: '2024-07-22',
    location: 'Paris',
    coordinates: [2.2950, 48.8738] as [number, number] // Arc de Triomphe
  },
  {
    name: 'Événement Lyon 1 - Place Bellecour',
    description: 'Un super événement à la Place Bellecour.',
    date: '2024-07-23',
    location: 'Lyon',
    coordinates: [4.8320, 45.7578] as [number, number] // Place Bellecour
  },
  {
    name: 'Événement Lyon 2 - Vieux Lyon',
    description: 'Un autre événement dans le Vieux Lyon.',
    date: '2024-07-24',
    location: 'Lyon',
    coordinates: [4.8271, 45.7640] as [number, number] // Vieux Lyon
  },
  {
    name: 'Événement Marseille - Vieux Port',
    description: 'Un super événement au Vieux Port.',
    date: '2024-07-25',
    location: 'Marseille',
    coordinates: [5.3698, 43.2965] as [number, number] // Vieux Port
  },
  {
    name: 'Événement Toulouse - Place du Capitole',
    description: 'Un super événement sur la Place du Capitole.',
    date: '2024-07-26',
    location: 'Toulouse',
    coordinates: [1.4442, 43.6047] as [number, number] // Place du Capitole
  }
]

const eventsCountByCity = computed(() => {
  const counts: Record<string, number> = {}
  eventsData.forEach(event => {
    counts[event.location] = (counts[event.location] || 0) + 1
  })
  return counts
})
</script> 