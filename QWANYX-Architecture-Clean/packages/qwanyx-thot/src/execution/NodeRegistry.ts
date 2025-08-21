// Node Registry - manages all available node types
import { NodeDefinition, NodeCategory, INode } from './types'
import { EmailTriggerNode } from './nodes/EmailTriggerNode'
import { AnalyzeNode } from './nodes/AnalyzeNode'
import { ResponseNode } from './nodes/ResponseNode'

export class NodeRegistry {
  private static instance: NodeRegistry
  private definitions: Map<string, NodeDefinition> = new Map()
  
  private constructor() {
    this.registerDefaultNodes()
  }
  
  static getInstance(): NodeRegistry {
    if (!NodeRegistry.instance) {
      NodeRegistry.instance = new NodeRegistry()
    }
    return NodeRegistry.instance
  }
  
  private registerDefaultNodes() {
    // Email Trigger
    this.register({
      type: EmailTriggerNode.nodeType,
      category: NodeCategory.TRIGGER,
      name: 'Email Trigger',
      description: 'Listens for incoming emails and starts a flow',
      icon: '📧',
      color: '#FF6B6B',
      factory: (data) => new EmailTriggerNode({
        id: data.id,
        type: EmailTriggerNode.nodeType,
        position: data.position,
        data: data.data
      }),
      defaultData: {
        checkInterval: 60,
        folder: 'INBOX',
        markAsRead: false,
        filters: {
          unreadOnly: true
        }
      }
    })
    
    // Analyze
    this.register({
      type: AnalyzeNode.nodeType,
      category: NodeCategory.AI,
      name: 'Analyze',
      description: 'Analyzes content for sentiment, intent, and entities',
      icon: '🔍',
      color: '#4ECDC4',
      factory: (data) => new AnalyzeNode({
        id: data.id,
        type: AnalyzeNode.nodeType,
        position: data.position,
        data: data.data
      }),
      defaultData: {
        analysisType: 'all',
        useAI: true
      }
    })
    
    // Response
    this.register({
      type: ResponseNode.nodeType,
      category: NodeCategory.ACTION,
      name: 'Response',
      description: 'Generates and sends responses',
      icon: '💬',
      color: '#95E77E',
      factory: (data) => new ResponseNode({
        id: data.id,
        type: ResponseNode.nodeType,
        position: data.position,
        data: data.data
      }),
      defaultData: {
        responseType: 'email',
        useAI: true,
        tone: 'professional'
      }
    })
  }
  
  register(definition: NodeDefinition) {
    this.definitions.set(definition.type, definition)
  }
  
  unregister(type: string) {
    this.definitions.delete(type)
  }
  
  get(type: string): NodeDefinition | undefined {
    return this.definitions.get(type)
  }
  
  getAll(): NodeDefinition[] {
    return Array.from(this.definitions.values())
  }
  
  getByCategory(category: NodeCategory): NodeDefinition[] {
    return this.getAll().filter(def => def.category === category)
  }
  
  createNode(type: string, data: any): INode {
    const definition = this.get(type)
    if (!definition) {
      throw new Error(`Unknown node type: ${type}`)
    }
    
    return definition.factory({
      ...data,
      data: { ...definition.defaultData, ...data.data }
    })
  }
  
  // Get organized menu structure for UI
  getMenuStructure() {
    const structure: Record<string, NodeDefinition[]> = {}
    
    // Group by category
    for (const category of Object.values(NodeCategory)) {
      structure[category] = this.getByCategory(category as NodeCategory)
    }
    
    return structure
  }
}