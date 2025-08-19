# @qwanyx/ui - Atomic Design Structure

## 📚 Atomic Design Hierarchy

### ⚛️ Atoms (Basic Building Blocks)
The smallest, indivisible components. No dependencies on other components.

```typescript
// Current Atoms
├── Button.tsx
├── Input.tsx
├── Label.tsx
├── Icon.tsx
├── Text.tsx
├── Avatar.tsx
├── Badge.tsx
├── Link.tsx

// To Be Developed
├── Checkbox.tsx
├── Radio.tsx
├── Toggle.tsx
├── Spinner.tsx
├── Divider.tsx
├── Tooltip.tsx
├── Chip.tsx
└── Progress.tsx
```

### 🧬 Molecules (Simple Combinations)
Combinations of atoms that form functional units.

```typescript
// Current Molecules
├── Form.tsx (Input + Label + Button)
├── Card.tsx (Container + Text)
├── Modal.tsx (Container + Button + Icon)
├── OTPInput.tsx (Multiple Inputs)

// To Be Developed
├── FormField.tsx (Label + Input + Error)
├── SearchBar.tsx (Input + Icon + Button)
├── NavItem.tsx (Link + Icon + Badge)
├── Alert.tsx (Icon + Text + Button)
├── Dropdown.tsx (Button + List)
├── Breadcrumb.tsx (Links + Dividers)
├── Pagination.tsx (Buttons + Text)
└── Rating.tsx (Icons + Text)
```

### 🦠 Organisms (Complex Components)
Complex, reusable components built from molecules and atoms.

```typescript
// Current Organisms
├── Navbar.tsx
├── Footer.tsx
├── Sidebar.tsx
├── DashboardLayout.tsx
├── Hero.tsx
├── Feature.tsx

// To Be Developed
├── DataTable.tsx
├── Calendar.tsx
├── FileUploader.tsx
├── CommentSection.tsx
├── ProductCard.tsx
├── UserProfile.tsx
├── NotificationCenter.tsx
└── SearchResults.tsx
```

### 📄 Templates (Page Layouts)
Page-level structures that define content placement.

```typescript
// Current Templates
├── QwanyxTemplate.tsx

// To Be Developed
├── DashboardTemplate.tsx
├── MarketplaceTemplate.tsx
├── AuthTemplate.tsx
├── LandingTemplate.tsx
├── ProfileTemplate.tsx
├── SettingsTemplate.tsx
└── AdminTemplate.tsx
```

### 📱 Pages (Complete Implementations)
Full page implementations using templates.

```typescript
// Current Pages
├── DashboardPage.tsx
├── LandingPage.tsx
├── MarketplacePage.tsx

// To Be Developed
├── LoginPage.tsx
├── RegisterPage.tsx
├── ProfilePage.tsx
├── SettingsPage.tsx
├── ProductPage.tsx
├── CheckoutPage.tsx
└── AdminPage.tsx
```

## 🏗️ Refactoring Plan

### Phase 1: Reorganize Existing Components

```bash
packages/qwanyx-ui/src/
├── atoms/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
│   └── ...
├── molecules/
│   ├── FormField/
│   │   ├── FormField.tsx
│   │   ├── FormField.test.tsx
│   │   ├── FormField.stories.tsx
│   │   └── index.ts
│   └── ...
├── organisms/
│   ├── DataTable/
│   │   ├── DataTable.tsx
│   │   ├── DataTable.test.tsx
│   │   ├── DataTable.stories.tsx
│   │   └── index.ts
│   └── ...
├── templates/
│   └── ...
├── pages/
│   └── ...
└── index.ts
```

### Phase 2: Component Standards

Every component MUST have:

