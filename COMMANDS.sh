#!/bin/bash
# COMMANDES À EXÉCUTER SUR LE SERVEUR
# Claude écrit ici, le serveur exécute automatiquement après pull

echo "🚀 Redémarrage urgent de l'API QWANYX..."

# Installer les dépendances au cas où
pip3 install --break-system-packages flask flask-cors pymongo bcrypt flask-jwt-extended

# Démarrer SEULEMENT l'API
echo "→ Démarrage de l'API QWANYX..."
cd /opt/qwanyx/apps/qwanyx-server/qwanyx-api
pkill -f "qwanyx-api/app.py" || true
sleep 1
nohup python3 app.py > /tmp/api.log 2>&1 &
echo "✅ API lancée"

# Vérifier après 3 secondes
sleep 3
echo "→ Test de l'API:"
curl -s http://localhost:5002 && echo " - API répond!" || echo " - API ne répond pas!"

# Afficher les logs en cas d'erreur
echo "→ Dernières lignes de log:"
tail -n 20 /tmp/api.log