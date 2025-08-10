# Guide d'Accessibilité et SEO - Benevoclic

## Table des matières

1. [Accessibilité (A11y)](#accessibilité-a11y)
2. [SEO (Search Engine Optimization)](#seo-search-engine-optimization)
3. [Modules Nuxt utilisés](#modules-nuxt-utilisés)
4. [Audit automatique](#audit-automatique)
5. [Bonnes pratiques](#bonnes-pratiques)

## Accessibilité (A11y)

### Principes fondamentaux

- **Perceptible** : L'information doit être présentable de manière à ce que les utilisateurs puissent la percevoir
- **Utilisable** : Les composants de l'interface utilisateur doivent être utilisables
- **Compréhensible** : L'information et l'utilisation de l'interface utilisateur doivent être compréhensibles
- **Robuste** : Le contenu doit être suffisamment robuste pour être interprété de manière fiable par une large variété d'agents utilisateurs

### Implémentation dans le projet

#### 1. Structure sémantique

```html
<!-- ✅ Bon -->
<main role="main" aria-label="Contenu principal">
  <section aria-labelledby="section-title">
    <h2 id="section-title">Titre de section</h2>
    <!-- Contenu -->
  </section>
</main>

<!-- ❌ Éviter -->
<div class="main-content">
  <div class="section">
    <div class="title">Titre de section</div>
    <!-- Contenu -->
  </div>
</div>
```

#### 2. Navigation clavier

- Tous les éléments interactifs doivent être accessibles au clavier
- Ordre de tabulation logique
- Indicateurs de focus visibles
- Gestion des raccourcis clavier

#### 3. Attributs ARIA

```html
<!-- Boutons -->
<button aria-expanded="false" aria-controls="menu-id" aria-label="Ouvrir le menu">Menu</button>

<!-- Formulaires -->
<label for="email">Email</label>
<input id="email" type="email" aria-describedby="email-help" aria-required="true" />
<div id="email-help">Format: exemple@domaine.com</div>

<!-- Images -->
<img src="logo.png" alt="Logo Benevoclic - Retour à l'accueil" width="150" height="50" />
```

#### 4. Contraste et couleurs

- Ratio de contraste minimum de 4.5:1 pour le texte normal
- Ratio de contraste minimum de 3:1 pour le texte large
- Ne pas utiliser uniquement la couleur pour transmettre l'information

#### 5. Textes alternatifs

- Images décoratives : `alt=""`
- Images informatives : description claire et concise
- Images complexes : description détaillée

### Composants accessibles créés

#### AccessibilityProvider.vue

- Liens de saut pour la navigation
- Annonceur de statut pour les lecteurs d'écran
- Gestion du focus trap

#### AccessibleNavigation.vue

- Navigation clavier complète
- Menus déroulants accessibles
- Support mobile avec hamburger menu

## SEO (Search Engine Optimization)

### Métadonnées essentielles

#### 1. Balises meta de base

```html
<meta name="description" content="Description unique et attractive (150-160 caractères)" />
<meta name="keywords" content="mots-clés, pertinents, séparés, par, des, virgules" />
<meta name="author" content="Benevoclic" />
<meta name="robots" content="index, follow" />
```

#### 2. Open Graph (Facebook, LinkedIn)

```html
<meta property="og:title" content="Titre de la page" />
<meta property="og:description" content="Description pour les réseaux sociaux" />
<meta property="og:image" content="https://www.benevoclic.fr/image.jpg" />
<meta property="og:url" content="https://www.benevoclic.fr/page" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Benevoclic" />
```

#### 3. Twitter Cards

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Titre pour Twitter" />
<meta name="twitter:description" content="Description pour Twitter" />
<meta name="twitter:image" content="https://www.benevoclic.fr/image.jpg" />
```

### Données structurées (Schema.org)

#### 1. Organisation

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Benevoclic",
  "url": "https://www.benevoclic.fr",
  "logo": "https://www.benevoclic.fr/logo.png",
  "description": "Plateforme de bénévolat"
}
```

#### 2. Site web

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Benevoclic",
  "url": "https://www.benevoclic.fr",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.benevoclic.fr/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

#### 3. Événements

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Événement de bénévolat",
  "startDate": "2024-01-15T10:00:00",
  "endDate": "2024-01-15T16:00:00",
  "location": {
    "@type": "Place",
    "name": "Lieu de l'événement",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Rue Example",
      "addressLocality": "Paris",
      "postalCode": "75001",
      "addressCountry": "FR"
    }
  }
}
```

### Sitemap et robots.txt

#### 1. Sitemap automatique

- Généré automatiquement par `@nuxtjs/sitemap`
- Inclut toutes les pages publiques
- Exclut les pages privées et API

#### 2. Robots.txt

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /auth/
Sitemap: https://www.benevoclic.fr/sitemap.xml
```

## Modules Nuxt utilisés

### 1. @nuxtjs/robots

- Génération automatique du robots.txt
- Configuration des règles d'indexation

### 2. @nuxtjs/sitemap

- Génération automatique du sitemap.xml
- Support des routes dynamiques
- Configuration des priorités et fréquences

### 3. @nuxtjs/seo

- Gestion automatique des métadonnées
- Configuration par défaut et par page
- Support des réseaux sociaux

### 4. nuxt-schema-org

- Injection automatique des données structurées
- Support de tous les types Schema.org
- Configuration flexible

### 5. @nuxtjs/color-mode

- Support du mode sombre/clair
- Respect des préférences utilisateur
- Amélioration de l'accessibilité

### 6. @nuxtjs/google-fonts

- Optimisation du chargement des polices
- Support du display swap
- Amélioration des performances

### 7. @nuxtjs/partytown

- Exécution des scripts tiers dans un Web Worker
- Amélioration des performances
- Réduction du blocage du thread principal

## Audit automatique

### Scripts disponibles

```bash
# Audit complet
npm run audit:all

# Audit d'accessibilité uniquement
npm run audit:a11y

# Audit SEO uniquement
npm run audit:seo

# Audit Lighthouse complet
npm run audit:lighthouse
```

### Configuration Lighthouse CI

- **Performance** : Score minimum 0.8
- **Accessibilité** : Score minimum 0.9
- **Bonnes pratiques** : Score minimum 0.8
- **SEO** : Score minimum 0.8

### Métriques surveillées

- First Contentful Paint (FCP) < 2s
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1
- Total Blocking Time (TBT) < 300ms
- Speed Index < 2s

## Bonnes pratiques

### Accessibilité

#### 1. Formulaires

```html
<!-- ✅ Bon -->
<fieldset>
  <legend>Informations personnelles</legend>
  <label for="name">Nom complet</label>
  <input id="name" type="text" required aria-describedby="name-help" />
  <div id="name-help">Votre nom complet tel qu'il apparaît sur vos documents</div>
</fieldset>

<!-- ❌ Éviter -->
<div>
  <div>Nom complet</div>
  <input type="text" required />
</div>
```

#### 2. Navigation

```html
<!-- ✅ Bon -->
<nav aria-label="Navigation principale">
  <ul role="menubar">
    <li role="none">
      <a role="menuitem" href="/" aria-current="page">Accueil</a>
    </li>
  </ul>
</nav>
```

#### 3. Images

```html
<!-- ✅ Bon -->
<img
  src="chart.png"
  alt="Graphique montrant l'évolution des dons de 2020 à 2024"
  width="600"
  height="400"
/>

<!-- Pour les images décoratives -->
<img src="decoration.png" alt="" aria-hidden="true" />
```

### SEO

#### 1. Structure des URLs

```
✅ https://www.benevoclic.fr/events/2024/01/15/event-name
❌ https://www.benevoclic.fr/events?id=123&date=2024-01-15
```

#### 2. Hiérarchie des titres

```html
<h1>Titre principal de la page</h1>
<h2>Sous-section importante</h2>
<h3>Détails de la sous-section</h3>
```

#### 3. Liens internes

```html
<!-- ✅ Bon -->
<a href="/events/volunteer-mission">Mission de bénévolat</a>

<!-- ❌ Éviter -->
<a href="/events/123">Cliquez ici</a>
```

#### 4. Optimisation des images

```html
<img
  src="event.jpg"
  alt="Événement de bénévolat dans un parc"
  width="800"
  height="600"
  loading="lazy"
/>
```

### Performance

#### 1. Lazy loading

```html
<img src="image.jpg" loading="lazy" alt="Description" />
<iframe src="video.html" loading="lazy"></iframe>
```

#### 2. Préchargement

```html
<link rel="preload" href="critical.css" as="style" />
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin />
```

#### 3. Compression

- Activation de la compression gzip/brotli
- Optimisation des images (WebP, AVIF)
- Minification du CSS/JS

## Tests et validation

### Outils recommandés

1. **Lighthouse** : Audit complet (Performance, Accessibilité, SEO, Bonnes pratiques)
2. **axe-core** : Tests d'accessibilité automatisés
3. **WAVE** : Évaluateur d'accessibilité web
4. **Google Search Console** : Monitoring SEO
5. **Schema.org Validator** : Validation des données structurées

### Intégration continue

```yaml
# .github/workflows/audit.yml
name: Audit A11y et SEO
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run audit:all
```

## Ressources supplémentaires

### Accessibilité

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org/)

### SEO

- [Google SEO Guide](https://developers.google.com/search/docs)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)

### Performance

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PageSpeed Insights](https://pagespeed.web.dev/)
