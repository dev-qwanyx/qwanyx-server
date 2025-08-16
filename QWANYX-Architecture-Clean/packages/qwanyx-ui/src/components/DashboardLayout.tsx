import React, { useState } from 'react';
import { Sidebar, SidebarItem } from './Sidebar';
import { Container } from './Container';
import { Button } from './Button';
import { Avatar } from './Avatar';
import { Icon } from './Icon';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  logo?: React.ReactNode;
  user?: {
    name: string;
    email?: string;
    avatar?: string;
    role?: string;
  };
  navbarActions?: React.ReactNode;
  onLogout?: () => void;
  className?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebarItems,
  logo,
  user,
  navbarActions,
  onLogout,
  className = ''
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={`qwanyx-dashboard-layout ${className}`}>
      <Sidebar
        items={sidebarItems}
        logo={logo}
        user={user}
        collapsed={sidebarCollapsed}
        onCollapse={setSidebarCollapsed}
        footer={
          onLogout && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="qwanyx-dashboard-layout__logout"
            >
              <Icon name="logout" />
              {!sidebarCollapsed && <span>Déconnexion</span>}
            </Button>
          )
        }
      />
      
      <div className="qwanyx-dashboard-layout__main">
        <header className="qwanyx-dashboard-layout__header">
          <div className="qwanyx-dashboard-layout__header-left">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="qwanyx-dashboard-layout__mobile-menu"
            >
              <Icon name="menu" />
            </Button>
          </div>
          
          <div className="qwanyx-dashboard-layout__header-right">
            {navbarActions || (
              <>
                <Button variant="ghost" size="sm">
                  <Icon name="bell" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Icon name="settings" />
                </Button>
                {user && (
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    size="sm"
                  />
                )}
              </>
            )}
          </div>
        </header>
        
        <main className="qwanyx-dashboard-layout__content">
          <Container className="qwanyx-dashboard-layout__container">
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
};

export interface SimpleDashboardLayoutProps {
  children: React.ReactNode;
  menuItems?: Array<{
    label: string;
    href?: string;
    icon?: React.ReactNode;
  }>;
  title?: string;
  user?: {
    name: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

export const SimpleDashboardLayout: React.FC<SimpleDashboardLayoutProps> = ({
  children,
  menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <Icon name="home" /> },
    { label: 'Utilisateurs', href: '/users', icon: <Icon name="users" /> },
    { label: 'Paramètres', href: '/settings', icon: <Icon name="settings" /> }
  ],
  title = 'Dashboard',
  user,
  onLogout
}) => {
  const sidebarItems: SidebarItem[] = menuItems.map((item, index) => ({
    id: `menu-${index}`,
    ...item
  }));

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      logo={<h2>{title}</h2>}
      user={user}
      onLogout={onLogout}
    >
      {children}
    </DashboardLayout>
  );
};