# QWANYX-UI Studio Roadmap

## Phase 1: Component Reorganization (Week 1)

### Step 1: Atomic Folder Structure
Create the atomic design structure WITHOUT breaking existing imports:

```bash
src/
├── components/          # Keep existing files here temporarily
│   ├── Button.tsx
│   ├── Card.tsx
│   └── ...
├── atoms/              # New structure
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   └── ...
├── molecules/
├── organisms/
└── index.ts           # Export from both old and new locations
```

### Step 2: Gradual Migration
1. Copy component to new location
2. Update with proper atomic structure
3. Keep old file as re-export
4. Update imports over time
5. Remove old file when safe

### Step 3: Studio Atomic View
```typescript
// New AtomicShowcase.tsx
const AtomicShowcase = () => {
  return (
    <Tabs defaultValue="atoms">
      <TabsList>
        <TabsTrigger value="atoms">Atoms</TabsTrigger>
        <TabsTrigger value="molecules">Molecules</TabsTrigger>
        <TabsTrigger value="organisms">Organisms</TabsTrigger>
      </TabsList>
      
      <TabsContent value="atoms">
        {/* Display all atom components */}
      </TabsContent>
      {/* ... */}
    </Tabs>
  );
};
```

## Phase 2: Live Component Development (Week 2-4)

### Understanding the Challenge
AI-assisted component development needs:
1. **Hot Module Replacement (HMR)** - Already works with Vite
2. **Dynamic Component Loading** - Load components without rebuild
3. **Runtime Compilation** - Compile TypeScript/JSX in browser
4. **State Persistence** - Keep component state during edits

### Proposed Architecture

```typescript
// Component Development Mode
interface LiveComponentEditor {
  // Source code editor
  code: string;
  
  // Live preview panel
  preview: React.ComponentType;
  
  // Props editor
  props: Record<string, any>;
  
  // Real-time compilation
  compile: (code: string) => Promise<ComponentType>;
}
```

### Technical Approach Options

#### Option 1: Monaco Editor + Sucrase (Lightweight)
```typescript
import * as monaco from 'monaco-editor';
import { transform } from 'sucrase';

const compileComponent = (code: string) => {
  // Transform JSX to JS
  const js = transform(code, {
    transforms: ['jsx', 'typescript']
  }).code;
  
  // Create component dynamically
  const Component = new Function('React', 'props', js);
  return Component;
};
```

#### Option 2: Sandpack (CodeSandbox in Browser)
```typescript
import { Sandpack } from '@codesandbox/sandpack-react';

<Sandpack
  template="react"
  files={{
    '/Button.tsx': buttonCode,
  }}
  options={{
    showNavigator: false,
    editorHeight: 400,
  }}
/>
```

#### Option 3: React Live (Simple, Limited)
```typescript
import { LiveProvider, LiveEditor, LivePreview } from 'react-live';

<LiveProvider code={componentCode}>
  <LiveEditor />
  <LivePreview />
</LiveProvider>
```

## Phase 3: AI Integration Strategy (Month 2-3)

### AI Component Assistant Features

#### 1. Component Generation
```typescript
// User types description
"Create a card component with image, title, and description"

// AI generates
const Card = ({ image, title, description }) => (
  <Container className="card">
    <Image src={image} alt={title} />
    <Heading>{title}</Heading>
    <Text>{description}</Text>
  </Container>
);
```

#### 2. Props Suggestion
```typescript
// AI analyzes component usage
const suggestProps = (componentCode: string) => {
  // Send to AI API
  // Return suggested props with types
  return {
    variant: 'primary | secondary | outline',
    size: 'sm | md | lg',
    disabled: 'boolean'
  };
};
```

#### 3. Accessibility Improvements
```typescript
// AI reviews component
const checkAccessibility = (component: ComponentType) => {
  return {
    issues: ['Missing aria-label', 'Low contrast'],
    suggestions: ['Add aria-label="Button"', 'Increase contrast to 4.5:1']
  };
};
```

