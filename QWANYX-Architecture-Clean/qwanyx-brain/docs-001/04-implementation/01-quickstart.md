# Guide de Démarrage Rapide - SPU

## 🚀 Installation en 5 Minutes

### Prérequis
- Node.js 18+
- MongoDB 6.0+
- Python 3.10+ (pour les nano-LLMs)
- Clés API pour GPT-4o et Claude-3

### Installation

```bash
# 1. Cloner le repository
git clone https://github.com/qwanyx/brain-spu.git
cd brain-spu

# 2. Installer les dépendances
npm install
pip install -r requirements.txt

# 3. Configuration
cp .env.example .env
# Éditer .env avec vos clés API

# 4. Initialiser la base de données
npm run db:init

# 5. Démarrer le SPU
npm run spu:start
```

## 🎯 Premier Programme SPU

### Hello World Sémantique

```assembly
; hello_world.spu
; Mon premier programme SPU

.text
.global main

main:
    ; Charger un texte
    TEXT_LOAD       $INPUT, "Bonjour, je découvre le SPU!"
    
    ; Compresser sémantiquement
    SEM_COMPRESS    $COMPRESSED, $INPUT
    
    ; Afficher le résultat
    PRINT           "Original:", $INPUT
    PRINT           "Compressé:", $COMPRESSED
    
    ; Analyser le sentiment
    LLM_EXEC        $SENTIMENT, 'sentiment-nano', $COMPRESSED
    PRINT           "Sentiment:", $SENTIMENT
    
    RET
```

### Exécution

```bash
spu run hello_world.spu
```

Sortie attendue :
```
Original: Bonjour, je découvre le SPU!
Compressé: 问候学新
Sentiment: POSITIVE
```

## 📧 Analyser un Email

### Programme d'Analyse

```assembly
; email_analyzer.spu
; Analyse basique d'un email

.text
.global analyze_email

analyze_email:
    ; Charger l'email
    DOC_LOAD        $EMAIL, "emails/test.json"
    
    ; Compresser
    SEM_COMPRESS    $BODY_COMP, $EMAIL.body
    
    ; Analyses parallèles
    PARALLEL_START
        LLM_EXEC    $URGENCY, 'urgency-nano', $BODY_COMP
        LLM_EXEC    $CATEGORY, 'classifier-nano', $BODY_COMP
    PARALLEL_END
    
    ; Afficher les résultats
    PRINT           "Urgence:", $URGENCY
    PRINT           "Catégorie:", $CATEGORY
    
    ; Router selon l'urgence
    CMP             $URGENCY, 'HIGH'
    JGE             urgent_handler
    JMP             normal_handler
    
urgent_handler:
    PRINT           "⚠️ EMAIL URGENT DÉTECTÉ!"
    NOTIFY          'manager@company.com', $EMAIL
    RET
    
normal_handler:
    PRINT           "Email normal, ajouté à la queue"
    QUEUE_ADD       'INBOX', $EMAIL
    RET
```

### Format de l'Email

```json
{
  "id": "email_001",
  "from": "client@example.com",
  "subject": "Problème urgent avec la commande",
  "body": "Bonjour, ma commande n'est toujours pas arrivée après 2 semaines. C'est très urgent car j'en ai besoin pour demain. Merci de faire le nécessaire rapidement.",
  "timestamp": "2024-12-20T10:30:00Z"
}
```

## 🔍 Recherche Sémantique

### Configuration de l'Espace

```javascript
// config/semantic-space.js
module.exports = {
  space: {
    dimensions: { x: 1000, y: 1000, z: 1000 },
    octreeDepth: 8,
    defaultRadius: 5
  },
  
  chinese: {
    totalCharacters: 100000,
    primitives: 5000,
    compounds: 95000
  },
  
  raytracing: {
    maxBounces: 5,
    energyDecay: 0.1,
    defaultRays: 26
  }
};
```

### Programme de Recherche

```assembly
; search.spu
; Recherche dans l'espace sémantique

.text
.global search

search:
    ; Obtenir la requête
    INPUT           $QUERY, "Trouvez tous les emails urgents sur les projets"
    
    ; Compresser la requête
    SEM_COMPRESS    $Q_COMP, $QUERY
    
    ; Trouver le point de départ
    SPHERE_NEAREST  $START, $Q_COMP
    
    ; Raytracing
    RAYTRACE        $PATHS, $START, distance=100
    
    ; Activer les sphères trouvées
    FOR_EACH        $PATH IN $PATHS:
        ACTIVATE_FUZZY $PATH.end, 0.8
    END_FOR
    
    ; Collecter les résultats
    COLLECT_ACTIVE  $RESULTS, threshold=0.3
    
    ; Afficher
    PRINT           "Trouvé", $RESULTS.count, "résultats"
    
    FOR_EACH        $R IN $RESULTS:
        PRINT       "- ", $R.concept, "(score:", $R.activation, ")"
    END_FOR
    
    RET
```

## 🧠 Utilisation des Nano-LLMs

### Créer un Nano-LLM

