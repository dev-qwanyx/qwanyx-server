#!/bin/bash
# COMMANDES POUR REDÉMARRAGE COMPLET (webhook + services)
# Exécuté automatiquement par le webhook OU manuellement via SSH

echo "🚀 PUSH REÇU - DÉPLOIEMENT DES NOUVEAUX SITES REACT"
echo "============================================"
echo "Date: $(date)"
echo ""

# ========== DÉPLOIEMENT AUTODIN REACT ==========
echo "→ Arrêt de l'ancien Autodin Flask..."
pkill -f "autodin.*app_bulma.py" || true
sleep 2

echo "→ Préparation du nouveau Autodin React..."
# Créer le répertoire si nécessaire
mkdir -p /opt/qwanyx/apps/autodin-react

# Copier les fichiers du nouveau site (ils sont dans autodin-ui/dist)
if [ -d "/opt/qwanyx/apps/qwanyx-server/autodin-ui/dist" ]; then
    echo "→ Copie des fichiers du build Autodin React..."
    cp -r /opt/qwanyx/apps/qwanyx-server/autodin-ui/dist/* /opt/qwanyx/apps/autodin-react/
    
    # Démarrer le serveur HTTP Python pour servir le site React
    echo "→ Démarrage du nouveau Autodin React..."
    cd /opt/qwanyx/apps/autodin-react
    nohup python3 -m http.server 8090 --bind 0.0.0.0 > /tmp/autodin-react.log 2>&1 &
    echo "✅ Nouveau Autodin React lancé sur 8090"
else
    echo "⚠️  Build Autodin React non trouvé - Vérifiez que le build a été fait"
    echo "   Pour créer le build: cd autodin-ui && npm install && npm run build"
fi

# ========== DÉPLOIEMENT BELGICOMICS REACT ==========
echo "→ Arrêt de l'ancien Belgicomics Flask..."
pkill -f "belgicomics.*app_bulma.py" || true
sleep 2

echo "→ Préparation du nouveau Belgicomics React..."
# Créer le répertoire si nécessaire
mkdir -p /opt/qwanyx/apps/belgicomics-react

# Copier les fichiers du nouveau site (ils sont dans belgicomics-ui/dist)
if [ -d "/opt/qwanyx/apps/qwanyx-server/belgicomics-ui/dist" ]; then
    echo "→ Copie des fichiers du build Belgicomics React..."
    cp -r /opt/qwanyx/apps/qwanyx-server/belgicomics-ui/dist/* /opt/qwanyx/apps/belgicomics-react/
    
    # Démarrer le serveur HTTP Python pour servir le site React
    echo "→ Démarrage du nouveau Belgicomics React..."
    cd /opt/qwanyx/apps/belgicomics-react
    nohup python3 -m http.server 8091 --bind 0.0.0.0 > /tmp/belgicomics-react.log 2>&1 &
    echo "✅ Nouveau Belgicomics React lancé sur 8091"
else
    echo "⚠️  Build Belgicomics React non trouvé - Vérifiez que le build a été fait"
    echo "   Pour créer le build: cd belgicomics-ui && npm install && npm run build"
fi

# ========== REDÉMARRAGE DE L'API QWANYX ==========
echo "→ Redémarrage de l'API QWANYX..."
pkill -f "qwanyx-api.*app.py" || true
sleep 2
cd /opt/qwanyx/apps/qwanyx-server/qwanyx-api
nohup python3 app.py > /tmp/api.log 2>&1 &
echo "✅ API QWANYX lancée sur 5002"

# ========== VÉRIFICATION DU WEBHOOK ==========
echo "→ Vérification du webhook..."
if ! pgrep -f "webhook-simple.py" > /dev/null; then
    echo "  → Démarrage du webhook server..."
    cd /opt/qwanyx/apps/qwanyx-server
    nohup python3 webhook-simple.py > /tmp/webhook.log 2>&1 &
    echo "✅ Webhook lancé sur 9999"
else
    echo "✅ Webhook déjà actif"
fi

# Vérification après 5 secondes
sleep 5
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
echo "✅ Script de déploiement terminé!"
echo ""
echo "🔗 URLs publiques:"
echo "  - Autodin (NOUVEAU REACT): http://135.181.72.183:8090"
echo "  - Belgicomics (NOUVEAU REACT): http://135.181.72.183:8091"
echo "  - API QWANYX: http://135.181.72.183:5002"
echo "  - Webhook: http://135.181.72.183:9999"
echo ""
echo "Pour vérifier les logs:"
echo "  tail -f /tmp/autodin-react.log"
echo "  tail -f /tmp/belgicomics-react.log"
echo "  tail -f /tmp/api.log"
echo "  tail -f /tmp/webhook.log"