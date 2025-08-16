#!/bin/bash
# Script pour déploiement manuel sur le serveur

echo "🚀 Déploiement manuel de Autodin UI Next.js"
echo "==========================================="

# Se connecter au serveur et exécuter les commandes
ssh root@135.181.72.183 << 'ENDSSH'
cd /opt/qwanyx/apps/qwanyx-server

# 1. Git pull pour récupérer les derniers changements
echo "📥 Récupération du code..."
git pull origin main

# 2. Vérifier que autodin-ui-next existe
if [ ! -d "autodin-ui-next" ]; then
    echo "❌ ERREUR: autodin-ui-next n'existe pas!"
    echo "Le dossier n'a pas été synchronisé"
    exit 1
fi

# 3. Arrêter l'ancienne version Vite sur port 4000
echo "⏹️ Arrêt de l'ancienne version..."
pkill -f "vite.*--port 4000" || true
pm2 stop autodin-ui 2>/dev/null || true
pm2 delete autodin-ui 2>/dev/null || true

# 4. Build et installation de qwanyx-ui
echo "📦 Installation de qwanyx-ui..."
cd qwanyx-ui
npm install
npm run build
npm link
cd ..

# 5. Installation d'autodin-ui-next
echo "📦 Installation d'autodin-ui-next..."
cd autodin-ui-next
npm install
npm link @qwanyx/ui

# 6. Build de production
echo "🔨 Build de production..."
export NODE_ENV=production
export API_URL=http://135.181.72.183:5002
npm run build

# 7. Démarrage avec PM2
echo "🚀 Démarrage avec PM2..."
PORT=4000 pm2 start npm --name "autodin-ui-next" -- start
pm2 save

# 8. Vérification
sleep 5
echo ""
echo "✅ Vérification..."
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:4000

echo ""
echo "🎉 Déploiement terminé!"
echo "Accessible sur http://135.181.72.183:4000"
ENDSSH