```python
# nano_llms/urgency_detector.py
from spu import NanoLLM

class UrgencyDetector(NanoLLM):
    def __init__(self):
        super().__init__(
            name="urgency-nano",
            model_size="124M",
            specialization="urgency_detection"
        )
    
    def process(self, compressed_text):
        # Analyse ultra-rapide (< 10ms)
        urgency_chars = ['急', '紧', '速', '危']
        
        score = sum(1 for char in compressed_text 
                   if char in urgency_chars)
        
        if score >= 2:
            return "CRITICAL"
        elif score == 1:
            return "HIGH"
        else:
            return "NORMAL"
```

### Utilisation dans SPU

```assembly
; Utiliser le nano-LLM personnalisé
LLM_EXEC        $URGENCY, 'urgency-nano', $COMPRESSED_TEXT
```

## 📊 Visualisation 3D

### Configuration Three.js

```javascript
// visualizer/space-viewer.js
import * as THREE from 'three';

class SemanticSpaceViewer {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 
      window.innerWidth / window.innerHeight, 0.1, 10000);
    
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  addSphere(concept) {
    const geometry = new THREE.SphereGeometry(concept.radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: this.getColorForCategory(concept.category),
      transparent: true,
      opacity: concept.activation || 0.7
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(concept.x, concept.y, concept.z);
    
    this.scene.add(sphere);
  }
  
  renderRaytrace(ray) {
    const geometry = new THREE.BufferGeometry().setFromPoints(ray.path);
    const material = new THREE.LineBasicMaterial({
      color: 0xff0000,
      opacity: ray.energy,
      transparent: true
    });
    
    const line = new THREE.Line(geometry, material);
    this.scene.add(line);
  }
}
```

## 🔧 Configuration Avancée

### .env Configuration

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/spu
MONGODB_DB=semantic_space

# S3 (pour les blobs)
S3_BUCKET=spu-documents
S3_REGION=us-east-1
S3_ACCESS_KEY=your_key
S3_SECRET_KEY=your_secret

# LLMs
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Nano-LLMs
NANO_LLM_PATH=/opt/nano-llms
NANO_LLM_CACHE=/tmp/nano-cache

# SPU Configuration
SPU_CACHE_SIZE=1GB
SPU_MAX_PARALLEL=10
SPU_DEFAULT_TIMEOUT=30000
```

### Configuration SPU

```yaml
# config/spu.yaml
processor:
  cores: 8
  cache_levels:
    L1: 32MB
    L2: 256MB
    L3: 1GB
  
  parallel_execution:
    max_threads: 16
    max_llm_concurrent: 10
    
semantic_space:
  dimensions: [1000, 1000, 1000]
  octree_depth: 8
  max_spheres: 1000000
  
compression:
  target_ratio: 1000
  max_output_chars: 1000
  preserve_entities: true
  
llm_orchestration:
  timeout: 30000
  retry_count: 3
  fallback_chain:
    - gpt-4o
    - claude-3
    - local-llama
```

## 🚦 Commandes Utiles

### CLI SPU

```bash
# Exécuter un programme
spu run program.spu

# Mode interactif
spu repl

# Compiler vers bytecode
spu compile program.spu -o program.spub

# Visualiser l'espace
spu visualize --port 3000

# Benchmark
spu benchmark emails --count 1000

# Stats de l'espace
spu stats

# Nettoyer le cache
spu cache clear
```

### REPL Interactif

```
$ spu repl
SPU v1.0.0 - Semantic Processor Unit
> TEXT_LOAD $T, "Hello world"
> SEM_COMPRESS $C, $T
> PRINT $C
你好界
> LLM_EXEC $S, 'sentiment-nano', $C
> PRINT $S
POSITIVE
> exit
```

## 📈 Monitoring

### Métriques Disponibles

```javascript
// Accès aux métriques
const metrics = spu.getMetrics();

console.log({
  totalSpheres: metrics.space.sphereCount,
  cacheHitRate: metrics.cache.hitRate,
  avgCompressionRatio: metrics.compression.avgRatio,
  llmLatency: metrics.llm.avgLatency,
  searchSpeed: metrics.search.avgTime
});
```

### Dashboard

```bash
# Lancer le dashboard
npm run dashboard

# Accéder à http://localhost:4000
```

## 🎓 Prochaines Étapes

1. **Explorer les exemples** : `/examples/`
2. **Lire la documentation complète** : [Architecture](../02-architecture/)
3. **Créer vos nano-LLMs** : [Guide Nano-LLMs](./04-llm-setup.md)
4. **Construire des langages domaine** : [Langages SPU](../03-languages/)

## 🆘 Dépannage

### Erreurs Communes

**"Cannot connect to MongoDB"**
```bash
# Vérifier que MongoDB tourne
sudo systemctl status mongod
# ou
brew services list | grep mongodb
```

**"LLM timeout"**
```assembly
; Augmenter le timeout
LLM_EXEC $RESULT, 'model', $DATA, timeout=60000
```

**"Out of memory"**
```bash
# Augmenter la heap size
NODE_OPTIONS=--max-old-space-size=4096 npm run spu:start
```

---

*Vous êtes maintenant prêt à explorer le monde de la navigation sémantique !*

→ Suivant : [Configuration du système](./02-configuration.md)