# QWANYX Architecture Migration Plan

## 🎯 Objectif Final
Autodin ne doit consommer AUCUN composant directement de @qwanyx/ui
- Autodin → @qwanyx/app-core → @qwanyx/ui

## 🚨 PRINCIPES ABSOLUS (NE JAMAIS VIOLER)

### 1. Hiérarchie stricte des dépendances
```
@qwanyx/ui (atoms + molecules + organisms - NO business logic)
    ↓
packages (business logic, API calls, state management)
    ↓
apps (ONLY consume packages)
```

### 2. Règles de séparation

#### @qwanyx/ui PEUT contenir :
- **Atoms** : Composants de base (Button, Input, Text, Icon, Badge)
- **Molecules** : Compositions simples (Card, FormField, SearchBar)
- **Organisms** : Compositions complexes (Navbar, Sidebar, Modal, Forms)
- **PAS DE** : Logique métier, appels API, gestion d'état globale

#### On crée un PACKAGE séparé quand :
- Appels API nécessaires
- Logique métier complexe
- Gestion d'état/session
- Intégration backend
- Code conséquent avec dépendances

### 3. Documentation obligatoire dans CHAQUE fichier
```typescript
/**
 * 📦 PACKAGE: @qwanyx/[name]
 * 🎭 LEVEL: atom | molecule | organism | package
 * 🎯 PURPOSE: [What this does]
 * 🚫 FORBIDDEN: [What NOT to do here]
 * ✅ ALLOWED: [What CAN be done here]
 * 
 * 🤖 AI DIRECTIVE: [Specific rules for AI when editing this file]
 */
```

## 📋 PLAN DE MIGRATION

### ✅ Phase 0: Backups (COMPLETED)
- [x] Backup qwanyx-ui → qwanyx-ui-backup
- [x] Backup autodin → autodin-backup

### 🔄 Phase 1: Réorganiser @qwanyx/ui (IN PROGRESS)
**Objectif:** Structure atomic design claire dans @qwanyx/ui

#### Étape 1.1: Classifier les composants existants
```
atoms/
  ├── Button.tsx
  ├── Input.tsx
  ├── Text.tsx
  ├── Icon.tsx
  ├── Badge.tsx
  └── ...

molecules/
  ├── Card.tsx (Card + CardHeader + CardContent)
  ├── FormField.tsx
  ├── SearchBar.tsx
  └── ...

organisms/
  ├── Navbar.tsx (SimpleNavbar, SuperNavbar)
  ├── Sidebar.tsx
  ├── Modal.tsx
  ├── ContactForm.tsx
  └── ...
```

#### Étape 1.2: Décisions à prendre
- [ ] **Navbar** : Reste dans @qwanyx/ui/organisms ✓ (pas de business logic)
- [ ] **ServiceCard** : @qwanyx/ui/molecules ou package séparé ?
- [ ] **UserProfile** : @qwanyx/ui/organisms ou dans @qwanyx/dashboard ?
- [ ] **ContactForm** : @qwanyx/ui/organisms ✓ (juste UI)

### 🔄 Phase 2: Créer @qwanyx/app-core
**Objectif:** Package orchestrateur pour les apps business

#### Étape 2.1: Structure
```bash
packages/qwanyx-app-core/
├── package.json
├── src/
│   ├── index.ts         # Exports centralisés
│   ├── providers/       # Theme, Workspace, Auth context
│   ├── layouts/         # App layouts compositions
│   └── services/        # API integrations
```

**Ce que app-core fait :**
- Orchestre les packages (@qwanyx/auth, @qwanyx/dashboard)
- Fournit les providers configurés
- Expose une API simple pour les apps

#### Étape 2.2: Migrer Autodin
- [ ] Remplacer tous les imports @qwanyx/ui → @qwanyx/app-core
- [ ] Tester chaque fonctionnalité

### ⏳ Phase 3: Nettoyer les packages existants

#### @qwanyx/auth
- [ ] Vérifier qu'il n'utilise QUE @qwanyx/ui
- [ ] Pas de HTML natif
- [ ] Documentation AI

#### @qwanyx/dashboard
- [ ] Même vérifications
- [ ] Décider si UserProfile reste ici

#### @qwanyx/form
- [ ] Même vérifications

### ⏳ Phase 4: Validation finale
- [ ] Aucun import direct @qwanyx/ui dans Autodin
- [ ] Tous les composants documentés
- [ ] Tests de non-régression

## 📊 CLASSIFICATION ACTUELLE

### Composants à classifier dans @qwanyx/ui :

