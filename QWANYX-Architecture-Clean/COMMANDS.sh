#!/bin/bash
# COMMANDES POUR DÉPLOIEMENT QWANYX ARCHITECTURE
# Exécuté automatiquement par le webhook après push sur GitHub

echo "🚀 DÉPLOIEMENT QWANYX - NOUVELLE ARCHITECTURE"
echo "============================================"
echo "Date: $(date)"
echo ""

# Navigation vers le dossier principal
cd /opt/qwanyx/QWANYX-Architecture-Clean || exit 1

# ========== GIT PULL AVEC RESET ==========
echo "📥 MISE À JOUR DU CODE DEPUIS GITHUB"
echo "--------------------------------------------"

# Reset dur pour s'assurer que le serveur est propre
echo "🧹 Nettoyage des changements locaux..."
git reset --hard HEAD

# Pull des derniers changements
echo "📥 Récupération des derniers changements..."
git pull origin main

echo "✅ Code mis à jour (serveur synchronisé avec GitHub)"
echo ""

# ========== BUILD DES PACKAGES ==========
echo "📦 BUILD DES PACKAGES MONOREPO"
echo "--------------------------------------------"

# Build qwanyx-ui
echo "🎨 Build @qwanyx/ui..."
cd packages/qwanyx-ui
npm install
npm run build
echo "✅ @qwanyx/ui prêt"

# Build qwanyx-thot
echo ""
echo "🤖 Build @qwanyx/thot..."
cd ../qwanyx-thot
npm install
npm run build
echo "✅ @qwanyx/thot prêt"

# Build autres packages si nécessaire
echo ""
echo "📦 Build autres packages..."
cd ../qwanyx-dashboard-v2
npm install
npm run build
echo "✅ @qwanyx/dashboard-v2 prêt"

cd ../qwanyx-app-core
npm install
npm run build
echo "✅ @qwanyx/app-core prêt"

# ========== DÉPLOIEMENT AUTODIN NEXT.JS ==========
echo ""
echo "🚗 DÉPLOIEMENT AUTODIN NEXT.JS"
echo "--------------------------------------------"

cd /opt/qwanyx/QWANYX-Architecture-Clean/apps/autodin

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm install

# Build de production
echo "🔨 Build de production..."
npm run build

# Redémarrage avec PM2
echo "🔄 Redémarrage du service..."
pm2 stop autodin-next 2>/dev/null || true
pm2 delete autodin-next 2>/dev/null || true
PORT=3002 pm2 start npm --name "autodin-next" -- start
pm2 save

echo "✅ Autodin Next.js déployé sur port 3002"

# ========== SPU RUST (nouveau backend) ==========
echo ""
echo "🦀 DÉPLOIEMENT SPU RUST"
echo "--------------------------------------------"

# Arrêt de l'ancienne API Python et du SPU
pkill -f "python3.*app_v2.py" || true
pkill -f "spu-core" || true
sleep 2

# Build et démarrage du SPU Rust
cd /opt/qwanyx/QWANYX-Architecture-Clean/qwanyx-brain/spu-core
echo "🔨 Build du SPU Core..."
cargo build --release
if [ $? -eq 0 ]; then
    echo "✅ Build SPU réussi"
    # Démarrage du SPU
    nohup ./target/release/spu-core > /tmp/spu.log 2>&1 &
    sleep 3
    echo "✅ SPU démarré sur port 5002"
else
    echo "❌ Erreur lors du build SPU"
fi

# ========== VÉRIFICATION DES SERVICES ==========
echo ""
echo "✅ VÉRIFICATION DES SERVICES"
echo "--------------------------------------------"
sleep 5

# Test des endpoints
curl -s -o /dev/null -w "Autodin Next.js (3002): %{http_code}\n" http://localhost:3002 || echo "❌ Autodin Next.js: ERREUR"
curl -s -o /dev/null -w "SPU Core (5002): %{http_code}\n" http://localhost:5002/health || echo "❌ SPU Core: ERREUR"

# ========== RÉSUMÉ ==========
echo ""
echo "🎉 DÉPLOIEMENT TERMINÉ"
echo "============================================"
echo ""
echo "📝 Logs disponibles:"
echo "  - PM2: pm2 logs autodin-next"
echo "  - SPU: /tmp/spu.log"
echo ""
echo "🌐 URLs publiques:"
echo "  - http://135.181.72.183:3002 (Autodin Next.js)"
echo "  - http://135.181.72.183:5002 (SPU Core Backend)"
echo ""
echo "💡 Commandes utiles:"
echo "  - pm2 status           # Voir l'état des services"
echo "  - pm2 logs autodin-next # Voir les logs en temps réel"
echo "  - pm2 restart autodin-next # Redémarrer si nécessaire"
echo ""
echo "============================================"
date