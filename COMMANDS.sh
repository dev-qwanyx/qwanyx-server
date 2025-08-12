#!/bin/bash
# COMMANDES POUR DÉPLOIEMENT (webhook + services)
# Exécuté automatiquement par le webhook OU manuellement via SSH

echo "🚀 PUSH REÇU - DÉPLOIEMENT EN COURS"
echo "============================================"
echo "Date: $(date)"
echo ""

# ========== CONFIGURATION NGINX (première fois seulement) ==========
if [ ! -f /etc/nginx/sites-enabled/autodin.conf ] || [ ! -f /etc/nginx/sites-enabled/belgicomics.conf ]; then
    echo "⚙️  Configuration initiale de nginx..."
    
    # Installation de nginx si nécessaire
    if ! command -v nginx &> /dev/null; then
        apt-get update
        apt-get install -y nginx
    fi
    
    # Arrêter les anciens serveurs Python
    pkill -f "python3.*http.server.*8090" || true
    pkill -f "python3.*http.server.*8091" || true
    
    # Copier les configurations
    cp /opt/qwanyx/apps/qwanyx-server/nginx-configs/autodin.conf /etc/nginx/sites-available/
    cp /opt/qwanyx/apps/qwanyx-server/nginx-configs/belgicomics.conf /etc/nginx/sites-available/
    
    # Activer les sites
    ln -sf /etc/nginx/sites-available/autodin.conf /etc/nginx/sites-enabled/
    ln -sf /etc/nginx/sites-available/belgicomics.conf /etc/nginx/sites-enabled/
    
    # Supprimer le site par défaut
    rm -f /etc/nginx/sites-enabled/default
    
    # Tester et recharger
    nginx -t && systemctl reload nginx
    echo "✅ nginx configuré"
fi

# ========== DÉPLOIEMENT AUTODIN REACT ==========
echo "📦 Déploiement Autodin React..."

# Créer le répertoire si nécessaire
mkdir -p /opt/qwanyx/apps/autodin-react

# Copier les fichiers du build
if [ -d "/opt/qwanyx/apps/qwanyx-server/autodin-ui/dist" ]; then
    echo "→ Copie des fichiers Autodin..."
    cp -r /opt/qwanyx/apps/qwanyx-server/autodin-ui/dist/* /opt/qwanyx/apps/autodin-react/
    echo "✅ Autodin mis à jour"
else
    echo "⚠️  Build Autodin non trouvé"
fi

# ========== DÉPLOIEMENT BELGICOMICS REACT ==========
echo "📦 Déploiement Belgicomics React..."

# Créer le répertoire si nécessaire
mkdir -p /opt/qwanyx/apps/belgicomics-react

# Copier les fichiers du build
if [ -d "/opt/qwanyx/apps/qwanyx-server/belgicomics-ui/dist" ]; then
    echo "→ Copie des fichiers Belgicomics..."
    cp -r /opt/qwanyx/apps/qwanyx-server/belgicomics-ui/dist/* /opt/qwanyx/apps/belgicomics-react/
    echo "✅ Belgicomics mis à jour"
else
    echo "⚠️  Build Belgicomics non trouvé"
fi

# ========== RECHARGEMENT NGINX SI NÉCESSAIRE ==========
if systemctl is-active --quiet nginx; then
    echo "🔄 Rechargement de nginx..."
    nginx -s reload
    echo "✅ nginx rechargé"
else
    echo "⚠️  nginx n'est pas actif, démarrage..."
    systemctl start nginx
    echo "✅ nginx démarré"
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
    echo "→ Démarrage du webhook..."
    cd /opt/qwanyx/apps/qwanyx-server
    nohup python3 webhook-simple.py > /tmp/webhook.log 2>&1 &
    echo "✅ Webhook lancé sur 9999"
else
    echo "✅ Webhook déjà actif"
fi

# Vérification après 2 secondes
sleep 2
echo ""
echo "📊 Vérification des services:"
echo "--------------------------------"

# Vérifier chaque service
echo -n "Autodin (nginx:8090): "
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8090 || echo "ERREUR"

echo -n "Belgicomics (nginx:8091): "
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8091 || echo "ERREUR"

echo -n "API QWANYX (5002): "
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5002/health || echo "ERREUR"

echo -n "nginx status: "
systemctl is-active nginx || echo "ERREUR"

echo ""
echo "✅ Déploiement terminé!"
echo ""
echo "🔗 URLs publiques:"
echo "  - Autodin: http://135.181.72.183:8090"
echo "  - Belgicomics: http://135.181.72.183:8091"
echo "  - API QWANYX: http://135.181.72.183:5002"
echo ""
echo "📝 Logs disponibles:"
echo "  - nginx access: /var/log/nginx/*.access.log"
echo "  - nginx errors: /var/log/nginx/*.error.log"
echo "  - API: /tmp/api.log"