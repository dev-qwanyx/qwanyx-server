# 🏗️ MASTER REBUILD PLAN - QWANYX Architecture
## Plan Complet : Serveur + Build + Apps

---

## 📊 ÉTAT ACTUEL (Analyse Août 2024)

### 🍝 Serveur - Chaos Total
```
/opt/qwanyx/apps/qwanyx-server/
├── autodin/              # Version Flask ancienne
├── autodin-be/           # ???
├── autodin-next/         # Version Next.js
├── autodin-ui/           # ???
├── autodin-ui-next/      # ???
├── belgicomics/          # Version Flask
├── belgicomics-ui/       # ???
├── dashboard-ui/         # ???
├── federation-ui/        # ???
├── personal-cash/        # ???
└── 30+ autres dossiers...  # Chaos total
```

**Problèmes:**
- Multiples versions de la même app
- Services qui tournent en doublon (ports 8090, 8091, 5002, 3002, 5000)
- Pas de structure claire
- Mix Flask/Next.js/Node
- Fichiers de config éparpillés
- Scripts de deploy manuels partout

### 🔥 Local - Build Cassé
```
QWANYX-Architecture-Clean/
├── apps/
│   ├── autodin-backup/    # Doublon
│   ├── autodin-broken/    # Doublon
│   └── autodin/           # Version "active" ?
├── packages/              # Pas de workspaces
└── history/               # 6GB de vieux code
```

**Problèmes:**
- Pas de monorepo configuré
- `ignoreBuildErrors: true` partout
- Build manuel package par package
- TypeScript errors ignorées
- Dépendances circulaires

---

## 🎯 OBJECTIF FINAL

### Architecture Cible
```
SERVEUR:
/opt/qwanyx/
├── apps/                  # Apps Next.js uniquement
│   ├── autodin/
│   ├── belgicomics/
│   └── personal-cash/
├── api/                   # APIs backend
│   ├── qwanyx-api/       # Python Flask API
│   └── qwanyx-brain/     # Rust SPU API
└── scripts/               # Scripts de gestion
    ├── deploy.sh
    └── backup.sh

LOCAL (miroir exact):
QWANYX-Architecture-Clean/
├── apps/                  # Même structure
├── api/
├── packages/              # Monorepo NPM workspaces
└── tools/                 # Build tools
```

---

## 📋 PLAN D'EXÉCUTION EN 5 PHASES

### PHASE 1: NETTOYAGE SERVEUR (Jour 1)
**Objectif:** Un serveur propre avec structure claire

#### Étape 1.1: Backup complet
```bash
ssh root@135.181.72.183
cd /opt
tar -czf qwanyx-backup-$(date +%Y%m%d).tar.gz qwanyx/
```

#### Étape 1.2: Identifier les services actifs
```bash
# Lister les ports et processus
netstat -tulpn | grep LISTEN
ps aux | grep -E 'python|node'
pm2 list
```

#### Étape 1.3: Arrêter les doublons
```bash
# Garder seulement:
# - Port 3002: Next.js Autodin
# - Port 5002: API Python
# - Port 9999: Webhook
# Tuer le reste
```

#### Étape 1.4: Restructurer les dossiers
```bash
/opt/qwanyx-clean/
├── apps/
│   ├── autodin/          # Next.js uniquement
│   ├── belgicomics/      # Next.js uniquement
│   └── personal-cash/    # Next.js uniquement
├── api/
│   └── qwanyx-api/       # Flask API
└── scripts/
    └── deploy.sh         # Script unifié
```

#### Étape 1.5: Nginx propre
```nginx
# Un seul fichier de config
/etc/nginx/sites-available/qwanyx.conf
- autodin.qwanyx.com → localhost:3002
- belgicomics.qwanyx.com → localhost:3003
- api.qwanyx.com → localhost:5002
```

---

### PHASE 2: SETUP LOCAL MONOREPO (Jour 2)
**Objectif:** Build automatisé sans erreur

#### Étape 2.1: Nettoyer local
```bash
# Supprimer les doublons
rm -rf apps/autodin-backup
rm -rf apps/autodin-broken
rm -rf apps/autodin-temp-broken
rm -rf history/
```

#### Étape 2.2: Configurer Workspaces
```json
// package.json racine
{
  "workspaces": ["packages/*", "apps/*"],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "deploy": "node tools/deploy.js"
  }
}
```

#### Étape 2.3: Installer Turborepo
```bash
npm install turbo --save-dev
npx turbo init
```

