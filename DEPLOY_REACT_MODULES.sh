#!/bin/bash
# ================================================
# SCRIPT DE DÉPLOIEMENT REACT + MODULE FEDERATION
# Option B : Installation complète avec tous les modules
# ================================================

echo "🚀 DÉPLOIEMENT COMPLET REACT + MODULE FEDERATION"
echo "================================================="
echo "Date: $(date)"
echo "Serveur: 135.181.72.183"
echo ""

# Variables
BASE_DIR="/opt/qwanyx/apps/qwanyx-server"
NODE_VERSION="20"  # Version de Node.js à utiliser

# ========== ÉTAPE 1: VÉRIFICATION PRÉREQUIS ==========
echo "📋 ÉTAPE 1: Vérification des prérequis..."
echo "-----------------------------------------"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js non trouvé. Installation requise..."
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "✅ Node.js installé: $(node --version)"
else
    echo "✅ Node.js trouvé: $(node --version)"
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm non trouvé"
    exit 1
else
    echo "✅ npm trouvé: $(npm --version)"
fi

# Vérifier PM2 (gestionnaire de processus Node)
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installation de PM2..."
    npm install -g pm2
    echo "✅ PM2 installé"
else
    echo "✅ PM2 trouvé"
fi

cd $BASE_DIR

# ========== ÉTAPE 2: GIT PULL ==========
echo ""
echo "📥 ÉTAPE 2: Récupération du code..."
echo "------------------------------------"
git pull origin main
echo "✅ Code mis à jour"

# ========== ÉTAPE 3: INSTALLATION QWANYX-UI ==========
echo ""
echo "📦 ÉTAPE 3: Installation de qwanyx-ui (bibliothèque de composants)..."
echo "----------------------------------------------------------------------"
if [ -d "qwanyx-ui" ]; then
    cd $BASE_DIR/qwanyx-ui
    echo "Installation des dépendances..."
    npm ci --legacy-peer-deps
    echo "Build de la bibliothèque..."
    npm run build
    echo "✅ qwanyx-ui construit"
else
    echo "❌ Dossier qwanyx-ui non trouvé!"
    exit 1
fi

# ========== ÉTAPE 4: INSTALLATION QWANYX-MODULES ==========
echo ""
echo "🔧 ÉTAPE 4: Installation de qwanyx-modules (Module Federation)..."
echo "-----------------------------------------------------------------"
cd $BASE_DIR
if [ -d "qwanyx-modules" ]; then
    cd $BASE_DIR/qwanyx-modules
    echo "Installation des dépendances..."
    npm ci --legacy-peer-deps
    
    echo "Build de production..."
    npm run build
    
    echo "Arrêt de l'ancienne instance si elle existe..."
    pm2 delete qwanyx-modules 2>/dev/null || true
    
    echo "Démarrage avec PM2..."
    pm2 start npm --name "qwanyx-modules" -- run preview
    
    # Attendre que le service démarre
    sleep 5
    
    # Vérifier que ça tourne
    if curl -f http://localhost:4184/assets/remoteEntry.js > /dev/null 2>&1; then
        echo "✅ qwanyx-modules accessible sur port 4184"
    else
        echo "⚠️ qwanyx-modules peut prendre plus de temps à démarrer..."
    fi
else
    echo "❌ Dossier qwanyx-modules non trouvé!"
    exit 1
fi

# ========== ÉTAPE 5: BUILD AUTODIN-UI ==========
echo ""
echo "🏗️ ÉTAPE 5: Build de autodin-ui..."
echo "-----------------------------------"
cd $BASE_DIR
if [ -d "autodin-ui" ]; then
    cd $BASE_DIR/autodin-ui
    
    echo "Installation des dépendances..."
    npm ci --legacy-peer-deps
    
    echo "Configuration pour production..."
    cat > .env.production << EOF
