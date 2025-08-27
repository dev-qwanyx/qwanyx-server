# 🏗️ QWANYX BUILD HARMONIZATION PLAN
## Architecture Unifiée pour Toutes les Apps

---

## 🎯 VISION ARCHITECTURALE

### Principe Central
```
┌─────────────────────────────────────────────┐
│           APPS (TypeScript/React)           │
│  Autodin, Belgicomics, PersonalCash, etc.   │
└──────────────────┬──────────────────────────┘
                   │ Imports uniquement
                   ▼
┌─────────────────────────────────────────────┐
│         PACKAGES INTERNES (Monorepo)        │
│  @qwanyx/ui, @qwanyx/auth, @qwanyx/canvas   │
│  @qwanyx/dashboard-v2, @qwanyx/app-core     │
└──────────────────┬──────────────────────────┘
                   │ Appels API pour tout
                   ▼
┌─────────────────────────────────────────────┐
│            API CENTRALE (Rust/Python)        │
│  • Persistance (MongoDB)                     │
│  • IA (OpenAI, Claude, Local models)         │
│  • Services (Paiements, Emails, SMS)         │
│  • Authentication & Authorization            │
│  • Business Logic                            │
└─────────────────────────────────────────────┘
```

### Règles Absolues
1. **Apps = UI Only** : Aucune logique métier dans les apps
2. **API = Tout le reste** : DB, IA, paiements, logique
3. **Packages = Composants réutilisables** : UI, auth, etc.
4. **TypeScript partout** : Zéro JavaScript, typage strict
5. **Zéro erreur** : Pas de `as any`, pas de `@ts-ignore`

---

## 📦 STRUCTURE MONOREPO HARMONISÉE

```
QWANYX-Architecture-Clean/
├── package.json                 # ← NOUVEAU: Orchestrateur principal
├── turbo.json                  # ← NOUVEAU: Configuration Turborepo
├── tsconfig.base.json          # ← NOUVEAU: Config TypeScript partagée
├── .npmrc                      # ← NOUVEAU: Config npm workspace
│
├── packages/                   # Packages internes réutilisables
│   ├── qwanyx-ui/             # Components UI (atoms/molecules/organisms)
│   ├── qwanyx-auth/           # Module d'authentification
│   ├── qwanyx-canvas/         # Canvas pour Digital Human
│   ├── qwanyx-dashboard-v2/  # Dashboard components
│   ├── qwanyx-app-core/      # Orchestrateur central
│   └── qwanyx-api-client/    # Client API unifié
│
├── apps/                       # Applications frontend
│   ├── autodin/               # Marketplace auto
│   ├── belgicomics/           # Marketplace BD
│   ├── personal-cash/         # Gestion finances
│   └── digital-human/         # App DH
│
├── api/                        # Backend centralisé
│   ├── qwanyx-api/           # API Python Flask
│   └── qwanyx-brain/         # API Rust SPU
│
└── tools/                      # ← NOUVEAU: Outils de build
    ├── scripts/               # Scripts de build/deploy
    └── config/                # Configs partagées
```

---

## 🛠️ CONFIGURATION TECHNIQUE

### 1. Package.json Racine (Orchestrateur)
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
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean",
    "ci": "npm run type-check && npm run lint && npm run test && npm run build"
  },
  "devDependencies": {
    "turbo": "latest",
    "typescript": "^5.3.3",
    "@types/node": "^20.0.0",
    "eslint": "^8.57.0",
    "prettier": "^3.2.5"
  }
}
```

### 2. Turbo.json (Pipeline de Build)
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "type-check": {
      "dependsOn": ["^build"],
      "cache": false
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    },
    "clean": {
      "cache": false
    }
  }
}
```

### 3. TSConfig Base (Partagé)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "allowJs": false,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "allowSyntheticDefaultImports": true,
    "paths": {
      "@qwanyx/*": ["../../packages/*/src"]
    }
  }
}
```

---

## 🔧 STANDARDISATION DES PACKAGES

### Structure Standard pour Chaque Package
```
packages/qwanyx-[name]/
├── package.json
├── tsconfig.json         # Extends ../../tsconfig.base.json
├── tsup.config.ts       # Build config uniforme
├── .eslintrc.js
├── src/
│   ├── index.ts         # Point d'entrée unique
│   └── components/
├── dist/                # Output buildé
└── README.md
```

### Package.json Type pour Package
```json
{
  "name": "@qwanyx/[name]",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "dev": "tsup --watch",
    "build": "tsup",
    "type-check": "tsc --noEmit",
    "lint": "eslint src/",
    "clean": "rm -rf dist .turbo"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.3.3"
  },
  "peerDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

### TSup Config Uniforme
```typescript
// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
})
```

---

## 🎯 STANDARDISATION DES APPS

### Structure Standard pour Chaque App
```
apps/[name]/
├── package.json
├── tsconfig.json
├── next.config.js       # Sans ignoreBuildErrors!
├── src/
│   ├── app/            # App Router Next.js 14+
│   ├── components/     # Components spécifiques à l'app
│   └── services/       # Appels API uniquement
└── public/
```

### Next.config.js Corrigé
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  typescript: {
    // PAS de ignoreBuildErrors!
  },
  eslint: {
    // PAS de ignoreDuringBuilds!
  },
  experimental: {
    // Optimisations Next.js 14+
    optimizePackageImports: ['@qwanyx/ui', '@qwanyx/auth'],
  }
}

module.exports = nextConfig
```

---

## 🔄 API CLIENT UNIFIÉ

### Package @qwanyx/api-client
```typescript
// packages/qwanyx-api-client/src/index.ts

