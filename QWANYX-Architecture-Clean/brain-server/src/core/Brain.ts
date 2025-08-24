/**
 * Digital Human Brain
 * 
 * This is a living, thinking entity that:
 * - Is a shape-shifting graph computer
 * - Loads different flows to become different things
 * - Thinks continuously
 * - Can modify itself while thinking
 */

import { EventEmitter } from 'events'
import { Logger } from '../utils/Logger'
import { FlowManager } from '../memory/FlowManager'
import { BrainState, BrainConfig, Node, Edge } from '../types'
import { SimpleMailService } from '../services/mail/SimpleMailService'
import * as fs from 'fs'
import * as path from 'path'
const MemoryFormationService = require('../memory/MemoryFormationService')
const EmailResponseService = require('../services/mail/EmailResponseService')

export class Brain extends EventEmitter {
  // Identity
  public readonly id: string
  public readonly type: string
  public readonly config: BrainConfig
  
  // State
  private state: BrainState = 'initializing'
  private alive: boolean = false
  
  // Current thought (Working Memory)
  private currentFlowId: string | null = null
  private currentFlowTitle: string = 'root'
  private nodes: Node[] = []
  private edges: Edge[] = []
  
  // Navigation
  private flowStack: Array<{ id: string; title: string }> = []
  
  // Memory management
  private memory: FlowManager
  private logger: Logger
  
  // Thinking loop
  private thinkingInterval?: NodeJS.Timeout
  private lastThought: Date = new Date()
  
  // Metrics
  private thoughtCount: number = 0
  private errorCount: number = 0
  
  // Services
  public mailService?: SimpleMailService
  private memoryFormation?: any  // MemoryFormationService instance
  private emailResponse?: any    // EmailResponseService instance
  
  // Personality traits (loaded from personality flow)
  private personality: {
    name?: string
    tone?: string
    style?: string
    traits?: string[]
  } = {}
  
  constructor(id: string, type: string, config: BrainConfig) {
    super()
    this.id = id
    this.type = type
    this.config = config
    this.logger = Logger.getInstance()
    this.memory = new FlowManager(id, config.workspace || 'default')
    
    // Initialize memory formation service
    // Use brain ID as collection name (e.g., phil-qwanyx-com)
    this.memoryFormation = new MemoryFormationService('autodin', id)
    
    // Initialize email response service
    this.emailResponse = new EmailResponseService(this.memoryFormation)
    
    this.logger.info(`Brain ${id} created (type: ${type})`)
    
    // Initialize mail service if config exists
    this.initializeMailService()
  }
  
  /**
   * Initialize mail service from config file
   */
  private initializeMailService(): void {
    try {
      const configPath = path.join(__dirname, '..', 'mail-config.json')
      if (fs.existsSync(configPath)) {
        const mailConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        this.mailService = new SimpleMailService(this.id, mailConfig)
        this.logger.info(`Mail service initialized for brain ${this.id}`)
        
        // Forward mail events to brain events
        this.mailService.on('mail:received', (data: any) => {
          this.emit('mail:received', data)
          // Form memory from email
          this.formEmailMemory(data)
        })
        this.mailService.on('email:processed', (data: any) => {
          this.emit('email:processed', data)
        })
        this.mailService.on('contact:created', (data: any) => {
          this.emit('contact:created', data)
        })
      }
    } catch (error) {
      this.logger.error('Failed to initialize mail service', error)
    }
  }
  