```typescript
// Component.tsx - Main component
export interface ComponentProps {
  // Strongly typed props
  className?: string; // Always optional
  children?: React.ReactNode;
  // ... specific props
}

export const Component: React.FC<ComponentProps> = ({
  className,
  children,
  ...props
}) => {
  // Implementation
};

// Component.test.tsx - Unit tests
describe('Component', () => {
  it('renders without crashing', () => {});
  it('handles all props correctly', () => {});
  it('is accessible', () => {});
});

// Component.stories.tsx - Storybook stories
export default {
  title: 'Atoms/Component',
  component: Component,
};

export const Default = {};
export const WithProps = { args: { /* props */ } };

// index.ts - Export
export { Component } from './Component';
export type { ComponentProps } from './Component';
```

### Phase 3: Composition Rules

#### Atoms → Molecules
```typescript
// Good: FormField composed of atoms
const FormField = () => (
  <>
    <Label />
    <Input />
    <Text /> {/* for errors */}
  </>
);

// Bad: FormField using native HTML
const FormField = () => (
  <div>
    <label />
    <input />
    <span />
  </div>
);
```

#### Molecules → Organisms
```typescript
// Good: LoginForm composed of molecules
const LoginForm = () => (
  <Form>
    <FormField name="email" />
    <FormField name="password" />
    <Button type="submit" />
  </Form>
);
```

#### Organisms → Templates
```typescript
// Good: DashboardTemplate with organisms
const DashboardTemplate = () => (
  <Container>
    <Navbar />
    <Sidebar />
    <MainContent />
    <Footer />
  </Container>
);
```

## 🎨 Styling Strategy

### 1. Base Styles (Atoms)
```css
/* atoms/Button/Button.module.css */
.button {
  /* Base button styles */
}

.button--primary { }
.button--secondary { }
.button--large { }
.button--small { }
```

### 2. Composition Styles (Molecules+)
```css
/* molecules/FormField/FormField.module.css */
.formField {
  /* Layout for label + input + error */
}

.formField__label { }
.formField__input { }
.formField__error { }
```

### 3. Theme Variables
```css
/* styles/variables.css */
:root {
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  
  /* Colors */
  --color-primary: var(--theme-primary);
  --color-secondary: var(--theme-secondary);
  
  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.25rem;
}
```

## 🧪 Testing Strategy

### Atoms: Unit Tests
```typescript
test('Button renders with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Molecules: Integration Tests
```typescript
test('FormField shows error when invalid', () => {
  render(<FormField error="Required field" />);
  expect(screen.getByText('Required field')).toBeInTheDocument();
});
```

### Organisms: Behavior Tests
```typescript
test('LoginForm submits with valid data', async () => {
  const onSubmit = jest.fn();
  render(<LoginForm onSubmit={onSubmit} />);
  
  fireEvent.change(screen.getByLabelText('Email'), {
    target: { value: 'test@example.com' }
  });
  
  fireEvent.click(screen.getByText('Submit'));
  
  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com'
    });
  });
});
```

## 📦 Export Strategy

```typescript
// packages/qwanyx-ui/src/index.ts

// Atoms
export * from './atoms';

// Molecules
export * from './molecules';

// Organisms
export * from './organisms';

// Templates
export * from './templates';

// Pages (optional, might be app-specific)
export * from './pages';

// Utilities
export * from './utils';

// Hooks
export * from './hooks';

// Types
export * from './types';
```

## 🚀 Migration Checklist

- [ ] Create atomic folder structure
- [ ] Move existing components to appropriate levels
- [ ] Add missing atoms
- [ ] Create essential molecules
- [ ] Build required organisms
- [ ] Develop base templates
- [ ] Write tests for all components
- [ ] Create Storybook stories
- [ ] Update documentation
- [ ] Version bump to 2.0.0

## 📐 Usage Guidelines

### DO ✅
- Always compose from smaller parts
- Keep atoms pure and simple
- Make molecules focused on one task
- Build organisms for specific use cases
- Use templates for consistent layouts

### DON'T ❌
- Never use native HTML in components
- Don't create "god components"
- Avoid deep nesting (max 3 levels)
- Don't mix atomic levels
- Never bypass the component system

---

**Goal:** Make @qwanyx/ui so complete that developers never need to write HTML or create basic components again.