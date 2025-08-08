#!/bin/bash
# COMMANDES À EXÉCUTER SUR LE SERVEUR
# Claude écrit ici, le serveur exécute automatiquement après pull

echo "🚀 FIX URGENT - Redémarrage de l'API QWANYX..."

# S'assurer d'avoir la dernière version
cd /opt/qwanyx/apps/qwanyx-server
git pull origin main

# Tuer TOUT sur le port 5002
echo "→ Kill forcé du port 5002..."
fuser -k 5002/tcp 2>/dev/null || true
pkill -f "python3.*app.py" || true
sleep 2

# Vérifier que le port est libre
netstat -tulpn | grep 5002 && echo "⚠️ Port encore occupé!" || echo "✅ Port libre"

# Démarrer l'API
echo "→ Démarrage de l'API..."
cd /opt/qwanyx/apps/qwanyx-server/qwanyx-api
python3 app.py > /tmp/api.log 2>&1 &
echo "✅ API lancée, PID: $!"

# Vérifier après 3 secondes
sleep 3
echo "→ Test de l'API:"
curl -s http://localhost:5002 && echo " - API répond!" || echo " - API ne répond pas!"

# Afficher les logs en cas d'erreur
echo "→ Dernières lignes de log:"
tail -n 20 /tmp/api.log