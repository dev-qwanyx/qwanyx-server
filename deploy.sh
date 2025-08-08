#!/bin/bash
# Script de déploiement automatique QWANYX
# Usage: ./deploy.sh [message]

echo "========================================="
echo "   DÉPLOIEMENT QWANYX - AUTOMATIQUE"
echo "========================================="

# 1. COMMIT LOCAL
echo "→ Ajout des modifications..."
git add .

# Message de commit (paramètre ou défaut)
MESSAGE=${1:-"Mise à jour $(date +%Y-%m-%d' '%H:%M)"}
echo "→ Commit: $MESSAGE"
git commit -m "$MESSAGE"

# 2. PUSH VERS GITHUB
echo "→ Push vers GitHub..."
git push origin main

# 3. PULL SUR LE SERVEUR
echo "→ Connexion au serveur et pull..."
ssh root@135.181.72.183 << 'ENDSSH'
cd /opt/qwanyx/apps/qwanyx-server
echo "  → Pull des changements..."
git pull origin main

# 4. REDÉMARRER LES SERVICES SI NÉCESSAIRE
echo "  → Vérification des services..."
if git diff --name-only HEAD~1 | grep -q "qwanyx-api"; then
    echo "  → Redémarrage API..."
    systemctl restart qwanyx-api
fi

if git diff --name-only HEAD~1 | grep -q "belgicomics"; then
    echo "  → Redémarrage Belgicomics..."
    pkill -f "belgicomics/frontend/app_bulma.py" || true
    cd belgicomics/frontend && nohup python3 app_bulma.py > /dev/null 2>&1 &
fi

if git diff --name-only HEAD~1 | grep -q "autodin"; then
    echo "  → Redémarrage Autodin..."
    pkill -f "autodin/frontend/app_bulma.py" || true
    cd autodin/frontend && nohup python3 app_bulma.py > /dev/null 2>&1 &
fi

echo "  → Services redémarrés !"
ENDSSH

echo "========================================="
echo "   ✅ DÉPLOIEMENT TERMINÉ !"
echo "========================================="
echo ""
echo "URLs:"
echo "  - API: http://135.181.72.183:5002"
echo "  - Belgicomics: http://135.181.72.183:8091"
echo "  - Autodin: http://135.181.72.183:8090"
echo ""