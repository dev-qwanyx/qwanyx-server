import React, { useState, ReactNode } from 'react'
import { Navbar, NavbarProps } from './Navbar'
import { SuperSidebar, SuperSidebarProps } from './SuperSidebar'

export interface DashboardLayoutProps {
  navbar?: NavbarProps | false
  sidebar?: SuperSidebarProps | false
  rightSidebar?: SuperSidebarProps | false
  children: ReactNode
  contentPadding?: boolean
  contentMaxWidth?: number | string | false
  className?: string
  style?: React.CSSProperties
}

const HolyGrailLayoutDashboard: React.FC<DashboardLayoutProps> = ({
  navbar,
  sidebar,
  rightSidebar,
  children,
  contentPadding = true, // kept for compatibility
  contentMaxWidth = false,
  className = '',
  style
}) => {
  // Use contentPadding to avoid unused variable warning
  void contentPadding
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false)

  // Calculate content margins based on sidebar states
  const sidebarWidth = sidebar === false ? 0 : 
    sidebarCollapsed ? (sidebar?.collapsedWidth || 80) : (sidebar?.width || 280)
  
  const rightSidebarWidth = rightSidebar === false ? 0 :
    rightSidebarCollapsed ? (rightSidebar?.collapsedWidth || 80) : (rightSidebar?.width || 280)

  const navbarHeight = navbar === false ? 0 : 80

  const layoutStyles: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: 'rgb(var(--qwanyx-background))',
    ...style
  }

  const mainStyles: React.CSSProperties = {
    marginTop: 0,
    marginLeft: sidebar !== false ? `${typeof sidebarWidth === 'number' ? sidebarWidth + 'px' : sidebarWidth}` : 0,
    marginRight: rightSidebar !== false ? `${typeof rightSidebarWidth === 'number' ? rightSidebarWidth + 'px' : rightSidebarWidth}` : 0,
    minHeight: '100vh',
    transition: 'margin 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column' as const
  }

  const contentStyles: React.CSSProperties = {
    flex: 1,
    width: '100%',
    padding: '30px 30px 0 30px',
    maxWidth: contentMaxWidth !== false ? 
      (typeof contentMaxWidth === 'number' ? `${contentMaxWidth}px` : contentMaxWidth) : 
      undefined,
    margin: contentMaxWidth !== false ? '0 auto' : undefined
  }

  return (
    <div className={className} style={layoutStyles}>
      {/* Top Navigation Bar */}
      {navbar !== false && (
        <Navbar
          {...navbar}
          position="fixed"
          style={{
            zIndex: 50,
            ...navbar?.style
          }}
        />
      )}

      {/* Left Sidebar */}
      {sidebar !== false && (
        <SuperSidebar
          {...sidebar}
          items={sidebar?.items || []}
          position="left"
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
          style={{
            top: 0,
            height: '100vh',
            zIndex: 40,
            ...sidebar?.style
          }}
        />
      )}

      {/* Right Sidebar */}
      {rightSidebar !== false && (
        <SuperSidebar
          {...rightSidebar}
          items={rightSidebar?.items || []}
          position="right"
          collapsed={rightSidebarCollapsed}
          onCollapse={setRightSidebarCollapsed}
          style={{
            top: navbar !== false ? `${navbarHeight}px` : 0,
            height: navbar !== false ? `calc(100vh - ${navbarHeight}px)` : '100vh',
            zIndex: 40,
            ...rightSidebar?.style
          }}
        />
      )}

      {/* Main Content Area */}
      <main style={mainStyles}>
        <div style={contentStyles}>
          {children}
        </div>
      </main>
    </div>
  )
}

// Preset configurations for common layouts
export const DashboardLayout: React.FC<DashboardLayoutProps> = (props) => {
  return (
    <HolyGrailLayoutDashboard
      contentPadding={true}
      contentMaxWidth={false}
      {...props}
    />
  )
}

export const ContentLayout: React.FC<DashboardLayoutProps> = (props) => {
  return (
    <HolyGrailLayoutDashboard
      contentPadding={true}
      contentMaxWidth={1200}
      {...props}
    />
  )
}

export const FullWidthLayout: React.FC<DashboardLayoutProps> = (props) => {
  return (
    <HolyGrailLayoutDashboard
      contentPadding={false}
      contentMaxWidth={false}
      {...props}
    />
  )
}