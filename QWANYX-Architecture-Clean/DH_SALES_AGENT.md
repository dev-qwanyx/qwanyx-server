# Digital Human - Agent Commercial Automobile

## 📋 Objectif Principal
Créer un DH spécialisé dans la vente de voitures qui:
- Répond aux emails de prospects
- Qualifie les leads selon les critères marketing
- Évalue le niveau de "chaleur" du prospect
- Détermine la capacité financière
- Guide vers la voiture appropriée

## 🎯 Qualification Marketing à Implémenter

### Niveau de Chaleur (Lead Scoring)
- **🔥 Chaud (80-100)**: Prêt à acheter, budget défini, urgence
- **🌡️ Tiède (40-79)**: Intéressé, recherche active, timeline 3-6 mois
- **❄️ Froid (0-39)**: Simple curiosité, pas de projet immédiat

### Critères d'Évaluation
1. **Moyens Financiers**
   - Budget annoncé
   - Type de financement souhaité
   - Profession/situation
   - Historique d'achat

2. **Urgence/Timeline**
   - Besoin immédiat
   - Remplacement véhicule
   - Projet à moyen terme
   - Simple information

3. **Engagement**
   - Questions spécifiques posées
   - Demande de RDV
   - Demande d'essai
   - Nombre d'interactions

4. **Profil**
   - Particulier/Professionnel
   - Premier achat/Renouvellement
   - Usage prévu (quotidien, loisir, famille)

## 🚗 Base de Données Véhicules
Liste de voitures à créer avec:
- Marque/Modèle
- Prix
- Catégorie (citadine, SUV, berline, sportive)
- Caractéristiques principales
- Points forts pour la vente
- Profil client idéal

## 🔄 Système GTD Modifié

### GTD Classique
- **Capture**: Tout ce qui arrive
- **Clarify**: Qu'est-ce que c'est?
- **Organize**: Où ça va?
- **Reflect**: Revue régulière
- **Engage**: Action

### GTD pour DH (Modified)
- **Capture**: Email/Input → Mémoire
- **Analyze**: Comprendre intention + qualifier
- **Categorize**: Type de demande + niveau chaleur
- **Connect**: Liens avec mémoires existantes
- **Decide**: Stratégie de réponse
- **Act**: Générer et envoyer réponse
- **Learn**: Mémoriser résultat + patterns

## 📊 Workflow de Traitement Email

```
Email Reçu
    ↓
[CAPTURE] → Créer mémoire
    ↓
[ANALYZE] → Extraction entités:
    - Budget mentionné?
    - Modèle spécifique?
    - Timeline?
    - Questions?
    ↓
[QUALIFY] → Score de chaleur:
    - Calculer score 0-100
    - Déterminer priorité
    ↓
[STRATEGIZE] → Choisir approche:
    - Si chaud → Proposer RDV
    - Si tiède → Envoyer info + relance
    - Si froid → Nurturing long terme
    ↓
[RESPOND] → Génération personnalisée
    ↓
[FOLLOW-UP] → Planifier prochaine action
    ↓
[LEARN] → Mémoriser interaction
```

## 🧠 Structure Mémoire Spécifique Vente

### Mémoire Prospect
```javascript
{
  type: "prospect",
  subtype: "automobile",
  data: {
    email: "prospect@example.com",
    name: "Jean Dupont",
    score: 75,  // Chaleur 0-100
    budget: {
      min: 15000,
      max: 25000,
      financing: "credit"
    },
    preferences: {
      category: "SUV",
      usage: "famille",
      priority: ["sécurité", "confort", "économie"]
    },
    timeline: "3_months",
    interactions: [
      { date: "2024-08-20", type: "email", subject: "Info SUV" }
    ]
  }
}
```

### Mémoire Véhicule
```javascript
{
  type: "product",
  subtype: "vehicle",
  data: {
    brand: "Renault",
    model: "Captur",
    category: "SUV",
    price: {
      base: 22000,
      promo: 20500
    },
    features: ["GPS", "Camera recul", "7 places"],
    targetProfile: {
      budget: [18000, 25000],
      usage: ["famille", "quotidien"],
      age: [25, 45]
    }
  }
}
```

### Edge Prospect-Véhicule
```javascript
{
  s: ObjectId("prospect_001"),
  t: ObjectId("vehicle_captur"),
  w: 0.85,  // Forte correspondance
  type: "matches",
  l: 604800  // Valide 7 jours
}
```

## 🎨 Templates de Réponse par Niveau

### Template Prospect Chaud
```
Bonjour [Nom],

Excellente nouvelle! Le [Modèle] correspond parfaitement à vos critères.
Avec votre budget de [Budget], vous pouvez bénéficier de notre offre spéciale.

Je vous propose un RDV [cette semaine/demain] pour:
- Essai du véhicule
- Étude personnalisée de financement
- Remise immédiate de [X]€

Quand seriez-vous disponible?
```

### Template Prospect Tiède
```
Bonjour [Nom],

Merci pour votre intérêt pour nos [Catégorie].
J'ai sélectionné 3 modèles qui correspondent à vos besoins:
[Liste véhicules avec points forts]

Souhaitez-vous recevoir une brochure détaillée?
Je reste disponible pour organiser un essai sans engagement.
```

### Template Prospect Froid
```
Bonjour [Nom],

Je comprends que vous êtes en phase de réflexion.
Voici un guide gratuit: "Comment choisir le véhicule idéal pour votre famille"

N'hésitez pas si vous avez des questions.
Je vous recontacterai dans quelques semaines avec nos nouvelles offres.
```

## 📈 Métriques à Tracker

- Taux de conversion par niveau de chaleur
- Temps moyen avant achat
- Modèles les plus demandés
- Questions fréquentes
- Objections récurrentes
- Efficacité des relances

## 🔧 Outils Généraux à Développer

### Framework GTD pour DH
- Pipeline de traitement configurable
- Règles de qualification personnalisables
- Templates dynamiques
- Système de scoring flexible
- Apprentissage des patterns de conversion

### Capacités Génériques
- Extraction d'entités (NER)
- Analyse de sentiment
- Détection d'intention
- Scoring multi-critères
- Génération de réponses contextuelles
- Planification de follow-up

## 📝 Notes Importantes

- Le système doit être **générique** mais configurable pour différents domaines
- La qualification doit être **apprenante** (s'améliorer avec le temps)
- Les templates doivent être **personnalisables** par l'utilisateur
- Le scoring doit pouvoir être **ajusté** selon les résultats
- La mémoire doit capturer les **patterns de succès**

## 🚀 Prochaines Étapes

1. Implémenter le pipeline GTD modifié
2. Créer la base de véhicules test
3. Développer le système de scoring
4. Créer les templates de base
5. Implémenter l'extraction d'entités
6. Tester avec emails réels
7. Observer et ajuster l'apprentissage