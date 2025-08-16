# QWANYX Micro-Frontend Architecture

## Vue d'ensemble

QWANYX utilise une architecture de micro-frontends basée sur Module Federation permettant de créer des applications modulaires, réutilisables et indépendantes.

## Concepts Fondamentaux

### 1. Distinction entre qwanyx-ui et qwanyx-modules

#### qwanyx-ui (Dépendance NPM) - Composants atomiques/primitifs

**Caractéristiques :**
- Installé via npm/yarn comme dépendance classique
- Composants UI de base réutilisables
- Optimisé au build time avec tree-shaking
- TypeScript avec autocomplétion complète
- Versionné via npm

**Exemples de composants pour qwanyx-ui :**
- **Inputs de base** : Input, TextArea, Select, Checkbox, Radio
- **Boutons et actions** : Button, IconButton, FAB
- **Layout** : Card, Container, Grid, Divider
- **Navigation** : Tabs, Breadcrumb, Pagination
- **Feedback** : Alert, Toast, Progress, Spinner
- **Overlay** : Modal, Tooltip, Popover, Dropdown
- **Data display** : Table, List, Avatar, Badge, Tag
- **Pickers simples** : DatePicker, TimePicker, ColorPicker
- **Contrôles** : Slider, Switch, Rating

**Règle simple** : "Est-ce que ça pourrait être dans Material-UI ou Ant Design ?"
Si OUI → qwanyx-ui

#### qwanyx-modules (Module Federation) - Composants métier/complexes

**Caractéristiques :**
- Exposé via Module Federation
- Features métier complètes
- Chargement dynamique à la demande
- Mise à jour sans rebuild des apps
- Peut être déployé indépendamment

**Exemples de modules pour qwanyx-modules :**
- **Calendriers avancés** : Calendar avec événements, Scheduler avec drag & drop
- **Éditeurs** : ImageEditor, TextEditor riche, CodeEditor, WorkflowEditor
- **Gestionnaires** : FileManager, ProjectManager, TaskManager
- **Dashboards** : DashboardAutodin, DashboardAnalytics, DashboardKPI
- **Builders** : FormBuilder, ChartBuilder, ReportBuilder
- **Grilles avancées** : DataGrid avec tri/filtre/export, PivotTable
- **Outils métier** : TimeTracker, InvoiceGenerator, InventoryManager

**Règle simple** : "Est-ce que c'est une feature métier ou un outil complet ?"
Si OUI → qwanyx-modules

#### Exemples de distinction

