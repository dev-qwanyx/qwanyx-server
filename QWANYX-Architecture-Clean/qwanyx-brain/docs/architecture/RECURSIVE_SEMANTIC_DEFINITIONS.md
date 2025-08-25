# Recursive Semantic Definitions - Définitions Sémantiques Récursives

## 🎯 Le Concept : Un Dictionnaire Auto-Référentiel

Chaque caractère chinois est défini UNIQUEMENT par d'autres caractères chinois, créant un système fermé et complet où le sens émerge des relations.

## 🌀 Architecture du Système

### 1. Primitives Fondamentales (Axiomes)

~100 caractères de base qui n'ont PAS de définition (les atomes du système) :

```javascript
const PRIMITIVES = {
  // Existence
  '一': null,  // un (unité fondamentale)
  '无': null,  // néant (absence)
  '有': null,  // existence (présence)
  
  // Espace
  '上': null,  // haut
  '下': null,  // bas
  '中': null,  // centre
  '内': null,  // intérieur
  '外': null,  // extérieur
  
  // Temps
  '前': null,  // avant
  '后': null,  // après
  '今': null,  // maintenant
  
  // Qualités
  '大': null,  // grand
  '小': null,  // petit
  '多': null,  // beaucoup
  '少': null,  // peu
  
  // Actions de base
  '动': null,  // bouger
  '静': null,  // immobile
  '生': null,  // naître/vivre
  '死': null,  // mourir
}
```

### 2. Définitions de Niveau 1 (Composés des Primitives)

```javascript
const LEVEL_1 = {
  // Utilise UNIQUEMENT les primitives
  '二': ['一', '一'],           // deux = un + un
  '三': ['二', '一'],           // trois = deux + un
  '人': ['生', '动'],           // humain = vivant + mobile
  '天': ['上', '大'],           // ciel = haut + grand
  '地': ['下', '大'],           // terre = bas + grand
  '水': ['动', '下'],           // eau = mobile + bas (coule)
  '火': ['动', '上'],           // feu = mobile + haut (monte)
  '心': ['内', '生'],           // cœur = intérieur + vie
  '手': ['人', '动'],           // main = humain + action
  '口': ['人', '内', '外'],     // bouche = humain + dedans/dehors
}
```

### 3. Définitions de Niveau 2 (Utilise Niveau 1)

```javascript
const LEVEL_2 = {
  '日': ['天', '火', '一'],      // soleil = ciel + feu + un
  '月': ['天', '水', '一'],      // lune = ciel + eau + un
  '山': ['地', '上', '大'],      // montagne = terre + haut + grand
  '川': ['水', '动', '地'],      // rivière = eau + mouvement + terre
  '木': ['生', '上', '地'],      // arbre = vie + monter + terre
  '目': ['人', '外', '内'],      // œil = humain + voir dehors/dedans
  '耳': ['人', '外', '心'],      // oreille = humain + extérieur + perception
  '言': ['口', '心', '外'],      // parole = bouche + cœur + extérieur
}
```

### 4. Définitions Complexes (Niveau N)

```javascript
const COMPLEX_DEFINITIONS = {
  // Émotions (utilise cœur + autres)
  '爱': ['心', '给', '抱'],      // amour = cœur + donner + embrasser
  '恨': ['心', '无', '爱'],      // haine = cœur + sans + amour
  '喜': ['心', '上', '光'],      // joie = cœur + monter + lumière
  '怒': ['心', '火', '大'],      // colère = cœur + feu + grand
  '哀': ['心', '下', '水'],      // tristesse = cœur + descendre + eau
  '惧': ['心', '小', '暗'],      // peur = cœur + petit + sombre
  
  // Actions complexes
  '走': ['人', '动', '地'],      // marcher = humain + bouger + terre
  '跑': ['走', '快', '急'],      // courir = marcher + rapide + urgent
  '飞': ['动', '上', '天'],      // voler = bouger + haut + ciel
  '游': ['动', '水', '中'],      // nager = bouger + eau + dedans
  
  // Concepts abstraits
  '思': ['心', '头', '内'],      // penser = cœur + tête + intérieur
  '想': ['心', '目', '向'],      // imaginer = cœur + œil + direction
  '知': ['言', '心', '实'],      // savoir = parole + cœur + réel
  '智': ['知', '日', '心'],      // sagesse = savoir + soleil + cœur
  '理': ['玉', '里', '正'],      // raison = jade + intérieur + correct
  
  // Relations
  '友': ['人', '人', '心'],      // ami = humain + humain + cœur
  '敌': ['人', '反', '心'],      // ennemi = humain + opposé + cœur
  '父': ['人', '上', '家'],      // père = humain + au-dessus + famille
  '母': ['人', '生', '爱'],      // mère = humain + donner vie + amour
  '子': ['人', '小', '生'],      // enfant = humain + petit + né
}
```

