/**
 * Neural Interface
 * Handles WebSocket connections to brains
 * Like connecting electrodes to a living brain
 */

import { WebSocketServer, WebSocket } from 'ws'
import { BrainManager } from '../core/BrainManager'
import { Logger } from '../utils/Logger'
import { NeuralMessage } from '../types'

interface ConnectedClient {
  socket: WebSocket
  brainId?: string
  permissions: string[]
}

export class NeuralInterface {
  private wss: WebSocketServer
  private brainManager: BrainManager
  private logger: Logger
  private connections: Map<string, ConnectedClient> = new Map()
  
  constructor(wss: WebSocketServer, brainManager: BrainManager) {
    this.wss = wss
    this.brainManager = brainManager
    this.logger = Logger.getInstance()
  }
  
  start(): void {
    this.wss.on('connection', (socket: WebSocket, request) => {
      this.handleConnection(socket, request)
    })
    
    this.logger.info('Neural interface started')
  }
  
  private handleConnection(socket: WebSocket, _request: any): void {
    const connectionId = this.generateConnectionId()
    
    // Store connection
    const client: ConnectedClient = {
      socket,
      permissions: ['read', 'write'] // TODO: Implement proper auth
    }
    this.connections.set(connectionId, client)
    
    this.logger.info(`Neural connection established: ${connectionId}`)
    
    // Send welcome message
    this.sendMessage(socket, {
      id: connectionId,
      type: 'event',
      payload: {
        event: 'connected',
        message: 'Neural link established',
        connectionId
      },
      timestamp: Date.now()
    })
    
    // Handle messages
    socket.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString()) as NeuralMessage
        await this.handleMessage(connectionId, message)
      } catch (error) {
        this.logger.error('Invalid message received', error)
        this.sendError(socket, 'Invalid message format')
      }
    })
    
    // Handle disconnection
    socket.on('close', () => {
      this.handleDisconnection(connectionId)
    })
    
    // Handle errors
    socket.on('error', (error) => {
      this.logger.error(`Connection ${connectionId} error`, error)
    })
    
    // Heartbeat
    this.setupHeartbeat(socket)
  }
  
  private async handleMessage(connectionId: string, message: NeuralMessage): Promise<void> {
    const client = this.connections.get(connectionId)
    if (!client) return
    
    this.logger.debug(`Message from ${connectionId}: ${message.type}`)
    
    switch (message.type) {
      case 'command':
        await this.handleCommand(client, message)
        break
        
      case 'query':
        await this.handleQuery(client, message)
        break
        
      case 'stream':
        await this.handleStream(client, message)
        break
        
      default:
        this.sendError(client.socket, `Unknown message type: ${message.type}`)
    }
  }
  
  private async handleCommand(client: ConnectedClient, message: NeuralMessage): Promise<void> {
    const { brainId, payload } = message
    
    if (!brainId) {
      this.sendError(client.socket, 'Brain ID required for commands')
      return
    }
    
    const brain = this.brainManager.getBrain(brainId)
    if (!brain) {
      this.sendError(client.socket, `Brain ${brainId} not found`)
      return
    }
    
    // Connect client to brain
    client.brainId = brainId
    
    // Forward command to brain
    try {
      const result = await brain.handleCommand(payload)
      
      this.sendMessage(client.socket, {
        id: message.id,
        type: 'command',
        brainId,
        payload: {
          success: true,
          result
        },
        timestamp: Date.now()
      })
      
      // Subscribe to brain events
      this.subscribeToBrain(client, brain)
      
    } catch (error) {
      this.sendError(client.socket, `Command failed: ${error}`)
    }
  }
  
  private async handleQuery(client: ConnectedClient, message: NeuralMessage): Promise<void> {
    const { payload } = message
    
    switch (payload.query) {
      case 'list-brains':
        const brains = this.brainManager.listBrains()
        this.sendMessage(client.socket, {
          id: message.id,
          type: 'query',
          payload: { brains },
          timestamp: Date.now()
        })
        break
        
      case 'brain-stats':
        const stats = this.brainManager.getStats()
        this.sendMessage(client.socket, {
          id: message.id,
          type: 'query',
          payload: { stats },
          timestamp: Date.now()
        })
        break
        
      default:
        this.sendError(client.socket, `Unknown query: ${payload.query}`)
    }
  }
  
  private async handleStream(client: ConnectedClient, message: NeuralMessage): Promise<void> {
    const { brainId, payload } = message
    
    if (!brainId || !client.brainId) {
      this.sendError(client.socket, 'Must be connected to a brain for streaming')
      return
    }
    
    // Handle different stream types
    switch (payload.stream) {
      case 'thoughts':
        // Brain will stream thoughts to connected client
        this.logger.info(`Client subscribing to thoughts from brain ${brainId}`)
        break
        
      case 'state':
        // Stream brain state changes
        this.logger.info(`Client subscribing to state from brain ${brainId}`)
        break
        
      default:
        this.sendError(client.socket, `Unknown stream type: ${payload.stream}`)
    }
  }
  
  private subscribeToBrain(client: ConnectedClient, brain: any): void {
    // Forward brain events to client
    brain.on('flow-changed', (data: any) => {
      this.sendMessage(client.socket, {
        id: this.generateMessageId(),
        type: 'event',
        brainId: client.brainId,
        payload: {
          event: 'flow-changed',
          data
        },
        timestamp: Date.now()
      })
    })
    
    brain.on('thought', (data: any) => {
      this.sendMessage(client.socket, {
        id: this.generateMessageId(),
        type: 'stream',
        brainId: client.brainId,
        payload: {
          stream: 'thought',
          data
        },
        timestamp: Date.now()
      })
    })
    
    brain.on('node-executed', (data: any) => {
      this.sendMessage(client.socket, {
        id: this.generateMessageId(),
        type: 'event',
        brainId: client.brainId,
        payload: {
          event: 'node-executed',
          data
        },
        timestamp: Date.now()
      })
    })
  }
  
  private handleDisconnection(connectionId: string): void {
    const client = this.connections.get(connectionId)
    
    if (client && client.brainId) {
      this.logger.info(`Neural connection ${connectionId} disconnected from brain ${client.brainId}`)
    } else {
      this.logger.info(`Neural connection ${connectionId} disconnected`)
    }
    
    this.connections.delete(connectionId)
  }
  
  private setupHeartbeat(socket: WebSocket): void {
    const interval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.ping()
      } else {
        clearInterval(interval)
      }
    }, 30000) // 30 seconds
  }
  
  private sendMessage(socket: WebSocket, message: NeuralMessage): void {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message))
    }
  }
  
  private sendError(socket: WebSocket, error: string): void {
    this.sendMessage(socket, {
      id: this.generateMessageId(),
      type: 'event',
      payload: {
        event: 'error',
        error
      },
      timestamp: Date.now()
    })
  }
  
  private generateConnectionId(): string {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}