class QwanyxAPIClient {
  private baseURL: string
  private workspace: string
  
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002'
    this.workspace = process.env.NEXT_PUBLIC_WORKSPACE || 'default'
  }
  
  // Méthodes unifiées pour toutes les apps
  async auth = {
    login: (email: string) => this.post('/auth/login', { email }),
    verify: (code: string) => this.post('/auth/verify', { code }),
    logout: () => this.post('/auth/logout'),
    getSession: () => this.get('/auth/session'),
  }
  
  async data = {
    list: (collection: string) => this.get(`/data/${collection}`),
    get: (collection: string, id: string) => this.get(`/data/${collection}/${id}`),
    create: (collection: string, data: any) => this.post(`/data/${collection}`, data),
    update: (collection: string, id: string, data: any) => this.put(`/data/${collection}/${id}`, data),
    delete: (collection: string, id: string) => this.delete(`/data/${collection}/${id}`),
  }
  
  async ai = {
    complete: (prompt: string, model?: string) => this.post('/ai/complete', { prompt, model }),
    compress: (text: string) => this.post('/ai/compress', { text }),
    analyze: (data: any) => this.post('/ai/analyze', { data }),
  }
  
  async services = {
    payment: (amount: number, method: string) => this.post('/services/payment', { amount, method }),
    email: (to: string, subject: string, body: string) => this.post('/services/email', { to, subject, body }),
    sms: (to: string, message: string) => this.post('/services/sms', { to, message }),
  }
  
  // Méthodes HTTP de base avec gestion d'erreur
  private async request(url: string, options?: RequestInit) {
    const response = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Workspace': this.workspace,
        ...options?.headers,
      },
    })
    
    if (!response.ok) {
      throw new APIError(response.status, await response.text())
    }
    
    return response.json()
  }
  
  private get = (url: string) => this.request(url)
  private post = (url: string, data?: any) => this.request(url, { method: 'POST', body: JSON.stringify(data) })
  private put = (url: string, data?: any) => this.request(url, { method: 'PUT', body: JSON.stringify(data) })
  private delete = (url: string) => this.request(url, { method: 'DELETE' })
}

export const api = new QwanyxAPIClient()
```

---

## 📋 PLAN D'IMPLÉMENTATION

### Phase 1: Infrastructure (Jour 1)
- [ ] Créer package.json racine avec workspaces
- [ ] Installer et configurer Turborepo
- [ ] Créer tsconfig.base.json
- [ ] Nettoyer dossiers obsolètes
- [ ] Installer dependencies globales

### Phase 2: Packages (Jour 2)
- [ ] Migrer tous les packages vers tsup
- [ ] Standardiser tous les package.json
- [ ] Créer @qwanyx/api-client
- [ ] Vérifier les dépendances circulaires
- [ ] Build tous les packages

### Phase 3: Apps (Jour 3)
- [ ] Corriger next.config.js (retirer ignoreBuildErrors)
- [ ] Migrer vers imports depuis packages buildés
- [ ] Implémenter api-client dans chaque app
- [ ] Résoudre TOUTES les erreurs TypeScript
- [ ] Tester chaque app

### Phase 4: Validation (Jour 4)
- [ ] Lancer build complet: `npm run ci`
- [ ] Vérifier zéro erreur TypeScript
- [ ] Tester toutes les apps
- [ ] Documentation mise à jour
- [ ] Déploiement test

---

## ✅ CHECKLIST DE VALIDATION

### Pour Chaque Package
- [ ] Build sans erreur: `npm run build`
- [ ] TypeScript strict: `npm run type-check`
- [ ] Exports corrects dans package.json
- [ ] Pas de dépendances circulaires
- [ ] Documentation README.md

### Pour Chaque App
- [ ] Imports uniquement depuis packages
- [ ] Zéro native HTML elements
- [ ] Toute logique via API
- [ ] TypeScript sans erreur
- [ ] Build production réussi

### Global
- [ ] Un seul `npm install` à la racine
- [ ] Un seul `npm run build` compile tout
- [ ] Turbo cache fonctionne
- [ ] CI/CD pipeline green
- [ ] Zéro warning, zéro erreur

---

## 🚀 COMMANDES FINALES

```bash
# Installation initiale (une seule fois)
npm install

# Development (toutes les apps et packages)
npm run dev

# Build complet avec validation
npm run ci

# Build production
npm run build

# Tests
npm run test

# Type checking global
npm run type-check
```

---

## 📊 MÉTRIQUES DE SUCCÈS

### Avant
- ⏱️ Build: Manuel, ~15min, erreurs fréquentes
- 🔴 Errors: Ignorées avec `ignoreBuildErrors`
- 📦 Packages: Build manuel individuel
- 🔄 Reproductibilité: ~30%

### Après (Objectif)
- ⏱️ Build: Automatique, <2min, zéro erreur
- ✅ Errors: 0 (strict TypeScript)
- 📦 Packages: Un seul build command
- 🔄 Reproductibilité: 100%

---

## ⚠️ RÈGLES NON NÉGOCIABLES

1. **JAMAIS** `as any` ou `@ts-ignore`
2. **JAMAIS** `ignoreBuildErrors: true`
3. **TOUJOURS** typage strict TypeScript
4. **TOUJOURS** packages pré-buildés
5. **TOUJOURS** via API pour persistence/services

---

*Plan créé le 27/08/2024*
*Objectif: Build harmonisé, zéro erreur, 100% TypeScript*