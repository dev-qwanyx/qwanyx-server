#!/bin/bash
# COMMANDES POUR DÉPLOIEMENT (webhook + services)
# Exécuté automatiquement par le webhook OU manuellement via SSH

echo "🚀 PUSH REÇU - DÉPLOIEMENT EN COURS"
echo "============================================"
echo "Date: $(date)"
echo ""

# ========== ARRÊT DES SERVICES ==========
echo "⏹️  Arrêt des services Python..."
pkill -f "python3.*app_bulma.py" || true
pkill -f "python3.*app_v2.py" || true
sleep 2

# ========== MISE À JOUR DES BUILDS REACT ==========
echo ""
echo "📦 Copie des nouveaux builds React..."
echo "--------------------------------------------"
cp -r /opt/qwanyx/apps/qwanyx-server/autodin-ui/dist/* /opt/qwanyx/apps/qwanyx-server/autodin/frontend/static/ 2>/dev/null || echo "⚠️  Build autodin-ui non trouvé"
cp -r /opt/qwanyx/apps/qwanyx-server/belgicomics-ui/dist/* /opt/qwanyx/apps/qwanyx-server/belgicomics/frontend/static/ 2>/dev/null || echo "⚠️  Build belgicomics-ui non trouvé"

# ========== REDÉMARRAGE DES SERVICES ==========
echo ""
echo "🔄 Redémarrage des services..."
echo "--------------------------------------------"

# API QWANYX (MongoDB)
echo "▶️  API QWANYX..."
cd /opt/qwanyx/apps/qwanyx-server/qwanyx-api
nohup python3 app_v2.py > /tmp/qwanyx-api.log 2>&1 &
sleep 3

# Autodin (React build served by Flask)
echo "▶️  Autodin (avec URLs de production corrigées)..."
cd /opt/qwanyx/apps/qwanyx-server/autodin/frontend
nohup python3 app_bulma.py > /tmp/autodin.log 2>&1 &
sleep 2

# Belgicomics (React build served by Flask)
echo "▶️  Belgicomics (avec URLs de production corrigées)..."
cd /opt/qwanyx/apps/qwanyx-server/belgicomics/frontend
nohup python3 app_bulma.py > /tmp/belgicomics.log 2>&1 &
sleep 2

# ========== VÉRIFICATION ==========
echo ""
echo "✅ Vérification des services..."
echo "--------------------------------------------"
curl -s -o /dev/null -w "API QWANYX (5002): %{http_code}\n" http://localhost:5002/health || echo "API QWANYX: ERREUR"
curl -s -o /dev/null -w "Autodin (8090): %{http_code}\n" http://localhost:8090 || echo "Autodin: ERREUR"
curl -s -o /dev/null -w "Belgicomics (8091): %{http_code}\n" http://localhost:8091 || echo "Belgicomics: ERREUR"

echo ""
echo "🎉 DÉPLOIEMENT TERMINÉ"
echo "============================================"
echo "📝 Logs disponibles:"
echo "  - /tmp/qwanyx-api.log"
echo "  - /tmp/autodin.log"
echo "  - /tmp/belgicomics.log"
echo ""
echo "🌐 URLs publiques:"
echo "  - http://135.181.72.183:8090 (Autodin)"
echo "  - http://135.181.72.183:8091 (Belgicomics)"
echo "  - http://135.181.72.183:5002 (API)"