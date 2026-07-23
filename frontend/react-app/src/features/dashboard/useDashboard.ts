import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, apiDelete, apiGet, apiPost, apiPut } from '../../services/api'
import { clearStoredToken, getStoredToken } from '../../services/storage'
import type {
  AiClassificationDto,
  AiResponseDto,
  ApiResponse,
  AuthResponse,
  CreateTicketRequest,
  LoginRequest,
  PageResponse,
  RegisterRequest,
  TicketResponse,
  UpdateTicketRequest,
  UserResponse,
} from '../../types/api'
import type {
  AuthFormState,
  AuthMode,
  DashboardData,
  DashboardStats,
  TicketDraft,
  TicketInsights,
} from '../../types/dashboard'
import { authDefaults, fallbackTickets, initialDraft } from './dashboard.constants'

export type DashboardViewModel = DashboardData & {
  authMode: AuthMode
  authForm: AuthFormState
  ticketDraft: TicketDraft
  editDraft: TicketDraft
  isEditing: boolean
  assigneeId: string
  searchText: string
  statusFilter: 'all' | TicketResponse['status']
  priorityFilter: 'all' | TicketResponse['priority']
  busy: string | null
  selectedInsights?: TicketInsights
  visibleTickets: TicketResponse[]
  stats: DashboardStats
  onLogout: () => void
  onRefreshTickets: () => void
  onSyncProfile: () => void
  onAuthModeChange: (mode: AuthMode) => void
  onAuthFormChange: (next: AuthFormState) => void
  onTicketDraftChange: (next: TicketDraft) => void
  onEditDraftChange: (next: TicketDraft) => void
  onAssigneeChange: (next: string) => void
  onSearchChange: (next: string) => void
  onStatusFilterChange: (next: 'all' | TicketResponse['status']) => void
  onPriorityFilterChange: (next: 'all' | TicketResponse['priority']) => void
  onAuthSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCreateTicketSubmit: (event: FormEvent<HTMLFormElement>) => void
  onSaveTicketSubmit: (event: FormEvent<HTMLFormElement>) => void
  onStartEdit: () => void
  onCancelEdit: () => void
  onAssignTicket: () => void
  onDeleteTicket: () => void
  onSelectTicket: (ticketId: string) => void
  onAiAction: (action: 'classify' | 'summary' | 'response') => void
}

