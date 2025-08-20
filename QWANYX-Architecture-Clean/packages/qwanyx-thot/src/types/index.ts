import { z } from 'zod'

// Credentials Email
export const EmailCredentialsSchema = z.object({
  // Configuration IMAP (lecture des emails)
  imap: z.object({
    host: z.string().default(''),
    port: z.number().default(993),
    secure: z.boolean().default(true),
    user: z.string().default(''), // Email mais pas de validation stricte pour permettre vide
    password: z.string().default(''),
    folder: z.string().default('INBOX'),
  }),
  // Configuration SMTP (envoi des emails)
  smtp: z.object({
    host: z.string().default(''),
    port: z.number().default(465),
    secure: z.boolean().default(true),
    user: z.string().default(''), // Email mais pas de validation stricte pour permettre vide
    password: z.string().default(''),
    from: z.string().default(''), // Nom affiché dans l'envoi
  }),
  // Statut de connexion
  connectionStatus: z.object({
    imap: z.enum(['connected', 'disconnected', 'error', 'testing']).default('disconnected'),
    smtp: z.enum(['connected', 'disconnected', 'error', 'testing']).default('disconnected'),
    lastTest: z.date().optional(),
    lastError: z.string().optional(),
  }).default({}),
})

// Configuration principale de THOT
export const ThotConfigSchema = z.object({
  enabled: z.boolean().default(true),
  model: z.enum(['gpt-4', 'gpt-3.5-turbo', 'claude-3', 'local']).default('gpt-3.5-turbo'),
  responseDelay: z.number().min(0).max(3600).default(60), // Délai en secondes avant réponse
  maxResponsesPerDay: z.number().min(0).default(100),
  workingHours: z.object({
    enabled: z.boolean().default(false),
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).default('09:00'),
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).default('18:00'),
    timezone: z.string().default('Europe/Paris'),
  }).default({
    enabled: false,
    start: '09:00',
    end: '18:00',
    timezone: 'Europe/Paris'
  }),
  credentials: EmailCredentialsSchema.default({
    imap: {
      host: '',
      port: 993,
      secure: true,
      user: '',
      password: '',
      folder: 'INBOX',
    },
    smtp: {
      host: '',
      port: 465,
      secure: true,
      user: '',
      password: '',
      from: '',
    },
    connectionStatus: {
      imap: 'disconnected',
      smtp: 'disconnected',
    },
  }),
})

// Template d'email
export const EmailTemplateSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  subject: z.string().min(1).max(200),
  body: z.string().min(1),
  variables: z.array(z.string()).default([]),
  category: z.enum(['greeting', 'information', 'support', 'sales', 'custom']).default('custom'),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

// Prompt AI
export const AiPromptSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  prompt: z.string().min(1),
  context: z.string().optional(),
  tone: z.enum(['professional', 'friendly', 'casual', 'formal']).default('professional'),
  maxTokens: z.number().min(50).max(4000).default(500),
  temperature: z.number().min(0).max(2).default(0.7),
  isActive: z.boolean().default(true),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

// Email dans la boîte de réception
export const InboxEmailSchema = z.object({
  id: z.string(),
  from: z.string().email(),
  to: z.string().email(),
  subject: z.string(),
  body: z.string(),
  receivedAt: z.date(),
  status: z.enum(['pending', 'processing', 'responded', 'ignored', 'failed']).default('pending'),
  responseId: z.string().optional(),
  category: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
})

// Log de réponse automatique
export const ResponseLogSchema = z.object({
  id: z.string(),
  emailId: z.string(),
  templateId: z.string().optional(),
  promptId: z.string().optional(),
  generatedResponse: z.string(),
  sentAt: z.date(),
  status: z.enum(['sent', 'failed', 'pending']).default('pending'),
  error: z.string().optional(),
  metadata: z.record(z.any()).optional(),
})

// Types TypeScript dérivés des schémas
export type EmailCredentials = z.infer<typeof EmailCredentialsSchema>
export type ThotConfig = z.infer<typeof ThotConfigSchema>
export type EmailTemplate = z.infer<typeof EmailTemplateSchema>
export type AiPrompt = z.infer<typeof AiPromptSchema>
export type InboxEmail = z.infer<typeof InboxEmailSchema>
export type ResponseLog = z.infer<typeof ResponseLogSchema>

// Configuration du contexte
export interface ThotContextValue {
  config: ThotConfig
  templates: EmailTemplate[]
  prompts: AiPrompt[]
  inbox: InboxEmail[]
  logs: ResponseLog[]
  
  // Actions
  updateConfig: (config: Partial<ThotConfig>) => Promise<void>
  createTemplate: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<EmailTemplate>
  updateTemplate: (id: string, template: Partial<EmailTemplate>) => Promise<void>
  deleteTemplate: (id: string) => Promise<void>
  createPrompt: (prompt: Omit<AiPrompt, 'id' | 'createdAt' | 'updatedAt'>) => Promise<AiPrompt>
  updatePrompt: (id: string, prompt: Partial<AiPrompt>) => Promise<void>
  deletePrompt: (id: string) => Promise<void>
  processEmail: (emailId: string) => Promise<void>
  generateResponse: (emailId: string, templateId?: string, promptId?: string) => Promise<string>
  sendResponse: (emailId: string, response: string) => Promise<void>
  
  // Fonction de test de connexion
  testEmailConnection: (type: 'imap' | 'smtp') => Promise<any>
  
  // État
  isLoading: boolean
  error: string | null
}