  /**
   * Start the brain - it begins thinking
   */
  async start(): Promise<void> {
    try {
      this.state = 'starting'
      this.emit('state-change', this.state)
      
      // Initialize memory connection
      await this.memory.initialize()
      
      // Load root flow (the brain's base configuration)
      await this.loadRootFlow()
      
      // Start the thinking loop - DISABLED for performance
      this.alive = true
      // this.startThinking() // Disabled - was thinking 10x per second!
      
      // Start mail service if configured
      if (this.mailService) {
        this.logger.info(`📧 Starting mail service for ${this.id}`)
        await this.mailService.connect()
        
        // Check for emails every 30 seconds
        setInterval(async () => {
          if (this.mailService && this.alive) {
            this.logger.info(`📬 Checking for new emails...`)
            await this.mailService.checkEmails()
          }
        }, 30000) // 30 seconds
        
        // Also check immediately
        await this.mailService.checkEmails()
      }
      
      this.state = 'active'
      this.emit('state-change', this.state)
      this.logger.info(`Brain ${this.id} is now thinking`)
      
    } catch (error) {
      this.state = 'error'
      this.errorCount++
      this.emit('error', error)
      throw error
    }
  }
  
  /**
   * Stop the brain - it stops thinking
   */
  async stop(): Promise<void> {
    this.logger.info(`Stopping brain ${this.id}`)
    this.alive = false
    
    if (this.thinkingInterval) {
      clearInterval(this.thinkingInterval)
    }
    
    // Save current state before stopping
    if (this.currentFlowId) {
      await this.saveCurrentFlow()
    }
    
    this.state = 'stopped'
    this.emit('state-change', this.state)
  }
  
  /**
   * The brain becomes a different thing by loading a flow
   */
  async becomeFlow(flowId: string): Promise<void> {
    this.logger.debug(`Brain ${this.id} becoming flow ${flowId}`)
    
    // Save current flow if exists
    if (this.currentFlowId) {
      await this.saveCurrentFlow()
    }
    
    // Load new flow into working memory
    const flow = await this.memory.loadFlow(flowId)
    
    if (flow) {
      this.currentFlowId = flowId
      this.currentFlowTitle = flow.title || flowId
      this.nodes = flow.nodes || []
      this.edges = flow.edges || []
      
      // Check if this is a personality flow
      if (flowId === 'personality' || flow.title === 'personality') {
        this.logger.info(`🧠 PERSONALITY FLOW DETECTED! Brain ${this.id} loading personality...`)
        
        // Extract personality traits from nodes
        if (this.nodes.length > 0) {
          this.logger.info(`🎭 Personality has ${this.nodes.length} traits`)
          
          // Extract personality data from nodes
          this.personality = {}
          this.nodes.forEach(node => {
            if (node.data) {
              // Look for specific personality attributes
              if (node.data.name) this.personality.name = node.data.name
              if (node.data.tone) this.personality.tone = node.data.tone
              if (node.data.style) this.personality.style = node.data.style
              if (node.data.trait) {
                if (!this.personality.traits) this.personality.traits = []
                this.personality.traits.push(node.data.trait)
              }
            }
          })
          
          this.logger.info(`🎭 Personality loaded: ${JSON.stringify(this.personality)}`)
          
          // Emit special personality event
          this.emit('personality-loaded', {
            brainId: this.id,
            personality: this.personality,
            traits: this.nodes.map(n => ({
              id: n.id,
              type: n.type,
              data: n.data
            })),
            timestamp: new Date()
          })
          
          // Send to connected clients
          this.emit('flow-changed', {
            flowId,
            title: '🎭 PERSONALITY ACTIVE',
            nodeCount: this.nodes.length,
            edgeCount: this.edges.length,
            isPersonality: true,
            personality: this.personality
          })
        }
      } else {
        // Normal flow change
        this.emit('flow-changed', {
          flowId,
          title: this.currentFlowTitle,
          nodeCount: this.nodes.length,
          edgeCount: this.edges.length
        })
      }
      
      this.logger.info(`Brain ${this.id} is now thinking as ${this.currentFlowTitle}`)
    } else {
      // Create new flow if doesn't exist
      await this.createFlow(flowId)
    }
  }
  
  /**
   * Navigate to a sub-flow
   */
  async navigateToFlow(flowId: string, _title?: string): Promise<void> {
    // Push current to stack
    if (this.currentFlowId) {
      this.flowStack.push({
        id: this.currentFlowId,
        title: this.currentFlowTitle
      })
    }
    
    // Become the new flow
    await this.becomeFlow(flowId)
    
    // Update navigation
    this.emit('navigation', {
      current: flowId,
      stack: this.flowStack
    })
  }
  
