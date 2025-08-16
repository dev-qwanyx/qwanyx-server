export type Locale = 'fr' | 'en';

export const translations = {
  fr: {
    // Titles
    login: 'Se connecter',
    register: 'Créer un compte',
    verification: 'Vérification',
    
    // Labels
    email: 'Email',
    firstName: 'Prénom',
    lastName: 'Nom',
    phone: 'Téléphone',
    company: 'Entreprise',
    rememberMe: 'Se souvenir de moi',
    
    // Placeholders
    emailPlaceholder: 'votre@email.com',
    
    // Buttons
    submit: 'Envoyer',
    submitLogin: 'Se connecter',
    submitRegister: "S'inscrire",
    back: 'Retour',
    
    // Switch buttons
    alreadyHaveAccount: 'Déjà un compte ?',
    noAccountYet: 'Pas encore de compte ?',
    switchToLogin: 'Se connecter',
    switchToRegister: "S'inscrire",
    
    // Messages
    loading: 'Chargement...',
    otpInstructions: 'Entrez le code à 6 chiffres envoyé à',
    codeSentMessage: 'Un code à 6 chiffres a été envoyé à votre email',
    codeInvalidMessage: 'Code invalide ou expiré',
    connectionError: 'Erreur de connexion au serveur',
    unexpectedError: 'Une erreur est survenue',
    userAlreadyExists: 'Un compte existe déjà avec cet email',
    codeSent: 'Code envoyé',
    registrationSuccessful: 'Inscription réussie',
    
    // Validation messages
    fieldRequired: 'est requis',
    invalidEmail: 'Email invalide',
    invalidPhone: 'Numéro de téléphone invalide',
    invalidLinkedin: 'URL LinkedIn invalide',
    invalidVat: 'Numéro de TVA invalide',
    invalidUrl: 'URL invalide',
    invalidField: 'invalide',
  },
  
  en: {
    // Titles
    login: 'Sign In',
    register: 'Create Account',
    verification: 'Verification',
    
    // Labels
    email: 'Email',
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Phone',
    company: 'Company',
    rememberMe: 'Remember me',
    
    // Placeholders
    emailPlaceholder: 'your@email.com',
    
    // Buttons
    submit: 'Submit',
    submitLogin: 'Sign In',
    submitRegister: 'Sign Up',
    back: 'Back',
    
    // Switch buttons
    alreadyHaveAccount: 'Already have an account?',
    noAccountYet: "Don't have an account yet?",
    switchToLogin: 'Sign In',
    switchToRegister: 'Sign Up',
    
    // Messages
    loading: 'Loading...',
    otpInstructions: 'Enter the 6-digit code sent to',
    codeSentMessage: 'A 6-digit code has been sent to your email',
    codeInvalidMessage: 'Invalid or expired code',
    connectionError: 'Server connection error',
    unexpectedError: 'An error occurred',
    userAlreadyExists: 'User already exists',
    codeSent: 'Code sent',
    registrationSuccessful: 'Registration successful',
    
    // Validation messages
    fieldRequired: 'is required',
    invalidEmail: 'Invalid email',
    invalidPhone: 'Invalid phone number',
    invalidLinkedin: 'Invalid LinkedIn URL',
    invalidVat: 'Invalid VAT number',
    invalidUrl: 'Invalid URL',
    invalidField: 'invalid',
  }
};

export const getTranslation = (locale: Locale = 'fr') => {
  return translations[locale] || translations.fr;
};