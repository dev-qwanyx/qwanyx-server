# Architecture de Recherche Sémantique Hybride

## Vue d'ensemble

Système de recherche sémantique scalable utilisant un compresseur sémantique et une architecture de stockage hybride pour gérer 100k-1M+ documents avec performance optimale et précision variable.

### Principe fondamental
**Embeddings comme hash sémantique** : Les embeddings servent uniquement d'index de recherche rapide. Le document original reste la source de vérité.

## Architecture Technique

### Composants principaux

**1. Compresseur Sémantique**
- Compression ~80% du texte original
- Préservation des concepts clés et données importantes
- Output : 5-200 tokens calibrés sémantiquement
- Décompression fidèle via LLM (faits, noms, concepts)

**2. Stockage Hybride**
- **Fichiers binaires** : Index vectoriel optimisé (HNSW/Faiss)
- **MongoDB** : Metadata, doc_id, mappings
- **S3** : Documents originaux (non-texte)

**3. Pipeline de Précision Progressive**
- **Niveau 1** : Vector search ultra-rapide (< 1ms)
- **Niveau 2** : Texte compressé pour pré-filtrage (< 10ms)  
- **Niveau 3** : Document complet pour précision maximale (< 100ms)

## Workflow de Recherche

### Étapes du pipeline

1. **Query Processing**
   - Génération embedding de la requête
   - Normalisation et preprocessing

2. **Vector Search (Niveau 1)**
   - Recherche dans index vectoriel (fichier binaire)
   - Retour des K candidats les plus proches
   - Performance : sub-milliseconde

3. **Metadata Filtering (Niveau 2)**  
   - Query MongoDB avec doc_ids candidats
   - Application de filtres metadata
   - Accès au texte compressé pour pré-validation

4. **Document Retrieval (Niveau 3)**
   - Fetch documents S3 pour candidats finaux
   - Cache LRU pour documents fréquents
   - Retour résultats complets

### Mapping des identifiants
```
vector_index ↔ doc_id ↔ s3_key ↔ mongodb_record
```

## Optimisations Performance

### Embeddings
- **Dimensions** : 256D maximum (compromis taille/qualité)
- **Quantization** : int8 obligatoire (4x réduction mémoire)
- **Modèle** : `all-MiniLM-L6-v2` ou équivalent

### Index Vectoriel
- **Algorithme** : HNSW (Hierarchical Navigable Small World)
- **Stockage** : Fichier binaire chargé en RAM
- **Mémoire** : ~250MB pour 1M documents (256D, int8)

### Base de données
- **MongoDB** : Index sur doc_id, metadata principaux
- **S3** : Organisation par buckets/préfixes logiques
- **Cache** : LRU en mémoire pour docs fréquents

## Avantages du Système

### Scalabilité
- **Recherche vectorielle** : O(log n) avec HNSW
- **Stockage** : Illimité via S3
- **Coût** : Optimisé par niveau de précision

### Flexibilité
- **Précision à la demande** : Stop au niveau suffisant
- **Trade-off** : Speed vs Accuracy configurable
- **Extensibilité** : Ajout facile de nouveaux filtres

### Performance
- **Sub-seconde** : Recherche complète
- **Parallélisation** : Async pour S3, concurrent search
- **Mémoire** : Contrôlée via quantization + cache

## Instructions Implémentation Rust

### Dépendances requises
- `candle-core` : Génération embeddings locaux
- `faiss-rs` ou `hnswlib-rs` : Index vectoriel  
- `mongodb` : Driver base de données
- `aws-sdk-s3` : Client S3
- `serde_json` : Sérialisation
- `tokio` : Runtime async
- `lru` : Cache documents

### Structure du projet
```
src/
├── embedding/     # Génération embeddings
├── index/        # Gestion index vectoriel  
├── storage/      # Abstraction MongoDB + S3
├── search/       # Pipeline de recherche
├── compression/  # Compresseur sémantique
└── cache/        # LRU cache
```

### Composants à implémenter

**1. Embedding Service**
- Charger modèle embedding au démarrage
- API pour générer embeddings (query + documents)
- Batch processing pour indexation massive
- Quantization automatique int8

**2. Vector Index Manager**
- Chargement index HNSW depuis fichier
- Recherche K-nearest neighbors  
- Persistence index (sauvegarde incrémentale)
- Rebuild index si nécessaire

**3. Storage Layer**
- Abstraction MongoDB (metadata, mappings)
- Client S3 avec retry logic
- Cache LRU avec TTL configurable
- Connection pooling

**4. Search Pipeline**
- Orchestration des 3 niveaux
- Filtering et ranking
- Async/await pour parallélisation
- Configuration seuils de précision

**5. Compression Engine**
- Interface vers compresseur sémantique
- Validation longueur output (5-200 tokens)
- Mapping texte_original ↔ texte_compressé

### Démarrage de l'application
1. Charger modèle embedding en mémoire
2. Charger index vectoriel depuis fichier  
3. Initialiser connections MongoDB + S3
4. Chauffer cache avec documents populaires
5. Exposer API de recherche

### Configuration recommandée
- **Threads** : CPU cores - 1 pour search
- **RAM** : 2-4GB pour index + cache
- **Cache size** : 1000-10000 documents selon RAM
- **Batch size** : 100-1000 pour embedding génération

## Métriques de Performance

### Objectifs
- **Latence P95** : < 50ms niveau 1, < 500ms niveau 3
- **Throughput** : 1000+ queries/seconde
- **Recall@10** : > 85% pour recherche sémantique
- **Mémoire** : < 4GB pour 1M documents

### Monitoring requis
- Temps de réponse par niveau
- Hit rate du cache
- Utilisation mémoire index
- Erreurs S3/MongoDB
- Distribution des queries par niveau

## Évolution Future

### Optimisations possibles
- **Embeddings adaptatifs** : Taille selon contenu
- **Index hiérarchique** : Multi-niveau de granularité
- **Cache intelligent** : Prédiction des accès
- **Compression vectorielle** : Product quantization

### Extensions
- **Recherche multimodale** : Images + texte
- **Filtering avancé** : Temporal, géographique
- **A/B testing** : Algorithmes de ranking
- **Analytics** : Patterns de recherche utilisateurs