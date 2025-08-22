# 📋 QFlow Node Component Recipe

## 🎯 Complete Guide to Adding a New Component to QFlow

### Overview
QFlow nodes are containers that can display any component. Nodes appear as beautiful iPhone-style icons that expand on double-click to show a configuration card. All components must use @qwanyx/ui components only - NO native HTML elements.

---

## 📦 Step 1: Create the Component

### Location
`packages/qwanyx-canvas/src/components/YourComponent.tsx`

### Template
```typescript
import React, { useState, useEffect } from 'react'
import {
  Button,
  Input,
  Text,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Flex,
  Container,
  Field
  // Import other @qwanyx/ui components as needed
} from '@qwanyx/ui'

interface YourComponentProps {
  initialConfig?: YourConfigData
  onSave?: (config: YourConfigData) => void
  dhEmail?: string  // Or other context data
  compact?: boolean  // For node vs standalone display
}

export interface YourConfigData {
  // Define your data structure
  field1: string
  field2: number
  field3: boolean
}

export const YourComponent: React.FC<YourComponentProps> = ({
  initialConfig,
  onSave,
  dhEmail = '',
  compact = false
}) => {
  const [config, setConfig] = useState<YourConfigData>({
    field1: initialConfig?.field1 || '',
    field2: initialConfig?.field2 || 0,
    field3: initialConfig?.field3 ?? false
  })

  // Auto-save whenever config changes
  const updateField = (field: keyof YourConfigData, value: any) => {
    const newConfig = { ...config, [field]: value }
    setConfig(newConfig)
    
    // Immediately notify parent of change
    if (onSave) {
      onSave(newConfig)
    }
  }

  if (compact) {
    // Compact version for use inside nodes
    return (
      <Card variant="filled" padding="sm">
        <CardContent noPadding>
          <Flex direction="col" gap="sm">
            <Text size="sm" weight="semibold">Your Component</Text>
            
            <Field name="field1" label="Field 1">
              <Input
                type="text"
                value={config.field1}
                onChange={(e) => updateField('field1', e.target.value)}
                placeholder="Enter value"
                inputSize="sm"
              />
            </Field>

            {/* Add more fields as needed */}
            
            {/* NO SAVE BUTTON - auto-saves on change */}
          </Flex>
        </CardContent>
      </Card>
    )
  }

  // Full version for standalone use
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Your Component Configuration</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Flex direction="col" gap="md">
          {/* Full-size fields here */}
        </Flex>
      </CardContent>
    </Card>
  )
}
```

### Key Rules
1. **NO native HTML elements** - Use only @qwanyx/ui components
2. **NO save button** - Auto-save on every change
3. **Two modes** - Compact for nodes, full for standalone
4. **Immediate updates** - Call onSave immediately when fields change

---

## 📝 Step 2: Export the Component

### File: `packages/qwanyx-canvas/src/index.ts`

Add your component export:
```typescript
// Your Component
export { YourComponent } from './components/YourComponent';
export type { YourConfigData } from './components/YourComponent';
```

---

## 🎨 Step 3: Register the Node Type

### File: `packages/qwanyx-thot/src/execution/NodeRegistry.ts`

Add registration in `registerDefaultNodes()`:
```typescript
// Your Component Node
this.register({
  type: 'your-component',  // Unique identifier
  category: NodeCategory.INTEGRATION,  // Or DATA, ACTION, etc.
  name: 'Your Component',  // Display name in palette
  description: 'Description of what it does',
  icon: 'Settings',  // Icon name from @qwanyx/ui icons
  color: 'primary',  // 'primary', 'success', 'error', or 'gray'
  factory: (data) => ({
    id: data.id,
    type: 'icon',  // ALWAYS 'icon' for visual nodes
    position: data.position,
    data: {
      ...data.data,
      nodeType: 'your-component',  // This triggers your component
      label: 'Your Component',
      icon: 'Settings',
      color: 'primary'
    },
    execute: async () => ({ success: true }),
    validate: () => ({ valid: true }),
    getInputSchema: () => undefined,
    getOutputSchema: () => undefined,
    getConfigSchema: () => undefined
  }),
  defaultData: {
    nodeType: 'your-component',
    label: 'Your Component', 
    icon: 'Settings',
    color: 'primary',
    yourConfig: {  // Your component's data
      field1: '',
      field2: 0,
      field3: false
    }
  }
})
```

