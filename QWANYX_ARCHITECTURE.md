# QWANYX Architecture & Philosophy

## Vision

QWANYX est une plateforme de Digital Humans (DH) multi-tenant qui révolutionne la gestion d'entreprise. Pensez à Slack/Teams, mais au lieu de simples messages, vous avez des assistants intelligents qui comprennent, mémorisent et agissent.

## Concepts Fondamentaux

### 1. Structure Hiérarchique

```
QWANYX (Plateforme Globale)
├── Workspace (Organisation/Domaine)
│   ├── Apps (Applications métier)
│   ├── Digital Humans (Assistants intelligents)
│   └── Database (Données isolées)
```

### 2. Workspace (Espace de Travail)

Un workspace représente une organisation complète (entreprise, domaine, projet).

**Exemple : autodin.be**
- **Domaine** : autodin.be
- **Database** : `autodin-be`
- **Apps** : Marketplace Autodin, Personal CASH
- **DH** : Philippe (CEO), Stephen (Support), Marie (Sales)

**Caractéristiques :**
- Isolation totale des données
- Personnalisation complète
- Gestion autonome des DH et apps

### 3. Digital Humans (DH)

Les DH sont des assistants intelligents avec mémoire persistante et contexte.

**Structure des collections d'un DH dans un workspace :**
```javascript
// Dans DB autodin-be
{
  // Collections pour Philippe (DH)
  "dh.philippe-qwanyx-com.memory": {},      // Mémoire long terme
  "dh.philippe-qwanyx-com.conversations": {}, // Historique conversations
  "dh.philippe-qwanyx-com.context": {},      // Contexte actuel
  "dh.philippe-qwanyx-com.tasks": {},        // Tâches assignées
  "dh.philippe-qwanyx-com.knowledge": {}     // Base de connaissances
}
```

### 4. Apps (Applications)

Les apps sont des modules fonctionnels réutilisables entre workspaces.

**Exemples d'apps :**
- **Autodin** : Marketplace de pièces auto
- **Personal CASH** : Gestion financière
- **InventoryPro** : Gestion de stock
- **CustomerCare** : Support client

**Structure des collections d'une app :**
```javascript
// Dans DB autodin-be
{
  // Collections pour l'app Autodin
  "autodin.users": {},      // Utilisateurs du marketplace
  "autodin.products": {},   // Annonces
  "autodin.orders": {},     // Commandes
  "autodin.messages": {},   // Messages entre utilisateurs
  
  // Collections pour Personal CASH
  "personalcash.accounts": {},
  "personalcash.transactions": {}
}
```

## Architecture Multi-Tenant

### Isolation des Données

Chaque workspace a sa propre database MongoDB :
- `autodin-be` pour autodin.be
- `pixanima-com` pour pixanima.com
- `tesla-com` pour tesla.com

### DH Multi-Workspace

Un DH peut travailler pour plusieurs workspaces :

```
philippe@qwanyx.com
├── autodin.be (CEO)
├── pixanima.com (Advisor)
└── personnel (DB: philippe-qwanyx-com)
```

### Privacy et Accès

1. **Conversations professionnelles** : Stockées dans la DB du workspace
2. **Données personnelles** : Stockées dans la DB personnelle du DH
3. **Cross-référencement** : Via email comme identifiant unique

## Flux de Données

### Exemple : Contact Client

1. **Client** (elon@tesla.com) contacte Autodin
2. **Message** stocké dans `autodin-be.contacts`
3. **Philippe DH** traite le message :
   - Conversation dans `dh.philippe-qwanyx-com.conversations`
   - Mémoire mise à jour dans `dh.philippe-qwanyx-com.memory`
   - Peut créer un contact dans sa DB perso si pertinent

### Exemple : Collaboration DH

1. **Philippe** assigne une tâche à **Stephen**
2. Tâche créée dans `dh.stephen-qwanyx-com.tasks`
3. Stephen accède aux données Autodin nécessaires
4. Conversation Philippe-Stephen dans leurs collections respectives

## Avantages vs Slack/Teams

| Feature | Slack/Teams | QWANYX |
|---------|-------------|---------|
| Messages | ✓ | ✓ |
| Fichiers | ✓ | ✓ |
| Apps | Intégrations limitées | Apps natives complètes |
| Assistants | Bots basiques | DH avec mémoire et contexte |
| Actions | Commandes simples | Gestion complexe autonome |
| Privacy | Par channel | Par workspace + DH perso |
| Scalabilité | Limité par plan | Illimité (self-hosted) |

## Cas d'Usage

### 1. E-commerce (Autodin)
- **Apps** : Marketplace, Inventory, Accounting
- **DH** : Sales, Support, Finance
- **Workflow** : DH gère contacts, commandes, support client

### 2. Studio Animation (Pixanima)
- **Apps** : ProjectTracker, AssetManager, TimeSheet
- **DH** : Producer, Coordinator, HR
- **Workflow** : DH suit projets, alloue ressources, gère équipes

### 3. Multi-Entreprise (Consultant)
- **Philippe DH** travaille pour :
  - Autodin (CEO)
  - Pixanima (Advisor)
  - TechCorp (Consultant)
- Garde contexte séparé par workspace
- DB personnelle pour notes cross-entreprises

## Implémentation Technique

### API Centrale QWANYX

```python
# Gestion des workspaces
GET  /workspaces
POST /workspaces

# Gestion des DH
GET  /workspaces/{workspace}/dh
POST /workspaces/{workspace}/dh/{dh_id}/assign

# Gestion des apps
GET  /workspaces/{workspace}/apps
POST /workspaces/{workspace}/apps/{app_id}/install

# Authentification
POST /auth/request-code
POST /auth/verify-code
```

### Structure MongoDB

```javascript
// DB: qwanyx_central (Registry)
{
  workspaces: [
    {
      code: "autodin-be",
      domain: "autodin.be",
      apps: ["autodin", "personalcash"],
      dh: ["philippe@qwanyx.com", "stephen@qwanyx.com"]
    }
  ]
}

// DB: autodin-be (Workspace)
{
  // App collections
  "autodin.users": {},
  "autodin.products": {},
  
  // DH collections
  "dh.philippe-qwanyx-com.memory": {},
  "dh.philippe-qwanyx-com.conversations": {},
  
  // Shared collections
  "workspace.settings": {},
  "workspace.audit": {}
}
```

## Roadmap

### Phase 1 : Foundation ✓
- [x] API centrale
- [x] Auth par email/code
- [x] Structure workspace/DB
- [x] Premier workspace (Autodin)

### Phase 2 : Digital Humans
- [ ] DH memory system
- [ ] DH conversation manager
- [ ] DH task executor
- [ ] Multi-workspace DH

### Phase 3 : Apps Ecosystem
- [ ] App registry
- [ ] App installation system
- [ ] Inter-app communication
- [ ] App marketplace

### Phase 4 : Intelligence
- [ ] LLM integration
- [ ] Knowledge graphs
- [ ] Automated workflows
- [ ] Predictive actions

## Conclusion

QWANYX transforme la gestion d'entreprise en remplaçant les outils de communication passifs par des assistants intelligents actifs. Chaque workspace est un écosystème complet avec ses apps et ses DH, offrant privacy, scalabilité et intelligence.

C'est Slack/Teams + AI + ERP + CRM, le tout unifié.