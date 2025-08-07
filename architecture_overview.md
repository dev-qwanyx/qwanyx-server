# QWANYX Architecture Overview

## Structure des Services

### 📁 Structure Principale
```
/QWANYX-Architecture/
├── /dh/                    # Digital Humans Dashboard
├── /mail/                  # Service Mail (comme Chat)
├── /autodin/              # Site web avec DH dédié
├── /Personal-CASH/        # Service existant
└── /digital-human-cash/   # DH existant
```

## 1️⃣ Digital Humans Dashboard (`/dh/`)

### Objectif
- Dashboard central pour gérer tous les Digital Humans
- Chaque DH est une instance autonome avec sa propre base de données
- Interface pour contrôler les services accessibles par chaque DH

### Architecture envisagée
```
/dh/
├── /dashboard-template/    # Template téléchargé
├── /gateway/              # API Gateway centrale
├── /dh-instances/         # Configuration des DH
│   ├── /dh-autodin/
│   ├── /dh-cash/
│   └── /dh-gtd/
└── /shared-components/    # Composants UI réutilisables
```

### Fonctionnalités
- Vue d'ensemble de tous les DH actifs
- Monitoring des performances
- Gestion des accès aux services
- Configuration des bases de données par DH

## 2️⃣ Service Mail (`/mail/`)

### Concept
"Le mail comme un chat" - Interface de messagerie unifiée

### Architecture
```
/mail/
├── /backend/
│   ├── app.py            # API Flask
│   ├── /email_receiver/  # IMAP listener
│   ├── /email_sender/    # SMTP handler
│   └── /storage/         # MongoDB pour historique
├── /admin-ui/            # Interface de configuration
│   ├── credentials.html  # Gestion IMAP/SMTP
│   ├── inbox.html       # Vue des conversations
│   └── settings.html    # Configuration
└── /api/
    ├── /conversations   # GET threads de discussion
    ├── /messages       # POST/GET messages
    └── /attachments    # Gestion des pièces jointes
```

### API Exemple
```python
# mail/app.py
@app.route('/api/conversations')
def get_conversations():
    """Retourne les emails groupés comme des threads chat"""
    return [{
        'contact': 'client@example.com',
        'subject': 'Demande d\'information',
        'messages': [
            {
                'from': 'client@example.com',
                'content': 'Bonjour, j\'aimerais...',
                'timestamp': '2024-01-15 10:30',
                'attachments': ['devis.pdf']
            }
        ],
        'unread': 2,
        'priority': 'normal'
    }]

@app.route('/api/send')
def send_message():
    """Envoie un email comme un message de chat"""
    # Format simple pour les DH
    pass
```

## 3️⃣ Autodin (`/autodin/`)

### Concept
Site web avec Digital Human intégré pour gestion mail + chat

### Architecture
```
/autodin/
├── /frontend/           # Site web public
│   ├── index.html
│   ├── /static/
│   └── /templates/
├── /dh-autodin/        # Digital Human dédié
│   ├── app.py
│   ├── /mail_handler/  # Utilise Mail API
│   ├── /chat_handler/  # WebSocket pour chat temps réel
│   └── /ai_responder/  # Logique de réponse auto
└── /api/
    └── /public/        # API publique du site
```

### Intégration
- Le DH-Autodin utilise le service Mail via API
- Peut répondre automatiquement aux emails
- Escalade vers humain si nécessaire
- Chat en temps réel sur le site

## 🔗 Communication Inter-Services

### Architecture API
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  DH-Autodin │────▶│  Mail API   │◀────│  DH-Cash    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       └────────────────────┴────────────────────┘
                            │
                    ┌───────────────┐
                    │  DH Dashboard  │
                    └───────────────┘
```

### Ports Standards
- DH Dashboard: 8000
- Mail Service: 5010
- Autodin Frontend: 8080
- DH-Autodin: 5011
- DH-Cash: 5001

## 🚀 Roadmap d'implémentation

### Phase 1 - Setup Initial
1. Download et analyse du template dashboard dans `/dh/`
2. Structure de base pour le service Mail
3. Squelette d'Autodin

### Phase 2 - Service Mail
1. Backend Flask pour recevoir/envoyer emails
2. API REST pour les DH
3. UI admin basique

### Phase 3 - Integration
1. Connecter DH-Autodin au service Mail
2. Dashboard central avec vue des DH actifs
3. Tests d'intégration

### Phase 4 - Production
1. Sécurisation des APIs
2. Monitoring et logs
3. Backup stratégie

## 💡 Points clés à définir

1. **Gestion des BDD par DH**
   - MongoDB instance par DH ?
   - Ou base partagée avec collections séparées ?

2. **Authentification inter-services**
   - API Keys ?
   - JWT tokens ?
   - Service mesh ?

3. **Scaling strategy**
   - Docker containers ?
   - PM2 pour Node.js ?
   - Kubernetes futur ?

4. **Template Dashboard**
   - Phoenix HTML/CSS/JS ?
   - React/Vue moderne ?
   - HTMX pour simplicité ?

## 🎨 Ressources Templates

### ThemeWagon
- **URL**: https://themewagon.com/
- **Description**: Source de templates admin/dashboard gratuits et premium
- **Utilité**: Pour trouver des templates modernes pour le DH Dashboard