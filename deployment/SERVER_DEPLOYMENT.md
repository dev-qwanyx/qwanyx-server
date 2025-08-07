# Guide de déploiement serveur QWANYX

## 📋 Configuration créée

J'ai créé tous les fichiers de configuration nécessaires :

1. **qwanyx-api.service** : Service systemd pour démarrage automatique
2. **nginx-qwanyx.conf** : Configuration Nginx avec SSL
3. **deploy.sh** : Script automatisé de déploiement
4. **SERVER_DEPLOYMENT.md** : Ce guide

## 🚀 Commandes à exécuter sur le serveur

### Étape 1 : Récupérer les dernières modifications

```bash
cd /opt/qwanyx/apps/qwanyx-server
git pull origin main
```

### Étape 2 : Lancer le script de déploiement

```bash
cd deployment
chmod +x deploy.sh
sudo ./deploy.sh
```

Le script va automatiquement :
- ✅ Installer les dépendances Python
- ✅ Installer et configurer MongoDB
- ✅ Configurer le service systemd
- ✅ Configurer Nginx avec SSL (Let's Encrypt)
- ✅ Démarrer tous les services

### Étape 3 : Vérifier que tout fonctionne

```bash
# Vérifier le statut de l'API
sudo systemctl status qwanyx-api

# Vérifier les logs si besoin
sudo journalctl -u qwanyx-api -f

# Tester l'API
curl http://localhost:5000/api/health
```

## 🔧 Commandes utiles

### Redémarrer l'API
```bash
sudo systemctl restart qwanyx-api
```

### Voir les logs en temps réel
```bash
sudo journalctl -u qwanyx-api -f
```

### Recharger Nginx après modification
```bash
sudo nginx -t  # Test la config
sudo systemctl reload nginx
```

### Mettre à jour le code
```bash
cd /opt/qwanyx/apps/qwanyx-server
git pull
sudo systemctl restart qwanyx-api
```

## 📝 Notes importantes

- **MongoDB** : Tourne sur localhost:27017
- **API** : Tourne sur localhost:5000 (proxy Nginx vers 443)
- **SSL** : Géré automatiquement par Let's Encrypt
- **Logs** : `/var/log/nginx/` et `journalctl -u qwanyx-api`

## 🌐 URLs finales

Une fois déployé, l'API sera accessible sur :
- https://api.qwanyx.com
- https://qwanyx.com

## ⚠️ En cas de problème

1. Vérifier les logs : `sudo journalctl -u qwanyx-api -n 50`
2. Vérifier MongoDB : `sudo systemctl status mongod`
3. Vérifier Nginx : `sudo nginx -t`
4. Vérifier les permissions : `ls -la /opt/qwanyx/apps/qwanyx-server/qwanyx-api`