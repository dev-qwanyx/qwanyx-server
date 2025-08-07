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

## Architecture future

L'idée est d'avoir :
1. **API QWANYX centrale** (qwanyx.com)
   - Auth commune pour tous les projets
   - Services partagés (notifications, paiements, etc.)
   
2. **Applications frontend** séparées
   - Autodin.be (marketplace pièces auto)
   - Personal-CASH (gestion finances)
   - Digital Humans apps
   - Etc.

Chaque frontend reste en Flask + templating classique, pas besoin de React ou autre framework JS complexe.