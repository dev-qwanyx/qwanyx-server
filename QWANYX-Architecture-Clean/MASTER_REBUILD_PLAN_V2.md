# 🏗️ MASTER REBUILD PLAN V2 - LOCAL FIRST
## Build Propre D'abord, Serveur Ensuite

---

## 🎯 NOUVELLE STRATÉGIE

### Principe : Local → Build → Test → Deploy → Serveur

```
1. NETTOYER LOCAL (garder seulement le bon code)
    ↓
2. MONOREPO + BUILD PARFAIT (zéro erreur)
    ↓
3. TESTER LOCALEMENT (tout fonctionne)
    ↓
4. DEPLOY LA VERSION PROPRE
    ↓
5. NETTOYER LE SERVEUR (avec la bonne version)
```

**Pourquoi c'est mieux :**
- On sait exactement quelle version est la bonne
- On ne déploie que du code qui compile
- Le serveur devient évident une fois qu'on a la bonne structure
- Pas de risque de casser la prod avec du code non testé

---

## 📊 ÉTAT ACTUEL

### Local - Le Chaos
```
QWANYX-Architecture-Clean/
├── apps/
│   ├── autodin/           # Version active ?
│   ├── autodin-backup/    # Ancienne version
│   ├── autodin-broken/    # ???
│   ├── autodin-temp-broken/ # ???
│   ├── belgicomics/       # OK ?
│   └── personal-cash/     # OK ?
├── packages/              # Pas de workspaces configuré
│   ├── qwanyx-ui/        # Build avec Vite
│   ├── qwanyx-auth/      # Build avec Vite
│   ├── qwanyx-thot/      # Build avec tsup
│   └── ...               # Différents build tools
└── history/              # 6GB de vieux code
```

**Problèmes critiques :**
- `ignoreBuildErrors: true` dans Next.js
- Pas de monorepo (workspaces)
- Build manuel package par package
- 3 outils de build différents
- TypeScript errors partout

---

## 📋 NOUVEAU PLAN EN 5 PHASES

### PHASE 1: GRAND NETTOYAGE LOCAL (Jour 1) ✨
**Objectif :** Garder UNIQUEMENT le code actif

#### Étape 1.1: Identifier la bonne version
```bash
# Comparer les versions
diff -r apps/autodin apps/autodin-backup
# Regarder les dates de modification
ls -la apps/*/package.json
# Checker les commits Git
git log --oneline apps/
```
**Décision :** Quelle version on garde ?

#### Étape 1.2: Backup avant nettoyage
```bash
# Créer une archive de sécurité
tar -czf backup-before-cleanup-$(date +%Y%m%d).tar.gz .
# Mettre sur un disque externe ou cloud
```

#### Étape 1.3: SUPPRIMER les doublons
```bash
rm -rf apps/autodin-backup
rm -rf apps/autodin-broken
rm -rf apps/autodin-temp-broken
rm -rf history/
rm -rf old/
rm -rf backup/
rm -rf node_modules/  # On réinstallera proprement
```

#### Étape 1.4: Structure finale claire
```
apps/
├── autodin/         # Next.js marketplace auto
├── belgicomics/     # Next.js marketplace BD
└── personal-cash/   # Next.js finance

packages/
├── qwanyx-ui/       # Components
├── qwanyx-auth/     # Auth module
├── qwanyx-api-client/ # API client
└── ...
```

---

### PHASE 2: MONOREPO & WORKSPACES (Jour 1-2) 📦
**Objectif :** Un seul npm install, un seul build

#### Étape 2.1: Package.json racine
```json
{
  "name": "@qwanyx/monorepo",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean",
    "test": "turbo run test"
  }
}
```

#### Étape 2.2: Turborepo
```bash
npm install turbo --save-dev
```

```json
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    }
  }
}
```

#### Étape 2.3: TSConfig strict
```json
// tsconfig.base.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

#### Étape 2.4: Installation propre
```bash
# Supprimer TOUS les node_modules
find . -name "node_modules" -type d -prune -exec rm -rf {} +
find . -name "package-lock.json" -delete

