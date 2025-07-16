<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Test de la carte avec recherche d'adresse</h1>
    <p class="text-gray-600 mb-8">
      Testez la recherche d'adresses avec l'API Adresse d'Étalab et l'affichage sur une carte MapLibre.
      <br>
      <strong>Fonctionnalités :</strong>
      • Cliquez sur le marqueur rouge pour ouvrir l'adresse dans Google Maps
      • Utilisez les boutons + et - pour zoomer/dézoomer
      • Utilisez la molette de souris pour zoomer
      • Double-cliquez pour zoomer rapidement
    </p>

    <AddressMap />

    <div class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h2 class="text-lg font-semibold text-blue-800 mb-2">Instructions de test :</h2>
      <ol class="text-blue-700 text-sm space-y-1">
        <li>1. Tapez une adresse dans le champ de recherche (ex: "Paris", "Lyon", "Marseille")</li>
        <li>2. Sélectionnez une adresse dans les suggestions</li>
        <li>3. Un marqueur rouge apparaîtra sur la carte</li>
        <li>4. <strong>Cliquez sur le marqueur rouge</strong> pour ouvrir Google Maps</li>
        <li>5. <strong>Utilisez les contrôles de zoom</strong> : boutons +/-, molette souris, double-clic</li>
        <li>6. <strong>Déplacez la carte</strong> en maintenant le clic et en glissant</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
// Le composant AddressMap sera automatiquement importé grâce à l'auto-import de Nuxt
</script> 