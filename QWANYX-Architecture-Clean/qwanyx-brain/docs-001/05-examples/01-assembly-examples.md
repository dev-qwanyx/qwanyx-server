# Exemples de Programmes en Assembleur SPU

## 📧 Traitement d'Email Complet

### Programme Principal
```assembly
; ================================================================
; Programme : Email Processing Pipeline
; Description : Analyse complète d'un email avec routing intelligent
; ================================================================

.data
    urgency_levels:     .string "LOW", "MEDIUM", "HIGH", "CRITICAL"
    categories:         .string "SUPPORT", "SALES", "COMPLAINT", "INFO"
    threshold_urgent:   .float 0.8
    threshold_important:.float 0.6

.text
.global email_processor

email_processor:
    ; Sauvegarder l'état
    PUSH            $R0-$R15
    
    ; Charger l'email
    DOC_LOAD        $EMAIL, email_id
    
    ; ---- Phase 1 : Compression ----
    SEM_COMPRESS    $COMPRESSED, $EMAIL.body
    SEM_COMPRESS    $SUBJ_COMP, $EMAIL.subject
    
    ; ---- Phase 2 : Analyse Parallèle ----
    PARALLEL_START
        ; Analyses de base
        LLM_EXEC    $URGENCY, 'urgency-nano', $COMPRESSED
        LLM_EXEC    $SENTIMENT, 'sentiment-nano', $COMPRESSED
        LLM_EXEC    $INTENT, 'intent-nano', $COMPRESSED
        LLM_EXEC    $CATEGORY, 'classifier-nano', $COMPRESSED
        
        ; Analyses avancées
        LLM_EXEC    $ENTITIES, 'entity-extractor', $COMPRESSED
        LLM_EXEC    $KEYWORDS, 'keyword-extractor', $COMPRESSED
        LLM_EXEC    $LANGUAGE, 'language-detector', $COMPRESSED
    PARALLEL_END
    
    ; ---- Phase 3 : Décision de Routing ----
    ; Vérifier l'urgence critique
    CMP             $URGENCY, 'CRITICAL'
    JE              critical_handler
    
    ; Vérifier si c'est une plainte
    CMP             $CATEGORY, 'COMPLAINT'
    JE              complaint_handler
    
    ; Vérifier le sentiment négatif
    CMP             $SENTIMENT, 'VERY_NEGATIVE'
    JE              escalation_handler
    
    ; Routing par catégorie
    CMP             $CATEGORY, 'SUPPORT'
    JE              support_handler
    
    CMP             $CATEGORY, 'SALES'
    JE              sales_handler
    
    ; Défaut : traitement standard
    JMP             standard_handler

critical_handler:
    ; Notification immédiate
    NOTIFY          'MANAGER', $EMAIL
    NOTIFY          'ON_CALL', $EMAIL
    
    ; Log l'événement
    LOG             'CRITICAL_EMAIL', $EMAIL.id
    
    ; Créer une réponse d'urgence
    CALL            generate_urgent_response
    
    ; Créer un ticket prioritaire
    TICKET_CREATE   $TICKET, priority='P0'
    
    JMP             finish

complaint_handler:
    ; Analyse approfondie de la plainte
    LLM_EXEC        $COMPLAINT_DETAILS, 'complaint-analyzer', $COMPRESSED
    
    ; Chercher l'historique client
    CUSTOMER_HISTORY $HISTORY, $EMAIL.from
    
    ; Calculer le score de satisfaction
    CALC_SATISFACTION $SAT_SCORE, $HISTORY, $COMPLAINT_DETAILS
    
    ; Si client important mécontent
    CMP             $SAT_SCORE, 0.3
    JL              vip_escalation
    
    ; Génération de réponse empathique
    CALL            generate_empathetic_response
    
    JMP             finish

support_handler:
    ; Recherche dans la base de connaissances
    SPHERE_SEARCH   $SOLUTIONS, $KEYWORDS, radius=100
    
    ; Si solution trouvée
    CMP             $SOLUTIONS.count, 0
    JG              auto_respond
    
    ; Sinon, créer ticket support
    TICKET_CREATE   $TICKET, queue='SUPPORT'
    
    JMP             finish

sales_handler:
    ; Analyser l'intention d'achat
    LLM_EXEC        $PURCHASE_INTENT, 'purchase-intent', $COMPRESSED
    
    ; Score de lead
    CALC_LEAD_SCORE $SCORE, $PURCHASE_INTENT, $ENTITIES
    
    ; Si score élevé
    CMP             $SCORE, 0.7
    JG              hot_lead
    
    ; Lead tiède
    QUEUE_ADD       'SALES_FOLLOWUP', $EMAIL
    
    JMP             finish

standard_handler:
    ; Traitement par défaut
    QUEUE_ADD       'GENERAL', $EMAIL
    
    ; Réponse automatique
    CALL            generate_acknowledgment
    
    JMP             finish

auto_respond:
    ; Construire la réponse avec les solutions trouvées
    BUILD_RESPONSE  $RESPONSE, $SOLUTIONS
    
    ; Personnaliser
    PERSONALIZE     $RESPONSE, $EMAIL.from
    
    ; Envoyer
    SEND_EMAIL      $RESPONSE, $EMAIL.from
    
    RET

hot_lead:
    ; Notification commerciale immédiate
    NOTIFY          'SALES_TEAM', $EMAIL
    
    ; Génération de proposition
    CALL            generate_sales_proposal
    
    RET

vip_escalation:
    ; Escalade VIP
    NOTIFY          'EXECUTIVE', $EMAIL
    CALL            generate_vip_response
    RET

finish:
    ; ---- Phase 4 : Mémorisation ----
    ; Compresser pour stockage
    BUILD_SPHERE    $SPHERE, $COMPRESSED, $URGENCY, $CATEGORY
    
    ; Calculer la position dans l'espace
    CALC_POSITION   $POS, $SPHERE
    
    ; Sauvegarder dans l'espace sémantique
    SPHERE_STORE    $SPHERE, $POS
    
    ; Créer les edges
    IF              $EMAIL.in_reply_to:
        EDGE_CREATE 'REPLY', $EMAIL.id, $EMAIL.in_reply_to
    
    IF              $ENTITIES.project:
        EDGE_CREATE 'MENTIONS', $EMAIL.id, $ENTITIES.project
    
    ; Mettre à jour les métriques
    METRICS_UPDATE  'emails_processed'
    
    ; Restaurer l'état et retourner
    POP             $R0-$R15
    RET

; ================================================================
; Sous-routines de génération de réponses
; ================================================================

generate_urgent_response:
    PUSH            $R0-$R5
    
    ; Template pour urgence
    TEMPLATE_LOAD   $TEMPLATE, 'urgent_response'
    
    ; Personnaliser avec le contexte
    TEMPLATE_FILL   $TEMPLATE, $EMAIL, $COMPRESSED
    
    ; Générer avec GPT-4o pour qualité
    LLM_GENERATE    $RESPONSE, 'gpt-4o', $TEMPLATE
    
    ; Valider avant envoi
    LLM_VALIDATE    $VALID, 'validator-nano', $RESPONSE
    
    CMP             $VALID, true
    JNE             regenerate
    
    ; Envoyer
    SEND_EMAIL      $RESPONSE, $EMAIL.from
    
    POP             $R0-$R5
    RET

generate_empathetic_response:
    PUSH            $R0-$R5
    
    ; Construire un contexte empathique
    BUILD_CONTEXT   $CTX, type='empathy'
    APPEND          $CTX, $COMPLAINT_DETAILS
    APPEND          $CTX, $HISTORY
    
    ; Génération avec ton empathique
    LLM_GENERATE    $RESPONSE, 'claude-3-empathy', $CTX
    
    ; Ajouter compensation si nécessaire
    IF              $SAT_SCORE < 0.2:
        OFFER_ADD   $RESPONSE, 'discount_20'
    
    SEND_EMAIL      $RESPONSE, $EMAIL.from
    
    POP             $R0-$R5
    RET

generate_acknowledgment:
    ; Simple accusé de réception
    TEMPLATE_LOAD   $ACK, 'acknowledgment'
    TEMPLATE_FILL   $ACK, $EMAIL.id
    SEND_EMAIL      $ACK, $EMAIL.from
    RET
```

