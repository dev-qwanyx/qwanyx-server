import React from 'react';
import AuthModule from '../generic/AuthModule';
import type { AuthField, AuthModuleProps } from '../generic/AuthModule';

// Autodin specific fields configuration
const autodinRegisterFields: AuthField[] = [
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
  },
  {
    name: 'phone',
    label: 'Téléphone',
    type: 'tel',
    required: true,
    validation: 'phone',
    autoComplete: 'tel'
  },
  {
    name: 'isProfessional',
    label: 'Je suis un professionnel',
    type: 'checkbox'
  },
  {
    name: 'proType',
    label: 'Type de professionnel',
    type: 'select',
    showIf: 'isProfessional',
    options: [
      { value: 'garagiste', label: 'Garagiste' },
      { value: 'fournisseur', label: 'Fournisseur de pièces' },
      { value: 'carrossier', label: 'Carrossier' },
      { value: 'autre', label: 'Autre' }
    ]
  },
  {
    name: 'companyName',
    label: "Nom de l'entreprise",
    type: 'text',
    showIf: 'isProfessional',
    required: false
  },
  {
    name: 'vatNumber',
    label: 'Numéro de TVA',
    type: 'text',
    showIf: 'isProfessional',
    validation: 'vat',
    helperText: 'Format: BE0123456789'
  }
];

const autodinLoginFields: AuthField[] = [
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

export interface AuthAutodinProps extends Omit<AuthModuleProps, 'fields' | 'loginFields' | 'registerFields' | 'logo' | 'primaryColor'> {
  // Allow override but with defaults
  logo?: string;
  primaryColor?: string;
}

const AuthAutodin: React.FC<AuthAutodinProps> = ({
  workspace = 'autodin-be',
  logo = '/assets/img/logo.png',
  primaryColor = 'var(--autodin-primary)',
  buttonText = {
    login: 'Se connecter',
    register: 'Créer un compte',
    submit: 'Continuer',
    switchToLogin: 'Se connecter',
    switchToRegister: "S'inscrire"
  },
  beforeSubmit,
  ...props
}) => {
  // Transform data for Autodin API format
  const handleBeforeSubmit = async (data: any, mode: 'login' | 'register') => {
    // Call parent beforeSubmit if provided
    let transformedData = beforeSubmit ? await beforeSubmit(data, mode) : data;
    
    // For Autodin, we need to structure the data properly for registration
    if (mode === 'register') {
      const { email, firstName, lastName, phone, isProfessional, proType, companyName, vatNumber, ...rest } = transformedData;
      
      return {
        email,
        workspace: transformedData.workspace,
        metadata: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          account_type: isProfessional ? 'professionnel' : 'particulier',
          pro_type: isProfessional ? proType : null,
          company_name: isProfessional ? companyName : null,
          vat_number: isProfessional ? vatNumber : null,
          ...rest
        }
      };
    }
    
    return transformedData;
  };
  
  return (
    <AuthModule
      workspace={workspace}
      loginFields={autodinLoginFields}
      registerFields={autodinRegisterFields}
      logo={logo}
      primaryColor={primaryColor}
      buttonText={buttonText}
      passwordless={true}
      beforeSubmit={handleBeforeSubmit}
      {...props}
    />
  );
};

export default AuthAutodin;