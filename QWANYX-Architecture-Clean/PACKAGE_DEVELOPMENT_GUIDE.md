# QWANYX Package Development Guide

## 📦 Package Categories

### 1. Core Infrastructure Packages
Foundation packages that all apps depend on.

```
@qwanyx/ui          - Atomic design components
@qwanyx/auth        - Authentication & authorization  
@qwanyx/workspace   - Multi-tenancy support
@qwanyx/api-client  - API communication layer
@qwanyx/forms       - Form handling & validation
@qwanyx/i18n        - Internationalization
@qwanyx/themes      - Theme management
@qwanyx/utils       - Common utilities
```

### 2. Business Logic Packages
Domain-specific functionality packages.

```
@qwanyx/marketplace      - E-commerce features
@qwanyx/project-mgmt     - Project management
@qwanyx/education        - LMS functionality
@qwanyx/analytics        - Data & reporting
@qwanyx/notifications    - Alert system
@qwanyx/payments         - Payment processing
@qwanyx/calendar         - Scheduling
@qwanyx/messaging        - Chat/messaging
```

### 3. Integration Packages
Third-party service integrations.

```
@qwanyx/stripe          - Stripe payments
@qwanyx/sendgrid        - Email service
@qwanyx/aws             - AWS services
@qwanyx/google          - Google services
@qwanyx/microsoft       - Microsoft services
```

## 🏗️ Package Structure Template

```bash
packages/
└── qwanyx-[package-name]/
    ├── src/
    │   ├── components/      # React components
    │   ├── hooks/           # Custom hooks
    │   ├── services/        # Business logic
    │   ├── utils/           # Utilities
    │   ├── types/           # TypeScript types
    │   ├── schemas/         # Zod schemas
    │   ├── constants/       # Constants
    │   └── index.ts         # Main export
    ├── tests/
    │   ├── unit/           # Unit tests
    │   ├── integration/    # Integration tests
    │   └── e2e/           # End-to-end tests
    ├── docs/
    │   ├── README.md       # Package documentation
    │   ├── API.md          # API reference
    │   └── EXAMPLES.md     # Usage examples
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── .eslintrc.json
    ├── .prettierrc
    └── CHANGELOG.md
```

## 📝 Package.json Template

```json
{
  "name": "@qwanyx/package-name",
  "version": "1.0.0",
  "description": "Package description",
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./dist/styles.css"
  },
  "files": [
    "dist",
    "README.md",
    "CHANGELOG.md"
  ],
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext ts,tsx",
    "format": "prettier --write src",
    "type-check": "tsc --noEmit",
    "prepublishOnly": "npm run build && npm run test"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "dependencies": {
    "zod": "^3.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

## 🎯 Development Standards

### 1. TypeScript Configuration

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "dist"
  }
}
```

### 2. Export Pattern

```typescript
// src/index.ts
// Components
export * from './components';

// Hooks
export * from './hooks';

// Services
export * from './services';

// Types
export * from './types';

// Utils
export * from './utils';

// Schemas
export * from './schemas';
```

### 3. Component Pattern

```typescript
// src/components/ExampleComponent.tsx
import { z } from 'zod';
import type { FC, PropsWithChildren } from 'react';

// Props schema for validation
const ExampleComponentPropsSchema = z.object({
  title: z.string(),
  variant: z.enum(['primary', 'secondary']).optional(),
  onClick: z.function().optional(),
});

// Type inference from schema
type ExampleComponentProps = z.infer<typeof ExampleComponentPropsSchema>;

// Component implementation
export const ExampleComponent: FC<PropsWithChildren<ExampleComponentProps>> = (props) => {
  // Validate props at runtime in development
  if (process.env.NODE_ENV === 'development') {
    ExampleComponentPropsSchema.parse(props);
  }

  const { title, variant = 'primary', onClick, children } = props;

  return (
    <div className={`example-${variant}`} onClick={onClick}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

// Export component and types
export type { ExampleComponentProps };
```

### 4. Hook Pattern

```typescript
// src/hooks/useExample.ts
import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';

// Options schema
const UseExampleOptionsSchema = z.object({
  initialValue: z.string().optional(),
  autoSave: z.boolean().optional(),
});

type UseExampleOptions = z.infer<typeof UseExampleOptionsSchema>;

// Return type
interface UseExampleReturn {
  value: string;
  setValue: (value: string) => void;
  save: () => Promise<void>;
  loading: boolean;
  error: Error | null;
}

// Hook implementation
export function useExample(options: UseExampleOptions = {}): UseExampleReturn {
  const validatedOptions = UseExampleOptionsSchema.parse(options);
  const { initialValue = '', autoSave = false } = validatedOptions;

  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const save = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Save logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [value]);

  useEffect(() => {
    if (autoSave && value) {
      save();
    }
  }, [autoSave, value, save]);

  return {
    value,
    setValue,
    save,
    loading,
    error,
  };
}
```

