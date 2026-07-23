const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? 'http://localhost:8080'
const API_BASE_URL = rawBaseUrl.endsWith('/') ? rawBaseUrl.slice(0, -1) : rawBaseUrl

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function buildUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (API_BASE_URL.endsWith('/api') && normalizedPath.startsWith('/api/')) {
    return `${API_BASE_URL}${normalizedPath.slice(4)}`
  }

  return `${API_BASE_URL}${normalizedPath}`
}

function getToken(explicitToken?: string | null) {
  return explicitToken ?? window.localStorage.getItem('ai-ticketing-token') ?? ''
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(options.headers)
  const authToken = getToken(token)

  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`)
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
  })

  const payload = (await response.json().catch(() => null)) as T | null

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload && typeof (payload as { message?: unknown }).message === 'string'
        ? (payload as { message: string }).message
        : `Request failed with status ${response.status}`

    throw new ApiError(message, response.status)
  }

  return payload as T
}

export function setStoredToken(token: string) {
  if (!token) {
    return
  }

  window.localStorage.setItem('ai-ticketing-token', token)
}

export function apiGet<T>(path: string, token?: string | null) {
  return request<T>(path, { method: 'GET' }, token)
}

export function apiPost<T, B = undefined>(path: string, body?: B, token?: string | null) {
  return request<T>(
    path,
    {
      method: 'POST',
      body: body === undefined ? undefined : JSON.stringify(body),
    },
    token,
  )
}

export function apiPut<T, B = undefined>(path: string, body?: B, token?: string | null) {
  return request<T>(
    path,
    {
      method: 'PUT',
      body: body === undefined ? undefined : JSON.stringify(body),
    },
    token,
  )
}

export function apiDelete<T>(path: string, token?: string | null) {
  return request<T>(path, { method: 'DELETE' }, token)
}
