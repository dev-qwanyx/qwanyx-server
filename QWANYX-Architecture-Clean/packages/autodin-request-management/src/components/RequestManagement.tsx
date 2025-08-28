import { RequestManagementProvider } from '../providers/RequestManagementProvider'
import { RequestList } from './RequestList'
import { RequestManagementConfig } from '../types'

interface RequestManagementProps {
  config?: RequestManagementConfig
}

export function RequestManagement({ config }: RequestManagementProps) {
  return (
    <RequestManagementProvider config={config}>
      <RequestList />
    </RequestManagementProvider>
  )
}