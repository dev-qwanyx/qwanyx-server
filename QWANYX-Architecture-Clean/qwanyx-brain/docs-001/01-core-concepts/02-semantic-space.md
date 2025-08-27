# L'Espace Sémantique 3D

## 🌌 Concept Fondamental

L'espace sémantique est un **univers tridimensionnel** où chaque concept existe comme une sphère à une position précise. La distance entre deux sphères représente leur **distance sémantique**.

## 📐 Structure de l'Espace

### Coordonnées Sémantiques
```typescript
interface SemanticPosition {
  x: number;  // Axe abstrait-concret
  y: number;  // Axe émotionnel-rationnel  
  z: number;  // Axe temporel-atemporel
}
```

### Propriétés des Sphères
```typescript
interface SemanticSphere {
  // Position dans l'espace
  position: SemanticPosition;
  
  // Propriétés physiques
  radius: number;        // Importance du concept
  mass: number;          // Poids sémantique
  density: number;       // Concentration d'information
  
  // Propriétés optiques
  material: Material;    // Type de connaissance
  transparency: number;  // Clarté du concept
  refraction: number;    // Complexité
  
  // Contenu
  concept: string;       // Caractère(s) chinois
  definition: string;    // Définition compressée
  data: {
    documentId?: string; // Lien vers MongoDB
    edges: Edge[];       // Connexions directes
    activation: number;  // Niveau d'activation actuel
  };
}
```

## 🎯 Positionnement des Concepts

### Algorithme de Positionnement

Le positionnement d'un nouveau concept suit cette logique :

```assembly
; Calculer la position d'un nouveau concept
POSITION_CALC:
    ; 1. Compresser le concept
    SEM_COMPRESS    $COMPRESSED, concept_text
    
    ; 2. Identifier les concepts liés
    FIND_RELATED    $RELATED, $COMPRESSED
    
    ; 3. Calculer le barycentre
    CALC_BARYCENTER $POSITION, $RELATED
    
    ; 4. Ajuster selon les contraintes
    AVOID_COLLISION $FINAL_POS, $POSITION
    
    ; 5. Créer la sphère
    SPHERE_CREATE   $FINAL_POS, $COMPRESSED
```

### Exemple Concret
```javascript
// Positionnement du concept "医疗保险" (assurance maladie)
const related = [
  { concept: "医疗", position: {x: 100, y: 50, z: 0}, weight: 0.6 },
  { concept: "保险", position: {x: 150, y: 20, z: 0}, weight: 0.4 }
];

// Barycentre pondéré
const position = {
  x: 100 * 0.6 + 150 * 0.4,  // = 120
  y: 50 * 0.6 + 20 * 0.4,     // = 38
  z: 0                         // = 0
};
```

## 🔦 Raytracing Sémantique

### Principe du Raytracing

Le raytracing permet de **naviguer** dans l'espace en lançant des rayons qui interagissent avec les sphères.

```typescript
interface Ray {
  origin: SemanticPosition;
  direction: Vector3;
  energy: number;
  color: string;  // Type de recherche
}

interface RayHit {
  sphere: SemanticSphere;
  distance: number;
  point: SemanticPosition;
  normal: Vector3;
  material: Material;
}
```

### Algorithme de Raytracing
```assembly
RAYTRACE:
    ; Initialiser le rayon
    RAY_INIT        $RAY, origin, direction
    
    ; Boucle de propagation
    TRACE_LOOP:
        ; Trouver l'intersection la plus proche
        FIND_NEAREST    $HIT, $RAY, all_spheres
        
        ; Si pas d'intersection, terminer
        CMP             $HIT, NULL
        JE              TRACE_END
        
        ; Interagir avec la sphère
        SPHERE_INTERACT $RAY, $HIT
        
        ; Décider : réflexion, réfraction ou absorption
        CMP             $HIT.material, 'transparent'
        JE              REFRACT
        
        CMP             $HIT.material, 'reflective'
        JE              REFLECT
        
        JMP             ABSORB
        
    REFRACT:
        CALC_REFRACTION $NEW_DIR, $RAY, $HIT
        RAY_CONTINUE    $RAY, $HIT.point, $NEW_DIR
        JMP             TRACE_LOOP
        
    REFLECT:
        CALC_REFLECTION $NEW_DIR, $RAY, $HIT
        RAY_CONTINUE    $RAY, $HIT.point, $NEW_DIR
        JMP             TRACE_LOOP
        
    ABSORB:
        ACTIVATE_SPHERE $HIT.sphere
        
    TRACE_END:
        RET             $PATH
```

