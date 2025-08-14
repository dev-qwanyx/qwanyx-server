import React, { useState, useCallback } from 'react';
import { Modal, Button, Input, Checkbox, Text, Heading, OTPInput } from '@qwanyx/ui';
import { useAuth } from '../../hooks/useAuth';
import '@qwanyx/ui/dist/ui.css';

// Field configuration type
export interface AuthField {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'password' | 'select' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  validation?: 'email' | 'phone' | 'linkedin' | 'vat' | 'url' | RegExp | ((value: string) => boolean | string);
  options?: Array<{ value: string; label: string }>; // For select type
  showIf?: string | ((formData: any) => boolean); // Conditional display
  defaultValue?: any;
  helperText?: string;
  autoComplete?: string;
}

export interface AuthModuleProps {
  // Core props
  workspace: string;
  apiUrl?: string;
  
  // Field configuration
  fields?: AuthField[];
  loginFields?: AuthField[]; // Override fields for login
  registerFields?: AuthField[]; // Override fields for register
  
  // Customization
  logo?: string;
  primaryColor?: string;
  buttonText?: {
    login?: string;
    register?: string;
    submit?: string;
    switchToLogin?: string;
    switchToRegister?: string;
  };
  
  // Behavior
  initialMode?: 'login' | 'register';
  allowModeSwitch?: boolean;
  rememberMe?: boolean;
  passwordless?: boolean; // For email-only auth
  
  // Callbacks
  onSuccess?: (user: any, token?: string) => void;
  onError?: (error: string) => void;
  beforeSubmit?: (data: any, mode: 'login' | 'register') => any;
  
  // Modal props (if used as modal)
  isOpen?: boolean;
  onClose?: () => void;
  asModal?: boolean;
  
  // Standalone button props
  asButton?: boolean;
  buttonVariant?: 'primary' | 'secondary' | 'ghost';
  buttonSize?: 'sm' | 'md' | 'lg';
  buttonClassName?: string;
}

// Default fields configuration
const defaultLoginFields: AuthField[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'votre@email.com',
    required: true,
    validation: 'email',
    autoComplete: 'email'
  }
];

const defaultRegisterFields: AuthField[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'votre@email.com',
    required: true,
    validation: 'email',
    autoComplete: 'email'
  },
  {
    name: 'firstName',
    label: 'Prénom',
    type: 'text',
    required: true,
    autoComplete: 'given-name'
  },
  {
    name: 'lastName',
    label: 'Nom',
    type: 'text',
    required: true,
    autoComplete: 'family-name'
  }
];

// Validation functions
const validators = {
  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || 'Email invalide';
  },
  phone: (value: string) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(value) || 'Numéro de téléphone invalide';
  },
  linkedin: (value: string) => {
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\//;
    return linkedinRegex.test(value) || 'URL LinkedIn invalide';
  },
  vat: (value: string) => {
    // Simple VAT validation (can be enhanced)
    const vatRegex = /^[A-Z]{2}\d+$/;
    return vatRegex.test(value) || 'Numéro de TVA invalide';
  },
  url: (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return 'URL invalide';
    }
  }
};

