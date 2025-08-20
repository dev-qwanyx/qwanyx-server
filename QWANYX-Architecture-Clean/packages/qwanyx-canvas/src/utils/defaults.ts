import { Node, Edge } from 'reactflow';

/**
 * Default nodes for demo/testing
 */
export const defaultNodes: Node[] = [
  {
    id: '1',
    type: 'actor',
    position: { x: 100, y: 50 },
    data: {
      actor: 'DH Support',
      role: 'Première ligne',
      type: 'DH',
      email: 'support@autodin.com',
    },
  },
  {
    id: '2',
    type: 'step',
    position: { x: 100, y: 180 },
    data: {
      label: 'Recevoir email client',
      description: 'Email entrant dans la boîte',
    },
  },
  {
    id: '3',
    type: 'decision',
    position: { x: 100, y: 300 },
    data: {
      label: 'Urgent?',
    },
  },
  {
    id: '4',
    type: 'step',
    position: { x: 300, y: 300 },
    data: {
      label: 'Traiter immédiatement',
      description: 'Réponse prioritaire',
    },
  },
  {
    id: '5',
    type: 'step',
    position: { x: 100, y: 450 },
    data: {
      label: 'Mettre en file d\'attente',
      description: 'Traitement normal',
    },
  },
  {
    id: '6',
    type: 'actor',
    position: { x: 400, y: 180 },
    data: {
      actor: 'Agent Humain',
      role: 'Escalade complexe',
      type: 'human',
      email: 'agent@autodin.com',
    },
  },
];

/**
 * Default edges for demo/testing
 */
export const defaultEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    type: 'smoothstep',
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    sourceHandle: 'yes',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#27ae60' },
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    sourceHandle: 'no',
    type: 'smoothstep',
    style: { stroke: '#e74c3c' },
  },
  {
    id: 'e4-6',
    source: '4',
    target: '6',
    type: 'smoothstep',
    label: 'Si complexe',
    labelStyle: { fontSize: '10px' },
  },
];

/**
 * Template workflows
 */
export const workflowTemplates = {
  support: {
    name: 'Support Client',
    nodes: defaultNodes,
    edges: defaultEdges,
  },
  sales: {
    name: 'Process Commercial',
    nodes: [
      {
        id: '1',
        type: 'step',
        position: { x: 100, y: 100 },
        data: { label: 'Lead entrant' },
      },
      {
        id: '2',
        type: 'decision',
        position: { x: 100, y: 200 },
        data: { label: 'Qualifié?' },
      },
      {
        id: '3',
        type: 'step',
        position: { x: 250, y: 200 },
        data: { label: 'Envoyer devis' },
      },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3', sourceHandle: 'yes' },
    ],
  },
};