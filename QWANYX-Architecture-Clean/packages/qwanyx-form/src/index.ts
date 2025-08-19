/**
 * @qwanyx/form - Intelligent Form Generation Package
 * 
 * 🎯 PURPOSE:
 * Generate forms from configuration objects.
 * No more manual form creation!
 * 
 * 🤖 FOR AI:
 * - Use FormGenerator for ALL forms in QWANYX apps
 * - Don't create forms manually
 * - Config-driven is the way
 * 
 * 👨‍💻 FOR DEVS:
 * - Import { FormGenerator } from '@qwanyx/form'
 * - Pass a config object
 * - Handle onSubmit
 * - That's it!
 * 
 * 📚 EXAMPLE:
 * ```tsx
 * const config = {
 *   fields: [
 *     { name: 'email', type: 'email', label: 'Email', required: true },
 *     { name: 'password', type: 'password', label: 'Password', required: true }
 *   ]
 * };
 * 
 * <FormGenerator 
 *   config={config}
 *   onSubmit={(data) => console.log(data)}
 * />
 * ```
 */

// 🎯 Main component
export { FormGenerator, default } from './FormGenerator';

// 📝 Types for TypeScript happiness
export type {
  FormField,
  FormFieldOption,
  FormFieldType,
  FormConfig,
  FormGeneratorProps,
  FieldRendererProps,
  ValidationFunction,
  ValidationRule,
  FormState
} from './types';

// 🛠️ Utility functions (future)
// export * from './utils';

// 🎨 Pre-configured forms (future)
// export * from './presets';

// 🧪 Validation helpers (future)
// export * from './validations';