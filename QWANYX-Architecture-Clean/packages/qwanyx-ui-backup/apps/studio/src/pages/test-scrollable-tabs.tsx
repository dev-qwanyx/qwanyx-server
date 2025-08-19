import React from 'react';
import { SimpleTabs, Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../src/components/Tabs';

export default function TestScrollableTabsPage() {
  return (
    <div style={{ padding: '40px', backgroundColor: 'rgb(var(--background))' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px' }}>
        Scrollable Tabs Test
      </h1>

      {/* Test with many tabs to trigger overflow */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Many Tabs (Should Scroll)
        </h2>
        <SimpleTabs
          tabs={[
            { id: 'dashboard', label: 'Dashboard', content: <div>Dashboard content</div> },
            { id: 'users', label: 'User Management', content: <div>Users content</div> },
            { id: 'products', label: 'Products & Inventory', content: <div>Products content</div> },
            { id: 'orders', label: 'Orders & Shipping', content: <div>Orders content</div> },
            { id: 'analytics', label: 'Analytics Reports', content: <div>Analytics content</div> },
            { id: 'settings', label: 'System Settings', content: <div>Settings content</div> },
            { id: 'notifications', label: 'Notifications Center', content: <div>Notifications content</div> },
            { id: 'support', label: 'Customer Support', content: <div>Support content</div> },
            { id: 'billing', label: 'Billing & Payments', content: <div>Billing content</div> },
            { id: 'security', label: 'Security & Privacy', content: <div>Security content</div> },
          ]}
          variant="line"
        />
      </div>

      {/* Test with boxed variant */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Boxed Tabs with Overflow
        </h2>
        <SimpleTabs
          tabs={[
            { id: 'profile', label: 'Profile Information', content: <div>Profile content</div> },
            { id: 'account', label: 'Account Settings', content: <div>Account content</div> },
            { id: 'preferences', label: 'User Preferences', content: <div>Preferences content</div> },
            { id: 'privacy', label: 'Privacy Options', content: <div>Privacy content</div> },
            { id: 'notifications2', label: 'Email Notifications', content: <div>Email content</div> },
            { id: 'api', label: 'API Keys', content: <div>API content</div> },
            { id: 'sessions', label: 'Active Sessions', content: <div>Sessions content</div> },
            { id: 'logs', label: 'Activity Logs', content: <div>Logs content</div> },
          ]}
          variant="boxed"
          backgroundColor="rgb(var(--surface))"
        />
      </div>

      {/* Test with pills variant */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Pills Tabs with Overflow
        </h2>
        <SimpleTabs
          tabs={[
            { id: 'all', label: 'All Items', content: <div>All items</div> },
            { id: 'active', label: 'Active', content: <div>Active items</div> },
            { id: 'pending', label: 'Pending Review', content: <div>Pending items</div> },
            { id: 'approved', label: 'Approved', content: <div>Approved items</div> },
            { id: 'rejected', label: 'Rejected', content: <div>Rejected items</div> },
            { id: 'archived', label: 'Archived Items', content: <div>Archived items</div> },
            { id: 'deleted', label: 'Deleted', content: <div>Deleted items</div> },
          ]}
          variant="pills"
        />
      </div>

      {/* Test narrow container to force scroll even with few tabs */}
      <div style={{ marginBottom: '40px', maxWidth: '400px', border: '1px solid rgb(var(--border))', padding: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Narrow Container (400px max)
        </h2>
        <SimpleTabs
          tabs={[
            { id: 'tab1', label: 'First Tab with Long Name', content: <div>Content 1</div> },
            { id: 'tab2', label: 'Second Tab Also Long', content: <div>Content 2</div> },
            { id: 'tab3', label: 'Third Tab Name', content: <div>Content 3</div> },
            { id: 'tab4', label: 'Fourth Tab', content: <div>Content 4</div> },
          ]}
          variant="line"
        />
      </div>

      {/* Test mobile view */}
      <div style={{ marginBottom: '40px', maxWidth: '320px', border: '1px solid rgb(var(--border))', padding: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Mobile View (320px)
        </h2>
        <SimpleTabs
          tabs={[
            { id: 'home', label: 'Home', content: <div>Home content</div> },
            { id: 'search', label: 'Search', content: <div>Search content</div> },
            { id: 'favorites', label: 'Favorites', content: <div>Favorites content</div> },
            { id: 'profile2', label: 'Profile', content: <div>Profile content</div> },
            { id: 'settings2', label: 'Settings', content: <div>Settings content</div> },
          ]}
          variant="segment"
        />
      </div>
    </div>
  );
}