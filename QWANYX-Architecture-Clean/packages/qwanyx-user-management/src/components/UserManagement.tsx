import { UserManagementProvider } from '../providers/UserManagementProvider'
import { UserList } from './UserList'
import { UserManagementConfig } from '../types'

interface UserManagementProps {
  config?: UserManagementConfig
}

export function UserManagement({ config }: UserManagementProps) {
  return (
    <UserManagementProvider config={config}>
      <UserList />
    </UserManagementProvider>
  )
}