const AuthModule: React.FC<AuthModuleProps> = ({
  workspace,
  apiUrl = 'http://localhost:5002',
  fields,
  loginFields = fields || defaultLoginFields,
  registerFields = fields || defaultRegisterFields,
  logo,
  primaryColor = 'var(--primary)',
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
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [userEmail, setUserEmail] = useState('');
  
  // Get auth context - only if AuthProvider is available
  let authContext: any = null;
  try {
    authContext = useAuth();
  } catch (e) {
    // AuthProvider not available, will handle auth locally
  }
  
  // Handle controlled/uncontrolled modal state
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : isModalOpen;
  const handleClose = () => {
    if (onClose) onClose();
    setIsModalOpen(false);
    setFormData({});
    setErrors({});
    setMessage('');
    setShowOTP(false);
    setOtpValue('');
    setUserEmail('');
  };
  
  const handleOpen = () => {
    setIsModalOpen(true);
  };
  
  // Get current fields based on mode
  const currentFields = mode === 'login' ? loginFields : registerFields;
  
  // Check if field should be displayed
  const shouldShowField = (field: AuthField) => {
    if (!field.showIf) return true;
    
    if (typeof field.showIf === 'string') {
      return !!formData[field.showIf];
    }
    
    if (typeof field.showIf === 'function') {
      return field.showIf(formData);
    }
    
    return true;
  };
  
  // Validate single field
  const validateField = (field: AuthField, value: any) => {
    if (field.required && !value) {
      return `${field.label} est requis`;
    }
    
    if (value && field.validation) {
      if (typeof field.validation === 'string' && validators[field.validation]) {
        const result = validators[field.validation](value);
        if (result !== true) return result;
      } else if (field.validation instanceof RegExp) {
        if (!field.validation.test(value)) {
          return `${field.label} invalide`;
        }
      } else if (typeof field.validation === 'function') {
        const result = field.validation(value);
        if (result !== true) return result;
      }
    }
    
    return null;
  };
  
  // Handle field change
  const handleFieldChange = (field: AuthField, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field.name]: value }));
    
    // Clear error on change
    if (errors[field.name]) {
      setErrors((prev: any) => ({ ...prev, [field.name]: null }));
    }
  };
  
  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: any = {};
    let hasError = false;
    
    currentFields.forEach(field => {
      if (shouldShowField(field)) {
        const error = validateField(field, formData[field.name]);
        if (error) {
          newErrors[field.name] = error;
          hasError = true;
        }
      }
    });
    
    if (hasError) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      // Prepare data
      let dataToSend = { ...formData, workspace };
      
      // Call beforeSubmit if provided
      if (beforeSubmit) {
        dataToSend = await beforeSubmit(dataToSend, mode);
      }
      
      // API call
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/login';
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (passwordless && (mode === 'register' || !data.token)) {
          // Show OTP input after successful registration or login request
          setShowOTP(true);
          setUserEmail(formData.email || dataToSend.email);
          setMessage(data.message || 'Un code à 6 chiffres a été envoyé à votre email');
        } else if (data.token) {
          // Success with token
          // Use auth context if available, otherwise store locally
          if (authContext) {
            authContext.login(data.token, data.user, rememberMe && formData.rememberMe);
          } else {
            // Fallback to localStorage
            if (rememberMe && formData.rememberMe) {
              const expiryTime = Date.now() + (5 * 24 * 60 * 60 * 1000); // 5 days
              localStorage.setItem(`${workspace}_token`, data.token);
              localStorage.setItem(`${workspace}_user`, JSON.stringify(data.user));
              localStorage.setItem(`${workspace}_token_expiry`, expiryTime.toString());
            } else {
              sessionStorage.setItem(`${workspace}_token`, data.token);
              sessionStorage.setItem(`${workspace}_user`, JSON.stringify(data.user));
            }
          }
          
          if (onSuccess) {
            onSuccess(data.user, data.token);
          }
          
          handleClose();
        }
      } else {
        const error = data.error || 'Une erreur est survenue';
        setMessage(error);
        if (onError) onError(error);
      }
    } catch (err) {
      const error = 'Erreur de connexion au serveur';
      setMessage(error);
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle OTP verification - wrapped in useCallback to prevent re-creation
  const handleOTPComplete = useCallback(async (code: string) => {
    // Only verify when we have exactly 6 digits
    if (code.length !== 6) {
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`${apiUrl}/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          code: code,
          workspace: workspace
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.access_token) {
        // Success with token
        if (authContext) {
          authContext.login(data.access_token, data.user, rememberMe && formData.rememberMe);
        } else {
          // Fallback to localStorage
          if (rememberMe && formData.rememberMe) {
            const expiryTime = Date.now() + (5 * 24 * 60 * 60 * 1000); // 5 days
            localStorage.setItem(`${workspace}_token`, data.access_token);
            localStorage.setItem(`${workspace}_user`, JSON.stringify(data.user));
            localStorage.setItem(`${workspace}_token_expiry`, expiryTime.toString());
          } else {
            sessionStorage.setItem(`${workspace}_token`, data.access_token);
            sessionStorage.setItem(`${workspace}_user`, JSON.stringify(data.user));
          }
        }
        
        if (onSuccess) {
          onSuccess(data.user, data.access_token);
        }
        
        handleClose();
      } else {
        setMessage(data.error || 'Code invalide ou expiré');
        setOtpValue(''); // Reset OTP input
      }
    } catch (err) {
      setMessage('Erreur de connexion au serveur');
      setOtpValue('');
    } finally {
      setLoading(false);
    }
  }, [apiUrl, userEmail, workspace, authContext, rememberMe, formData.rememberMe, onSuccess, handleClose]);
  
  // Render field input
  const renderField = (field: AuthField) => {
    if (!shouldShowField(field)) return null;
    
    const commonProps = {
      name: field.name,
      placeholder: field.placeholder || field.label,
      required: field.required,
      disabled: loading,
      autoComplete: field.autoComplete,
      style: { width: '100%' }
    };
    
    switch (field.type) {
      case 'checkbox':
        return (
          <Checkbox
            key={field.name}
            checked={formData[field.name] || false}
            onChange={(checked: boolean) => handleFieldChange(field, checked)}
            label={field.label}
          />
        );
        
      case 'select':
        return (
          <div key={field.name} style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
              {field.label} {field.required && '*'}
            </label>
            <select
              {...commonProps}
              value={formData[field.name] || ''}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid var(--gray-300)'
              }}
            >
              <option value="">Sélectionner...</option>
              {field.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors[field.name] && (
              <Text style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {errors[field.name]}
              </Text>
            )}
          </div>
        );
        
      default:
        return (
          <div key={field.name} style={{ marginBottom: '1rem' }}>
            <Input
              {...commonProps}
              type={field.type || 'text'}
              value={formData[field.name] || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange(field, e.target.value)}
            />
            {field.helperText && (
              <Text style={{ fontSize: '0.75rem', color: 'var(--gray-600)', marginTop: '0.25rem' }}>
                {field.helperText}
              </Text>
            )}
            {errors[field.name] && (
              <Text style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                {errors[field.name]}
              </Text>
            )}
          </div>
        );
    }
  };
  
  // Auth form content
  const authContent = (
    <div style={{ padding: asModal ? '2rem' : '0', minWidth: asModal ? '400px' : 'auto' }}>
      {logo && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src={logo} alt="Logo" style={{ height: '60px' }} />
        </div>
      )}
      
      <Heading as="h2" style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: primaryColor,
        textAlign: 'center'
      }}>
        {showOTP 
          ? 'Vérification'
          : mode === 'register' 
            ? (buttonText.register || 'Créer un compte')
            : (buttonText.login || 'Se connecter')
        }
      </Heading>
      
      {showOTP ? (
        // OTP Verification View
        <div>
          <Text style={{ 
            textAlign: 'center', 
            marginBottom: '1rem',
            color: 'var(--gray-600)'
          }}>
            Entrez le code à 6 chiffres envoyé à<br />
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
            <div style={{
              padding: '0.75rem',
              marginBottom: '1rem',
              borderRadius: '0.25rem',
              backgroundColor: message.includes('envoyé') ? '#10b981' : '#ef4444',
              color: 'white',
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}
          
          <Button
            variant="ghost"
            onClick={() => {
              setShowOTP(false);
              setOtpValue('');
              setMessage('');
            }}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            Retour
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
              label="Se souvenir de moi"
            />
          </div>
        )}
        
        {message && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            borderRadius: '0.25rem',
            backgroundColor: message.includes('envoyé') ? '#10b981' : '#ef4444',
            color: 'white'
          }}>
            {message}
          </div>
        )}
        
        <Button
          type="submit"
          variant="validate"
          color="primary"
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: primaryColor,
            borderColor: primaryColor
          }}
        >
          {loading ? 'Chargement...' : (buttonText.submit || (mode === 'register' ? "S'inscrire" : 'Se connecter'))}
        </Button>
          </form>
          
          {allowModeSwitch && (
            <div style={{
              marginTop: '1.5rem',
              textAlign: 'center',
              paddingTop: '1rem',
              borderTop: '1px solid var(--gray-200)'
            }}>
              <Text style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>
                {mode === 'register' ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
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
                    ? (buttonText.switchToLogin || 'Se connecter')
                    : (buttonText.switchToRegister || "S'inscrire")
                  }
                </Button>
              </Text>
            </div>
          )}
        </>
      )}
    </div>
  );
  
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
          <i className="fas fa-user" style={{ marginRight: '0.5rem' }}></i>
          {buttonText.login || "S'identifier"}
        </Button>
        
        {isOpen && (
          <Modal isOpen={isOpen} onClose={handleClose}>
            {authContent}
          </Modal>
        )}
      </>
    );
  }
  
  // If used as modal
  if (asModal) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        {authContent}
      </Modal>
    );
  }
  
  // Standalone form
  return authContent;
};

export default AuthModule;