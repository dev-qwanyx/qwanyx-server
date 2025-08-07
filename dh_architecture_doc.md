# Digital Humans Microservices Architecture

## Vue d'ensemble

Architecture de digital humans autonomes dans un monorepo, chaque digital human étant un écosystème d'applications Flask communiquant via une base MongoDB dédiée et une API REST.

## Architecture Générale

### Structure Monorepo
```
/root/
├── /core-services/
│   ├── /gtd-service/
│   ├── /cash-management/
│   └── /project-management/
├── /digital-humans/
│   ├── /digital-human-A/
│   ├── /digital-human-B/
│   └── /digital-human-C/
├── /business-apps/
│   ├── /sandwich-shop/
│   ├── /studio/
│   └── /car-parts/
├── /web-frontend/
├── /backup-service/
└── /gateway/
```

## Digital Human Structure

### Écosystème Autonome
Chaque digital human = collection d'apps + base de données + API dédiées

```
/digital-human-A/
├── /apps/
│   ├── /gtd-processor/
│   ├── /cash-manager/
│   └── /decision-engine/
├── /database-api/ (Flask app - port 5001)
├── /mongodb/ (instance - port 27001)
├── /interface/ (optionnel - port 8001)
└── /config/
```

### Modes de Fonctionnement
- **Avec interface**: DH + UI pour interaction humaine
- **Headless**: DH sans interface, pur processing IA
- **Hybride**: Interface on/off selon besoin

## Base de Données

### MongoDB par Digital Human
- Instance MongoDB dédiée par DH
- Port unique (27001, 27002, 27003...)
- Isolation complète des données
- API REST dédiée pour accès (Flask)

### API Database Structure
```python
# database-api/app.py
from flask import Flask, request, jsonify
from pymongo import MongoClient

app = Flask(__name__)
client = MongoClient('mongodb://localhost:27001/')
db = client['digital_human_A']

@app.route('/api/data/<collection>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def handle_data(collection):
    # CRUD operations
    pass
```

## Communication Inter-Services

### Options Techniques
1. **API calls directes** (localhost différents ports)
2. **Redis/RQ queues** (pour AI-to-AI communication)
3. **Message queues** (volume élevé, processing asynchrone)

### Architecture Communication
```
DH-A (port 5001) ←→ DH-B (port 5002)
     ↕                    ↕
Redis Queue (port 6379)
     ↕                    ↕
DH-C (port 5003) ←→ Web Frontend (port 80)
```

## Web Frontend

### Interface Ultra-Légère
```
/web-frontend/
├── /static/ (CSS, JS)
├── /templates/ (HTML)
├── /routes.py
└── app.py
```

### Rôle
- Serve pages HTML/CSS/JS
- Route vers APIs des digital humans
- Dashboard monitoring/contrôle
- Pas de logique métier (pure interface)

## Services Core

### Modules Partagés
- **GTD Processor**: Engine décisionnel importable
- **Cash Management**: Gestion financière
- **Project Management**: Engine projet/agile

### Utilisation
Services core = modules Python importables par les digital humans selon leurs besoins.

## Déploiement

### Single Machine Initial
- Tous services sur localhost
- Ports différents par service
- Nginx reverse proxy pour routing

### Scaling Futur
- Digital humans sur machines séparées
- Communication via réseau
- Load balancing par type de DH

### Nginx Configuration
```nginx
server {
    location /dh-a/ {
        proxy_pass http://localhost:5001;
    }
    location /dh-b/ {
        proxy_pass http://localhost:5002;
    }
    location / {
        proxy_pass http://localhost:8000; # web-frontend
    }
}
```

## Business Applications

### Structure
Chaque business app utilise les digital humans appropriés:
- **Sandwich shop**: cash-management + basic GTD
- **Studio**: project-management + GTD + cash-management  
- **Car parts**: inventory + cash-management

### Integration
Business apps = clients des digital humans via leurs APIs.

## Backup & Recovery

### Backup Service Atomique
```
/backup-service/
├── /snapshots/
│   ├── /digital-human-A/
│   ├── /digital-human-B/
│   └── /digital-human-C/
├── backup_scheduler.py
└── restore_manager.py
```

### Opérations
- Backup granulaire par DH
- Restore point-in-time
- Stop → Backup → Restart transparent
- Rollback sélectif

## Technologies

### Stack Principal
- **Backend**: Python Flask
- **Database**: MongoDB (instances séparées)
- **Communication**: Redis/RQ pour queues, HTTP REST pour APIs
- **Frontend**: HTML/CSS/JS léger
- **Proxy**: Nginx
- **Backup**: Scripts Python dédiés

### Ports Standards
- **MongoDB**: 27001, 27002, 27003... (par DH)
- **Database APIs**: 5001, 5002, 5003... (par DH)
- **Interfaces**: 8001, 8002, 8003... (par DH)
- **Web Frontend**: 8000
- **Redis**: 6379
- **Nginx**: 80/443

## Avantages Architecture

### Isolation Complète
- Crash d'un DH = zéro impact autres DH
- Maintenance indépendante
- Scaling horizontal naturel

### Flexibilité Déploiement
- Mode standalone (un DH)
- Mode intégré (multiple DH + frontend)
- Mode headless (DH sans interface)

### Development
- Teams peuvent travailler sur DH différents
- Technologies agnostiques (C++ possible)
- Git monorepo ou séparé au choix

## Migration Path

### MVP (1-2 mois)
- Single machine
- API calls directes
- Flask blueprints possible

### Production
- Message queues (Redis/RQ)
- Multiple DH instances
- Nginx load balancing

### Enterprise
- DH sur machines dédiées
- Backup automatisé
- Monitoring complet