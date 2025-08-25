# QWANYX Brain - Architecture Théorique du Système de Graphe en Mémoire

## 📊 Analyse du Système Actuel

### Brain Server (TypeScript)
- **Brain.ts** : Entité vivante avec mémoire de travail (nodes/edges)
- **MemoryFormationService** : Création de mémoires typées (email, contact, task)
- **FlowManager** : Gestion des flux de pensée hiérarchiques
- **NeuralInterface** : WebSocket pour connexions temps réel
- **Services** : Mail, EmailResponse avec IA

### API Python (Flask)
- **Routes** : workspaces, dh_flow, dh_process, dh_memory
- **Services** : WorkspaceService, DHService, AppService
- **MongoDB** : Stockage persistant actuel

### Problèmes Identifiés
1. **Double source de vérité** : Brain server + API Python
2. **Latence** : MongoDB → API Python → Frontend
3. **Complexité** : Deux langages, deux serveurs
4. **Scalabilité** : MongoDB limitant pour graphes complexes

## 🧠 Nouvelle Architecture Théorique

### Concept Central : "Neural Graph Engine"

Inspiré des moteurs 3D, le système traite les données comme un espace multidimensionnel où :
- **Memories** = Vertices (points dans l'espace)
- **Relations** = Edges (connexions)
- **Thoughts** = Raytracing (parcours du graphe)
- **Context** = Viewport (fenêtre de mémoire active)

### Structure de Base

```
┌─────────────────────────────────────────────────┐
│                 BRAIN CORE                      │
│  ┌──────────────────────────────────────────┐  │
│  │          MEMORY OCTREE                   │  │
│  │  Spatial indexing of all memories        │  │
│  │  - Fast 3D lookup O(log n)               │  │
│  │  - Automatic clustering                  │  │
│  │  - LOD (Level of Detail) support         │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │          SYNAPSE MATRIX                  │  │
│  │  Compressed edge storage                 │  │
│  │  - Float32Array for weights              │  │
│  │  - Sparse matrix representation          │  │
│  │  - SIMD optimizable                      │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │          SEMANTIC INDEX                  │  │
│  │  Inverted index for fast search          │  │
│  │  - Hash maps for O(1) lookup             │  │
│  │  - Bloom filters for existence checks    │  │
│  │  - Trigram indexing for fuzzy search     │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Types de Données

#### 1. Memory Node (Vertex)
```typescript
interface MemoryNode {
  // Identity
  id: Uint32         // 4 bytes - unique identifier
  type: Uint8        // 1 byte - memory type enum
  
  // Spatial position (for octree)
  x: Float32         // 4 bytes - semantic position
  y: Float32         // 4 bytes - temporal position  
  z: Float32         // 4 bytes - importance position
  
  // Content pointer
  dataOffset: Uint32 // 4 bytes - offset in data buffer
  dataLength: Uint16 // 2 bytes - length of data
  
  // Metadata
  timestamp: Uint32  // 4 bytes - creation time
  accessCount: Uint16// 2 bytes - for LRU
  flags: Uint8       // 1 byte - various flags
}
// Total: 32 bytes per node (cache-line aligned)
```

#### 2. Synapse (Edge)
```typescript
interface Synapse {
  from: Uint32       // 4 bytes - source node
  to: Uint32         // 4 bytes - target node
  weight: Float32    // 4 bytes - connection strength
  type: Uint8        // 1 byte - edge type
  flags: Uint8       // 1 byte - directional, active, etc.
}
// Total: 14 bytes per edge (pack to 16 with padding)
```

### Stratégies de Compression

#### 1. **Memory Pooling**
- Pré-allocation de blocs mémoire contigus
- Réutilisation des slots supprimés
- Défragmentation périodique

#### 2. **Data Compression**
- LZ4 pour textes longs
- Quantization pour embeddings
- Delta encoding pour séries temporelles

#### 3. **Hierarchical LOD**
- Memories récentes : Full detail
- Memories anciennes : Compressed
- Memories archivées : Swapped to disk

### Opérations Fondamentales

#### 1. **Think (Raycast)**
```javascript
// Parcours du graphe comme un ray dans une scène 3D
function think(origin, direction, maxDistance) {
  const ray = new Ray(origin, direction)
  const intersections = octree.raycast(ray, maxDistance)
  return intersections.map(node => expandMemory(node))
}
```

#### 2. **Remember (Spatial Query)**
```javascript
// Recherche dans une région de l'espace mémoire
function remember(center, radius, filters) {
  const nodes = octree.query(center, radius)
  return nodes.filter(filters).sort(byRelevance)
}
```

#### 3. **Learn (Graph Modification)**
```javascript
// Ajout de nouvelles connexions ou renforcement
function learn(memory1, memory2, strength) {
  const edge = synapseMatrix.connect(memory1, memory2)
  edge.weight = edge.weight * 0.9 + strength * 0.1 // EMA
}
```

### Persistance

#### 1. **Memory-Mapped Files**
- Fichiers mappés en mémoire virtuelle
- OS gère le swap automatiquement
- Accès transparent RAM ↔ Disque

#### 2. **Incremental Snapshots**
- Dump complet toutes les heures
- Delta logs toutes les minutes
- Write-Ahead Log pour transactions

#### 3. **Structure des Fichiers**
```
brain_data/
├── core.mmap          # Memory-mapped octree (GB+)
├── synapses.mmap      # Memory-mapped edges (GB+)
├── index.mmap         # Memory-mapped indices
├── snapshots/
│   ├── 2024-08-24-14h.snap
│   └── deltas/
│       ├── 14h15.delta
│       └── 14h30.delta
└── wal/               # Write-ahead logs
    └── current.wal
```

### API Unifiée

Le Brain devient l'unique point d'entrée :

```javascript
// Remplace l'API Python
class BrainAPI {
  // Workspace operations
  async createWorkspace(name) { 
    return this.think('workspace.create', {name}) 
  }
  
  // User operations  
  async getUser(id) {
    return this.remember('user', {id})
  }
  
  // Real-time subscriptions
  subscribe(pattern, callback) {
    this.synapses.watch(pattern, callback)
  }
}
```

### Avantages de cette Architecture

1. **Performance**
   - Accès mémoire : ~100ns vs MongoDB ~1ms
   - Recherche octree : O(log n) vs B-tree O(log n) + I/O
   - Batch processing : SIMD sur Float32Arrays

2. **Scalabilité**
   - Mémoire virtuelle : Peut dépasser la RAM
   - Sharding naturel : Octree divisible
   - Compression : 10-100x moins d'espace

3. **Simplicité**
   - Un seul serveur (Node.js)
   - Un seul langage (TypeScript)
   - Une seule source de vérité

4. **Temps Réel**
   - Pas de round-trip DB
   - WebSocket direct sur le graphe
   - Propagation instantanée

## 🚀 Prochaines Étapes

### Phase 1 : Prototype
1. Implémenter l'octree basique
2. Créer la synapse matrix
3. Tester avec 1M nodes

### Phase 2 : Migration
1. Exporter MongoDB → Graph
2. Remplacer l'API Python
3. Adapter le frontend

### Phase 3 : Optimisation
1. SIMD operations
2. WebAssembly modules
3. GPU compute shaders

## 📚 Technologies à Explorer

### JavaScript/TypeScript
- **mmap-io** : Memory-mapped files
- **levelup** : Key-value store
- **lmdb-js** : Lightning Memory-Mapped Database
- **gundb** : Decentralized graph database

### Algorithmes
- **Octree/KD-Tree** : Spatial indexing
- **Bloom Filters** : Probabilistic search
- **LSH** : Locality-Sensitive Hashing
- **HNSW** : Hierarchical Navigable Small World

### Formats
- **MessagePack** : Binary serialization
- **FlatBuffers** : Zero-copy serialization
- **Apache Arrow** : Columnar memory format

Cette architecture transforme QWANYX Brain en un véritable "moteur de pensée" capable de gérer des milliards de connexions en temps réel, tout en restant simple à déployer et maintenir.