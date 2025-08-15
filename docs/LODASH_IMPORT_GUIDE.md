# 🚨 Guide d'importation de Lodash - Benevoclic Web

## ❌ **PROBLÈME IDENTIFIÉ**

L'erreur suivante se produit lors de l'utilisation d'imports nommés de lodash :

```
Named export 'isEqual' not found. The requested module 'lodash' is a CommonJS module, which may not support all module.exports as named exports.
```

## ✅ **SOLUTION CORRECTE**

### **❌ Import incorrect (à éviter) :**
```typescript
import { isEqual } from 'lodash'
```

### **✅ Import correct :**
```typescript
import lodash from 'lodash'
```

### **✅ Utilisation correcte :**
```typescript
// Au lieu de : isEqual(form.value, initialForm.value)
// Utilisez : lodash.isEqual(form.value, initialForm.value)

const isFormChanged = computed(() => {
  return !lodash.isEqual(form.value, initialForm.value)
})
```

## 🔧 **FICHIERS CORRIGÉS**

1. **`pages/volunteer/account/edit.vue`** ✅
   - Import : `import lodash from 'lodash'`
   - Usage : `lodash.isEqual(form.value, initialForm.value)`

2. **`pages/association/account/edit.vue`** ✅
   - Import : `import lodash from 'lodash'`
   - Usage : `lodash.isEqual(form.value, initialForm.value)`

## 📋 **RÈGLES À SUIVRE**

### **1. Imports de lodash**
- ✅ **Toujours utiliser** : `import lodash from 'lodash'`
- ❌ **Jamais utiliser** : `import { functionName } from 'lodash'`

### **2. Utilisation des fonctions**
- ✅ **Toujours préfixer** : `lodash.functionName()`
- ❌ **Jamais utiliser directement** : `functionName()`

### **3. Fonctions couramment utilisées**
```typescript
// Comparaison d'objets
lodash.isEqual(obj1, obj2)

// Clonage profond
lodash.cloneDeep(obj)

// Fusion d'objets
lodash.merge(target, source)

// Vérification de valeurs
lodash.isEmpty(value)
lodash.isNil(value)
lodash.isUndefined(value)
```

## 🛠️ **VÉRIFICATION AUTOMATIQUE**

### **Script de vérification (à ajouter dans package.json) :**
```json
{
  "scripts": {
    "check:lodash": "grep -r \"import.*{.*}.*from.*lodash\" --include=\"*.vue\" --include=\"*.ts\" . || echo '✅ Aucun import incorrect trouvé'"
  }
}
```

### **Lint Rule (ESLint) :**
```javascript
// .eslintrc.cjs
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['lodash'],
            importNames: ['isEqual', 'cloneDeep', 'merge', 'isEmpty'],
            message: 'Utilisez "import lodash from \'lodash\'" au lieu d\'imports nommés'
          }
        ]
      }
    ]
  }
}
```

## 🎯 **BONNES PRATIQUES**

### **1. Import unique**
```typescript
// ✅ Bon : Un seul import pour toutes les fonctions
import lodash from 'lodash'

// ❌ Mauvais : Imports multiples
import { isEqual } from 'lodash'
import { cloneDeep } from 'lodash'
```

### **2. Utilisation cohérente**
```typescript
// ✅ Bon : Préfixe cohérent
const isChanged = !lodash.isEqual(form.value, initialForm.value)
const deepCopy = lodash.cloneDeep(data)

// ❌ Mauvais : Mélange d'approches
const isChanged = !isEqual(form.value, initialForm.value)
const deepCopy = lodash.cloneDeep(data)
```

### **3. Performance**
```typescript
// ✅ Bon : Import au niveau du module
import lodash from 'lodash'

// ❌ Mauvais : Import dans les fonctions
function compareData() {
  const { isEqual } = await import('lodash')
  return isEqual(data1, data2)
}
```

## 🔍 **DÉTECTION DU PROBLÈME**

### **Symptômes :**
1. Erreur de build : `Named export 'functionName' not found`
2. Erreur runtime : `Cannot read property 'functionName' of undefined`
3. Bundle size augmenté (imports multiples)

### **Diagnostic :**
```bash
# Rechercher les imports incorrects
grep -r "import.*{.*}.*from.*lodash" --include="*.vue" --include="*.ts" .

# Vérifier les utilisations directes
grep -r "isEqual(" --include="*.vue" --include="*.ts" . | grep -v "lodash.isEqual"
```

## 📚 **RESSOURCES**

- [Documentation Lodash](https://lodash.com/docs)
- [ESLint no-restricted-imports](https://eslint.org/docs/rules/no-restricted-imports)
- [CommonJS vs ES Modules](https://nodejs.org/api/modules.html)

---

**⚠️ IMPORTANT :** Toujours utiliser `import lodash from 'lodash'` pour éviter les problèmes de compatibilité CommonJS/ES Modules.
