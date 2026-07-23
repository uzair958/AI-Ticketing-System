import type { FormEvent } from 'react'
import type { TicketCategory, TicketPriority, TicketResponse, TicketStatus } from '../../types/api'
import type { TicketDraft, TicketInsights } from '../../types/dashboard'

type TicketWorkspaceProps = {
  busy: string | null
  selectedTicket: TicketResponse | null
  selectedInsights?: TicketInsights
  editDraft: TicketDraft
  isEditing: boolean
  assigneeId: string
  searchText: string
  statusFilter: 'all' | TicketStatus
  priorityFilter: 'all' | TicketPriority
  visibleTickets: TicketResponse[]
  onEditDraftChange: (next: TicketDraft) => void
  onAssigneeChange: (next: string) => void
  onSearchChange: (next: string) => void
  onStatusFilterChange: (next: 'all' | TicketStatus) => void
  onPriorityFilterChange: (next: 'all' | TicketPriority) => void
  onSaveTicketSubmit: (event: FormEvent<HTMLFormElement>) => void
  onStartEdit: () => void
  onCancelEdit: () => void
  onAssignTicket: () => void
  onDeleteTicket: () => void
  onSelectTicket: (ticketId: string) => void
  onAiAction: (action: 'classify' | 'summary' | 'response') => void
}

