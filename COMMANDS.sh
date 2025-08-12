#!/bin/bash
# COMMANDES POUR DÉPLOIEMENT (webhook + services)
# Exécuté automatiquement par le webhook OU manuellement via SSH

echo "🚀 PUSH REÇU - DÉPLOIEMENT EN COURS"
echo "============================================"
echo "Date: $(date)"
echo ""

# ========== DÉPLOIEMENT AUTODIN REACT ==========
echo "📦 Déploiement Autodin React..."

# Créer le répertoire si nécessaire
mkdir -p /opt/qwanyx/apps/autodin-react

# Copier les fichiers du nouveau site (ils sont dans autodin-ui/dist)
if [ -d "/opt/qwanyx/apps/qwanyx-server/autodin-ui/dist" ]; then
    echo "→ Copie des fichiers du build Autodin React..."
    cp -r /opt/qwanyx/apps/qwanyx-server/autodin-ui/dist/* /opt/qwanyx/apps/autodin-react/
    echo "✅ Autodin React mis à jour"
    
    # Vérifier si le serveur tourne, sinon le démarrer
    if ! pgrep -f "python3.*http.server.*8090" > /dev/null; then
        echo "→ Démarrage du serveur Autodin..."
        cd /opt/qwanyx/apps/autodin-react
        nohup python3 -m http.server 8090 --bind 0.0.0.0 > /tmp/autodin-react.log 2>&1 &
        echo "✅ Serveur Autodin démarré sur 8090"
    else
        echo "✅ Serveur Autodin déjà actif"
    fi
else
    echo "⚠️  Build Autodin React non trouvé"
fi

# ========== DÉPLOIEMENT BELGICOMICS REACT ==========
echo "📦 Déploiement Belgicomics React..."

# Créer le répertoire si nécessaire
mkdir -p /opt/qwanyx/apps/belgicomics-react

# Copier les fichiers du nouveau site (ils sont dans belgicomics-ui/dist)
if [ -d "/opt/qwanyx/apps/qwanyx-server/belgicomics-ui/dist" ]; then
    echo "→ Copie des fichiers du build Belgicomics React..."
    cp -r /opt/qwanyx/apps/qwanyx-server/belgicomics-ui/dist/* /opt/qwanyx/apps/belgicomics-react/
    echo "✅ Belgicomics React mis à jour"
    
    # Vérifier si le serveur tourne, sinon le démarrer
    if ! pgrep -f "python3.*http.server.*8091" > /dev/null; then
        echo "→ Démarrage du serveur Belgicomics..."
        cd /opt/qwanyx/apps/belgicomics-react
        nohup python3 -m http.server 8091 --bind 0.0.0.0 > /tmp/belgicomics-react.log 2>&1 &
        echo "✅ Serveur Belgicomics démarré sur 8091"
    else
        echo "✅ Serveur Belgicomics déjà actif"
    fi
else
    echo "⚠️  Build Belgicomics React non trouvé"
fi

# ========== VÉRIFICATION DE L'API QWANYX ==========
echo "🔍 Vérification de l'API QWANYX..."
if ! pgrep -f "qwanyx-api.*app.py" > /dev/null; then
    echo "⚠️  API non détectée, démarrage..."
    cd /opt/qwanyx/apps/qwanyx-server/qwanyx-api
    nohup python3 app.py > /tmp/api.log 2>&1 &
    echo "✅ API QWANYX lancée sur 5002"
else
    echo "✅ API QWANYX déjà active"
fi

# ========== VÉRIFICATION DU WEBHOOK ==========
echo "🔍 Vérification du webhook..."
if ! pgrep -f "webhook-simple.py" > /dev/null; then
    echo "→ Démarrage du webhook server..."
    cd /opt/qwanyx/apps/qwanyx-server
    nohup python3 webhook-simple.py > /tmp/webhook.log 2>&1 &
    echo "✅ Webhook lancé sur 9999"
else
    echo "✅ Webhook déjà actif"
fi

# Vérification après 3 secondes
sleep 3
echo ""
echo "📊 Vérification des services:"
echo "--------------------------------"

# Vérifier chaque service
echo -n "Autodin React (8090): "
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8090 || echo "ERREUR"

echo -n "Belgicomics React (8091): "
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8091 || echo "ERREUR"

echo -n "API QWANYX (5002): "
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5002/health || echo "ERREUR"

echo -n "Webhook (9999): "
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:9999/health || echo "ERREUR"

echo ""
echo "✅ Déploiement terminé!"
echo ""
echo "🔗 URLs publiques:"
echo "  - Autodin: http://135.181.72.183:8090"
echo "  - Belgicomics: http://135.181.72.183:8091"
echo "  - API QWANYX: http://135.181.72.183:5002"
echo ""
echo "📝 Pour vérifier les logs:"
echo "  tail -f /tmp/autodin-react.log"
echo "  tail -f /tmp/belgicomics-react.log"
echo "  tail -f /tmp/api.log"
echo "  tail -f /tmp/webhook.log"