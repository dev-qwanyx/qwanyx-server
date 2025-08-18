import React, { ReactNode } from 'react'
import { HolyGrailLayout, SuperNavbar, SuperSidebar, type SidebarItem } from '@qwanyx/ui'
import { useDashboard } from '../providers/DashboardProvider'
import { DashboardMenuItem } from '../types'

export interface DashboardLayoutProps {
  children: ReactNode
  className?: string
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, className }) => {
  const { config, expandedMenuItems, toggleMenuItem, loadModule, setCurrentModule } = useDashboard()

  const convertMenuItemsToSidebar = (items: DashboardMenuItem[]): SidebarItem[] => {
    return items.map(item => ({
      id: item.id,
      label: item.label,
      icon: typeof item.icon === 'string' ? item.icon : undefined,
      href: item.href,
      badge: item.badge,
      children: item.children ? convertMenuItemsToSidebar(item.children) : undefined,
      onClick: item.onClick || (item.module ? async () => {
        if (item.module) {
          await loadModule(item.module)
          setCurrentModule(item.module)
        }
      } : undefined)
    }))
  }

  const sidebarItems = convertMenuItemsToSidebar(config.menuItems)

  // Configure navbar props
  const navbarProps = {
    logo: config.logo,
    title: config.title || 'Dashboard',
    position: 'fixed' as const,
    transparent: false,
    blur: true,
    elevated: true,
    primaryAction: config.user ? {
      label: config.user.name,
      onClick: () => {},
      icon: 'person'
    } : undefined
  }

  // Configure sidebar props
  const sidebarProps = {
    items: sidebarItems,
    logo: config.logo,
    title: config.title,
    user: config.user ? {
      name: config.user.name,
      email: config.user.email,
      avatar: config.user.avatar,
      role: config.user.role
    } : undefined,
    onLogout: config.onLogout,
    theme: config.theme
  }

  return (
    <HolyGrailLayout
      navbar={navbarProps}
      sidebar={sidebarProps}
      className={className}
    >
      {children}
    </HolyGrailLayout>
  )
}