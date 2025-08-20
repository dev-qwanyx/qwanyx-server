import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import {
  ThotConfig,
  EmailTemplate,
  AiPrompt,
  InboxEmail,
  ResponseLog,
  ThotContextValue,
  ThotConfigSchema,
} from '../types'
import { ThotMemoryService } from '../services/memoryService'

const ThotContext = createContext<ThotContextValue | null>(null)

export const useThotContext = () => {
  const context = useContext(ThotContext)
  if (!context) {
    throw new Error('useThotContext must be used within ThotProvider')
  }
  return context
}

export interface ThotProviderProps {
  children: React.ReactNode
  config?: {
    apiUrl?: string
    workspace?: string
    thotEmail?: string
    initialConfig?: Partial<ThotConfig>
  }
}

export const ThotProvider: React.FC<ThotProviderProps> = ({
  children,
  config = {},
}) => {
  const { 
    apiUrl = '/api', 
    workspace = 'default',
    thotEmail = 'thot.support@autodin.com'
  } = config
  
  const [thotConfig, setThotConfig] = useState<ThotConfig>(() => 
    ThotConfigSchema.parse(config.initialConfig || {})
  )
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [prompts, setPrompts] = useState<AiPrompt[]>([])
  const [inbox, setInbox] = useState<InboxEmail[]>([])
  const [logs, setLogs] = useState<ResponseLog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [memoryService] = useState(() => new ThotMemoryService(apiUrl, workspace, thotEmail))

  // Helper pour faire les requêtes API avec auth et workspace
  const fetchWithAuth = useCallback(async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('autodin_token') || localStorage.getItem('token')
    const url = new URL(`${apiUrl}${endpoint}`)
    
    // Ajouter le workspace à l'URL
    if (workspace) {
      url.searchParams.append('workspace', workspace)
    }
    
    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return response.json()
  }, [apiUrl, workspace])

  // Charger les données initiales
  const loadInitialData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Initialiser le token pour le service mémoire
      const token = localStorage.getItem('autodin_token') || localStorage.getItem('token')
      if (token) {
        memoryService.setToken(token)
      }

      // Initialiser le THOT comme utilisateur DH
      await memoryService.initializeThotUser()

      // Essayer de charger la config depuis la mémoire MongoDB
      const memoryConfig = await memoryService.loadConfig()
      
      if (memoryConfig && memoryConfig.data.credentials) {
        // Config trouvée dans la mémoire
        console.log('Config loaded from THOT memory')
        setThotConfig(ThotConfigSchema.parse({
          credentials: memoryConfig.data.credentials,
          settings: memoryConfig.data.settings || {},
          templates: memoryConfig.data.templates || [],
          prompts: memoryConfig.data.prompts || []
        }))
      } else {
        // Pas de config en mémoire, charger depuis l'API (legacy)
        const [configData, templatesData, promptsData, inboxData, logsData] = await Promise.all([
          fetchWithAuth('/thot/config').catch(() => thotConfig),
          fetchWithAuth('/thot/templates').catch(() => []),
          fetchWithAuth('/thot/prompts').catch(() => []),
          fetchWithAuth('/thot/inbox').catch(() => []),
          fetchWithAuth('/thot/logs').catch(() => []),
        ])
        
        setThotConfig(ThotConfigSchema.parse(configData))
        setTemplates(templatesData)
        setPrompts(promptsData)
        setInbox(inboxData)
        setLogs(logsData)
      }
    } catch (err) {
      console.error('Error loading THOT data:', err)
      setError('Erreur lors du chargement des données THOT')
      
      // Données de démonstration en cas d'erreur
      setTemplates([
        {
          id: '1',
          name: 'Réponse automatique - Hors bureau',
          subject: 'Re: {original_subject}',
          body: 'Bonjour,\n\nMerci pour votre message. Je suis actuellement absent du bureau.\n\nCordialement',
          variables: ['original_subject'],
          category: 'greeting',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])
      
      setPrompts([
        {
          id: '1',
          name: 'Assistant professionnel',
          prompt: 'Tu es un assistant professionnel qui répond aux emails de manière courtoise.',
          context: 'Entreprise Autodin',
          tone: 'professional',
          maxTokens: 500,
          temperature: 0.7,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [fetchWithAuth, thotConfig])

  useEffect(() => {
    loadInitialData()
  }, []) // Ne pas inclure loadInitialData pour éviter les boucles

  const updateConfig = useCallback(async (newConfig: Partial<ThotConfig>) => {
    try {
      const updatedConfig = ThotConfigSchema.parse({ ...thotConfig, ...newConfig })
      setThotConfig(updatedConfig)
      
      // Sauvegarder dans la mémoire MongoDB de THOT
      await memoryService.saveConfig(updatedConfig)
      console.log('Config saved to THOT memory')
      
      // Sauvegarder aussi sur l'API (pour compatibilité)
      await fetchWithAuth('/thot/config', {
        method: 'PUT',
        body: JSON.stringify(updatedConfig),
      }).catch(console.error)
    } catch (err) {
      setError('Erreur lors de la mise à jour de la configuration')
      throw err
    }
  }, [thotConfig, fetchWithAuth])

  const createTemplate = useCallback(async (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTemplate: EmailTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    try {
      const created = await fetchWithAuth('/thot/templates', {
        method: 'POST',
        body: JSON.stringify(template),
      }).catch(() => newTemplate)
      
      setTemplates(prev => [...prev, created])
      return created
    } catch (err) {
      // En cas d'erreur, ajouter localement
      setTemplates(prev => [...prev, newTemplate])
      return newTemplate
    }
  }, [fetchWithAuth])

  const updateTemplate = useCallback(async (id: string, template: Partial<EmailTemplate>) => {
    setTemplates(prev => prev.map(t => 
      t.id === id ? { ...t, ...template, updatedAt: new Date() } : t
    ))
    
    await fetchWithAuth(`/thot/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(template),
    }).catch(console.error)
  }, [fetchWithAuth])

  const deleteTemplate = useCallback(async (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id))
    
    await fetchWithAuth(`/thot/templates/${id}`, {
      method: 'DELETE',
    }).catch(console.error)
  }, [fetchWithAuth])

  const createPrompt = useCallback(async (prompt: Omit<AiPrompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPrompt: AiPrompt = {
      ...prompt,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    try {
      const created = await fetchWithAuth('/thot/prompts', {
        method: 'POST',
        body: JSON.stringify(prompt),
      }).catch(() => newPrompt)
      
      setPrompts(prev => [...prev, created])
      return created
    } catch (err) {
      setPrompts(prev => [...prev, newPrompt])
      return newPrompt
    }
  }, [fetchWithAuth])

  const updatePrompt = useCallback(async (id: string, prompt: Partial<AiPrompt>) => {
    setPrompts(prev => prev.map(p => 
      p.id === id ? { ...p, ...prompt, updatedAt: new Date() } : p
    ))
    
    await fetchWithAuth(`/thot/prompts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(prompt),
    }).catch(console.error)
  }, [fetchWithAuth])

  const deletePrompt = useCallback(async (id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id))
    
    await fetchWithAuth(`/thot/prompts/${id}`, {
      method: 'DELETE',
    }).catch(console.error)
  }, [fetchWithAuth])

  const processEmail = useCallback(async (emailId: string) => {
    setInbox(prev => prev.map(email => 
      email.id === emailId ? { ...email, status: 'processing' as const } : email
    ))
    
    await fetchWithAuth(`/thot/emails/${emailId}/process`, {
      method: 'POST',
    }).catch(console.error)
  }, [fetchWithAuth])

  const generateResponse = useCallback(async (emailId: string, templateId?: string, promptId?: string) => {
    try {
      const response = await fetchWithAuth('/thot/generate', {
        method: 'POST',
        body: JSON.stringify({ emailId, templateId, promptId }),
      })
      return response.text || 'Réponse générée automatiquement'
    } catch (err) {
      return 'Réponse générée automatiquement (mode démo)'
    }
  }, [fetchWithAuth])

  const sendResponse = useCallback(async (emailId: string, response: string) => {
    const log: ResponseLog = {
      id: Date.now().toString(),
      emailId,
      generatedResponse: response,
      sentAt: new Date(),
      status: 'sent',
    }
    
    setLogs(prev => [...prev, log])
    setInbox(prev => prev.map(email => 
      email.id === emailId ? { ...email, status: 'responded' as const, responseId: log.id } : email
    ))
    
    await fetchWithAuth(`/thot/emails/${emailId}/send`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    }).catch(console.error)
  }, [fetchWithAuth])

  const testEmailConnection = useCallback(async (type: 'imap' | 'smtp') => {
    try {
      const result = await fetchWithAuth(`/thot/test-connection/${type}`, {
        method: 'POST',
        body: JSON.stringify(thotConfig.credentials[type]),
      })
      return result
    } catch (err) {
      throw new Error(`Erreur de test de connexion ${type}`)
    }
  }, [fetchWithAuth, thotConfig])

  const value: ThotContextValue = {
    config: thotConfig,
    templates,
    prompts,
    inbox,
    logs,
    updateConfig,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    createPrompt,
    updatePrompt,
    deletePrompt,
    processEmail,
    generateResponse,
    sendResponse,
    testEmailConnection,
    isLoading,
    error,
  }

  return (
    <ThotContext.Provider value={value}>
      {children}
    </ThotContext.Provider>
  )
}