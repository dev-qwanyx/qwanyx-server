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
    
    // Mail Config (SMTP & IMAP)
    this.register({
      type: 'mail-config',
      category: NodeCategory.INTEGRATION,
      name: 'Mail Config',
      description: 'Configure SMTP and IMAP email settings',
      icon: 'MailOutline',
      color: 'error',  // Will show red gradient
      factory: (data) => ({
        id: data.id,
        type: 'icon',  // Use icon node type for rendering
        position: data.position,
        data: {
          ...data.data,
          nodeType: 'mail-config',  // This triggers Mail Config form in expanded view
          label: 'Mail Config',
          icon: 'MailOutline',
          color: 'error'
        },
        execute: async () => ({ success: true }),
        validate: () => ({ valid: true }),
        getInputSchema: () => undefined,
        getOutputSchema: () => undefined,
        getConfigSchema: () => undefined
      }),
      defaultData: {
        nodeType: 'mail-config',
        label: 'Mail Config', 
        icon: 'MailOutline',
        color: 'error',
        mailConfig: {
          smtp: {
            email: '',
            server: 'mail.qwanyx.com',
            port: 587,
            password: '',
            secure: true
          },
          imap: {
            email: '',
            server: 'mail.qwanyx.com',
            port: 993,
            password: '',
            secure: true
          }
        }
      }
    })
    
    // Mail Listener - Simple trigger node
    this.register({
      type: 'mail-listener',
      category: NodeCategory.TRIGGER,
      name: 'Mail Listener',
      description: 'Triggers when email arrives',
      icon: 'Mail',
      color: 'primary',
      factory: (data) => ({
        id: data.id,
        type: 'icon',
        position: data.position,
        data: {
          ...data.data,
          nodeType: 'mail-listener',
          label: 'Mail Listener',
          icon: 'Mail',
          color: 'primary'
        },
        execute: async () => ({ success: true }),
        validate: () => ({ valid: true }),
        getInputSchema: () => undefined,
        getOutputSchema: () => undefined,
        getConfigSchema: () => undefined
      }),
      defaultData: {
        nodeType: 'mail-listener',
        label: 'Mail Listener',
        icon: 'Mail',
        color: 'primary'
      }
    })
    
    // Note Node - For adding notes and comments to flows
    this.register({
      type: 'note',
      category: NodeCategory.DATA,
      name: 'Note',
      description: 'Add notes and comments to your flow',
      icon: 'Edit',
      color: 'warning',
      factory: (data) => ({
        id: data.id,
        type: 'icon',
        position: data.position,
        data: {
          ...data.data,
          nodeType: 'note',
          label: data.data?.title || 'Note',
          icon: 'Edit',
          color: 'warning'
        },
        execute: async () => ({ success: true }),
        validate: () => ({ valid: true }),
        getInputSchema: () => undefined,
        getOutputSchema: () => undefined,
        getConfigSchema: () => undefined
      }),
      defaultData: {
        nodeType: 'note',
        title: 'Note',
        brief: '',  // This is the actual note content
        label: 'Note',
        icon: 'Edit',
        color: 'warning'
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
    
    // DH Monitor Node
    this.register({
      type: 'monitor',
      category: NodeCategory.DATA,
      name: 'DH Monitor',
      description: 'Monitor Digital Human brain activity in real-time',
      icon: 'Biotech',
      color: '#8B5CF6',
      factory: (data) => ({
        id: data.id,
        type: 'monitor',
        position: data.position,
        data: {
          ...data.data,
          nodeType: 'monitor',
          label: 'DH Monitor',
          icon: 'Biotech',
          color: '#8B5CF6'
        },
        execute: async () => ({ success: true }),
        validate: () => ({ valid: true }),
        getInputSchema: () => undefined,
        getOutputSchema: () => undefined,
        getConfigSchema: () => undefined
      }),
      defaultData: {
        nodeType: 'monitor',
        label: 'DH Monitor',
        icon: 'Biotech',
        color: '#8B5CF6',
        title: 'DH Monitor',
        brainId: 'stephen-qwanyx-com'
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