## 🔄 Mécanisme de Compression/Décompression

### Compression : Texte → Définition

```javascript
class SemanticCompressor {
  compress(text) {
    // 1. Identifier les concepts clés
    const concepts = extractConcepts(text)
    // "J'aime la nature" → ["amour", "nature"]
    
    // 2. Mapper vers les caractères
    const chars = concepts.map(c => this.conceptToChar(c))
    // ["amour", "nature"] → ['爱', '自然']
    
    // 3. Décomposer '自然' en définition si complexe
    const compressed = []
    chars.forEach(char => {
      if (this.isComplex(char)) {
        // '自然' → ['自', '然'] → [['自', '己'], ['火', '然']]
        compressed.push(this.getDefinition(char))
      } else {
        compressed.push(char)
      }
    })
    
    return compressed  // Définition minimale
  }
  
  getDefinition(char) {
    // Récursif jusqu'aux primitives
    const def = this.definitions[char]
    
    if (!def) return char  // Primitive
    
    // Si la définition contient des non-primitives, décomposer
    return def.map(c => 
      this.isPrimitive(c) ? c : this.getDefinition(c)
    )
  }
}
```

### Décompression : Définition → Sens

```javascript
class SemanticDecompressor {
  decompress(definition) {
    // Reconstruction récursive
    return definition.map(element => {
      if (Array.isArray(element)) {
        // C'est une définition composée
        return this.reconstruct(element)
      } else {
        // C'est un caractère simple
        return this.getBasicMeaning(element)
      }
    })
  }
  
  reconstruct(definition) {
    // Combiner les sens des composants
    const components = definition.map(d => this.decompress([d]))
    
    // Fusion sémantique
    return this.semanticMerge(components)
  }
  
  semanticMerge(components) {
    // Intelligence ici : comment combiner les sens
    // '心' + '给' + '抱' → sentiment de donner et embrasser → amour
    
    // Utiliser les poids et relations
    const merged = {
      core: components[0],     // Premier = concept principal
      modifiers: components.slice(1),  // Reste = modificateurs
      
      // Calculer le sens émergent
      meaning: this.emergentMeaning(components)
    }
    
    return merged
  }
}
```

## 📊 Structure de Données

### Format de Stockage

```javascript
const SEMANTIC_DICTIONARY = {
  // Version et métadonnées
  version: "1.0",
  total_characters: 20976,
  primitive_count: 100,
  
  // Les définitions
  definitions: {
    // Caractère : [définition, poids]
    '爱': {
      def: ['心', '给', '抱'],
      weights: [0.5, 0.3, 0.2],  // Importance relative
      level: 3,  // Niveau de récursion
      frequency: 0.92  // Fréquence d'usage
    },
    
    '恨': {
      def: ['心', '无', '爱'],
      weights: [0.4, 0.3, 0.3],
      level: 4,  // Utilise '爱' qui est niveau 3
      frequency: 0.45
    },
    
    // ... 20k+ définitions
  },
  
  // Graphe de dépendances
  dependencies: {
    '爱': ['心', '给', '抱'],  // '爱' dépend de ces 3
    '恨': ['心', '无', '爱'],   // '恨' dépend de '爱'
    // ...
  },
  
  // Index inversé (pour recherche rapide)
  reverse_index: {
    '心': ['爱', '恨', '喜', '怒', '哀', '惧', ...],  // Tous ceux qui utilisent '心'
    '水': ['川', '海', '河', '湖', '泪', ...],
    // ...
  }
}
```

## 🎯 Avantages du Système

### 1. Position Automatique par Définition

