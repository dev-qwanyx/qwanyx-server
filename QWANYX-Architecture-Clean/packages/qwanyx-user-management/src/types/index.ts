export interface User {
  _id?: string
  id?: string
  email: string
  name?: string
  firstName?: string
  lastName?: string
  role?: UserRole
  status?: UserStatus
  avatar?: string
  phone?: string
  department?: string
  jobTitle?: string
  createdAt?: Date | string
  updatedAt?: Date | string
  lastLogin?: Date | string
  metadata?: Record<string, any>
}

export type UserRole = 'admin' | 'user' | 'moderator' | 'viewer' | string

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending'

export interface UserManagementConfig {
  apiUrl?: string
  workspace?: string
  columns?: UserTableColumn[]
  actions?: UserAction[]
  allowAdd?: boolean
  allowEdit?: boolean
  allowDelete?: boolean
  allowExport?: boolean
  allowImport?: boolean
  customFields?: CustomField[]
  onUserSelect?: (user: User) => void
  onUserAdd?: (user: Partial<User>) => Promise<void>
  onUserEdit?: (user: User) => Promise<void>
  onUserDelete?: (userId: string) => Promise<void>
  fetchUsers?: () => Promise<User[]>
}

export interface UserTableColumn {
  key: keyof User | string
  label: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  render?: (value: any, user: User) => React.ReactNode
}

export interface UserAction {
  id: string
  label: string
  icon?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  onClick: (user: User) => void
  show?: (user: User) => boolean
}

export interface CustomField {
  key: string
  label: string
  type: 'text' | 'email' | 'select' | 'number' | 'date' | 'checkbox'
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: (value: any) => string | undefined
}

export interface UserFilter {
  search?: string
  role?: UserRole
  status?: UserStatus
  dateFrom?: Date
  dateTo?: Date
  [key: string]: any
}

export interface UserManagementState {
  users: User[]
  loading: boolean
  error: string | null
  filter: UserFilter
  selectedUsers: string[]
  currentPage: number
  pageSize: number
  totalUsers: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}