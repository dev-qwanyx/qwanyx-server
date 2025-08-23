# QWANYX Workspace Architecture Strategy

## Current Issues (As of August 2024)

### 1. Token Storage Inconsistency
- **Problem**: Multiple keys for tokens
  - `autodin_token` (main app)
  - `token` (some packages)
  - `{workspace}_token` (auth module pattern)
- **Impact**: Components can't find tokens, auth fails silently

### 2. Workspace Configuration Chaos
- **Problem**: No single source of truth for workspace
  - Hardcoded in JSX: `workspace="autodin"`
  - Fallbacks everywhere: `|| 'autodin'`
  - Never persisted to localStorage
- **Impact**: Each component might use different workspace

### 3. JWT Workspace Mismatch
- **Problem**: JWT contains wrong workspace from old logins
  - JWT: `workspace: 'qwanyx-template'`
  - App needs: `workspace: 'autodin'`
- **Current Workaround**: X-Workspace header override (fragile)

## Proposed Solution

### Phase 1: Immediate Fixes (Quick wins)
```typescript
// 1. Create workspace.config.ts in each app
export const WORKSPACE = {
  id: 'autodin',           // Change this to clone app
  displayName: 'Autodin',
  tokenKey: 'autodin_token',  // Consistent key
  userKey: 'autodin_user'
}

// 2. Initialize on app load (in layout.tsx)
useEffect(() => {
  localStorage.setItem('current_workspace', WORKSPACE.id)
}, [])

// 3. Update all localStorage calls
// Before: localStorage.getItem('token')
// After: localStorage.getItem(WORKSPACE.tokenKey)
```

### Phase 2: Centralized Workspace Manager
```typescript
// packages/qwanyx-workspace/src/WorkspaceManager.ts
class WorkspaceManager {
  private static instance: WorkspaceManager
  private workspace: string
  
  static initialize(workspace: string) {
    this.instance = new WorkspaceManager(workspace)
    localStorage.setItem('qwanyx_workspace', workspace)
  }
  
  static get current(): string {
    return this.instance?.workspace || 
           localStorage.getItem('qwanyx_workspace') || 
           'default'
  }
  
  static getTokenKey(): string {
    return `${this.current}_token`
  }
  
  static getUserKey(): string {
    return `${this.current}_user`
  }
  
  static getHeaders(): HeadersInit {
    return {
      'X-Workspace': this.current,
      'Authorization': `Bearer ${this.getToken()}`
    }
  }
}
```

### Phase 3: API Improvements
```python
# Auto-detect workspace from multiple sources
def get_request_workspace():
    # Priority order:
    # 1. X-Workspace header (explicit override)
    # 2. Query parameter (?workspace=autodin)
    # 3. JWT claim (from token)
    # 4. Referer header parsing (detect from domain)
    # 5. Default workspace
    
    workspace = (
        request.headers.get('X-Workspace') or
        request.args.get('workspace') or
        get_jwt().get('workspace') or
        parse_referer_workspace() or
        'default'
    )
    
    # Validate workspace exists
    if not workspace_exists(workspace):
        abort(400, f"Unknown workspace: {workspace}")
    
    return workspace
```

### Phase 4: Token Refresh Strategy
```typescript
// When token workspace doesn't match app workspace
if (tokenWorkspace !== WORKSPACE.id) {
  // Force re-authentication
  await logout()
  await login({ workspace: WORKSPACE.id })
}
```

## Implementation Checklist

### Immediate (Today)
- [ ] Create workspace.config.ts in autodin app
- [ ] Fix token key in DigitalHumanEditor ('token' → 'autodin_token')
- [ ] Store workspace in localStorage on login
- [ ] Add workspace to all API calls consistently

### Short Term (This Week)
- [ ] Create @qwanyx/workspace package
- [ ] Centralize all workspace logic
- [ ] Update all packages to use WorkspaceManager
- [ ] Add workspace validation to API

### Long Term (Next Month)
- [ ] Implement token refresh when workspace mismatch
- [ ] Add workspace switcher UI component
- [ ] Support multiple workspaces in same session
- [ ] Implement workspace-based routing

## Benefits of This Strategy

1. **Single Source of Truth**: One config file to change when cloning
2. **Consistent Token Access**: All components use same keys
3. **Automatic Headers**: WorkspaceManager handles all headers
4. **Graceful Fallbacks**: Multiple detection methods in API
5. **Easy Cloning**: Change one file, entire app switches workspace

## Migration Path

1. **Don't break existing code** - Add new system alongside
2. **Gradual migration** - Update components one by one
3. **Backwards compatible** - Support old token keys temporarily
4. **Clear deprecation** - Mark old patterns as deprecated
5. **Clean up** - Remove old code after full migration

## Example: Cloning Autodin to Belgicomics

```bash
# 1. Copy app folder
cp -r apps/autodin apps/belgicomics

# 2. Update workspace.config.ts
export const WORKSPACE = {
  id: 'belgicomics',  // ← Only change needed!
  displayName: 'Belgicomics',
  tokenKey: 'belgicomics_token',
  userKey: 'belgicomics_user'
}

# 3. Update theme/branding
# 4. Deploy - everything else just works!
```

## Success Metrics

- ✅ One config change to switch workspace
- ✅ No hardcoded workspace values
- ✅ Consistent token/user storage
- ✅ API always knows correct workspace
- ✅ Can run multiple workspaces simultaneously