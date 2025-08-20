import React, { useState } from 'react';
import { Container, Heading, Text, Card, Tabs, TabsList, TabsTrigger, TabsContent } from '@qwanyx/ui';
import { QwanyxFlowStandalone, defaultNodes, defaultEdges } from '../../../qwanyx-canvas/src/index';

export default function CanvasShowcase() {
  const [workflow, setWorkflow] = useState<any>(null);

  const handleExport = (nodes: any, edges: any) => {
    const exported = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    setWorkflow(exported);
    console.log('Workflow exported:', exported);
  };

  return (
    <Container style={{ padding: '2rem' }}>
      <Heading size="3xl" style={{ marginBottom: '1rem' }}>
        QwanyxFlow - Visual Workflow Editor
      </Heading>
      
      <Text style={{ marginBottom: '2rem', color: 'var(--qwanyx-text-secondary)' }}>
        Éditeur visuel de workflows avec ReactFlow et composants QWANYX
      </Text>

      <Tabs defaultValue="demo" fullWidth>
        <TabsList fullWidth>
          <TabsTrigger value="demo">Démo Interactive</TabsTrigger>
          <TabsTrigger value="empty">Canvas Vide</TabsTrigger>
          <TabsTrigger value="readonly">Lecture Seule</TabsTrigger>
          <TabsTrigger value="export">Export JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="demo">
          <Card style={{ padding: '0', overflow: 'hidden', height: '600px' }}>
            <QwanyxFlowStandalone
              initialNodes={defaultNodes}
              initialEdges={defaultEdges}
              height="600px"
              showToolbar={true}
              onNodesChange={(nodes) => console.log('Nodes changed:', nodes)}
              onEdgesChange={(edges) => console.log('Edges changed:', edges)}
            />
          </Card>
        </TabsContent>

        <TabsContent value="empty">
          <Card style={{ padding: '0', overflow: 'hidden', height: '600px' }}>
            <QwanyxFlowStandalone
              initialNodes={[]}
              initialEdges={[]}
              height="600px"
              showToolbar={true}
            />
          </Card>
        </TabsContent>

        <TabsContent value="readonly">
          <Card style={{ padding: '0', overflow: 'hidden', height: '600px' }}>
            <QwanyxFlowStandalone
              initialNodes={defaultNodes}
              initialEdges={defaultEdges}
              height="600px"
              showToolbar={false}
              readOnly={true}
            />
          </Card>
        </TabsContent>

        <TabsContent value="export">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', height: '600px' }}>
            <Card style={{ padding: '0', overflow: 'hidden' }}>
              <QwanyxFlowStandalone
                initialNodes={defaultNodes}
                initialEdges={defaultEdges}
                height="100%"
                showToolbar={true}
                onExport={() => handleExport(defaultNodes, defaultEdges)}
              />
            </Card>
            
            <Card style={{ padding: '1rem', overflow: 'auto' }}>
              <Heading size="lg" style={{ marginBottom: '1rem' }}>
                Workflow Export
              </Heading>
              {workflow ? (
                <pre style={{
                  backgroundColor: '#f3f4f6',
                  padding: '1rem',
                  borderRadius: '4px',
                  fontSize: '12px',
                  overflow: 'auto',
                }}>
                  {JSON.stringify(workflow, null, 2)}
                </pre>
              ) : (
                <Text style={{ color: 'var(--qwanyx-text-secondary)' }}>
                  Cliquez sur "Export" dans la toolbar pour voir le JSON
                </Text>
              )}
            </Card>
          </div>
        </TabsContent>
      </Tabs>

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