# @qwanyx/bulma-components

React component library based on Bulma CSS framework for QWANYX applications.

## Architecture

```
qwanyx-bulma-components/
├── src/
│   ├── components/          # Core Bulma components as React components
│   │   ├── Button/
│   │   │   ├── index.ts     # Barrel export
│   │   │   ├── Button.tsx   # Component implementation
│   │   │   ├── Button.types.ts  # TypeScript types
│   │   │   └── Button.test.tsx  # Tests
│   │   ├── Container/
│   │   ├── Column/
│   │   ├── Card/
│   │   └── ...
│   │
│   ├── composites/          # Custom QWANYX components built using core components
│   │   ├── QwanyxNavbar/
│   │   ├── QwanyxAuth/
│   │   ├── ServiceCard/
│   │   └── WorkspaceCard/
│   │
│   ├── themes/              # Theme configurations
│   │   ├── default.ts
│   │   ├── autodin.ts
│   │   └── belgicomics.ts
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useTheme.ts
│   │   └── useBreakpoint.ts
│   │
│   ├── utils/               # Utility functions
│   │   └── classNames.ts
│   │
│   ├── types/               # Shared TypeScript types
│   │   └── index.ts
│   │
│   └── index.ts             # Main export file
│
├── playground/              # Kitchen sink for testing
│   ├── src/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── index.html
│
└── dist/                    # Built library (generated)
```

## Usage Examples

### Basic Components (Bulma wrappers)
```jsx
import { Button, Container, Column, Card } from '@qwanyx/bulma-components';

// These are pure Bulma components with React props
<Container>
  <Column size="half">
    <Card>
      <Button color="primary" size="large" loading={isLoading}>
        Click me
      </Button>
    </Card>
  </Column>
</Container>
```

### Composite Components (QWANYX custom)
```jsx
import { QwanyxNavbar, ServiceCard } from '@qwanyx/bulma-components/composites';

// These are composed from basic components
<QwanyxNavbar 
  logo="/logo.png"
  theme="autodin"
  user={currentUser}
/>

<ServiceCard
  icon="fa-car"
  title="Auto Parts"
  description="Find the parts you need"
  action={{ label: "Browse", onClick: handleBrowse }}
/>
```

### Tree-shaking Support
```jsx
// Import only what you need - the rest won't be bundled
import Button from '@qwanyx/bulma-components/components/Button';
import QwanyxAuth from '@qwanyx/bulma-components/composites/QwanyxAuth';
```

## Design Principles

1. **Bulma First**: All basic components follow Bulma's API and naming conventions
2. **Tree-shakeable**: Each component is independently importable
3. **TypeScript Ready**: Full type support for better DX
4. **Theme-able**: Support for multiple themes via CSS variables
5. **Composable**: Basic components can be composed into complex ones
6. **Zero Config**: Works out of the box with Bulma CSS

## Component Categories

### Core Components (1:1 with Bulma)
- Layout: Container, Section, Hero, Level, Media
- Columns: Columns, Column
- Elements: Box, Button, Content, Icon, Image, Notification, Progress, Table, Tag, Title
- Components: Card, Dropdown, Menu, Message, Modal, Navbar, Pagination, Panel, Tabs
- Form: Field, Control, Input, Textarea, Select, Checkbox, Radio, File

### Composite Components (QWANYX specific)
- QwanyxNavbar: Standard navbar with auth integration
- QwanyxAuth: Authentication wrapper with email-only flow
- ServiceCard: Reusable service display card
- WorkspaceCard: Special card for workspace type
- QwanyxDrawer: Slide-out navigation drawer