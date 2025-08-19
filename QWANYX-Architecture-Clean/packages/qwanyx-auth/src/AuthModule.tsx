import React, { useState, useCallback } from 'react'
import { 
  Modal, 
  Button, 
  Input, 
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  SimpleSelect,
  Text, 
  Heading, 
  OTPInput,
  Alert 
} from '@qwanyx/ui'
import { getTranslation, Locale } from './translations'

// Field configuration type
export interface AuthField {
  name: string
  label: string
  type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'select' | 'checkbox' | 'radio'
  placeholder?: string
  required?: boolean
  validation?: 'email' | 'phone' | 'linkedin' | 'vat' | 'url' | RegExp | ((value: string) => boolean | string)
  options?: Array<{ value: string; label: string; disabled?: boolean }> // For select and radio types
  showIf?: string | ((formData: any) => boolean) // Conditional display
  defaultValue?: any
  helperText?: string
  autoComplete?: string
}

export interface AuthModuleProps {
  // Core props
  workspace: string
  apiUrl?: string
  locale?: Locale // Language setting
  
  // Field configuration
  fields?: AuthField[]
  loginFields?: AuthField[] // Override fields for login
  registerFields?: AuthField[] // Override fields for register
  
  // Customization
  logo?: string
  primaryColor?: string
  buttonText?: {
    login?: string
    register?: string
    submit?: string
    switchToLogin?: string
    switchToRegister?: string
  }
  
  // Behavior
  initialMode?: 'login' | 'register'
  allowModeSwitch?: boolean
  rememberMe?: boolean
  passwordless?: boolean // For email-only auth
  
  // Callbacks
  onSuccess?: (user: any, token?: string) => void
  onError?: (error: string) => void
  beforeSubmit?: (data: any, mode: 'login' | 'register') => any
  
  // Modal props (if used as modal)
  isOpen?: boolean
  onClose?: () => void
  asModal?: boolean
  
  // Standalone button props
  asButton?: boolean
  buttonVariant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  buttonSize?: 'sm' | 'md' | 'lg'
  buttonClassName?: string
}

// We'll define default fields inside the component to access translations

// Validation functions
const validators = {
  email: (value: string, t: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) || t.invalidEmail
  },
  phone: (value: string, t: any) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    return phoneRegex.test(value) || t.invalidPhone
  },
  linkedin: (value: string, t: any) => {
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\//
    return linkedinRegex.test(value) || t.invalidLinkedin
  },
  vat: (value: string, t: any) => {
    // Simple VAT validation (can be enhanced)
    const vatRegex = /^[A-Z]{2}\d+$/
    return vatRegex.test(value) || t.invalidVat
  },
  url: (value: string, t: any) => {
    try {
      new URL(value)
      return true
    } catch {
      return t.invalidUrl
    }
  }
}

