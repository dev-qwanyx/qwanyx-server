import React, { ReactNode } from 'react'
import { DashboardLayout as UILayout, SidebarItem } from '@qwanyx/ui'
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
      icon: item.icon,
      href: item.href,
      badge: item.badge,
      children: item.children ? convertMenuItemsToSidebar(item.children) : undefined,
      onClick: item.onClick || (item.module ? async () => {
        await loadModule(item.module)
        setCurrentModule(item.module)
      } : undefined)
    }))
  }

  const sidebarItems = convertMenuItemsToSidebar(config.menuItems)

  return (
    <UILayout
      sidebarItems={sidebarItems}
      logo={config.logo}
      user={config.user}
      onLogout={config.onLogout}
      className={className}
    >
      {children}
    </UILayout>
  )
}