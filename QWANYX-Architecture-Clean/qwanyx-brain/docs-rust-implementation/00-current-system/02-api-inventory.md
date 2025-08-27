# Inventaire Complet des APIs - Python & Node.js

## 🐍 API Python (Port 5002) - Flask

### Architecture Multi-Tenant

L'API Python est le **cœur du système multi-tenant** QWANYX avec isolation complète des données par workspace.

```
┌─────────────────────────────────────────────────────────┐
│                   QWANYX API (Python)                    │
│                     Flask - Port 5002                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Auth JWT   │  │  Workspace   │  │   MongoDB    │ │
│  │  (No Pass)   │  │   Manager    │  │ Multi-Tenant │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │                  Services Layer                    │  │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐ │  │
│  │  │  Auth  │  │   DH   │  │  App   │  │  Mail  │ │  │
│  │  └────────┘  └────────┘  └────────┘  └────────┘ │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 🔐 Endpoints d'Authentification (Sans Mot de Passe!)

```python
# IMPORTANT: Système sans mot de passe - Code par email uniquement

POST /auth/register
{
    "email": "user@example.com",
    "workspace": "autodin"
}
# → Crée l'utilisateur, envoie code par email

POST /auth/request-code
POST /auth/login  # Alias
{
    "email": "user@example.com",
    "workspace": "autodin"
}
# → Génère code 6 chiffres, envoie par email, TTL 10 minutes

POST /auth/verify-code
{
    "email": "user@example.com",
    "workspace": "autodin",
    "code": "123456"
}
# → Retourne JWT token (expire 7 jours)
Response: {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "email": "user@example.com",
        "workspace": "autodin"
    }
}
```

### 👥 Endpoints Utilisateurs

```python
GET /users
Headers: Authorization: Bearer <token>
# → Liste tous les utilisateurs du workspace

POST /users
{
    "email": "newuser@example.com",
    "role": "user"
}
# → Crée un utilisateur dans le workspace

PUT /users/{user_id}
{
    "email": "updated@example.com",
    "is_active": true
}
# → Met à jour l'utilisateur

DELETE /users/{user_id}
# → Supprime l'utilisateur

PUT /users/{user_id}/profile
{
    "name": "John Doe",
    "avatar": "https://...",
    "preferences": {}
}
# → Met à jour le profil utilisateur
```

### 🏢 Endpoints Workspaces

```python
GET /workspaces
# → Liste tous les workspaces disponibles
Response: [
    {
        "code": "autodin-be",
        "domain": "autodin.be",
        "name": "Autodin Belgique",
        "apps": ["autodin", "personalcash"],
        "dh_members": ["philippe@qwanyx.com"]
    }
]

POST /workspaces
Headers: Authorization: Bearer <token>
{
    "code": "newworkspace",
    "domain": "newworkspace.com",
    "name": "New Workspace"
}
# → Crée un nouveau workspace et sa database MongoDB

GET /workspaces/{code}
# → Détails d'un workspace spécifique

POST /workspaces/{code}/dh
{
    "dh_email": "newdh@workspace.com"
}
# → Ajoute un Digital Human au workspace

POST /workspaces/{code}/apps
{
    "app_code": "autodin"
}
# → Installe une app dans le workspace
```

### 🤖 Endpoints Digital Human (DH)

#### Flow Management
```python
GET /api/dh/{dh_id}/flow
# → Récupère la configuration du flow visuel

POST /api/dh/{dh_id}/flow
{
    "data": { "label": "root", "type": "flow" },
    "nodes": [...],
    "edges": [...]
}
# → Sauvegarde le flow

POST /api/dh/{dh_id}/flow/execute
{
    "input": { "message": "Hello" }
}
# → Exécute le flow
Response: {
    "execution_id": "exec_123",
    "status": "running"
}

GET /api/dh/{dh_id}/flow/execution/{exec_id}
# → Statut d'exécution

