#!/bin/bash
# SCRIPT DE DÉPLOIEMENT AUTOMATIQUE AVEC EXÉCUTION DE COMMANDES
# Usage: ./auto-deploy.sh [message]

echo "========================================="
echo "   🚀 DÉPLOIEMENT AUTOMATIQUE QWANYX"
echo "========================================="

# 1. COMMIT LOCAL
echo "→ Ajout des modifications..."
git add .

MESSAGE=${1:-"Auto-deploy $(date +%Y-%m-%d' '%H:%M)"}
echo "→ Commit: $MESSAGE"
git commit -m "$MESSAGE"

# 2. PUSH
echo "→ Push vers GitHub..."
git push origin main

# 3. CONNEXION AU SERVEUR ET EXÉCUTION
echo "→ Exécution sur le serveur..."
ssh root@135.181.72.183 << 'ENDSSH'
cd /opt/qwanyx/apps/qwanyx-server

# Pull les changements
echo "→ Pull des dernières modifications..."
git pull origin main

# Rendre COMMANDS.sh exécutable
chmod +x COMMANDS.sh

# EXÉCUTER LES COMMANDES DE CLAUDE
if [ -f "COMMANDS.sh" ]; then
    echo "→ Exécution de COMMANDS.sh..."
    ./COMMANDS.sh
    
    # Vider le fichier après exécution pour la prochaine fois
    echo '#!/bin/bash' > COMMANDS.sh
    echo '# COMMANDES À EXÉCUTER SUR LE SERVEUR' >> COMMANDS.sh
    echo '# Claude écrit ici, le serveur exécute automatiquement après pull' >> COMMANDS.sh
    echo '' >> COMMANDS.sh
    echo 'echo "📝 Pas de nouvelles commandes"' >> COMMANDS.sh
    
    git add COMMANDS.sh
    git commit -m "Reset COMMANDS.sh après exécution" || true
    git push origin main || true
fi

echo "✅ Déploiement terminé !"
ENDSSH

echo "========================================="
echo "   ✅ TOUT EST FAIT !"
echo "========================================="