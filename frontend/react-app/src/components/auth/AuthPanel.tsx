import type { FormEvent } from 'react'
import type { AuthFormState, AuthMode } from '../../types/dashboard'

type AuthPanelProps = {
  authMode: AuthMode
  authForm: AuthFormState
  busy: string | null
  onModeChange: (mode: AuthMode) => void
  onAuthFormChange: (next: AuthFormState) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function AuthPanel({ authMode, authForm, busy, onModeChange, onAuthFormChange, onSubmit }: AuthPanelProps) {
  return (
    <section className="panel form-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Access</p>
          <h3>{authMode === 'login' ? 'Welcome back' : 'Create your account'}</h3>
        </div>
        <div className="segmented-control">
          <button
            type="button"
            className={authMode === 'login' ? 'segmented active' : 'segmented'}
            onClick={() => onModeChange('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={authMode === 'register' ? 'segmented active' : 'segmented'}
            onClick={() => onModeChange('register')}
          >
            Register
          </button>
        </div>
      </div>

      <form className="form-grid" onSubmit={onSubmit}>
        {authMode === 'register' ? (
          <>
            <label>
              First name
              <input
                type="text"
                value={authForm.register.firstName}
                onChange={(event) =>
                  onAuthFormChange({
                    ...authForm,
                    register: { ...authForm.register, firstName: event.target.value },
                  })
                }
                required
              />
            </label>
            <label>
              Last name
              <input
                type="text"
                value={authForm.register.lastName}
                onChange={(event) =>
                  onAuthFormChange({
                    ...authForm,
                    register: { ...authForm.register, lastName: event.target.value },
                  })
                }
                required
              />
            </label>
            <label className="full-span">
              Email address
              <input
                type="email"
                value={authForm.register.email}
                onChange={(event) =>
                  onAuthFormChange({
                    ...authForm,
                    register: { ...authForm.register, email: event.target.value },
                  })
                }
                required
              />
            </label>
            <label className="full-span">
              Password
              <input
                type="password"
                value={authForm.register.password}
                onChange={(event) =>
                  onAuthFormChange({
                    ...authForm,
                    register: { ...authForm.register, password: event.target.value },
                  })
                }
                required
                minLength={8}
              />
            </label>
          </>
        ) : (
          <>
            <label className="full-span">
              Email address
              <input
                type="email"
                value={authForm.login.email}
                onChange={(event) =>
                  onAuthFormChange({
                    ...authForm,
                    login: { ...authForm.login, email: event.target.value },
                  })
                }
                required
              />
            </label>
            <label className="full-span">
              Password
              <input
                type="password"
                value={authForm.login.password}
                onChange={(event) =>
                  onAuthFormChange({
                    ...authForm,
                    login: { ...authForm.login, password: event.target.value },
                  })
                }
                required
              />
            </label>
          </>
        )}

        <button type="submit" className="primary-button full-span" disabled={busy === 'auth'}>
          {busy === 'auth' ? 'Processing…' : authMode === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </form>
    </section>
  )
}
