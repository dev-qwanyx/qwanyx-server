# QWANYX UI - Système de Thèmes CSS

## Vue d'ensemble

Le système de thèmes de qwanyx-ui est entièrement basé sur CSS, permettant une personnalisation élégante et performante.

## Structure des thèmes

### 1. Base Theme (`themes/base.css`)
Définit TOUTES les variables CSS disponibles :
- Couleurs (primary, secondary, accent, etc.)
- Surfaces (card, modal, popover)
- Texte (primary, secondary, muted)
- Bordures et ombres
- Images et filtres

### 2. Light Theme (`themes/light.css`)
Utilise les valeurs par défaut de base.css

### 3. Dark Theme (`themes/dark.css`)
Override toutes les variables pour le mode sombre

### 4. Images Theme (`themes/images.css`)
Classes utilitaires pour images adaptatives :
- `.theme-image` - Applique les filtres selon le thème
- `.theme-invert` - Inverse les couleurs en dark mode
- `.theme-dim` - Assombrit en dark mode
- `.brand-logo-light/dark` - Logos différents selon le thème

## Comment personnaliser pour votre application

### 1. Créer un fichier de thème
```css
/* mon-app-theme.css */

/* Override les couleurs de base */
:root {
  --qwanyx-primary: 230 126 34;  /* Orange */
  --qwanyx-primary-hover: 211 84 0;
}

/* Dark mode overrides */
[data-theme="dark"] {
  --qwanyx-primary: 243 156 18;  /* Orange plus clair */
}
```

### 2. Importer après qwanyx-ui
```tsx
import '@qwanyx/ui/dist/ui.css'
import './styles/mon-app-theme.css'
```

### 3. Utiliser les classes d'images
```tsx
// Logo qui s'adapte au thème
<img src="/logo.png" className="theme-logo" />

// Image qui s'inverse en dark mode
<img src="/icon.svg" className="theme-invert" />

// Logos différents selon le thème
<div className="brand-logo-light" style={{'--logo-light': 'url(/logo-light.png)'}} />
<div className="brand-logo-dark" style={{'--logo-dark': 'url(/logo-dark.png)'}} />
```

## Variables disponibles

### Couleurs principales
- `--qwanyx-primary` : Couleur principale
- `--qwanyx-secondary` : Couleur secondaire
- `--qwanyx-accent` : Couleur d'accent
- `--qwanyx-success/warning/error/info` : Couleurs sémantiques

### Layout
- `--qwanyx-background` : Arrière-plan principal
- `--qwanyx-foreground` : Couleur du texte principal
- `--qwanyx-card` : Arrière-plan des cartes
- `--qwanyx-border` : Couleur des bordures

### Images
- `--qwanyx-image-filter` : Filtres CSS pour images
- `--qwanyx-image-brightness` : Luminosité (0.9 en dark)
- `--qwanyx-image-contrast` : Contraste (1.1 en dark)
- `--qwanyx-logo-filter` : Filtres spécifiques aux logos

## Exemple complet : Autodin

Voir `autodin-be/src/styles/autodin-theme.css` pour un exemple complet de personnalisation avec :
- Couleurs de marque (orange)
- Images adaptatives
- Composants spécifiques
- Support complet light/dark

## Avantages du système CSS

1. **Performance** : Pas de re-render JavaScript
2. **Élégance** : Transitions fluides entre thèmes
3. **Simplicité** : Juste des variables CSS
4. **Flexibilité** : Override seulement ce qui diffère
5. **Images** : Gestion native via filtres CSS
6. **Héritage** : Les enfants héritent automatiquement