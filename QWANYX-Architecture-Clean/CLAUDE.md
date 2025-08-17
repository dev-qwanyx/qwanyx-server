# QWANYX Architecture - Claude AI Development Instructions

## 🚨 CRITICAL: ZERO-TOLERANCE RULES

### 1. TypeScript - NEVER Bypass Errors
**ABSOLUTE RULE:** When TypeScript shows an error, NEVER:
- Use `as any` to hide the problem
- Disable TypeScript checks
- Compile without resolving errors  
- Use `// @ts-ignore` or `// @ts-nocheck`

**Root Cause Analysis Required:** Use "5 Whys" methodology:
1. Why does the error appear?
2. Why does this condition exist?
3. Why this dependency?
4. Why this architecture?
5. Why this initial decision?

**Real Example:** A `qwanyx-ui.d.ts` file was overriding real types, causing "validate" errors.
- ❌ Wrong: Use `as any` → Code compiles but crashes at runtime
- ✅ Right: Investigate → Find conflicting file → Remove → Robust system

### 2. NO Native HTML Elements - EVER
**ABSOLUTE RULE:** Never use native HTML in components or apps:
- ❌ FORBIDDEN: `<div>`, `<button>`, `<input>`, `<form>`, `<span>`, `<p>`, etc.
- ✅ REQUIRED: Import from `@qwanyx/ui`: `<Container>`, `<Button>`, `<Input>`, `<Form>`, `<Text>`

```typescript
// ❌ NEVER DO THIS
const Component = () => (
  <div className="container">
    <button onClick={handleClick}>Click me</button>
  </div>
);

// ✅ ALWAYS DO THIS
import { Container, Button } from '@qwanyx/ui';

const Component = () => (
  <Container>
    <Button onClick={handleClick}>Click me</Button>
  </Container>
);
```

### 3. Security is NOT Optional
**Every piece of code must be certification-grade secure:**
- Input validation with Zod on EVERY user input
- No hardcoded credentials or URLs
- Parameterized queries only (no string concatenation)
- Sanitize all user-generated content
- Implement rate limiting on all endpoints
- Use encryption for sensitive data

### 4. No Quick Fixes - EVER
**We are building certification-grade code:**
- Every "temporary" solution becomes permanent
- Every shortcut creates technical debt
- Every bypass creates a security vulnerability
- If it's not done right, it's not done

## 🏗️ QWANYX Project Structure

```
QWANYX-Architecture-Clean/
├── packages/               # Shared NPM packages (monorepo)
│   ├── qwanyx-ui/         # Atomic design components
│   ├── qwanyx-auth/       # Authentication module
│   ├── qwanyx-dashboard/  # Dashboard components
│   └── qwanyx-user-management/  # User CRUD
├── apps/                   # Frontend applications
│   ├── qwanyx-app-template/  # Template for new apps
│   ├── autodin/           # Next.js marketplace app
│   └── [new-app]/         # Clone template to create
├── api/                    # Backend services
│   └── qwanyx-api/        # Flask REST API (Python)
└── docs/                   # Documentation
    ├── ARCHITECTURE_PRINCIPLES.md
    ├── PACKAGE_DEVELOPMENT_GUIDE.md
    ├── SECURITY_STANDARDS.md
    └── ATOMIC_DESIGN.md

```

## 📦 Package Architecture

### Core Principle: Progressive Enhancement
```
Week 1: Build form from scratch (100 lines)
Week 4: Use @qwanyx/forms package (10 lines)
Week 8: Use @qwanyx/app-template (0 lines - included)
Week 12: Configure via UI (No code)
```

### Package Hierarchy
1. **Infrastructure Packages** (always needed)
   - `@qwanyx/ui` - Component library (atomic design)
   - `@qwanyx/auth` - Authentication
   - `@qwanyx/workspace` - Multi-tenancy
   - `@qwanyx/api-client` - API communication

2. **Business Packages** (domain-specific)
   - `@qwanyx/marketplace` - E-commerce features
   - `@qwanyx/project-management` - PM tools
   - `@qwanyx/education` - LMS functionality
   - `@qwanyx/analytics` - Reporting

### Creating New Apps
```bash
# ALWAYS start from template
cd apps/
cp -r qwanyx-app-template new-app-name
cd new-app-name
npm install

# Install required business packages
npm install @qwanyx/marketplace  # for e-commerce
npm install @qwanyx/education    # for learning platform
```

