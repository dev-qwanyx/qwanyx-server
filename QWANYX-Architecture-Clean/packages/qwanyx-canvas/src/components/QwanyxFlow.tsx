import React, { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
  ReactFlowProvider,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Card, Button, Flex, Icon, Text } from '@qwanyx/ui';
import { QwanyxStepNode } from './nodes/QwanyxStepNode';
import { QwanyxDecisionNode } from './nodes/QwanyxDecisionNode';
import { QwanyxActorNode } from './nodes/QwanyxActorNode';
import { QwanyxIconNode } from './nodes/QwanyxIconNode';
import { SmartEdge } from './edges/SmartEdge';
import { HiddenEdge } from './edges/HiddenEdge';
import { QwanyxToolbar } from './QwanyxToolbar';
import { CustomEdgeRenderer } from './CustomEdgeRenderer';

// Define custom node types
const nodeTypes = {
  step: QwanyxStepNode,
  decision: QwanyxDecisionNode,
  actor: QwanyxActorNode,
  icon: QwanyxIconNode,
};

// Define custom edge types
const edgeTypes = {
  smart: SmartEdge,
  hidden: HiddenEdge,
};

export interface QwanyxFlowProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onNodesChange?: (nodes: Node[]) => void;
  onEdgesChange?: (edges: Edge[]) => void;
  onExport?: () => void;
  height?: string | number;
  showToolbar?: boolean;
  readOnly?: boolean;
  showControls?: boolean;
  useCustomEdges?: boolean;
}

export const QwanyxFlow: React.FC<QwanyxFlowProps> = ({
  initialNodes = [],
  initialEdges = [],
  onNodesChange: onNodesChangeCallback,
  onEdgesChange: onEdgesChangeCallback,
  onExport,
  height = '600px',
  showToolbar = true,
  readOnly = false,
  showControls = true,
  useCustomEdges = false,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nextNodeId, setNextNodeId] = useState(initialNodes.length + 1);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Handle new connections
  const onConnect = useCallback(
    (params: Connection) => {
      if (!readOnly) {
        setEdges((eds) => addEdge(params, eds));
      }
    },
    [readOnly, setEdges]
  );

  // Add new node
  const addNode = useCallback((type: 'step' | 'decision' | 'actor') => {
    const newNode: Node = {
      id: `node-${nextNodeId}`,
      type,
      position: { x: 250, y: nodes.length * 150 },
      data: {
        label: type === 'step' ? 'Nouvelle étape' :
               type === 'decision' ? 'Condition?' :
               'Nouvel acteur',
        ...(type === 'actor' && { 
          actor: 'Agent',
          role: 'Support'
        })
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    setNextNodeId(nextNodeId + 1);
  }, [nodes, nextNodeId, setNodes]);

  // Export workflow as JSON
  const handleExport = useCallback(() => {
    const workflow = {
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        label: node.data.label,
        position: node.position,
        data: node.data,
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
      })),
    };
    
    console.log('Exported workflow:', workflow);
    onExport?.();
    return workflow;
  }, [nodes, edges, onExport]);

  // Handle drag over
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Handle drop
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance || !reactFlowWrapper.current) return;

      const type = event.dataTransfer.getData('application/reactflow');
      
      // Check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `node-${nextNodeId}`,
        type,
        position,
        data: {
          label: type === 'step' ? 'Nouvelle étape' :
                 type === 'decision' ? 'Condition?' :
                 'Nouvel acteur',
          ...(type === 'actor' && { 
            actor: 'Agent',
            role: 'Support'
          })
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setNextNodeId(nextNodeId + 1);
    },
    [reactFlowInstance, nextNodeId, setNodes]
  );

  // Notify parent of changes
  React.useEffect(() => {
    onNodesChangeCallback?.(nodes);
  }, [nodes, onNodesChangeCallback]);

  React.useEffect(() => {
    onEdgesChangeCallback?.(edges);
  }, [edges, onEdgesChangeCallback]);

  return (
    <div 
      ref={reactFlowWrapper} 
      style={{ width: '100%', height, position: 'relative' }}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      {showToolbar && !readOnly && (
        <QwanyxToolbar 
          onAddNode={addNode}
          onExport={handleExport}
        />
      )}
      
      <ReactFlow
        nodes={nodes}
        edges={useCustomEdges ? edges.map(e => ({ ...e, type: 'hidden' })) : edges}
        onNodesChange={!readOnly ? onNodesChange : undefined}
        onEdgesChange={!readOnly ? onEdgesChange : undefined}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: useCustomEdges ? 'hidden' : 'smart' }}
        elementsSelectable={!readOnly}
        nodesConnectable={!useCustomEdges}
        edgesUpdatable={!useCustomEdges}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={12} 
          size={1}
          color="#e5e7eb"
        />
        {showControls && <Controls />}
        {useCustomEdges && <CustomEdgeRenderer />}
      </ReactFlow>
    </div>
  );
};

// Export with provider wrapper for standalone usage
export const QwanyxFlowStandalone: React.FC<QwanyxFlowProps> = (props) => (
  <ReactFlowProvider>
    <QwanyxFlow {...props} />
  </ReactFlowProvider>
);