#### Étape 2.4: TSConfig unifié
```json
// tsconfig.base.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true
  }
}
```

---

### PHASE 3: MIGRATION PACKAGES (Jour 3)
**Objectif:** Tous les packages buildent avec tsup

#### Étape 3.1: Standardiser chaque package
```bash
Pour chaque package:
1. Installer tsup
2. Créer tsup.config.ts
3. Update package.json exports
4. npm run build
5. Vérifier dist/
```

#### Étape 3.2: Ordre de migration
```
1. @qwanyx/ui         # Aucune dépendance
2. @qwanyx/api-client # Aucune dépendance
3. @qwanyx/auth       # Dépend de ui
4. @qwanyx/canvas     # Dépend de ui
5. @qwanyx/dashboard  # Dépend de ui
```

#### Étape 3.3: Validation
```bash
npm run build --filter=packages/*
# Doit passer sans erreur
```

---

### PHASE 4: CORRECTION APPS (Jour 4)
**Objectif:** Zero TypeScript error

#### Étape 4.1: Retirer ignoreBuildErrors
```javascript
// Dans chaque next.config.js
// SUPPRIMER:
typescript: {
  ignoreBuildErrors: true  // ❌
}
```

#### Étape 4.2: Corriger les erreurs une par une
```bash
npm run type-check --filter=autodin
# Corriger CHAQUE erreur
# Pas de as any!
```

#### Étape 4.3: Tester chaque app
```bash
npm run build --filter=autodin
npm run build --filter=belgicomics
```

---

### PHASE 5: DÉPLOIEMENT UNIFIÉ (Jour 5)
**Objectif:** Un seul script de deploy

#### Étape 5.1: Script de deploy intelligent
```bash
#!/bin/bash
# tools/deploy.sh

# 1. Build seulement ce qui a changé
npm run build --filter=[changed]

# 2. Sync avec serveur
rsync -av --delete apps/autodin/out/ root@server:/opt/qwanyx/apps/autodin/

# 3. Restart PM2 si nécessaire
ssh root@server "pm2 restart autodin"
```

#### Étape 5.2: GitHub Actions
```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
```

#### Étape 5.3: Monitoring
```bash
# PM2 ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'autodin',
      script: 'npm',
      args: 'start',
      cwd: '/opt/qwanyx/apps/autodin',
      instances: 2,
      exec_mode: 'cluster'
    }
  ]
}
```

---

## ✅ CHECKLIST DE VALIDATION

### Par Phase
- [ ] **Phase 1**: Serveur avec 0 doublon, structure claire
- [ ] **Phase 2**: Monorepo fonctionnel, `npm install` unique
- [ ] **Phase 3**: Tous packages buildent avec tsup
- [ ] **Phase 4**: Zero TypeScript error dans toutes les apps
- [ ] **Phase 5**: Deploy automatisé en < 2 minutes

### Global
- [ ] Un seul `npm install` à la racine
- [ ] Un seul `npm run build` compile tout
- [ ] Pas de `ignoreBuildErrors`
- [ ] Pas de `as any`
- [ ] Server == Local (même structure)
- [ ] CI/CD fonctionnel

---

## 📊 MÉTRIQUES DE SUCCÈS

### Avant
- 🔴 11+ processus sur le serveur
- 🔴 6+ versions de la même app
- 🔴 Build manuel ~15 min
- 🔴 TypeScript errors ignorées
- 🔴 Deploy manuel et risqué

### Après (Objectif)
- ✅ 3-4 processus maximum
- ✅ 1 version par app
- ✅ Build automatique < 2 min
- ✅ 0 TypeScript error
- ✅ Deploy automatisé et safe

---

## 🚨 POINTS D'ATTENTION CRITIQUES

1. **TOUJOURS faire un backup avant de toucher le serveur**
2. **JAMAIS supprimer sans vérifier qu'un service tourne**
3. **TESTER localement avant de déployer**
4. **Garder l'API Python (port 5002) intacte**
5. **PM2 save après chaque changement**

---

## 📅 TIMELINE

- **Lundi**: Phase 1 (Serveur)
- **Mardi**: Phase 2 (Monorepo)
- **Mercredi**: Phase 3 (Packages)
- **Jeudi**: Phase 4 (Apps)
- **Vendredi**: Phase 5 (Deploy)
- **Weekend**: Tests et validation

---

*Plan créé le 27/08/2024*
*Priorité: CRITIQUE - Serveur d'abord, puis build*