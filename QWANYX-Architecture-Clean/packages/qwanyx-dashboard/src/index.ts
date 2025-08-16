// Main exports for @qwanyx/dashboard package

// Dashboard Layout Components
export { DashboardLayout } from './layouts/DashboardLayout'
export type { DashboardLayoutProps } from './layouts/DashboardLayout'

// Dashboard Pages
export { DashboardOverview } from './pages/DashboardOverview'
export { UsersPage } from './pages/UsersPage'
export { RequestsPage } from './pages/RequestsPage'
export { SettingsPage } from './pages/SettingsPage'
export { AnalyticsPage } from './pages/AnalyticsPage'

// Dashboard Provider for routing and module loading
export { DashboardProvider, useDashboard } from './providers/DashboardProvider'
export type { DashboardProviderProps, DashboardModule } from './providers/DashboardProvider'

// Dashboard Router - Main component
export { DashboardRouter } from './DashboardRouter'
export type { DashboardRouterProps } from './DashboardRouter'

// Types
export type { DashboardPageProps, DashboardMenuItem } from './types'