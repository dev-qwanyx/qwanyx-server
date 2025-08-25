# Document Storage System - Système de Stockage Hybride

## 🎯 Concept : Double Indexation Sémantique-Physique

Les documents existent dans **deux espaces** simultanément :
1. **Espace Sémantique** : Position 3D basée sur le contenu
2. **Stockage Physique** : MongoDB/S3 avec UUID

## 📧 Exemple Concret : Stockage d'un Email

### 1. Réception et Stockage Physique

```javascript
class EmailStorage {
  async storeEmail(email) {
    // 1. STOCKAGE DANS MONGODB
    const document = {
      _id: new ObjectId(),  // UUID BSON automatique
      type: 'email',
      metadata: {
        from: email.from,
        to: email.to,
        subject: email.subject,
        date: email.date,
        size: email.body.length
      },
      content: {
        body: email.body,
        html: email.html,
        headers: email.headers
      },
      attachments: [],  // Références vers S3
      timestamp: new Date(),
      workspace: 'default'
    }
    
    // Sauvegarder dans MongoDB
    const stored = await db.collection('documents').insertOne(document)
    
    // 2. TRAITER LES PIÈCES JOINTES
    for (const attachment of email.attachments) {
      const s3Key = await this.storeAttachment(attachment, stored.insertedId)
      document.attachments.push({
        name: attachment.name,
        type: attachment.type,
        size: attachment.size,
        s3Key: s3Key,
        thumbnailId: await this.generateThumbnail(attachment)
      })
    }
    
    // 3. RETOURNER L'ID POUR L'ESPACE SÉMANTIQUE
    return {
      documentId: stored.insertedId,  // UUID pour référence
      document: document
    }
  }
}
```

### 2. Création de la Sphère Sémantique

```javascript
class SemanticSphereCreator {
  async createEmailSphere(email, documentId) {
    // 1. ANALYSE SÉMANTIQUE
    const concepts = await this.extractConcepts(email)
    const position = this.calculateBarycenter(concepts)
    
    // 2. CRÉATION DE LA SPHÈRE
    const sphere = {
      // Position dans l'espace 3D
      position: {
        x: position.x,
        y: position.y,
        z: position.z
      },
      
      // Propriétés sémantiques
      radius: this.calculateImportance(email),
      color: this.determineColor(concepts),
      
      // LIEN BIDIRECTIONNEL
      data: {
        documentId: documentId,  // Référence vers MongoDB !
        type: 'email',
        preview: {
          subject: email.subject,
          from: email.from,
          date: email.date,
          snippet: email.body.substring(0, 100)
        },
        concepts: concepts.map(c => c.id),  // IDs des concepts activés
        weight: this.calculateWeight(email)
      },
      
      // Métadonnées temporelles
      temporal: {
        created: Date.now(),
        accessed: [],
        ttl: null  // Pas d'expiration par défaut
      }
    }
    
    // 3. STOCKER LA SPHÈRE
    const sphereStored = await db.collection('spheres').insertOne({
      ...sphere,
      documentId: documentId,  // Double indexation !
      searchIndex: this.buildSearchIndex(concepts)
    })
    
    // 4. INDEXATION INVERSÉE
    await db.collection('documents').updateOne(
      { _id: documentId },
      { 
        $set: { 
          sphereId: sphereStored.insertedId,
          position: sphere.position 
        } 
      }
    )
    
    return sphere
  }
}
```

## 🗄️ Architecture de Stockage Abstrait

### Couche d'Abstraction

