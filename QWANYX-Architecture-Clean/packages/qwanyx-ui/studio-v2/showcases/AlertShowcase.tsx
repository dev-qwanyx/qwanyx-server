import React from 'react';
import { 
  Alert,
  Heading, 
  Text,
  Card,
  Grid
} from '../../src';

export const AlertShowcase: React.FC = () => {
  return (
    <div>
      <Heading size="3xl" style={{ marginBottom: '0.5rem' }}>Alert</Heading>
      <Text size="lg" style={{ color: 'rgb(var(--text-muted))', marginBottom: '2rem' }}>
        Alert messages for user feedback and notifications
      </Text>

      <Card style={{ padding: '2rem' }}>
        <Heading size="lg" style={{ marginBottom: '1.5rem' }}>Alert Variants</Heading>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Alert variant="info">
            This is an informational alert — check it out!
          </Alert>
          
          <Alert variant="success">
            Success! Your changes have been saved.
          </Alert>
          
          <Alert variant="warning">
            Warning: Please review your input before continuing.
          </Alert>
          
          <Alert variant="error">
            Error: Something went wrong. Please try again.
          </Alert>
        </div>
      </Card>
    </div>
  );
};