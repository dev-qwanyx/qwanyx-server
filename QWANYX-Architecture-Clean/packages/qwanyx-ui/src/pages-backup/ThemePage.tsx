/**
 * 🎨 QWANYX Theme System - Test & Documentation Page
 * 
 * This page displays all CSS variables and design tokens
 * Used to verify theme consistency and test variable changes
 */

import React from 'react';

export const ThemePage = () => {
  // Color tokens
  const colors = [
    { name: 'primary', var: '--primary', desc: 'Main brand color' },
    { name: 'secondary', var: '--secondary', desc: 'Secondary brand color' },
    { name: 'accent', var: '--accent', desc: 'Accent for highlights' },
    { name: 'success', var: '--success', desc: 'Success states' },
    { name: 'warning', var: '--warning', desc: 'Warning states' },
    { name: 'error', var: '--error', desc: 'Error states' },
    { name: 'info', var: '--info', desc: 'Info states' },
  ];

  const surfaces = [
    { name: 'background', var: '--background', desc: 'Page background' },
    { name: 'foreground', var: '--foreground', desc: 'Content on background' },
    { name: 'card', var: '--card', desc: 'Card background' },
    { name: 'card-foreground', var: '--card-foreground', desc: 'Content on cards' },
    { name: 'border', var: '--border', desc: 'Border color' },
    { name: 'input', var: '--input', desc: 'Input background' },
    { name: 'ring', var: '--ring', desc: 'Focus ring color' },
  ];

  const textColors = [
    { name: 'text-primary', var: '--text-primary', desc: 'Primary text' },
    { name: 'text-secondary', var: '--text-secondary', desc: 'Secondary text' },
    { name: 'text-muted', var: '--text-muted', desc: 'Muted text' },
  ];

  const spacing = [
    { name: 'xs', var: '--spacing-xs', value: '0.25rem' },
    { name: 'sm', var: '--spacing-sm', value: '0.5rem' },
    { name: 'md', var: '--spacing-md', value: '1rem' },
    { name: 'lg', var: '--spacing-lg', value: '1.5rem' },
    { name: 'xl', var: '--spacing-xl', value: '2rem' },
    { name: '2xl', var: '--spacing-2xl', value: '3rem' },
    { name: '3xl', var: '--spacing-3xl', value: '4rem' },
  ];

  const radius = [
    { name: 'sm', var: '--radius-sm', value: '0.125rem' },
    { name: 'md', var: '--radius-md', value: '0.375rem' },
    { name: 'lg', var: '--radius-lg', value: '0.5rem' },
    { name: 'xl', var: '--radius-xl', value: '0.75rem' },
    { name: '2xl', var: '--radius-2xl', value: '1rem' },
    { name: 'full', var: '--radius-full', value: '9999px' },
  ];

  const ColorBox = ({ name, cssVar, desc }: { name: string; cssVar: string; desc: string }) => (
    <div style={{ marginBottom: '1rem' }}>
      <div 
        style={{
          width: '100%',
          height: '60px',
          backgroundColor: `rgb(var(${cssVar}))`,
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgb(var(--border))',
          marginBottom: '0.5rem'
        }}
      />
      <div style={{ fontSize: '0.875rem' }}>
        <strong>{name}</strong>
        <br />
        <code style={{ fontSize: '0.75rem', opacity: 0.7 }}>{cssVar}</code>
        <br />
        <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{desc}</span>
      </div>
    </div>
  );

  const SpacingBox = ({ name, cssVar, value }: { name: string; cssVar: string; value: string }) => (
    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div 
        style={{
          width: `calc(${value} * 4)`,
          height: value,
          backgroundColor: 'rgb(var(--primary))',
          borderRadius: 'var(--radius-sm)',
        }}
      />
      <div style={{ fontSize: '0.875rem' }}>
        <strong>{name}</strong> - {value}
        <br />
        <code style={{ fontSize: '0.75rem', opacity: 0.7 }}>{cssVar}</code>
      </div>
    </div>
  );

  const RadiusBox = ({ name, cssVar, value }: { name: string; cssVar: string; value: string }) => (
    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div 
        style={{
          width: '60px',
          height: '60px',
          backgroundColor: 'rgb(var(--primary))',
          borderRadius: `var(${cssVar})`,
        }}
      />
      <div style={{ fontSize: '0.875rem' }}>
        <strong>{name}</strong> - {value}
        <br />
        <code style={{ fontSize: '0.75rem', opacity: 0.7 }}>{cssVar}</code>
      </div>
    </div>
  );

  return (
    <div style={{ 
      padding: '2rem',
      backgroundColor: 'rgb(var(--background))',
      color: 'rgb(var(--foreground))',
      minHeight: '100vh'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>🎨 QWANYX Theme System</h1>
      
      {/* Colors Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Colors</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          {colors.map(color => (
            <ColorBox key={color.name} name={color.name} cssVar={color.var} desc={color.desc} />
          ))}
        </div>
      </section>

      {/* Surfaces Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Surfaces</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          {surfaces.map(surface => (
            <ColorBox key={surface.name} name={surface.name} cssVar={surface.var} desc={surface.desc} />
          ))}
        </div>
      </section>

      {/* Text Colors Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Text Colors</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          {textColors.map(text => (
            <ColorBox key={text.name} name={text.name} cssVar={text.var} desc={text.desc} />
          ))}
        </div>
      </section>

      {/* Spacing Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Spacing</h2>
        <div>
          {spacing.map(space => (
            <SpacingBox key={space.name} name={space.name} cssVar={space.var} value={space.value} />
          ))}
        </div>
      </section>

      {/* Border Radius Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Border Radius</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          {radius.map(rad => (
            <RadiusBox key={rad.name} name={rad.name} cssVar={rad.var} value={rad.value} />
          ))}
        </div>
      </section>

      {/* Test Components Section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Test Components</h2>
        
        {/* Card Example */}
        <div style={{
          backgroundColor: 'rgb(var(--card))',
          color: 'rgb(var(--card-foreground))',
          border: '1px solid rgb(var(--border))',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-md)'
        }}>
          <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Card Component</h3>
          <p style={{ color: 'rgb(var(--text-secondary))' }}>
            This is a card using theme variables. It should adapt to light/dark themes.
          </p>
        </div>

        {/* Button Examples */}
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
          <button style={{
            backgroundColor: 'rgb(var(--primary))',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            cursor: 'pointer'
          }}>
            Primary Button
          </button>
          
          <button style={{
            backgroundColor: 'transparent',
            color: 'rgb(var(--primary))',
            border: '2px solid rgb(var(--primary))',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            cursor: 'pointer'
          }}>
            Outline Button
          </button>
        </div>
      </section>
    </div>
  );
};