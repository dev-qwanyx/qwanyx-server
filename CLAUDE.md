# QWANYX Architecture - Documentation de Session

## Vue d'ensemble du projet QWANYX

QWANYX est une architecture de microservices centralisée qui fournit des services communs à plusieurs applications frontend.

### Architecture globale

```
                           qwanyx.com
                    ┌────────────────────────┐
                    │   QWANYX API CENTRALE  │
                    │   ├── /auth/*          │
                    │   ├── /users/*         │
                    │   ├── /notifications/*  │
                    │   ├── /payments/*      │
                    │   └── /analytics/*     │
                    └───────────┬────────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
    ┌─────▼──────┐       ┌─────▼──────┐      ┌──────▼─────┐
    │  Autodin   │       │Personal-CASH│      │   DH App   │
    │ (Frontend) │       │ (Frontend)  │      │ (Frontend) │
    └────────────┘       └─────────────┘      └────────────┘
```

## Autodin - Site vitrine et marketplace

### État actuel (100% fonctionnel)

**Stack technique :**
- **Backend** : Flask (Python)
- **Frontend** : Bulma CSS (pas de React!)
- **Template** : Jinja2
- **Base** : Site statique prêt à devenir dynamique

**Fonctionnalités implémentées :**
- ✅ Design moderne avec identité visuelle Autodin (orange #E67E22, noir #2C3E50)
- ✅ Navigation avec smooth scrolling et header fixe
- ✅ Hero section avec image de fond et effet parallax
- ✅ 6 services en cartes réutilisables (composant `service_card.html`)
- ✅ Section contact avec formulaire stylé
- ✅ Footer organisé avec liens légaux et réseaux sociaux
- ✅ Animations (Animate.css, Hover.css, transitions CSS)
- ✅ Serveur Flask stable avec auto-reload en développement

**Structure des fichiers :**
```
autodin/
├── frontend/
│   ├── app_bulma.py              # Serveur Flask principal
│   ├── templates/
│   │   ├── index_bulma.html      # Page principale
│   │   └── components/
│   │       └── service_card.html # Composant carte réutilisable
│   └── static/
│       └── assets/
│           └── img/
│               ├── AutoDinLogo2.png
│               └── autodinpictures/
│                   └── elena-mozhvilo-*.jpg
```

### Déploiement

**Option recommandée : VPS à 5€/mois**
- Hetzner, DigitalOcean, ou OVH
- Installation simple : Python + Nginx + Gunicorn
- Parfait pour Flask + futures fonctionnalités

**Alternatives :**
- Render.com (gratuit, supporte Flask)
- Railway.app (gratuit avec limites)
- Vercel (possible mais pas optimal pour Flask)

### Prochaines étapes pour Autodin

1. **Connexion à l'API QWANYX**
   - Utiliser l'auth centralisée
   - Récupérer les données utilisateurs
   
2. **Fonctionnalités marketplace**
   - Système d'annonces (MongoDB)
   - Recherche et filtres
   - Upload d'images
   - Messagerie entre utilisateurs
   
3. **Rester sur Flask + Bulma**
   - Pas de React nécessaire
   - Le frontend actuel est parfait
   - Juste ajouter des appels API

## Personal-CASH

- Déjà migré de SQLite vers MongoDB
- Prêt à être connecté à l'API QWANYX

## Points techniques importants

### Problèmes résolus
1. **Template Bootstrap qui plantait** → Remplacé par Bulma
2. **Serveur Flask instable** → Corrigé avec les bonnes configurations
3. **Liens cassés (url_for)** → Tous corrigés ou remplacés par #

### Configuration Flask stable
```python
app.run(
    host='0.0.0.0',
    port=8090,
    debug=True,  # Auto-reload en dev
    use_reloader=True,
    threaded=True
)
```

### Classes CSS personnalisées créées
- `.card-autodin` : Cartes avec fond noir et texte clair
- `.button-autodin` : Boutons style Autodin
- Variables CSS pour les couleurs : `--autodin-orange`, `--autodin-dark`

## Commandes utiles

```bash
# Lancer le serveur Autodin
cd autodin/frontend
python app_bulma.py

# Le site est accessible sur http://localhost:8090
```

## PROCÉDURE DE DÉPLOIEMENT AUTOMATIQUE

### 🚀 Comment déployer sur le serveur (135.181.72.183)

**IMPORTANT : Tout se fait automatiquement via GitHub !**

1. **Modifier le code localement**
2. **Mettre à jour COMMANDS.sh** avec les commandes à exécuter sur le serveur
3. **Faire un git push** → Le webhook déclenche automatiquement le déploiement

### Étapes détaillées pour Claude :

#### 1. Vérifier les modifications
```bash
git status
git diff
```

#### 2. Mettre à jour COMMANDS.sh
Le fichier `COMMANDS.sh` contient les commandes qui seront exécutées automatiquement sur le serveur après le pull. Structure type :
```bash
# Arrêter les services
pkill -f "python3" || true

# Redémarrer chaque service
cd /opt/qwanyx/apps/qwanyx-server/[projet]/frontend
nohup python3 app_bulma.py > /tmp/[projet].log 2>&1 &

# Vérifier que tout fonctionne
curl -s -o /dev/null -w "[Projet]: %{http_code}\n" http://localhost:[port]
```

**Ports utilisés :**
- Autodin : 8090
- Belgicomics : 8091  
- API QWANYX : 5002
- Webhook : 9999

#### 3. Faire le commit et push
```bash
git add .
git commit -m "Description des changements"
git push origin main
```

#### 4. Le serveur fait automatiquement :
- Git pull pour récupérer le nouveau code
- Exécute COMMANDS.sh
- Redémarre les services nécessaires

### Webhooks et auto-deploy

Le serveur a un webhook Flask (`webhook-server.py`) qui :
- Écoute sur le port 9999
- Reçoit les notifications de GitHub
- Vérifie la signature pour la sécurité
- Execute automatiquement COMMANDS.sh après un push sur main

**Pour vérifier que le déploiement a fonctionné :**
- Les commandes curl dans COMMANDS.sh affichent les codes HTTP
- Logs disponibles dans `/tmp/[projet].log`

## Belgicomics

**Stack technique :**
- **Backend** : Flask (Python)
- **Frontend** : Bulma CSS
- **Port** : 8091
- **Fichier principal** : `belgicomics/frontend/app_bulma.py`

**Fonctionnalités :**
- Site de vente de BD belges
- Système de login/register avec modals
- Espace membre avec gestion d'annonces
- Design thème gris moderne

## Architecture future

L'idée est d'avoir :
1. **API QWANYX centrale** (qwanyx.com)
   - Auth commune pour tous les projets
   - Services partagés (notifications, paiements, etc.)
   
2. **Applications frontend** séparées
   - Autodin.be (marketplace pièces auto)
   - Belgicomics.be (marketplace BD belges)
   - Personal-CASH (gestion finances)
   - Digital Humans apps
   - Etc.

Chaque frontend reste en Flask + templating classique, pas besoin de React ou autre framework JS complexe.