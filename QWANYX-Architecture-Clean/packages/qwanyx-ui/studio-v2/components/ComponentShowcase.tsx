import React from 'react';
import { Heading, Text, Card, Tabs, TabsList, TabsTrigger, TabsContent } from '../../src';

// Import all showcases
import { ButtonShowcase } from '../showcases/ButtonShowcase';
import { InputShowcase } from '../showcases/InputShowcase';
import { TextareaShowcase } from '../showcases/TextareaShowcase';
import { CardShowcase } from '../showcases/CardShowcase';
import { AlertShowcase } from '../showcases/AlertShowcase';
// Add more imports as we create them

interface ComponentShowcaseProps {
  componentId: string;
}

export const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({ componentId }) => {
  // Map component IDs to their showcase components
  const showcaseMap: Record<string, React.ComponentType> = {
    'button': ButtonShowcase,
    'input': InputShowcase,
    'textarea': TextareaShowcase,
    'card': CardShowcase,
    'alert': AlertShowcase,
    // Add more mappings as we create showcases
  };

  const ShowcaseComponent = showcaseMap[componentId];

  if (!ShowcaseComponent) {
    return (
      <div>
        <Card style={{ padding: '2rem', textAlign: 'center' }}>
          <Heading size="lg" style={{ marginBottom: '1rem' }}>
            Component showcase coming soon
          </Heading>
          <Text style={{ color: 'rgb(var(--text-muted))' }}>
            The showcase for "{componentId}" is not yet implemented.
          </Text>
        </Card>
      </div>
    );
  }

  return <ShowcaseComponent />;
};