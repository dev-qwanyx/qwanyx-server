# Temporal System - Système Temporel avec T0

## 🕐 Référence Temporelle : T0 = Aujourd'hui Minuit

Nous établissons un point de référence absolu : **T0 = aujourd'hui à 00:00:00**. Tout dans le système est mesuré par rapport à ce point.

## ⏱️ Représentation du Temps

### Unités de Base

```javascript
const TEMPORAL_UNITS = {
  // T0 = Point de référence absolu
  T0: new Date().setHours(0, 0, 0, 0),  // Aujourd'hui minuit
  
  // Unités en millisecondes
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,  // Approximation
  YEAR: 365 * 24 * 60 * 60 * 1000
}

// Conversion en T-time
function toTTime(date) {
  const ms = date.getTime() - TEMPORAL_UNITS.T0
  return {
    t: ms,  // Millisecondes depuis T0
    days: ms / TEMPORAL_UNITS.DAY,
    formatted: formatTTime(ms)
  }
}

function formatTTime(ms) {
  if (ms === 0) return "T0"
  
  const sign = ms < 0 ? "-" : "+"
  const abs = Math.abs(ms)
  
  const days = Math.floor(abs / TEMPORAL_UNITS.DAY)
  const hours = Math.floor((abs % TEMPORAL_UNITS.DAY) / TEMPORAL_UNITS.HOUR)
  const minutes = Math.floor((abs % TEMPORAL_UNITS.HOUR) / TEMPORAL_UNITS.MINUTE)
  
  return `T0${sign}${days}d${hours}h${minutes}m`
  // Exemples : "T0+2d14h30m", "T0-5d3h15m"
}
```

## 🌐 Espace 4D : (x, y, z, t)

### Structure d'une Sphère Temporelle

```javascript
class TemporalSphere {
  constructor(data) {
    // Position spatiale (fixe ou mobile)
    this.position = {
      x: data.x,  // Dimension sémantique 1
      y: data.y,  // Dimension sémantique 2
      z: data.z   // Dimension sémantique 3
    }
    
    // Dimension temporelle
    this.temporal = {
      created: data.created || 0,      // T-time de création
      modified: data.modified || 0,    // Dernière modification
      accessed: [],                     // Historique des accès
      
      // Durée de vie
      lifespan: {
        start: data.start || 0,        // Début d'existence
        end: data.end || Infinity,     // Fin (si applicable)
        duration: null                  // Calculé
      },
      
      // Évolution temporelle
      trajectory: [],  // Positions au fil du temps
      
      // Propriétés temporelles
      frequency: data.frequency || 0,  // Fréquence d'apparition
      periodicity: data.period || null,// Récurrence
      decay: data.decay || 0          // Taux de décroissance
    }
    
    this.radius = data.radius
    this.type = data.type
  }
  
  // Position à un moment T donné
  getPositionAt(t) {
    // Si position fixe
    if (this.trajectory.length === 0) {
      return this.position
    }
    
    // Interpoler dans la trajectoire
    return this.interpolatePosition(t)
  }
  
  // Intensité à un moment T (décroissance)
  getIntensityAt(t) {
    const age = t - this.temporal.created
    
    if (this.temporal.decay === 0) {
      return 1.0  // Pas de décroissance
    }
    
    // Décroissance exponentielle
    return Math.exp(-age * this.temporal.decay / TEMPORAL_UNITS.DAY)
  }
}
```

## 📧 Emails dans le Temps

### Positionnement Temporel des Emails

```javascript
class TemporalEmail {
  constructor(email) {
    // Position sémantique (barycentre des concepts)
    this.position = calculateBarycenter(email.concepts)
    
    // Timestamp relatif à T0
    this.t = toTTime(email.date).t
    
    // Métadonnées temporelles
    this.temporal = {
      received: this.t,
      read: email.readTime ? toTTime(email.readTime).t : null,
      replied: email.replyTime ? toTTime(email.replyTime).t : null,
      
      // Importance décroissante dans le temps
      relevance: (t) => {
        const age = t - this.t
        const days = age / TEMPORAL_UNITS.DAY
        
        // Décroissance logarithmique
        return 1.0 / (1 + Math.log(1 + days))
      }
    }
  }
  
  // L'email dans l'espace-temps
  getSpaceTimeCoordinates() {
    return {
      x: this.position.x,
      y: this.position.y,
      z: this.position.z,
      t: this.t,
      
      // Format lisible
      formatted: {
        position: `(${this.position.x.toFixed(1)}, ${this.position.y.toFixed(1)}, ${this.position.z.toFixed(1)})`,
        time: formatTTime(this.t)
      }
    }
  }
}
```

## 🔍 Requêtes Temporelles

### Recherche dans une Fenêtre Temporelle