```javascript
class UnifiedStorageLayer {
  constructor() {
    // Différents backends selon le type
    this.backends = {
      structured: new MongoDBBackend(),     // JSON, metadata
      blob: new S3Backend(),                // Images, vidéos
      graph: new Neo4jBackend(),            // Relations
      timeseries: new InfluxDBBackend(),    // Métriques
      vector: new PineconeBackend()         // Embeddings
    }
  }
  
  async store(document) {
    const type = this.detectDocumentType(document)
    
    switch(type) {
      case 'email':
      case 'json':
      case 'text':
        // MongoDB pour données structurées
        return await this.storeStructured(document)
        
      case 'image':
      case 'video':
      case 'audio':
      case '3d-scene':
        // S3 pour blobs + metadata dans MongoDB
        return await this.storeBlob(document)
        
      case 'relationship':
        // Neo4j pour graphes
        return await this.storeGraph(document)
        
      case 'metrics':
        // InfluxDB pour séries temporelles
        return await this.storeTimeseries(document)
    }
  }
  
  async storeStructured(document) {
    // 1. Stocker dans MongoDB
    const stored = await this.backends.structured.store(document)
    
    // 2. Créer la sphère sémantique
    const sphere = await this.createSphere(document, stored._id)
    
    // 3. Retourner les deux références
    return {
      documentId: stored._id,
      sphereId: sphere._id,
      type: 'structured'
    }
  }
  
  async storeBlob(document) {
    // 1. Extraire les métadonnées
    const metadata = await this.extractMetadata(document)
    
    // 2. Stocker le blob dans S3
    const s3Key = `${document.type}/${Date.now()}-${document.name}`
    await this.backends.blob.upload(s3Key, document.data)
    
    // 3. Stocker les métadonnées dans MongoDB
    const stored = await this.backends.structured.store({
      type: document.type,
      s3Key: s3Key,
      metadata: metadata,
      size: document.size,
      checksum: this.calculateChecksum(document.data)
    })
    
    // 4. Créer la sphère avec référence
    const sphere = await this.createSphere(metadata, stored._id)
    
    return {
      documentId: stored._id,
      sphereId: sphere._id,
      s3Key: s3Key,
      type: 'blob'
    }
  }
}
```

## 🔍 Requêtes Bidirectionnelles

### Depuis l'Espace Sémantique vers le Document

```javascript
class SemanticToDocument {
  async retrieveDocument(sphere) {
    // 1. Extraire l'ID du document depuis la sphère
    const documentId = sphere.data.documentId
    
    // 2. Charger le document complet
    const document = await db.collection('documents').findOne({
      _id: documentId
    })
    
    // 3. Si c'est un blob, charger depuis S3
    if (document.s3Key) {
      document.content = await s3.download(document.s3Key)
    }
    
    // 4. Enrichir avec les données sémantiques
    document.semanticContext = {
      position: sphere.position,
      nearbyDocuments: await this.findNearby(sphere.position, 10),
      concepts: sphere.data.concepts,
      relevanceScore: sphere.data.weight
    }
    
    return document
  }
}
```

### Depuis le Document vers l'Espace Sémantique

```javascript
class DocumentToSemantic {
  async findInSpace(documentId) {
    // 1. Trouver la sphère associée
    const sphere = await db.collection('spheres').findOne({
      'data.documentId': documentId
    })
    
    if (!sphere) {
      // Document pas encore indexé sémantiquement
      return null
    }
    
    // 2. Retourner la position et contexte
    return {
      position: sphere.position,
      radius: sphere.radius,
      nearbyCount: await this.countNearby(sphere.position, 100),
      cluster: await this.identifyCluster(sphere.position),
      activated: await this.getActivatedConcepts(sphere)
    }
  }
}
```

## 💾 Types de Documents Supportés

```javascript
const DOCUMENT_TYPES = {
  // Structurés (MongoDB)
  structured: {
    email: { parser: 'email-parser', indexable: true },
    json: { parser: 'json', indexable: true },
    xml: { parser: 'xml-parser', indexable: true },
    csv: { parser: 'csv-parser', indexable: true },
    markdown: { parser: 'markdown-parser', indexable: true }
  },
  
  // Blobs (S3 + MongoDB metadata)
  blob: {
    image: { 
      formats: ['jpg', 'png', 'webp', 'svg'],
      extractor: 'vision-ai',
      thumbnail: true
    },
    video: {
      formats: ['mp4', 'webm', 'avi'],
      extractor: 'video-ai',
      thumbnail: true,
      transcription: true
    },
    audio: {
      formats: ['mp3', 'wav', 'ogg'],
      extractor: 'audio-ai',
      transcription: true
    },
    '3d': {
      formats: ['gltf', 'obj', 'fbx'],
      extractor: '3d-parser',
      thumbnail: true
    },
    pdf: {
      formats: ['pdf'],
      extractor: 'pdf-parser',
      ocr: true
    }
  },
  
  // Spéciaux
  special: {
    code: { parser: 'ast-parser', language: 'detect' },
    notebook: { parser: 'jupyter-parser' },
    spreadsheet: { parser: 'excel-parser' }
  }
}
```

