<template>
  <div class="w-full flex justify-center">
    <!-- Desktop : tous les filtres visibles -->
    <div class="hidden md:flex gap-2 items-center">
      <button class="btn btn-outline rounded-full flex items-center gap-2 min-w-max" @click="$emit('map')">
        <Map class="w-5 h-5" />
        Carte
      </button>
      <button class="btn btn-outline rounded-full flex items-center gap-2 min-w-max" @click="$emit('sort')">
        <SortAsc class="w-5 h-5" />
        Trier par
      </button>
      <div class="dropdown dropdown-bottom">
        <button tabindex="0" class="btn btn-outline rounded-full flex items-center gap-2 min-w-max">
          <MapPin class="w-5 h-5" />
          Localisation
          <ChevronDown class="w-4 h-4" />
        </button>
        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
          <li><a @click="$emit('location', 'Paris')">Paris</a></li>
          <li><a @click="$emit('location', 'Lyon')">Lyon</a></li>
          <li><a @click="$emit('location', 'Marseille')">Marseille</a></li>
        </ul>
      </div>
      <div class="dropdown dropdown-bottom">
        <button tabindex="0" class="btn btn-outline rounded-full flex items-center gap-2 min-w-max">
          Type d'association
          <ChevronRight class="w-4 h-4" />
        </button>
        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
          <li><a @click="$emit('type', 'Humanitaire')">Humanitaire</a></li>
          <li><a @click="$emit('type', 'Environnement')">Environnement</a></li>
          <li><a @click="$emit('type', 'Sport')">Sport</a></li>
        </ul>
      </div>
      <div class="dropdown dropdown-bottom">
        <button tabindex="0" class="btn btn-outline rounded-full flex items-center gap-2 min-w-max">
          Durée de la mission
          <ChevronRight class="w-4 h-4" />
        </button>
        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
          <li><a @click="$emit('duration', '1 jour')">1 jour</a></li>
          <li><a @click="$emit('duration', '1 semaine')">1 semaine</a></li>
          <li><a @click="$emit('duration', '1 mois')">1 mois</a></li>
        </ul>
      </div>
      <button class="btn btn-outline rounded-full flex items-center gap-2 min-w-max" @click="$emit('filters')">
        <SlidersHorizontal class="w-5 h-5" />
        Filtres
      </button>
    </div>
    <!-- Mobile : Carte, Trier par visibles, le reste dans Filtres -->
    <div class="flex md:hidden gap-2 items-center w-full justify-center">
      <button class="btn btn-outline rounded-full flex items-center gap-2 min-w-max" @click="$emit('map')">
        <Map class="w-5 h-5" />
        Carte
      </button>
      <button class="btn btn-outline rounded-full flex items-center gap-2 min-w-max" @click="$emit('sort')">
        <SortAsc class="w-5 h-5" />
        Trier par
      </button>
      <div class="dropdown dropdown-bottom">
        <button tabindex="0" class="btn btn-outline rounded-full flex items-center gap-2 min-w-max">
          <SlidersHorizontal class="w-5 h-5" />
          Filtres
        </button>
        <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <div class="dropdown dropdown-right">
              <button tabindex="0" class="btn btn-outline rounded-full flex items-center gap-2 min-w-max w-full">
                <MapPin class="w-5 h-5" />
                Localisation
                <ChevronDown class="w-4 h-4" />
              </button>
              <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a @click="$emit('location', 'Paris')">Paris</a></li>
                <li><a @click="$emit('location', 'Lyon')">Lyon</a></li>
                <li><a @click="$emit('location', 'Marseille')">Marseille</a></li>
              </ul>
            </div>
          </li>
          <li>
            <div class="dropdown dropdown-right">
              <button tabindex="0" class="btn btn-outline rounded-full flex items-center gap-2 min-w-max w-full">
                Type d'association
                <ChevronRight class="w-4 h-4" />
              </button>
              <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a @click="$emit('type', 'Humanitaire')">Humanitaire</a></li>
                <li><a @click="$emit('type', 'Environnement')">Environnement</a></li>
                <li><a @click="$emit('type', 'Sport')">Sport</a></li>
              </ul>
            </div>
          </li>
          <li>
            <div class="dropdown dropdown-right">
              <button tabindex="0" class="btn btn-outline rounded-full flex items-center gap-2 min-w-max w-full">
                Durée de la mission
                <ChevronRight class="w-4 h-4" />
              </button>
              <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
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