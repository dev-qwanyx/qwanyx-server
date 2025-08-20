import { z } from 'zod'

// Types de mémoire possibles
export const MemoryTypes = {
  CONFIG: 'config',
  EMAIL: 'email',
  ANALYSIS: 'analysis',
  CONTEXT: 'context',
  DECISION: 'decision',
  LEARNING: 'learning',
  FEEDBACK: 'feedback',
  THOUGHT: 'thought',
  PATTERN: 'pattern',
  MAINTENANCE: 'maintenance'
} as const

// Types de liens entre mémoires
export const LinkTypes = {
  // Causaux
  CAUSES: 'causes',
  CAUSED_BY: 'caused_by',
  
  // Temporels
  BEFORE: 'before',
  AFTER: 'after',
  DURING: 'during',
  
  // Sémantiques
  SIMILAR_TO: 'similar_to',
  OPPOSITE_OF: 'opposite_of',
  PART_OF: 'part_of',
  CONTAINS: 'contains',
  
  // Émotionnels
  TRIGGERS_JOY: 'triggers_joy',
  TRIGGERS_FRUSTRATION: 'triggers_frustration',
  
  // Apprentissage
  LEARNED_FROM: 'learned_from',
  CONTRADICTS: 'contradicts',
  CONFIRMS: 'confirms'
} as const

// Schema pour un lien de mémoire
export const MemoryLinkSchema = z.object({
  to: z.string(), // ObjectId de la mémoire cible
  type: z.enum(Object.values(LinkTypes) as [string, ...string[]]),
  strength: z.number().min(0).max(1).default(0.5),
  created: z.date().default(() => new Date()),
  lastUsed: z.date().default(() => new Date()),
  useCount: z.number().int().min(0).default(0)
})

// Schema principal pour une mémoire
export const MemorySchema = z.object({
  _id: z.string().optional(),
  p: z.string().optional(), // Parent ID
  type: z.enum(Object.values(MemoryTypes) as [string, ...string[]]),
  subtype: z.string().optional(),
  timestamp: z.date().default(() => new Date()),
  data: z.record(z.any()), // Flexible selon le type
  tags: z.array(z.string()).default([]),
  expires: z.date().optional(), // Pour l'oubli programmé
  links: z.array(MemoryLinkSchema).default([]),
  metadata: z.object({
    importance: z.number().min(0).max(1).default(0.5),
    confidence: z.number().min(0).max(1).default(1),
    accessed: z.number().int().default(0),
    lastAccessed: z.date().optional()
  }).default({})
})

// Schema spécifique pour la config (type de mémoire)
export const ConfigMemorySchema = MemorySchema.extend({
  type: z.literal(MemoryTypes.CONFIG),
  data: z.object({
    credentials: z.object({
      imap: z.object({
        host: z.string(),
        port: z.number(),
        secure: z.boolean(),
        user: z.string(),
        password: z.string()
      }),
      smtp: z.object({
        host: z.string(),
        port: z.number(),
        secure: z.boolean(),
        user: z.string(),
        password: z.string(),
        from: z.string()
      })
    }).optional(),
    settings: z.record(z.any()).optional(),
    templates: z.array(z.any()).optional(),
    prompts: z.array(z.any()).optional()
  })
})

// Schema pour un Digital Human (tous basés sur THOT)
export const DigitalHumanSchema = z.object({
  _id: z.string().optional(),
  email: z.string().email(),
  name: z.string(),
  type: z.literal('DH'), // Digital Human
  system: z.literal('THOT'), // Tous les DH utilisent le système THOT
  role: z.enum(['support', 'commercial', 'assistant', 'rh', 'info', 'custom']), // Rôle spécifique
  workspace: z.string(),
  memoryCollection: z.string(), // e.g., "support-autodin-com"
  active: z.boolean().default(true),
  created: z.date().default(() => new Date()),
  permissions: z.array(z.string()).default([
    'email:read',
    'email:send',
    'memory:read',
    'memory:write',
    'template:use',
    'ai:use'
  ]),
  personality: z.object({
    tone: z.enum(['formal', 'friendly', 'casual', 'professional']).default('professional'),
    responseStyle: z.enum(['concise', 'detailed', 'balanced']).default('balanced'),
    signature: z.string().optional()
  }).default({}),
  settings: z.object({
    autoReply: z.boolean().default(true),
    replyDelay: z.number().default(300), // seconds
    maxRepliesPerDay: z.number().default(100),
    workingHours: z.object({
      enabled: z.boolean().default(false),
      start: z.string().default('09:00'),
      end: z.string().default('18:00'),
      timezone: z.string().default('Europe/Paris')
    }).default({})
  }).default({})
})

// Pour compatibilité, alias
export const ThotUserSchema = DigitalHumanSchema

// Types TypeScript
export type Memory = z.infer<typeof MemorySchema>
export type MemoryLink = z.infer<typeof MemoryLinkSchema>
export type ConfigMemory = z.infer<typeof ConfigMemorySchema>
export type DigitalHuman = z.infer<typeof DigitalHumanSchema>
export type ThotUser = DigitalHuman // Alias pour compatibilité

// Helper pour créer le nom de collection basé sur l'email
export function getMemoryCollectionName(email: string): string {
  // Transformer "thot.support@autodin.com" en "thot-support-autodin-com"
  return email
    .toLowerCase()
    .replace('@', '-')
    .replace(/\./g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

// Helper pour créer une mémoire de configuration
export function createConfigMemory(config: any): ConfigMemory {
  return {
    type: MemoryTypes.CONFIG,
    subtype: 'credentials',
    timestamp: new Date(),
    data: {
      credentials: config.credentials,
      settings: config.settings,
      templates: config.templates,
      prompts: config.prompts
    },
    tags: ['config', 'important', 'system'],
    links: [],
    metadata: {
      importance: 1,
      confidence: 1,
      accessed: 0
    }
  }
}