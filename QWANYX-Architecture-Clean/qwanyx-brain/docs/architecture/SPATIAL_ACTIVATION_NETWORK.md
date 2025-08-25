# Spatial Activation Network - Réseau d'Activation Spatiale

## 🎯 Concept Fondamental

Chaque mot/concept active des sphères dans l'espace 3D. L'activation se propage avec un **falloff** (atténuation) créant des zones d'influence floues qui se chevauchent et s'additionnent.

```javascript
// Phrase : "Le chien mange dans son bol"
// Chaque mot ALLUME plusieurs sphères dans différents contextes
// Les activations se PROPAGENT et FUSIONNENT
// Le contexte le plus activé ÉMERGE naturellement
```

## 🔮 Sphères Multi-Contextuelles

### Un Concept = Plusieurs Positions

```javascript
// BOL existe simultanément dans plusieurs contextes
const bol_spheres = [
  {
    id: "bol_animal",
    position: [2, 0, -1],        // Près de "chien"
    radius: 3.0,
    context: "animal_feeding",
    base_activation: 1.0
  },
  {
    id: "bol_cuisine",
    position: [150, 20, 10],     // Zone cuisine
    radius: 4.0,
    context: "cooking",
    base_activation: 1.0
  },
  {
    id: "bol_ceramique",
    position: [-80, 100, 50],    // Zone matériaux
    radius: 2.5,
    context: "material",
    base_activation: 1.0
  },
  {
    id: "bol_contenant",
    position: [200, -50, 30],    // Zone objets
    radius: 3.5,
    context: "container",
    base_activation: 1.0
  }
]
```

## 🌊 Mécanisme d'Activation Floue

### Configuration du Falloff

```javascript
class FuzzyActivation {
  constructor(config = {}) {
    // Zone centrale d'activation maximale
    this.offset = config.offset || 1.0      // Rayon du noyau 100%
    
    // Rayon total d'influence
    this.radius = config.radius || 5.0      // Distance max d'influence
    
    // Type de courbe d'atténuation
    this.falloff = config.falloff || 'gaussian'
    
    // Intensité de base
    this.intensity = config.intensity || 1.0
  }
  
  // Calcul de l'activation en fonction de la distance
  getActivation(distance) {
    // Zone centrale : activation maximale
    if (distance <= this.offset) {
      return this.intensity
    }
    
    // Au-delà du rayon : pas d'activation
    if (distance >= this.radius) {
      return 0.0
    }
    
    // Zone de transition floue
    const normalized = (distance - this.offset) / (this.radius - this.offset)
    
    switch(this.falloff) {
      case 'linear':
        // Décroissance linéaire
        return this.intensity * (1 - normalized)
        
      case 'squared':
        // Décroissance quadratique (plus rapide)
        return this.intensity * Math.pow(1 - normalized, 2)
        
      case 'cubic':
        // Décroissance cubique (encore plus rapide)
        return this.intensity * Math.pow(1 - normalized, 3)
        
      case 'gaussian':
        // Courbe gaussienne (naturelle)
        return this.intensity * Math.exp(-Math.pow(normalized * 3, 2))
        
      case 'inverse':
        // Inverse quadratique (longue portée)
        return this.intensity / (1 + Math.pow(normalized * 3, 2))
        
      case 'cosine':
        // Transition douce en cosinus
        return this.intensity * 0.5 * (1 + Math.cos(Math.PI * normalized))
        
      default:
        return this.intensity * (1 - normalized)
    }
  }
}
```

### Visualisation des Courbes de Falloff

```
Activation
1.0 |●←─ offset ─→|←─── zone floue ───→|
    |████████████░░░░░░░░░░░░░░░░░░░░░░| linear
    |████████████▓▓▓▓▓░░░░░░░░░░░░░░░░| squared
    |████████████▓▓▓▓▓▓▓▓░░░░░░░░░░░░░| gaussian
    |████████████▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░| inverse
0.0 |────────────────────────────────────→ Distance
    0            offset            radius
```

## ⚡ Système de Propagation

### Activation d'une Phrase Complète

