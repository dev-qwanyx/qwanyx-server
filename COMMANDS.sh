#!/bin/bash
# COMMANDES POUR DÉPLOIEMENT (webhook + services)
# Exécuté automatiquement par le webhook OU manuellement via SSH

echo "🚀 PUSH REÇU - DÉPLOIEMENT EN COURS"
echo "============================================"
echo "Date: $(date)"
echo ""

cd /opt/qwanyx/apps/qwanyx-server

# ========== DÉPLOIEMENT AUTODIN UI NEXT.JS ==========
if [ -d "autodin-ui-next" ]; then
    echo "📦 Déploiement de Autodin UI Next.js..."
    echo "--------------------------------------------"
    
    # Build et link qwanyx-ui
    echo "📦 Build de qwanyx-ui..."
    cd qwanyx-ui
    npm install
    npm run build
    npm link
    echo "✅ qwanyx-ui prêt"
    
    # Setup autodin-ui-next
    echo ""
    echo "📦 Setup de autodin-ui-next..."
    cd ../autodin-ui-next
    npm install
    npm link @qwanyx/ui
    echo "✅ Dépendances installées"
    
    # Build de production
    echo ""
    echo "🔨 Build de production..."
    npm run build
    echo "✅ Build terminé"
    
    # Redémarrage avec PM2
    echo ""
    echo "🔄 Redémarrage du service..."
    pm2 stop autodin-ui 2>/dev/null || true
    pm2 delete autodin-ui 2>/dev/null || true
    PORT=4000 pm2 start npm --name "autodin-ui" -- start
    pm2 save
    
    echo "✅ Autodin UI Next.js déployé sur port 4000"
    cd /opt/qwanyx/apps/qwanyx-server
fi

# ========== SERVICES PYTHON (anciens) ==========
echo ""
echo "⏹️  Arrêt des anciens services Python..."
pkill -f "python3.*app_bulma.py" || true
pkill -f "python3.*app_v2.py" || true
sleep 2

# API QWANYX (MongoDB)
echo "▶️  API QWANYX..."
cd /opt/qwanyx/apps/qwanyx-server/qwanyx-api
nohup python3 app_v2.py > /tmp/qwanyx-api.log 2>&1 &
sleep 3

# Autodin Flask (ancien - port 8090)
echo "▶️  Autodin Flask (ancien)..."
cd /opt/qwanyx/apps/qwanyx-server/autodin/frontend
nohup python3 app_bulma.py > /tmp/autodin.log 2>&1 &
sleep 2

# Belgicomics Flask
echo "▶️  Belgicomics..."
cd /opt/qwanyx/apps/qwanyx-server/belgicomics/frontend
nohup python3 app_bulma.py > /tmp/belgicomics.log 2>&1 &
sleep 2

# ========== VÉRIFICATION ==========
echo ""
echo "✅ Vérification des services..."
echo "--------------------------------------------"
curl -s -o /dev/null -w "API QWANYX (5002): %{http_code}\n" http://localhost:5002/health || echo "API QWANYX: ERREUR"
curl -s -o /dev/null -w "Autodin Next.js (4000): %{http_code}\n" http://localhost:4000 || echo "Autodin Next.js: Non déployé"
curl -s -o /dev/null -w "Autodin Flask (8090): %{http_code}\n" http://localhost:8090 || echo "Autodin Flask: ERREUR"
curl -s -o /dev/null -w "Belgicomics (8091): %{http_code}\n" http://localhost:8091 || echo "Belgicomics: ERREUR"

echo ""
echo "🎉 DÉPLOIEMENT TERMINÉ"
echo "============================================"
echo "📝 Logs disponibles:"
echo "  - PM2: pm2 logs autodin-ui"
echo "  - /tmp/qwanyx-api.log"
echo "  - /tmp/autodin.log"
echo "  - /tmp/belgicomics.log"
echo ""
echo "🌐 URLs publiques:"
echo "  - http://135.181.72.183:4000 (Autodin Next.js)"
echo "  - http://135.181.72.183:8090 (Autodin Flask ancien)"
echo "  - http://135.181.72.183:8091 (Belgicomics)"
echo "  - http://135.181.72.183:5002 (API)"