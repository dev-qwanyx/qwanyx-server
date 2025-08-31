# Référence Complète des Instructions SPU

## 📚 Index des Instructions

### [Instructions de Base](#instructions-de-base)
- [LOAD](#load) - Charger données
- [STORE](#store) - Sauvegarder données
- [MOVE](#move) - Copier registre
- [CLEAR](#clear) - Vider registre
- [PUSH/POP](#pushpop) - Gestion pile

### [Instructions Documents](#instructions-documents)
- [DOC_LOAD](#doc_load) - Charger document
- [DOC_CREATE](#doc_create) - Créer document
- [DOC_UPDATE](#doc_update) - Modifier champ
- [DOC_STORE](#doc_store) - Sauvegarder
- [DOC_DELETE](#doc_delete) - Supprimer
- [DOC_SEARCH](#doc_search) - Rechercher

### [Instructions Sphères](#instructions-sphères)
- [SPHERE_CREATE](#sphere_create) - Créer sphère
- [SPHERE_LOAD](#sphere_load) - Charger sphère
- [SPHERE_POSITION](#sphere_position) - Position 3D
- [SPHERE_NEAR](#sphere_near) - Sphères proches
- [SPHERE_RAY](#sphere_ray) - Raytracing

### [Instructions Edges](#instructions-edges)
- [EDGE_CREATE](#edge_create) - Créer edge
- [EDGE_DELETE](#edge_delete) - Supprimer edge
- [EDGE_FIND](#edge_find) - Trouver edges
- [EDGE_TRAVERSE](#edge_traverse) - Parcourir graphe

### [Instructions LLM](#instructions-llm)
- [LLM_SELECT](#llm_select) - Choisir LLM
- [LLM_EXEC](#llm_exec) - Exécuter LLM
- [LLM_COMPRESS](#llm_compress) - Compression
- [PARALLEL_START/END](#parallel) - Parallélisme

### [Instructions Sémantiques](#instructions-sémantiques)
- [SEM_COMPRESS](#sem_compress) - Compression chinoise
- [SEM_EXPAND](#sem_expand) - Décompression
- [SEM_CONCEPTS](#sem_concepts) - Extraire concepts
- [SEM_SIMILARITY](#sem_similarity) - Similarité

### [Instructions Temporelles](#instructions-temporelles)
- [TIME_NOW](#time_now) - Temps actuel
- [TIME_ENCODE](#time_encode) - Encoder 64 bits
- [TIME_RANGE](#time_range) - Plage temporelle

### [Instructions de Contrôle](#instructions-de-contrôle)
- [CMP](#cmp) - Comparer
- [JMP](#jmp) - Saut inconditionnel
- [JE/JNE](#jejne) - Sauts conditionnels
- [CALL/RET](#callret) - Appel fonction
- [LOOP](#loop) - Boucle

---

## Instructions de Base

### LOAD
**Charge des données dans un registre**
```assembly
LOAD $R0, <source>
```
- **Paramètres** :
  - `$R0` : Registre destination
  - `<source>` : Source des données
- **Exemple** :
```assembly
LOAD $R0, 'hello_world'
LOAD $R1, 12345
LOAD $DOC, current_document
```

### STORE
**Sauvegarde un registre en mémoire**
```assembly
STORE $R0, <destination>
```
- **Paramètres** :
  - `$R0` : Registre source
  - `<destination>` : Destination en mémoire
- **Exemple** :
```assembly
STORE $RESULT, output_buffer
STORE $DOC, document_cache
```

### MOVE
**Copie d'un registre vers un autre**
```assembly
MOVE $R0, $R1
```
- **Paramètres** :
  - `$R0` : Registre destination
  - `$R1` : Registre source
- **Exemple** :
```assembly
MOVE $BACKUP, $CURRENT
MOVE $R2, $RESULT
```

### CLEAR
**Vide un registre**
```assembly
CLEAR $R0
```
- **Paramètres** :
  - `$R0` : Registre à vider
- **Exemple** :
```assembly
CLEAR $TEMP
CLEAR $BUFFER
```

### PUSH/POP
**Gestion de la pile**
```assembly
PUSH $R0
POP $R1
```
- **Exemple** :
```assembly
PUSH $CURRENT_STATE
; ... opérations ...
POP $PREVIOUS_STATE
```

---

## Instructions Documents

### DOC_LOAD
**Charge un document depuis MongoDB**
```assembly
DOC_LOAD $DOC, <document_id>
```
- **Paramètres** :
  - `$DOC` : Registre destination
  - `<document_id>` : ID MongoDB ou requête
- **Exemple** :
```assembly
DOC_LOAD $EMAIL, 'latest_email'
DOC_LOAD $DOC, {type: 'invoice', status: 'pending'}
```
- **Temps** : 10-50ms
- **Erreurs** : `DOC_NOT_FOUND`, `DB_ERROR`

### DOC_CREATE
**Crée un nouveau document**
```assembly
DOC_CREATE $DOC, <type>
```
- **Paramètres** :
  - `$DOC` : Registre pour le nouveau document
  - `<type>` : Type de document
- **Exemple** :
```assembly
DOC_CREATE $RESPONSE, 'email_response'
DOC_CREATE $LOG, 'audit_log'
```

### DOC_UPDATE
**Modifie un champ du document**
```assembly
DOC_UPDATE $DOC, <field>, <value>
```
- **Paramètres** :
  - `$DOC` : Document à modifier
  - `<field>` : Nom du champ
  - `<value>` : Nouvelle valeur
- **Exemple** :
```assembly
DOC_UPDATE $EMAIL, 'status', 'processed'
DOC_UPDATE $DOC, 'timestamp', TIME_NOW()
```

### DOC_STORE
**Sauvegarde le document dans MongoDB**
```assembly
DOC_STORE $DOC
```
- **Paramètres** :
  - `$DOC` : Document à sauvegarder
- **Exemple** :
```assembly
DOC_STORE $EMAIL
DOC_STORE $PROCESSED_DOC
```
- **Temps** : 5-20ms

### DOC_DELETE
**Supprime un document**
```assembly
DOC_DELETE <document_id>
```
- **Paramètres** :
  - `<document_id>` : ID du document
- **Exemple** :
```assembly
DOC_DELETE old_email_id
DOC_DELETE $DOC._id
```

### DOC_SEARCH
**Recherche de documents**
```assembly
DOC_SEARCH $RESULT, <query>
```
- **Paramètres** :
  - `$RESULT` : Registre pour les résultats
  - `<query>` : Requête MongoDB
- **Exemple** :
```assembly
DOC_SEARCH $EMAILS, {from: 'user@example.com'}
DOC_SEARCH $INVOICES, {amount: {$gt: 1000}}
```

---

## Instructions Sphères

### SPHERE_CREATE
**Crée une sphère sémantique**
```assembly
SPHERE_CREATE $SPHERE, $DOC
```
- **Paramètres** :
  - `$SPHERE` : Nouvelle sphère
  - `$DOC` : Document source
- **Exemple** :
```assembly
SPHERE_CREATE $EMAIL_SPHERE, $EMAIL
```
- **Calculs** :
  - Extraction concepts : 10ms
  - Calcul position : 5ms
  - Total : ~15ms

### SPHERE_LOAD
**Charge une sphère existante**
```assembly
SPHERE_LOAD $SPHERE, <sphere_id>
```
- **Paramètres** :
  - `$SPHERE` : Registre destination
  - `<sphere_id>` : ID de la sphère
- **Exemple** :
```assembly
SPHERE_LOAD $CURRENT, sphere_123
```

### SPHERE_POSITION
**Obtient la position 3D**
```assembly
SPHERE_POSITION $POSITION, $SPHERE
```
- **Paramètres** :
  - `$POSITION` : Registre pour position {x,y,z}
  - `$SPHERE` : Sphère source
- **Exemple** :
```assembly
SPHERE_POSITION $POS, $EMAIL_SPHERE
; $POS = {x: 12.5, y: -3.2, z: 8.7}
```

### SPHERE_NEAR
**Trouve les sphères proches**
```assembly
SPHERE_NEAR $RESULT, $POSITION, <radius>
```
- **Paramètres** :
  - `$RESULT` : Liste des sphères trouvées
  - `$POSITION` : Position centrale
  - `<radius>` : Rayon de recherche
- **Exemple** :
```assembly
SPHERE_NEAR $NEARBY, $CURRENT_POS, 50
; Trouve toutes les sphères dans un rayon de 50
```
- **Performance** : O(log n) avec octree

### SPHERE_RAY
**Raytracing dans l'espace**
```assembly
SPHERE_RAY $RESULT, <origin>, <direction>
```
- **Paramètres** :
  - `$RESULT` : Sphères touchées
  - `<origin>` : Point de départ
  - `<direction>` : Vecteur direction
- **Exemple** :
```assembly
SPHERE_RAY $HITS, $CAMERA_POS, $LOOK_DIR
```

---

## Instructions Edges

### EDGE_CREATE
**Crée une relation**
```assembly
EDGE_CREATE $EDGE, <source>, <target>, <type>
```
- **Paramètres** :
  - `$EDGE` : Nouvelle edge
  - `<source>` : ID source
  - `<target>` : ID destination
  - `<type>` : Type de relation
- **Exemple** :
```assembly
EDGE_CREATE $LINK, $DOC1._id, $DOC2._id, 'references'
EDGE_CREATE $THREAD, $EMAIL1, $EMAIL2, 'thread'
```

### EDGE_FIND
**Trouve des edges**
```assembly
EDGE_FIND $RESULT, <source>, <type>
```
- **Paramètres** :
  - `$RESULT` : Edges trouvées
  - `<source>` : Point de départ
  - `<type>` : Type recherché
- **Exemple** :
```assembly
EDGE_FIND $REPLIES, $EMAIL._id, 'responds_to'
EDGE_FIND $ATTACHMENTS, $DOC._id, 'attachment'
```

### EDGE_TRAVERSE
**Parcourt le graphe**
```assembly
EDGE_TRAVERSE $RESULT, <start>, <depth>
```
- **Paramètres** :
  - `$RESULT` : Nœuds visités
  - `<start>` : Nœud de départ
  - `<depth>` : Profondeur max
- **Exemple** :
```assembly
EDGE_TRAVERSE $THREAD, $EMAIL._id, 3
; Trouve tout le thread jusqu'à 3 niveaux
```

---

## Instructions LLM

### LLM_SELECT
**Choisit le LLM approprié**
```assembly
LLM_SELECT $R0, <task_type>
```
- **Paramètres** :
  - `$R0` : Registre pour l'ID du LLM
  - `<task_type>` : Type de tâche
- **Exemple** :
```assembly
LLM_SELECT $MODEL, 'deep_analysis'  ; → gpt-5
LLM_SELECT $MODEL, 'quick_class'    ; → nano-classifier
```

### LLM_EXEC
**Exécute un LLM**
```assembly
LLM_EXEC $RESULT, <llm>, <context>
```
- **Paramètres** :
  - `$RESULT` : Résultat de l'exécution
  - `<llm>` : Nom ou ID du LLM
  - `<context>` : Contexte/prompt
- **Exemple** :
```assembly
LLM_EXEC $URGENCY, 'urgency-nano', $COMPRESSED_EMAIL
LLM_EXEC $ANALYSIS, 'gpt-5', $FULL_CONTEXT
```
- **Temps** :
  - nano-llm : 5-10ms
  - gpt-4o : 100-200ms
  - gpt-5 : 200-500ms

### LLM_COMPRESS
**Compression sémantique pour LLM**
```assembly
LLM_COMPRESS $CONTEXT, <data>
```
- **Paramètres** :
  - `$CONTEXT` : Contexte compressé
  - `<data>` : Données à compresser
- **Exemple** :
```assembly
LLM_COMPRESS $CTX, $LONG_CONVERSATION
; 100KB → 100 caractères
```

### PARALLEL_START/END
**Exécution parallèle**
```assembly
PARALLEL_START
    LLM_EXEC $R0, 'llm1', $CTX1
    LLM_EXEC $R1, 'llm2', $CTX2
    LLM_EXEC $R2, 'llm3', $CTX3
PARALLEL_END
```
- **Comportement** :
  - Toutes les instructions entre START et END s'exécutent en parallèle
  - PARALLEL_END attend que toutes finissent
  - Temps total = temps du plus lent

---

## Instructions Sémantiques

### SEM_COMPRESS
**Compression en caractères chinois**
```assembly
SEM_COMPRESS $R0, <text>
```
- **Paramètres** :
  - `$R0` : Texte compressé
  - `<text>` : Texte original
- **Exemple** :
```assembly
SEM_COMPRESS $COMPRESSED, "This is a long email about urgent matters"
; → ['急', '邮', '件', '事']
```
- **Ratio** : ~1000:1

### SEM_EXPAND
**Décompression sémantique**
```assembly
SEM_EXPAND $R0, <compressed>
```
- **Paramètres** :
  - `$R0` : Texte étendu
  - `<compressed>` : Caractères compressés
- **Exemple** :
```assembly
SEM_EXPAND $FULL, ['急', '邮']
; → "Urgent email communication"
```

### SEM_CONCEPTS
**Extrait les concepts**
```assembly
SEM_CONCEPTS $RESULT, $DOC
```
- **Paramètres** :
  - `$RESULT` : Liste de concepts
  - `$DOC` : Document source
- **Exemple** :
```assembly
SEM_CONCEPTS $CONCEPTS, $EMAIL
; → ['urgency', 'customer', 'invoice', 'problem']
```

### SEM_SIMILARITY
**Calcule la similarité**
```assembly
SEM_SIMILARITY $R0, $DOC1, $DOC2
```
- **Paramètres** :
  - `$R0` : Score de similarité (0-1)
  - `$DOC1` : Premier document
  - `$DOC2` : Second document
- **Exemple** :
```assembly
SEM_SIMILARITY $SCORE, $EMAIL1, $EMAIL2
; → 0.85 (très similaires)
```

---

## Instructions Temporelles

### TIME_NOW
**Temps actuel**
```assembly
TIME_NOW $R0
```
- **Paramètres** :
  - `$R0` : Registre pour le timestamp
- **Exemple** :
```assembly
TIME_NOW $TIMESTAMP
; $TIMESTAMP = temps depuis T0 en ms
```

### TIME_ENCODE
**Encode une date en 64 bits**
```assembly
TIME_ENCODE $R0, <date>
```
- **Paramètres** :
  - `$R0` : Date encodée (64 bits)
  - `<date>` : Date à encoder
- **Exemple** :
```assembly
TIME_ENCODE $ENCODED, '2024-12-25 14:30:00'
```

### TIME_RANGE
**Définit une plage temporelle**
```assembly
TIME_RANGE $RESULT, <start>, <end>
```
- **Paramètres** :
  - `$RESULT` : Plage temporelle
  - `<start>` : Début
  - `<end>` : Fin
- **Exemple** :
```assembly
TIME_RANGE $WEEK, 'T0-7d', 'T0'
; Dernière semaine
```

---

## Instructions de Contrôle

### CMP
**Compare deux valeurs**
```assembly
CMP $R0, $R1
CMP $R0, <value>
```
- **Paramètres** :
  - `$R0` : Première valeur
  - `$R1` ou `<value>` : Seconde valeur
- **Flags** : Définit les flags ZF (zero), CF (carry), SF (sign)
- **Exemple** :
```assembly
CMP $URGENCY, 'CRITICAL'
CMP $SCORE, 80
```

### JMP
**Saut inconditionnel**
```assembly
JMP <label>
```
- **Paramètres** :
  - `<label>` : Étiquette de destination
- **Exemple** :
```assembly
JMP finish
JMP error_handler
```

### JE/JNE
**Sauts conditionnels**
```assembly
JE <label>   ; Jump if Equal
JNE <label>  ; Jump if Not Equal
JG <label>   ; Jump if Greater
JL <label>   ; Jump if Less
JGE <label>  ; Jump if Greater or Equal
JLE <label>  ; Jump if Less or Equal
```
- **Exemple** :
```assembly
CMP $URGENCY, 'HIGH'
JE urgent_handler
JMP normal_handler
```

### CALL/RET
**Appel de fonction**
```assembly
CALL <function>
RET
```
- **Exemple** :
```assembly
main:
    CALL process_email
    CALL send_response
    RET

process_email:
    ; ... traitement ...
    RET
```

### LOOP
**Boucle N fois**
```assembly
LOOP $R0, <label>
```
- **Paramètres** :
  - `$R0` : Compteur (décrémenté)
  - `<label>` : Étiquette de boucle
- **Exemple** :
```assembly
LOAD $R0, 10
loop_start:
    ; ... opérations ...
    LOOP $R0, loop_start
```

---

## 📊 Tableau de Performance

| Instruction | Temps Moyen | Cache | Parallélisable |
|------------|-------------|-------|----------------|
| LOAD/STORE | 1-5ms | Oui | Non |
| DOC_* | 10-50ms | Oui | Oui |
| SPHERE_* | 5-20ms | Oui | Oui |
| EDGE_* | 5-15ms | Oui | Oui |
| LLM_EXEC (nano) | 5-10ms | Oui | Oui |
| LLM_EXEC (gpt-4o) | 100-200ms | Oui | Oui |
| LLM_EXEC (gpt-5) | 200-500ms | Oui | Oui |
| SEM_COMPRESS | 10-30ms | Oui | Oui |

---

## 🔧 Macros Utiles

```assembly
; Macro pour traitement email standard
.macro PROCESS_EMAIL email
    DOC_LOAD $DOC, email
    SEM_COMPRESS $CTX, $DOC
    PARALLEL_START
        LLM_EXEC $URG, 'urgency-nano', $CTX
        LLM_EXEC $CAT, 'category-nano', $CTX
    PARALLEL_END
.endmacro

; Macro pour logging
.macro LOG message
    DOC_CREATE $LOG, 'log'
    DOC_UPDATE $LOG, 'message', message
    DOC_UPDATE $LOG, 'timestamp', TIME_NOW()
    DOC_STORE $LOG
.endmacro
```

---

*Cette référence couvre l'ensemble des instructions SPU. Pour des exemples d'utilisation, voir [Exemples d'assembleur SPU](../05-examples/01-assembly-examples.md).*