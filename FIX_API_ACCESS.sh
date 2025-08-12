#!/bin/bash
# Script pour débugger et corriger l'accès à l'API sur le serveur

echo "🔍 Vérification de l'API QWANYX..."
echo "============================================"

# 1. Vérifier si l'API est en cours d'exécution
echo "1. Processus Python actifs:"
ps aux | grep python3 | grep app_v2

# 2. Vérifier les ports en écoute
echo ""
echo "2. Ports en écoute:"
netstat -tlnp | grep 5002 || ss -tlnp | grep 5002

# 3. Tester l'API localement sur le serveur
echo ""
echo "3. Test local de l'API:"
curl -s http://localhost:5002/health || echo "❌ API non accessible en local"

# 4. Vérifier le firewall
echo ""
echo "4. Règles du firewall (iptables):"
sudo iptables -L -n | grep 5002

# 5. Ouvrir le port 5002 si nécessaire
echo ""
echo "5. Ouverture du port 5002..."
sudo iptables -A INPUT -p tcp --dport 5002 -j ACCEPT
sudo iptables -A OUTPUT -p tcp --sport 5002 -j ACCEPT

# 6. Vérifier UFW si installé
if command -v ufw &> /dev/null; then
    echo ""
    echo "6. Configuration UFW:"
    sudo ufw status | grep 5002 || sudo ufw allow 5002/tcp
fi

# 7. Sauvegarder les règles iptables
echo ""
echo "7. Sauvegarde des règles..."
sudo iptables-save > /etc/iptables/rules.v4 2>/dev/null || echo "Note: iptables-save non disponible"

# 8. Redémarrer l'API si nécessaire
echo ""
echo "8. Redémarrage de l'API..."
pkill -f "python3.*app_v2.py" || true
sleep 2
cd /opt/qwanyx/apps/qwanyx-server/qwanyx-api
nohup python3 app_v2.py > /tmp/qwanyx-api.log 2>&1 &
sleep 3

# 9. Test final
echo ""
echo "9. Test final de l'API:"
curl -s http://localhost:5002/health && echo "✅ API accessible localement"
curl -s http://135.181.72.183:5002/health && echo "✅ API accessible depuis l'extérieur" || echo "❌ API non accessible depuis l'extérieur"

echo ""
echo "============================================"
echo "📝 Logs disponibles dans /tmp/qwanyx-api.log"
echo "🔗 URL publique: http://135.181.72.183:5002"