### 5. Service Pattern

```typescript
// src/services/ExampleService.ts
import { z } from 'zod';

// Request/Response schemas
const CreateExampleSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

const ExampleResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.string().datetime(),
});

type CreateExampleInput = z.infer<typeof CreateExampleSchema>;
type ExampleResponse = z.infer<typeof ExampleResponseSchema>;

// Service class
export class ExampleService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async create(input: CreateExampleInput): Promise<ExampleResponse> {
    // Validate input
    const validated = CreateExampleSchema.parse(input);
    
    // Make API call
    const response = await this.apiClient.post('/examples', validated);
    
    // Validate response
    return ExampleResponseSchema.parse(response.data);
  }

  async getById(id: string): Promise<ExampleResponse> {
    const response = await this.apiClient.get(`/examples/${id}`);
    return ExampleResponseSchema.parse(response.data);
  }

  async list(): Promise<ExampleResponse[]> {
    const response = await this.apiClient.get('/examples');
    return z.array(ExampleResponseSchema).parse(response.data);
  }
}

// Export service and types
export type { CreateExampleInput, ExampleResponse };
```

## 🧪 Testing Requirements

### Unit Test Example

```typescript
// tests/unit/ExampleComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ExampleComponent } from '../../src/components/ExampleComponent';

describe('ExampleComponent', () => {
  it('renders with title', () => {
    render(<ExampleComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<ExampleComponent title="Test" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Test'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant class', () => {
    const { container } = render(
      <ExampleComponent title="Test" variant="secondary" />
    );
    expect(container.firstChild).toHaveClass('example-secondary');
  });
});
```

### Integration Test Example

```typescript
// tests/integration/ExampleService.test.ts
import { ExampleService } from '../../src/services/ExampleService';
import { mockApiClient } from '../mocks/apiClient';

describe('ExampleService', () => {
  let service: ExampleService;

  beforeEach(() => {
    service = new ExampleService(mockApiClient);
  });

  it('creates example with valid data', async () => {
    const input = { name: 'Test Example' };
    const result = await service.create(input);
    
    expect(result).toMatchObject({
      id: expect.any(String),
      name: 'Test Example',
    });
  });

  it('throws error with invalid data', async () => {
    const input = { name: '' }; // Invalid: empty name
    
    await expect(service.create(input)).rejects.toThrow();
  });
});
```

## 📊 Package Metrics

Every package must maintain:

- **Test Coverage**: Minimum 80%
- **Type Coverage**: 100% (no `any` without justification)
- **Bundle Size**: Track and optimize
- **Performance**: Benchmark critical paths
- **Documentation**: 100% of public API documented

## 🚀 Publishing Workflow

```bash
# 1. Run quality checks
npm run lint
npm run type-check
npm run test:coverage

# 2. Build package
npm run build

# 3. Test build locally
npm link
cd ../test-app
npm link @qwanyx/package-name

# 4. Update version
npm version patch|minor|major

# 5. Publish
npm publish --access public

# 6. Update changelog
git add CHANGELOG.md
git commit -m "chore: update changelog for v1.0.0"
git push --tags
```

## 📈 Package Evolution Strategy

### Level 1: Basic Implementation
- Core functionality
- Basic TypeScript types
- Minimal documentation

### Level 2: Production Ready
- Full test coverage
- Comprehensive types
- Error handling
- Documentation

### Level 3: Enterprise Grade
- Performance optimized
- Accessibility compliant
- Internationalized
- Extensive examples

### Level 4: Self-Configuring
- Auto-detection of environment
- Smart defaults
- AI-assisted configuration
- Visual configuration tools

## 🔄 Inter-Package Dependencies

```mermaid
graph TD
    A[@qwanyx/utils] --> B[@qwanyx/ui]
    A --> C[@qwanyx/auth]
    A --> D[@qwanyx/workspace]
    B --> E[@qwanyx/forms]
    C --> D
    D --> F[@qwanyx/api-client]
    E --> F
    G[@qwanyx/marketplace] --> B
    G --> C
    G --> D
    G --> F
```

## ⚠️ Breaking Change Policy

1. **Never break in patch versions** (1.0.x)
2. **Deprecate in minor versions** (1.x.0)
3. **Remove in major versions** (x.0.0)
4. **Migration guide required** for all breaking changes
5. **Codemods provided** when possible

---

**Remember:** Every package should make developers' lives easier, not harder. If it doesn't save time or reduce complexity, it shouldn't exist.