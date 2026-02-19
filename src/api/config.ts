const raw = import.meta.env.VITE_API_URL
const base =
  typeof raw === 'string' && raw.trim() !== '' ? raw.replace(/\/$/, '').trim() : ''

export const API_BASE = base
export const REST_BASE = base ? `${API_BASE}/api` : '/api'
export const GRAPHQL_URI = base ? `${API_BASE}/graphql` : '/graphql'

export function getAccessToken(): string | null {
  return localStorage.getItem('access_token')
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('refresh_token')
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
}

export function clearTokens() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
}

export function getStoredUser(): { id: string; name: string; email: string; role: string } | null {
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try {
    return JSON.parse(raw) as { id: string; name: string; email: string; role: string }
  } catch {
    return null
  }
}

export function setStoredUser(user: { id: string; name: string; email: string; role: string }) {
  localStorage.setItem('user', JSON.stringify(user))
}
