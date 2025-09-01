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

# ========== INSTALLATION MONOREPO ==========
echo "📦 INSTALLATION DU MONOREPO"
echo "--------------------------------------------"

# Retour à la racine du projet
cd /opt/qwanyx/QWANYX-Architecture-Clean

# Installation des dépendances du monorepo (crée les symlinks)
echo "📦 Installation des dépendances du monorepo..."
npm install

echo "✅ Monorepo installé avec tous les symlinks"

# ========== BUILD DES PACKAGES ==========
echo ""
echo "🔨 BUILD DE TOUS LES PACKAGES"
echo "--------------------------------------------"

# Build tous les packages avec Turbo (respecte les dépendances)
echo "🚀 Build avec Turbo..."
npm run build:packages

echo "✅ Tous les packages sont prêts"

# ========== DÉPLOIEMENT AUTODIN NEXT.JS ==========
echo ""
echo "🚗 DÉPLOIEMENT AUTODIN NEXT.JS"
echo "--------------------------------------------"

cd /opt/qwanyx/QWANYX-Architecture-Clean/apps/autodin

# Les dépendances sont déjà installées via le monorepo
# Build de production
echo "🔨 Build de production..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build Next.js"
    echo "Essai de nettoyer le cache..."
    rm -rf .next
    npm run build
fi

# Redémarrage avec PM2
echo "🔄 Redémarrage du service..."
pm2 stop autodin-next 2>/dev/null || true
pm2 delete autodin-next 2>/dev/null || true
PORT=3002 pm2 start npm --name "autodin-next" -- start
pm2 save

# Vérifier que le service est bien démarré
sleep 5
pm2 status autodin-next

echo "✅ Autodin Next.js déployé sur port 3002"
echo "📝 Pour voir les logs: pm2 logs autodin-next"

# ========== SPU RUST (nouveau backend) ==========
echo ""
echo "🦀 DÉPLOIEMENT SPU RUST"
echo "--------------------------------------------"

# Arrêt de l'ancienne API Python et du SPU
echo "🔄 Arrêt des services existants..."
pkill -f "python3.*app_v2.py" || true
pkill -f "spu-core" || true
sleep 2

# Build et démarrage du SPU Rust
cd /opt/qwanyx/QWANYX-Architecture-Clean/qwanyx-brain/spu-core

# Vérifier si cargo est installé
if ! command -v cargo &> /dev/null; then
    echo "❌ Cargo n'est pas installé. Installation de Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
fi

echo "🔨 Build du SPU Core..."
cargo build --release
if [ $? -eq 0 ]; then
    echo "✅ Build SPU réussi"
    # Démarrage du SPU avec les bonnes variables d'environnement
    export MONGODB_URI="mongodb://qwanyx:Iwb35TnYj#Vf@localhost:27017/?authSource=admin"
    export SPU_PORT=5002
    nohup ./target/release/spu-core > /tmp/spu.log 2>&1 &
    sleep 3
    
    # Vérifier que le SPU est bien démarré
    if pgrep -f "spu-core" > /dev/null; then
        echo "✅ SPU démarré sur port 5002"
    else
        echo "❌ SPU n'a pas démarré. Vérification des logs..."
        tail -20 /tmp/spu.log
    fi
else
    echo "❌ Erreur lors du build SPU"
    echo "Vérification des logs de compilation..."
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