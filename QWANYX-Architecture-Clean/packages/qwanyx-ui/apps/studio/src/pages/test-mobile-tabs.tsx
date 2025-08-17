import React, { useState } from 'react';
import { SimpleTabs } from '../../../../src/components/Tabs';
import { Switch } from '../../../../src/components/Switch';

export default function TestMobileTabsPage() {
  const [mobileMode, setMobileMode] = useState<'tabs' | 'dropdown' | 'auto'>('auto');
  const [breakpoint, setBreakpoint] = useState(640);

  const tabs = [
    { id: 'overview', label: 'Overview', content: <div style={{ padding: '20px' }}>Overview content - Track key metrics and performance indicators</div> },
    { id: 'analytics', label: 'Analytics', content: <div style={{ padding: '20px' }}>Analytics content - Deep dive into your data</div> },
    { id: 'reports', label: 'Reports', content: <div style={{ padding: '20px' }}>Reports content - Generate and export detailed reports</div> },
    { id: 'settings', label: 'Settings', content: <div style={{ padding: '20px' }}>Settings content - Configure your preferences</div> },
    { id: 'notifications', label: 'Notifications', content: <div style={{ padding: '20px' }}>Notifications content - Manage alerts and messages</div> },
  ];

  return (
    <div style={{ padding: '40px', backgroundColor: 'rgb(var(--background))', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '32px' }}>
        Mobile-Ready Tabs Test
      </h1>

      {/* Controls */}
      <div style={{ 
        marginBottom: '40px', 
        padding: '20px', 
        backgroundColor: 'rgb(var(--surface))', 
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow)'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Controls
        </h2>
        
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Mobile Mode Selector */}
          <div>
            <label style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>Mobile Mode:</label>
            <select 
              value={mobileMode} 
              onChange={(e) => setMobileMode(e.target.value as any)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius)',
                border: '1px solid rgb(var(--border))',
                backgroundColor: 'rgb(var(--background))',
                cursor: 'pointer'
              }}
            >
              <option value="auto">Auto (responsive)</option>
              <option value="dropdown">Always Dropdown</option>
              <option value="tabs">Always Tabs</option>
            </select>
          </div>

          {/* Breakpoint Selector */}
          <div>
            <label style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>
              Breakpoint: {breakpoint}px
            </label>
            <input 
              type="range" 
              min="320" 
              max="1024" 
              value={breakpoint}
              onChange={(e) => setBreakpoint(Number(e.target.value))}
              style={{ width: '200px' }}
            />
          </div>

          {/* Current Window Width */}
          <div>
            <label style={{ fontSize: '14px', color: 'rgb(var(--text-secondary))' }}>
              Window Width: {typeof window !== 'undefined' ? window.innerWidth : 0}px
            </label>
          </div>
        </div>
      </div>

      {/* Full Width Demo */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Full Width (Responsive)
        </h2>
        <SimpleTabs
          tabs={tabs}
          variant="line"
          mobileMode={mobileMode}
          mobileBreakpoint={breakpoint}
          fullWidth
        />
      </div>

      {/* Narrow Container - Simulates Mobile */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Narrow Container (360px - Mobile Size)
        </h2>
        <div style={{ 
          maxWidth: '360px', 
          border: '2px dashed rgb(var(--border))', 
          padding: '20px',
          borderRadius: 'var(--radius-lg)'
        }}>
          <SimpleTabs
            tabs={tabs}
            variant="boxed"
            backgroundColor="rgb(var(--surface))"
            mobileMode="dropdown" // Force dropdown in this narrow container
          />
        </div>
      </div>

      {/* Medium Container */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Medium Container (640px - Tablet Size)
        </h2>
        <div style={{ 
          maxWidth: '640px', 
          border: '2px dashed rgb(var(--border))', 
          padding: '20px',
          borderRadius: 'var(--radius-lg)'
        }}>
          <SimpleTabs
            tabs={tabs}
            variant="pills"
            mobileMode={mobileMode}
            mobileBreakpoint={breakpoint}
          />
        </div>
      </div>

      {/* Different Variants with Mobile Mode */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          All Variants with Forced Dropdown Mode
        </h2>
        
        <div style={{ display: 'grid', gap: '32px' }}>
          {['line', 'boxed', 'pills', 'segment', 'nav'].map((variant) => (
            <div key={variant}>
              <h3 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '12px', textTransform: 'capitalize' }}>
                {variant} Variant
              </h3>
              <SimpleTabs
                tabs={tabs.slice(0, 3)} // Fewer tabs for cleaner demo
                variant={variant as any}
                mobileMode="dropdown"
                backgroundColor={variant === 'boxed' ? 'rgb(var(--surface))' : undefined}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div style={{ 
        marginTop: '40px',
        padding: '20px',
        backgroundColor: 'rgb(var(--info-bg, 219 234 254))',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgb(var(--info-border, 147 197 253))'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: 'rgb(var(--info-text, 29 78 216))' }}>
          📱 Testing Mobile Mode
        </h3>
        <ul style={{ listStyle: 'disc', paddingLeft: '24px', fontSize: '14px', lineHeight: '1.6' }}>
          <li>Resize your browser window to see the auto mode switch between tabs and dropdown</li>
          <li>Use the controls above to test different mobile modes and breakpoints</li>
          <li>The dropdown mode is perfect for mobile devices where horizontal space is limited</li>
          <li>The dropdown maintains all tab functionality including disabled states</li>
          <li>Content switching is instant with smooth transitions</li>
        </ul>
      </div>
    </div>
  );
}