## 🌊 Activation Floue

### Propagation de l'Activation

Quand une sphère est touchée par un rayon, elle s'**active** et propage cette activation à ses voisines.

```javascript
function activateFuzzy(sphere, initialActivation) {
  // Activer la sphère principale
  sphere.activation = initialActivation;
  
  // Propager aux voisines
  const neighbors = findNeighbors(sphere, radius = 50);
  
  for (const neighbor of neighbors) {
    const distance = calcDistance(sphere, neighbor);
    const decay = 1 / (1 + distance * 0.1);  // Décroissance
    neighbor.activation += initialActivation * decay;
    
    // Propagation récursive si activation suffisante
    if (neighbor.activation > 0.1) {
      activateFuzzy(neighbor, neighbor.activation * 0.5);
    }
  }
}
```

### Visualisation de l'Activation
```
    Activation: 1.0
         ⚪
        / | \
       /  |  \
    0.5  0.5  0.5
    ⚪   ⚪   ⚪
   / |   |   | \
 0.25 0.25 0.25 0.25
  ⚪  ⚪  ⚪  ⚪
```

## 🗺️ Organisation Spatiale

### Clusters Thématiques

Les concepts similaires forment naturellement des **clusters** :

```
Cluster Médical (x: 100-150, y: 40-60, z: 0-20)
├── 医疗 (médecine)
├── 医生 (médecin)
├── 医院 (hôpital)
├── 药物 (médicament)
└── 治疗 (traitement)

Cluster Financier (x: 200-250, y: 10-30, z: 0-20)
├── 金融 (finance)
├── 银行 (banque)
├── 投资 (investissement)
├── 货币 (monnaie)
└── 经济 (économie)
```

### Octree pour Performance

L'espace est divisé en **octree** pour optimiser les recherches :

```typescript
class OctreeNode {
  bounds: BoundingBox;
  spheres: SemanticSphere[];
  children: OctreeNode[8];  // 8 sous-espaces
  
  subdivide() {
    if (this.spheres.length > threshold) {
      // Diviser en 8 sous-cubes
      this.children = createOctants(this.bounds);
      // Distribuer les sphères
      distributeSpheres(this.spheres, this.children);
    }
  }
}
```

## 🎨 Matériaux et Propriétés

### Types de Matériaux

```typescript
enum Material {
  // Connaissances fondamentales - opaques
  FACT = 'fact',           // Absorbe tout
  DEFINITION = 'definition', // Absorbe et émet
  
  // Connaissances relationnelles - transparentes
  RELATION = 'glass',      // Laisse passer
  INFERENCE = 'crystal',   // Réfracte
  
  // Connaissances dynamiques - réflectives
  QUESTION = 'mirror',     // Renvoie le rayon
  HYPOTHESIS = 'metal',    // Réflexion partielle
  
  // Connaissances émotionnelles - luminescentes
  EMOTION = 'glow',        // Émet de la lumière
  OPINION = 'phosphor'     // Brille dans le noir
}
```

### Interactions Rayon-Matériau

```assembly
; Comportement selon le matériau
MATERIAL_INTERACT:
    CMP     $MATERIAL, 'fact'
    JE      FULL_ABSORB      ; Arrêt complet
    
    CMP     $MATERIAL, 'glass'
    JE      PASS_THROUGH     ; Continue tout droit
    
    CMP     $MATERIAL, 'crystal'
    JE      REFRACT_PATH     ; Change de direction
    
    CMP     $MATERIAL, 'mirror'
    JE      REFLECT_BACK     ; Rebondit
    
    CMP     $MATERIAL, 'glow'
    JE      EMIT_NEW_RAYS    ; Crée de nouveaux rayons
```

## 🌐 Navigation dans l'Espace

### Interface de Navigation

```typescript
interface Navigator {
  // Position actuelle
  position: SemanticPosition;
  camera: Camera;
  
  // Méthodes de navigation
  moveTo(target: SemanticPosition): void;
  lookAt(sphere: SemanticSphere): void;
  search(pattern: string): SemanticSphere[];
  trace(from: SemanticSphere, to: SemanticSphere): Path;
  
  // Exploration
  exploreRadius(radius: number): SemanticSphere[];
  followEdge(edge: Edge): void;
  activateRegion(center: SemanticPosition, radius: number): void;
}
```

