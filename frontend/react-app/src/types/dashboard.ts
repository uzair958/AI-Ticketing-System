import type {
  AiClassificationDto,
  TicketCategory,
  TicketPriority,
  TicketResponse,
  TicketStatus,
  UserResponse,
} from './api'
import type { FormEvent } from 'react'

export type AuthMode = 'login' | 'register'

export type TicketInsights = {
  classification?: AiClassificationDto
  summary?: string
  response?: string
}

export type TicketDraft = {
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: TicketCategory
}

export type AuthFormState = {
  login: {
    email: string
    password: string
  }
  register: {
    firstName: string
    lastName: string
    email: string
    password: string
  }
}

export type DashboardStats = {
  total: number
  open: number
  inProgress: number
  aiProcessed: number
}

export type DashboardProps = {
  token: string | null
  currentUser: UserResponse | null
  notice: string
  busy: string | null
  authMode: AuthMode
  authForm: AuthFormState
  ticketDraft: TicketDraft
  editDraft: TicketDraft
  assigneeId: string
  searchText: string
  statusFilter: 'all' | TicketStatus
  priorityFilter: 'all' | TicketPriority
  tickets: TicketResponse[]
  visibleTickets: TicketResponse[]
  stats: DashboardStats
  selectedTicket: TicketResponse | null
  selectedInsights?: TicketInsights
  onLogout: () => void
  onRefreshTickets: () => void
  onSyncProfile: () => void
  onAuthModeChange: (mode: AuthMode) => void
  onAuthFormChange: (next: AuthFormState) => void
  onTicketDraftChange: (next: TicketDraft) => void
  onEditDraftChange: (next: TicketDraft) => void
  onAssigneeChange: (next: string) => void
  onSearchChange: (next: string) => void
  onStatusFilterChange: (next: 'all' | TicketStatus) => void
  onPriorityFilterChange: (next: 'all' | TicketPriority) => void
  onAuthSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCreateTicketSubmit: (event: FormEvent<HTMLFormElement>) => void
  onSaveTicketSubmit: (event: FormEvent<HTMLFormElement>) => void
  onAssignTicket: () => void
  onDeleteTicket: () => void
  onSelectTicket: (ticketId: string) => void
  onAiAction: (action: 'classify' | 'summary' | 'response') => void
}

export type DashboardData = Omit<DashboardProps, 'onAuthModeChange' | 'onAuthFormChange' | 'onTicketDraftChange' | 'onEditDraftChange' | 'onAssigneeChange' | 'onSearchChange' | 'onStatusFilterChange' | 'onPriorityFilterChange' | 'onAuthSubmit' | 'onCreateTicketSubmit' | 'onSaveTicketSubmit' | 'onAssignTicket' | 'onDeleteTicket' | 'onSelectTicket' | 'onAiAction'>