  /**
   * Navigate back in the flow stack
   */
  async navigateBack(): Promise<void> {
    if (this.flowStack.length === 0) {
      return
    }
    
    const previous = this.flowStack.pop()
    if (previous) {
      await this.becomeFlow(previous.id)
    }
  }
  
  /**
   * Navigate to root flow
   */
  async navigateToRoot(): Promise<void> {
    this.flowStack = []
    await this.becomeFlow(this.id) // Root flow has same ID as brain
  }
  
  /**
   * The thinking loop - the brain's consciousness
   * DISABLED: Too resource intensive for current needs
   */
  private startThinking(): void {
    // DISABLED - We don't need continuous thinking for email & flows
    // Was thinking every 100ms (10 thoughts per second) - too much!
    /*
    this.thinkingInterval = setInterval(() => {
      this.think()
    }, 100)
    */
  }
  
  /**
   * A single thought cycle
   */
  private async think(): Promise<void> {
    try {
      this.thoughtCount++
      this.lastThought = new Date()
      
      // Process current flow nodes if any
      if (this.nodes.length > 0) {
        // In future: parallel processing on GPU
        // For now: sequential processing
        for (const node of this.nodes) {
          if (this.shouldExecuteNode(node)) {
            await this.executeNode(node)
          }
        }
      }
      
      // Emit thought for monitoring
      if (this.thoughtCount % 10 === 0) { // Every 10 thoughts
        const thoughtData = {
          count: this.thoughtCount,
          flowId: this.currentFlowId,
          timestamp: this.lastThought
        }
        this.logger.debug(`Emitting thought event: ${this.thoughtCount}`)
        this.emit('thought', thoughtData)
      }
      
    } catch (error) {
      this.errorCount++
      this.logger.error(`Brain ${this.id} thought error`, error)
      this.emit('thought-error', error)
    }
  }
  
  /**
   * Execute a single node
   */
  private async executeNode(_node: Node): Promise<void> {
    // This is where node-specific logic would go
    // For now, just track execution
    this.emit('node-executed', {
      nodeId: _node.id,
      type: _node.type,
      timestamp: new Date()
    })
  }
  
  /**
   * Determine if a node should execute
   */
  private shouldExecuteNode(_node: Node): boolean {
    // Future: Complex execution logic based on node type, triggers, etc.
    // For now: always execute
    return true
  }
  
  /**
   * Save current flow to memory
   */
  private async saveCurrentFlow(): Promise<void> {
    if (!this.currentFlowId) return
    
    await this.memory.saveFlow(this.currentFlowId, {
      id: this.currentFlowId,
      title: this.currentFlowTitle,
      nodes: this.nodes,
      edges: this.edges,
      updatedAt: new Date()
    })
  }
  
  /**
   * Create a new flow
   */
  private async createFlow(flowId: string, title?: string): Promise<void> {
    this.currentFlowId = flowId
    this.currentFlowTitle = title || flowId
    this.nodes = []
    this.edges = []
    
    await this.saveCurrentFlow()
  }
  
  /**
   * Load the root flow for this brain
   */
  private async loadRootFlow(): Promise<void> {
    await this.becomeFlow(this.id) // Root flow ID = Brain ID
  }
  
  /**
   * Add a node to current flow (self-modification)
   */
  async addNode(node: Node): Promise<void> {
    this.nodes.push(node)
    this.emit('node-added', node)
    await this.saveCurrentFlow()
  }
  
  /**
   * Add an edge to current flow
   */
  async addEdge(edge: Edge): Promise<void> {
    this.edges.push(edge)
    this.emit('edge-added', edge)
    await this.saveCurrentFlow()
  }
  
