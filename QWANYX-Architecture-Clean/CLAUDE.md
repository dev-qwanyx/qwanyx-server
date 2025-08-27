# QWANYX Architecture - Claude AI Development Instructions

## 🔴 CURRENT STATUS - August 20, 2024

### ✅ WORKING PRODUCTION DEPLOYMENT
- **Next.js App**: http://135.181.72.183:3002 (FAST, WORKING)
- **Python API**: http://135.181.72.183:5002 (WORKING)
- **Dashboard**: Fully functional with real database connection
- **Authentication**: Working with passwordless system

### 📅 THIS WEEK - DEMO PRIORITY (Deadline: Sunday)
**DO NOT CHANGE INFRASTRUCTURE - FOCUS ON FEATURES**
- System is deployed and working
- Demo preparation is priority
- No server changes until after demo

### 📋 NEXT WEEK TASKS (After Demo)

#### 1. Smart Deployment (DEPLOYMENT_DECISIONS.md)
- Update COMMANDS.sh to only rebuild changed components
- Currently rebuilds everything (wasteful but working)
- Implement change detection for selective rebuilding

#### 2. Server Cleanup (SERVER_CLEANUP_PLAN.md)
- Remove old Flask services (ports 8090, 8091)
- Remove federation services (unused)
- Clean duplicate/experimental directories
- Keep only: Next.js (3002), API (5002), MongoDB, Webhook (9999)

### 🏗️ CURRENT ARCHITECTURE
```
Production Server (135.181.72.183):
├── Next.js Autodin (port 3002) ← KEEP
├── Python API (port 5002) ← KEEP
├── Flask Autodin (port 8090) ← TO REMOVE
├── Flask Belgicomics (port 8091) ← TO REMOVE
├── Federation services ← TO REMOVE
└── Webhook (port 9999) ← KEEP
```

### 🚀 DEPLOYMENT METHOD
- Git push → GitHub webhook → Server pulls → Builds on server → PM2 restart
- Works but inefficient (rebuilds everything)
- To optimize next week with smart rebuilding

## 🔴 PRIMARY DIRECTIVE: JIDOKA (自働化) - NO TOLERANCE FOR FAILURES

### The Andon Principle - Stop Everything When Something Goes Wrong

**FUNDAMENTAL RULE:** When a system fails, EVERYTHING must fail visibly. No fallbacks, no workarounds, no "continuing anyway".

**Toyota Production System (TPS) Principle:**
- **Anomaly detected** → Immediate line stoppage
- **Problem visible** → Alarms, red lights, impossible to ignore
- **Mandatory resolution** → No restart until completely fixed
- **No bypassing** → Problem MUST be solved, not hidden

**Code Application:**
```javascript
// ❌ FORBIDDEN - Silent fallback
try {
  await sendEmail();
} catch (e) {
  console.warn("Email failed, continuing anyway");
  // Continue without email
}

// ✅ MANDATORY - Total and visible failure
await sendEmail().catch(e => {
  console.error("CRITICAL FAILURE:", e);
  throw new Error("Operation failed: Email required");
});
```

**Why This is CRITICAL:**
1. **Hidden problems become catastrophes** - One unsent email today = 1000 lost users tomorrow
2. **Fallbacks create technical debt** - Every "temporary solution" becomes permanent
3. **Quality demands transparency** - If it doesn't work, the client must know IMMEDIATELY
4. **Visible errors get fixed quickly** - Pain forces action

**Real Examples We've Experienced:**
- Auth that "works" but doesn't send emails → Weeks of confusion
- MongoDB that "connects" but silently times out → Impossible debugging
- TypeScript errors ignored with `as any` → Production crashes
- Email service "continuing anyway" → Users never receive codes but system says "success"

**The Jidoka Rule for Claude:**
- If email fails → Request fails
- If DB fails → Server doesn't start
- If external API fails → Visible error to user
- If validation fails → Operation cancelled
- NEVER use try/catch that hides the error
- NEVER use fallback "just in case"
- NEVER "log and continue"

**Implementation Example from Our Code:**
```rust
// qwanyx-brain/spu-rust/src/auth/mod.rs
// Send email - NO FALLBACKS, NO CLEANUP, JUST FAIL
self.send_auth_email(&req.email, &code, workspace).await.map_err(|e| {
    error!("EMAIL SEND FAILED: {} - {}", req.email, e);
    actix_web::error::ErrorInternalServerError(format!("Email sending failed: {}", e))
})?;
```

This is not error handling, it's a quality philosophy. Every error is a chance to improve the system, not hide the problem.

### The 5 Whys Method - Root Cause Analysis (必須)

**MANDATORY:** For ANY bug or problem, apply the 5 Whys before attempting a fix.

**Real Example - SMTP Windows Error (Solved in 5 minutes after 1 hour of attempts):**

