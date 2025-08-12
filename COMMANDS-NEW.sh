#!/bin/bash
echo "🚀 PUSH REÇU - DÉMARRAGE DES SERVICES"
echo "============================================"
echo "Date: $(date)"
echo ""

# Arrêter les anciens services
echo "→ Arrêt des anciens services..."
pkill -f "autodin.*app_bulma.py" || true
pkill -f "belgicomics.*app_bulma.py" || true
pkill -f "http.server 8091" || true
sleep 2

# 1. Redémarrer Autodin Flask
echo "→ Démarrage d'Autodin..."
cd /opt/qwanyx/apps/qwanyx-server/autodin/frontend
nohup python3 app_bulma.py > /tmp/autodin.log 2>&1 &
echo "✅ Autodin lancé sur 8090"

# 2. Démarrer le nouveau Belgicomics React
echo "→ Démarrage de Belgicomics React..."
cd /opt/qwanyx/apps/belgicomics-react
nohup python3 -m http.server 8091 --bind 0.0.0.0 > /tmp/belgicomics-react.log 2>&1 &
echo "✅ Belgicomics React lancé sur 8091"

# Vérification
sleep 3
echo ""
echo "📊 Vérification des services:"
echo "--------------------------------"
echo -n "Autodin (8090): "
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8090 || echo "ERREUR"
echo -n "Belgicomics React (8091): "
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8091 || echo "ERREUR"

echo ""
echo "✅ Déploiement terminé!"
echo ""
echo "🔗 URLs publiques:"
echo "  - Autodin: http://135.181.72.183:8090"
echo "  - Belgicomics React: http://135.181.72.183:8091"