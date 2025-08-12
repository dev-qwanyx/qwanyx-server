#!/bin/bash
# Script de déploiement pour le nouveau Belgicomics React

echo "🚀 Déploiement du nouveau Belgicomics React"
echo "============================================"

# Variables
SERVER="135.181.72.183"
SERVER_USER="root"  # ou votre utilisateur
REMOTE_PATH="/opt/qwanyx/apps/belgicomics-react"
LOCAL_BUILD_PATH="belgicomics-ui/dist"

# Build le projet localement (si pas déjà fait)
echo "→ Build du projet..."
cd belgicomics-ui
npm run build
cd ..

# Créer le répertoire sur le serveur s'il n'existe pas
echo "→ Préparation du serveur..."
ssh $SERVER_USER@$SERVER "mkdir -p $REMOTE_PATH"

# Copier les fichiers de build vers le serveur
echo "→ Copie des fichiers vers le serveur..."
scp -r $LOCAL_BUILD_PATH/* $SERVER_USER@$SERVER:$REMOTE_PATH/

# Créer un serveur simple avec Python pour servir le site React
echo "→ Configuration du serveur..."
ssh $SERVER_USER@$SERVER << 'EOF'
# Arrêter l'ancien serveur Flask Belgicomics
pkill -f "belgicomics.*app_bulma.py" || true

# Créer un script de démarrage pour le nouveau site
cat > /opt/qwanyx/apps/belgicomics-react/start.sh << 'SCRIPT'
#!/bin/bash
cd /opt/qwanyx/apps/belgicomics-react
python3 -m http.server 8091 --bind 0.0.0.0
SCRIPT

chmod +x /opt/qwanyx/apps/belgicomics-react/start.sh

# Démarrer le nouveau serveur
cd /opt/qwanyx/apps/belgicomics-react
nohup python3 -m http.server 8091 --bind 0.0.0.0 > /tmp/belgicomics-react.log 2>&1 &

echo "✅ Nouveau Belgicomics React déployé sur le port 8091"
EOF

echo ""
echo "✅ Déploiement terminé!"
echo "🔗 Le site est accessible à: http://135.181.72.183:8091"
echo ""
echo "Pour voir les logs:"
echo "  ssh $SERVER_USER@$SERVER 'tail -f /tmp/belgicomics-react.log'"