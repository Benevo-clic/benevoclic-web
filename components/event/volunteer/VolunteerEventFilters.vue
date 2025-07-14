<template>
  <div class="w-full flex flex-wrap justify-center gap-2">
    <!-- Desktop -->
    <div class="hidden md:flex flex-wrap gap-2 items-center justify-center w-full max-w-full">
      <button class="btn btn-outline btn-sm rounded-full flex items-center gap-2 min-w-max" @click="$emit('map')">
        <Map class="w-4 h-4" />
        Carte
      </button>
      <button class="btn btn-outline btn-sm rounded-full flex items-center gap-2 min-w-max" @click="$emit('sort')">
        <SortAsc class="w-4 h-4" />
        Trier par
      </button>

      <!-- Localisation -->
      <div class="dropdown dropdown-bottom">
        <button tabindex="0" class="btn btn-outline btn-sm rounded-full flex items-center gap-2 min-w-max">
          <MapPin class="w-4 h-4" />
          Localisation
          <ChevronDown class="w-3 h-3" />
        </button>
        <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-sm">
          <li><a @click="$emit('location', 'Paris')">Paris</a></li>
          <li><a @click="$emit('location', 'Lyon')">Lyon</a></li>
          <li><a @click="$emit('location', 'Marseille')">Marseille</a></li>
        </ul>
      </div>

      <!-- Type d'association -->
      <div class="dropdown dropdown-bottom">
        <button tabindex="0" class="btn btn-outline btn-sm rounded-full flex items-center gap-2 min-w-max">
          Type d'association
          <ChevronRight class="w-3 h-3" />
        </button>
        <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-sm">
          <li><a @click="$emit('type', 'Humanitaire')">Humanitaire</a></li>
          <li><a @click="$emit('type', 'Environnement')">Environnement</a></li>
          <li><a @click="$emit('type', 'Sport')">Sport</a></li>
        </ul>
      </div>

      <!-- Durée -->
      <div class="dropdown dropdown-bottom">
        <button tabindex="0" class="btn btn-outline btn-sm rounded-full flex items-center gap-2 min-w-max">
          Durée de la mission
          <ChevronRight class="w-3 h-3" />
        </button>
        <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-sm">
          <li><a @click="$emit('duration', '1 jour')">1 jour</a></li>
          <li><a @click="$emit('duration', '1 semaine')">1 semaine</a></li>
          <li><a @click="$emit('duration', '1 mois')">1 mois</a></li>
        </ul>
      </div>

      <!-- Filtres -->
      <button class="btn btn-outline btn-sm rounded-full flex items-center gap-2 min-w-max" @click="$emit('filters')">
        <SlidersHorizontal class="w-4 h-4" />
        Filtres
      </button>
    </div>

    <!-- Mobile -->
    <div class="flex md:hidden flex-wrap gap-2 items-center justify-center w-full max-w-full">
      <button class="btn btn-outline btn-sm rounded-full flex items-center gap-2 min-w-max" @click="$emit('map')">
        <Map class="w-4 h-4" />
        Carte
      </button>
      <button class="btn btn-outline btn-sm rounded-full flex items-center gap-2 min-w-max" @click="$emit('sort')">
        <SortAsc class="w-4 h-4" />
        Trier par
      </button>

      <!-- Dropdown Filtres Mobile -->
      <div class="dropdown dropdown-bottom">
        <button tabindex="0" class="btn btn-outline btn-sm rounded-full flex items-center gap-2 min-w-max">
          <SlidersHorizontal class="w-4 h-4" />
          Filtres
        </button>
        <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-sm">
          <li>
            <div class="dropdown dropdown-right">
              <button tabindex="0" class="btn btn-outline btn-sm rounded-full flex items-center gap-2 min-w-max w-full">
                <MapPin class="w-4 h-4" />
                Localisation
                <ChevronDown class="w-3 h-3" />
              </button>
              <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-sm">
                <li><a @click="$emit('location', 'Paris')">Paris</a></li>
                <li><a @click="$emit('location', 'Lyon')">Lyon</a></li>
                <li><a @click="$emit('location', 'Marseille')">Marseille</a></li>
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
                <li><a @click="$emit('type', 'Humanitaire')">Humanitaire</a></li>
                <li><a @click="$emit('type', 'Environnement')">Environnement</a></li>
                <li><a @click="$emit('type', 'Sport')">Sport</a></li>
              </ul>
            </div>
          </li>
          <li>
            <div class="dropdown dropdown-right">
              <button tabindex="0" class="btn btn-outline btn-sm rounded-full flex items-center gap-2 min-w-max w-full">
                Durée de la mission
                <ChevronRight class="w-3 h-3" />
              </button>
              <ul class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-sm">
                <li><a @click="$emit('duration', '1 jour')">1 jour</a></li>
                <li><a @click="$emit('duration', '1 semaine')">1 semaine</a></li>
                <li><a @click="$emit('duration', '1 mois')">1 mois</a></li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Map, SortAsc, MapPin, ChevronDown, ChevronRight, SlidersHorizontal } from 'lucide-vue-next';
</script>

<style scoped>
.flex::-webkit-scrollbar {
  display: none;
}
</style> 