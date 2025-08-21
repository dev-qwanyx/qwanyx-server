// Provider principal
export { ThotProvider, useThotContext } from './providers/ThotProvider'

// Services
export { ThotMemoryService } from './services/memoryService'

// Components
export { ThotManagement } from './components/ThotManagement'
export { ThotNavigation } from './components/ThotNavigation'

// Pages
export { ConfigurationPage } from './pages/ConfigurationPage'
export { TemplatesPage } from './pages/TemplatesPage'
export { PromptsPage } from './pages/PromptsPage'
export { InboxPage } from './pages/InboxPage'
export { LogsPage } from './pages/LogsPage'
export { DigitalHumansPage } from './pages/DigitalHumansPage'
export { DigitalHumanEditor } from './pages/DigitalHumanEditor'

// Types
export type {
  ThotConfig,
  EmailTemplate,
  AiPrompt,
  InboxEmail,
  ResponseLog,
  ThotContextValue,
} from './types'

export {
  ThotConfigSchema,
  EmailTemplateSchema,
  AiPromptSchema,
  InboxEmailSchema,
  ResponseLogSchema,
} from './types'

// Memory types
export type {
  Memory,
  MemoryLink,
  ConfigMemory,
  ThotUser,
} from './types/memory'

export {
  MemorySchema,
  MemoryLinkSchema,
  ConfigMemorySchema,
  ThotUserSchema,
  MemoryTypes,
  LinkTypes,
  getMemoryCollectionName,
  createConfigMemory,
} from './types/memory'