```javascript
class SpatialActivationNetwork {
  constructor(octree) {
    this.octree = octree              // Structure spatiale
    this.activations = new Map()      // ID → niveau d'activation
    this.activeZones = []             // Zones fortement activées
  }
  
  // Activer une phrase complète
  activatePhrase(phrase) {
    // Réinitialiser les activations
    this.activations.clear()
    
    // Tokeniser la phrase
    const words = tokenize(phrase)
    
    // ÉTAPE 1 : Activation initiale de chaque mot
    for (const word of words) {
      this.activateWord(word)
    }
    
    // ÉTAPE 2 : Propagation des activations
    this.propagate()
    
    // ÉTAPE 3 : Identifier les zones chaudes
    this.identifyHotZones()
    
    // ÉTAPE 4 : Résoudre les ambiguïtés par contexte
    return this.resolveContext()
  }
  
  // Activer toutes les sphères d'un mot
  activateWord(word) {
    // Récupérer toutes les sphères pour ce mot
    const spheres = this.getSpheres(word)
    
    for (const sphere of spheres) {
      // Activation de la sphère elle-même
      this.addActivation(sphere.id, sphere.base_activation)
      
      // Configuration du falloff pour cette sphère
      const falloff = new FuzzyActivation({
        offset: sphere.offset || 1.0,
        radius: sphere.radius || 5.0,
        falloff: sphere.falloff_type || 'gaussian',
        intensity: sphere.base_activation
      })
      
      // Trouver tous les voisins dans le rayon d'influence
      const neighbors = this.octree.queryRadius(
        sphere.position,
        sphere.radius
      )
      
      // Propager l'activation aux voisins
      for (const neighbor of neighbors) {
        const distance = this.distance(sphere.position, neighbor.position)
        const activation = falloff.getActivation(distance)
        
        if (activation > 0.01) {  // Seuil minimal
          this.addActivation(neighbor.id, activation)
        }
      }
    }
  }
  
  // Ajouter de l'activation (accumulative)
  addActivation(sphereId, amount) {
    const current = this.activations.get(sphereId) || 0
    this.activations.set(sphereId, current + amount)
  }
  
  // Propagation itérative (comme une onde)
  propagate(iterations = 3) {
    for (let i = 0; i < iterations; i++) {
      const newActivations = new Map()
      
      // Pour chaque sphère active
      for (const [sphereId, activation] of this.activations) {
        if (activation < 0.1) continue  // Ignorer les faibles
        
        const sphere = this.octree.get(sphereId)
        const neighbors = this.octree.queryRadius(
          sphere.position,
          sphere.radius * 0.5  // Propagation réduite
        )
        
        // Propager aux voisins
        for (const neighbor of neighbors) {
          const distance = this.distance(sphere.position, neighbor.position)
          const propagated = activation * 0.3 * (1 - distance / sphere.radius)
          
          const current = newActivations.get(neighbor.id) || 0
          newActivations.set(neighbor.id, current + propagated)
        }
      }
      
      // Fusionner les nouvelles activations
      for (const [id, activation] of newActivations) {
        this.addActivation(id, activation * 0.5)  // Atténuation
      }
    }
  }
  
  // Identifier les zones fortement activées
  identifyHotZones() {
    this.activeZones = []
    const processed = new Set()
    
    // Trier par activation décroissante
    const sorted = Array.from(this.activations.entries())
      .sort((a, b) => b[1] - a[1])
    
    for (const [sphereId, activation] of sorted) {
      if (processed.has(sphereId)) continue
      if (activation < 0.5) break  // Seuil minimal pour une zone
      
      // Créer une nouvelle zone
      const zone = {
        center: this.octree.get(sphereId).position,
        total_activation: activation,
        spheres: [sphereId],
        concepts: []
      }
      
      // Agréger les sphères proches
      const sphere = this.octree.get(sphereId)
      const nearby = this.octree.queryRadius(sphere.position, 10)
      
      for (const neighbor of nearby) {
        const neighborActivation = this.activations.get(neighbor.id) || 0
        if (neighborActivation > 0.3) {
          zone.spheres.push(neighbor.id)
          zone.total_activation += neighborActivation
          zone.concepts.push(neighbor.concept)
          processed.add(neighbor.id)
        }
      }
      
      this.activeZones.push(zone)
    }
    
    return this.activeZones
  }
}
```

## 🎯 Exemple Concret

### Phrase : "Le chien mange dans son bol"

