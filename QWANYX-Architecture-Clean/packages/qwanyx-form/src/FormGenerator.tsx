/**
 * FormGenerator Component
 * 
 * 🎯 PURPOSE:
 * This is the brain of the form system. It takes a configuration object
 * and generates a complete, functional form with validation.
 * 
 * 🤖 FOR AI DEVELOPERS:
 * - This component is the SINGLE source of truth for form generation
 * - DO NOT create forms manually in apps - use this instead
 * - When adding new field types, follow the existing pattern
 * - All components come from @qwanyx/ui - don't use native HTML
 * 
 * 👨‍💻 FOR HUMAN DEVELOPERS:
 * - Keep this component pure - no business logic here
 * - Field types should be extensible without modifying core logic
 * - Use TypeScript strictly - no 'any' unless absolutely necessary
 * - Test every new field type you add
 * 
 * 📚 ARCHITECTURE NOTES:
 * FormGenerator (this) -> FieldRenderer -> @qwanyx/ui components
 * The flow is: Config → Validation → Rendering → User Input → Submit
 */

import React, { useCallback, useMemo } from 'react';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Input,
  SimpleSelect,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Switch,
  OTPInput,
  Grid,
  Text,
  Alert
} from '@qwanyx/ui';

// 🤖 AI Note: Not all components exist yet in @qwanyx/ui
// We'll need to add missing ones or create simple fallbacks
// For now, using what's available
import { FormGeneratorProps, FieldRendererProps } from './types';

/**
 * FieldRenderer Component
 * 
 * 🎯 Renders individual form fields based on their type
 * 
 * 🤖 AI NOTE: When adding new field types:
 * 1. Add the type to FormFieldType in types.ts
 * 2. Add a case here
 * 3. Import the component from @qwanyx/ui
 * 4. Document the expected props
 * 
 * 👨‍💻 DEV NOTE: Each case should be self-contained and simple.
 * Complex logic goes in separate components, not here.
 */
