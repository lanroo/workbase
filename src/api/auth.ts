import { REST_BASE, setTokens, setStoredUser, clearTokens, getRefreshToken } from './config'

export type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
}

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export type LoginResponse = {
  access_token: string
  refresh_token: string
  message: string
  user: AuthUser
}

export type RefreshResponse = {
  access_token: string
  refresh_token: string
  message: string
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${REST_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Login failed')
  setTokens(data.access_token, data.refresh_token)
  setStoredUser(data.user)
  return data
}

export async function logout(): Promise<void> {
  const refresh = getRefreshToken()
  if (refresh) {
    try {
      await fetch(`${REST_BASE}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refresh }),
      })
    } catch (_) { }
  }
  clearTokens()
}

export async function refreshAccessToken(): Promise<RefreshResponse> {
  const refresh = getRefreshToken()
  if (!refresh) throw new Error('No refresh token')
  const res = await fetch(`${REST_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refresh }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Failed to refresh token')
  setTokens(data.access_token, data.refresh_token)
  return data
}
