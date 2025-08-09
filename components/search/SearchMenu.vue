<template>
  <div
    class="bg-base-100 rounded-lg shadow-md p-4"
    role="region"
    aria-labelledby="search-menu-title"
  >
    <h2
      id="search-menu-title"
      class="text-xl font-semibold mb-4 text-base-content"
    >
      Search
    </h2>
    <nav role="navigation" aria-label="Menu de recherche">
      <ul class="menu menu-vertical w-full" role="menu">
        <li role="none">
          <NuxtLink
            to="/search"
            class="flex items-center gap-2 p-2 rounded hover:bg-base-200 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            role="menuitem"
            aria-label="Rechercher des missions et associations"
          >
            <Search class="w-5 h-5" aria-hidden="true" />
            <span>Search</span>
          </NuxtLink>
        </li>
        <li role="none">
          <NuxtLink
            to="/search/history"
            class="flex items-center gap-2 p-2 rounded hover:bg-base-200 focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:outline-none"
            role="menuitem"
            aria-label="Voir l'historique des recherches"
          >
            <Clock class="w-5 h-5" aria-hidden="true" />
            <span>Search History</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { Search, Clock } from 'lucide-vue-next'
</script>

<style scoped>
/* Amélioration de l'accessibilité pour les liens */
a:focus-visible {
  outline: 2px solid #eb5577;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Amélioration du contraste pour les utilisateurs en mode high-contrast */
@media (prefers-contrast: more) {
  .menu li a {
    border: 1px solid currentColor;
  }
}

/* Respect des préférences de réduction de mouvement */
@media (prefers-reduced-motion: reduce) {
  .menu li a {
    transition: none;
  }
}
</style>