## 🔍 Recherche Sémantique Multi-Niveaux

```assembly
; ================================================================
; Programme : Recherche Sémantique Avancée
; Description : Recherche avec raytracing et activation floue
; ================================================================

.data
    search_radius:      .float 100.0
    activation_decay:   .float 0.1
    min_activation:     .float 0.01
    max_results:        .int 50

.text
.global semantic_search

semantic_search:
    ; Entrée : $QUERY (texte de recherche)
    ; Sortie : $RESULTS (sphères trouvées)
    
    PUSH            $R0-$R10
    
    ; ---- Étape 1 : Compression de la requête ----
    SEM_COMPRESS    $Q_COMPRESSED, $QUERY
    
    ; ---- Étape 2 : Trouver le point de départ ----
    ; Chercher la sphère la plus proche
    SPHERE_NEAREST  $START, $Q_COMPRESSED
    
    ; Si aucune sphère proche, créer une temporaire
    CMP             $START, NULL
    JNE             start_found
    
    ; Créer une sphère temporaire
    CALC_POSITION   $TEMP_POS, $Q_COMPRESSED
    SPHERE_CREATE   $START, $TEMP_POS, $Q_COMPRESSED, temporary=true
    
start_found:
    ; ---- Étape 3 : Raytracing multi-directionnel ----
    ; Initialiser 26 rayons (toutes directions)
    RAYS_INIT       $RAYS, $START.position, count=26
    
    ; Tableau pour stocker les intersections
    ARRAY_CREATE    $INTERSECTIONS, max_size=1000
    
    ; Pour chaque rayon
    MOV             $R0, 0
ray_loop:
    CMP             $R0, 26
    JGE             ray_loop_end
    
    ; Tracer le rayon
    RAYTRACE        $PATH, $RAYS[$R0], distance=$search_radius
    
    ; Collecter les intersections
    APPEND_UNIQUE   $INTERSECTIONS, $PATH.intersections
    
    INC             $R0
    JMP             ray_loop
    
ray_loop_end:
    
    ; ---- Étape 4 : Activation floue ----
    ; Activer la sphère de départ
    ACTIVATE        $START, 1.0
    
    ; File pour propagation (BFS)
    QUEUE_CREATE    $PROPAGATION
    QUEUE_PUSH      $PROPAGATION, $START
    
    ; Propagation de l'activation
propagation_loop:
    QUEUE_EMPTY     $EMPTY, $PROPAGATION
    CMP             $EMPTY, true
    JE              propagation_end
    
    ; Prendre la prochaine sphère
    QUEUE_POP       $CURRENT, $PROPAGATION
    
    ; Trouver les voisins
    NEIGHBORS_FIND  $NEIGHBORS, $CURRENT, radius=50
    
    ; Pour chaque voisin
    FOR_EACH        $NEIGHBOR IN $NEIGHBORS:
        ; Calculer la distance
        DISTANCE_CALC $DIST, $CURRENT.position, $NEIGHBOR.position
        
        ; Calculer l'activation décroissante
        ACTIVATION_CALC $NEW_ACT, $CURRENT.activation, $DIST, $activation_decay
        
        ; Si activation suffisante
        CMP         $NEW_ACT, $min_activation
        JL          skip_neighbor
        
        ; Mettre à jour l'activation
        ACTIVATE_ADD $NEIGHBOR, $NEW_ACT
        
        ; Ajouter à la file si pas déjà traité
        IF_NOT_VISITED $NEIGHBOR:
            QUEUE_PUSH $PROPAGATION, $NEIGHBOR
            MARK_VISITED $NEIGHBOR
        
    skip_neighbor:
    END_FOR
    
    JMP             propagation_loop
    
propagation_end:
    
    ; ---- Étape 5 : Collecte et scoring ----
    ; Collecter toutes les sphères activées
    COLLECT_ACTIVE  $ACTIVE_SPHERES, threshold=$min_activation
    
    ; Calculer les scores finaux
    FOR_EACH        $SPHERE IN $ACTIVE_SPHERES:
        ; Score = activation × relevance × freshness
        RELEVANCE_CALC $REL, $SPHERE, $Q_COMPRESSED
        FRESHNESS_CALC $FRESH, $SPHERE.last_modified
        
        MUL         $SCORE, $SPHERE.activation, $REL
        MUL         $SCORE, $SCORE, $FRESH
        
        SCORE_SET   $SPHERE, $SCORE
    END_FOR
    
    ; ---- Étape 6 : Tri et filtrage ----
    ; Trier par score décroissant
    SORT_BY_SCORE   $ACTIVE_SPHERES, descending=true
    
    ; Limiter aux N meilleurs
    LIMIT           $RESULTS, $ACTIVE_SPHERES, $max_results
    
    ; ---- Étape 7 : Post-traitement ----
    ; Enrichir avec les métadonnées
    FOR_EACH        $RESULT IN $RESULTS:
        ; Charger le document associé
        IF          $RESULT.documentId:
            DOC_LOAD $DOC, $RESULT.documentId
            ATTACH   $RESULT, 'document', $DOC
        
        ; Ajouter le contexte
        CONTEXT_BUILD $CTX, $RESULT, radius=20
        ATTACH      $RESULT, 'context', $CTX
    END_FOR
    
    ; ---- Étape 8 : Cache et métriques ----
    ; Mettre en cache pour requêtes futures
    CACHE_STORE     $QUERY, $RESULTS, ttl=3600
    
    ; Métriques
    METRICS_UPDATE  'searches_performed'
    METRICS_TIMING  'search_latency', START_TIME
    
    POP             $R0-$R10
    RET
```