### Modes de Navigation

1. **Navigation Libre** : Déplacement libre dans l'espace
2. **Navigation Guidée** : Suivre des chemins prédéfinis
3. **Navigation par Edges** : Sauter de concept en concept
4. **Navigation par Raytracing** : Suivre un rayon de recherche

## 📊 Métriques Spatiales

### Distance Sémantique
```typescript
function semanticDistance(a: SemanticSphere, b: SemanticSphere): number {
  // Distance euclidienne de base
  const spatial = Math.sqrt(
    Math.pow(a.position.x - b.position.x, 2) +
    Math.pow(a.position.y - b.position.y, 2) +
    Math.pow(a.position.z - b.position.z, 2)
  );
  
  // Ajustement par les propriétés
  const materialFactor = getMaterialCompatibility(a.material, b.material);
  const massFactor = 1 / (1 + Math.abs(a.mass - b.mass));
  
  return spatial * materialFactor * massFactor;
}
```

### Densité Locale
```typescript
function localDensity(position: SemanticPosition, radius: number): number {
  const spheres = findInRadius(position, radius);
  const volume = (4/3) * Math.PI * Math.pow(radius, 3);
  return spheres.length / volume;
}
```

## 🔄 Évolution de l'Espace

### Apprentissage Spatial

L'espace **évolue** avec l'usage :

```assembly
; Mise à jour après utilisation
SPACE_LEARN:
    ; Si deux sphères sont souvent activées ensemble
    CHECK_COACTIVATION  $SPHERE_A, $SPHERE_B
    CMP                 $COACTIVATION_COUNT, threshold
    JG                  CREATE_EDGE
    
    ; Si une région est très dense
    CHECK_DENSITY       $REGION
    CMP                 $DENSITY, max_density
    JG                  SUBDIVIDE_REGION
    
    ; Si un chemin est souvent emprunté
    CHECK_PATH_USAGE    $PATH
    CMP                 $USAGE, high_usage
    JG                  OPTIMIZE_PATH
```

### Optimisation Continue
```javascript
// Réorganisation périodique
function optimizeSpace() {
  // Regrouper les concepts co-activés
  const clusters = identifyClusters();
  
  for (const cluster of clusters) {
    // Rapprocher les sphères du cluster
    tightenCluster(cluster);
    
    // Créer des shortcuts
    createShortcuts(cluster);
  }
  
  // Nettoyer les zones peu utilisées
  pruneUnusedRegions();
}
```

## 🎯 Applications Pratiques

### Recherche Sémantique
```assembly
; Trouver des concepts liés
SEMANTIC_SEARCH:
    SPHERE_FIND     $START, search_term
    ACTIVATE_FUZZY  $START, 1.0
    COLLECT_ACTIVE  $RESULTS, threshold=0.3
    SORT_BY_ACTIVATION $RESULTS
    RET             $RESULTS
```

### Analyse de Similarité
```assembly
; Comparer deux documents
SIMILARITY_ANALYSIS:
    DOC_COMPRESS    $DOC1_COMPRESSED, document1
    DOC_COMPRESS    $DOC2_COMPRESSED, document2
    SPHERE_FIND     $SPHERE1, $DOC1_COMPRESSED
    SPHERE_FIND     $SPHERE2, $DOC2_COMPRESSED
    CALC_DISTANCE   $DISTANCE, $SPHERE1, $SPHERE2
    RET             $DISTANCE
```

### Découverte de Patterns
```assembly
; Identifier des patterns dans l'espace
PATTERN_DISCOVERY:
    SCAN_SPACE      $ALL_SPHERES
    CLUSTER_DETECT  $CLUSTERS, $ALL_SPHERES
    
    FOR_EACH $CLUSTER IN $CLUSTERS:
        ANALYZE_CLUSTER $PATTERN, $CLUSTER
        IF_INTERESTING  $PATTERN:
            REPORT      $PATTERN
```

---

*L'espace sémantique transforme l'information abstraite en géographie navigable.*

→ Suivant : [Compression Sémantique](./03-semantic-compression.md)