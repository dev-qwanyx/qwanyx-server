#!/bin/bash
# COMMANDES À EXÉCUTER SUR LE SERVEUR
# Claude écrit ici, le serveur exécute automatiquement après pull

echo "🎉 TEST DU WEBHOOK AUTOMATIQUE - $(date)"
echo "Si vous voyez ce message, le webhook fonctionne!"
echo "Test réussi!" > /opt/qwanyx/apps/qwanyx-server/webhook-test.txt