const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  error,
  onChange,
  onBlur,
  disabled
}) => {
  // 🔍 Helper: Check if we should show this field
  // AI: This handles conditional fields based on other form values
  const shouldShow = useMemo(() => {
    if (!field.showIf) return true;
    // TODO: Implement showIf logic with form context
    return true;
  }, [field.showIf]);

  if (!shouldShow) return null;

  // 🎨 Common props shared by most inputs
  // DEV: Add new common props here, not in each case
  const commonProps = {
    name: field.name,
    disabled: disabled || field.disabled,
    placeholder: field.placeholder,
    className: field.className,
    fullWidth: field.fullWidth ?? true,
  };

  // 🏭 The field factory - maps types to components
  // AI: This is where the magic happens. Each type gets its own renderer.
  switch (field.type) {
    // 📝 TEXT INPUTS
    case 'text':
    case 'email':
    case 'password':
    case 'tel':
    case 'url':
    case 'number':
    case 'search':
      return (
        <div className="form-field">
          {field.label && (
            <Text size="sm" weight="medium" className="mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Text>
          )}
          <Input
            {...commonProps}
            type={field.type}
            value={value || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            onBlur={onBlur}
            min={field.min}
            max={field.max}
            step={field.step}
            inputSize={field.size || 'md'}
          />
          {field.helperText && (
            <Text size="xs" color="secondary" className="mt-1">
              {field.helperText}
            </Text>
          )}
          {error && (
            <Text size="xs" color="error" className="mt-1">
              {error}
            </Text>
          )}
        </div>
      );

    // 📄 TEXTAREA
    case 'textarea':
      return (
        <div className="form-field">
          {field.label && (
            <Text size="sm" weight="medium" className="mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Text>
          )}
          {/* Using textarea until Textarea component is available */}
          <textarea
            {...commonProps}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            rows={field.rows || 4}
            style={{
              width: field.fullWidth ? '100%' : 'auto',
              padding: '8px 12px',
              border: '1px solid rgb(var(--qwanyx-border))',
              borderRadius: 'var(--qwanyx-radius)',
              backgroundColor: 'rgb(var(--qwanyx-background))',
              color: 'rgb(var(--qwanyx-foreground))'
            }}
          />
          {field.helperText && (
            <Text size="xs" color="secondary" className="mt-1">
              {field.helperText}
            </Text>
          )}
          {error && (
            <Text size="xs" color="error" className="mt-1">
              {error}
            </Text>
          )}
        </div>
      );

    // 📋 SELECT DROPDOWN
    case 'select':
      return (
        <div className="form-field">
          {field.label && (
            <Text size="sm" weight="medium" className="mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Text>
          )}
          <SimpleSelect
            {...commonProps}
            value={value || ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
            onBlur={onBlur}
            options={(field.options || []).map(opt => ({ 
              value: String(opt.value), 
              label: opt.label, 
              disabled: opt.disabled 
            }))}
            selectSize={field.size || 'md'}
          />
          {field.helperText && (
            <Text size="xs" color="secondary" className="mt-1">
              {field.helperText}
            </Text>
          )}
          {error && (
            <Text size="xs" color="error" className="mt-1">
              {error}
            </Text>
          )}
        </div>
      );

    // 🔘 RADIO BUTTONS
    // AI: Radio creates a group with multiple options
    // Only ONE can be selected
    case 'radio':
      return (
        <div className="form-field">
          {field.label && (
            <Text size="sm" weight="medium" className="mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Text>
          )}
          {field.options && field.options.length > 0 ? (
            <RadioGroup
              name={field.name}
              value={value || ''}
              onChange={onChange}
              orientation="vertical"
            >
              {field.options.map((option) => (
                <Radio
                  key={option.value}
                  value={String(option.value)}
                  label={option.label}
                  disabled={option.disabled || disabled}
                />
              ))}
            </RadioGroup>
          ) : (
            <Text size="sm" color="error">No options provided for radio field</Text>
          )}
          {field.helperText && (
            <Text size="xs" color="secondary" className="mt-1">
              {field.helperText}
            </Text>
          )}
          {error && (
            <Text size="xs" color="error" className="mt-1">
              {error}
            </Text>
          )}
        </div>
      );

    // ☑️ CHECKBOXES
    // AI: This is the tricky one! Can be single OR multiple
    // DEV: If options exist -> multiple checkboxes (group)
    //      If no options -> single checkbox
    case 'checkbox':
      // 🎯 IMPORTANT: Check if we have options for multiple checkboxes
      if (field.options && field.options.length > 0) {
        // Multiple checkboxes - user can select many
        return (
          <div className="form-field">
            {field.label && (
              <Text size="sm" weight="medium" className="mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </Text>
            )}
            <CheckboxGroup
              orientation="vertical"
              gap="sm"
            >
              {field.options.map((option) => (
                <Checkbox
                  key={option.value}
                  checked={value?.[option.value] || false}
                  onChange={(checked) => {
                    // AI: Store as object { optionValue: true/false }
                    const newValue = { ...value, [option.value]: checked };
                    onChange(newValue);
                  }}
                  label={option.label}
                  disabled={option.disabled || disabled}
                />
              ))}
            </CheckboxGroup>
            {field.helperText && (
              <Text size="xs" color="secondary" className="mt-1">
                {field.helperText}
              </Text>
            )}
            {error && (
              <Text size="xs" color="error" className="mt-1">
                {error}
              </Text>
            )}
          </div>
        );
      } else {
        // Single checkbox - simple boolean
        return (
          <div className="form-field">
            <Checkbox
              checked={value || false}
              onChange={onChange}
              label={field.label}
              disabled={disabled}
            />
            {field.helperText && (
              <Text size="xs" color="secondary" className="mt-1">
                {field.helperText}
              </Text>
            )}
            {error && (
              <Text size="xs" color="error" className="mt-1">
                {error}
              </Text>
            )}
          </div>
        );
      }

    // 🎚️ SWITCH (like checkbox but fancier)
    case 'switch':
      return (
        <div className="form-field">
          <Switch
            checked={value || false}
            onChange={onChange}
            label={field.label}
            disabled={disabled}
          />
          {field.helperText && (
            <Text size="xs" color="secondary" className="mt-1">
              {field.helperText}
            </Text>
          )}
          {error && (
            <Text size="xs" color="error" className="mt-1">
              {error}
            </Text>
          )}
        </div>
      );

    // 📁 FILE INPUT
    case 'file':
      return (
        <div className="form-field">
          {field.label && (
            <Text size="sm" weight="medium" className="mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Text>
          )}
          {/* Using native file input until FileInput component is available */}
          <input
            {...commonProps}
            type="file"
            onChange={(e) => onChange(e.target.files)}
            accept={field.accept}
            multiple={field.multiple}
            style={{
              width: field.fullWidth ? '100%' : 'auto',
              padding: '8px 12px',
              border: '1px solid rgb(var(--qwanyx-border))',
              borderRadius: 'var(--qwanyx-radius)',
              backgroundColor: 'rgb(var(--qwanyx-background))',
              color: 'rgb(var(--qwanyx-foreground))'
            }}
          />
          {field.helperText && (
            <Text size="xs" color="secondary" className="mt-1">
              {field.helperText}
            </Text>
          )}
          {error && (
            <Text size="xs" color="error" className="mt-1">
              {error}
            </Text>
          )}
        </div>
      );

    // 🔢 OTP INPUT (6-digit code)
    case 'otp':
      return (
        <div className="form-field">
          {field.label && (
            <Text size="sm" weight="medium" className="mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Text>
          )}
          <OTPInput
            value={value || ''}
            onChange={onChange}
            disabled={disabled}
          />
          {field.helperText && (
            <Text size="xs" color="secondary" className="mt-1">
              {field.helperText}
            </Text>
          )}
          {error && (
            <Text size="xs" color="error" className="mt-1">
              {error}
            </Text>
          )}
        </div>
      );

    // 🎨 CUSTOM FIELD
    // AI: For special cases where you need full control
    // DEV: Use sparingly! Try to use standard types first
    case 'custom':
      // TODO: Implement custom field renderer
      return <div>Custom field: {field.name}</div>;

    // ❓ UNKNOWN TYPE
    // AI: This should never happen if types are correct
    // DEV: Add missing case above instead of ending up here
    default:
      console.warn(`Unknown field type: ${field.type}`);
      return (
        <Alert variant="error">
          Unknown field type: {field.type}
        </Alert>
      );
  }
};

/**
 * FormGenerator - The main component
 * 
 * 🎯 Takes a config and generates a complete form
 * 
 * 🤖 AI: This is what AuthModule and other packages should use
 * Never generate forms manually - always use this
 * 
 * 👨‍💻 DEV: Keep this lean. Logic goes in FieldRenderer or utils
 */
export const FormGenerator: React.FC<FormGeneratorProps> = ({
  config,
  onSubmit,
  onChange,
  onError,
  defaultValues,
  mode = 'onSubmit',
  className,
  style
}) => {
  // 🎣 React Hook Form setup
  // AI: This handles all form state, validation, and submission
  const methods = useForm({
    defaultValues: defaultValues || {},
    resolver: config.schema ? zodResolver(config.schema) : undefined,
    mode
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = methods;

  // 👀 Watch all values for onChange callback
  const watchedValues = watch();
  React.useEffect(() => {
    if (onChange) {
      onChange(watchedValues);
    }
  }, [watchedValues, onChange]);

  // 📤 Handle form submission
  const handleFormSubmit = useCallback(async (data: any) => {
    try {
      await onSubmit(data);
    } catch (error) {
      if (onError) {
        onError(error);
      }
    }
  }, [onSubmit, onError]);

  // 🎨 Render the form
  return (
    <FormProvider {...methods}>
      <form 
        onSubmit={handleSubmit(handleFormSubmit)}
        className={className}
        style={style}
      >
        {/* 📐 Grid layout for fields */}
        <Grid cols={(config.columns || 1) as any} gap={(config.gap === 'xs' || config.gap === '2xl') ? 'md' : (config.gap || 'md')}>
          {config.fields.map((field) => (
            <Controller
              key={field.name}
              name={field.name}
              control={control}
              rules={field.rules}
              render={({ field: { onChange, onBlur, value } }) => (
                <FieldRenderer
                  field={field}
                  value={value}
                  error={errors[field.name]?.message ? String(errors[field.name]!.message) : undefined}
                  onChange={onChange}
                  onBlur={onBlur}
                  disabled={isSubmitting}
                />
              )}
            />
          ))}
        </Grid>

        {/* 🎯 Form Actions */}
        <div className="form-actions mt-6 flex gap-3">
          {/* Submit Button */}
          <Button
            type="submit"
            variant={config.submitButton?.variant || 'solid'}
            color={config.submitButton?.color || 'primary'}
            fullWidth={config.submitButton?.fullWidth}
            loading={config.submitButton?.loading || isSubmitting}
            disabled={config.submitButton?.disabled || isSubmitting}
          >
            {config.submitButton?.text || 'Submit'}
          </Button>

          {/* Reset Button (optional) */}
          {config.resetButton?.show && (
            <Button
              type="reset"
              variant="ghost"
              onClick={() => methods.reset()}
            >
              {config.resetButton.text || 'Reset'}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

// 🎯 Export for convenience
export default FormGenerator;