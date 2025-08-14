#!/bin/bash
# Script de déploiement Autodin Next.js

echo "🚀 Déploiement Autodin UI (Next.js)"
echo "===================================="

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm install

# Build de production
echo "🔨 Build de production..."
npm run build

# Démarrage avec PM2
if command -v pm2 &> /dev/null; then
    echo "🔄 Démarrage avec PM2..."
    pm2 stop autodin-ui 2>/dev/null || true
    PORT=4000 pm2 start npm --name "autodin-ui" -- start
    pm2 save
else
    echo "▶️ Démarrage avec npm..."
    PORT=4000 npm start
fi

echo ""
echo "✅ Autodin UI déployé avec succès!"
echo "Accessible sur:"
echo "  - http://localhost:4000"
echo "  - http://135.181.72.183:4000"
echo "  - http://135.181.72.183/autodin (avec Nginx)"