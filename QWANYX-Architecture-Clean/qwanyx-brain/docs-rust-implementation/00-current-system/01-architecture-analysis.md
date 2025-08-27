# Architecture Actuelle - Analyse Complète

## 🏗️ Vue d'Ensemble du Système

Le système QWANYX Brain actuel est une implémentation **TypeScript/Node.js** qui fonctionne comme "Consciousness as a Service" - hébergeant des cerveaux numériques vivants avec traitement d'emails et formation de mémoire.

## 📊 Architecture Globale

```
┌─────────────────────────────────────────────────────────┐
│                   QWANYX Brain Server                    │
│                    (Node.js/TypeScript)                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ HTTP Server  │  │  WebSocket   │  │   MongoDB    │ │
│  │  (Express)   │  │   Server     │  │   Driver     │ │
│  │  Port 3003   │  │  /neural     │  │              │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                  │                  │         │
│  ┌──────▼──────────────────▼──────────────────▼───────┐ │
│  │              Brain Manager (Singleton)              │ │
│  │         Gère jusqu'à 100 instances de Brain         │ │
│  └─────────────────────┬───────────────────────────────┘ │
│                        │                                 │
│  ┌─────────────────────▼────────────────────────────┐   │
│  │                Brain Instances                    │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐             │   │
│  │  │ Brain1 │  │ Brain2 │  │ Brain3 │  ...        │   │
│  │  └────────┘  └────────┘  └────────┘             │   │
│  └───────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 🧠 Core Brain System

### Brain.ts - Le Cerveau Principal

```typescript
export class Brain extends EventEmitter {
    // État principal
    private id: string;
    private workspace: string;
    private currentFlow: any;
    private thinking: boolean = false;
    
    // Système de graphe
    private nodes: Map<string, Node>;
    private edges: Map<string, Edge>;
    
    // Personnalité
    private personality: {
        curiosity: number;
        creativity: number;
        logic: number;
        emotion: number;
        memory: number;
    };
    
    // Services
    private memoryManager: MongoMemory;
    private emailService: SimpleMailService;
    private responseService: EmailResponseService;
}
```

**Caractéristiques Clés** :
- **Event-driven** : Émet des événements pour toutes les actions
- **Graph-based** : Pense en termes de nodes et edges
- **Self-modifying** : Peut modifier sa propre structure
- **Continuous thinking** : Boucle de pensée (désactivée actuellement)
- **Email-aware** : Traite les emails et forme des mémoires

### BrainManager.ts - Gestionnaire Multi-Cerveaux

```typescript
class BrainManager {
    private static instance: BrainManager;
    private brains: Map<string, Brain>;
    private maxBrains: number = 100;
    
    // Singleton pattern
    static getInstance(): BrainManager;
    
    // Gestion des cerveaux
    async createBrain(config: BrainConfig): Promise<Brain>;
    async getBrain(id: string): Promise<Brain>;
    async stopBrain(id: string): Promise<void>;
    
    // Monitoring
    getStats(): BrainStats;
    getHealth(): HealthStatus;
}
```

## 🔌 Neural Interface (WebSocket)

### NeuralInterface.ts - Communication Temps Réel

```typescript
export class NeuralInterface {
    private wss: WebSocketServer;
    private connections: Map<string, WebSocket>;
    private brainManager: BrainManager;
    
    // Protocole WebSocket
    handleConnection(ws: WebSocket): void {
        // Auto-création de cerveau
        // Routing des commandes
        // Streaming des événements
    }
    
    // Types de messages
    interface NeuralMessage {
        type: 'command' | 'thought' | 'state' | 'personality';
        brainId: string;
        payload: any;
    }
}
```

**Événements Streamés** :
- `thought` : Pensées du cerveau
- `state_change` : Changements d'état
- `personality_loaded` : Chargement de personnalité
- `flow_changed` : Navigation dans les flows
- `memory_formed` : Formation de mémoire
- `email_processed` : Traitement d'email

## 💾 Système de Mémoire

### MongoMemory.ts - Stockage Persistant

```typescript
export class MongoMemory {
    private client: MongoClient;
    private db: Db;
    private workspace: string;
    private brainId: string;
    
    // Collections
    private getCollection(): Collection {
        return `${workspace}_${brainId}_memory`;
    }
    
