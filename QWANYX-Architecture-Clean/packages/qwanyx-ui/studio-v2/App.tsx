import React, { useState, useMemo } from 'react';
import { ThemeProvider } from '../src/providers/ThemeProvider';
import { WorkspaceProvider } from '../src/providers/WorkspaceProvider';
import { StudioLayout } from './layouts/StudioLayout';
import { componentRegistry } from './componentRegistry';
import { ComponentShowcase } from './components/ComponentShowcase';

export default function App() {
  const [selectedComponent, setSelectedComponent] = useState<string>('button');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter components based on search
  const filteredRegistry = useMemo(() => {
    if (!searchQuery) return componentRegistry;
    
    const query = searchQuery.toLowerCase();
    const filtered: typeof componentRegistry = {};
    
    Object.entries(componentRegistry).forEach(([category, items]) => {
      const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
      );
      
      if (filteredItems.length > 0) {
        filtered[category] = filteredItems;
      }
    });
    
    return filtered;
  }, [searchQuery]);

  return (
    <ThemeProvider>
      <WorkspaceProvider workspace="studio">
        <StudioLayout
          registry={filteredRegistry}
          selectedComponent={selectedComponent}
          onSelectComponent={setSelectedComponent}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        >
          <ComponentShowcase componentId={selectedComponent} />
        </StudioLayout>
      </WorkspaceProvider>
    </ThemeProvider>
  );
}