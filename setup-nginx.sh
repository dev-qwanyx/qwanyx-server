#!/bin/bash
# Script d'installation et configuration de nginx pour les sites QWANYX

echo "🔧 Configuration de nginx pour QWANYX"
echo "====================================="

# Installation de nginx si nécessaire
if ! command -v nginx &> /dev/null; then
    echo "📦 Installation de nginx..."
    apt-get update
    apt-get install -y nginx
else
    echo "✅ nginx déjà installé"
fi

# Arrêter les anciens serveurs Python http.server
echo "🛑 Arrêt des anciens serveurs Python..."
pkill -f "python3.*http.server.*8090" || true
pkill -f "python3.*http.server.*8091" || true

# Créer les répertoires si nécessaire
mkdir -p /opt/qwanyx/apps/autodin-react
mkdir -p /opt/qwanyx/apps/belgicomics-react

# Copier les configurations nginx
echo "📝 Installation des configurations nginx..."
cp /opt/qwanyx/apps/qwanyx-server/nginx-configs/autodin.conf /etc/nginx/sites-available/
cp /opt/qwanyx/apps/qwanyx-server/nginx-configs/belgicomics.conf /etc/nginx/sites-available/

# Créer les liens symboliques
ln -sf /etc/nginx/sites-available/autodin.conf /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/belgicomics.conf /etc/nginx/sites-enabled/

# Supprimer le site par défaut si présent
rm -f /etc/nginx/sites-enabled/default

# Tester la configuration
echo "🧪 Test de la configuration nginx..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuration valide"
    
    # Recharger nginx
    echo "🔄 Rechargement de nginx..."
    systemctl reload nginx
    systemctl enable nginx
    
    echo "✅ nginx configuré avec succès!"
    echo ""
    echo "📊 Sites configurés:"
    echo "  - Autodin: http://135.181.72.183:8090"
    echo "  - Belgicomics: http://135.181.72.183:8091"
else
    echo "❌ Erreur dans la configuration nginx"
    exit 1
fi