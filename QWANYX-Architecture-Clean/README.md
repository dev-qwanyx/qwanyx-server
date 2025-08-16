# QWANYX Architecture Clean

Architecture moderne et maintenable pour l'écosystème QWANYX.

## 🏗️ Structure

```
QWANYX-Architecture-Clean/
├── packages/
│   └── qwanyx-ui/         # Composants UI partagés (npm package)
├── apps/
│   ├── autodin/           # App Next.js - Marketplace pièces auto
│   ├── belgicomics/       # App Next.js - Marketplace BD belges
│   └── personal-cash/     # App Next.js - Gestion finances
├── api/
│   └── qwanyx-api/        # API Python centralisée (Flask)
└── deploy/
    └── scripts/           # Scripts de déploiement
```

## 🚀 Technologies

- **Frontend**: Next.js 14 avec App Router
- **UI Library**: @qwanyx/ui (composants React réutilisables)
- **Backend**: Python Flask API
- **Database**: MongoDB
- **Styling**: Tailwind CSS + CSS Modules

## 📦 Installation

### 1. Installer les dépendances du package UI

```bash
cd packages/qwanyx-ui
npm install
npm run build:lib
```

### 2. Installer et lancer une app (ex: Autodin)

```bash
cd apps/autodin
npm install
npm run dev
```

L'app sera accessible sur http://localhost:3001

### 3. Lancer l'API

```bash
cd api/qwanyx-api
pip install -r requirements.txt
python app_v2.py
```

L'API sera accessible sur http://localhost:5002

## 🎯 Avantages de cette architecture

1. **Code partagé**: Un seul package `@qwanyx/ui` pour tous les composants
2. **Maintenance facile**: Mise à jour du package UI = mise à jour de toutes les apps
3. **Performance**: Next.js avec lazy loading automatique
4. **SEO optimisé**: SSR/SSG pour les sites publics
5. **Scalable**: Chaque app peut évoluer indépendamment
6. **Type-safe**: TypeScript partout

## 🔧 Développement

### Travailler sur qwanyx-ui

```bash
cd packages/qwanyx-ui
npm run dev  # Lance le playground de développement
```

### Créer une nouvelle app

```bash
cd apps/
npx create-next-app@latest nouvelle-app --typescript --tailwind --app
cd nouvelle-app
npm install @qwanyx/ui@file:../../packages/qwanyx-ui
```

### Ajouter qwanyx-ui à une app existante

```json
// Dans package.json de l'app
"dependencies": {
  "@qwanyx/ui": "file:../../packages/qwanyx-ui"
}
```

## 📱 Apps disponibles

### Autodin (Port 3001)
- Marketplace de pièces auto
- Theme: Orange/Noir
- Features: Recherche, annonces, messagerie

### Belgicomics (Port 3002)
- Marketplace de BD belges
- Theme: Gris/Rouge
- Features: Catalogue, vente, collection

### Personal-CASH (Port 3003)
- Gestion finances personnelles
- Theme: Bleu/Vert
- Features: Dashboard, factures, budgets

## 🌐 API Endpoints

- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion par code email
- `POST /auth/verify` - Vérifier code OTP
- `GET /users/profile` - Profil utilisateur
- Plus de détails dans `api/qwanyx-api/README.md`

## 🚀 Déploiement

### Production (PM2)

```bash
# Build toutes les apps
./deploy/build-all.sh

# Démarrer avec PM2
pm2 start ecosystem.config.js
```

### Docker

```bash
docker-compose up -d
```

## 📄 License

Propriétaire - QWANYX