## 🔄 Synchronisation et Cache

```javascript
class SyncManager {
  constructor() {
    // Cache en mémoire pour accès rapide
    this.cache = new Map()
    
    // Index inversé pour recherche rapide
    this.documentToSphere = new Map()
    this.sphereToDocument = new Map()
  }
  
  async syncDocument(documentId) {
    // 1. Vérifier le cache
    if (this.cache.has(documentId)) {
      return this.cache.get(documentId)
    }
    
    // 2. Charger depuis MongoDB
    const document = await db.collection('documents').findOne({ _id: documentId })
    const sphere = await db.collection('spheres').findOne({ 
      'data.documentId': documentId 
    })
    
    // 3. Mettre en cache
    const combined = {
      document: document,
      sphere: sphere,
      lastAccess: Date.now()
    }
    
    this.cache.set(documentId, combined)
    this.documentToSphere.set(documentId, sphere._id)
    this.sphereToDocument.set(sphere._id, documentId)
    
    // 4. Gérer la taille du cache
    if (this.cache.size > 10000) {
      this.evictOldest()
    }
    
    return combined
  }
}
```

## 🎯 Avantages du Système

1. **Double Indexation**
   - Recherche par contenu (espace sémantique)
   - Recherche par ID (base de données)
   - Navigation bidirectionnelle

2. **Flexibilité de Stockage**
   - MongoDB pour structuré
   - S3 pour blobs
   - Abstraction complète

3. **Performance**
   - Cache en mémoire
   - Index inversés
   - Requêtes optimisées

4. **Scalabilité**
   - Stockage distribué
   - Sharding MongoDB
   - S3 illimité

## 🚀 Utilisation Pratique

```javascript
// Stocker un email
const email = await receiveEmail()
const { documentId } = await storage.storeEmail(email)
const sphere = await semantic.createEmailSphere(email, documentId)

// Rechercher dans l'espace
const query = "factures 2024"
const results = await semantic.search(query)

// Pour chaque résultat, récupérer le document
for (const sphere of results) {
  const document = await storage.retrieve(sphere.data.documentId)
  console.log(document.metadata.subject)
}

// Navigation inverse
const doc = await db.collection('documents').findOne({ subject: /facture/ })
const position = await semantic.findInSpace(doc._id)
console.log(`Document at position: ${position.x}, ${position.y}, ${position.z}`)
```

## 🔗 Système d'Edges pour Navigation Rapide

### Edges : Relations Directes Non-Sémantiques

```javascript
class EdgeSystem {
  // Les edges créent des connexions directes entre documents
  // pour des requêtes ultra-rapides sans passer par l'espace sémantique
  
  async createEdge(sourceId, targetId, edgeType, metadata = {}) {
    const edge = {
      _id: new ObjectId(),
      source: sourceId,      // Document/Sphere ID
      target: targetId,      // Document/Sphere ID
      type: edgeType,        // Type de relation
      weight: metadata.weight || 1.0,
      metadata: metadata,
      created: new Date(),
      bidirectional: metadata.bidirectional || false
    }
    
    // Stocker dans collection edges
    await db.collection('edges').insertOne(edge)
    
    // Index pour recherche rapide
    await db.collection('edges').createIndex({ source: 1, type: 1 })
    await db.collection('edges').createIndex({ target: 1, type: 1 })
    
    // Si bidirectionnel, créer l'edge inverse
    if (edge.bidirectional) {
      await this.createEdge(targetId, sourceId, edgeType, {
        ...metadata,
        bidirectional: false,  // Éviter la récursion
        inverse: true
      })
    }
    
    return edge
  }
}
```

### Types d'Edges

