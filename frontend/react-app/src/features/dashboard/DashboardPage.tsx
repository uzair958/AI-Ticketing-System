import { AuthPanel } from '../../components/auth/AuthPanel'
import { HeroPanel } from '../../components/overview/HeroPanel'
import { Sidebar } from '../../components/layout/Sidebar'
import { TicketCreatePanel } from '../../components/tickets/TicketCreatePanel'
import { TicketWorkspace } from '../../components/tickets/TicketWorkspace'
import type { DashboardViewModel } from './useDashboard'

type DashboardPageProps = DashboardViewModel

export function DashboardPage({
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
  visibleTickets,
  stats,
  selectedTicket,
  selectedInsights,
  onLogout,
  onRefreshTickets,
  onSyncProfile,
  onAuthModeChange,
  onAuthFormChange,
  onTicketDraftChange,
  onEditDraftChange,
  onAssigneeChange,
  onSearchChange,
  onStatusFilterChange,
  onPriorityFilterChange,
  onAuthSubmit,
  onCreateTicketSubmit,
  onSaveTicketSubmit,
  onStartEdit,
  onCancelEdit,
  onAssignTicket,
  onDeleteTicket,
  onSelectTicket,
  onAiAction,
}: DashboardPageProps) {
  if (!token) {
    return (
      <div className="auth-shell">
        <section className="auth-hero panel">
          <div className="auth-hero-copy">
            <p className="eyebrow">AI Ticketing</p>
            <h1>Access the service desk command center.</h1>
            <p>
              Sign in with an existing account or create a new one, then continue into ticket operations, AI triage,
              and the live support workspace.
            </p>

            <div className="auth-benefits">
              <span>Secure session handling</span>
              <span>Ticket lifecycle control</span>
              <span>AI-assisted operations</span>
            </div>
          </div>

          <AuthPanel
            authMode={authMode}
            authForm={authForm}
            busy={busy}
            onModeChange={onAuthModeChange}
            onAuthFormChange={onAuthFormChange}
            onSubmit={onAuthSubmit}
          />
        </section>
      </div>
    )
  }

  const currentUserLabel = currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Not signed in'
  const currentUserRole = currentUser?.role ?? 'Sign in to unlock ticket actions and user profile context.'

  return (
    <div className="app-shell">
      <Sidebar
        token={token}
        notice={notice}
        currentUserLabel={currentUserLabel}
        currentUserRole={currentUserRole}
        onLogout={onLogout}
      />

      <main className="workspace">
        <HeroPanel stats={stats} onRefreshTickets={onRefreshTickets} onSyncProfile={onSyncProfile} />

        <section className="content-grid">
          <div className="column-stack">
            <TicketCreatePanel
              busy={busy}
              draft={ticketDraft}
              onDraftChange={onTicketDraftChange}
              onSubmit={onCreateTicketSubmit}
            />
          </div>

          <TicketWorkspace
            busy={busy}
            selectedTicket={selectedTicket}
            selectedInsights={selectedInsights}
            editDraft={editDraft}
            isEditing={isEditing}
            assigneeId={assigneeId}
            searchText={searchText}
            statusFilter={statusFilter}
            priorityFilter={priorityFilter}
            visibleTickets={visibleTickets}
            onEditDraftChange={onEditDraftChange}
            onAssigneeChange={onAssigneeChange}
            onSearchChange={onSearchChange}
            onStatusFilterChange={onStatusFilterChange}
            onPriorityFilterChange={onPriorityFilterChange}
            onSaveTicketSubmit={onSaveTicketSubmit}
            onStartEdit={onStartEdit}
            onCancelEdit={onCancelEdit}
            onAssignTicket={onAssignTicket}
            onDeleteTicket={onDeleteTicket}
            onSelectTicket={onSelectTicket}
            onAiAction={onAiAction}
          />
        </section>
      </main>
    </div>
  )
}
