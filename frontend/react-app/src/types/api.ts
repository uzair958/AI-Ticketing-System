export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type TicketCategory =
  | 'SOFTWARE'
  | 'HARDWARE'
  | 'NETWORK'
  | 'ACCOUNT'
  | 'DATABASE'
  | 'SECURITY'
  | 'OTHER'

export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T | null
  timestamp: string
}

export type PageResponse<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export type AuthResponse = {
  token: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export type UserResponse = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

export type TicketResponse = {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: TicketCategory
  createdBy: string
  assignedTo: string
  aiSummary?: string | null
  aiSuggestedCategory?: string | null
  aiConfidence?: number | null
  aiProcessed?: boolean | null
  createdAt?: string | null
  updatedAt?: string | null
}

export type CreateTicketRequest = {
  title: string
  description: string
  priority: TicketPriority
  category: TicketCategory
}

export type UpdateTicketRequest = {
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: TicketCategory
}

export type AiClassificationDto = {
  category: TicketCategory
  priority: TicketPriority
  severity: string
  suggestedDepartment: string
  confidence: number
}

export type AiResponseDto = {
  response: string
}