```javascript
const EDGE_TYPES = {
  // Relations temporelles
  temporal: {
    FOLLOWS: 'follows',           // Email B suit Email A
    RESPONDS_TO: 'responds_to',   // Réponse directe
    REFERENCES: 'references',     // Référence un document
    VERSION_OF: 'version_of',     // Version d'un document
  },
  
  // Relations structurelles
  structural: {
    PARENT_OF: 'parent_of',       // Document parent
    CHILD_OF: 'child_of',         // Document enfant
    ATTACHMENT_OF: 'attachment',  // Pièce jointe
    THREAD: 'thread',             // Même fil de discussion
    FOLDER: 'folder',             // Même dossier
  },
  
  // Relations business
  business: {
    INVOICE_FOR: 'invoice_for',   // Facture pour commande
    PAYMENT_OF: 'payment_of',     // Paiement de facture
    CONTRACT_WITH: 'contract',    // Contrat avec partie
    PROJECT: 'project',           // Même projet
  },
  
  // Relations sociales
  social: {
    FROM_SAME: 'from_same_sender',
    TO_SAME: 'to_same_recipient',
    CC_TOGETHER: 'cc_together',
    MENTIONS: 'mentions',
  },
  
  // Relations computées
  computed: {
    SIMILAR: 'similar',           // Similarité > seuil
    DUPLICATE: 'duplicate',       // Quasi-identique
    TRANSLATION: 'translation',   // Traduction
    SUMMARY: 'summary',           // Résumé de
  }
}
```

### Requêtes Rapides via Edges

```javascript
class FastQueries {
  // Recherche directe sans passer par l'espace sémantique
  
  async findEmailThread(emailId) {
    // Tous les emails du même thread
    const edges = await db.collection('edges').find({
      $or: [
        { source: emailId, type: 'thread' },
        { target: emailId, type: 'thread' }
      ]
    }).toArray()
    
    // Récupérer tous les documents liés
    const documentIds = edges.map(e => [e.source, e.target]).flat()
    return await db.collection('documents').find({
      _id: { $in: documentIds }
    }).sort({ date: 1 }).toArray()
  }
  
  async findAllAttachments(documentId) {
    // Toutes les pièces jointes d'un document
    const edges = await db.collection('edges').find({
      source: documentId,
      type: 'attachment'
    }).toArray()
    
    const attachmentIds = edges.map(e => e.target)
    return await db.collection('documents').find({
      _id: { $in: attachmentIds }
    }).toArray()
  }
  
  async findRelatedInvoices(orderId) {
    // Factures liées à une commande
    const path = await db.collection('edges').aggregate([
      { $match: { source: orderId, type: 'invoice_for' } },
      { $lookup: {
        from: 'edges',
        localField: 'target',
        foreignField: 'source',
        as: 'payments'
      }},
      { $match: { 'payments.type': 'payment_of' } }
    ]).toArray()
    
    return path
  }
  
  async findByMultipleEdges(criteria) {
    // Recherche complexe multi-critères
    // Ex: "Tous les emails de Jean avec des factures en pièce jointe"
    
    const pipeline = [
      // Emails de Jean
      { $match: { 'metadata.from': 'jean@example.com' } },
      
      // Avec des edges d'attachement
      { $lookup: {
        from: 'edges',
        localField: '_id',
        foreignField: 'source',
        as: 'edges'
      }},
      
      // Filtrer sur les attachements
      { $match: { 'edges.type': 'attachment' } },
      
      // Récupérer les attachements
      { $lookup: {
        from: 'documents',
        localField: 'edges.target',
        foreignField: '_id',
        as: 'attachments'
      }},
      
      // Garder seulement ceux avec des factures
      { $match: { 'attachments.type': 'invoice' } }
    ]
    
    return await db.collection('documents').aggregate(pipeline).toArray()
  }
}
```

### Graphe de Navigation Hybride

