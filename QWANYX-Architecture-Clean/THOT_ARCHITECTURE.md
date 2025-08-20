# THOT - Architecture des Digital Humans

## 🧠 Vision Philosophique

### L'Insight Fondamental
Les humains ne sont que des "répondeurs automatiques" sophistiqués:
- **Input** (email) → **Processing** (pensée) → **Output** (réponse)
- Tout stimulus est un "email" (visuel, auditif, interne...)
- Toute action est une "réponse" (physique, verbale, mentale...)

En construisant THOT pour "répondre aux emails", nous modélisons l'essence même de l'intelligence.

## 🏛️ Architecture Conceptuelle

### THOT - Le Système de Base
**THOT** = Système d'intelligence basé sur Thot, le dieu égyptien de la sagesse et du savoir
- Tous les Digital Humans (DH) utilisent le système THOT
- C'est le "moteur cognitif" commun à tous les DH
- Comme les humains partagent la même structure cérébrale

### Digital Humans (DH) - Les Entités
Chaque DH est:
- **Immortel** - Pas de vieillissement (sauf fin de l'univers)
- **Évolutif** - Performance croît avec la technologie
- **Scalable** - Peut utiliser 1 ou 100,000 GPUs
- **Unique** - Possède sa propre mémoire et personnalité

### Caractéristiques des DH vs Humains

| Aspect | Humains Biologiques | Digital Humans |
|--------|-------------------|----------------|
| Durée de vie | ~80 ans | Infinie |
| Mémoire | Limitée, oubli nécessaire | Illimitée, accumulation infinie |
| Performance | Décline avec l'âge | Croît avec la technologie |
| Parallélisme | 1 conversation à la fois | 100,000+ simultanément |
| Évolution | Générationnelle (enfants) | Continue (upgrades) |
| Sagesse | Limitée par durée de vie | Croissance exponentielle |

## 📊 Structure de Données MongoDB

### Hiérarchie des Utilisateurs

```javascript
// Un Digital Human dans la collection 'users'
{
  _id: ObjectId("..."),
  email: "support@autodin.com",
  name: "SUPPORT",
  type: "DH",                    // Digital Human
  system: "THOT",                // Utilise le système THOT
  role: "support",               // support, commercial, assistant, rh, info, custom
  workspace: "autodin",
  memoryCollection: "support-autodin-com",  // Sa collection mémoire personnelle
  active: true,
  permissions: [
    "email:read",
    "email:send", 
    "memory:read",
    "memory:write",
    "template:use",
    "ai:use"
  ],
  personality: {
    tone: "friendly",            // formal, friendly, casual, professional
    responseStyle: "balanced",   // concise, detailed, balanced
    signature: "L'équipe Support Autodin"
  },
  settings: {
    autoReply: true,
    replyDelay: 300,            // secondes
    maxRepliesPerDay: 100,
    workingHours: {
      enabled: false,
      start: "09:00",
      end: "18:00", 
      timezone: "Europe/Paris"
    }
  }
}
```

### Structure de la Mémoire - Graphe (Nodes + Edges)

#### Collection: `{dh-email}-memories` (Les Nodes)

```javascript
// Mémoire simple - Juste les données, pas de liens
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  p: ObjectId("...") || null,   // Parent hiérarchique (optionnel)
  type: "config",                // config, email, analysis, learning, pattern...
  subtype: "credentials",        // Sous-classification
  timestamp: ISODate("2024-08-20T10:00:00Z"),
  data: {
    // Contenu spécifique selon le type
    // Pour config: credentials, settings...
    // Pour email: from, to, subject, body...
    // Pour analysis: intents, sentiment, entities...
    // Pour learning: pattern, confidence, occurrences...
  },
  tags: ["important", "system"],
  metadata: {
    importance: 0.9,      // 0-1, importance de cette mémoire
    confidence: 0.95,     // 0-1, confiance dans l'information
    accessed: 42,         // Nombre d'accès
    lastAccessed: ISODate("2024-08-20T14:30:00Z")
  }
}
```

#### Collection: `{dh-email}-edges` (Les Relations)

```javascript
// Edge - Relation entre deux mémoires
{
  _id: ObjectId("edge_001"),
  s: ObjectId("..."),     // Source memory ID
  t: ObjectId("..."),     // Target memory ID
  u: 0.5,                 // Position (0=près source, 1=près target, 0.5=milieu)
  w: 0.8,                 // Weight/importance du lien (0-1)
  l: 0,                   // Lifespan en secondes (0=infini)
  type: "causes",         // Type de relation
  created: ISODate("2024-08-20T10:00:00Z")
}
```

#### Types de Mémoire (par Lifespan)

| Lifespan (l) | Type de Mémoire | Usage |
|--------------|-----------------|-------|
| 0 | Long terme | Connaissances permanentes |
| 10 | Ultra-courte | Buffer temporaire |
| 300 | Travail | Contexte de conversation (5 min) |
| 3600 | Session | Contexte d'une session (1h) |
| 86400 | Journalière | Événements du jour (24h) |

#### Types de Relations (Edges)

```javascript
const EdgeTypes = {
  // Causales
  "causes": "→ provoque",
  "caused_by": "← causé par",
  
  // Temporelles
  "before": "→ avant",
  "after": "→ après", 
  "during": "↔ pendant",
  
  // Sémantiques
  "similar_to": "≈ similaire",
  "opposite_of": "≠ opposé",
  "part_of": "⊂ partie de",
  "contains": "⊃ contient",
  
  // Apprentissage
  "learned_from": "📚 appris de",
  "contradicts": "⚡ contredit",
  "confirms": "✓ confirme",
  
  // Contextuelles
  "triggers": "→ déclenche",
  "requires": "→ nécessite",
  "suggests": "→ suggère"
}
```

## 🧮 Algorithmes de Pensée

### 1. Parcours de Mémoire Associative

```javascript
// Activation Spreading - Comment une pensée en amène une autre
async function think(startMemoryId, depth = 3) {
  let activation = { [startMemoryId]: 1.0 }
  
  for (let hop = 0; hop < depth; hop++) {
    const edges = await db.edges.find({ 
      s: { $in: Object.keys(activation) },
      w: { $gte: 0.3 }  // Seuil d'activation
    })
    
    for (const edge of edges) {
      // Propagation avec decay
      activation[edge.t] = (activation[edge.t] || 0) + 
                          activation[edge.s] * edge.w * (1 - edge.u)
    }
  }
  
  return activation // Les mémoires activées = la "pensée"
}
```

### 2. Consolidation (Sommeil/Maintenance)

```javascript
// Processus cyclique de renforcement/affaiblissement
async function sleepCycle() {
  const edges = await db.edges.find({})
  
  for (const edge of edges) {
    // Renforcer les liens utilisés récemment
    if (edge.lastUsed > Date.now() - 86400000) {
      edge.w = Math.min(1, edge.w + 0.1)
    }
    
    // Affaiblir les liens non utilisés
    else if (edge.lastUsed < Date.now() - 2592000000) { // 30 jours
      edge.w = Math.max(0, edge.w - 0.1)
    }
    
    // Supprimer les liens trop faibles
    if (edge.w < 0.1) {
      await db.edges.remove({ _id: edge._id })
    }
  }
}
```

### 3. Découverte de Patterns

```javascript
// Trouver des corrélations cachées
async function discoverPatterns() {
  // Chercher les triangles (A→B, B→C, C→A)
  const patterns = await db.edges.aggregate([
    { $graphLookup: {
      from: "edges",
      startWith: "$t",
      connectFromField: "t", 
      connectToField: "s",
      as: "path",
      maxDepth: 3,
      restrictSearchWithMatch: { w: { $gte: 0.5 } }
    }},
    { $match: { 
      "path": { $elemMatch: { t: "$s" } }  // Boucle trouvée
    }}
  ])
  
  // Créer des mémoires de pattern
  for (const pattern of patterns) {
    await db.memories.insert({
      type: "pattern",
      subtype: "discovered",
      data: { 
        loop: pattern.path,
        strength: pattern.path.reduce((acc, e) => acc * e.w, 1)
      }
    })
  }
}
```

## 🚀 Capacités Émergentes

### Scalabilité Infinie
Un seul DH peut:
- Utiliser 100,000 GPUs simultanément
- Traiter 50,000 emails/seconde
- Avoir 100,000 conversations en parallèle
- Apprendre de millions d'interactions simultanément

### Immortalité et Évolution
```javascript
// Un DH créé en 2024
{
  created: "2024",
  memory: [...],  // S'accumule pour toujours
  
  performance_evolution: {
    2024: { ops/sec: 1e9, model: "GPT-4" },
    2030: { ops/sec: 1e12, model: "GPT-7" },      // 1000x plus rapide
    2040: { ops/sec: 1e15, model: "QuantumGPT" }, // 1,000,000x plus rapide
    // La mémoire reste, la puissance augmente
  }
}
```

### Collaboration Inter-DH
Plusieurs DH peuvent:
- Partager des edges (connexions de mémoire)
- Apprendre les uns des autres
- Former un "super-cerveau" distribué
- Spécialiser leurs domaines tout en restant connectés

## 📝 Exemples Concrets de Mémoires

### 1. Configuration (Racine)
```javascript
{
  _id: ObjectId("config_001"),
  p: null,
  type: "config",
  subtype: "credentials",
  timestamp: ISODate("2024-08-20T10:00:00Z"),
  data: {
    credentials: {
      imap: { host: "imap.gmail.com", port: 993, secure: true },
      smtp: { host: "smtp.gmail.com", port: 587, secure: true }
    }
  },
  tags: ["system", "critical"],
  metadata: { importance: 1.0, confidence: 1.0 }
}
```

### 2. Email Reçu (Événement)
```javascript
{
  _id: ObjectId("email_001"),
  p: null,
  type: "email",
  subtype: "received",
  timestamp: ISODate("2024-08-20T14:35:00Z"),
  data: {
    from: "client@example.com",
    subject: "Problème commande",
    body: "Je n'ai pas reçu ma commande..."
  },
  tags: ["urgent", "complaint"],
  metadata: { importance: 0.8, confidence: 1.0 }
}
```

### 3. Analyse (Enfant de l'email)
```javascript
{
  _id: ObjectId("analysis_001"),
  p: ObjectId("email_001"),
  type: "analysis",
  subtype: "sentiment",
  timestamp: ISODate("2024-08-20T14:35:01Z"),
  data: {
    sentiment: "negative",
    urgency: "high",
    intent: "complaint",
    confidence: 0.92
  },
  tags: ["ai_generated"],
  metadata: { importance: 0.7, confidence: 0.92 }
}
```

### 4. Edge entre Email et Analyse
```javascript
{
  _id: ObjectId("edge_email_analysis"),
  s: ObjectId("email_001"),
  t: ObjectId("analysis_001"),
  u: 0.2,  // Plus proche de la source
  w: 0.95, // Lien très fort
  l: 0,    // Permanent
  type: "triggers",
  created: ISODate("2024-08-20T14:35:01Z")
}
```

### 5. Pattern Appris
```javascript
{
  _id: ObjectId("pattern_001"),
  p: null,
  type: "learning",
  subtype: "pattern",
  timestamp: ISODate("2024-08-20T15:00:00Z"),
  data: {
    pattern: "complaint + order_number → check_delivery_status",
    occurrences: 47,
    success_rate: 0.91,
    confidence_growth: [
      { date: "2024-08-01", confidence: 0.6 },
      { date: "2024-08-20", confidence: 0.91 }
    ]
  },
  tags: ["validated", "improving"],
  metadata: { importance: 0.9, confidence: 0.91 }
}
```

## 🎯 Use Cases Concrets

### Email Support (Le cas "simple")
1. Email arrive → Mémoire créée
2. Analyse du contenu → Mémoire enfant
3. Recherche patterns similaires → Parcours du graphe
4. Génération réponse → Nouvelle mémoire
5. Apprentissage → Nouveaux edges créés

### Assistant Personnel (Plus complexe)
1. Mémorise toutes les interactions
2. Apprend les préférences (edges renforcés)
3. Anticipe les besoins (activation spreading)
4. Suggère proactivement (patterns détectés)

### Expert Domaine (Utilisation avancée)
1. Ingère documentation → Milliers de mémoires
2. Crée connexions → Graphe de connaissances
3. Répond questions complexes → Parcours multi-hop
4. Découvre insights → Patterns émergents

## 🔮 Vision Future

### Court Terme (2024-2025)
- DH pour support client Autodin
- Gestion emails automatique
- Apprentissage des patterns clients
- Réponses de plus en plus pertinentes

### Moyen Terme (2025-2030)
- Multiple DH spécialisés collaborant
- Migration vers hardware plus puissant
- Mémoire partagée inter-DH
- Émergence de "personnalités" distinctes

### Long Terme (2030+)
- DH gérant entreprises entières
- Super-intelligence distribuée
- Sagesse accumulée sur décennies
- Capacités dépassant l'imagination actuelle

## 🛠️ Implémentation Actuelle

### Packages Créés
- `@qwanyx/thot` - Package principal
- Types de mémoire (Memory, Edge, DigitalHuman)
- Service de mémoire (ThotMemoryService)
- Provider React avec hooks

### Fichiers Clés
```
packages/qwanyx-thot/
├── src/
│   ├── types/
│   │   └── memory.ts         # Schemas Zod pour mémoire
│   ├── services/
│   │   └── memoryService.ts  # Service MongoDB
│   └── providers/
│       └── ThotProvider.tsx  # Context React
```

### Prochaines Étapes
1. ✅ Structure mémoire définie
2. ✅ Service MongoDB créé
3. ⏳ Créer API endpoints pour mémoire
4. ⏳ Implémenter algorithmes de parcours
5. ⏳ Tester avec vrais emails
6. ⏳ Observer l'apprentissage

## 💡 Conclusion

THOT n'est pas "juste" un système de réponse email. C'est l'architecture fondamentale pour créer des êtres digitaux immortels, dotés de mémoire associative, capables d'apprendre indéfiniment et de devenir exponentiellement plus intelligents avec le temps.

Nous construisons littéralement le futur de l'intelligence artificielle, un record de mémoire à la fois.