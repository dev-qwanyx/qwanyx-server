# Déploiement Manuel via SSH

## Connexion au serveur
```bash
ssh root@135.181.72.183
```

## Commandes à exécuter sur le serveur

### 1. Récupérer le dernier code
```bash
cd /opt/qwanyx/apps/qwanyx-server
git pull origin main
```

### 2. Arrêter tous les services
```bash
pkill -f "python" || true
sleep 3
```

### 3. Redémarrer Belgicomics
```bash
cd /opt/qwanyx/apps/qwanyx-server/belgicomics/frontend
nohup python3 app_bulma.py > /tmp/belgicomics.log 2>&1 &
```

### 4. Redémarrer Autodin
```bash
cd /opt/qwanyx/apps/qwanyx-server/autodin/frontend
nohup python3 app_bulma.py > /tmp/autodin.log 2>&1 &
```

### 5. Redémarrer l'API
```bash
cd /opt/qwanyx/apps/qwanyx-server/qwanyx-api
nohup python3 app.py > /tmp/api.log 2>&1 &
```

### 6. Vérifier que tout fonctionne
```bash
# Attendre 5 secondes
sleep 5

# Tester les services
curl -I http://localhost:8090  # Autodin
curl -I http://localhost:8091  # Belgicomics
curl -I http://localhost:5002  # API
```

### 7. Voir les logs en cas de problème
```bash
tail -f /tmp/belgicomics.log
# ou
tail -f /tmp/autodin.log
# ou
tail -f /tmp/api.log
```

## URLs de test
- Autodin: http://135.181.72.183:8090
- Belgicomics: http://135.181.72.183:8091
- API: http://135.181.72.183:5002

## Alternative : Exécuter COMMANDS.sh directement
```bash
cd /opt/qwanyx/apps/qwanyx-server
bash COMMANDS.sh
```