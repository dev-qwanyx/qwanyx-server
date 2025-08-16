#!/bin/bash
# Script de déploiement pour installer les modules sur le serveur
# À exécuter sur le serveur après git pull

echo "🚀 INSTALLATION DES MODULES REACT"
echo "============================================"
echo "Date: $(date)"
echo ""

cd /opt/qwanyx/apps/qwanyx-server

# ========== INSTALLATION QWANYX-UI ==========
echo "📦 Installation de qwanyx-ui..."
echo "--------------------------------------------"
if [ -d "qwanyx-ui" ]; then
    cd qwanyx-ui
    npm install
    npm run build
    echo "✅ qwanyx-ui installé et construit"
else
    echo "❌ Dossier qwanyx-ui non trouvé!"
fi

# ========== INSTALLATION QWANYX-MODULES ==========
echo ""
echo "📦 Installation de qwanyx-modules..."
echo "--------------------------------------------"
cd /opt/qwanyx/apps/qwanyx-server
if [ -d "qwanyx-modules" ]; then
    cd qwanyx-modules
    npm install
    npm run build
    npm run dev &
    MODULES_PID=$!
    echo "✅ qwanyx-modules installé et lancé (PID: $MODULES_PID)"
    echo "   Accessible sur http://localhost:4184"
else
    echo "❌ Dossier qwanyx-modules non trouvé!"
fi

# ========== INSTALLATION AUTODIN-UI ==========
echo ""
echo "📦 Installation de autodin-ui..."
echo "--------------------------------------------"
cd /opt/qwanyx/apps/qwanyx-server
if [ -d "autodin-ui" ]; then
    cd autodin-ui
    npm install
    # Build en mode production avec les bonnes URLs
    export VITE_API_URL=http://135.181.72.183:5002
    npm run build || echo "⚠️ Build autodin-ui a échoué (erreurs TypeScript ignorées)"
    echo "✅ autodin-ui installé"
else
    echo "❌ Dossier autodin-ui non trouvé!"
fi

# ========== COPIE DES BUILDS VERS FLASK ==========
echo ""
echo "📋 Copie des builds React vers les dossiers Flask..."
echo "--------------------------------------------"
cd /opt/qwanyx/apps/qwanyx-server

# Copier le build autodin-ui vers autodin/frontend/static
if [ -d "autodin-ui/dist" ]; then
    cp -r autodin-ui/dist/* autodin/frontend/static/
    echo "✅ Build autodin-ui copié vers autodin/frontend/static"
else
    echo "⚠️ Build autodin-ui non trouvé, Flask servira l'ancien build"
fi

echo ""
echo "🎉 INSTALLATION TERMINÉE"
echo "============================================"
echo "Les modules sont installés. Utilisez COMMANDS.sh pour redémarrer les services Flask."