```
PROBLEM: "The token supplied to the function is invalid (os error -2146893048)"

Why 1: Why does SMTP fail with "invalid token" error?
→ Because Windows is having issues with the TLS handshake when connecting to AWS SES

Why 2: Why is the TLS handshake failing?
→ Because the Rust lettre library is using native-tls which relies on Windows' Schannel

Why 3: Why is Schannel rejecting the connection?
→ Because AWS SES requires STARTTLS on port 587, which needs specific TLS configuration

Why 4: Why isn't the TLS configuration correct?
→ Because we're not explicitly configuring TLS mode in the SMTP transport builder

Why 5: Why aren't we configuring TLS properly?
→ Because the code assumes default TLS settings will work, but Windows needs explicit STARTTLS

ROOT CAUSE: Using SmtpTransport::relay() instead of SmtpTransport::starttls_relay() for port 587

SOLUTION: 
// Before (wrong for port 587):
SmtpTransport::relay(&host)?

// After (correct for AWS SES port 587):
SmtpTransport::starttls_relay(&host)?
```

**Result:** After 1 hour of trying random fixes, the 5 Whys method found the root cause in 5 minutes.

**Other Problems Solved with 5 Whys in This Session:**
- **TypeScript "validate" error** → Found hidden qwanyx-ui.d.ts file overriding types
- **Rust compilation errors** → Found tuple destructuring mismatch with rayon::join
- **MongoDB hanging** → Found missing connection timeout parameter

**The 5 Whys Rule for Claude:**
1. STOP when you encounter an error
2. Ask "Why?" 5 times to drill down to root cause
3. Fix the ROOT CAUSE, not the symptom
4. Document the analysis for future reference
5. NEVER apply a fix without understanding WHY it works

This is not error handling, it's a quality philosophy. Every error is a chance to improve the system, not hide the problem.

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

## 🏗️ QWANYX Architecture Hierarchy

### 🔺 CRITICAL: The Sacred Import Chain
**ABSOLUTE RULE - THIS IS THE FOUNDATION OF QWANYX:**

```
Apps → @qwanyx/app-core → Business Packages → @qwanyx/ui
```

**FORBIDDEN:**
- ❌ Apps importing from @qwanyx/ui directly
- ❌ Apps importing from business packages directly  
- ❌ Business packages importing from apps
- ❌ Circular dependencies at any level

**REQUIRED:**
- ✅ Apps ONLY import from @qwanyx/app-core
- ✅ @qwanyx/app-core orchestrates ALL packages
- ✅ Business packages use @qwanyx/ui components
- ✅ @qwanyx/ui contains ONLY visual components

### 🎯 Abstraction Layers

```
┌─────────────────────────────────────────────────┐
│                    APPS                         │
│  (Autodin, Belgicomics, Personal-CASH)         │
│  - Import ONLY from @qwanyx/app-core           │
│  - Never touch @qwanyx/ui directly             │
│  - Request business features, not components    │
└────────────────────┬────────────────────────────┘
                     │ ONLY imports from
                     ▼
┌─────────────────────────────────────────────────┐
│            @qwanyx/app-core                     │
│  - Central orchestrator                         │
│  - Re-exports everything apps need              │
│  - Composes business packages                   │
│  - Manages workspace context                    │
└────────────────────┬────────────────────────────┘
                     │ Orchestrates
                     ▼
┌─────────────────────────────────────────────────┐
│          BUSINESS PACKAGES                      │
│  (@qwanyx/auth, @qwanyx/marketplace,           │
│   @qwanyx/dashboard, @qwanyx/forms)            │
│  - Domain-specific logic                        │
│  - API integrations                             │
│  - Workspace-aware (multi-tenancy)              │
│  - Compose UI components into features          │
└────────────────────┬────────────────────────────┘
                     │ Composes from
                     ▼
┌─────────────────────────────────────────────────┐
│              @qwanyx/ui                         │
│  ATOMS: Button, Input, Text, Icon               │
│  MOLECULES: FormField, Card, UserProfile        │
│  ORGANISMS: Header, Dashboard, DataTable        │
│  - Pure visual components                       │
│  - Zero business logic                          │
│  - Props-only API (no CSS)                      │
│  - Style Grammar system                         │
└─────────────────────────────────────────────────┘
```

### 📐 Atomic Design System (@qwanyx/ui)

**ATOMS** (Basic building blocks)
- Button, Input, Text, Icon, Label, Badge
- Single responsibility
- No composition
- Pure presentation

**MOLECULES** (Composed atoms)
- FormField (Label + Input + Error)
- Card (Container + Title + Content)
- UserProfile (Avatar + Text + Badge)
- Simple combinations

**ORGANISMS** (Complex components)
- Header (Logo + Nav + UserProfile)
- Dashboard (Sidebar + Content + Header)
- DataTable (Search + Table + Pagination)
- Business-ready but logic-free

**TEMPLATES** (Layout patterns)
- DashboardTemplate
- AuthTemplate
- MarketplaceTemplate
- Full page structures

**PAGES** (Complete views)
- Assembled in apps using app-core
- Never in @qwanyx/ui

### 🔄 The Workspace System

**Purpose:** Unified multi-tenant data experience across all apps

```typescript
// Every business package is workspace-aware
const { currentWorkspace } = useWorkspace();

// API calls automatically scoped
api.get('/users'); // Actually: /workspaces/{workspace}/users

// Database seamlessly partitioned
db.collection('products'); // Actually: workspace_autodin.products
```