## 🧠 Analyse Psychologique d'un Texte

```assembly
; ================================================================
; Programme : Analyse Psychologique avec SPU-PSY
; Description : Détection d'état mental et risques
; ================================================================

.data
    crisis_keywords:    .chinese "死", "绝望", "痛苦", "自杀", "结束"
    support_threshold:  .float 0.6
    crisis_threshold:   .float 0.8

.text
.global psychological_analysis

psychological_analysis:
    ; Entrée : $TEXT (message à analyser)
    ; Sortie : $ASSESSMENT (évaluation psychologique)
    
    PUSH            $R0-$R12
    
    ; ---- Phase 1 : Compression et extraction ----
    SEM_COMPRESS    $COMPRESSED, $TEXT
    
    ; Extraire les caractères émotionnels
    EXTRACT_EMOTIONAL $EMO_CHARS, $COMPRESSED
    
    ; ---- Phase 2 : Analyses parallèles spécialisées ----
    PARALLEL_START
        ; Nano-modèles psychologiques
        LLM_EXEC    $MOOD, 'mood-detector', $COMPRESSED
        LLM_EXEC    $STRESS, 'stress-analyzer', $COMPRESSED
        LLM_EXEC    $ANXIETY, 'anxiety-detector', $COMPRESSED
        LLM_EXEC    $DEPRESSION, 'depression-screen', $COMPRESSED
        LLM_EXEC    $CRISIS, 'crisis-detector', $COMPRESSED
        
        ; Analyses comportementales
        LLM_EXEC    $COPING, 'coping-mechanisms', $COMPRESSED
        LLM_EXEC    $SUPPORT, 'support-needs', $COMPRESSED
        LLM_EXEC    $RESILIENCE, 'resilience-factors', $COMPRESSED
    PARALLEL_END
    
    ; ---- Phase 3 : Détection de crise ----
    ; Vérifier les mots-clés de crise
    INTERSECT       $CRISIS_CHARS, $EMO_CHARS, $crisis_keywords
    COUNT           $CRISIS_COUNT, $CRISIS_CHARS
    
    ; Si mots de crise détectés
    CMP             $CRISIS_COUNT, 0
    JG              crisis_protocol
    
    ; Vérifier le score de crise
    CMP             $CRISIS.score, $crisis_threshold
    JGE             crisis_protocol
    
    ; ---- Phase 4 : Évaluation standard ----
    JMP             standard_assessment

crisis_protocol:
    ; PROTOCOLE D'URGENCE
    PUSH            $ALL_REGS
    
    ; Notification immédiate
    ALERT           'CRISIS_TEAM', priority='IMMEDIATE'
    
    ; Log sécurisé
    SECURE_LOG      'CRISIS_DETECTED', $TEXT, $CRISIS
    
    ; Générer réponse de soutien immédiat
    TEMPLATE_LOAD   $CRISIS_RESPONSE, 'crisis_support'
    PERSONALIZE     $CRISIS_RESPONSE, context=$COMPRESSED
    
    ; Activer les ressources
    RESOURCES_GET   $RESOURCES, type='crisis_hotlines'
    APPEND          $CRISIS_RESPONSE, $RESOURCES
    
    ; Marquer pour suivi
    FLAG_FOR_FOLLOWUP $TEXT, priority='CRITICAL'
    
    POP             $ALL_REGS
    JMP             build_assessment

standard_assessment:
    ; ---- Phase 5 : Analyse approfondie ----
    
    ; Calculer le profil psychologique
    PROFILE_CREATE  $PROFILE
    
    ; Dimensions émotionnelles
    DIMENSION_ADD   $PROFILE, 'mood', $MOOD
    DIMENSION_ADD   $PROFILE, 'stress', $STRESS
    DIMENSION_ADD   $PROFILE, 'anxiety', $ANXIETY
    DIMENSION_ADD   $PROFILE, 'depression', $DEPRESSION
    
    ; Facteurs de protection
    FACTOR_ADD      $PROFILE, 'coping', $COPING
    FACTOR_ADD      $PROFILE, 'support', $SUPPORT
    FACTOR_ADD      $PROFILE, 'resilience', $RESILIENCE
    
    ; ---- Phase 6 : Positionnement spatial ----
    
    ; Calculer la position dans l'espace PSY
    CALC_PSY_POSITION $PSY_POS, $PROFILE
    
    ; Créer une sphère psychologique
    SPHERE_CREATE   $PSY_SPHERE, $PSY_POS, type='psychological'
    
    ; Chercher des patterns similaires
    SPHERE_SEARCH   $SIMILAR, $PSY_POS, radius=30
    
    ; Identifier les patterns
    PATTERN_MATCH   $PATTERNS, $SIMILAR
    
build_assessment:
    ; ---- Phase 7 : Construction de l'évaluation ----
    
    ASSESSMENT_CREATE $ASSESSMENT
    
    ; Résumé général
    SUMMARY_BUILD   $SUMMARY, $PROFILE, $PATTERNS
    ATTACH          $ASSESSMENT, 'summary', $SUMMARY
    
    ; Niveau de risque
    RISK_CALCULATE  $RISK_LEVEL, $PROFILE
    ATTACH          $ASSESSMENT, 'risk', $RISK_LEVEL
    
    ; Recommandations
    RECOMMEND_BUILD $RECOMMENDATIONS, $PROFILE, $PATTERNS
    ATTACH          $ASSESSMENT, 'recommendations', $RECOMMENDATIONS
    
    ; Si besoin de support
    CMP             $SUPPORT.score, $support_threshold
    JL              skip_resources
    
    ; Ajouter des ressources
    RESOURCES_GET   $HELP_RESOURCES, level=$SUPPORT.level
    ATTACH          $ASSESSMENT, 'resources', $HELP_RESOURCES
    
skip_resources:
    
    ; ---- Phase 8 : Suivi et apprentissage ----
    
    ; Sauvegarder pour suivi longitudinal
    TIMELINE_ADD    $PSY_SPHERE, timestamp=NOW
    
    ; Si pattern récurrent détecté
    IF              $PATTERNS.recurring:
        FLAG_FOR_REVIEW 'PATTERN_DETECTED', $PATTERNS
    
    ; Apprentissage du système
    IF              $ASSESSMENT.confidence < 0.7:
        QUEUE_FOR_TRAINING $TEXT, $ASSESSMENT
    
    ; Métriques
    METRICS_UPDATE  'psychological_assessments'
    
    POP             $R0-$R12
    RET

; ================================================================
; Sous-routine : Calcul de position psychologique
; ================================================================

CALC_PSY_POSITION:
    ; Mapping des dimensions vers coordonnées 3D
    ; X : spectre positif-négatif
    ; Y : niveau d'énergie/activation  
    ; Z : stabilité temporelle
    
    ; Calcul de X (valence émotionnelle)
    SUB             $X, $PROFILE.mood, 0.5
    MUL             $X, $X, 200
    
    ; Calcul de Y (activation)
    ADD             $Y, $PROFILE.stress, $PROFILE.anxiety
    MUL             $Y, $Y, 100
    
    ; Calcul de Z (stabilité)
    SUB             $Z, 1.0, $PROFILE.depression
    ADD             $Z, $Z, $PROFILE.resilience
    MUL             $Z, $Z, 50
    
    ; Créer la position
    POSITION_CREATE $PSY_POS, $X, $Y, $Z
    
    RET
```

