#!/bin/bash
# COMMANDES À EXÉCUTER SUR LE SERVEUR
# Claude écrit ici, le serveur exécute automatiquement après pull

echo "🚀 Redémarrage des services QWANYX..."

# 1. Redémarrer Belgicomics
echo "→ Démarrage de Belgicomics..."
cd /opt/qwanyx/apps/qwanyx-server/belgicomics/frontend
pkill -f "belgicomics/frontend/app_bulma.py" || true
nohup python3 app_bulma.py > /var/log/belgicomics.log 2>&1 &
echo "✅ Belgicomics lancé sur le port 8091"

# 2. Redémarrer l'API QWANYX
echo "→ Démarrage de l'API QWANYX..."
cd /opt/qwanyx/apps/qwanyx-server/qwanyx-api
pkill -f "qwanyx-api/app.py" || true
nohup python3 app.py > /var/log/qwanyx-api.log 2>&1 &
echo "✅ API QWANYX lancée sur le port 5002"

# 3. Vérifier les processus
sleep 3
echo ""
echo "📊 Vérification des services:"
ps aux | grep -E "(autodin|belgicomics|qwanyx-api)" | grep -v grep || echo "Aucun service trouvé"

echo ""
echo "✅ Services redémarrés avec succès!"