export function useDashboard(): DashboardViewModel {
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [token, setToken] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null)
  const [tickets, setTickets] = useState<TicketResponse[]>(fallbackTickets)
  const [selectedTicketId, setSelectedTicketId] = useState<string>(fallbackTickets[0].id)
  const [ticketInsights, setTicketInsights] = useState<Record<string, TicketInsights>>({})
  const [ticketDraft, setTicketDraft] = useState<TicketDraft>(initialDraft)
  const [editDraft, setEditDraft] = useState<TicketDraft>(initialDraft)
  const [isEditing, setIsEditing] = useState(false)
  const [assigneeId, setAssigneeId] = useState('')
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | TicketResponse['status']>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | TicketResponse['priority']>('all')
  const [notice, setNotice] = useState<string>('Dashboard ready. Connect to the backend to work with live data.')
  const [busy, setBusy] = useState<string | null>(null)
  const [authForm, setAuthForm] = useState<AuthFormState>(authDefaults)

  const selectedTicket = useMemo(
    () => tickets.find((ticket) => ticket.id === selectedTicketId) ?? tickets[0] ?? null,
    [tickets, selectedTicketId],
  )

  const loadCurrentUser = useCallback(
    async (activeToken?: string) => {
      const resolvedToken = activeToken ?? token
      if (!resolvedToken) {
        return
      }

      try {
        const response = await apiGet<ApiResponse<UserResponse>>('/api/users/me', resolvedToken)
        if (response.data) {
          setCurrentUser(response.data)
        }
      } catch {
        setCurrentUser(null)
      }
    },
    [token],
  )

  const loadTickets = useCallback(
    async (activeToken?: string) => {
      const resolvedToken = activeToken ?? token

      try {
        const response = await apiGet<ApiResponse<PageResponse<TicketResponse>>>(
          '/api/tickets?page=0&size=100&sortBy=createdAt&direction=desc',
          resolvedToken,
        )

        const content = response.data?.content ?? []
        if (content.length > 0) {
          setTickets(content)
          setSelectedTicketId((current) =>
            content.some((ticket) => ticket.id === current) ? current : content[0].id,
          )
          setNotice(`Loaded ${content.length} live tickets from the backend.`)
          return
        }

        setTickets([])
        setSelectedTicketId('')
        setNotice('No tickets are available yet. Create the first operational request.')
      } catch {
        setTickets(fallbackTickets)
        setSelectedTicketId(fallbackTickets[0].id)
        setNotice('Backend is not reachable right now. Displaying the enterprise preview dataset.')
      }
    },
    [token],
  )

  useEffect(() => {
    const storedToken = getStoredToken()

    if (!storedToken) {
      setNotice('Preview mode is active. Sign in or register to load live backend data.')
      return
    }

    setToken(storedToken)
    void Promise.all([loadCurrentUser(storedToken), loadTickets(storedToken)])
  }, [loadCurrentUser, loadTickets])

  const syncEditDraft = useCallback(() => {
    if (!selectedTicket) {
      setEditDraft(initialDraft)
      setAssigneeId('')
      return
    }

    setEditDraft({
      title: selectedTicket.title,
      description: selectedTicket.description,
      status: selectedTicket.status,
      priority: selectedTicket.priority,
      category: selectedTicket.category,
    })
    setAssigneeId(selectedTicket.assignedTo === 'unassigned' ? '' : selectedTicket.assignedTo)
  }, [selectedTicket])

  useEffect(() => {
    // Selecting a different ticket resets the editor back to read-only with fresh values.
    setIsEditing(false)
    syncEditDraft()
  }, [syncEditDraft])

  useEffect(() => {
    if (!selectedTicket && tickets.length > 0) {
      setSelectedTicketId(tickets[0].id)
    }
  }, [selectedTicket, tickets])

  const visibleTickets = useMemo(() => {
    const query = searchText.trim().toLowerCase()

    return tickets.filter((ticket) => {
      const matchesQuery =
        query.length === 0 ||
        [ticket.title, ticket.description, ticket.createdBy, ticket.assignedTo]
          .join(' ')
          .toLowerCase()
          .includes(query)

      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter

      return matchesQuery && matchesStatus && matchesPriority
    })
  }, [priorityFilter, searchText, statusFilter, tickets])

  const stats: DashboardStats = useMemo(() => {
    const total = tickets.length
    const open = tickets.filter((ticket) => ticket.status === 'OPEN').length
    const inProgress = tickets.filter((ticket) => ticket.status === 'IN_PROGRESS').length
    const aiProcessed = tickets.filter((ticket) => ticket.aiProcessed).length

    return { total, open, inProgress, aiProcessed }
  }, [tickets])

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy('auth')

    try {
      const response =
        authMode === 'login'
          ? await apiPost<ApiResponse<AuthResponse>, LoginRequest>('/api/auth/login', authForm.login)
          : await apiPost<ApiResponse<AuthResponse>, RegisterRequest>('/api/auth/register', authForm.register)

      if (!response.data) {
        throw new Error('Authentication succeeded but no profile data was returned.')
      }

      setToken(response.data.token)
      window.localStorage.setItem('ai-ticketing-token', response.data.token)
      setCurrentUser({
        id: currentUser?.id ?? 'pending',
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        role: response.data.role,
      })
      setNotice(`${response.message} Session established for ${response.data.email}.`)
      await loadTickets(response.data.token)
    } catch (error) {
      if (authMode === 'register' && error instanceof ApiError && error.status === 409) {
        setAuthMode('login')
        setNotice('That account already exists. Switch to login and sign in with the same credentials.')
        return
      }

      setNotice(error instanceof Error ? error.message : 'Unable to authenticate.')
    } finally {
      setBusy(null)
    }
  }

  async function handleCreateTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy('create-ticket')

    try {
      const response = await apiPost<ApiResponse<TicketResponse>, CreateTicketRequest>(
        '/api/tickets',
        {
          title: ticketDraft.title,
          description: ticketDraft.description,
          priority: ticketDraft.priority,
          category: ticketDraft.category,
        },
        token,
      )

      if (response.data) {
        const createdTicket = response.data
        setTickets((current) => [createdTicket, ...current])
        setSelectedTicketId(createdTicket.id)
        setTicketDraft(initialDraft)
        setNotice(response.message)
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Failed to create ticket.')
    } finally {
      setBusy(null)
    }
  }

  async function handleSaveTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedTicket) {
      return
    }

    setBusy('save-ticket')

    try {
      const response = await apiPut<ApiResponse<TicketResponse>, UpdateTicketRequest>(
        `/api/tickets/${selectedTicket.id}`,
        editDraft,
        token,
      )

      if (response.data) {
        setTickets((current) =>
          current.map((ticket) => (ticket.id === selectedTicket.id ? response.data! : ticket)),
        )
        setIsEditing(false)
        setNotice(response.message)
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Failed to save the ticket.')
    } finally {
      setBusy(null)
    }
  }

  async function handleAssignTicket() {
    if (!selectedTicket) {
      return
    }

    setBusy('assign-ticket')

    try {
      const fallbackAssignee = currentUser?.id ?? assigneeId.trim()

      if (!fallbackAssignee) {
        throw new Error('Provide a user id or log in to assign the ticket to yourself.')
      }

      const response = await apiPut<ApiResponse<TicketResponse>, { userId: string }>(
        `/api/tickets/${selectedTicket.id}/assign`,
        { userId: fallbackAssignee },
        token,
      )

      if (response.data) {
        setTickets((current) =>
          current.map((ticket) => (ticket.id === selectedTicket.id ? response.data! : ticket)),
        )
        setNotice(response.message)
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Failed to assign the ticket.')
    } finally {
      setBusy(null)
    }
  }

  async function handleDeleteTicket() {
    if (!selectedTicket) {
      return
    }

    const confirmed = window.confirm(`Delete ticket "${selectedTicket.title}"? This cannot be undone.`)
    if (!confirmed) {
      return
    }

    setBusy('delete-ticket')

    try {
      await apiDelete<ApiResponse<void>>(`/api/tickets/${selectedTicket.id}`, token)
      setTickets((current) => current.filter((ticket) => ticket.id !== selectedTicket.id))
      setSelectedTicketId((current) => (current === selectedTicket.id ? '' : current))
      setNotice('Ticket deleted successfully.')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Failed to delete the ticket.')
    } finally {
      setBusy(null)
    }
  }

  async function handleAiAction(action: 'classify' | 'summary' | 'response') {
    if (!selectedTicket) {
      return
    }

    setBusy(`ai-${action}`)

    try {
      if (action === 'classify') {
        const response = await apiPost<ApiResponse<AiClassificationDto>>(
          `/api/ai/tickets/${selectedTicket.id}/classify`,
          undefined,
          token,
        )

        const classification = response.data
        if (classification) {
          setTicketInsights((current) => {
            const currentInsight = current[selectedTicket.id] ?? {}

            return {
              ...current,
              [selectedTicket.id]: {
                ...currentInsight,
                classification,
              },
            }
          })
        }

        setNotice(response.message)
        return
      }

      if (action === 'summary') {
        const response = await apiPost<ApiResponse<AiResponseDto>>(
          `/api/ai/tickets/${selectedTicket.id}/summary`,
          undefined,
          token,
        )

        const aiResult = response.data
        if (aiResult) {
          setTicketInsights((current) => {
            const currentInsight = current[selectedTicket.id] ?? {}

            return {
              ...current,
              [selectedTicket.id]: {
                ...currentInsight,
                summary: aiResult.response,
              },
            }
          })
        }

        setNotice(response.message)
        return
      }

      const response = await apiPost<ApiResponse<AiResponseDto>>(
        `/api/ai/tickets/${selectedTicket.id}/response`,
        undefined,
        token,
      )

      const aiResult = response.data
      if (aiResult) {
        setTicketInsights((current) => {
          const currentInsight = current[selectedTicket.id] ?? {}

          return {
            ...current,
            [selectedTicket.id]: {
              ...currentInsight,
              response: aiResult.response,
            },
          }
        })
      }

      setNotice(response.message)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'AI processing failed.')
    } finally {
      setBusy(null)
    }
  }

  function handleStartEdit() {
    if (!selectedTicket) {
      return
    }
    syncEditDraft()
    setIsEditing(true)
  }

  function handleCancelEdit() {
    syncEditDraft()
    setIsEditing(false)
  }

  function handleLogout() {
    clearStoredToken()
    setToken(null)
    setCurrentUser(null)
    setIsEditing(false)
    setNotice('Session cleared.')
  }

  const selectedInsights = selectedTicket ? ticketInsights[selectedTicket.id] : undefined

  return {
    token,
    currentUser,
    notice,
    busy,
    authMode,
    authForm,
    ticketDraft,
    editDraft,
    isEditing,
    assigneeId,
    searchText,
    statusFilter,
    priorityFilter,
    tickets,
    visibleTickets,
    stats,
    selectedTicket,
    selectedInsights,
    onLogout: handleLogout,
    onRefreshTickets: () => void loadTickets(),
    onSyncProfile: () => void loadCurrentUser(),
    onAuthModeChange: setAuthMode,
    onAuthFormChange: setAuthForm,
    onTicketDraftChange: setTicketDraft,
    onEditDraftChange: setEditDraft,
    onAssigneeChange: setAssigneeId,
    onSearchChange: setSearchText,
    onStatusFilterChange: setStatusFilter,
    onPriorityFilterChange: setPriorityFilter,
    onAuthSubmit: handleAuthSubmit,
    onCreateTicketSubmit: handleCreateTicket,
    onSaveTicketSubmit: handleSaveTicket,
    onStartEdit: handleStartEdit,
    onCancelEdit: handleCancelEdit,
    onAssignTicket: handleAssignTicket,
    onDeleteTicket: handleDeleteTicket,
    onSelectTicket: setSelectedTicketId,
    onAiAction: handleAiAction,
  }
}