    // Opérations
    async saveMemory(memory: Memory): Promise<void>;
    async queryMemories(query: MemoryQuery): Promise<Memory[]>;
    async compressMemories(): Promise<CompressionResult>;
}
```

### Structure de Données MongoDB

```javascript
// Collection: autodin_phil-qwanyx-com_memory
{
    _id: ObjectId,
    type: 'email' | 'thought' | 'flow' | 'compressed',
    timestamp: Date,
    
    // Pour emails
    email: {
        from: string,
        subject: string,
        body: string,
        compressed: string  // Caractères chinois
    },
    
    // Pour compression sémantique
    semantic: {
        concepts: string[],  // Caractères chinois
        position: { x: number, y: number, z: number },
        activation: number,
        edges: ObjectId[]
    },
    
    // Métadonnées
    metadata: {
        urgency: string,
        sentiment: string,
        category: string,
        bant: {
            budget: boolean,
            authority: boolean,
            need: boolean,
            timeline: boolean
        }
    }
}
```

## 📧 Système de Traitement d'Email

### EmailResponseService.js - IA de Réponse

```javascript
class EmailResponseService {
    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.model = 'gpt-4o';
    }
    
    async generateResponse(emailData) {
        // 1. Qualification BANT
        const qualification = await this.qualifyLead(emailData);
        
        // 2. Génération de réponse personnalisée
        const response = await this.generatePersonalizedResponse(
            emailData,
            qualification
        );
        
        // 3. Mise à jour du contact
        await this.updateContact(emailData.from, qualification);
        
        return response;
    }
}
```

### SimpleMailService.ts - IMAP/SMTP

```typescript
export class SimpleMailService extends EventEmitter {
    private imapConfig: IMAPConfig;
    private smtpConfig: SMTPConfig;
    private checkInterval: number = 30000; // 30 secondes
    
    // Monitoring des emails
    startMonitoring(): void {
        setInterval(() => this.checkEmails(), this.checkInterval);
    }
    
    // Événements émis
    emit('mail:received', email);
    emit('mail:sent', response);
    emit('contact:created', contact);
}
```

## 🌐 API REST Endpoints

### Routes HTTP Actuelles

```typescript
// Health & Monitoring
GET  /health                     // Santé du serveur
GET  /brains                     // Liste des cerveaux actifs
GET  /brain/:id/stats            // Statistiques d'un cerveau

// Brain Management
POST   /brain/start              // Démarrer un cerveau
DELETE /brain/:id                // Arrêter un cerveau
POST   /brain/:id/command        // Envoyer une commande

// Memory API
POST /api/memory/form            // Former une mémoire
POST /api/memory/compress        // Compression sémantique
GET  /api/memory/reconstruct/:id // Reconstruction
POST /api/memory/query/tags      // Recherche par tags
POST /api/memory/query/time      // Recherche temporelle
GET  /api/memory/stats           // Statistiques
POST /api/memory/batch           // Formation batch

// Email Processing
POST /api/email/process          // Traiter un email
GET  /api/email/history          // Historique conversations
POST /api/email/qualify          // Qualification BANT
```

## ⚙️ Configuration Actuelle

### Variables d'Environnement

```bash
# Server
PORT=3003
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=qwanyx_brains

# OpenAI
OPENAI_API_KEY=sk-...

# Limits
MAX_BRAINS_PER_SERVER=100
MAX_MEMORY_PER_BRAIN=1000000
THINKING_INTERVAL_MS=100

# Email
CHECK_EMAIL_INTERVAL=30000
```

### Configuration Mail (mail-config.json)

```json
{
    "imap": {
        "user": "phil@qwanyx.com",
        "password": "***",
        "host": "mail.infomaniak.com",
        "port": 993,
        "tls": true,
        "authTimeout": 10000,
        "tlsOptions": {
            "rejectUnauthorized": false,
            "servername": "mail.infomaniak.com"
        }
    },
    "smtp": {
        "host": "mail.infomaniak.com",
        "port": 587,
        "secure": false,
        "auth": {
            "user": "phil@qwanyx.com",
            "pass": "***"
        }
    }
}
```

## 📊 Métriques de Performance Actuelles

### Limitations Node.js Observées

| Métrique | Valeur Actuelle | Problème |
|----------|-----------------|----------|
| **Continuous Thinking** | Désactivé | Trop lent en JS |
| **Compression Sémantique** | 50-200ms | Bloque l'event loop |
| **Emails/seconde** | ~100 | GC pauses |
| **Utilisation RAM** | 512MB-2GB | Memory leaks potentiels |
| **Latence WebSocket** | 10-50ms | Event loop congestion |
| **Démarrage** | 5-10s | Chargement modules |

## 🔄 Flux de Données Actuel

```
1. Email reçu (IMAP)
   ↓
2. SimpleMailService.checkEmails()
   ↓
3. Brain.processEmail()
   ↓
4. EmailResponseService.generateResponse()
   ↓
5. OpenAI GPT-4o API
   ↓
6. Qualification BANT + Personnalisation
   ↓
7. MongoMemory.saveMemory()
   ↓
8. SimpleMailService.sendEmail()
   ↓
9. WebSocket broadcast to clients
```

## 🎯 Points d'Amélioration pour Rust

1. **Performance** :
   - Activer le continuous thinking (10+ thoughts/sec)
   - Compression < 5ms (vs 50-200ms)
   - Zero GC pauses

2. **Concurrence** :
   - Vraie parallélisation des cerveaux
   - Lock-free data structures
   - SIMD pour compression

3. **Mémoire** :
   - Utilisation déterministe
   - Zero-copy operations
   - Memory pools

4. **SPU Features** :
   - Compilateur assembleur natif
   - VM d'exécution optimisée
   - Raytracing hardware-acceleré

---

*Cette analyse servira de base pour la migration vers Rust avec amélioration 100× de la performance.*

→ Suivant : [API et Endpoints](./02-api-inventory.md)