---

## 🔌 Step 4: Add Component Rendering in QFlow

### File: `packages/qwanyx-canvas/src/components/QFlow.tsx`

1. **Import your component** at the top:
```typescript
import { YourComponent } from './YourComponent'
```

2. **Add rendering case** in the expanded card section (around line 865):
```typescript
{node.data.nodeType === 'your-component' ? (
  // Your Component
  <YourComponent
    compact={true}
    dhEmail={context?.dhEmail}  // Pass any context needed
    initialConfig={node.data.yourConfig}
    onSave={(config) => {
      // Update node data with new config
      const currentNodeId = node._id || (node as any).id
      const newNodes = nodes.map(n => {
        const nId = n._id || (n as any).id
        return (nId && getIdString(nId) === getIdString(currentNodeId))
          ? { ...n, data: { ...n.data, yourConfig: config } }
          : n
      })
      setNodes(newNodes)
      onNodesChange?.(newNodes)
      console.log('Your config saved for node:', nodeIdStr)
    }}
  />
) : node.data.nodeType === 'smtp' ? (
  // Existing SMTP component...
```

---

## 🎯 Step 5: Handle Node Drop in Editor

### File: `packages/qwanyx-thot/src/pages/DigitalHumanEditor.tsx`

Add case in `handleDrop` function (around line 306):
```typescript
// Add Your Component config data
...(nodeType === 'your-component' ? {
  nodeType: 'your-component',
  color: 'primary',
  icon: 'Settings',
  label: 'Your Component',
  yourConfig: {
    field1: '',
    field2: 0,
    field3: false
  }
} : {}),
```

---

## 🔨 Step 6: Build and Test

```bash
# 1. Build the canvas package
cd packages/qwanyx-canvas
npm run build

# 2. Build the thot package
cd ../qwanyx-thot
npm run build

# 3. The Next.js dev server should auto-reload
```

---

## ✅ Component Checklist

- [ ] Component uses ONLY @qwanyx/ui components (no HTML elements)
- [ ] Component has compact and full modes
- [ ] Component auto-saves on change (no save button)
- [ ] Component exported from package index
- [ ] Node registered in NodeRegistry
- [ ] Component imported in QFlow
- [ ] Rendering case added in QFlow
- [ ] Drop handling added in DigitalHumanEditor
- [ ] TypeScript compiles with no errors
- [ ] Component data properly typed

---

## 🎨 Visual Behavior

When complete, your node will:
1. **Appear in palette** - Under the category you specified
2. **Drag and drop** - Creates icon node on canvas
3. **Display as icon** - Beautiful gradient icon with label
4. **Double-click to expand** - Shows your component below
5. **Auto-save changes** - Updates flow immediately
6. **Collapse on double-click** - Returns to icon view
7. **Draggable** - From icon or card background

---

## 🐛 Common Issues

### TypeScript Errors
- Check all imports are from @qwanyx/ui
- Ensure InputProps use `inputSize` not `size`
- Flex uses `direction="col"` not `"column"`
- Card variants: 'elevated', 'outlined', 'filled', 'glass', 'gradient', 'neon'

### Component Not Showing
- Verify nodeType matches in all locations
- Check component is exported from index.ts
- Ensure packages are rebuilt
- Check browser console for errors

### Dragging Issues
- Card should have `onMouseDown` handler for dragging
- Inputs should stop propagation to prevent drag

---

## 📚 Reference Implementation

See `SmtpConfig.tsx` for a complete working example that follows all guidelines.

---

## 🚀 Quick Copy Template

For Claude AI: When asked to create a new QFlow node component, follow this exact recipe:
1. Create component in packages/qwanyx-canvas/src/components/
2. Export from packages/qwanyx-canvas/src/index.ts
3. Register in packages/qwanyx-thot/src/execution/NodeRegistry.ts
4. Add rendering in packages/qwanyx-canvas/src/components/QFlow.tsx
5. Handle drop in packages/qwanyx-thot/src/pages/DigitalHumanEditor.tsx
6. Build both packages
7. Test in browser

Remember: NO HTML elements, NO save buttons, ALWAYS auto-save!