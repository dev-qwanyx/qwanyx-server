# Glossaire SPU

## A

**Activation Floue** : Propagation progressive de l'activation d'une sphère à ses voisines avec décroissance selon la distance.

**Assembleur SPU** : Langage de bas niveau pour programmer le processeur sémantique, similaire à l'assembleur CPU mais pour les concepts.

## B

**Barycentre Sémantique** : Position calculée comme moyenne pondérée des positions de concepts liés, utilisée pour placer de nouveaux concepts.

**Bytecode SPU** : Format compilé des programmes SPU, optimisé pour l'exécution.

## C

**Cache Sémantique** : Système de mise en cache multi-niveaux (L1-L3) pour les résultats déterministes du SPU.

**Caractère Chinois** : Unité atomique de sens dans le système SPU, environ 100,000 caractères encodent tout le savoir humain.

**Compression Sémantique** : Réduction d'un texte à ses concepts essentiels via les caractères chinois, ratio typique 1000:1.

**Concept** : Unité de sens représentée par une sphère dans l'espace sémantique.

## D

**Déterminisme** : Propriété du SPU garantissant que même input = même output, permettant le caching.

**Distance Sémantique** : Mesure de proximité conceptuelle entre deux sphères dans l'espace 3D.

## E

**Edge** : Connexion directe entre deux sphères, représentant une relation non-sémantique (temporelle, causale, etc.).

**Espace Sémantique** : Univers 3D où chaque concept existe comme une sphère à une position spécifique.

## F

**Fuzzy Activation** : Voir Activation Floue.

## G

**GPT-5** : Dans le contexte SPU, une unité d'exécution pour compréhension profonde, orchestrée par le SPU.

## H

**Hiérarchie Mémoire** : Organisation en couches L1 (registres) → L2 (cache) → L3 (RAM) → L4 (MongoDB) → L5 (S3).

## I

**Instruction SPU** : Commande élémentaire du processeur sémantique (ex: SEM_COMPRESS, LLM_EXEC, RAYTRACE).

## L

**Langage Domaine** : Langage spécialisé construit sur SPU pour un domaine (SPU-MED, SPU-EDU, SPU-PSY).

**LLM Stateless** : Les LLMs n'ont aucun état ni mémoire, tout le contexte est géré par le SPU.

## M

**Matériau** : Propriété d'une sphère déterminant comment elle interagit avec les rayons (transparent, réflectif, absorbant).

**Méta-Langage** : Système permettant de créer de nouveaux langages SPU qui évoluent dans l'espace sémantique.

## N

**Nano-LLM** : Modèle de langage ultra-léger et spécialisé pour une tâche précise (< 200M paramètres, < 10ms).

**Navigation Sémantique** : Déplacement dans l'espace 3D de concept en concept plutôt que recherche traditionnelle.

## O

**Octree** : Structure de données divisant l'espace en 8 sous-cubes récursivement pour optimiser les recherches.

**Orchestration** : Le SPU orchestre les LLMs comme un chef d'orchestre dirige des musiciens.

## P

**Pipeline SPU** : Séquence LOAD → COMPRESS → ANALYZE → ORCHESTRATE → SYNTHESIZE.

**Position Sémantique** : Coordonnées (x, y, z) d'un concept dans l'espace, déterminées par son sens.

**Processeur Sémantique** : Le SPU, traite des concepts comme un CPU traite des bits.

## R

**RAG** : Retrieval-Augmented Generation, ancien paradigme remplacé par le SPU.

**Rayon** : Vecteur lancé dans l'espace pour navigation et recherche, interagit avec les sphères.

**Raytracing Sémantique** : Technique de navigation lançant des rayons qui rebondissent sur les sphères.

**Registre SPU** : Zone mémoire pour stocker temporairement des concepts ($R0-$R15, $DOC, $SPHERE, etc.).

## S

**Sphère Sémantique** : Représentation 3D d'un concept avec position, rayon, masse, matériau et contenu.

**SPU** : Semantic Processor Unit, processeur révolutionnaire traitant l'information au niveau conceptuel.

**SPU-EDU** : Langage SPU spécialisé pour l'éducation et l'évaluation pédagogique.

**SPU-MED** : Langage SPU spécialisé pour le domaine médical.

**SPU-PSY** : Langage SPU spécialisé pour l'analyse psychologique.

## T

**Temps Hybride** : Système 64 bits encodant temps humain (32 bits) + cosmique (16 bits) + quantique (16 bits).

**Token** : Unité de texte dans les LLMs traditionnels, remplacée par les caractères chinois dans SPU.

## U

**Urgency-nano** : Exemple de nano-LLM spécialisé dans la détection d'urgence en < 10ms.

## V

**Visualisation 3D** : Interface Three.js permettant de naviguer visuellement dans l'espace sémantique.

## Z

**Zone d'Activation** : Région de l'espace où les sphères sont activées suite à une recherche ou navigation.

## Acronymes

- **SPU** : Semantic Processor Unit
- **LLM** : Large Language Model  
- **RAG** : Retrieval-Augmented Generation
- **BFS** : Breadth-First Search (pour propagation)
- **API** : Application Programming Interface
- **REPL** : Read-Eval-Print Loop

## Formules Clés

**Compression Ratio** : 
```
CR = Taille_originale / Taille_compressée ≈ 1000:1
```

**Distance Sémantique** :
```
d = √[(x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²]
```

**Activation Decay** :
```
A_voisin = A_source × (1 / (1 + distance × decay_factor))
```

**Position par Barycentre** :
```
P = Σ(P_i × w_i) / Σ(w_i)
```

## Concepts Avancés

**Intrication Sémantique** : Future capacité quantique où deux concepts peuvent être intriqués, modification de l'un affectant instantanément l'autre.

**Plasticité Sémantique** : Capacité de l'espace à se réorganiser selon l'usage, rapprochant les concepts souvent co-activés.

**Singularité Sémantique** : Point théorique où tous les concepts convergent, représentant la connaissance absolue.

---

*Ce glossaire est un document vivant qui évolue avec le système SPU.*

→ Retour à l'[Index](../README.md)