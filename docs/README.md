# Documentation QWANYX - Structure Multi-Niveaux

## 📚 Organisation de la Documentation

```
docs/
├── 01-core/                 # Niveau 1: Core QWANYX
│   ├── api-reference.md     # Endpoints de base
│   ├── authentication.md    # Système auth JWT
│   ├── data-models.md       # Modèles de base
│   └── deployment.md        # Guide déploiement
│
├── 02-templates/            # Niveau 2: Templates Métier
│   ├── bakery/             # Template Boulangerie
│   │   ├── README.md       # Guide boulangerie
│   │   ├── roles.md        # Rôles standards
│   │   └── workflows.md    # Processus métier
│   ├── garage/             # Template Garage
│   │   ├── README.md
│   │   ├── parts-api.md
│   │   └── compatibility.md
│   └── pharmacy/           # Template Pharmacie
│
├── 03-instances/           # Niveau 3: Clients Spécifiques
│   ├── autodin/           # Documentation Autodin
│   │   ├── README.md
│   │   ├── custom-api.md
│   │   └── team-setup.md
│   └── template.md        # Template pour nouveaux clients
│
├── 04-dh/                 # Digital Human Documentation
│   ├── architecture.md   # Architecture DH
│   ├── memory-chain.md   # Système de mémoire
│   ├── skills.md         # Skills disponibles
│   └── conversation.md   # Guide conversation
│
└── 05-dev/               # Documentation Développeur
    ├── setup-local.md    # Dev environnement Windows
    ├── git-workflow.md   # Push/Pull workflow
    ├── testing.md        # Tests et QA
    └── contributing.md   # Guide contribution
```

## 🎯 Pour qui ?

### Développeurs Core QWANYX
→ `docs/01-core/` + `docs/05-dev/`

### Partenaires Template (franchise)
→ `docs/02-templates/{leur-métier}/`

### Clients B2B (Autodin, etc.)
→ `docs/03-instances/{leur-instance}/`

### Équipe DH/IA
→ `docs/04-dh/`

## 📖 Conventions

### Nommage des fichiers
- `README.md` : Vue d'ensemble du dossier
- `api-*.md` : Documentation API
- `guide-*.md` : Guides utilisateur
- `setup-*.md` : Installation/configuration

### Structure des documents
```markdown
# Titre Principal

## Vue d'ensemble
Brève description

## Prérequis
- Item 1
- Item 2

## Guide étape par étape
1. Étape 1
2. Étape 2

## API Reference (si applicable)
### GET /endpoint
```

## 🚀 Quick Start

1. **Nouveau développeur ?** → [`docs/05-dev/setup-local.md`](05-dev/setup-local.md)
2. **Nouveau template métier ?** → [`docs/02-templates/README.md`](02-templates/README.md)
3. **Nouveau client B2B ?** → [`docs/03-instances/template.md`](03-instances/template.md)
4. **Travailler sur les DH ?** → [`docs/04-dh/architecture.md`](04-dh/architecture.md)

## 🔄 Maintenance

La documentation suit le code :
- Chaque nouvelle feature → doc mise à jour
- Chaque nouveau client → nouveau dossier dans `03-instances/`
- Chaque nouveau template → nouveau dossier dans `02-templates/`

## 📝 Templates de Documentation

Utilisez les templates dans chaque section pour maintenir la cohérence :
- [`Template API Doc`](01-core/api-template.md)
- [`Template Client Instance`](03-instances/template.md)
- [`Template Business Template`](02-templates/template.md)