# Une seule installation à la racine
npm install
```

---

### PHASE 3: STANDARDISER PACKAGES (Jour 2) 🔧
**Objectif :** Tous les packages avec tsup

#### Étape 3.1: Un seul build tool (tsup)
Pour chaque package:
```bash
cd packages/qwanyx-ui
npm uninstall vite rollup webpack  # Retirer les anciens
npm install --save-dev tsup
```

#### Étape 3.2: Config tsup uniforme
```typescript
// tsup.config.ts (même pour tous)
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom']
})
```

#### Étape 3.3: Package.json standard
```json
{
  "name": "@qwanyx/[name]",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "scripts": {
    "dev": "tsup --watch",
    "build": "tsup",
    "type-check": "tsc --noEmit"
  }
}
```

#### Étape 3.4: Build test
```bash
npm run build --filter=packages/*
# Doit créer dist/ dans chaque package
```

---

### PHASE 4: CORRIGER LES APPS (Jour 3) ✅
**Objectif :** ZERO erreur TypeScript

#### Étape 4.1: Retirer le mal absolu
Dans chaque `next.config.js`:
```javascript
// SUPPRIMER CES LIGNES DU MAL
typescript: {
  ignoreBuildErrors: true  // ❌ INTERDIT
}
eslint: {
  ignoreDuringBuilds: true  // ❌ INTERDIT
}
```

#### Étape 4.2: Révéler les erreurs
```bash
npm run type-check --filter=autodin
# Va montrer 50+ erreurs probablement
```

#### Étape 4.3: Corriger méthodiquement
**Erreurs courantes et solutions :**
```typescript
// ❌ Type 'any'
const data: any = fetchData()

// ✅ Typer correctement
interface UserData {
  id: string
  name: string
}
const data: UserData = fetchData()

// ❌ Ignore unused
// @ts-ignore
const unused = something

// ✅ Retirer ou utiliser
// Supprimer la ligne si non utilisée

// ❌ HTML elements
<div className="container">

// ✅ Components QWANYX
<Container>
```

#### Étape 4.4: Validation
```bash
npm run build --filter=apps/*
# DOIT passer sans erreur
```

---

### PHASE 5: DÉPLOYER & NETTOYER SERVEUR (Jour 4) 🚀
**Objectif :** Remplacer le chaos serveur par la version propre

#### Étape 5.1: Build de production
```bash
npm run build
# Génère tous les artéfacts de production
```

#### Étape 5.2: Créer structure sur serveur
```bash
ssh root@135.181.72.183
mkdir -p /opt/qwanyx-new/{apps,api,scripts}
```

#### Étape 5.3: Deploy la version propre
```bash
# Sync apps
rsync -av apps/autodin/.next root@server:/opt/qwanyx-new/apps/autodin/
rsync -av apps/belgicomics/.next root@server:/opt/qwanyx-new/apps/belgicomics/

# Copy package.json et node_modules de production
```

#### Étape 5.4: Basculer en production
```bash
# Sur le serveur
pm2 stop all
mv /opt/qwanyx /opt/qwanyx-old
mv /opt/qwanyx-new /opt/qwanyx
pm2 start ecosystem.config.js
pm2 save
```

#### Étape 5.5: Nettoyer
```bash
# Après validation que tout marche
rm -rf /opt/qwanyx-old
```

---

## ✅ AVANTAGES DE CETTE APPROCHE

1. **On sait ce qu'on déploie** : Code testé et validé localement
2. **Pas de risque** : Le serveur actuel continue de tourner
3. **Rollback facile** : L'ancienne version reste disponible
4. **Build reproductible** : Une commande pour tout builder
5. **Zéro downtime** : Bascule instantanée avec PM2

---

## 📊 CHECKLIST MASTER

### Phase 1 - Nettoyage Local
- [ ] Identifier bonne version de chaque app
- [ ] Backup complet
- [ ] Supprimer tous les doublons
- [ ] Structure claire apps/ et packages/

### Phase 2 - Monorepo
- [ ] Package.json racine avec workspaces
- [ ] Turborepo configuré
- [ ] TSConfig strict
- [ ] Un seul npm install fonctionne

### Phase 3 - Packages
- [ ] Tous sur tsup
- [ ] Configs identiques
- [ ] Build sans erreur
- [ ] Dist/ généré partout

### Phase 4 - Apps
- [ ] Plus de ignoreBuildErrors
- [ ] Zéro erreur TypeScript
- [ ] Build production OK
- [ ] Tests passent

### Phase 5 - Deploy
- [ ] Build de production
- [ ] Deploy sur serveur
- [ ] Bascule avec PM2
- [ ] Nettoyage ancien code

---

## 🎯 COMMANDES CLÉS

```bash
# Phase 1
find . -name "node_modules" -type d -prune -exec rm -rf {} +

# Phase 2
npm install
npm run build

# Phase 3
npm run build --filter=packages/*

# Phase 4
npm run type-check
npm run build --filter=apps/*

# Phase 5
rsync -av apps/ root@server:/opt/qwanyx-new/apps/
pm2 restart all
```

---

## 📈 MÉTRIQUES DE SUCCÈS

**Avant :**
- Build time: ~15 min manuel
- TypeScript errors: Ignorées
- Packages: Build individuel
- Deploy: Manuel et risqué

**Après (objectif) :**
- Build time: < 2 min
- TypeScript errors: 0
- Packages: Un seul build
- Deploy: Automatique et safe

---

*Plan V2 créé le 27/08/2024*
*Stratégie: Local First → Build → Test → Deploy → Clean Server*