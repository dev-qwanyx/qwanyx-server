#!/bin/bash
# COMMANDES POUR REDÉMARRAGE COMPLET (webhook + services)
# Exécuté automatiquement par le webhook OU manuellement via SSH

echo "🚀 REDÉMARRAGE COMPLET DES SERVICES"
echo "===================================="
echo "Date: $(date)"

# Aller dans le bon répertoire
cd /opt/qwanyx/apps/qwanyx-server

# Si exécuté manuellement, faire le pull
if [ "$1" != "no-pull" ]; then
    echo "→ Récupération du dernier code..."
    git pull origin main
fi

# Arrêter les services SAUF le webhook
echo "→ Arrêt des services (sauf webhook)..."
# Tuer spécifiquement chaque service mais PAS le webhook
pkill -f "app_bulma.py" || true
pkill -f "app.py" || true
# Ne PAS tuer webhook-simple.py pour qu'il puisse continuer
sleep 3

# 1. Redémarrer Autodin
echo "→ Démarrage d'Autodin..."
cd /opt/qwanyx/apps/qwanyx-server/autodin/frontend
nohup python3 app_bulma.py > /tmp/autodin.log 2>&1 &
echo "✅ Autodin lancé sur 8090"

# 2. Redémarrer Belgicomics
echo "→ Démarrage de Belgicomics..."
cd /opt/qwanyx/apps/qwanyx-server/belgicomics/frontend
nohup python3 app_bulma.py > /tmp/belgicomics.log 2>&1 &
echo "✅ Belgicomics lancé sur 8091"

# 3. Redémarrer l'API QWANYX
echo "→ Démarrage de l'API QWANYX..."
cd /opt/qwanyx/apps/qwanyx-server/qwanyx-api
nohup python3 app.py > /tmp/api.log 2>&1 &
echo "✅ API lancée sur 5002"

# 4. Relancer le webhook SEULEMENT s'il n'est pas déjà actif
echo "→ Vérification du webhook..."
if ! pgrep -f "webhook-simple.py" > /dev/null; then
    echo "  → Démarrage du webhook server..."
    cd /opt/qwanyx/apps/qwanyx-server
    nohup python3 webhook-simple.py > /tmp/webhook.log 2>&1 &
    echo "✅ Webhook lancé sur 9999"
else
    echo "✅ Webhook déjà actif"
fi

# Vérifier après 5 secondes
sleep 5
echo ""
echo "📊 Vérification des services:"
echo "--------------------------------"

# Vérifier chaque service
echo -n "Autodin (8090): "
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8090 || echo "ERREUR"

echo -n "Belgicomics (8091): "
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8091 || echo "ERREUR"

echo -n "API QWANYX (5002): "
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5002 || echo "ERREUR"

echo -n "Webhook (9999): "
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:9999/health || echo "ERREUR"

echo ""
echo "✅ Script de redémarrage terminé!"
echo ""
echo "🔗 URLs publiques:"
echo "  - Autodin: http://135.181.72.183:8090"
echo "  - Belgicomics: http://135.181.72.183:8091"
echo "  - API: http://135.181.72.183:5002"
echo "  - Webhook: http://135.181.72.183:9999"
echo ""
echo "Pour vérifier les logs:"
echo "  tail -f /tmp/autodin.log"
echo "  tail -f /tmp/belgicomics.log"
echo "  tail -f /tmp/api.log"