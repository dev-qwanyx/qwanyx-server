import { 
  Memory, 
  ConfigMemory, 
  ThotUser, 
  MemoryTypes, 
  LinkTypes,
  getMemoryCollectionName,
  createConfigMemory 
} from '../types/memory'

export class ThotMemoryService {
  private apiUrl: string
  private workspace: string
  private thotEmail: string
  private collectionName: string
  private token: string | null = null

  constructor(apiUrl: string, workspace: string, thotEmail: string) {
    this.apiUrl = apiUrl
    this.workspace = workspace
    this.thotEmail = thotEmail
    this.collectionName = getMemoryCollectionName(thotEmail)
  }

  setToken(token: string) {
    this.token = token
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      ...options.headers
    }

    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`)
    }

    return response.json()
  }

  // Créer ou récupérer le Digital Human
  async initializeThotUser(): Promise<ThotUser> {
    try {
      // Vérifier si le Digital Human existe déjà
      const existingUser = await this.request(
        `/workspaces/${this.workspace}/users?email=${this.thotEmail}`
      )

      if (existingUser && existingUser.length > 0) {
        return existingUser[0]
      }

      // Déterminer le rôle basé sur l'email
      const emailPrefix = this.thotEmail.split('@')[0].toLowerCase()
      let role: 'support' | 'commercial' | 'assistant' | 'rh' | 'info' | 'custom' = 'custom'
      
      if (emailPrefix.includes('support')) role = 'support'
      else if (emailPrefix.includes('commercial') || emailPrefix.includes('sales')) role = 'commercial'
      else if (emailPrefix.includes('rh') || emailPrefix.includes('hr')) role = 'rh'
      else if (emailPrefix.includes('info')) role = 'info'
      else if (emailPrefix.includes('assistant')) role = 'assistant'

      // Créer le Digital Human (basé sur THOT)
      const newThotUser: Partial<ThotUser> = {
        email: this.thotEmail,
        name: this.thotEmail.split('@')[0].replace(/[.-]/g, ' ').toUpperCase(),
        type: 'DH',
        system: 'THOT', // Tous les DH utilisent le système THOT
        role: role,
        workspace: this.workspace,
        memoryCollection: this.collectionName,
        active: true,
        permissions: [
          'email:read',
          'email:send',
          'memory:read',
          'memory:write',
          'template:use',
          'ai:use'
        ],
        personality: {
          tone: role === 'support' ? 'friendly' : 'professional',
          responseStyle: 'balanced'
        }
      }

      return await this.request(
        `/workspaces/${this.workspace}/users`,
        {
          method: 'POST',
          body: JSON.stringify(newThotUser)
        }
      )
    } catch (error) {
      console.error('Failed to initialize THOT user:', error)
      throw error
    }
  }

  // Sauvegarder la configuration en mémoire
  async saveConfig(config: any): Promise<Memory> {
    const configMemory = createConfigMemory(config)
    
    // Chercher si une config existe déjà
    const existingConfig = await this.findMemories({
      type: MemoryTypes.CONFIG,
      subtype: 'credentials'
    })

    if (existingConfig.length > 0) {
      // Mettre à jour la config existante
      return await this.updateMemory(existingConfig[0]._id!, configMemory)
    } else {
      // Créer une nouvelle config
      return await this.createMemory(configMemory)
    }
  }

  // Récupérer la configuration depuis la mémoire
  async loadConfig(): Promise<ConfigMemory | null> {
    const configs = await this.findMemories({
      type: MemoryTypes.CONFIG,
      subtype: 'credentials'
    })

    if (configs.length > 0) {
      // Incrémenter le compteur d'accès
      await this.accessMemory(configs[0]._id!)
      return configs[0] as ConfigMemory
    }

    return null
  }

  // Créer une nouvelle mémoire
  async createMemory(memory: Partial<Memory>): Promise<Memory> {
    return await this.request(
      `/workspaces/${this.workspace}/collections/${this.collectionName}/documents`,
      {
        method: 'POST',
        body: JSON.stringify(memory)
      }
    )
  }

  // Mettre à jour une mémoire
  async updateMemory(id: string, updates: Partial<Memory>): Promise<Memory> {
    return await this.request(
      `/workspaces/${this.workspace}/collections/${this.collectionName}/documents/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(updates)
      }
    )
  }

  // Chercher des mémoires
  async findMemories(query: any): Promise<Memory[]> {
    const queryString = new URLSearchParams({
      query: JSON.stringify(query)
    }).toString()

    return await this.request(
      `/workspaces/${this.workspace}/collections/${this.collectionName}/documents?${queryString}`
    )
  }

  // Marquer une mémoire comme accédée
  async accessMemory(id: string): Promise<void> {
    await this.request(
      `/workspaces/${this.workspace}/collections/${this.collectionName}/documents/${id}/access`,
      {
        method: 'POST'
      }
    )
  }

  // Créer un lien entre deux mémoires
  async linkMemories(
    fromId: string, 
    toId: string, 
    linkType: keyof typeof LinkTypes,
    strength: number = 0.5
  ): Promise<void> {
    const memory = await this.request(
      `/workspaces/${this.workspace}/collections/${this.collectionName}/documents/${fromId}`
    )

    const newLink = {
      to: toId,
      type: LinkTypes[linkType],
      strength,
      created: new Date(),
      lastUsed: new Date(),
      useCount: 1
    }

    memory.links = memory.links || []
    memory.links.push(newLink)

    await this.updateMemory(fromId, { links: memory.links })
  }

  // Renforcer un lien existant
  async strengthenLink(fromId: string, toId: string, increment: number = 0.1): Promise<void> {
    const memory = await this.request(
      `/workspaces/${this.workspace}/collections/${this.collectionName}/documents/${fromId}`
    )

    if (memory.links) {
      const link = memory.links.find((l: any) => l.to === toId)
      if (link) {
        link.strength = Math.min(1, link.strength + increment)
        link.lastUsed = new Date()
        link.useCount++
        await this.updateMemory(fromId, { links: memory.links })
      }
    }
  }

  // Processus de consolidation (sommeil)
  async consolidateMemories(): Promise<void> {
    // Récupérer toutes les mémoires
    const memories = await this.findMemories({})
    
    for (const memory of memories) {
      if (memory.links) {
        let modified = false
        
        for (const link of memory.links) {
          const daysSinceUse = (Date.now() - new Date(link.lastUsed).getTime()) / (1000 * 60 * 60 * 24)
          
          // Affaiblir les liens non utilisés
          if (daysSinceUse > 30) {
            link.strength = Math.max(0, link.strength - 0.1)
            modified = true
          }
          
          // Renforcer les liens fréquemment utilisés
          if (link.useCount > 10 && link.strength < 0.9) {
            link.strength = Math.min(1, link.strength + 0.05)
            modified = true
          }
        }
        
        // Supprimer les liens trop faibles
        memory.links = memory.links.filter(l => l.strength > 0.1)
        
        if (modified) {
          await this.updateMemory(memory._id!, { links: memory.links })
        }
      }
    }
    
    // Créer une mémoire de maintenance
    await this.createMemory({
      type: MemoryTypes.MAINTENANCE,
      subtype: 'consolidation',
      timestamp: new Date(),
      data: {
        memoriesProcessed: memories.length,
        phase: 'consolidation'
      },
      tags: ['system', 'maintenance']
    })
  }
}