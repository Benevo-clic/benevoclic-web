<template>
  <div class="w-full flex flex-col sm:flex-row sm:items-center sm:justify-start gap-2">
    <!-- Bouton Trier -->
    <button class="btn btn-outline btn-sm rounded-full flex items-center gap-2 min-w-max w-full sm:w-auto" @click="$emit('sort')">
      <SortAsc class="w-4 h-4" />
      Trier par
    </button>

    <!-- Dropdown Type d'association -->
    <div class="dropdown dropdown-bottom w-full sm:w-auto">
      <button tabindex="0" class="btn btn-outline btn-sm rounded-full flex items-center gap-2 min-w-max w-full sm:w-auto">
        Type d'association
        <ChevronRight class="w-4 h-4" />
      </button>
      <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 text-sm">
        <li><a @click="$emit('type', 'Humanitaire')">Humanitaire</a></li>
        <li><a @click="$emit('type', 'Environnement')">Environnement</a></li>
        <li><a @click="$emit('type', 'Sport')">Sport</a></li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SortAsc, ChevronRight } from 'lucide-vue-next';
</script>

<style scoped>
.flex::-webkit-scrollbar {
  display: none;
}
</style>