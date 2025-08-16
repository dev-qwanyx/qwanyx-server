// Main component
export { UserManagement } from './components/UserManagement'

// Individual components
export { UserList } from './components/UserList'
export { UserForm } from './components/UserForm'

// Provider and context
export { UserManagementProvider, useUserManagement } from './providers/UserManagementProvider'

// Types
export type {
  User,
  UserRole,
  UserStatus,
  UserManagementConfig,
  UserTableColumn,
  UserAction,
  CustomField,
  UserFilter,
  UserManagementState
} from './types'