**Benefits:**
- One codebase, multiple clients
- Data isolation by default
- Seamless tenant switching
- Unified auth across workspaces

## 🏗️ QWANYX Project Structure

```
QWANYX-Architecture-Clean/
├── packages/               # Shared NPM packages (monorepo)
│   ├── qwanyx-ui/         # Atomic design components (atoms/molecules/organisms)
│   ├── qwanyx-app-core/   # Central orchestrator - THE ONLY IMPORT FOR APPS
│   ├── qwanyx-auth/       # Authentication business logic
│   ├── qwanyx-dashboard/  # Dashboard business features
│   ├── qwanyx-marketplace/# E-commerce business logic
│   └── qwanyx-forms/      # Form management with validation
├── apps/                   # Frontend applications
│   ├── autodin/           # ONLY imports from @qwanyx/app-core
│   ├── belgicomics/       # ONLY imports from @qwanyx/app-core
│   └── personal-cash/     # ONLY imports from @qwanyx/app-core
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

## 🎨 Component Philosophy & Style System

### Component API Design - Props Only, No CSS
**ABSOLUTE RULE:** Components consume ONLY semantic props, never CSS classes or style objects.

```typescript
// ❌ FORBIDDEN - Never expose style props
<Button className="bg-blue-500" style={{padding: '10px'}} />

// ✅ REQUIRED - Semantic props only
<Button variant="primary" size="lg" />
```

### The Style Grammar System
Components use a mini CSS-like grammar for expressive styling through props:

```typescript
// Color with opacity and effects
<Container color="primary/50/frost-md" />
// → Primary color at 50% opacity with medium frost effect

// Spacing with directional control
<Section padding="lg/x-sm" />
// → Large vertical padding, small horizontal

// Complex borders
<Card border="2/error/dashed/top-bottom" />
// → 2px dashed error-colored border on top and bottom
```

**Grammar Benefits:**
- Type-safe through TypeScript
- Concise and readable
- Maps to CSS variables
- Theme-aware automatically

### CSS Variables Architecture
All styling ultimately resolves to CSS variables that cascade through the DOM:

```css
/* App sets theme variables */
:root {
  --qwanyx-primary: 230, 126, 34;  /* Autodin orange */
  --qwanyx-spacing-md: 1.5rem;     /* Custom spacing */
}

/* Components reference variables */
.button {
  background: rgb(var(--qwanyx-primary));
  padding: var(--qwanyx-spacing-md);
}
```

**The Chain:**
1. App defines CSS variables for theming
2. Components props use grammar syntax
3. Grammar parser converts to inline styles
4. Styles reference CSS variables
5. Result: Complete visual transformation without touching component code

### Example: Building a Business Feature

```typescript
// ❌ WRONG - App using UI components directly
import { Button, Input, Card } from '@qwanyx/ui';  // FORBIDDEN!

// ✅ CORRECT - App requests business features
import { UserRegistrationForm } from '@qwanyx/app-core';

// The app doesn't care HOW it's built, just WHAT it does
<UserRegistrationForm 
  onSuccess={handleUserCreated}
  workspace="autodin"
/>
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
  // Semantic props only
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
  // Style grammar props
  color?: string;  // "primary/50/frost-md"
  padding?: string; // "lg/x-sm"
  // NEVER className or style props
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
- **🚗 AUTODIN REBUILD PLAN:** `/AUTODIN_REBUILD_PLAN.md` - Current active task

---

**REMEMBER:** 
- We build for the long term, not the deadline
- Every line of code is a commitment to quality
- Security is not negotiable
- If it's not typed, it's not done
- Components only, no HTML
- When in doubt, make it a package

**YOUR PRIME DIRECTIVE:** Build code so reliable, secure, and maintainable that it could be certified for critical infrastructure use.

## 🎯 Quick Reference - Architecture Summary

### The Sacred Import Chain
```
Apps → @qwanyx/app-core → Business Packages → @qwanyx/ui
```

### Never Break These Rules
1. **Apps NEVER import from @qwanyx/ui** - Only from @qwanyx/app-core
2. **No native HTML elements** - Always use QWANYX components
3. **Props only, no CSS** - Components use semantic props + style grammar
4. **TypeScript errors = STOP** - Never use `as any` to bypass
5. **Validate everything** - Zod schemas on all user input

### Component Hierarchy
- **@qwanyx/ui**: Pure visual (atoms → molecules → organisms)
- **Business Packages**: Domain logic + API (@qwanyx/auth, @qwanyx/marketplace)
- **@qwanyx/app-core**: Central orchestrator that combines everything
- **Apps**: Only consume from app-core, never direct package imports

### Style System
- Components use **props** like `size="lg"` and `variant="primary"`
- **Style Grammar** for advanced: `color="primary/50/frost-md"`
- All styles resolve to **CSS variables** that apps can override
- Result: One component, infinite themes

### Workspace System
- All packages are **multi-tenant aware**
- API calls automatically scoped to workspace
- Database seamlessly partitioned
- One codebase serves multiple clients

**When in doubt:** Follow the chain, use semantic props, validate everything.