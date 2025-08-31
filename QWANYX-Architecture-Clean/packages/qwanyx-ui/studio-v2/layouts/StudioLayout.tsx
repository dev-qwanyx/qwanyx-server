import React, { useState } from 'react';
import { Input, Icon, Text, Button } from '../../src';
import { ComponentRegistry } from '../componentRegistry';

interface StudioLayoutProps {
  registry: ComponentRegistry;
  selectedComponent: string;
  onSelectComponent: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  children: React.ReactNode;
}

export const StudioLayout: React.FC<StudioLayoutProps> = ({
  registry,
  selectedComponent,
  onSelectComponent,
  searchQuery,
  onSearchChange,
  children
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(Object.keys(registry))
  );

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Auto-expand categories with search results
  React.useEffect(() => {
    if (searchQuery) {
      setExpandedCategories(new Set(Object.keys(registry)));
    }
  }, [searchQuery, registry]);

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: 'rgb(var(--background))'
    }}>
      {/* Sidebar */}
      <aside style={{
        width: '280px',
        backgroundColor: 'rgb(var(--surface))',
        borderRight: '1px solid rgb(var(--border))',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgb(var(--border))'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <Icon name="dashboard" size="lg" style={{ marginRight: '0.5rem' }} />
            <Text size="xl" weight="bold">QWANYX UI Studio</Text>
          </div>
          
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Icon 
              name="search" 
              size="sm" 
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgb(var(--text-muted))'
              }}
            />
            <Input
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              size="sm"
              style={{
                paddingLeft: '40px',
                width: '100%'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgb(var(--text-muted))'
                }}
              >
                <Icon name="close" size="xs" />
              </button>
            )}
          </div>
        </div>

        {/* Menu */}
        <nav style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.5rem'
        }}>
          {Object.entries(registry).map(([category, items]) => (
            <div key={category} style={{ marginBottom: '0.25rem' }}>
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 'var(--radius)',
                  transition: 'background-color 0.2s',
                  color: 'rgb(var(--text))'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgb(var(--border) / 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Icon 
                  name={expandedCategories.has(category) ? 'expand_more' : 'chevron_right'}
                  size="sm"
                  style={{ marginRight: '0.5rem' }}
                />
                <Text size="sm" weight="semibold">{category}</Text>
                <span style={{
                  marginLeft: 'auto',
                  fontSize: '12px',
                  color: 'rgb(var(--text-muted))',
                  backgroundColor: 'rgb(var(--border) / 0.5)',
                  padding: '2px 6px',
                  borderRadius: '12px'
                }}>
                  {items.length}
                </span>
              </button>

              {/* Category Items */}
              {expandedCategories.has(category) && (
                <div style={{ marginLeft: '1.5rem', marginTop: '0.25rem' }}>
                  {items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => onSelectComponent(item.id)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: '0.5rem 0.75rem',
                        marginBottom: '0.125rem',
                        backgroundColor: selectedComponent === item.id
                          ? 'rgb(var(--primary) / 0.1)'
                          : 'transparent',
                        border: selectedComponent === item.id
                          ? '1px solid rgb(var(--primary) / 0.3)'
                          : '1px solid transparent',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        color: 'rgb(var(--text))'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedComponent !== item.id) {
                          e.currentTarget.style.backgroundColor = 'rgb(var(--border) / 0.2)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedComponent !== item.id) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <Text 
                        size="sm" 
                        weight={selectedComponent === item.id ? 'semibold' : 'normal'}
                        style={{
                          color: selectedComponent === item.id 
                            ? 'rgb(var(--primary))' 
                            : 'rgb(var(--text))'
                        }}
                      >
                        {item.name}
                      </Text>
                      {item.description && (
                        <Text 
                          size="xs" 
                          style={{ 
                            color: 'rgb(var(--text-muted))',
                            marginTop: '2px'
                          }}
                        >
                          {item.description}
                        </Text>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '1rem',
          borderTop: '1px solid rgb(var(--border))',
          display: 'flex',
          gap: '0.5rem'
        }}>
          <Button variant="ghost" size="sm" fullWidth>
            <Icon name="settings" size="xs" style={{ marginRight: '0.5rem' }} />
            Settings
          </Button>
          <Button variant="ghost" size="sm" fullWidth>
            <Icon name="palette" size="xs" style={{ marginRight: '0.5rem' }} />
            Theme
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        overflow: 'auto',
        padding: '2rem'
      }}>
        {children}
      </main>
    </div>
  );
};