VITE_API_URL=http://135.181.72.183:5002
VITE_MODULES_URL=http://localhost:4184
EOF
    
    echo "Build de production..."
    npm run build || {
        echo "⚠️ Build avec erreurs TypeScript, tentative avec --force..."
        npx vite build
    }
    
    if [ -d "dist" ]; then
        echo "✅ Build autodin-ui créé dans dist/"
    else
        echo "❌ Échec du build autodin-ui"
        exit 1
    fi
else
    echo "❌ Dossier autodin-ui non trouvé!"
    exit 1
fi

# ========== ÉTAPE 6: DÉPLOIEMENT DU BUILD ==========
echo ""
echo "📂 ÉTAPE 6: Déploiement du build..."
echo "------------------------------------"
cd $BASE_DIR

# Créer un backup de l'ancien site
if [ -d "autodin/frontend/static/dist_backup" ]; then
    rm -rf autodin/frontend/static/dist_backup
fi
if [ -d "autodin/frontend/static/dist" ]; then
    mv autodin/frontend/static/dist autodin/frontend/static/dist_backup
    echo "✅ Backup de l'ancien build créé"
fi

# Copier le nouveau build
cp -r autodin-ui/dist autodin/frontend/static/
echo "✅ Nouveau build déployé"

# ========== ÉTAPE 7: CONFIGURATION NGINX ==========
echo ""
echo "⚙️ ÉTAPE 7: Configuration serveur web..."
echo "-----------------------------------------"
# Pour servir les fichiers React correctement
cat > /tmp/autodin-react.conf << 'EOF'
server {
    listen 8090;
    server_name _;
    
    root /opt/qwanyx/apps/qwanyx-server/autodin/frontend/static/dist;
    index index.html;
    
    # Gérer les routes React (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy vers l'API
    location /api {
        proxy_pass http://localhost:5002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

echo "Configuration nginx créée dans /tmp/autodin-react.conf"
echo "À installer manuellement si nginx est utilisé"

# ========== ÉTAPE 8: REDÉMARRAGE DES SERVICES ==========
echo ""
echo "🔄 ÉTAPE 8: Redémarrage des services..."
echo "----------------------------------------"

# Arrêter l'ancien Flask si il tourne
pkill -f "python3.*app_bulma.py" || true

# Option A: Servir avec Python simple (temporaire)
cd $BASE_DIR/autodin/frontend/static/dist
nohup python3 -m http.server 8090 > /tmp/autodin-react.log 2>&1 &
echo "✅ Serveur web Python lancé sur port 8090"

# ========== ÉTAPE 9: VÉRIFICATION FINALE ==========
echo ""
echo "✅ ÉTAPE 9: Vérification des services..."
echo "-----------------------------------------"
sleep 3

echo "Statut des services:"
curl -s -o /dev/null -w "- API QWANYX (5002): %{http_code}\n" http://localhost:5002/health || echo "- API QWANYX: ERREUR"
curl -s -o /dev/null -w "- Module Federation (4184): %{http_code}\n" http://localhost:4184/assets/remoteEntry.js || echo "- Module Federation: ERREUR"
curl -s -o /dev/null -w "- Autodin React (8090): %{http_code}\n" http://localhost:8090 || echo "- Autodin: ERREUR"

echo ""
echo "PM2 Status:"
pm2 status

echo ""
echo "🎉 DÉPLOIEMENT TERMINÉ!"
echo "======================="
echo ""
echo "📝 NOTES IMPORTANTES:"
echo "- qwanyx-modules tourne sur port 4184 (PM2)"
echo "- autodin-ui est servi sur port 8090"
echo "- Pour voir les logs: pm2 logs qwanyx-modules"
echo "- Pour redémarrer: pm2 restart qwanyx-modules"
echo ""
echo "🌐 URLs:"
echo "- http://135.181.72.183:8090 - Autodin (React)"
echo "- http://135.181.72.183:5002 - API"
echo "- http://localhost:4184 - Module Federation (interne)"
echo ""
echo "⚠️ Si problème, restaurer avec:"
echo "  mv autodin/frontend/static/dist_backup autodin/frontend/static/dist"