const formatTimestamp = (value?: string | null) => {
  if (!value) {
    return '—'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function TicketWorkspace({
  busy,
  selectedTicket,
  selectedInsights,
  editDraft,
  isEditing,
  assigneeId,
  searchText,
  statusFilter,
  priorityFilter,
  visibleTickets,
  onEditDraftChange,
  onAssigneeChange,
  onSearchChange,
  onStatusFilterChange,
  onPriorityFilterChange,
  onSaveTicketSubmit,
  onStartEdit,
  onCancelEdit,
  onAssignTicket,
  onDeleteTicket,
  onSelectTicket,
  onAiAction,
}: TicketWorkspaceProps) {
  return (
    <section className="panel ticket-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Operations</p>
          <h3>Ticket workspace</h3>
        </div>
        <div className="table-controls">
          <input
            type="search"
            placeholder="Search tickets"
            value={searchText}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          <select value={statusFilter} onChange={(event) => onStatusFilterChange(event.target.value as 'all' | TicketStatus)}>
            <option value="all">All statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(event) => onPriorityFilterChange(event.target.value as 'all' | TicketPriority)}
          >
            <option value="all">All priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>

      <div className="ticket-grid">
        <div className="ticket-list">
          {visibleTickets.length === 0 ? (
            <div className="empty-state">
              <strong>No tickets matched the current filters.</strong>
              <p>Clear the filters or create a new request to populate the workspace.</p>
            </div>
          ) : (
            visibleTickets.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                className={ticket.id === selectedTicket?.id ? 'ticket-row active' : 'ticket-row'}
                onClick={() => onSelectTicket(ticket.id)}
              >
                <div className="ticket-row-top">
                  <strong>{ticket.title}</strong>
                  <span className={`status-chip ${ticket.status.toLowerCase()}`}>{ticket.status.replace('_', ' ')}</span>
                </div>
                <p>{ticket.description}</p>
                <div className="ticket-row-meta">
                  <span>{ticket.priority}</span>
                  <span>{ticket.category}</span>
                  <span>{formatTimestamp(ticket.createdAt)}</span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="ticket-detail">
          {selectedTicket ? (
            <>
              <div className="ticket-detail-head">
                <div>
                  <p className="eyebrow">Selected ticket</p>
                  <h4>{selectedTicket.title}</h4>
                </div>
                <span className={`status-chip ${selectedTicket.status.toLowerCase()}`}>
                  {selectedTicket.status.replace('_', ' ')}
                </span>
              </div>

              <div className="ticket-detail-meta">
                <article>
                  <span>Created by</span>
                  <strong>{selectedTicket.createdBy}</strong>
                </article>
                <article>
                  <span>Assigned to</span>
                  <strong>{selectedTicket.assignedTo}</strong>
                </article>
                <article>
                  <span>AI confidence</span>
                  <strong>{selectedTicket.aiConfidence ? `${Math.round(selectedTicket.aiConfidence * 100)}%` : 'Pending'}</strong>
                </article>
                <article>
                  <span>Updated</span>
                  <strong>{formatTimestamp(selectedTicket.updatedAt)}</strong>
                </article>
              </div>

              {isEditing ? (
                <form className="form-grid ticket-editor" onSubmit={onSaveTicketSubmit}>
                  <label className="full-span">
                    Title
                    <input
                      type="text"
                      value={editDraft.title}
                      onChange={(event) => onEditDraftChange({ ...editDraft, title: event.target.value })}
                    />
                  </label>
                  <label className="full-span">
                    Description
                    <textarea
                      rows={6}
                      value={editDraft.description}
                      onChange={(event) => onEditDraftChange({ ...editDraft, description: event.target.value })}
                    />
                  </label>
                  <label>
                    Status
                    <select
                      value={editDraft.status}
                      onChange={(event) =>
                        onEditDraftChange({
                          ...editDraft,
                          status: event.target.value as TicketStatus,
                        })
                      }
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </label>
                  <label>
                    Priority
                    <select
                      value={editDraft.priority}
                      onChange={(event) =>
                        onEditDraftChange({
                          ...editDraft,
                          priority: event.target.value as TicketPriority,
                        })
                      }
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </label>
                  <label>
                    Category
                    <select
                      value={editDraft.category}
                      onChange={(event) =>
                        onEditDraftChange({
                          ...editDraft,
                          category: event.target.value as TicketCategory,
                        })
                      }
                    >
                      <option value="SOFTWARE">Software</option>
                      <option value="HARDWARE">Hardware</option>
                      <option value="NETWORK">Network</option>
                      <option value="ACCOUNT">Account</option>
                      <option value="DATABASE">Database</option>
                      <option value="SECURITY">Security</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </label>

                  <div className="action-row full-span">
                    <button type="submit" className="primary-button" disabled={busy === 'save-ticket'}>
                      {busy === 'save-ticket' ? 'Saving…' : 'Save changes'}
                    </button>
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={onCancelEdit}
                      disabled={busy === 'save-ticket'}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="ticket-readonly">
                  <div className="insight-block">
                    <strong>Description</strong>
                    <p>{selectedTicket.description || 'No description provided.'}</p>
                  </div>
                  <div className="ticket-tags">
                    <span className="ticket-tag">Priority · {selectedTicket.priority}</span>
                    <span className="ticket-tag">Category · {selectedTicket.category}</span>
                    <span className="ticket-tag">Status · {selectedTicket.status.replace('_', ' ')}</span>
                  </div>
                  <button type="button" className="primary-button" onClick={onStartEdit}>
                    Edit ticket
                  </button>
                </div>
              )}

              <div className="action-row ai-actions">
                <button type="button" className="secondary-button" onClick={() => onAiAction('classify')} disabled={busy?.startsWith('ai-')}>
                  Classify with AI
                </button>
                <button type="button" className="secondary-button" onClick={() => onAiAction('summary')} disabled={busy?.startsWith('ai-')}>
                  Generate summary
                </button>
                <button type="button" className="secondary-button" onClick={() => onAiAction('response')} disabled={busy?.startsWith('ai-')}>
                  Draft response
                </button>
              </div>

              <div className="ticket-split">
                <article className="insight-card">
                  <span className="eyebrow">AI classification</span>
                  {selectedInsights?.classification ? (
                    <>
                      <strong>{selectedInsights.classification.category}</strong>
                      <p>Priority: {selectedInsights.classification.priority}</p>
                      <p>Severity: {selectedInsights.classification.severity}</p>
                      <p>Department: {selectedInsights.classification.suggestedDepartment}</p>
                      <p>Confidence: {Math.round(selectedInsights.classification.confidence * 100)}%</p>
                    </>
                  ) : (
                    <p>Run classification to populate the AI service recommendation panel.</p>
                  )}
                </article>

                <article className="insight-card">
                  <span className="eyebrow">AI outputs</span>
                  <div className="insight-block">
                    <strong>Summary</strong>
                    <p>{selectedInsights?.summary ?? selectedTicket.aiSummary ?? 'No summary has been generated yet.'}</p>
                  </div>
                  <div className="insight-block">
                    <strong>Suggested reply</strong>
                    <p>{selectedInsights?.response ?? 'Use Draft response to generate a formal message for the requester.'}</p>
                  </div>
                </article>
              </div>

              <div className="inline-actions">
                <label>
                  Assign to user id
                  <input
                    type="text"
                    value={assigneeId}
                    onChange={(event) => onAssigneeChange(event.target.value)}
                    placeholder="UUID of the target user"
                  />
                </label>
                <button type="button" className="secondary-button" onClick={onAssignTicket} disabled={busy === 'assign-ticket'}>
                  {busy === 'assign-ticket' ? 'Assigning…' : 'Assign ticket'}
                </button>
                <button type="button" className="danger-button" onClick={onDeleteTicket} disabled={busy === 'delete-ticket'}>
                  Delete ticket
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state large">
              <strong>No ticket selected</strong>
              <p>Create a ticket or load live data from the backend to continue.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
