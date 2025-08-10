# Système de Permissions et Gestion des Cookies

## Vue d'ensemble

Ce système permet de gérer les autorisations d'accès aux ressources de l'application basées sur les préférences de cookies de l'utilisateur. Il garantit que l'application respecte les choix de l'utilisateur concernant ses données personnelles.

## Architecture

### Composants principaux

1. **`usePermissions`** - Composable principal pour gérer les permissions
2. **`CookieConsent`** - Bannière de consentement aux cookies
3. **`GlobalPermissionAlert`** - Système d'alertes globales
4. **Plugin `permissions.client.ts`** - Interception des APIs sensibles

### Types de cookies et permissions

| Type de cookie    | Permission           | Description                  |
| ----------------- | -------------------- | ---------------------------- |
| `essential`       | `canAuthenticate`    | Authentification et sécurité |
| `personalization` | `canUseLocation`     | Géolocalisation              |
| `personalization` | `canUsePersonalData` | Données personnelles         |
| `analytics`       | `canUseAnalytics`    | Analytics et statistiques    |
| `thirdParty`      | `canUseThirdParty`   | Services tiers               |

## Utilisation

### Vérifier les permissions

```typescript
import { usePermissions } from '~/composables/usePermissions'

const { hasPermission, permissions } = usePermissions()

// Vérifier une permission spécifique
if (hasPermission('canUseLocation')) {
  // Utiliser la géolocalisation
}

// Accéder à toutes les permissions
console.log(permissions.value)
```

### Gérer les préférences de cookies

```typescript
const { acceptAllCookies, rejectNonEssentialCookies, saveCookiePreferences } = usePermissions()

// Accepter tous les cookies
acceptAllCookies()

// Refuser les cookies non essentiels
rejectNonEssentialCookies()

// Personnaliser les préférences
saveCookiePreferences({
  essential: true,
  analytics: false,
  personalization: true,
  thirdParty: false
})
```

### Géolocalisation sécurisée

```typescript
import { useUserLocation } from '~/composables/useUserLocation'

const { getUserLocation, isLocationAllowed } = useUserLocation()

// Vérifier si la géolocalisation est autorisée
if (isLocationAllowed()) {
  const location = await getUserLocation()
}
```

### Authentification sécurisée

Le système vérifie automatiquement les permissions avant d'autoriser la connexion. Si les cookies essentiels ne sont pas acceptés, l'utilisateur verra une alerte.

## Fonctionnalités

### 1. Bannière de consentement

- S'affiche automatiquement si l'utilisateur n'a pas encore consenti
- Permet d'accepter tous les cookies ou de personnaliser
- Modal de paramétrage détaillé

### 2. Alertes de permissions

- Alertes contextuelles quand une permission est manquante
- Boutons directs vers les paramètres de cookies
- Fermeture automatique ou manuelle

### 3. Interception automatique

Le plugin intercepte automatiquement :

- `navigator.geolocation.getCurrentPosition()`
- `localStorage.setItem()` et `localStorage.getItem()`
- Tentatives d'authentification

### 4. Persistance des préférences

- Stockage dans `localStorage`
- Versioning des préférences
- Expiration automatique

## Intégration dans les composants

### Formulaire de connexion

```vue
<template>
  <div v-if="showCookieAlert" class="alert alert-warning">
    <h4>Cookies essentiels requis</h4>
    <p>Vous devez accepter les cookies essentiels pour vous connecter.</p>
    <button @click="openCookieSettings">Paramétrer les cookies</button>
  </div>
</template>

<script setup>
import { usePermissions } from '~/composables/usePermissions'

const { hasPermission } = usePermissions()

const handleLogin = async () => {
  if (!hasPermission('canAuthenticate')) {
    showCookieAlert.value = true
    return
  }
  // Procéder à la connexion
}
</script>
```

### Composant de géolocalisation

```vue
<template>
  <div v-if="!canUseLocation" class="alert alert-warning">
    <h4>Géolocalisation désactivée</h4>
    <p>Acceptez les cookies de personnalisation pour utiliser votre position.</p>
    <button @click="openCookieSettings">Paramétrer les cookies</button>
  </div>
</template>

<script setup>
import { usePermissions } from '~/composables/usePermissions'

const { hasPermission } = usePermissions()
const canUseLocation = computed(() => hasPermission('canUseLocation'))
</script>
```

## Événements personnalisés

Le système émet des événements pour la communication entre composants :

```javascript
// Écouter les changements de permissions
window.addEventListener('cookiePreferencesUpdated', event => {
  const preferences = event.detail
  // Réagir aux changements
})

// Écouter les refus de permissions
window.addEventListener('permissionDenied', event => {
  const { type, permission, message } = event.detail
  // Afficher une alerte appropriée
})

// Ouvrir les paramètres de cookies
window.dispatchEvent(new CustomEvent('openCookieSettings'))
```

## Configuration

### Personnaliser les permissions

Modifiez le fichier `composables/usePermissions.ts` pour ajuster les règles de permissions :

```typescript
const permissions = computed<PermissionState>(() => ({
  canAuthenticate: cookiePreferences.value.essential,
  canUseLocation: cookiePreferences.value.personalization,
  canUsePersonalData: cookiePreferences.value.personalization,
  canUseAnalytics: cookiePreferences.value.analytics,
  canUseThirdParty: cookiePreferences.value.thirdParty
}))
```

### Ajouter de nouveaux types de cookies

1. Étendre l'interface `CookiePreferences`
2. Ajouter la permission correspondante dans `PermissionState`
3. Mettre à jour la logique de calcul des permissions
4. Modifier les composants UI

## Tests

### Tester les permissions

```typescript
import { usePermissions } from '~/composables/usePermissions'

const { hasPermission, acceptAllCookies, rejectNonEssentialCookies } = usePermissions()

// Test avec tous les cookies acceptés
acceptAllCookies()
expect(hasPermission('canUseLocation')).toBe(true)

// Test avec cookies essentiels seulement
rejectNonEssentialCookies()
expect(hasPermission('canUseLocation')).toBe(false)
expect(hasPermission('canAuthenticate')).toBe(true)
```

## Bonnes pratiques

1. **Toujours vérifier les permissions** avant d'accéder aux ressources sensibles
2. **Fournir des alternatives** quand une permission est refusée
3. **Informer clairement l'utilisateur** de l'impact de ses choix
4. **Permettre de changer d'avis** facilement via les paramètres
5. **Respecter les préférences** même après redémarrage de l'application

## Conformité RGPD

Ce système aide à respecter le RGPD en :

- Obtenant un consentement explicite
- Permettant un contrôle granulaire
- Informant clairement de l'usage des données
- Facilitant la révocation du consentement
- Minimisant la collecte de données
