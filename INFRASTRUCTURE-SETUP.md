# Infrastructure et Workflow QWANYX - Documentation Complète

## 🚀 Vue d'ensemble de l'architecture

### Vision du projet
Création d'une plateforme de **Digital Employees** - des assistants IA autonomes avec :
- Mémoire permanente infinie
- Gestion emails, IoT, banking, agenda
- Relations sociales entre IA
- Prix : 50-500€/mois selon services
- Remplace : assistants personnels, comptables, Office 365

### Architecture cible
```
Serveur 1 (Principal) - 20€/mois
├── API centrale QWANYX
├── Bases de données
└── Services critiques

Serveur 2 (Frontend) - 10€/mois
├── Belgicomics
├── Autodin
└── Autres sites

Serveur 3 (Dev/Test) - 5€/mois
├── Environnements dev
├── Beta testing
└── Backup

Serveurs 4+ (À la demande)
└── Digital Employees (1 serveur/100 clients)
```

## 📍 Serveur actuel

**IP actuelle : 135.181.72.183** (Hetzner AX41-NVMe)
- Ancien IP : 92.112.176.226 (migration récente)
- OS : Linux Debian
- Docker : Installé et configuré
- MongoDB : Dans Docker volumes

**Structure des fichiers :**
```
/opt/qwanyx/apps/qwanyx-server/
├── autodin/
├── belgicomics/
├── qwanyx-api/
├── personal-cash/
└── digital-humans/
```

## 🛠️ VS Code Remote-SSH Configuration

### Installation
1. VS Code → Extensions → "Remote - SSH" (Microsoft)
2. Connexion : `root@135.181.72.183`
3. Ouvrir : `/opt/qwanyx/apps/qwanyx-server`

### Avantages découverts
- **Édition directe** sur serveur = modifications instantanées
- **Pas besoin de push/pull** pour tester
- **Git intégré visuellement** dans VS Code
- **Terminal Linux intégré**
- **PC peut brûler** = tout reste sur serveur
- **Remplace** : Dropbox, Google Drive, Office 365

## 🔄 Nouveau Workflow de développement

### Avant (compliqué)
1. Développer en local
2. Git add, commit, push
3. SSH sur serveur
4. Git pull
5. Redémarrer services
6. Tester
7. Répéter...

### Maintenant (simple)
1. VS Code Remote → Modifier directement sur serveur
2. Ctrl+S = En ligne instantanément
3. Git commit uniquement pour sauvegarder versions importantes

### Structure proposée pour équipe
```
/opt/qwanyx/apps/
├── qwanyx-server/        # Production
├── qwanyx-beta/          # Beta testing  
├── dev-philippe/         # Votre espace dev
├── dev-marie/            # Graphiste
├── dev-paul/             # Backend dev
└── dev-stagiaire/        # Accès limité
```

## 👥 Gestion d'équipe

### Isolation par utilisateur Linux
```bash
# Créer utilisateurs
adduser dev-marie
adduser dev-paul

# Marie accède UNIQUEMENT à son dossier
ssh dev-marie@135.181.72.183
```

### Avec Docker (encore mieux)
```yaml
services:
  dev-marie:
    image: python:3.11
    volumes:
      - ./dev-marie:/app
    ports:
      - "8092:8091"
```

### Protection propriété intellectuelle
- Frontend dev voit QUE l'interface
- Backend dev voit QUE l'API  
- IA dev voit QUE son module
- **Seul vous voyez l'architecture complète**

## 📝 Git dans VS Code

### Interface visuelle
- **3ème icône à gauche** : Source Control
- **Voir changements** : Cliquez sur les fichiers
- **Commit** : Message + Ctrl+Enter
- **Timeline** : Clic droit → View Timeline
- **Retour arrière** : Cliquer ancienne version → Restore

### Plus besoin de commandes
```bash
# AVANT (ligne de commande)
git add .
git commit -m "message"
git push

# MAINTENANT
Clic, clic, fait ✅
```

## 🌐 Multi-langages supportés

Chaque projet dans sa technologie :
- **Digital Employee** → Python (IA/ML)
- **API temps réel** → Node.js (WebSockets)
- **Calcul intensif** → C++ (performance)
- **Blockchain** → Rust
- **Frontend** → JavaScript/React
- **Legacy** → PHP

Docker et VS Code gèrent tout automatiquement.

## 💰 Comparaison coûts

### Solutions actuelles
- Office 365 : 100€/an
- Dropbox : 144€/an  
- Google One : 240€/an
- ChatGPT Plus : 240€/an
- Assistant IA : 600-2400€/an
**Total : ~1500€/an minimum**

### Notre solution
- VPS : 60€/an (5€/mois)
- API IA : 240€/an (20€/mois)
**Total : 300€/an pour TOUT**

### Par famille
- **1 café/jour** : 1825€/an
- **Notre solution complète** : 120€/an

## 🚦 Prochaines étapes

1. **Court terme**
   - [ ] Créer structure dev/beta/prod
   - [ ] Configurer sous-domaines
   - [ ] Pull des derniers changements Belgicomics
   - [ ] Configurer DKIM pour emails

2. **Moyen terme**
   - [ ] Séparer Autodin sur serveur dédié
   - [ ] Mettre en place CI/CD
   - [ ] Configurer backups automatiques
   - [ ] Monitoring avec Netdata

3. **Long terme**
   - [ ] Architecture microservices
   - [ ] Kubernetes pour orchestration
   - [ ] Multi-serveurs géolocalisés
   - [ ] Digital Employees en production

## 🔧 Commandes utiles

### Connexion VS Code Remote
```
SSH: root@135.181.72.183
Dossier: /opt/qwanyx/apps/qwanyx-server
```

### Services
```bash
# Voir ce qui tourne
ps aux | grep python
systemctl status qwanyx-api

# Redémarrer API
systemctl restart qwanyx-api

# Logs
journalctl -u qwanyx-api -f
```

### Docker
```bash
docker ps                    # Services actifs
docker logs [container]      # Voir logs
docker-compose up -d         # Lancer services
```

## 💡 Points clés découverts

1. **"Infrastructure AVANT tout"** - Sans ça, refaire dans 1 semaine
2. **VS Code Remote = Game changer** - Comme travailler en local mais sur serveur
3. **Git = Sauvegarde, pas déploiement** - Push seulement pour versions importantes
4. **5€/mois > Solutions à 200€/mois** - Meilleur et moins cher
5. **Isolation = Protection IP** - Chaque dev dans sa boîte
6. **Multi-langages = OK** - Docker s'en fout du langage
7. **PC peut brûler = Pas grave** - Tout sur serveur

## 📌 À retenir

> "Avec VS Code Remote + un bon serveur, 2 personnes motivées peuvent faire le travail de 20 personnes en entreprise"

> "Pour le prix de 2 cafés/mois, une famille peut avoir son Google privé"

> "Les grosses boîtes sont prisonnières de leurs processus, vous avez l'agilité"

---

*Document créé le 08/08/2025 - À mettre à jour régulièrement*
*Prochaine session : Continuer depuis "Créer structure dev/beta/prod"*