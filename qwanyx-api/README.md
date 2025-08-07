# QWANYX Central API

API centrale pour tous les services QWANYX.

## Fonctionnalités

- **Authentication** : JWT tokens
- **Users** : Gestion des utilisateurs
- **Notifications** : Système de notifications
- **Apps** : Tracking des apps utilisées

## Installation

```bash
pip install -r requirements.txt
```

## Lancement

```bash
python app.py
```

## Endpoints

### Authentication
- `POST /auth/register` - Créer un compte
- `POST /auth/login` - Se connecter
- `GET /auth/me` - Info utilisateur courant

### Users
- `GET /users/<id>` - Obtenir un utilisateur
- `PUT /users/<id>` - Mettre à jour un utilisateur

### Notifications
- `GET /notifications` - Liste des notifications
- `POST /notifications` - Créer une notification
- `PUT /notifications/<id>/read` - Marquer comme lue

### Apps
- `POST /apps/register` - Enregistrer l'accès à une app

## Test

```bash
python test_api.py
```