import type { FormEvent } from 'react'
import type { TicketDraft } from '../../types/dashboard'
import type { TicketCategory, TicketPriority } from '../../types/api'

type TicketCreatePanelProps = {
  busy: string | null
  draft: TicketDraft
  onDraftChange: (next: TicketDraft) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function TicketCreatePanel({ busy, draft, onDraftChange, onSubmit }: TicketCreatePanelProps) {
  return (
    <section className="panel form-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">New request</p>
          <h3>Create a ticket</h3>
        </div>
        <span className="helper-pill">Requires an authenticated session</span>
      </div>

      <form className="form-grid" onSubmit={onSubmit}>
        <label className="full-span">
          Title
          <input
            type="text"
            value={draft.title}
            onChange={(event) => onDraftChange({ ...draft, title: event.target.value })}
            required
          />
        </label>
        <label className="full-span">
          Description
          <textarea
            rows={5}
            value={draft.description}
            onChange={(event) => onDraftChange({ ...draft, description: event.target.value })}
            required
          />
        </label>
        <label>
          Priority
          <select
            value={draft.priority}
            onChange={(event) =>
              onDraftChange({
                ...draft,
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
            value={draft.category}
            onChange={(event) =>
              onDraftChange({
                ...draft,
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

        <button type="submit" className="primary-button full-span" disabled={busy === 'create-ticket'}>
          {busy === 'create-ticket' ? 'Submitting…' : 'Create service ticket'}
        </button>
      </form>
    </section>
  )
}