**Probablement Atoms :**
- Button, Input, Text, Icon, Badge, Checkbox, Radio, Switch

**Probablement Molecules :**
- Card (avec Header/Content), FormField, SearchBar, Alert

**Probablement Organisms :**
- Navbar (tous types), Sidebar, Modal, ContactForm, DashboardLayout

**À décider :**
- ServiceCard : molecule ou package métier ?
- UserProfile : organism ou dans dashboard ?
- ThemeProvider : dans ui ou app-core ?

## 🔍 VALIDATION À CHAQUE ÉTAPE

1. **Build réussi:** `npm run build`
2. **App démarre:** `npm run dev`
3. **Fonctionnalité testée:** Tester manuellement
4. **Pas de régression:** Comparer avec backup
5. **Documentation à jour:** Vérifier les commentaires

## 📝 TEMPLATES DE DOCUMENTATION

### Pour @qwanyx/ui atoms:
```typescript
/**
 * 📦 PACKAGE: @qwanyx/ui
 * 🎭 LEVEL: atom
 * 🎯 PURPOSE: Basic UI element, no composition
 * 🚫 FORBIDDEN: 
 *   - Importing other components
 *   - Business logic
 *   - API calls
 * ✅ ALLOWED:
 *   - Style props
 *   - Basic event handlers
 * 
 * 🤖 AI DIRECTIVE: This is an ATOM. Keep it simple and pure.
 * No dependencies on other components.
 */
```

### Pour @qwanyx/ui molecules:
```typescript
/**
 * 📦 PACKAGE: @qwanyx/ui
 * 🎭 LEVEL: molecule
 * 🎯 PURPOSE: Composition of atoms
 * 🚫 FORBIDDEN:
 *   - Business logic
 *   - API calls
 *   - Complex state management
 * ✅ ALLOWED:
 *   - Import atoms
 *   - Simple composition
 *   - Local state for UI only
 * 
 * 🤖 AI DIRECTIVE: This is a MOLECULE. 
 * Compose atoms but no business logic.
 */
```

### Pour @qwanyx/ui organisms:
```typescript
/**
 * 📦 PACKAGE: @qwanyx/ui
 * 🎭 LEVEL: organism
 * 🎯 PURPOSE: Complex UI composition
 * 🚫 FORBIDDEN:
 *   - Business logic
 *   - Direct API calls
 *   - Authentication logic
 * ✅ ALLOWED:
 *   - Import atoms and molecules
 *   - Complex composition
 *   - UI state management
 * 
 * 🤖 AI DIRECTIVE: This is an ORGANISM.
 * Complex UI but still no business logic.
 */
```

### Pour packages métier:
```typescript
/**
 * 📦 PACKAGE: @qwanyx/[name]
 * 🎭 LEVEL: package (business)
 * 🎯 PURPOSE: [Business purpose]
 * 🚫 FORBIDDEN:
 *   - Direct HTML elements
 *   - Bypass @qwanyx/ui
 * ✅ ALLOWED:
 *   - Use @qwanyx/ui components
 *   - API calls
 *   - Business logic
 *   - State management
 * 
 * 🤖 AI DIRECTIVE: Business package.
 * Use ONLY @qwanyx/ui for UI needs.
 */
```

## 🚀 COMMANDES UTILES

```bash
# Vérifier les imports interdits
grep -r "from '@qwanyx/ui'" apps/autodin/src

# Vérifier les HTML natifs dans packages
grep -r "<div\|<button\|<input\|<span" packages/*/src

# Rebuild packages
cd packages/qwanyx-app-core && npm run build

# Test Autodin
cd apps/autodin && npm run dev
```

## 📅 HISTORIQUE DES DÉCISIONS

| Date | Décision | Raison |
|------|----------|---------|
| 2024-08-19 | @qwanyx/ui peut avoir atoms+molecules+organisms | Simplification, tant que pas de business logic |
| 2024-08-19 | Packages séparés seulement si API/logique métier | Éviter sur-ingénierie |

## ⚠️ POINTS D'ATTENTION

1. **Navbar/Sidebar** : Peuvent rester dans @qwanyx/ui car purement UI
2. **ServiceCard** : Si spécifique à marketplace → package séparé
3. **Variables CSS** : Doivent permettre theming depuis les apps
4. **Rétrocompatibilité** : Migration progressive, pas de breaking changes

---

**DERNIÈRE MISE À JOUR:** 2024-08-19
**PROCHAINE ÉTAPE:** Classifier les composants dans @qwanyx/ui (atoms/molecules/organisms)