```javascript
function calculatePositionFromDefinition(char) {
  const definition = SEMANTIC_DICTIONARY.definitions[char]
  
  if (!definition) {
    // Primitive → position fixe prédéfinie
    return PRIMITIVE_POSITIONS[char]
  }
  
  // Position = barycentre pondéré de sa définition !
  const positions = definition.def.map(c => getPosition(c))
  const weights = definition.weights
  
  let x = 0, y = 0, z = 0
  positions.forEach((pos, i) => {
    x += pos.x * weights[i]
    y += pos.y * weights[i]
    z += pos.z * weights[i]
  })
  
  return { x, y, z }
}

// RÉSULTAT : Les caractères similaires ont des définitions similaires
// → Positions proches dans l'espace !
```

### 2. Recherche Sémantique Profonde

```javascript
function deepSemanticSearch(query) {
  // Décomposer la requête en primitives
  const primitives = decomposeToprimitives(query)
  
  // Trouver tous les caractères qui utilisent ces primitives
  const candidates = []
  
  Object.entries(SEMANTIC_DICTIONARY.definitions).forEach(([char, def]) => {
    const charPrimitives = decomposeToprimitives(char)
    const overlap = intersection(primitives, charPrimitives)
    
    if (overlap.length > 0) {
      candidates.push({
        character: char,
        relevance: overlap.length / primitives.length,
        definition: def
      })
    }
  })
  
  return candidates.sort((a, b) => b.relevance - a.relevance)
}
```

### 3. Compression Contextuelle

```javascript
class ContextualCompression {
  compressWithContext(text, context) {
    // La même phrase peut avoir différentes compressions !
    
    if (context === 'emotional') {
      // Privilégier les définitions émotionnelles
      return this.compressEmotional(text)
    } else if (context === 'logical') {
      // Privilégier les définitions logiques
      return this.compressLogical(text)
    } else if (context === 'poetic') {
      // Utiliser des définitions imagées
      return this.compressPoetic(text)
    }
  }
  
  compressEmotional(text) {
    // "Je t'aime" → ['心', '给', '你']  (cœur + donner + toi)
    // Plus direct, plus émotionnel
  }
  
  compressLogical(text) {
    // "Je t'aime" → ['我', '有', '爱', '向', '你']  
    // (je + avoir + amour + vers + toi)
    // Plus précis, plus analytique
  }
}
```

## 🌟 Exemples Concrets

### Email : "Réunion urgente demain matin"

```javascript
// Compression sémantique
const email = "Réunion urgente demain matin"

// Étape 1 : Concepts
["réunion", "urgent", "demain", "matin"]

// Étape 2 : Caractères
['会', '急', '明', '早']

// Étape 3 : Définitions
{
  '会': ['人', '人', '口'],      // gens + gens + parler
  '急': ['心', '火', '快'],      // cœur + feu + rapide
  '明': ['日', '月'],           // soleil + lune
  '早': ['日', '上']            // soleil + monter
}

// Étape 4 : Position dans l'espace
// Barycentre de toutes ces définitions
position: calculateBarycenter([
  positions['人'], positions['口'],  // De '会'
  positions['心'], positions['火'],  // De '急'
  positions['日'], positions['月'],  // De '明'
  positions['日'], positions['上']   // De '早'
])
```

### Reconstruction

```javascript
// De la définition vers le sens
function reconstruct(emailDef) {
  // ['会', '急', '明', '早']
  
  // Expansion
  const expanded = {
    '会': "rassemblement de personnes pour parler",
    '急': "cœur en feu, rapidité requise",
    '明': "quand soleil et lune = jour suivant",
    '早': "quand soleil monte = matin"
  }
  
  // Génération française
  return "Rassemblement urgent au prochain lever de soleil"
  // Ou plus naturel : "Réunion urgente demain matin"
}
```

## 💡 Conclusion

Avec ce système de définitions récursives :
- **Chaque caractère = combinaison d'autres caractères**
- **Position dans l'espace = barycentre de sa définition**
- **Recherche = trouver les définitions similaires**
- **Compression = réduire aux primitives essentielles**

C'est un **langage dans le langage**, où le sens émerge des relations plutôt que d'être défini explicitement !