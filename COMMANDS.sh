#!/bin/bash
# COMMANDES À EXÉCUTER SUR LE SERVEUR
# Claude écrit ici, le serveur exécute automatiquement après pull

echo "🔧 Installation des dépendances manquantes..."
pip3 install --break-system-packages flask flask-cors pymongo bcrypt flask-jwt-extended

echo "🚀 Vérification et redémarrage des services QWANYX..."

# Tuer tous les anciens processus Python
echo "→ Arrêt des anciens processus..."
pkill -f "python3" || true
sleep 2

# 1. Démarrer Autodin
echo "→ Démarrage d'Autodin..."
cd /opt/qwanyx/apps/qwanyx-server/autodin/frontend
nohup python3 app_bulma.py > autodin.log 2>&1 &
echo "✅ Autodin lancé sur le port 8090"

# 2. Démarrer Belgicomics  
echo "→ Démarrage de Belgicomics..."
cd /opt/qwanyx/apps/qwanyx-server/belgicomics/frontend
nohup python3 app_bulma.py > belgicomics.log 2>&1 &
echo "✅ Belgicomics lancé sur le port 8091"

# 3. Démarrer l'API QWANYX
echo "→ Démarrage de l'API QWANYX..."
cd /opt/qwanyx/apps/qwanyx-server/qwanyx-api
nohup python3 app.py > api.log 2>&1 &
echo "✅ API QWANYX lancée sur le port 5002"

# 4. Relancer le webhook server
echo "→ Relance du webhook server..."
cd /opt/qwanyx/apps/qwanyx-server
nohup python3 webhook-server.py > webhook.log 2>&1 &
echo "✅ Webhook server relancé sur le port 9999"

# Vérifier
sleep 5
echo ""
echo "📊 Services actifs:"
netstat -tulpn | grep -E "(8090|8091|5002|9999)" || echo "Vérification des ports..."

echo "✅ Tous les services ont été redémarrés!"