```javascript
class HybridNavigator {
  async explore(startId, options = {}) {
    const {
      maxDepth = 3,
      edgeTypes = null,  // null = tous
      includeSemantic = true,
      includeEdges = true
    } = options
    
    const visited = new Set()
    const queue = [{ id: startId, depth: 0 }]
    const results = []
    
    while (queue.length > 0) {
      const { id, depth } = queue.shift()
      
      if (visited.has(id) || depth > maxDepth) continue
      visited.add(id)
      
      // 1. Navigation par EDGES (rapide)
      if (includeEdges) {
        const edges = await db.collection('edges').find({
          $or: [{ source: id }, { target: id }],
          ...(edgeTypes && { type: { $in: edgeTypes } })
        }).toArray()
        
        edges.forEach(edge => {
          const nextId = edge.source === id ? edge.target : edge.source
          queue.push({ id: nextId, depth: depth + 1 })
          results.push({
            type: 'edge',
            relation: edge.type,
            from: id,
            to: nextId,
            weight: edge.weight
          })
        })
      }
      
      // 2. Navigation SÉMANTIQUE (contextuelle)
      if (includeSemantic) {
        const sphere = await db.collection('spheres').findOne({
          'data.documentId': id
        })
        
        if (sphere) {
          const nearby = await this.findNearbySpheres(sphere.position, 50)
          nearby.forEach(nearSphere => {
            results.push({
              type: 'semantic',
              relation: 'nearby',
              from: id,
              to: nearSphere.data.documentId,
              distance: this.distance(sphere.position, nearSphere.position)
            })
          })
        }
      }
    }
    
    return results
  }
}
```

### Optimisation avec Index Composés

```javascript
class IndexOptimizer {
  async setupIndexes() {
    // Index pour recherches rapides par edges
    await db.collection('edges').createIndexes([
      { source: 1, type: 1 },
      { target: 1, type: 1 },
      { type: 1, weight: -1 },
      { 'metadata.date': -1 },
      
      // Index composé pour threads
      { source: 1, type: 1, 'metadata.threadId': 1 },
      
      // Index pour graphe traversal
      { source: 1, target: 1, type: 1 }
    ])
    
    // Index pour jointure sphères-documents
    await db.collection('spheres').createIndexes([
      { 'data.documentId': 1 },
      { 'position.x': 1, 'position.y': 1, 'position.z': 1 },
      { 'data.type': 1, 'temporal.created': -1 }
    ])
    
    // Index pour documents
    await db.collection('documents').createIndexes([
      { sphereId: 1 },
      { type: 1, 'metadata.date': -1 },
      { 'metadata.from': 1 },
      { 'metadata.subject': 'text' }
    ])
  }
}
```

### Cas d'Usage Pratiques

```javascript
// 1. Trouver toute la conversation
const thread = await fastQueries.findEmailThread(emailId)

// 2. Naviguer dans les factures
const invoices = await fastQueries.findRelatedInvoices(orderId)

// 3. Explorer le graphe complet
const graph = await navigator.explore(documentId, {
  maxDepth: 2,
  edgeTypes: ['responds_to', 'references'],
  includeSemantic: true
})

// 4. Recherche hybride
// "Emails similaires sémantiquement ET du même expéditeur"
const semantic = await semantic.findSimilar(emailId)
const edges = await db.collection('edges').find({
  source: emailId,
  type: 'from_same_sender'
}).toArray()

// Intersection des résultats
const combined = semantic.filter(s => 
  edges.some(e => e.target === s.data.documentId)
)
```

## 💡 Conclusion

Ce système hybride permet :
- **Stockage efficace** : Chaque type de document au bon endroit
- **Recherche sémantique** : Navigation dans l'espace 3D
- **Accès direct** : Via UUID quand on connaît l'ID
- **Navigation par graphe** : Edges pour relations directes
- **Requêtes hybrides** : Combiner sémantique et edges
- **Performance optimale** : Index sur tous les patterns de requête
- **Bidirectionnel** : Document ↔ Sphère ↔ Edges
- **Abstrait** : MongoDB, S3, Neo4j, ou tout autre backend

Triple navigation :
1. **Sémantique** : Par proximité conceptuelle
2. **Edges** : Par relations explicites
3. **Hybride** : Combiner les deux pour des requêtes puissantes

C'est le pont parfait entre le monde conceptuel (sphères), le monde physique (documents) et le monde relationnel (edges) !