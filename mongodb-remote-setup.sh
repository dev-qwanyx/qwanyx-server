#!/bin/bash
# Script pour permettre l'accès distant à MongoDB (À UTILISER AVEC PRÉCAUTION!)

echo "Configuration de MongoDB pour accès distant..."

# 1. Backup de la config actuelle
sudo cp /etc/mongod.conf /etc/mongod.conf.backup

# 2. Modifier bindIp pour écouter sur toutes les interfaces
sudo sed -i 's/bindIp: 127.0.0.1/bindIp: 0.0.0.0/' /etc/mongod.conf

# 3. Redémarrer MongoDB
sudo systemctl restart mongod

# 4. Vérifier le statut
sudo systemctl status mongod

# 5. Vérifier que MongoDB écoute sur toutes les interfaces
netstat -tlnp | grep 27017

echo ""
echo "✅ MongoDB est maintenant accessible depuis l'extérieur"
echo ""
echo "⚠️  ATTENTION: MongoDB est maintenant ouvert au monde!"
echo "   Il est fortement recommandé de:"
echo "   1. Configurer l'authentification MongoDB"
echo "   2. Utiliser un firewall pour limiter l'accès"
echo "   3. Ou utiliser un tunnel SSH à la place"
echo ""
echo "Pour se connecter avec Compass:"
echo "  mongodb://135.181.72.183:27017"