### Implementation Plan

#### Step 1: Basic Live Editor (Week 2)
```typescript
// studio/LiveEditor.tsx
export const LiveEditor = () => {
  const [code, setCode] = useState('');
  const [preview, setPreview] = useState(null);
  
  useEffect(() => {
    // Compile code on change (debounced)
    const compiled = compileComponent(code);
    setPreview(compiled);
  }, [code]);
  
  return (
    <Split>
      <CodeEditor value={code} onChange={setCode} />
      <Preview component={preview} />
    </Split>
  );
};
```

#### Step 2: Component Templates (Week 3)
```typescript
const templates = {
  button: `
export const Button = ({ children, onClick, variant = 'primary' }) => (
  <button className={\`btn btn-\${variant}\`} onClick={onClick}>
    {children}
  </button>
);`,
  card: `...`,
  form: `...`
};
```

#### Step 3: AI Integration (Month 2)
```typescript
// Connect to AI service
const aiService = {
  generateComponent: async (description: string) => {
    // Call Claude/GPT API
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ description })
    });
    return response.json();
  },
  
  improveComponent: async (code: string) => {
    // Get AI suggestions
  },
  
  fixAccessibility: async (code: string) => {
    // Get accessibility fixes
  }
};
```

## Phase 4: Production Integration (Month 3+)

### Save & Export Workflow
1. Develop component in studio
2. Test with different props
3. Run accessibility checks
4. Generate tests automatically
5. Export to project
6. Create PR automatically

### Code Generation Pipeline
```typescript
const exportComponent = async (component: LiveComponent) => {
  // 1. Generate component file
  const componentFile = generateComponentCode(component);
  
  // 2. Generate test file
  const testFile = generateTests(component);
  
  // 3. Generate story file
  const storyFile = generateStorybook(component);
  
  // 4. Update index exports
  updateExports(component.name);
  
  // 5. Create git commit
  await git.add([componentFile, testFile, storyFile]);
  await git.commit(`feat: Add ${component.name} component`);
};
```

## Technical Requirements

### For Live Development
1. **Vite HMR** - Already configured ✅
2. **Runtime compiler** - Need to add (Sucrase/Babel)
3. **Monaco Editor** - For code editing
4. **Error Boundary** - Prevent crashes
5. **Type definitions** - For IntelliSense

### For AI Integration
1. **API endpoint** - Connect to Claude/GPT
2. **Prompt templates** - Consistent generation
3. **Code validation** - Ensure valid JSX
4. **Security sandbox** - Prevent malicious code
5. **Rate limiting** - Control API usage

## Incremental Rollout

### Week 1: Foundation
- [ ] Create atomic folders
- [ ] Move 3 components as test
- [ ] Add atomic view to studio
- [ ] Document the process

### Week 2: Live Preview
- [ ] Add Monaco editor
- [ ] Implement basic compilation
- [ ] Create preview panel
- [ ] Handle compilation errors

### Week 3: Templates
- [ ] Create component templates
- [ ] Add template selector
- [ ] Implement prop editor
- [ ] Save to localStorage

### Month 2: AI Features
- [ ] Setup AI API endpoint
- [ ] Create prompt templates
- [ ] Add generate button
- [ ] Implement suggestions

### Month 3: Production Ready
- [ ] Export functionality
- [ ] Test generation
- [ ] Git integration
- [ ] Team sharing

## Success Metrics

1. **Component creation time** - Reduce by 50%
2. **Code quality** - Increase consistency
3. **Accessibility score** - 100% WCAG compliance
4. **Developer satisfaction** - Measure via feedback
5. **Component reuse** - Track usage across apps

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Runtime compilation breaks | Fallback to static preview |
| AI generates bad code | Human review required |
| Performance issues | Lazy load heavy features |
| Security concerns | Sandbox execution environment |
| Browser compatibility | Use modern browsers only for studio |

---

**Next Step:** Start with Phase 1 reorganization, then evaluate which live development approach works best for our needs.