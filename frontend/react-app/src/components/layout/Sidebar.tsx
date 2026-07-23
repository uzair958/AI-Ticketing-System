type SidebarProps = {
  token: string | null
  notice: string
  currentUserLabel: string
  currentUserRole: string
  onLogout: () => void
}

export function Sidebar({ token, notice, currentUserLabel, currentUserRole, onLogout }: SidebarProps) {
  return (
    <aside className="sidebar panel">
      <div className="brand-lockup">
        <div className="brand-mark">AT</div>
        <div>
          <p className="eyebrow">AI Ticketing</p>
          <h1>Command Center</h1>
        </div>
      </div>

      <p className="sidebar-copy">
        Secure service operations for authenticated support teams, with AI-assisted triage and controlled ticket
        governance.
      </p>

      <div className="nav-group">
        <button type="button" className="nav-pill active">
          Overview
        </button>
        <button type="button" className="nav-pill">
          Tickets
        </button>
        <button type="button" className="nav-pill">
          AI Console
        </button>
        <button type="button" className="nav-pill">
          Access Control
        </button>
      </div>

      <div className="status-stack">
        <div className="status-card">
          <span className="status-label">Backend</span>
          <strong>{token ? 'Live session' : 'Preview mode'}</strong>
          <p>{notice}</p>
        </div>
        <div className="status-card">
          <span className="status-label">Session</span>
          <strong>{currentUserLabel}</strong>
          <p>{currentUserRole}</p>
        </div>
      </div>

      <button type="button" className="ghost-button" onClick={onLogout} disabled={!token}>
        Sign out
      </button>
    </aside>
  )
}
