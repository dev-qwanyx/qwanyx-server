import React from 'react';
import { Container, Heading, Text, Card, Alert } from '../../src';

export default function CanvasShowcase() {
  return (
    <Container style={{ padding: '2rem' }}>
      <Heading size="3xl" style={{ marginBottom: '1rem' }}>
        QwanyxFlow - Visual Workflow Editor
      </Heading>
      
      <Text style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        Canvas component is currently being refactored
      </Text>

      <Alert variant="warning">
        The Canvas showcase is temporarily disabled while we refactor the QwanyxFlow component.
        Please check back later or explore other components in the studio.
      </Alert>

      <Card style={{ padding: '2rem', marginTop: '2rem' }}>
        <Heading size="lg" style={{ marginBottom: '1rem' }}>
          Coming Soon
        </Heading>
        <Text>
          The visual workflow editor with drag-and-drop nodes, custom styling, and AI-ready export formats
          will be available once the refactoring is complete.
        </Text>
      </Card>

      <div style={{ marginTop: '2rem' }}>
        <Heading size="xl" style={{ marginBottom: '1rem' }}>
          Fonctionnalités
        </Heading>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <Card style={{ padding: '1rem' }}>
            <Heading size="md">🎯 Nodes Custom</Heading>
            <Text size="sm" style={{ marginTop: '0.5rem' }}>
              • Step Node (étapes)<br/>
              • Decision Node (conditions)<br/>
              • Actor Node (assignation)
            </Text>
          </Card>
          
          <Card style={{ padding: '1rem' }}>
            <Heading size="md">🎨 Style QWANYX</Heading>
            <Text size="sm" style={{ marginTop: '0.5rem' }}>
              • Utilise @qwanyx/ui<br/>
              • Thème cohérent<br/>
              • Animations fluides
            </Text>
          </Card>
          
          <Card style={{ padding: '1rem' }}>
            <Heading size="md">🤖 IA Ready</Heading>
            <Text size="sm" style={{ marginTop: '0.5rem' }}>
              • Export JSON structuré<br/>
              • Format pour exécution IA<br/>
              • Templates prédéfinis
            </Text>
          </Card>
        </div>
      </div>
    </Container>
  );
}