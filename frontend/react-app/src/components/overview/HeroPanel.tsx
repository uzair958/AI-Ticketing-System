type HeroPanelProps = {
  stats: {
    total: number
    open: number
    inProgress: number
    aiProcessed: number
  }
  onRefreshTickets: () => void
  onSyncProfile: () => void
}

export function HeroPanel({ stats, onRefreshTickets, onSyncProfile }: HeroPanelProps) {
  return (
    <section className="hero panel">
      <div className="hero-copy">
        <p className="eyebrow">Operational visibility</p>
        <h2>Service desk operations with the structure expected in enterprise support.</h2>
        <p>
          Authenticate, review active requests, and use AI-assisted actions without leaving the operational console.
        </p>

        <div className="hero-actions">
          <button type="button" className="primary-button" onClick={onRefreshTickets}>
            Refresh tickets
          </button>
          <button type="button" className="secondary-button" onClick={onSyncProfile}>
            Sync profile
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <article className="metric-card">
          <span>Total tickets</span>
          <strong>{stats.total}</strong>
          <p>All loaded records</p>
        </article>
        <article className="metric-card">
          <span>Open</span>
          <strong>{stats.open}</strong>
          <p>Awaiting action</p>
        </article>
        <article className="metric-card">
          <span>In progress</span>
          <strong>{stats.inProgress}</strong>
          <p>Assigned and moving</p>
        </article>
        <article className="metric-card">
          <span>AI processed</span>
          <strong>{stats.aiProcessed}</strong>
          <p>Summaries or classification available</p>
        </article>
      </div>
    </section>
  )
}