```javascript
class TemporalQueries {
  // Recherche dans une période
  searchInTimeWindow(query, startT, endT) {
    // Convertir la requête en position spatiale
    const searchPoint = this.queryToPosition(query)
    
    // Filtrer par temps
    const candidates = this.octree.queryRadius(searchPoint, 100)
      .filter(item => {
        const t = item.temporal.created
        return t >= startT && t <= endT
      })
    
    // Trier par pertinence temporelle et spatiale
    return candidates.sort((a, b) => {
      const distA = distance(a.position, searchPoint)
      const distB = distance(b.position, searchPoint)
      
      const timeA = Math.abs(a.temporal.created - (startT + endT) / 2)
      const timeB = Math.abs(b.temporal.created - (startT + endT) / 2)
      
      // Score combiné : 70% spatial, 30% temporel
      const scoreA = distA * 0.7 + timeA * 0.3
      const scoreB = distB * 0.7 + timeB * 0.3
      
      return scoreA - scoreB
    })
  }
  
  // Recherche "autour de ce moment"
  searchAroundTime(query, targetT, tolerance = TEMPORAL_UNITS.DAY) {
    return this.searchInTimeWindow(
      query,
      targetT - tolerance,
      targetT + tolerance
    )
  }
  
  // Recherche relative à T0
  searchRelativeToNow(query, relativeTime) {
    // "emails d'il y a 3 jours"
    const targetT = -3 * TEMPORAL_UNITS.DAY  // T0-3d
    return this.searchAroundTime(query, targetT)
  }
}
```

## 📊 Visualisation Temporelle

### Timeline 4D

```javascript
class Timeline4D {
  constructor() {
    this.currentT = 0  // Commence à T0
    this.viewRange = TEMPORAL_UNITS.WEEK  // Vue d'une semaine
  }
  
  // Rendu de l'espace à un moment T
  renderAtTime(t) {
    const visibleItems = []
    
    this.allItems.forEach(item => {
      // Vérifier si l'item existe à ce moment
      if (item.temporal.created <= t && 
          (item.temporal.end === Infinity || item.temporal.end > t)) {
        
        // Position à ce moment
        const pos = item.getPositionAt(t)
        
        // Intensité (peut décroître)
        const intensity = item.getIntensityAt(t)
        
        if (intensity > 0.01) {  // Seuil de visibilité
          visibleItems.push({
            item: item,
            position: pos,
            intensity: intensity,
            age: t - item.temporal.created
          })
        }
      }
    })
    
    return this.render3D(visibleItems)
  }
  
  // Animation temporelle
  animateTimeRange(startT, endT, duration) {
    const frames = []
    const steps = 60 * duration  // 60 FPS
    
    for (let i = 0; i <= steps; i++) {
      const t = startT + (endT - startT) * (i / steps)
      frames.push(this.renderAtTime(t))
    }
    
    return frames
  }
}
```

### Indicateurs Visuels du Temps

```javascript
class TemporalVisualizers {
  // Couleur selon l'âge
  ageToColor(t, createdT) {
    const age = t - createdT
    const days = age / TEMPORAL_UNITS.DAY
    
    if (days < 0) {
      // Futur : Bleu
      return { h: 200, s: 70, l: 50 + Math.min(30, -days * 2) }
    } else if (days < 1) {
      // Aujourd'hui : Blanc brillant
      return { h: 0, s: 0, l: 100 }
    } else if (days < 7) {
      // Cette semaine : Jaune → Orange
      return { h: 60 - days * 8, s: 80, l: 60 }
    } else if (days < 30) {
      // Ce mois : Orange → Rouge
      return { h: 30 - days, s: 70, l: 50 }
    } else {
      // Ancien : Gris
      const gray = Math.max(20, 60 - days)
      return { h: 0, s: 0, l: gray }
    }
  }
  
  // Taille selon la fraîcheur
  freshnessToSize(t, createdT) {
    const age = Math.abs(t - createdT)
    const days = age / TEMPORAL_UNITS.DAY
    
    // Plus c'est récent/proche, plus c'est gros
    return Math.max(0.5, 3.0 / (1 + days * 0.1))
  }
  
  // Effet visuel selon le temps
  temporalEffects(item, currentT) {
    const age = currentT - item.temporal.created
    
    return {
      // Pulsation pour les items récents
      pulse: age < TEMPORAL_UNITS.HOUR ? {
        frequency: 2,  // 2 Hz
        amplitude: 0.2
      } : null,
      
      // Traînée pour les items en mouvement
      trail: item.trajectory.length > 1 ? {
        length: Math.min(10, item.trajectory.length),
        opacity: 0.5,
        color: 'temporal_gradient'
      } : null,
      
      // Particules pour les items qui disparaissent
      decay: item.temporal.decay > 0 ? {
        particles: true,
        rate: item.temporal.decay * 10,
        direction: 'downward'
      } : null
    }
  }
}
```

