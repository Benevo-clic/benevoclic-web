# Intégration MapLibre GL JS dans Nuxt 3

## Installation

Les dépendances sont déjà installées dans le projet :
- `maplibre-gl` : Bibliothèque principale de MapLibre GL JS

## Structure des fichiers

### 1. Plugin MapLibre (`plugins/maplibre.client.ts`)
```typescript
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      maplibregl
    }
  }
})
```

### 2. Types TypeScript (`types/maplibre.d.ts`)
```typescript
declare module '#app' {
  interface NuxtApp {
    $maplibregl: any
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $maplibregl: any
  }
}
```

### 3. Configuration Nuxt (`nuxt.config.ts`)
```typescript
plugins: [
  { src: '~/plugins/maplibre.client.ts', mode: 'client' }
]
```

## Composant AddressMap

Le composant `components/AddressMap.vue` fournit :
- Un champ de recherche avec autocomplete
- Intégration avec l'API Adresse d'Étalab
- Affichage d'une carte MapLibre avec marqueur
- Gestion des suggestions d'adresses

### Fonctionnalités
- **Recherche d'adresses** : Utilise l'API `https://api-adresse.data.gouv.fr/search`
- **Autocomplete** : Suggestions en temps réel avec debounce
- **Carte interactive** : Basée sur OpenStreetMap
- **Marqueur cliquable** : Placement automatique sur les coordonnées sélectionnées
- **Redirection Google Maps** : Clic sur le marqueur ouvre Google Maps dans un nouvel onglet
- **Contrôles de zoom** : Boutons + et -, molette souris, double-clic
- **Navigation** : Déplacement de la carte par glisser-déposer

### Utilisation
```vue
<template>
  <AddressMap />
</template>
```

## Test

Accédez à `/map-test` pour tester le composant.

### Test de la redirection Google Maps
1. Recherchez une adresse (ex: "Paris", "Lyon")
2. Sélectionnez une adresse dans les suggestions
3. Cliquez sur le marqueur rouge sur la carte
4. Google Maps s'ouvrira dans un nouvel onglet avec l'adresse sélectionnée

### Test des contrôles de zoom
- **Boutons + et -** : Cliquez sur les boutons en haut à droite de la carte
- **Molette souris** : Utilisez la molette de votre souris sur la carte
- **Double-clic** : Double-cliquez sur la carte pour zoomer rapidement
- **Glisser-déposer** : Maintenez le clic et glissez pour déplacer la carte

## API Adresse d'Étalab

L'API utilisée est gratuite et ne nécessite pas de clé API :
- **URL** : `https://api-adresse.data.gouv.fr/search`
- **Paramètres** : `q` (requête), `limit` (nombre de résultats)
- **Réponse** : GeoJSON avec coordonnées et métadonnées

## Personnalisation

### Style de la carte
Modifiez l'objet `style` dans `initMap()` pour changer l'apparence de la carte.

### Limite de suggestions
Changez le paramètre `limit=5` dans l'URL de l'API pour ajuster le nombre de suggestions.

### Debounce
Modifiez la valeur `300` dans `setTimeout` pour ajuster le délai de recherche. 