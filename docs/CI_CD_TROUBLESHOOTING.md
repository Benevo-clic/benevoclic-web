# Guide de Résolution des Erreurs CI/CD - BenevoClic Web

## 🚨 Erreur : "Process completed with exit code 1"

### **Problème**
```
💾 Rapport sauvegardé: /home/runner/work/benevoclic-web/benevoclic-web/security-audit-report.json
Error: Process completed with exit code 1.
```

### **Cause**
Le pipeline CI/CD échoue car des issues de sécurité critiques ont été détectées lors de l'audit automatique.

## 🔧 Solutions

### 1. Vérification Locale

Exécutez l'audit de sécurité localement pour identifier les issues :

```bash
# Vérifier les issues de sécurité
npm run audit:security

# Vérifier les issues ESLint
npm run lint:security

# Vérifier les dépendances
npm audit --audit-level=moderate
```

### 2. Correction Automatique

Utilisez les scripts de correction automatique :

```bash
# Correction automatique complète
npm run auto:fix

# Correction des issues de sécurité spécifiques
npm run fix:security

# Correction ESLint
npm run lint:fix
```

### 3. Correction Manuelle

Pour les issues qui ne peuvent pas être corrigées automatiquement :

#### Issues Critiques Courantes

**1. Utilisation d'eval()**
```javascript
// ❌ Problématique
eval(userInput)

// ✅ Solution
// Utilisez des alternatives sécurisées
JSON.parse(userInput) // Si c'est du JSON
```

**2. Console.log en Production**
```javascript
// ❌ Problématique
console.log('Debug info')

// ✅ Solution
if (process.env.NODE_ENV !== 'production') {
  console.log('Debug info')
}
```

**3. Secrets Hardcodés**
```javascript
// ❌ Problématique
const apiKey = 'sk-1234567890abcdef'

// ✅ Solution
const apiKey = process.env.API_KEY
```

### 4. Workflow GitHub Actions

#### Workflow d'Audit de Sécurité
- **Fichier :** `.github/workflows/security-audit.yml`
- **Déclencheur :** Push, PR, et hebdomadaire
- **Action :** Audit automatique avec rapport

#### Workflow de Correction Automatique
- **Fichier :** `.github/workflows/auto-fix-security.yml`
- **Déclencheur :** Manuel (workflow_dispatch)
- **Action :** Correction automatique + commit

### 5. Scripts Disponibles

```bash
# Audit et diagnostic
npm run audit:security      # Audit complet
npm run check:env          # Vérification environnement
npm run lint:security      # ESLint sécurité

# Correction automatique
npm run auto:fix           # Correction complète
npm run fix:security       # Correction sécurité
npm run fix:broken         # Correction fichiers cassés
npm run lint:fix           # Correction ESLint

# Configuration
npm run setup:env          # Générer .env
```

## 📊 Niveaux de Sévérité

### 🚨 Critique
- **Impact :** Vulnérabilité majeure
- **Action :** Correction immédiate requise
- **Pipeline :** Échoue automatiquement

### ⚠️ Élevé
- **Impact :** Vulnérabilité importante
- **Action :** Correction prioritaire
- **Pipeline :** Avertissement

### ⚡ Moyen
- **Impact :** Vulnérabilité modérée
- **Action :** Correction planifiée
- **Pipeline :** Avertissement

### ℹ️ Faible
- **Impact :** Vulnérabilité mineure
- **Action :** Correction optionnelle
- **Pipeline :** Information

## 🔍 Diagnostic Avancé

### 1. Analyse du Rapport

Le rapport de sécurité est sauvegardé dans `security-audit-report.json` :

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "summary": {
    "totalIssues": 15,
    "critical": 2,
    "high": 5,
    "medium": 6,
    "low": 2
  },
  "issues": [
    {
      "severity": "CRITICAL",
      "pattern": "eval() usage",
      "file": "scripts/security-audit.js",
      "description": "Usage of eval() function",
      "count": 1
    }
  ]
}
```

### 2. Filtrage des Issues

```bash
# Issues critiques seulement
npm run audit:security | grep "CRITICAL"

# Issues par fichier
npm run audit:security | grep "filename.js"
```

### 3. Correction Sélective

```bash
# Corriger seulement les issues moyennes et faibles
npm run fix:security

# Corriger les fichiers spécifiques
npm run lint:fix -- components/SpecificComponent.vue
```

## 🚀 Déploiement Sécurisé

### 1. Pré-déploiement

```bash
# Vérifications obligatoires
npm run check:env          # Environnement
npm run audit:security     # Sécurité
npm run test               # Tests
npm run build              # Build
```

### 2. Pipeline de Production

```yaml
# .github/workflows/deploy.yml
- name: Security Check
  run: npm run audit:security
  continue-on-error: false  # Échoue si issues critiques

- name: Auto Fix
  run: npm run auto:fix
  if: failure()

- name: Final Security Check
  run: npm run audit:security
  continue-on-error: false
```

### 3. Monitoring Post-déploiement

```bash
# Vérification continue
npm run audit:security     # Audit régulier
npm run check:env          # Configuration
```

## 📞 Support

### En Cas de Problème Persistant

1. **Vérifiez les logs GitHub Actions** dans l'onglet "Actions"
2. **Exécutez les diagnostics locaux** avec les scripts fournis
3. **Consultez la documentation** :
   - `docs/ENVIRONMENT_SETUP.md`
   - `docs/PRODUCTION_SETUP.md`
   - `docs/SOLUTION_SUMMARY.md`

### Ressources Utiles

- **GitHub Actions Logs :** `https://github.com/username/repo/actions`
- **Security Report :** `security-audit-report.json`
- **Documentation :** `docs/` directory

## ✅ Checklist de Résolution

- [ ] Audit de sécurité local exécuté
- [ ] Issues critiques identifiées
- [ ] Correction automatique tentée
- [ ] Correction manuelle effectuée si nécessaire
- [ ] Tests passent localement
- [ ] Pipeline CI/CD relancé
- [ ] Déploiement validé
