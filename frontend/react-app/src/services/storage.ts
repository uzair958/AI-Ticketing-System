export function getStoredToken() {
  return window.localStorage.getItem('ai-ticketing-token')
}

export function clearStoredToken() {
  window.localStorage.removeItem('ai-ticketing-token')
}
