# Guide de Tests - Benevoclic Web

Ce document décrit la stratégie de tests unitaires pour le projet Benevoclic Web.

## 📋 Vue d'ensemble

### Objectifs des tests
- **Validation fonctionnelle** : Vérifier que les composants fonctionnent correctement
- **Prévention des régressions** : Détecter les bugs avant qu'ils n'atteignent la production
- **Documentation vivante** : Les tests servent de documentation du comportement attendu
- **Refactoring sécurisé** : Permettre les modifications de code en toute confiance

### Couverture de tests
- **Composants Vue** : Tests unitaires pour tous les composants principaux
- **Logique métier** : Tests des fonctions utilitaires et des stores
- **Accessibilité** : Tests des fonctionnalités d'accessibilité
- **Responsive** : Tests de l'adaptation mobile/desktop

## 🧪 Structure des tests

### Organisation des fichiers
```
test/
├── components/           # Tests des composants Vue
│   ├── VolunteerAnnouncementCard.test.ts
│   ├── NoConnectedAnnouncementCard.test.ts
│   ├── Header.test.ts
│   ├── CookieConsent.test.ts
│   ├── MultiMarkerMap.test.ts
│   ├── Login.test.ts
│   └── VolunteerEventFilters.test.ts
├── setup.ts             # Configuration globale des tests
└── run-all-tests.js     # Script d'exécution de tous les tests
```

### Composants testés

#### 1. VolunteerAnnouncementCard
- ✅ Rendu correct des données d'annonce
- ✅ Affichage du nombre de volontaires
- ✅ Gestion des tags et badges
- ✅ Événements de favoris
- ✅ Formatage des dates
- ✅ Gestion des données manquantes

#### 2. NoConnectedAnnouncementCard
- ✅ Rendu pour utilisateurs non connectés
- ✅ Affichage des informations essentielles
- ✅ Gestion des cas d'erreur
- ✅ Accessibilité

#### 3. Header
- ✅ Navigation responsive
- ✅ Gestion de l'authentification
- ✅ Menu mobile
- ✅ Thème sombre/clair
- ✅ Navigation au clavier

#### 4. CookieConsent
- ✅ Affichage de la bannière
- ✅ Gestion des préférences
- ✅ Boutons d'action
- ✅ Accessibilité ARIA

#### 5. MultiMarkerMap
- ✅ Initialisation de la carte
- ✅ Ajout de marqueurs
- ✅ Événements de clic
- ✅ Popups informatifs
- ✅ Gestion des coordonnées invalides

#### 6. Login
- ✅ Validation des formulaires
- ✅ Gestion des erreurs
- ✅ États de chargement
- ✅ Connexion Google
- ✅ Accessibilité

#### 7. VolunteerEventFilters
- ✅ Filtres de recherche
- ✅ Sélection de dates
- ✅ Géolocalisation
- ✅ Tags et statuts
- ✅ Validation des données

## 🚀 Exécution des tests

### Commandes disponibles

```bash
# Tests de base
npm test

# Tests des composants uniquement
npm run test:components

# Tous les tests avec rapport détaillé
npm run test:all

# Tests avec couverture de code
npm run test:coverage

# Tests d'accessibilité
npm run test:a11y
```

### Configuration des tests

#### Vitest (Configuration principale)
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./test/setup.ts']
  }
})
```

#### Couverture de code
```typescript
// vitest.config.coverage.ts
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html'],
  thresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
}
```

## 📊 Métriques de qualité

### Seuils de couverture
- **Branches** : 70%
- **Fonctions** : 70%
- **Lignes** : 70%
- **Statements** : 70%

### Types de tests par composant

| Composant | Tests unitaires | Tests d'intégration | Tests d'accessibilité |
|-----------|----------------|-------------------|---------------------|
| VolunteerAnnouncementCard | ✅ 8 tests | ✅ 2 tests | ✅ 3 tests |
| NoConnectedAnnouncementCard | ✅ 6 tests | ✅ 1 test | ✅ 2 tests |
| Header | ✅ 8 tests | ✅ 2 tests | ✅ 4 tests |
| CookieConsent | ✅ 10 tests | ✅ 2 tests | ✅ 3 tests |
| MultiMarkerMap | ✅ 12 tests | ✅ 3 tests | ✅ 2 tests |
| Login | ✅ 12 tests | ✅ 3 tests | ✅ 4 tests |
| VolunteerEventFilters | ✅ 15 tests | ✅ 4 tests | ✅ 3 tests |

**Total** : 71 tests unitaires, 17 tests d'intégration, 21 tests d'accessibilité

## 🔧 Bonnes pratiques

### Structure d'un test
```typescript
describe('NomDuComposant', () => {
  // Configuration
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Tests de rendu
  it('should render correctly', () => {
    const wrapper = mount(Component)
    expect(wrapper.exists()).toBe(true)
  })

  // Tests d'interaction
  it('should handle user interaction', async () => {
    const wrapper = mount(Component)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('event')).toBeTruthy()
  })

  // Tests d'accessibilité
  it('should be accessible', () => {
    const wrapper = mount(Component)
    expect(wrapper.find('[role="button"]').exists()).toBe(true)
  })
})
```

### Mocks et stubs
```typescript
// Mock des composables
vi.mock('~/composables/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { role: 'VOLUNTEER' }
  })
}))

// Stub des composants Nuxt
global: {
  stubs: {
    'NuxtLink': true,
    'NuxtImg': true,
    'ClientOnly': {
      template: '<div><slot /></div>'
    }
  }
}
```

### Tests d'accessibilité
```typescript
it('should have proper ARIA attributes', () => {
  const wrapper = mount(Component)
  expect(wrapper.find('[role="button"]').exists()).toBe(true)
  expect(wrapper.find('[aria-label]').exists()).toBe(true)
})
```

## 📈 Rapports et métriques

### Génération de rapports
```bash
# Rapport HTML de couverture
npm run test:coverage

# Rapport JSON détaillé
npm run test:all
```

### Métriques importantes
- **Taux de réussite** : > 95%
- **Couverture de code** : > 70%
- **Temps d'exécution** : < 30 secondes
- **Tests d'accessibilité** : 100% des composants

## 🐛 Dépannage

### Problèmes courants

#### 1. Erreurs de mock
```bash
# Solution : Vérifier les imports
vi.mock('~/composables/useAuth')
```

#### 2. Erreurs de composants Nuxt
```bash
# Solution : Ajouter les stubs appropriés
stubs: {
  'NuxtLink': true,
  'NuxtImg': true
}
```

#### 3. Erreurs de timing
```bash
# Solution : Utiliser await pour les événements asynchrones
await wrapper.find('button').trigger('click')
```

### Debug des tests
```bash
# Mode debug
npm test -- --reporter=verbose

# Tests spécifiques
npm test -- VolunteerAnnouncementCard
```

## 🔄 Intégration continue

### GitHub Actions
```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm run test:all

- name: Generate coverage report
  run: npm run test:coverage
```

### Pré-commit hooks
```json
// package.json
"husky": {
  "hooks": {
    "pre-commit": "npm run test:components"
  }
}
```

## 📚 Ressources

- [Documentation Vitest](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Guide d'accessibilité WCAG](https://www.w3.org/WAI/WCAG21/quickref/)
- [Happy DOM](https://github.com/capricorn86/happy-dom)

## 🎯 Objectifs futurs

- [ ] Tests E2E avec Playwright
- [ ] Tests de performance
- [ ] Tests de sécurité
- [ ] Tests de compatibilité navigateur
- [ ] Tests de charge
- [ ] Tests de régression visuelle 