#!/bin/bash
# COMMANDES À EXÉCUTER MANUELLEMENT SUR LE SERVEUR VIA SSH
# Se connecter au serveur et exécuter ces commandes

echo "🚀 REDÉMARRAGE COMPLET DES SERVICES"
echo "===================================="

# Aller dans le bon répertoire
cd /opt/qwanyx/apps/qwanyx-server

# Faire le pull manuellement
echo "→ Récupération du dernier code..."
git pull origin main

# Tuer TOUS les processus Python existants
echo "→ Arrêt de tous les services..."
pkill -f "python" || true
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

# Note: Le webhook doit être lancé séparément si nécessaire

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

echo ""
echo "✅ Script de redémarrage terminé!"
echo ""
echo "Pour vérifier les logs:"
echo "  tail -f /tmp/autodin.log"
echo "  tail -f /tmp/belgicomics.log"
echo "  tail -f /tmp/api.log"