#!/bin/bash
# Script pour déployer autodin-ui-next sur le serveur

echo "🚀 Déploiement de Autodin UI Next.js sur le serveur"
echo "===================================================="

SERVER_IP="135.181.72.183"
SERVER_USER="root"
SERVER_PATH="/opt/qwanyx/apps/qwanyx-server"

# 1. Build local
echo "📦 Build de production..."
cd autodin-ui-next
npm run build || exit 1

# 2. Créer une archive
echo "📦 Création de l'archive..."
cd ..
tar -czf autodin-ui-next.tar.gz \
  autodin-ui-next/package.json \
  autodin-ui-next/package-lock.json \
  autodin-ui-next/next.config.js \
  autodin-ui-next/.next \
  autodin-ui-next/public \
  autodin-ui-next/src \
  qwanyx-ui/package.json \
  qwanyx-ui/dist \
  qwanyx-ui/src

echo "📤 Upload vers le serveur..."
scp autodin-ui-next.tar.gz ${SERVER_USER}@${SERVER_IP}:${SERVER_PATH}/

# 3. Script de déploiement sur le serveur
echo "🔧 Déploiement sur le serveur..."
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
cd /opt/qwanyx/apps/qwanyx-server

# Extraire l'archive
echo "Extraction de l'archive..."
tar -xzf autodin-ui-next.tar.gz

# Installer qwanyx-ui
echo "Installation de qwanyx-ui..."
cd qwanyx-ui
npm link

# Installer autodin-ui-next
echo "Installation de autodin-ui-next..."
cd ../autodin-ui-next
npm install
npm link @qwanyx/ui

# Arrêter l'ancienne version
echo "Arrêt de l'ancienne version..."
pm2 stop autodin-ui 2>/dev/null || true

# Démarrer la nouvelle version
echo "Démarrage de la nouvelle version..."
PORT=4000 pm2 start npm --name "autodin-ui" -- start
pm2 save

# Vérifier que ça fonctionne
sleep 5
curl -s -o /dev/null -w "Autodin UI: %{http_code}\n" http://localhost:4000

echo "✅ Déploiement terminé!"
ENDSSH

echo ""
echo "✅ Déploiement complet!"
echo "Accessible sur:"
echo "  - http://135.181.72.183:4000"
echo "  - http://135.181.72.183/autodin (avec Nginx)"