## 🎓 Évaluation Éducative

```assembly
; ================================================================
; Programme : Évaluation de Compréhension avec SPU-EDU
; Description : Analyse approfondie des réponses d'étudiants
; ================================================================

.data
    concept_map:        .pointer concept_knowledge_base
    rubric:            .pointer evaluation_rubric
    passing_score:     .float 0.7

.text
.global educational_assessment

educational_assessment:
    ; Entrée : $ANSWER (réponse de l'étudiant)
    ;         $EXPECTED (concepts attendus)
    ; Sortie : $EVALUATION (note et feedback)
    
    PUSH            $R0-$R15
    
    ; ---- Phase 1 : Préparation ----
    SEM_COMPRESS    $ANS_COMPRESSED, $ANSWER
    SEM_COMPRESS    $EXP_COMPRESSED, $EXPECTED
    
    ; ---- Phase 2 : Analyse multi-dimensionnelle ----
    PARALLEL_START
        ; Compréhension conceptuelle
        LLM_EXEC    $UNDERSTANDING, 'concept-understanding', $ANS_COMPRESSED
        
        ; Profondeur de l'analyse
        LLM_EXEC    $DEPTH, 'analysis-depth', $ANS_COMPRESSED
        
        ; Précision technique
        LLM_EXEC    $ACCURACY, 'technical-accuracy', $ANS_COMPRESSED
        
        ; Créativité et insights
        LLM_EXEC    $CREATIVITY, 'creative-insights', $ANS_COMPRESSED
        
        ; Structure et cohérence
        LLM_EXEC    $STRUCTURE, 'answer-structure', $ANS_COMPRESSED
        
        ; Erreurs et misconceptions
        LLM_EXEC    $ERRORS, 'misconception-detector', $ANS_COMPRESSED
    PARALLEL_END
    
    ; ---- Phase 3 : Comparaison avec l'attendu ----
    
    ; Extraire les concepts de la réponse
    CONCEPTS_EXTRACT $STUDENT_CONCEPTS, $ANS_COMPRESSED
    CONCEPTS_EXTRACT $EXPECTED_CONCEPTS, $EXP_COMPRESSED
    
    ; Calculer la couverture
    INTERSECT       $COVERED, $STUDENT_CONCEPTS, $EXPECTED_CONCEPTS
    DIFFERENCE      $MISSING, $EXPECTED_CONCEPTS, $STUDENT_CONCEPTS
    DIFFERENCE      $EXTRA, $STUDENT_CONCEPTS, $EXPECTED_CONCEPTS
    
    ; Ratios de couverture
    COUNT           $COVERED_COUNT, $COVERED
    COUNT           $EXPECTED_COUNT, $EXPECTED_CONCEPTS
    DIV             $COVERAGE_RATIO, $COVERED_COUNT, $EXPECTED_COUNT
    
    ; ---- Phase 4 : Navigation dans le graphe de connaissances ----
    
    ; Pour chaque concept mentionné
    FOR_EACH        $CONCEPT IN $STUDENT_CONCEPTS:
        ; Trouver dans l'espace
        SPHERE_FIND $SPHERE, $CONCEPT
        
        ; Vérifier les connexions
        EDGES_GET   $EDGES, $SPHERE
        
        ; Évaluer la compréhension des relations
        RELATION_EVAL $REL_SCORE, $EDGES, $ANSWER
        
        ; Ajouter au score global
        SCORE_ADD   $CONCEPT_SCORES, $CONCEPT, $REL_SCORE
    END_FOR
    
    ; ---- Phase 5 : Calcul du score final ----
    
    ; Pondération des critères
    MUL             $S1, $UNDERSTANDING.score, 0.3
    MUL             $S2, $DEPTH.score, 0.2
    MUL             $S3, $ACCURACY.score, 0.25
    MUL             $S4, $COVERAGE_RATIO, 0.15
    MUL             $S5, $STRUCTURE.score, 0.1
    
    ; Score total
    ADD             $TOTAL_SCORE, $S1, $S2
    ADD             $TOTAL_SCORE, $TOTAL_SCORE, $S3
    ADD             $TOTAL_SCORE, $TOTAL_SCORE, $S4
    ADD             $TOTAL_SCORE, $TOTAL_SCORE, $S5
    
    ; Ajustements
    IF              $CREATIVITY.exceptional:
        ADD         $TOTAL_SCORE, $TOTAL_SCORE, 0.1
    
    IF              $ERRORS.critical:
        MUL         $TOTAL_SCORE, $TOTAL_SCORE, 0.7
    
    ; ---- Phase 6 : Génération du feedback ----
    
    FEEDBACK_CREATE $FEEDBACK
    
    ; Points forts
    IF              $UNDERSTANDING.score > 0.8:
        FEEDBACK_ADD $FEEDBACK, "Excellente compréhension des concepts"
    
    IF              $CREATIVITY.score > 0.8:
        FEEDBACK_ADD $FEEDBACK, "Approche créative et originale"
    
    ; Points à améliorer
    IF              $MISSING_COUNT > 0:
        FEEDBACK_ADD $FEEDBACK, "Concepts manquants:", $MISSING
    
    IF              $ERRORS.count > 0:
        FEEDBACK_ADD $FEEDBACK, "Erreurs à corriger:", $ERRORS.list
    
    ; Suggestions personnalisées
    LEARNING_PATH   $SUGGESTIONS, $MISSING, $ERRORS
    FEEDBACK_ADD    $FEEDBACK, "Suggestions:", $SUGGESTIONS
    
    ; ---- Phase 7 : Construction de l'évaluation ----
    
    EVALUATION_CREATE $EVALUATION
    ATTACH          $EVALUATION, 'score', $TOTAL_SCORE
    ATTACH          $EVALUATION, 'feedback', $FEEDBACK
    ATTACH          $EVALUATION, 'details', $CONCEPT_SCORES
    ATTACH          $EVALUATION, 'rubric', $rubric
    
    ; Grade letter
    CALL            score_to_grade
    ATTACH          $EVALUATION, 'grade', $GRADE
    
    ; ---- Phase 8 : Tracking et analytics ----
    
    ; Sauvegarder pour le suivi de progression
    STUDENT_PROFILE $PROFILE, student_id
    PROGRESS_UPDATE $PROFILE, $EVALUATION
    
    ; Identifier les patterns d'apprentissage
    LEARNING_PATTERN $PATTERN, $PROFILE.history
    
    IF              $PATTERN.struggling:
        FLAG_FOR_SUPPORT student_id, $PATTERN
    
    ; Métriques
    METRICS_UPDATE  'assessments_completed'
    
    POP             $R0-$R15
    RET

; Sous-routine : Conversion score vers grade
score_to_grade:
    CMP             $TOTAL_SCORE, 0.9
    JGE             grade_a
    CMP             $TOTAL_SCORE, 0.8
    JGE             grade_b
    CMP             $TOTAL_SCORE, 0.7
    JGE             grade_c
    CMP             $TOTAL_SCORE, 0.6
    JGE             grade_d
    JMP             grade_f
    
grade_a:
    MOV             $GRADE, 'A'
    RET
grade_b:
    MOV             $GRADE, 'B'
    RET
grade_c:
    MOV             $GRADE, 'C'
    RET
grade_d:
    MOV             $GRADE, 'D'
    RET
grade_f:
    MOV             $GRADE, 'F'
    RET
```

---

*Ces exemples montrent la puissance et la flexibilité de l'assembleur SPU pour des tâches complexes.*

→ Suivant : [Cas d'usage par domaine](./02-domain-examples.md)