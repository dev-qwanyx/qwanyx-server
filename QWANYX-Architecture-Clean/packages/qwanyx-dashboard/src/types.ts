import { ReactNode } from 'react'

export interface DashboardMenuItem {
  id: string
  label: string
  icon?: ReactNode
  href?: string
  onClick?: () => void
  badge?: string | number
  children?: DashboardMenuItem[]
  requiredPermission?: string
  module?: string // External module to load
}

export interface DashboardPageProps {
  title?: string
  description?: string
  children?: ReactNode
}

export interface DashboardUser {
  id: string
  name: string
  email?: string
  avatar?: string
  role?: string
  permissions?: string[]
}

export interface DashboardConfig {
  title?: string
  logo?: ReactNode
  user?: DashboardUser
  menuItems: DashboardMenuItem[]
  modules?: Record<string, () => Promise<any>> // Dynamic module loading
  onLogout?: () => void
  theme?: 'light' | 'dark' | 'auto'
}