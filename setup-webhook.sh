#!/bin/bash
# INSTALLATION DU WEBHOOK AUTO-DEPLOY SUR LE SERVEUR

echo "========================================="
echo "   🔧 INSTALLATION WEBHOOK AUTO-DEPLOY"
echo "========================================="

# 1. Copier le webhook server
echo "→ Copie du webhook server..."
scp webhook-server.py root@135.181.72.183:/opt/qwanyx/apps/qwanyx-server/

# 2. Installer sur le serveur
ssh root@135.181.72.183 << 'ENDSSH'
cd /opt/qwanyx/apps/qwanyx-server

# Installer Flask si pas déjà fait
pip3 install flask

# Créer un service systemd
echo "→ Création du service systemd..."
cat > /etc/systemd/system/webhook-deploy.service << 'EOF'
[Unit]
Description=GitHub Webhook Auto-Deploy
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/qwanyx/apps/qwanyx-server
ExecStart=/usr/bin/python3 /opt/qwanyx/apps/qwanyx-server/webhook-server.py
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Démarrer le service
systemctl daemon-reload
systemctl enable webhook-deploy
systemctl start webhook-deploy

echo "✅ Webhook server installé et démarré sur le port 9999"
ENDSSH

echo ""
echo "========================================="
echo "   📌 CONFIGURATION GITHUB"
echo "========================================="
echo ""
echo "1. Allez sur: https://github.com/dev-qwanyx/qwanyx-server/settings/hooks"
echo "2. Cliquez 'Add webhook'"
echo "3. Payload URL: http://135.181.72.183:9999/webhook"
echo "4. Content type: application/json"
echo "5. Secret: votre-secret-github-change-moi"
echo "6. Trigger: Just the push event"
echo "7. Save"
echo ""
echo "✅ Après ça, chaque push déclenchera automatiquement:"
echo "   - Pull sur le serveur"
echo "   - Exécution de COMMANDS.sh"
echo "   - Reset de COMMANDS.sh"
echo ""
echo "PLUS JAMAIS DE COMMANDES MANUELLES !"