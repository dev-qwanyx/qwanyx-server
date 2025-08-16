import React, { useEffect, useState } from 'react'
import { DashboardProvider } from './providers/DashboardProvider'
import { DashboardLayout } from './layouts/DashboardLayout'
import { DashboardOverview } from './pages/DashboardOverview'
import { UsersPage } from './pages/UsersPage'
import { RequestsPage } from './pages/RequestsPage'
import { SettingsPage } from './pages/SettingsPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { DashboardConfig } from './types'

export interface DashboardRouterProps {
  config: DashboardConfig
  currentPath?: string
  onNavigate?: (path: string) => void
}

export const DashboardRouter: React.FC<DashboardRouterProps> = ({ 
  config, 
  currentPath = '/dashboard',
  onNavigate 
}) => {
  const [currentPage, setCurrentPage] = useState<string>('overview')

  useEffect(() => {
    // Parse current path to determine which page to show
    if (currentPath.includes('/users')) {
      setCurrentPage('users')
    } else if (currentPath.includes('/requests')) {
      setCurrentPage('requests')
    } else if (currentPath.includes('/settings')) {
      setCurrentPage('settings')
    } else if (currentPath.includes('/analytics')) {
      setCurrentPage('analytics')
    } else {
      setCurrentPage('overview')
    }
  }, [currentPath])

  const renderPage = () => {
    switch(currentPage) {
      case 'users':
        return <UsersPage />
      case 'requests':
        return <RequestsPage />
      case 'settings':
        return <SettingsPage />
      case 'analytics':
        return <AnalyticsPage />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <DashboardProvider config={config}>
      <DashboardLayout>
        {renderPage()}
      </DashboardLayout>
    </DashboardProvider>
  )
}