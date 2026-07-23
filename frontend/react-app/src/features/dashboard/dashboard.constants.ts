import type { AuthFormState, TicketDraft } from '../../types/dashboard'
import type { TicketResponse } from '../../types/api'

export const fallbackTickets: TicketResponse[] = [
  {
    id: '7ef0d7dd-11a0-4b9d-8b61-0af0ff0fd111',
    title: 'Email access blocked for finance team',
    description:
      'Finance users cannot access their mailbox after the weekend security policy update.',
    status: 'OPEN',
    priority: 'HIGH',
    category: 'ACCOUNT',
    createdBy: 'system@aiticketing.local',
    assignedTo: 'unassigned',
    aiSummary: 'Mailbox access disruption affecting finance operations.',
    aiSuggestedCategory: 'ACCOUNT',
    aiConfidence: 0.91,
    aiProcessed: true,
    createdAt: '2026-07-22T09:15:00',
    updatedAt: '2026-07-22T10:05:00',
  },
  {
    id: 'f3d2c76d-08be-44ef-9f49-75d86dd7e333',
    title: 'VPN latency during branch peak hours',
    description:
      'Remote branches report noticeable delay when connecting to internal systems between 9 and 11 AM.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    category: 'NETWORK',
    createdBy: 'it.operations@aiticketing.local',
    assignedTo: 'network.team@aiticketing.local',
    aiSummary: 'Intermittent network performance issue during peak usage window.',
    aiSuggestedCategory: 'NETWORK',
    aiConfidence: 0.86,
    aiProcessed: true,
    createdAt: '2026-07-21T14:30:00',
    updatedAt: '2026-07-22T08:40:00',
  },
  {
    id: '2a0b83e0-b181-4a24-9bde-61d3d92f6f51',
    title: 'New hire laptop enrollment failed',
    description:
      'Device provisioning stops at compliance checks when onboarding the new design cohort.',
    status: 'RESOLVED',
    priority: 'CRITICAL',
    category: 'HARDWARE',
    createdBy: 'service.desk@aiticketing.local',
    assignedTo: 'desktop.support@aiticketing.local',
    aiSummary: 'Provisioning workflow blocked by endpoint compliance enforcement.',
    aiSuggestedCategory: 'HARDWARE',
    aiConfidence: 0.78,
    aiProcessed: true,
    createdAt: '2026-07-20T11:05:00',
    updatedAt: '2026-07-21T16:10:00',
  },
]

export const initialDraft: TicketDraft = {
  title: '',
  description: '',
  status: 'OPEN',
  priority: 'MEDIUM',
  category: 'SOFTWARE',
}

export const authDefaults: AuthFormState = {
  login: {
    email: 'admin@aiticketing.local',
    password: 'password123',
  },
  register: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  },
}