## 🎨 Atomic Design Requirements

### Component Structure (MANDATORY)
```
atoms/          # Basic: Button, Input, Text, Icon
molecules/      # Composed: FormField, SearchBar, Card
organisms/      # Complex: Header, DataTable, Dashboard
templates/      # Layouts: DashboardTemplate, AuthTemplate
pages/          # Complete: LoginPage, ProfilePage
```

### Component Standards
Every component MUST have:
```typescript
// Component.tsx
export interface ComponentProps {
  className?: string;  // Always optional
  // ... typed props
}

// Component.test.tsx
describe('Component', () => {
  it('renders without crashing', () => {});
  it('handles all props correctly', () => {});
  it('is accessible', () => {});
});

// Component.stories.tsx (Storybook)
export default { title: 'Atoms/Component' };
```

## 🔒 Security Implementation

### EVERY User Input Must Be Validated
```typescript
// ❌ NEVER - Direct use
const handleSubmit = (data: any) => {
  api.post('/user', data); // SECURITY BREACH
};

// ✅ ALWAYS - Validated with Zod
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(2).max(100),
  age: z.number().int().min(13).max(120),
});

const handleSubmit = (data: unknown) => {
  const validated = UserSchema.parse(data);
  api.post('/user', validated); // SAFE
};
```

### EVERY Route Must Be Protected
```typescript
// ✅ REQUIRED for all protected pages
const ProtectedPage = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  if (!user.hasPermission('view:page')) {
    return <AccessDenied />;
  }
  
  return <PageContent />;
};
```

### EVERY Error Must Be Handled
```typescript
// ✅ REQUIRED error handling pattern
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  logger.error('Operation failed', { error, context });
  
  // User-safe error (no internal details)
  throw new AppError('Operation failed. Please try again.');
}
```

## 🚀 Development Workflow

### 1. Starting a New Feature
```bash
# First, check if a package exists
npm search @qwanyx/[feature]

# If no package exists, check if components exist
grep -r "ComponentName" packages/qwanyx-ui/

# Only create new if nothing exists
```

### 2. Component Development Rules
- **Used once?** Keep it in the app
- **Used twice?** Make it a component in the app
- **Used in 2+ apps?** Move to @qwanyx/ui package
- **Complex business logic?** Create a new package

### 3. Before EVERY Commit
```bash
# 1. TypeScript must pass
npm run type-check  # MUST be zero errors

# 2. Tests must pass
npm run test        # MUST be 100% passing

# 3. Linting must pass
npm run lint        # MUST be zero warnings

# 4. Security check
npm audit          # MUST have no high/critical vulnerabilities
```

## 🧪 Testing Requirements

### Minimum Coverage Requirements
- **Unit Tests:** 80% coverage minimum
- **Integration Tests:** All API endpoints
- **E2E Tests:** Critical user flows
- **Security Tests:** All input validation

### Test Example Pattern
```typescript
// ALWAYS test security
it('prevents SQL injection', async () => {
  const malicious = "'; DROP TABLE users; --";
  const response = await api.post('/search', { q: malicious });
  
  expect(response.status).toBe(400);
  expect(response.body.error).toBe('Invalid input');
});

// ALWAYS test validation
it('validates email format', () => {
  const invalid = 'not-an-email';
  expect(() => EmailSchema.parse(invalid)).toThrow();
});
```

## 🎯 Common Scenarios

### Scenario: Adding a New Form
```typescript
// ✅ CORRECT Approach
import { Form, FormField, Button } from '@qwanyx/ui';
import { z } from 'zod';

const FormSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
});

const MyForm = () => {
  const onSubmit = (data: unknown) => {
    const validated = FormSchema.parse(data);
    // Process validated data
  };
  
  return (
    <Form onSubmit={onSubmit}>
      <FormField name="email" type="email" required />
      <FormField name="name" minLength={2} required />
      <Button type="submit">Submit</Button>
    </Form>
  );
};
```

### Scenario: Fetching Data
```typescript
// ✅ CORRECT Approach
import { useQuery } from '@qwanyx/api-client';
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

const UserList = () => {
  const { data, error, loading } = useQuery('/users', {
    schema: z.array(UserSchema),
  });
  
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <List>
      {data.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </List>
  );
};
```