| Composant | Destination | Raison |
|-----------|------------|---------|
| DatePicker (choisir une date) | qwanyx-ui | Composant UI basique |
| Calendar (gérer des événements) | qwanyx-modules | Feature métier complète |
| ColorPicker (choisir #FF0000) | qwanyx-ui | Input simple |
| ThemeBuilder (créer un thème) | qwanyx-modules | Outil complet |
| ProgressBar | qwanyx-ui | Affichage simple |
| ProjectProgressDashboard | qwanyx-modules | Dashboard métier |
| TimePicker (choisir 14:30) | qwanyx-ui | Input basique |
| TimeTracker (tracker son temps) | qwanyx-modules | Application métier |

### 2. Architecture en Couches

```
┌─────────────────────────────────────────────┐
│           app-shell (Squelette)             │
│  - Charge configuration                     │
│  - Setup authentification                   │
│  - Configure thème                          │
│  - Charge modules dynamiquement             │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│         qwanyx-modules (Host)               │
│  - Expose tous les modules                  │
│  - Dashboards, éditeurs, widgets            │
│  - Framework agnostique                     │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│          qwanyx-ui (Composants)             │
│  - Composants UI de base                    │
│  - Système de thème configurable            │
│  - Styles adaptatifs                        │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│          qwanyx-api (Backend)               │
│  - Authentification JWT                     │
│  - Gestion des workspaces                   │
│  - Données par utilisateur                  │
└─────────────────────────────────────────────┘
```

### 3. Module Federation

**Configuration Host (qwanyx-modules):**
```javascript
// vite.config.ts
federation({
  name: 'qwanyx-modules',
  filename: 'remoteEntry.js',
  exposes: {
    // Modules métier
    './DashboardAutodin': './src/modules/autodin/DashboardAutodin',
    './DashboardDemandes': './src/modules/autodin/DashboardDemandes',
    
    // Modules génériques
    './TextEditor': './src/modules/shared/TextEditor',
    './ImageEditor': './src/modules/shared/ImageEditor',
    
    // Composants de layout
    './NavbarAutodin': './src/modules/autodin/Navbar',
    './HomeAutodin': './src/modules/autodin/Home',
    
    // Hooks partagés
    './hooks/useAuth': './src/hooks/useAuth',
    './hooks/useWorkspace': './src/hooks/useWorkspace'
  },
  shared: {
    'react': { singleton: true },
    'react-dom': { singleton: true },
    '@qwanyx/ui': { singleton: true }
  }
})
```

**Configuration Consumer (app-shell ou site spécifique):**
```javascript
federation({
  name: 'app-shell',
  remotes: {
    'qwanyx-modules': 'http://localhost:5000/assets/remoteEntry.js'
  },
  shared: {
    'react': { singleton: true },
    'react-dom': { singleton: true },
    '@qwanyx/ui': { singleton: true }
  }
})
```

### 4. Configuration par Site

**Structure de configuration (config-autodin.json):**
```json
{
  "workspace": "autodin-be",
  "api_url": "http://api.qwanyx.com",
  "theme": "theme-autodin.json",
  "modules": {
    "navbar": "qwanyx-modules/NavbarAutodin",
    "home": "qwanyx-modules/HomeAutodin",
    "auth": "qwanyx-modules/AuthAutodin",
    "dashboard": {
      "main": "qwanyx-modules/DashboardAutodin",
      "demandes": "qwanyx-modules/DashboardDemandes",
      "recherche": "qwanyx-modules/DashboardRecherche"
    },
    "tools": {
      "imageEditor": "qwanyx-modules/ImageEditor",
      "fileManager": "qwanyx-modules/FileManager"
    }
  },
  "routes": [
    { "path": "/", "module": "home" },
    { "path": "/dashboard", "module": "dashboard.main", "protected": true },
    { "path": "/dashboard/demandes", "module": "dashboard.demandes", "protected": true },
    { "path": "/tools/edit-image", "module": "tools.imageEditor", "protected": true }
  ],
  "permissions": {
    "dashboard": ["user", "admin"],
    "tools.imageEditor": ["pro", "admin"]
  }
}
```

### 5. Système de Multilinguisme

**Centralisation dans qwanyx-ui :**
```typescript
// qwanyx-ui/src/i18n/index.ts
export const useTranslation = () => {
  const [locale, setLocale] = useState('fr')
  const translations = {
    fr: {
      'button.save': 'Enregistrer',
      'button.cancel': 'Annuler',
      'form.email': 'Adresse e-mail',
      'dashboard.welcome': 'Bienvenue {{name}}'
    },
    nl: {
      'button.save': 'Opslaan',
      'button.cancel': 'Annuleren',
      'form.email': 'E-mailadres',
      'dashboard.welcome': 'Welkom {{name}}'
    },
    en: {
      'button.save': 'Save',
      'button.cancel': 'Cancel',
      'form.email': 'Email address',
      'dashboard.welcome': 'Welcome {{name}}'
    }
  }
  
  const t = (key: string, params?: object) => {
    // Logique de traduction avec interpolation
    return translations[locale][key] || key
  }
  
  return { t, locale, setLocale }
}
```

**Utilisation dans les composants qwanyx-ui :**
```typescript
// qwanyx-ui/src/components/Button.tsx
import { useTranslation } from '../i18n'

export const SaveButton = () => {
  const { t } = useTranslation()
  return <Button>{t('button.save')}</Button>
}
```

**Utilisation dans les modules :**
```typescript
// qwanyx-modules/DashboardAutodin.tsx
import { useTranslation } from '@qwanyx/ui'

export const DashboardAutodin = ({ user }) => {
  const { t } = useTranslation()
  
  return (
    <Card>
      <h1>{t('dashboard.welcome', { name: user.name })}</h1>
      <Button>{t('button.save')}</Button>
    </Card>
  )
}
```

**Configuration par workspace :**
```json
// config-autodin.json
{
  "workspace": "autodin-be",
  "defaultLocale": "fr",
  "availableLocales": ["fr", "nl", "en"],
  "translations": {
    "fr": {
      "autodin.parts": "Pièces détachées",
      "autodin.search": "Rechercher une pièce"
    },
    "nl": {
      "autodin.parts": "Onderdelen",
      "autodin.search": "Zoek een onderdeel"
    }
  }
}
```

**Avantages :**
- ✅ **Une seule implémentation** pour toutes les apps
- ✅ **Traductions centralisées** dans qwanyx-ui
- ✅ **Traductions spécifiques** par workspace si nécessaire
- ✅ **Changement de langue** instantané partout
- ✅ **Pas de duplication** de fichiers de traduction

### 6. Système de Thème

**Structure du thème (theme-autodin.json):**
```json
{
  "colors": {
    "primary": "#E67E22",
    "secondary": "#2C3E50",
    "background": "#FFFFFF",
    "text": "#333333",
    "border": "#E0E0E0"
  },
  "typography": {
    "fontFamily": "Montserrat, sans-serif",
    "fontSize": {
      "base": "16px",
      "h1": "2.5rem",
      "h2": "2rem"
    }
  },
  "spacing": {
    "unit": "8px",
    "container": "1200px"
  },
  "components": {
    "button": {
      "borderRadius": "4px",
      "padding": "12px 24px"
    },
    "card": {
      "boxShadow": "0 2px 4px rgba(0,0,0,0.1)"
    }
  }
}
```

## Règles Fondamentales - OBLIGATOIRE

### ⚠️ RÈGLE ABSOLUE : RÉSOLUTION AU BON NIVEAU

**JAMAIS DE RUSTINES OU SOLUTIONS LOCALES**

Quand un problème survient, la résolution DOIT se faire au niveau approprié :

1. **Problème de composant UI de base** → Résoudre dans qwanyx-ui
2. **Problème de module** → Résoudre dans qwanyx-modules
3. **Problème de configuration** → Résoudre dans le JSON de config
4. **JAMAIS dans le site final** → Les sites ne contiennent AUCUN code custom

**Exemples de MAUVAISES pratiques (INTERDITES) :**
```typescript
// ❌ INTERDIT - Rustine CSS dans le site
<Button style={{ marginTop: '10px' }}>

// ❌ INTERDIT - Wrapper custom dans le site
const MyButton = (props) => <Button {...props} className="fix-padding" />

// ❌ INTERDIT - Override local
.button-override { padding: 20px !important; }
```

**Exemples de BONNES pratiques (OBLIGATOIRES) :**
```typescript
// ✅ Problème de spacing → Ajouter prop dans qwanyx-ui
// Dans qwanyx-ui/Button.tsx
<Button spacing="lg">

// ✅ Problème de layout → Créer/modifier le module
// Dans qwanyx-modules/SearchBar.tsx
<Container spacing="comfortable">
  <Button />
</Container>

// ✅ Problème de couleur → Modifier le thème JSON
// Dans theme-autodin.json
{ "colors": { "primary": "#NewColor" } }
```

### ⚠️ HIÉRARCHIE STRICTE DE DÉPENDANCES

```
qwanyx-ui (NPM - seule exception)
    ↓ import direct
Modules de base (Module Federation)
    ↓ import dynamique
Modules composés (Module Federation)
    ↓ import dynamique
Sites finaux (pure configuration)
```

**RÈGLES DE DÉPENDANCES :**

1. **qwanyx-ui** : 
   - Installé via NPM
   - Version sémantique stricte
   - Rebuild des modules UNIQUEMENT lors de changement de version

2. **Modules de base** :
   - Importent qwanyx-ui directement
   - Exposés via Module Federation
   - Rebuild UNIQUEMENT si qwanyx-ui change ET qu'on veut les nouvelles features

3. **Modules composés** :
   - N'importent JAMAIS qwanyx-ui directement
   - Utilisent UNIQUEMENT d'autres modules
   - JAMAIS de rebuild pour changements qwanyx-ui

4. **Sites** :
   - N'importent JAMAIS de composants directement
   - Consomment UNIQUEMENT des modules
   - ZÉRO code custom

### ⚠️ UTILISATION EXCLUSIVE DE QWANYX-UI

**INTERDICTIONS ABSOLUES :**
- ❌ PAS de Material-UI, Ant Design, Bootstrap, Tailwind UI, ou autre librairie UI
- ❌ PAS de CSS inline sauf pour des cas très spécifiques approuvés
- ❌ PAS de classes CSS personnalisées pour des composants déjà dans qwanyx-ui
- ❌ PAS d'import de composants tiers (datepicker, select, etc.)
- ❌ PAS de styles hardcodés (couleurs, espacements, etc.)

**OBLIGATIONS :**
- ✅ TOUJOURS utiliser les composants qwanyx-ui
- ✅ TOUJOURS utiliser les variables du thème JSON
- ✅ TOUJOURS passer par le système de variants
- ✅ TOUJOURS utiliser les props de style fournies par qwanyx-ui

**Exemple CORRECT :**
```typescript
import { Button, Card, Input, Select, DatePicker } from '@qwanyx/ui'

// ✅ BON - Utilise qwanyx-ui
<Button variant="primary" size="lg">
  Valider
</Button>

// ✅ BON - Utilise les props de qwanyx-ui
<Card padding="lg" shadow="md">
  <Input label="Email" type="email" />
</Card>
```

**Exemple INCORRECT :**
```typescript
// ❌ MAUVAIS - Utilise Material-UI
import { Button } from '@mui/material'

// ❌ MAUVAIS - CSS inline
<div style={{ backgroundColor: '#E67E22', padding: '20px' }}>

// ❌ MAUVAIS - Classes CSS personnalisées
<button className="custom-button-style">

// ❌ MAUVAIS - Composant tiers
import DatePicker from 'react-datepicker'
```

### Gestion des styles avec le thème JSON

**Structure obligatoire pour les styles :**
```typescript
// ✅ CORRECT - Utilise le thème
import { useTheme } from '@qwanyx/ui'

const MyModule = () => {
  const theme = useTheme()
  
  return (
    <Card>
      <Text color="primary">
        {/* La couleur vient du theme.json */}
      </Text>
    </Card>
  )
}

// ❌ INCORRECT - Hardcode les couleurs
<div style={{ color: '#E67E22' }}>
```

### Si un composant manque dans qwanyx-ui

**Procédure OBLIGATOIRE :**
1. **NE PAS** installer une librairie tierce
2. **NE PAS** créer le composant dans le module
3. **FAIRE** : Créer le composant dans qwanyx-ui
4. **PUIS** : L'utiliser dans le module

```typescript
// Si DateRangePicker n'existe pas dans qwanyx-ui
// 1. D'abord l'ajouter dans qwanyx-ui/src/components/DateRangePicker.tsx
// 2. L'exporter dans qwanyx-ui/src/index.ts
// 3. SEULEMENT APRÈS l'utiliser dans le module
import { DateRangePicker } from '@qwanyx/ui'
```

## Guide d'implémentation

### 1. Créer un nouveau module

```typescript
// src/modules/autodin/DashboardDemandes.tsx
import React from 'react'
import { Card, Button, Table } from '@qwanyx/ui'
import { useAuth, useWorkspace } from 'qwanyx-modules/hooks'

interface DashboardDemandesProps {
  // Props passées par le consommateur
  workspace?: string
  token?: string
  userId?: string
}

export const DashboardDemandes: React.FC<DashboardDemandesProps> = (props) => {
  // Récupération du contexte
  const { token, user } = useAuth(props.token)
  const { workspace } = useWorkspace(props.workspace)
  
  // Le module utilise qwanyx-ui qui hérite du thème du parent
  return (
    <Card>
      <h2>Demandes de pièces</h2>
      <Button variant="primary">Nouvelle demande</Button>
      <Table>
        {/* Contenu */}
      </Table>
    </Card>
  )
}

export default DashboardDemandes
```

### 2. Consommer un module

```typescript
// Dans app-shell ou site spécifique
import React, { lazy, Suspense } from 'react'

const DashboardDemandes = lazy(() => 
  import('qwanyx-modules/DashboardDemandes')
)

function App() {
  const token = localStorage.getItem(`${workspace}_token`)
  const user = JSON.parse(localStorage.getItem(`${workspace}_user`))
  
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <DashboardDemandes 
        workspace={workspace}
        token={token}
        userId={user.id}
      />
    </Suspense>
  )
}
```

### 3. Sécurité et authentification

```typescript
// hooks/useAuth.ts
export const useAuth = (initialToken?: string) => {
  const [token, setToken] = useState(initialToken || localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  
  useEffect(() => {
    if (token) {
      // Décoder le JWT pour récupérer les infos utilisateur
      const decoded = jwt_decode(token)
      setUser(decoded)
    }
  }, [token])
  
  const checkPermission = (requiredRole: string) => {
    return user?.roles?.includes(requiredRole)
  }
  
  return { token, user, checkPermission }
}
```

### 4. Communication avec l'API

```typescript
// services/api.ts
class ApiService {
  private token: string
  private workspace: string
  
  constructor(token: string, workspace: string) {
    this.token = token
    this.workspace = workspace
  }
  
  async fetch(endpoint: string, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'X-Workspace': this.workspace,
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
    
    if (!response.ok) {
      throw new Error('API Error')
    }
    
    return response.json()
  }
}
```

## Avantages de l'architecture

### 1. Modularité
- Chaque module est indépendant
- Développement en parallèle par équipes différentes
- Tests isolés par module

### 2. Réutilisabilité
- Un module peut être utilisé dans plusieurs sites
- Partage de code optimisé
- Maintenance centralisée

### 3. Performance
- Chargement à la demande (lazy loading)
- Bundle splitting automatique
- Cache optimisé par module

### 4. Évolutivité
- Ajout de nouveaux modules sans toucher l'existant
- Mise à jour indépendante des modules
- Versioning par module possible

### 5. Cohérence
- Utilisation de qwanyx-ui garantit la cohérence visuelle
- Thèmes centralisés
- Comportements uniformes
- Multilinguisme centralisé et cohérent

### 6. Fonctionnalités transversales
- **Multilinguisme** : Implémenté une fois dans qwanyx-ui, disponible partout
- **Accessibilité** : Standards WCAG appliqués à tous les composants
- **Dark mode** : Switch global qui affecte tous les modules
- **Responsive design** : Breakpoints cohérents sur tous les modules
- **Animations** : Transitions uniformes définies dans le thème

## Commandes et développement

### Setup initial

```bash
# 1. Installer qwanyx-modules
cd qwanyx-modules
npm install
npm run dev  # Port 5000

# 2. Installer app-shell ou site spécifique
cd autodin-ui
npm install
npm run dev  # Port 4001

# 3. L'app charge automatiquement les modules depuis localhost:5000
```

### Créer un nouveau site

```bash
# 1. Copier app-shell
cp -r app-shell nouveau-site

# 2. Créer la configuration
cp config-template.json config-nouveau-site.json
# Éditer les modules et thème

# 3. Lancer
cd nouveau-site
npm run dev -- --config=config-nouveau-site.json
```

### Build production

```bash
# Build des modules
cd qwanyx-modules
npm run build

# Build du site
cd autodin-ui
npm run build

# Les modules peuvent être déployés sur CDN
# Les sites peuvent être déployés séparément
```

## Checklist développeur

### Avant de créer un module
- [ ] Le module est-il réutilisable ?
- [ ] Utilise-t-il qwanyx-ui pour les composants ?
- [ ] A-t-il des dépendances spécifiques ?
- [ ] Nécessite-t-il une authentification ?

### Pendant le développement
- [ ] Props clairement définies avec TypeScript
- [ ] Gestion d'erreur robuste
- [ ] Loading states appropriés
- [ ] Responsive design

### Avant la mise en production
- [ ] Tests unitaires
- [ ] Documentation des props
- [ ] Exemple d'utilisation
- [ ] Vérification de la sécurité

## Exemples de modules

### Modules métier
- `DashboardAutodin` : Dashboard principal Autodin
- `DashboardBelgicomics` : Dashboard principal Belgicomics
- `DashboardDemandes` : Gestion des demandes de pièces
- `DashboardRecherche` : Recherche dans l'inventaire

### Modules génériques
- `TextEditor` : Éditeur de texte riche
- `ImageEditor` : Éditeur d'images
- `FileManager` : Gestionnaire de fichiers
- `PDFViewer` : Visualiseur PDF
- `CalendarBooking` : Système de réservation
- `ChatWidget` : Widget de chat

### Modules de layout
- `NavbarAutodin` : Navbar spécifique Autodin
- `NavbarBelgicomics` : Navbar spécifique Belgicomics
- `Footer` : Footer réutilisable
- `Sidebar` : Sidebar configurable

## Ressources

- [Module Federation Documentation](https://webpack.js.org/concepts/module-federation/)
- [Vite Plugin Federation](https://github.com/originjs/vite-plugin-federation)
- [Micro-Frontends](https://micro-frontends.org/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## Notes pour l'IA - LECTURE OBLIGATOIRE

### ⚠️ DISCIPLINE STRICTE - AUCUNE EXCEPTION

**RÈGLE D'OR : JAMAIS DE RUSTINES**

Quand un utilisateur demande un changement :
1. **IDENTIFIER** le bon niveau (qwanyx-ui, module, ou config)
2. **REFUSER** toute solution temporaire ou locale
3. **IMPLÉMENTER** au niveau approprié uniquement

**Exemples de réponses OBLIGATOIRES :**

```
Utilisateur : "Ajoute juste un margin-top sur ce bouton"
IA : "Je vais ajouter une prop 'spacing' dans le composant Button de qwanyx-ui pour gérer cela proprement. Les styles inline sont interdits dans l'architecture QWANYX."

Utilisateur : "Fais une exception pour ce cas"
IA : "L'architecture QWANYX n'autorise aucune exception. Je vais résoudre ce problème au niveau approprié : [qwanyx-ui/module/config]."

Utilisateur : "C'est juste temporaire"
IA : "Il n'y a pas de solutions temporaires dans QWANYX. Toute solution doit être architecturalement correcte dès le départ."
```

### WORKFLOW STRICT POUR L'IA

**Pour CHAQUE demande de modification :**

1. **ANALYSER** : Quel niveau est concerné ?
   - Composant UI → qwanyx-ui
   - Feature métier → qwanyx-modules  
   - Style/apparence → theme JSON
   - JAMAIS → site final

2. **VÉRIFIER** : Le composant existe-t-il ?
   ```
   SI composant manque dans qwanyx-ui:
      → Créer dans qwanyx-ui
      → PUIS l'utiliser
   SINON:
      → Utiliser l'existant
   ```

3. **IMPLÉMENTER** : Au bon endroit
   - qwanyx-ui : npm run build → npm publish
   - modules : rebuild si nécessaire
   - sites : AUCUN CODE, que de la config

4. **REFUSER** : Toute tentative de contournement
   - Pas de style inline
   - Pas de className custom
   - Pas de wrapper local
   - Pas d'override CSS

### RÈGLES CRITIQUES À RESPECTER

**JAMAIS, SOUS AUCUN PRÉTEXTE :**
- Ne pas suggérer ou installer Material-UI, Ant Design, Bootstrap, Chakra UI, ou toute autre librairie UI
- Ne pas créer de composants custom si ils existent dans qwanyx-ui
- Ne pas utiliser de styles inline ou de classes CSS personnalisées
- Ne pas hardcoder des couleurs, espacements ou autres valeurs de style

**TOUJOURS :**
1. **Utiliser EXCLUSIVEMENT qwanyx-ui** pour TOUS les composants UI
2. **Si un composant manque** : D'ABORD l'ajouter à qwanyx-ui, PUIS l'utiliser
3. **Pour les styles** : Utiliser UNIQUEMENT le système de thème JSON
4. **Pour les couleurs** : Utiliser les variables du thème (primary, secondary, etc.)
5. **Pour les espacements** : Utiliser les props de qwanyx-ui (padding, margin, gap)
6. **Pour les variantes** : Utiliser le système de variants de qwanyx-ui

### Workflow pour l'IA

```
Utilisateur: "J'ai besoin d'un date picker"
IA: 
1. Vérifie si DatePicker existe dans qwanyx-ui
2. Si OUI → import { DatePicker } from '@qwanyx/ui'
3. Si NON → "Je vais d'abord ajouter DatePicker à qwanyx-ui"
   - Créer le composant dans qwanyx-ui
   - L'exporter
   - PUIS l'utiliser dans le module

JAMAIS → "On peut utiliser react-datepicker"
```

### Exemples de réponses correctes

**Question :** "Comment faire un bouton rouge ?"
**Réponse CORRECTE :** 
```typescript
// Ajouter une variant 'danger' dans le thème JSON
// Puis utiliser :
<Button variant="danger">Supprimer</Button>
```

**Réponse INCORRECTE :**
```typescript
// NE JAMAIS FAIRE ÇA :
<Button style={{ backgroundColor: 'red' }}>
```

### Checklist OBLIGATOIRE avant CHAQUE implémentation

- [ ] **NIVEAU** : Le code est-il au bon niveau (ui/module/config) ?
- [ ] **IMPORTS** : Tous les imports UI viennent de '@qwanyx/ui' ?
- [ ] **DÉPENDANCES** : Aucune librairie UI tierce n'est installée ?
- [ ] **STYLES** : Aucun style inline ou classe custom ?
- [ ] **THÈME** : Les couleurs/espacements viennent du thème JSON ?
- [ ] **MANQUANTS** : Les composants manquants sont créés dans qwanyx-ui AVANT utilisation ?
- [ ] **RUSTINES** : Aucune solution temporaire ou contournement ?
- [ ] **HIÉRARCHIE** : Les modules composés n'importent PAS qwanyx-ui directement ?

### En cas de doute ou de pression

**Réponses OBLIGATOIRES en cas de demande non conforme :**

Si l'utilisateur insiste pour une rustine :
> "L'architecture QWANYX n'autorise aucune rustine. Je vais implémenter la solution au niveau approprié."

Si l'utilisateur demande une librairie tierce :
> "L'architecture QWANYX impose l'utilisation exclusive de qwanyx-ui. Si un composant manque, je dois d'abord l'ajouter à qwanyx-ui."

Si l'utilisateur veut du code custom dans un site :
> "Les sites dans QWANYX sont uniquement de la configuration. Tout code doit être dans un module."

**RAPPEL FINAL : LA DISCIPLINE ARCHITECTURALE EST NON NÉGOCIABLE**