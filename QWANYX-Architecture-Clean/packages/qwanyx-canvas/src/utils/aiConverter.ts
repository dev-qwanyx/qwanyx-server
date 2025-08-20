import { Node, Edge } from 'reactflow';

export interface AIWorkflowStep {
  id: string;
  type: 'step' | 'decision' | 'actor';
  action: string;
  actor?: string;
  role?: string;
  conditions?: {
    yes?: string;
    no?: string;
  };
  next?: string[];
}

export interface AIWorkflow {
  name: string;
  description?: string;
  actors: Array<{
    id: string;
    name: string;
    type: 'DH' | 'human';
    role: string;
  }>;
  steps: AIWorkflowStep[];
  flow: Array<{
    from: string;
    to: string;
    condition?: string;
  }>;
}

/**
 * Convert ReactFlow nodes and edges to AI-readable format
 */
export function convertToAIFormat(
  nodes: Node[],
  edges: Edge[],
  workflowName: string = 'Process'
): AIWorkflow {
  // Extract actors from actor nodes
  const actors = nodes
    .filter(node => node.type === 'actor')
    .map(node => ({
      id: node.id,
      name: node.data.actor || 'Agent',
      type: (node.data.type || 'human') as 'DH' | 'human',
      role: node.data.role || 'Support',
    }));

  // Convert nodes to steps
  const steps: AIWorkflowStep[] = nodes.map(node => {
    const step: AIWorkflowStep = {
      id: node.id,
      type: (node.type || 'step') as 'step' | 'decision' | 'actor',
      action: node.data.label || '',
    };

    // Add actor info if available
    if (node.data.actor) {
      step.actor = node.data.actor;
      step.role = node.data.role;
    }

    // Add decision conditions
    if (node.type === 'decision') {
      const yesEdge = edges.find(e => e.source === node.id && e.sourceHandle === 'yes');
      const noEdge = edges.find(e => e.source === node.id && e.sourceHandle === 'no');
      
      step.conditions = {
        yes: yesEdge?.target,
        no: noEdge?.target,
      };
    }

    // Add next steps
    const nextSteps = edges
      .filter(e => e.source === node.id)
      .map(e => e.target);
    
    if (nextSteps.length > 0) {
      step.next = nextSteps;
    }

    return step;
  });

  // Convert edges to flow
  const flow = edges.map(edge => ({
    from: edge.source,
    to: edge.target,
    condition: edge.sourceHandle || undefined,
  }));

  return {
    name: workflowName,
    description: `Workflow with ${nodes.length} steps and ${actors.length} actors`,
    actors,
    steps,
    flow,
  };
}

/**
 * Generate a prompt for AI execution based on workflow
 */
export function generateAIPrompt(workflow: AIWorkflow): string {
  let prompt = `Execute the following workflow: "${workflow.name}"\n\n`;
  
  prompt += `Actors involved:\n`;
  workflow.actors.forEach(actor => {
    prompt += `- ${actor.name} (${actor.type === 'DH' ? 'Digital Human' : 'Human'}): ${actor.role}\n`;
  });
  
  prompt += `\nProcess steps:\n`;
  workflow.steps.forEach((step, index) => {
    prompt += `${index + 1}. ${step.action}`;
    if (step.actor) {
      prompt += ` (by ${step.actor})`;
    }
    if (step.conditions) {
      prompt += `\n   - If YES: go to step ${step.conditions.yes}`;
      prompt += `\n   - If NO: go to step ${step.conditions.no}`;
    }
    prompt += '\n';
  });
  
  return prompt;
}