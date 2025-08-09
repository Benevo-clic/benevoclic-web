# Guide d'Accessibilité - Benevoclic

## 🎯 Objectifs

- Score d'accessibilité minimum : 90/100
- Conformité WCAG 2.1 AA
- Support complet des lecteurs d'écran

## 📋 Checklist d'Accessibilité

### ✅ Structure HTML

- [ ] Attribut lang="fr" sur la balise html
- [ ] Titre h1 principal sur chaque page
- [ ] Structure de titres logique (h1 → h2 → h3)
- [ ] Éléments sémantiques (main, nav, section, article)

### ✅ Images

- [ ] Attribut alt descriptif sur toutes les images
- [ ] Images décoratives avec alt=""
- [ ] Images complexes avec aria-describedby

### ✅ Formulaires

- [ ] Labels associés à tous les champs
- [ ] Messages d'erreur avec aria-describedby
- [ ] Champs requis avec aria-required
- [ ] Validation en temps réel

### ✅ Navigation

- [ ] Skip links pour passer la navigation
- [ ] Navigation au clavier fonctionnelle
- [ ] Ordre de tabulation logique
- [ ] Focus visible sur tous les éléments

### ✅ Contraste et Couleurs

- [ ] Ratio de contraste minimum 4.5:1
- [ ] Mode contraste élevé disponible
- [ ] Informations non transmises uniquement par la couleur

### ✅ Lecteurs d'écran

- [ ] Attributs ARIA appropriés
- [ ] Annonces dynamiques avec aria-live
- [ ] Rôles sémantiques corrects
- [ ] Textes alternatifs descriptifs

## 🛠️ Outils de Test

### Tests Automatiques

```bash
# Test d'accessibilité
node scripts/test-a11y.js

# Correction automatique
node scripts/fix-a11y.js
```

### Tests Manuels

1. **Navigation au clavier** : Tab, Shift+Tab, Entrée, Espace
2. **Lecteur d'écran** : NVDA, JAWS, VoiceOver
3. **Contraste** : Outils de vérification de contraste
4. **Zoom** : Test à 200% et 400%

## 📚 Ressources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Web Accessibility Initiative](https://www.w3.org/WAI/)

## 🔧 Composants Accessibles

### AccessibleTitle

```vue
<AccessibleTitle level="1" class="text-2xl">
  Titre principal
</AccessibleTitle>
```

### AccessibleButton

```vue
<AccessibleButton
  variant="primary"
  aria-label="Action principale"
  @click="handleClick"
>
  Texte du bouton
</AccessibleButton>
```

### AccessibleImage

```vue
<AccessibleImage
  src="/image.jpg"
  alt="Description de l'image"
  width="300"
  height="200"
/>
```

### AccessibleForm

```vue
<AccessibleForm aria-label="Formulaire de contact" @submit="handleSubmit">
  <!-- Champs du formulaire -->
</AccessibleForm>
```

## 🚀 Améliorations Futures

1. **Tests automatisés** : Intégrer axe-core dans les tests
2. **Monitoring** : Suivi continu du score d'accessibilité
3. **Formation** : Sessions de formation pour l'équipe
4. **Audit régulier** : Tests utilisateurs avec des personnes en situation de handicap
