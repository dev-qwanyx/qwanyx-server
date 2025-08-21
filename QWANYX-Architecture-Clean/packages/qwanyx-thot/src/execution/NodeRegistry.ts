// Node Registry - manages all available node types
import { NodeDefinition, NodeCategory, INode } from './types'
import { EmailTriggerNode } from './nodes/EmailTriggerNode'
import { AnalyzeNode } from './nodes/AnalyzeNode'
import { ResponseNode } from './nodes/ResponseNode'
import { HTTPTriggerNode } from './nodes/HTTPTriggerNode'
import { StatusNode } from './nodes/StatusNode'
import { HTTPResponseNode } from './nodes/HTTPResponseNode'
import { StartStopNode } from './nodes/StartStopNode'

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
      icon: 'Email',
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
      icon: 'Analytics',
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
      icon: 'Send',
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
    
    // SMTP Config
    this.register({
      type: 'smtp-config',
      category: NodeCategory.INTEGRATION,
      name: 'SMTP Config',
      description: 'Configure SMTP email sending',
      icon: 'MailOutline',
      color: '#FFA500',
      factory: (data) => ({
        id: data.id,
        type: 'smtp-config',
        position: data.position,
        data: data.data,
        execute: async () => ({ success: true }),
        validate: () => ({ valid: true })
      }),
      defaultData: {
        host: '',
        port: 587,
        secure: false,
        user: '',
        password: ''
      }
    })
    
    // Start/Stop Control
    this.register({
      type: 'start-stop',
      category: NodeCategory.CONTROL,
      name: 'Start/Stop',
      description: 'Control DH running state with avatar display',
      icon: 'PowerSettingsNew',
      color: '#2ECC71',
      factory: (data) => new StartStopNode({
        id: data.id,
        type: 'start-stop',
        position: data.position,
        data: data.data
      }),
      defaultData: {
        avatar: '/avatars/default.png',
        name: 'DH Assistant',
        showSwitch: true
      }
    })
    
    // HTTP Trigger
    this.register({
      type: 'http-trigger',
      category: NodeCategory.TRIGGER,
      name: 'HTTP Trigger',
      description: 'Starts flow on HTTP request',
      icon: 'Bolt',
      color: '#9B59B6',
      factory: (data) => new HTTPTriggerNode({
        id: data.id,
        type: 'http-trigger',
        position: data.position,
        data: data.data
      }),
      defaultData: {
        path: '/trigger',
        method: 'POST'
      }
    })
    
    // Status Node
    this.register({
      type: 'status',
      category: NodeCategory.DATA,
      name: 'DH Status',
      description: 'Get Digital Human status info',
      icon: 'Info',
      color: '#3498DB',
      factory: (data) => new StatusNode({
        id: data.id,
        type: 'status',
        position: data.position,
        data: data.data
      }),
      defaultData: {
        includeMemory: true,
        includeTriggers: true
      }
    })
    
    // HTTP Response
    this.register({
      type: 'http-response',
      category: NodeCategory.ACTION,
      name: 'HTTP Response',
      description: 'Send HTTP response',
      icon: 'Send',
      color: '#E74C3C',
      factory: (data) => new HTTPResponseNode({
        id: data.id,
        type: 'http-response',
        position: data.position,
        data: data.data
      }),
      defaultData: {
        statusCode: 200,
        contentType: 'application/json'
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