// Main Auth Module
export { AuthModule } from './AuthModule'
export type { AuthModuleProps, AuthField } from './AuthModule'

// Translations
export { translations, getTranslation } from './translations'
export type { Locale } from './translations'

// Auth Hook
export { useAuth } from './hooks/useAuth'
export type { AuthContextType } from './hooks/useAuth'

// Auth Provider
export { AuthProvider } from './providers/AuthProvider'
export type { AuthProviderProps } from './providers/AuthProvider'