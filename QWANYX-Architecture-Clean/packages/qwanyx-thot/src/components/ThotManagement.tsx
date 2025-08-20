import { ThotProvider } from '../providers/ThotProvider'
import { ThotNavigation } from './ThotNavigation'

interface ThotManagementConfig {
  apiUrl?: string
  workspace?: string
  fetchConfig?: () => Promise<any>
  onConfigUpdate?: (config: any) => Promise<void>
}

interface ThotManagementProps {
  config?: ThotManagementConfig
}

export function ThotManagement({ config }: ThotManagementProps) {
  return (
    <ThotProvider config={config}>
      <ThotNavigation />
    </ThotProvider>
  )
}