export const AuthModule: React.FC<AuthModuleProps> = ({
  workspace,
  apiUrl = 'http://localhost:5002',
  locale = 'fr',
  fields,
  loginFields,
  registerFields,
  logo,
  primaryColor = 'rgb(var(--qwanyx-primary))',
  buttonText = {},
  initialMode = 'login',
  allowModeSwitch = true,
  rememberMe = true,
  passwordless = true,
  onSuccess,
  onError,
  beforeSubmit,
  isOpen: controlledIsOpen,
  onClose,
  asModal = false,
  asButton = false,
  buttonVariant = 'primary',
  buttonSize = 'md',
  buttonClassName = ''
}) => {
  const t = getTranslation(locale);
  
  // Default fields with translations
  const defaultLoginFields: AuthField[] = [
    {
      name: 'email',
      label: t.email,
      type: 'email',
      placeholder: t.emailPlaceholder,
      required: true,
      validation: 'email',
      autoComplete: 'email'
    }
  ];

  const defaultRegisterFields: AuthField[] = [
    {
      name: 'email',
      label: t.email,
      type: 'email',
      placeholder: t.emailPlaceholder,
      required: true,
      validation: 'email',
      autoComplete: 'email'
    },
    {
      name: 'firstName',
      label: t.firstName,
      type: 'text',
      required: true,
      autoComplete: 'given-name'
    },
    {
      name: 'lastName',
      label: t.lastName,
      type: 'text',
      required: true,
      autoComplete: 'family-name'
    }
  ];
  
  // Use provided fields or defaults
  const finalLoginFields = loginFields || fields || defaultLoginFields;
  const finalRegisterFields = registerFields || fields || defaultRegisterFields;
  
  // Helper function to translate API messages
  const translateApiMessage = (message: string): string => {
    const lowercaseMsg = message.toLowerCase();
    
    // Map common API messages to translations
    if (lowercaseMsg.includes('user already exists')) return t.userAlreadyExists;
    if (lowercaseMsg.includes('code sent')) return t.codeSent;
    if (lowercaseMsg.includes('registration successful')) return t.registrationSuccessful;
    if (lowercaseMsg.includes('invalid') && lowercaseMsg.includes('code')) return t.codeInvalidMessage;
    
    // Return original message if no translation found
    return message;
  };
  
  // Helper function to determine if message is success or error
  const isSuccessMessage = (message: string): boolean => {
    const lowercaseMsg = message.toLowerCase();
    return lowercaseMsg.includes('sent') || 
           lowercaseMsg.includes('success') || 
           lowercaseMsg.includes('envoyé') ||
           lowercaseMsg.includes('réussi');
  };
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [formData, setFormData] = useState<any>({})
  const [errors, setErrors] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showOTP, setShowOTP] = useState(false)
  const [otpValue, setOtpValue] = useState('')
  const [userEmail, setUserEmail] = useState('')
  
  // Handle controlled/uncontrolled modal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : isModalOpen
  const handleClose = () => {
    if (onClose) onClose()
    setIsModalOpen(false)
    setFormData({})
    setErrors({})
    setMessage('')
    setShowOTP(false)
    setOtpValue('')
    setUserEmail('')
  }
  
  const handleOpen = () => {
    setIsModalOpen(true)
  }
  
  // Get current fields based on mode
  const currentFields = mode === 'login' ? finalLoginFields : finalRegisterFields
  
  // Check if field should be displayed
  const shouldShowField = (field: AuthField) => {
    if (!field.showIf) return true
    
    if (typeof field.showIf === 'string') {
      return !!formData[field.showIf]
    }
    
    if (typeof field.showIf === 'function') {
      return field.showIf(formData)
    }
    
    return true
  }
  
  // Validate single field
  const validateField = (field: AuthField, value: any) => {
    // For checkbox groups with options, check if at least one is selected
    if (field.type === 'checkbox' && field.options && field.options.length > 0) {
      if (field.required) {
        const hasSelection = value && Object.values(value).some((checked) => checked === true)
        if (!hasSelection) {
          return `${field.label} ${t.fieldRequired}`
        }
      }
    } else if (field.required && !value) {
      return `${field.label} ${t.fieldRequired}`
    }
    
    if (value && field.validation) {
      if (typeof field.validation === 'string' && validators[field.validation as keyof typeof validators]) {
        const result = validators[field.validation as keyof typeof validators](value, t)
        if (result !== true) return result
      } else if (field.validation instanceof RegExp) {
        if (!field.validation.test(value)) {
          return `${field.label} ${t.invalidField}`
        }
      } else if (typeof field.validation === 'function') {
        const result = field.validation(value)
        if (result !== true) return result
      }
    }
    
    return null
  }
  
  // Handle field change
  const handleFieldChange = (field: AuthField, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field.name]: value }))
    
    // Clear error on change
    if (errors[field.name]) {
      setErrors((prev: any) => ({ ...prev, [field.name]: null }))
    }
  }
  
  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const newErrors: any = {}
    let hasError = false
    
    currentFields.forEach(field => {
      if (shouldShowField(field)) {
        const error = validateField(field, formData[field.name])
        if (error) {
          newErrors[field.name] = error
          hasError = true
        }
      }
    })
    
    if (hasError) {
      setErrors(newErrors)
      return
    }
    
    setLoading(true)
    setMessage('')
    
    try {
      // Prepare data
      let dataToSend = { ...formData, workspace }
      
      // Call beforeSubmit if provided
      if (beforeSubmit) {
        dataToSend = await beforeSubmit(dataToSend, mode)
      }
      
      // API call
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/login'
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        if (passwordless && (mode === 'register' || !data.token)) {
          // Show OTP input after successful registration or login request
          setShowOTP(true)
          setUserEmail(formData.email || dataToSend.email)
          const msg = translateApiMessage(data.message || t.codeSentMessage)
          setMessage(msg)
        } else if (data.token) {
          // Success with token
          // Store in localStorage
          if (rememberMe && formData.rememberMe) {
            const expiryTime = Date.now() + (5 * 24 * 60 * 60 * 1000) // 5 days
            localStorage.setItem(`${workspace}_token`, data.token)
            localStorage.setItem(`${workspace}_user`, JSON.stringify(data.user))
            localStorage.setItem(`${workspace}_token_expiry`, expiryTime.toString())
          } else {
            sessionStorage.setItem(`${workspace}_token`, data.token)
            sessionStorage.setItem(`${workspace}_user`, JSON.stringify(data.user))
          }
          
          if (onSuccess) {
            onSuccess(data.user, data.token)
          }
          
          handleClose()
        }
      } else {
        const error = translateApiMessage(data.error || t.unexpectedError)
        setMessage(error)
        if (onError) onError(error)
      }
    } catch (err) {
      const error = t.connectionError
      setMessage(error)
      if (onError) onError(error)
    } finally {
      setLoading(false)
    }
  }
  
  // Handle OTP verification - wrapped in useCallback to prevent re-creation
  const handleOTPComplete = useCallback(async (code: string) => {
    // Only verify when we have exactly 6 digits
    if (code.length !== 6) {
      return
    }
    
    setLoading(true)
    setMessage('')
    
    try {
      const response = await fetch(`${apiUrl}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          code: code,
          workspace: workspace
        })
      })
      
      const data = await response.json()
      
      if (response.ok && data.access_token) {
        // Success with token
        // Store in localStorage
        if (rememberMe && formData.rememberMe) {
          const expiryTime = Date.now() + (5 * 24 * 60 * 60 * 1000) // 5 days
          localStorage.setItem(`${workspace}_token`, data.access_token)
          localStorage.setItem(`${workspace}_user`, JSON.stringify(data.user))
          localStorage.setItem(`${workspace}_token_expiry`, expiryTime.toString())
        } else {
          sessionStorage.setItem(`${workspace}_token`, data.access_token)
          sessionStorage.setItem(`${workspace}_user`, JSON.stringify(data.user))
        }
        
        if (onSuccess) {
          onSuccess(data.user, data.access_token)
        }
        
        handleClose()
      } else {
        const error = translateApiMessage(data.error || t.codeInvalidMessage)
        setMessage(error)
        setOtpValue('') // Reset OTP input
      }
    } catch (err) {
      setMessage(t.connectionError)
      setOtpValue('')
    } finally {
      setLoading(false)
    }
  }, [apiUrl, userEmail, workspace, rememberMe, formData.rememberMe, onSuccess])
  
  // Render field input
  const renderField = (field: AuthField) => {
    if (!shouldShowField(field)) return null
    
    const commonProps = {
      name: field.name,
      placeholder: field.placeholder || field.label,
      required: field.required,
      disabled: loading,
      autoComplete: field.autoComplete,
      fullWidth: true
    }
    
    switch (field.type) {
      case 'checkbox':
        // 🤖 AI Note: Si le checkbox a des options, on crée un groupe de checkboxes
        // Sinon, c'est un simple checkbox boolean
        if (field.options && field.options.length > 0) {
          return (
            <div key={field.name} style={{ marginBottom: '1rem' }}>
              <Text size="sm" weight="medium" style={{ marginBottom: '0.5rem', display: 'block' }}>
                {field.label} {field.required && '*'}
              </Text>
              <CheckboxGroup
                orientation="vertical"
                gap="sm"
              >
                {field.options.map((option) => (
                  <Checkbox
                    key={option.value}
                    checked={formData[field.name]?.[option.value] || false}
                    onChange={(checked: boolean) => {
                      // Store as object { optionValue: true/false }
                      const newValue = { ...formData[field.name], [option.value]: checked }
                      handleFieldChange(field, newValue)
                    }}
                    label={option.label}
                    disabled={loading || option.disabled}
                  />
                ))}
              </CheckboxGroup>
              {field.helperText && (
                <Text size="xs" color="secondary" style={{ marginTop: '0.25rem' }}>
                  {field.helperText}
                </Text>
              )}
              {errors[field.name] && (
                <Text size="xs" color="error" style={{ marginTop: '0.25rem' }}>
                  {errors[field.name]}
                </Text>
              )}
            </div>
          )
        } else {
          // Simple boolean checkbox
          return (
            <Checkbox
              key={field.name}
              checked={formData[field.name] || false}
              onChange={(checked: boolean) => handleFieldChange(field, checked)}
              label={field.label}
            />
          )
        }
        
      case 'radio':
        return (
          <div key={field.name} style={{ marginBottom: '1rem' }}>
            <Text size="sm" weight="medium" style={{ marginBottom: '0.5rem', display: 'block' }}>
              {field.label} {field.required && '*'}
            </Text>
            <RadioGroup
              name={field.name}
              value={formData[field.name] || field.defaultValue || ''}
              onChange={(value: string) => handleFieldChange(field, value)}
              orientation="horizontal"
            >
              {field.options?.map(opt => (
                <Radio 
                  key={opt.value}
                  name={field.name}
                  value={opt.value}
                  label={opt.label}
                  disabled={loading}
                />
              ))}
            </RadioGroup>
            {field.helperText && (
              <Text size="xs" color="secondary" style={{ marginTop: '0.25rem' }}>
                {field.helperText}
              </Text>
            )}
            {errors[field.name] && (
              <Text size="xs" color="error" style={{ marginTop: '0.25rem' }}>
                {errors[field.name]}
              </Text>
            )}
          </div>
        )
        
      case 'select':
        return (
          <div key={field.name} style={{ marginBottom: '1rem' }}>
            <Text size="sm" weight="medium" style={{ marginBottom: '0.25rem', display: 'block' }}>
              {field.label} {field.required && '*'}
            </Text>
            <SimpleSelect
              {...commonProps}
              value={formData[field.name] || ''}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              options={field.options || []}
              placeholder="Sélectionner..."
              fullWidth={true}
            />
            {field.helperText && (
              <Text size="xs" color="secondary" style={{ marginTop: '0.25rem' }}>
                {field.helperText}
              </Text>
            )}
            {errors[field.name] && (
              <Text size="xs" color="error" style={{ marginTop: '0.25rem' }}>
                {errors[field.name]}
              </Text>
            )}
          </div>
        )
        
      default:
        return (
          <div key={field.name} style={{ marginBottom: '1rem' }}>
            {field.label && (
              <Text size="sm" weight="medium" style={{ marginBottom: '0.25rem', display: 'block' }}>
                {field.label} {field.required && '*'}
              </Text>
            )}
            <Input
              {...commonProps}
              type={field.type || 'text'}
              value={formData[field.name] || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field, e.target.value)}
            />
            {field.helperText && (
              <Text size="xs" color="secondary" style={{ marginTop: '0.25rem' }}>
                {field.helperText}
              </Text>
            )}
            {errors[field.name] && (
              <Text size="xs" color="error" style={{ marginTop: '0.25rem' }}>
                {errors[field.name]}
              </Text>
            )}
          </div>
        )
    }
  }
  
  // Auth form content
  const authContent = (
    <div style={{ padding: (asModal || asButton) ? '2rem' : '0', minWidth: (asModal || asButton) ? '400px' : 'auto' }}>
      {logo && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src={logo} alt="Logo" style={{ height: '60px' }} />
        </div>
      )}
      
      <Heading size="2xl" style={{
        marginBottom: '1.5rem',
        color: primaryColor,
        textAlign: 'center'
      }}>
        {showOTP 
          ? t.verification
          : mode === 'register' 
            ? (buttonText.register || t.register)
            : (buttonText.login || t.login)
        }
      </Heading>
      
      {showOTP ? (
        // OTP Verification View
        <div>
          <Text style={{ 
            textAlign: 'center', 
            marginBottom: '1rem',
            color: 'rgb(var(--qwanyx-text-secondary))'
          }}>
            {t.otpInstructions}<br />
            <strong>{userEmail}</strong>
          </Text>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            <OTPInput
              value={otpValue}
              onChange={setOtpValue}
              onComplete={handleOTPComplete}
              autoFocus
              disabled={loading}
              error={!!message && message.includes('invalide')}
            />
          </div>
          
          {message && (
            <Alert 
              variant={isSuccessMessage(message) ? 'success' : 'error'}
              style={{ marginBottom: '1rem' }}
            >
              {message}
            </Alert>
          )}
          
          <Button
            variant="ghost"
            onClick={() => {
              setShowOTP(false)
              setOtpValue('')
              setMessage('')
            }}
            fullWidth
            style={{ marginTop: '1rem' }}
          >
            {t.back}
          </Button>
        </div>
      ) : (
        // Login/Register Form View
        <>
          <form onSubmit={handleSubmit}>
            {currentFields.map(renderField)}
            
            {rememberMe && mode === 'login' && (
              <div style={{ marginBottom: '1rem' }}>
                <Checkbox
                  checked={formData.rememberMe || false}
                  onChange={(checked: boolean) => setFormData((prev: any) => ({ ...prev, rememberMe: checked }))}
                  label={t.rememberMe}
                />
              </div>
            )}
            
            {message && (
              <Alert 
                variant={isSuccessMessage(message) ? 'success' : 'error'}
                style={{ marginBottom: '1rem' }}
              >
                {message}
              </Alert>
            )}
            
            <Button
              type="submit"
              disabled={loading}
              fullWidth
              style={{
                backgroundColor: primaryColor,
                borderColor: primaryColor
              }}
            >
              {loading ? t.loading : (buttonText.submit || (mode === 'register' ? t.submitRegister : t.submitLogin))}
            </Button>
          </form>
          
          {allowModeSwitch && (
            <div style={{
              marginTop: '1.5rem',
              textAlign: 'center',
              paddingTop: '1rem',
              borderTop: '1px solid rgb(var(--qwanyx-border))'
            }}>
              <Text style={{ fontSize: '0.875rem', color: 'rgb(var(--qwanyx-text-secondary))' }}>
                {mode === 'register' ? t.alreadyHaveAccount : t.noAccountYet}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
                  style={{
                    marginLeft: '0.5rem',
                    color: primaryColor
                  }}
                >
                  {mode === 'register' 
                    ? (buttonText.switchToLogin || t.switchToLogin)
                    : (buttonText.switchToRegister || t.switchToRegister)
                  }
                </Button>
              </Text>
            </div>
          )}
        </>
      )}
    </div>
  )
  
  // If used as button, render button that opens modal
  if (asButton) {
    return (
      <>
        <Button
          variant={buttonVariant}
          size={buttonSize}
          onClick={handleOpen}
          className={buttonClassName}
          style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
        >
          {buttonText.login || t.login}
        </Button>
        
        {isOpen && (
          <Modal isOpen={isOpen} onClose={handleClose}>
            {authContent}
          </Modal>
        )}
      </>
    )
  }
  
  // If used as modal - render directly like the test modal that works
  if (asModal) {
    if (!isOpen) return null;
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '500px',
          width: '90%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative'
        }}>
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#666',
              zIndex: 1
            }}
          >
            ×
          </button>
          {authContent}
        </div>
      </div>
    )
  }
  
  // Standalone form
  return authContent
}