### Scenario: Creating a New Package
```bash
# 1. Copy template structure
cp -r packages/package-template packages/qwanyx-newfeature

# 2. Update package.json
# - name: @qwanyx/newfeature
# - version: 0.1.0
# - description: Clear description

# 3. Implement with security first
# - Zod schemas for all data
# - Error boundaries
# - Input validation
# - Tests from day one

# 4. Document everything
# - README.md with examples
# - API.md with all exports
# - CHANGELOG.md for versions
```

## 📋 Pre-Deployment Checklist

**EVERY deployment must pass:**
- [ ] Zero TypeScript errors
- [ ] Zero linting warnings
- [ ] All tests passing (>80% coverage)
- [ ] No `any` types without documentation
- [ ] No native HTML elements used
- [ ] All inputs validated with Zod
- [ ] All routes have authentication checks
- [ ] Error handling on all async operations
- [ ] No hardcoded credentials/URLs
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Audit log implemented
- [ ] No npm vulnerabilities (high/critical)
- [ ] Documentation updated

## 🚫 FORBIDDEN Patterns

```typescript
// ❌ NEVER: Direct DOM manipulation
document.getElementById('myDiv').innerHTML = userInput;

// ❌ NEVER: String concatenation for queries
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ❌ NEVER: Unvalidated input
const age = req.body.age; // Could be anything!

// ❌ NEVER: Ignoring errors
try {
  riskyOperation();
} catch (e) {
  // Silent fail - FORBIDDEN
}

// ❌ NEVER: Using any without reason
const processData = (data: any) => { // FORBIDDEN
  return data.someProperty;
};

// ❌ NEVER: Inline styles
<div style={{ color: 'red' }}>Text</div> // Use classes

// ❌ NEVER: localStorage for sensitive data
localStorage.setItem('authToken', token); // Security breach
```

## ✅ REQUIRED Patterns

```typescript
// ✅ ALWAYS: Validated input
const validatedAge = AgeSchema.parse(req.body.age);

// ✅ ALWAYS: Parameterized queries
const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);

// ✅ ALWAYS: Proper error handling
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  logger.error('Operation failed', error);
  throw new AppError('User-friendly error message');
}

// ✅ ALWAYS: Typed everything
interface ProcessData {
  someProperty: string;
}
const processData = (data: ProcessData) => {
  return data.someProperty;
};

// ✅ ALWAYS: Component styling
import styles from './Component.module.css';
<Container className={styles.container}>Text</Container>

// ✅ ALWAYS: Secure storage
import { secureStorage } from '@qwanyx/auth';
await secureStorage.setItem('authToken', token);
```

## 🎖️ Quality Standards

**Our code is ready when it could:**
- Run a banking system
- Handle medical records
- Process government data
- Manage payment systems
- Store legal documents

**If you wouldn't trust it with your bank account, it's not ready.**

## 🔥 Emergency Procedures

### If TypeScript Won't Compile
1. Check for conflicting type definition files
2. Clear node_modules and reinstall
3. Check tsconfig.json for issues
4. Look for circular dependencies
5. NEVER use `as any` to "fix" it

### If Tests Are Failing
1. Read the actual error message
2. Check if the test is outdated
3. Verify test data is valid
4. Check for race conditions
5. NEVER comment out failing tests

### If Security Vulnerability Found
1. STOP all deployments
2. Assess the impact
3. Fix the root cause (not symptoms)
4. Add tests to prevent recurrence
5. Update security documentation

## 📚 Essential Documentation Links

- **Architecture Principles:** `/ARCHITECTURE_PRINCIPLES.md`
- **Package Development:** `/PACKAGE_DEVELOPMENT_GUIDE.md`
- **Security Standards:** `/SECURITY_STANDARDS.md`
- **Atomic Design:** `/packages/qwanyx-ui/ATOMIC_DESIGN.md`

---

**REMEMBER:** 
- We build for the long term, not the deadline
- Every line of code is a commitment to quality
- Security is not negotiable
- If it's not typed, it's not done
- Components only, no HTML
- When in doubt, make it a package

**YOUR PRIME DIRECTIVE:** Build code so reliable, secure, and maintainable that it could be certified for critical infrastructure use.