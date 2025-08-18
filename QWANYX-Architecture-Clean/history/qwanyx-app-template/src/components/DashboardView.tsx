'use client';

import { DashboardLayout, Icon } from '@qwanyx/ui';
import type { SidebarItem } from '@qwanyx/ui';

interface DashboardViewProps {
  user: any;
  onLogout: () => void;
  currentPath?: string;
  children: React.ReactNode;
}

export default function DashboardView({ user, onLogout, currentPath = '/dashboard', children }: DashboardViewProps) {
  const sidebarItems: SidebarItem[] = [
    {
      id: 'home',
      label: 'Retour au site',
      href: '/',
      icon: <Icon name="home" />
    },
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      href: '/dashboard',
      icon: <Icon name="dashboard" />
    },
    {
      id: 'requests',
      label: 'Demandes',
      href: '/dashboard/requests',
      icon: <Icon name="assignment" />,
      badge: 3
    },
    {
      id: 'users',
      label: 'Utilisateurs',
      href: '/dashboard/users',
      icon: <Icon name="people" />
    },
    {
      id: 'analytics',
      label: 'Analytiques',
      icon: <Icon name="analytics" />,
      children: [
        {
          id: 'analytics-overview',
          label: 'Vue d\'ensemble',
          href: '/dashboard/analytics'
        },
        {
          id: 'analytics-reports',
          label: 'Rapports',
          href: '/dashboard/analytics/reports'
        }
      ]
    },
    {
      id: 'settings',
      label: 'Paramètres',
      href: '/dashboard/settings',
      icon: <Icon name="settings" />
    }
  ];

  return (
    <DashboardLayout
      sidebarItems={sidebarItems}
      logo={
        <div className="qwanyx-flex qwanyx-items-center qwanyx-gap-2">
          <Icon name="dashboard" />
          <span className="qwanyx-font-semibold">QWANYX</span>
        </div>
      }
      user={{
        name: user?.name || user?.email || 'Utilisateur',
        email: user?.email,
        role: user?.role || 'Administrateur'
      }}
      onLogout={onLogout}
    >
      {children}
    </DashboardLayout>
  );
}