```javascript
// Configuration initiale
const network = new SpatialActivationNetwork(octree)

// Activation de la phrase
const result = network.activatePhrase("Le chien mange dans son bol")

// RÉSULTAT : Carte d'activation
{
  // Zone 1 : CONTEXTE ANIMAL (Fortement activée)
  zone_animal: {
    center: [1, 0, -0.5],
    total_activation: 4.2,
    concepts: ["chien", "bol_animal", "mange", "domestique"],
    spheres: [
      { id: "chien_001", activation: 1.0 },
      { id: "bol_animal", activation: 1.0 },
      { id: "mange_001", activation: 0.9 },
      { id: "domestique", activation: 0.7 },
      { id: "fidèle", activation: 0.4 },
      { id: "poil", activation: 0.2 }
    ]
  },
  
  // Zone 2 : CONTEXTE CUISINE (Moyennement activée)
  zone_cuisine: {
    center: [150, 20, 5],
    total_activation: 1.8,
    concepts: ["mange", "bol_cuisine", "nourriture"],
    spheres: [
      { id: "mange_002", activation: 0.8 },
      { id: "bol_cuisine", activation: 0.6 },
      { id: "cuisine", activation: 0.4 }
    ]
  },
  
  // Zone 3 : CONTEXTE MATÉRIAU (Faiblement activée)
  zone_materiau: {
    center: [-80, 100, 50],
    total_activation: 0.3,
    concepts: ["bol_ceramique"],
    spheres: [
      { id: "bol_ceramique", activation: 0.3 }
    ]
  }
}

// INTERPRÉTATION : Le contexte ANIMAL domine
// → Le système comprend qu'il s'agit du bol du chien
```

## 🌈 Visualisation 3D

```javascript
class ActivationRenderer {
  render(network) {
    // Pour chaque sphère active
    for (const [sphereId, activation] of network.activations) {
      const sphere = octree.get(sphereId)
      
      // Couleur selon l'activation
      const color = {
        r: activation * 255,           // Rouge = très actif
        g: (1 - activation) * 100,     // Un peu de vert
        b: 50,                          // Bleu constant
        a: Math.max(0.1, activation)   // Transparence
      }
      
      // Taille selon l'activation
      const displayRadius = sphere.radius * (1 + activation)
      
      // Effet de glow pour les zones chaudes
      if (activation > 0.7) {
        this.addGlow(sphere.position, displayRadius, color)
      }
      
      // Dessiner la sphère
      this.drawSphere(sphere.position, displayRadius, color)
    }
    
    // Dessiner les connexions entre zones actives
    for (const zone of network.activeZones) {
      this.drawZoneConnections(zone)
    }
  }
}
```

## 🔧 Paramètres de Configuration

```javascript
const activationProfiles = {
  // Recherche précise
  precise: {
    offset: 0.5,         // Petit noyau
    radius: 2.0,         // Portée courte
    falloff: 'squared',  // Chute rapide
    threshold: 0.7       // Seuil élevé
  },
  
  // Recherche associative
  associative: {
    offset: 2.0,         // Grand noyau
    radius: 8.0,         // Portée longue
    falloff: 'gaussian', // Chute naturelle
    threshold: 0.3       // Seuil bas
  },
  
  // Recherche exploratoire
  exploratory: {
    offset: 1.0,
    radius: 15.0,        // Très longue portée
    falloff: 'inverse',  // Décroissance lente
    threshold: 0.1       // Très permissif
  },
  
  // Recherche contextuelle
  contextual: {
    offset: 1.5,
    radius: 5.0,
    falloff: 'cosine',   // Transition douce
    threshold: 0.5,
    propagation: true,   // Active la propagation
    iterations: 5        // Plus d'itérations
  }
}
```

## 💡 Avantages du Système

1. **Résolution Automatique d'Ambiguïtés**
   - Le contexte le plus activé l'emporte naturellement
   - Pas besoin de règles explicites

2. **Apprentissage Implicite**
   - Les associations fréquentes renforcent les connexions
   - Le réseau s'adapte à l'usage

3. **Visualisation Intuitive**
   - On peut VOIR les zones s'illuminer
   - Navigation 3D dans les activations

4. **Performance**
   - Calculs parallélisables (GPU)
   - Cache spatial avec l'octree
   - Seuils pour limiter la propagation

5. **Flexibilité**
   - Différents profils de falloff
   - Paramètres ajustables par contexte
   - Extension facile avec nouveaux types

## 🚀 Conclusion

C'est un **réseau de neurones spatial navigable** où :
- Les mots allument des sphères
- L'activation se propage dans l'espace
- Les zones les plus "chaudes" révèlent le contexte
- On peut VOIR la pensée s'illuminer en 3D !

Le cerveau devient littéralement un **espace lumineux** où les idées s'allument et se propagent !