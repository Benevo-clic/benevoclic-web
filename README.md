# Benevoclic Web

Application web pour connecter les associations avec des bénévoles.

## Technologies

- Nuxt.js v3
- Vue.js
- Tailwind CSS et DaisyUI
- Firebase
- i18n (Français, Anglais, Espagnol)
- Pinia

## Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement sur le port 5482
npm run start

# Construire pour la production
npm run build

# Prévisualiser la build de production
npm run preview
```

## Docker

```bash
# Construire l'image Docker
docker build -t benevoclic-web .

# Exécuter le conteneur
docker run -p 5482:5482 benevoclic-web
```

## CI/CD

Le projet utilise GitHub Actions pour l'intégration continue et le déploiement continu. Voir [la documentation CI/CD](docs/CICD.md) pour plus de détails.

## Tests

```bash
# Exécuter les tests
npm test

# Exécuter les audits Lighthouse
npm run audit:all
```

## Documentation

- [CI/CD Pipeline](docs/CICD.md)
- [Optimisations de performance](PERFORMANCE_OPTIMIZATIONS.md)
- [Accessibilité et SEO](docs/ACCESSIBILITY_SEO_GUIDELINES.md)