  /**
   * Form a memory from an email using the MemoryFormationService
   */
  private async formEmailMemory(emailData: any): Promise<void> {
    try {
      // Use the memory formation service to properly save the email
      const memory = await this.memoryFormation.formMemory('email', emailData)
      
      this.logger.info(`📧 Formed memory from email: ${emailData.subject} (ID: ${memory._id})`)
      
      // Also check if we need to create/update contact
      const fromEmail = emailData.from?.text || emailData.from
      if (fromEmail && fromEmail !== 'Unknown') {
        // Parse the email address
        const email = typeof fromEmail === 'string' 
          ? fromEmail.toLowerCase()
          : fromEmail.address?.toLowerCase()
          
        if (email) {
          // Check if contact exists
          const contacts = await this.memoryFormation.col.find({ 
            type: 'contact',
            email: email 
          }).toArray()
          
          if (contacts.length === 0) {
            // Create new contact
            const contactMemory = await this.memoryFormation.formMemory('contact', {
              email: email,
              name: emailData.from?.name || ''
            })
            
            // Create edge from contact to email
            await this.memoryFormation.createLink(contactMemory._id, memory._id, 'sent')
            
            this.logger.info(`📇 Created new contact: ${email}`)
            this.emit('contact:created', { email, id: contactMemory._id })
          } else {
            // Update existing contact
            const contact = contacts[0]
            await this.memoryFormation.col.updateOne(
              { _id: contact._id },
              { 
                $inc: { messageCount: 1 },
                $set: { lastSeen: new Date(), updatedAt: new Date() }
              }
            )
            
            // Create edge from contact to email
            await this.memoryFormation.createLink(contact._id, memory._id, 'sent')
            
            this.logger.info(`📇 Updated contact: ${email}`)
          }
        }
      }
      
      // Generate AI-powered response using EmailResponseService
      let aiResponseGenerated = false
      try {
        // Get or update contact for this email
        const contactEmail = typeof emailData.from === 'string' 
          ? emailData.from.toLowerCase()
          : emailData.from?.address?.toLowerCase() || emailData.from?.text?.match(/<(.+)>/)?.[1]?.toLowerCase();
          
        const contact = await this.memoryFormation.col.findOne({ 
          type: 'contact',
          email: contactEmail 
        });
        
        if (contact && this.emailResponse) {
          // Use AI to generate response and update qualification
          const result = await this.emailResponse.processEmailAndRespond(memory, contact)
          
          this.logger.info(`🤖 AI Response generated - Stage: ${result.qualification.stage}, Readiness: ${result.qualification.readiness}%`)
          
          aiResponseGenerated = true
          
          // Send the actual email response via SMTP
          if (this.mailService) {
            try {
              const recipientEmail = typeof emailData.from === 'string' 
                ? emailData.from 
                : emailData.from?.address || emailData.from?.text?.match(/<(.+)>/)?.[1]
                
              await this.mailService.sendEmail(
                recipientEmail,
                `Re: ${emailData.subject}`,
                result.emailResponse,
                emailData.messageId
              )
              
              this.logger.info(`📤 Email response sent to ${recipientEmail}`)
            } catch (error) {
              this.logger.error('Failed to send email response', error)
            }
          }
          
          // Emit the event
          this.emit('email:response-generated', {
            to: emailData.from,
            subject: `Re: ${emailData.subject}`,
            body: result.emailResponse,
            qualification: result.qualification,
            recommendation: result.recommendation
          })
        } else {
          this.logger.info('No contact found or EmailResponseService not initialized')
        }
      } catch (error) {
        this.logger.error('Failed to generate AI response', error)
      }
      
      // Emit memory formation event
      this.emit('memory:formed', {
        memoryId: memory._id.toString(),
        type: 'email',
        from: emailData.from,
        subject: emailData.subject,
        responseGenerated: aiResponseGenerated
      })
      
      // Increment thought count
      this.thoughtCount++
      
    } catch (error) {
      this.logger.error('Failed to form email memory', error)
    }
  }
  
