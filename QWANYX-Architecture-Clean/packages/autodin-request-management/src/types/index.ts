// Type pour une demande de pièce
export interface PartRequest {
  _id?: string
  id?: string
  userId: string
  userEmail: string
  userName?: string
  title: string
  description: string
  partName: string
  carBrand: string
  carModel: string
  year?: string
  status: RequestStatus
  createdAt?: Date | string
  updatedAt?: Date | string
  proposals?: Proposal[]
  images?: string[]
  urgency?: 'low' | 'medium' | 'high'
}

// Type pour une proposition
export interface Proposal {
  _id?: string
  id?: string
  requestId: string
  professionalId: string
  professionalName: string
  professionalEmail: string
  price: number
  description: string
  availability: string
  condition: 'new' | 'used' | 'refurbished'
  warranty?: string
  createdAt?: Date | string
  status: ProposalStatus
}

export type RequestStatus = 'open' | 'closed' | 'fulfilled' | 'cancelled'

export type ProposalStatus = 'pending' | 'accepted' | 'rejected'

export interface RequestManagementConfig {
  apiUrl?: string
  workspace?: string
  userRole?: string // 'particulier' | 'professionnel' | 'admin'
  columns?: RequestTableColumn[]
  actions?: RequestAction[]
  allowAdd?: boolean
  allowEdit?: boolean
  allowDelete?: boolean
  allowProposal?: boolean
  customFields?: CustomField[]
  onRequestSelect?: (request: PartRequest) => void
  onRequestAdd?: (request: Partial<PartRequest>) => Promise<void>
  onRequestEdit?: (request: PartRequest) => Promise<void>
  onRequestDelete?: (requestId: string) => Promise<void>
  onProposalAdd?: (proposal: Partial<Proposal>) => Promise<void>
  fetchRequests?: () => Promise<PartRequest[]>
}

export interface RequestTableColumn {
  key: keyof PartRequest | string
  label: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  render?: (value: any, request: PartRequest) => React.ReactNode
}

export interface RequestAction {
  id: string
  label: string
  icon?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  onClick: (request: PartRequest) => void
  show?: (request: PartRequest, userRole?: string) => boolean
}

export interface CustomField {
  key: string
  label: string
  type: 'text' | 'email' | 'select' | 'number' | 'date' | 'checkbox'
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: (value: any) => string | undefined
}

export interface RequestFilter {
  search?: string
  status?: RequestStatus
  urgency?: 'low' | 'medium' | 'high'
  carBrand?: string
  carModel?: string
  dateFrom?: Date
  dateTo?: Date
  [key: string]: any
}

export interface RequestManagementState {
  requests: PartRequest[]
  loading: boolean
  error: string | null
  filter: RequestFilter
  selectedRequests: string[]
  currentPage: number
  pageSize: number
  totalRequests: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}