GET /api/dh/{dh_id}/flow/nodes
# → Types de nodes disponibles
Response: {
    "triggers": ["email-trigger"],
    "ai": ["analyze"],
    "actions": ["response"],
    "memory": ["memory-store", "memory-retrieve"],
    "logic": ["condition"]
}
```

#### Memory Management
```python
POST /api/dh/push
{
    "email": "dh@example.com",
    "data": {
        "conversation": [...],
        "context": {...},
        "knowledge": [...]
    }
}
# → Sauvegarde dans la mémoire du DH

GET /api/dh/pull?email=dh@example.com
# → Récupère toutes les données du DH

GET /api/dh/{dh_email}/memory
# → Récupère la mémoire spécifique

POST /api/dh/{dh_email}/tasks
{
    "task": "Process email",
    "priority": "high",
    "data": {...}
}
# → Ajoute une tâche au DH
```

#### Process Management
```python
POST /api/dh/{dh_id}/start
# → Démarre le processus DH en arrière-plan

POST /api/dh/{dh_id}/stop
# → Arrête le processus DH

GET /api/dh/{dh_id}/status
# → Statut du processus
Response: {
    "running": true,
    "pid": 12345,
    "started_at": "2024-08-25T10:00:00Z"
}
```

### 📧 Endpoints Utilitaires

```python
GET /health
# → Health check
Response: {
    "status": "healthy",
    "database": "connected",
    "version": "2.0.0"
}

POST /contacts
{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I need help with..."
}
# → Formulaire de contact
```

## 🟢 API Node.js (Port 3003) - Express

### 🧠 Endpoints Brain Management

```typescript
GET /health
// → Santé du serveur Brain
Response: {
    status: "healthy",
    brains: {
        active: 1,
        total: 1,
        max: 100
    },
    memory: {
        used: "512MB",
        total: "2GB"
    }
}

GET /brains
// → Liste des cerveaux actifs
Response: [
    {
        id: "phil-qwanyx-com",
        workspace: "autodin",
        status: "thinking",
        personality: {
            curiosity: 0.8,
            creativity: 0.9,
            logic: 0.7
        }
    }
]

POST /brain/start
{
    id: "new-brain",
    workspace: "autodin",
    personality: {
        curiosity: 0.5,
        creativity: 0.5
    }
}
// → Démarre un nouveau cerveau

DELETE /brain/{id}
// → Arrête un cerveau

POST /brain/{id}/command
{
    command: "think",
    params: {
        topic: "email processing"
    }
}
// → Envoie une commande au cerveau
```

### 💾 Endpoints Memory API

```typescript
POST /api/memory/form
{
    brainId: "phil-qwanyx-com",
    type: "email",
    content: "...",
    metadata: {
        urgency: "high",
        category: "support"
    }
}
// → Forme une nouvelle mémoire

POST /api/memory/compress
{
    brainId: "phil-qwanyx-com",
    precision: 0.5,
    maxChars: 500
}
// → Déclenche la compression sémantique

GET /api/memory/reconstruct/{memoryId}
// → Reconstruit une mémoire compressée

POST /api/memory/query/tags
{
    brainId: "phil-qwanyx-com",
    tags: ["urgent", "client"],
    limit: 10
}
// → Recherche par tags sémantiques

POST /api/memory/query/time
{
    brainId: "phil-qwanyx-com",
    from: "2024-08-01",
    to: "2024-08-25"
}
// → Recherche temporelle

GET /api/memory/stats?brainId=phil-qwanyx-com
// → Statistiques de compression
Response: {
    totalMemories: 1523,
    compressedMemories: 1200,
    compressionRatio: 0.78,
    spacesSaved: "45MB"
}

POST /api/memory/batch
{
    brainId: "phil-qwanyx-com",
    memories: [...]
}
// → Formation batch de mémoires
```

### 📧 Endpoints Email Processing

```typescript
POST /api/email/process
{
    from: "client@example.com",
    subject: "Urgent issue",
    body: "...",
    brainId: "phil-qwanyx-com"
}
// → Traite un email avec l'IA
Response: {
    urgency: "HIGH",
    category: "SUPPORT",
    sentiment: "NEGATIVE",
    suggested_response: "...",
    bant: {
        budget: false,
        authority: true,
        need: true,
        timeline: true
    }
}