  /**
   * Generate an email response based on personality
   */
  private generateEmailResponse(emailData: any): string | null {
    // Check if we have personality loaded
    if (!this.personality || Object.keys(this.personality).length === 0) {
      this.logger.info('No personality loaded, skipping response generation')
      return null
    }
    
    const { name = 'Phil', tone = 'professional', style = 'concise' } = this.personality
    
    // Simple response generation based on personality
    let response = ''
    
    // Opening based on tone
    if (tone === 'friendly') {
      response = `Hi there!\n\n`
    } else if (tone === 'formal') {
      response = `Dear Sender,\n\n`
    } else {
      response = `Hello,\n\n`
    }
    
    // Body based on style
    if (style === 'verbose') {
      response += `Thank you so much for your email regarding "${emailData.subject}". `
      response += `I have received your message and have carefully reviewed its contents. `
      response += `This information has been processed and stored in my memory system for future reference. `
    } else if (style === 'concise') {
      response += `Thanks for your email about "${emailData.subject}". `
      response += `Message received and noted. `
    } else {
      response += `I've received your email regarding "${emailData.subject}". `
    }
    
    // Add personality traits
    if (this.personality.traits && this.personality.traits.length > 0) {
      response += `\n\n`
      if (this.personality.traits.includes('helpful')) {
        response += `Is there anything else I can help you with? `
      }
      if (this.personality.traits.includes('curious')) {
        response += `I'd love to learn more about this topic. `
      }
    }
    
    // Closing
    response += `\n\nBest regards,\n${name}`
    
    this.logger.info(`📝 Generated response: ${response.substring(0, 100)}...`)
    
    return response
  }

  /**
   * Get brain vitals for monitoring
   */
  getVitals(): any {
    return {
      id: this.id,
      type: this.type,
      state: this.state,
      alive: this.alive,
      currentFlow: this.currentFlowId,
      thoughtCount: this.thoughtCount,
      errorCount: this.errorCount,
      lastThought: this.lastThought,
      memoryUsage: process.memoryUsage().heapUsed,
      uptime: Date.now() - this.lastThought.getTime()
    }
  }
  
  /**
   * Handle external commands (from UI or other brains)
   */
  async handleCommand(command: any): Promise<any> {
    switch (command.type) {
      case 'navigate':
        await this.navigateToFlow(command.flowId)
        break
        
      case 'load-personality':
        // Special command to load personality flow
        this.logger.info('🎭 Loading personality flow on request...')
        await this.becomeFlow('personality')
        return {
          success: true,
          message: 'Personality flow loaded',
          currentFlow: this.currentFlowId,
          nodeCount: this.nodes.length
        }
        
      case 'save':
        await this.saveCurrentFlow()
        break
        
      case 'add-node':
        await this.addNode(command.node)
        break
        
      case 'add-edge':
        await this.addEdge(command.edge)
        break
        
      case 'get-state':
        return {
          currentFlow: this.currentFlowId,
          nodes: this.nodes,
          edges: this.edges,
          stack: this.flowStack
        }
        
      case 'reset-memory':
        // Safely reset brain to empty state
        this.logger.info(`Brain ${this.id} resetting memory`)
        this.nodes = []
        this.edges = []
        this.flowStack = []
        this.currentFlowTitle = 'root'
        await this.saveCurrentFlow()
        this.emit('memory-reset', {
          brainId: this.id,
          timestamp: new Date()
        })
        return {
          success: true,
          message: 'Brain memory reset to clean state'
        }
        
      case 'startMailService':
        if (this.mailService) {
          await this.mailService.connect()
          return { success: true, message: 'Mail service started' }
        }
        return { success: false, message: 'Mail service not configured' }
        
      case 'stopMailService':
        if (this.mailService) {
          await this.mailService.disconnect()
          return { success: true, message: 'Mail service stopped' }
        }
        return { success: false, message: 'Mail service not configured' }
        
      default:
        throw new Error(`Unknown command: ${command.type}`)
    }
  }
}