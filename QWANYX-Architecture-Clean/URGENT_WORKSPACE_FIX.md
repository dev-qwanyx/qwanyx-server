# 🚨 URGENT: Workspace Configuration Problem

## THE PROBLEM (Found August 22, 2024)

The workspace system is broken due to organic development. Different parts of the app use different token keys and workspace configurations.

## CRITICAL ISSUES

### 1. Token Storage Keys Are Inconsistent
```javascript
// Main app uses:
localStorage.getItem('autodin_token')

// DigitalHumanEditor uses:
localStorage.getItem('token')  // WRONG! Can't find token

// Auth module uses:
localStorage.getItem('{workspace}_token')  // Dynamic pattern
```

### 2. Workspace Never Saved to localStorage
```javascript
// On login, we save:
localStorage.setItem('autodin_token', token) ✅
localStorage.setItem('autodin_user', user) ✅
localStorage.setItem('autodin_workspace', 'autodin') ❌ MISSING!

// So everywhere has fallback:
const workspace = localStorage.getItem('autodin_workspace') || 'autodin'
```

### 3. JWT Has Wrong Workspace
- Old tokens have `workspace: 'qwanyx-template'`
- App needs `workspace: 'autodin'`
- Current bandaid: X-Workspace header override

## QUICK FIX NEEDED

### Step 1: Fix token key in DigitalHumanEditor
```typescript
// packages/qwanyx-thot/src/pages/DigitalHumanEditor.tsx
// Change all:
localStorage.getItem('token')
// To:
localStorage.getItem('autodin_token')
```

### Step 2: Save workspace on login
```typescript
// apps/autodin/src/app/page.tsx
// In handleAuthSuccess, add:
localStorage.setItem('autodin_workspace', 'autodin')
```

### Step 3: Create workspace config
```typescript
// apps/autodin/src/config/workspace.config.ts
export const WORKSPACE_CONFIG = {
  id: 'autodin',
  name: 'Autodin',
  // This is THE place to change when cloning
}
```

## WHY THIS IS URGENT

1. **Cloning is broken** - Can't easily create belgicomics from autodin
2. **Data goes to wrong database** - JWT says qwanyx-template
3. **Auth failures** - Components can't find tokens
4. **No single source of truth** - Workspace hardcoded everywhere

## THE VISION

Should be able to:
1. Clone autodin folder
2. Change ONE config file
3. Have completely separate app with own database

Currently requires changing workspace in 20+ places!

## TEMPORARY WORKAROUND (Currently Active)

- API checks X-Workspace header first
- Frontend sends `X-Workspace: autodin` with all requests
- This overrides the wrong workspace in JWT
- **This is fragile and needs proper fix!**