GET /api/email/history?email=client@example.com&limit=5
// → Historique des conversations

POST /api/email/qualify
{
    email: "lead@example.com",
    conversation: [...]
}
// → Qualification BANT du lead
```

### 🔌 WebSocket Endpoints (ws://localhost:3003/neural)

```javascript
// Connection WebSocket
ws = new WebSocket('ws://localhost:3003/neural');

// Messages envoyés au serveur
{
    type: 'connect',
    brainId: 'phil-qwanyx-com'
}

{
    type: 'command',
    brainId: 'phil-qwanyx-com',
    command: 'think',
    params: {...}
}

// Événements reçus du serveur
{
    type: 'thought',
    brainId: 'phil-qwanyx-com',
    thought: {
        content: "Processing email about...",
        emotion: 0.7,
        confidence: 0.9
    }
}

{
    type: 'state_change',
    brainId: 'phil-qwanyx-com',
    state: 'thinking' | 'idle' | 'processing'
}

{
    type: 'personality_loaded',
    brainId: 'phil-qwanyx-com',
    personality: {...}
}

{
    type: 'memory_formed',
    brainId: 'phil-qwanyx-com',
    memory: {...}
}

{
    type: 'email_processed',
    brainId: 'phil-qwanyx-com',
    result: {...}
}
```

## 🔄 Flux de Données Complet

```
1. User → Python API (5002)
   - Authentification JWT
   - Gestion workspace
   
2. Python API → MongoDB
   - Multi-tenant databases
   - Collections par workspace
   
3. Python API → Node.js Brain (3003)
   - Démarrage cerveaux
   - Commandes de traitement
   
4. Node.js Brain → OpenAI/LLMs
   - Analyse sémantique
   - Génération réponses
   
5. Node.js Brain → MongoDB
   - Stockage mémoires
   - Compression sémantique
   
6. WebSocket → Clients
   - Streaming temps réel
   - Événements cerveau
```

## 🎯 Migration Rust - Tout Remplacer

### Phase 1 : Core API (Remplace Python)
- Authentification JWT sans mot de passe
- Gestion workspaces multi-tenant
- CRUD utilisateurs
- Health checks

### Phase 2 : Brain Engine (Remplace Node.js)
- Processeur SPU natif
- Gestion mémoire optimisée
- WebSocket haute performance
- Compression < 1ms

### Phase 3 : Services Intégrés
- Email processing unifié
- LLM orchestration native
- Digital Human engine
- Flow visual execution

### Architecture Cible Rust

```rust
// Un seul binaire remplace Python + Node.js
pub struct QwanyxServer {
    // API REST (ex-Python)
    http_server: ActixServer,
    
    // Brain Engine (ex-Node.js)
    spu_engine: SemanticProcessor,
    
    // WebSocket unifié
    ws_server: TokioWebSocket,
    
    // Multi-tenant DB
    mongo_pool: MongoPool,
    
    // Services intégrés
    auth_service: JWTAuth,
    email_service: SMTPService,
    llm_pool: LLMOrchestrator,
}
```

## 📊 Comparaison Finale

| Composant | Actuel | Rust | Bénéfice |
|-----------|--------|------|----------|
| **API Python** | Flask, synchrone | Actix-Web async | 100× throughput |
| **Brain Node.js** | Event loop, GC | Native, zero-copy | 1000× performance |
| **Processus** | 2 serveurs | 1 binaire | -50% ressources |
| **RAM Total** | 2-3 GB | 100-200 MB | 10-20× moins |
| **Latence API** | 50-200ms | < 5ms | 10-40× plus rapide |
| **Déploiement** | Python + Node.js | 1 binaire < 20MB | Ultra simple |

---

*Tout le système QWANYX sera unifié en un seul binaire Rust haute performance.*

→ Suivant : [Fonctionnalités à Migrer](./03-features-migration.md)