## 🎮 Navigation Temporelle

### Contrôles Temporels

```javascript
class TemporalControls {
  constructor() {
    this.currentT = 0  // T0
    this.speed = 1     // Vitesse normale
    this.playing = false
  }
  
  // Sauter à un moment
  jumpTo(targetT) {
    this.currentT = targetT
    this.updateView()
  }
  
  // Navigation relative
  navigate(direction, amount) {
    switch(direction) {
      case 'forward':
        this.currentT += amount * TEMPORAL_UNITS.DAY
        break
      case 'backward':
        this.currentT -= amount * TEMPORAL_UNITS.DAY
        break
      case 'today':
        this.currentT = 0  // Retour à T0
        break
      case 'yesterday':
        this.currentT = -TEMPORAL_UNITS.DAY
        break
      case 'tomorrow':
        this.currentT = TEMPORAL_UNITS.DAY
        break
      case 'lastWeek':
        this.currentT = -TEMPORAL_UNITS.WEEK
        break
    }
    
    this.updateView()
  }
  
  // Lecture automatique
  play() {
    this.playing = true
    this.animate()
  }
  
  animate() {
    if (!this.playing) return
    
    // Avancer le temps selon la vitesse
    this.currentT += this.speed * TEMPORAL_UNITS.HOUR / 60  // 1h/sec à vitesse 1
    
    this.updateView()
    requestAnimationFrame(() => this.animate())
  }
  
  // Affichage du temps actuel
  getTimeDisplay() {
    return {
      absolute: new Date(TEMPORAL_UNITS.T0 + this.currentT),
      relative: formatTTime(this.currentT),
      
      // Indicateurs visuels
      display: {
        main: this.currentT === 0 ? "NOW (T0)" : formatTTime(this.currentT),
        date: new Date(TEMPORAL_UNITS.T0 + this.currentT).toLocaleDateString(),
        time: new Date(TEMPORAL_UNITS.T0 + this.currentT).toLocaleTimeString()
      }
    }
  }
}
```

## 🌟 Phénomènes Temporels

### Résonance Temporelle

```javascript
// Certains patterns se répètent dans le temps
function findTemporalResonance() {
  const patterns = []
  
  // Analyser les cycles
  for (let period = TEMPORAL_UNITS.DAY; period <= TEMPORAL_UNITS.YEAR; period *= 2) {
    const resonance = analyzePeriodicPattern(period)
    
    if (resonance.strength > 0.5) {
      patterns.push({
        period: period,
        strength: resonance.strength,
        concepts: resonance.repeatingConcepts,
        nextOccurrence: predictNext(resonance)
      })
    }
  }
  
  return patterns
}
```

### Trajectoires Conceptuelles

```javascript
// Voir comment les concepts évoluent dans le temps
function trackConceptEvolution(concept, timeRange) {
  const trajectory = []
  
  for (let t = timeRange.start; t <= timeRange.end; t += TEMPORAL_UNITS.DAY) {
    const state = {
      time: t,
      position: getConceptPositionAt(concept, t),
      activation: getConceptActivationAt(concept, t),
      connections: getActiveConnectionsAt(concept, t)
    }
    
    trajectory.push(state)
  }
  
  return {
    concept: concept,
    trajectory: trajectory,
    trend: analyzeTrend(trajectory),
    prediction: extrapolateFuture(trajectory)
  }
}
```

## 💡 Utilisation Pratique

### Exemples de Requêtes

```javascript
// "Emails d'hier sur le projet X"
search({
  query: "projet X",
  time: -TEMPORAL_UNITS.DAY,  // T0-1d
  tolerance: TEMPORAL_UNITS.DAY
})

// "Qu'est-ce qui s'est passé la semaine dernière ?"
getActivity({
  start: -7 * TEMPORAL_UNITS.DAY,  // T0-7d
  end: 0,                           // T0
  summarize: true
})

// "Prédire les sujets de demain"
predictFuture({
  basedOn: [-30 * TEMPORAL_UNITS.DAY, 0],  // Derniers 30 jours
  predict: TEMPORAL_UNITS.DAY,              // Demain
  method: 'pattern_extrapolation'
})
```

## 🎯 Conclusion

Avec T0 comme référence absolue :
- **Tout est mesuré** par rapport à "aujourd'hui minuit"
- **Navigation temporelle** simple : T0+2d, T0-5h, etc.
- **Espace 4D complet** : (x, y, z, t)
- **Requêtes temporelles** : "hier", "la semaine dernière", "dans 3 jours"
- **Visualisation** : voir le passé, présent et futur
- **Patterns temporels** : détecter cycles et tendances

Le temps devient une **dimension navigable** comme les autres ! ⏰