#!/bin/bash
# COMMANDES À EXÉCUTER SUR LE SERVEUR
# Claude écrit ici, le serveur exécute automatiquement après pull

echo "🔧 Configuration de l'envoi d'emails..."

# Créer un fichier .env pour l'API avec les credentials email
cat > /opt/qwanyx/apps/qwanyx-server/qwanyx-api/.env << 'EOF'
# Configuration SMTP pour l'envoi d'emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app
SMTP_FROM=QWANYX <noreply@qwanyx.com>

# MongoDB
MONGO_URI=mongodb://localhost:27017/

# JWT Secret
JWT_SECRET_KEY=your-secret-key-change-this-in-production
EOF

echo "⚠️ IMPORTANT: Modifiez /opt/qwanyx/apps/qwanyx-server/qwanyx-api/.env"
echo "   avec vos vrais credentials Gmail!"

# S'assurer d'avoir la dernière version
cd /opt/qwanyx/apps/qwanyx-server
git pull origin main

# Tuer TOUS les processus Python
echo "→ Arrêt de tous les services..."
pkill -f "python3" || true
sleep 2

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

# 4. Relancer le webhook
echo "→ Relance du webhook server..."
cd /opt/qwanyx/apps/qwanyx-server
nohup python3 webhook-server.py > /tmp/webhook.log 2>&1 &
echo "✅ Webhook lancé sur 9999"

# Vérifier après 5 secondes
sleep 5
echo ""
echo "📊 Vérification des services:"
curl -s -o /dev/null -w "Autodin: %{http_code}\n" http://localhost:8090
curl -s -o /dev/null -w "Belgicomics: %{http_code}\n" http://localhost:8091
curl -s -o /dev/null -w "API: %{http_code}\n" http://localhost:5002
curl -s -o /dev/null -w "Webhook: %{http_code}\n" http://localhost:9999/health

echo ""
echo "✅ Tous les services redémarrés avec le nouveau code!"