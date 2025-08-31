import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Grid,
  Heading,
  Text,
  SimpleSelect,
  Switch,
  Input,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Container,
  Section,
  Code,
  Badge
} from '../../src';

interface PropControl {
  name: string;
  type: 'select' | 'boolean' | 'text' | 'number' | 'color';
  options?: string[];
  defaultValue?: any;
  description?: string;
  required?: boolean;
}

interface ComponentAPI {
  name: string;
  description: string;
  props: PropControl[];
  examples?: { name: string; config: Record<string, any> }[];
  interface: string; // The actual TypeScript interface
}

interface ComponentConfiguratorProps {
  component: React.ComponentType<any>;
  api: ComponentAPI;
}

export const ComponentConfigurator: React.FC<ComponentConfiguratorProps> = ({
  component: Component,
  api
}) => {
  // Initialize state with default values
  const initialConfig = api.props.reduce((acc, prop) => {
    acc[prop.name] = prop.defaultValue ?? 
      (prop.type === 'boolean' ? false : 
       prop.type === 'select' && prop.options ? prop.options[0] : 
       '');
    return acc;
  }, {} as Record<string, any>);

  const [config, setConfig] = useState(initialConfig);
  const [showCode, setShowCode] = useState(false);

  const updateProp = (name: string, value: any) => {
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const generateCode = () => {
    const props = Object.entries(config)
      .filter(([_, value]) => value !== '' && value !== false && value !== undefined)
      .map(([key, value]) => {
        if (typeof value === 'boolean' && value) return key;
        if (typeof value === 'string') return `${key}="${value}"`;
        return `${key}={${JSON.stringify(value)}}`;
      })
      .join(' ');
    
    return `<${api.name}${props ? ' ' + props : ''} />`;
  };

  const loadExample = (example: Record<string, any>) => {
    setConfig(example);
  };

  return (
    <Container style={{ padding: '0.5rem' }}>
      {/* Header + Examples on same line */}
      <Container style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
        <Heading size="xl">{api.name}</Heading>
        {api.examples && api.examples.length > 0 && (
          <Container style={{ display: 'flex', gap: '0.25rem', flex: 1 }}>
            {api.examples.map(example => (
              <Button
                key={example.name}
                variant="ghost"
                size="xs"
                onClick={() => loadExample(example.config)}
                style={{ padding: '0.25rem 0.5rem' }}
              >
                {example.name}
              </Button>
            ))}
          </Container>
        )}
      </Container>

      {/* Live Preview - Compact */}
      <Card style={{ marginBottom: '0.75rem' }}>
        <CardContent style={{ padding: '1.5rem' }}>
          <Container style={{
            minHeight: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgb(var(--surface))',
            borderRadius: 'var(--radius-sm)'
          }}>
            <Component {...config} />
          </Container>
        </CardContent>
      </Card>

      {/* Ultra Compact Configuration */}
      <Card style={{ marginBottom: '0.75rem' }}>
        <CardContent style={{ padding: '0.75rem' }}>
          <Grid cols={4} gap="sm">
            {api.props.map(prop => (
              <Container key={prop.name} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <Text size="xs" weight="medium">
                  {prop.name}{prop.required && '*'}
                </Text>
                
                {prop.type === 'select' && prop.options && (
                  <select
                    value={config[prop.name]}
                    onChange={(e) => updateProp(prop.name, e.target.value)}
                    style={{
                      padding: '0.25rem',
                      fontSize: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgb(var(--border))',
                      backgroundColor: 'rgb(var(--background))',
                      color: 'rgb(var(--text))'
                    }}
                  >
                    {prop.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
                
                {prop.type === 'boolean' && (
                  <Container style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={config[prop.name] || false}
                      onChange={(e) => updateProp(prop.name, e.target.checked)}
                      style={{ cursor: 'pointer' }}
                    />
                    <Text size="xs">{config[prop.name] ? 'Yes' : 'No'}</Text>
                  </Container>
                )}
                
                {prop.type === 'text' && (
                  <input
                    type="text"
                    value={config[prop.name] || ''}
                    onChange={(e) => updateProp(prop.name, e.target.value)}
                    placeholder={prop.name}
                    style={{
                      padding: '0.25rem',
                      fontSize: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgb(var(--border))',
                      backgroundColor: 'rgb(var(--background))',
                      color: 'rgb(var(--text))'
                    }}
                  />
                )}
                
                {prop.type === 'number' && (
                  <input
                    type="number"
                    value={config[prop.name] || 0}
                    onChange={(e) => updateProp(prop.name, parseInt(e.target.value) || 0)}
                    style={{
                      padding: '0.25rem',
                      fontSize: '12px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgb(var(--border))',
                      backgroundColor: 'rgb(var(--background))',
                      color: 'rgb(var(--text))'
                    }}
                  />
                )}
              </Container>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Code & TypeScript Interface - Compact */}
      <Grid cols={2} gap="sm">
        {/* Generated Code */}
        <Card>
          <CardContent style={{ padding: '0.75rem' }}>
            <Container style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <Text size="sm" weight="semibold">Generated Code</Text>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => navigator.clipboard.writeText(generateCode())}
                style={{ padding: '0.25rem 0.5rem' }}
              >
                Copy
              </Button>
            </Container>
            <Container style={{
              backgroundColor: 'rgb(var(--surface))',
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'monospace',
              fontSize: '12px'
            }}>
              <Code size="xs">{generateCode()}</Code>
            </Container>
          </CardContent>
        </Card>

        {/* Real TypeScript Interface */}
        <Card>
          <CardContent style={{ padding: '0.75rem' }}>
            <Text size="sm" weight="semibold" style={{ marginBottom: '0.5rem' }}>TypeScript Interface</Text>
            <Container style={{
              backgroundColor: 'rgb(var(--surface))',
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'monospace',
              fontSize: '11px',
              overflowX: 'auto',
              maxHeight: '200px'
            }}>
              <pre style={{ margin: 0, color: 'rgb(var(--text))' }}>{api.interface}</pre>
            </Container>
          </CardContent>
        </Card>
      </Grid>
    </Container>
  );
};