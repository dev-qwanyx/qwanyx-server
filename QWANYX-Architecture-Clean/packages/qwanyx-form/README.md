# @qwanyx/form

🎯 **Intelligent Form Generation for QWANYX Applications**

## 🤖 For AI Developers

**IMPORTANT**: This is the ONLY way to create forms in QWANYX apps. Never build forms manually!

```typescript
// ✅ CORRECT - Use FormGenerator
import { FormGenerator } from '@qwanyx/form';

// ❌ WRONG - Don't build forms manually
const MyForm = () => { /* manual form code */ };
```

## 📦 Installation

```bash
npm install @qwanyx/form
```

## 🚀 Quick Start

```tsx
import { FormGenerator } from '@qwanyx/form';
import type { FormConfig } from '@qwanyx/form';

const config: FormConfig = {
  fields: [
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
      validation: 'email'
    },
    {
      name: 'accountType',
      type: 'radio',
      label: 'Account Type',
      options: [
        { value: 'personal', label: 'Personal' },
        { value: 'business', label: 'Business' }
      ]
    },
    {
      name: 'services',
      type: 'checkbox',
      label: 'Services',
      options: [
        { value: 'repair', label: 'Repair' },
        { value: 'maintenance', label: 'Maintenance' },
        { value: 'inspection', label: 'Inspection' }
      ]
    }
  ]
};

function MyForm() {
  const handleSubmit = (data: any) => {
    console.log('Form data:', data);
  };

  return <FormGenerator config={config} onSubmit={handleSubmit} />;
}
```

## 📋 Supported Field Types

### Text Inputs
- `text` - Standard text input
- `email` - Email with validation
- `password` - Password input
- `tel` - Phone number
- `url` - URL input
- `number` - Numeric input
- `search` - Search input
- `textarea` - Multi-line text

### Selection
- `select` - Dropdown menu
- `radio` - Radio button group (single selection)
- `checkbox` - Checkbox(es) (single or multiple)
- `switch` - Toggle switch

### Special
- `file` - File upload
- `otp` - 6-digit OTP input
- `date`, `time`, `datetime-local` - Date/time inputs
- `color` - Color picker
- `range` - Slider

## 🎨 Field Configuration

```typescript
interface FormField {
  // Required
  name: string;
  type: FormFieldType;
  
  // Display
  label?: string;
  placeholder?: string;
  helperText?: string;
  
  // Validation
  required?: boolean;
  validation?: 'email' | 'phone' | 'url' | RegExp | Function;
  
  // Options (for select, radio, checkbox)
  options?: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
  }>;
  
  // Conditional display
  showIf?: string | ((formData: any) => boolean);
  
  // Layout
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}
```

## 🔧 Advanced Features

### Conditional Fields

```typescript
{
  name: 'companyName',
  type: 'text',
  label: 'Company Name',
  showIf: (formData) => formData.accountType === 'business'
}
```

### Custom Validation

```typescript
{
  name: 'age',
  type: 'number',
  validation: (value) => value >= 18 || 'Must be 18 or older'
}
```

### With Zod Schema

```typescript
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18)
});

const config: FormConfig = {
  fields: [...],
  schema: schema
};
```

## 🏗️ Architecture

```
@qwanyx/form
    ├── FormGenerator (main component)
    ├── FieldRenderer (renders individual fields)
    └── Uses @qwanyx/ui components
```

## 🛠️ For Package Developers

### Adding a New Field Type

1. Add type to `FormFieldType` in `types.ts`
2. Add case in `FieldRenderer` switch statement
3. Import component from `@qwanyx/ui`
4. Add documentation here

### Testing

```bash
npm run test
```

### Building

```bash
npm run build
```

## 📝 License

MIT © QWANYX Team