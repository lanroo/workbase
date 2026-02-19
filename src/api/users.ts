import { REST_BASE, getAccessToken } from './config'

export type ApiUser = {
  id: string
  name: string
  email: string
  role?: string
  [key: string]: unknown
}

export async function getUsers(): Promise<ApiUser[]> {
  const token = getAccessToken()
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${REST_BASE}/users`, { headers })
  if (res.status === 404) return []
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((data as { error?: string }).error ?? 'Failed to load users')
  return Array.isArray(data) ? data : (data as { data?: ApiUser[] }).data ?? []
}

export type CreateUserInput = {
  email: string
  name: string
  password: string
  role: 'admin' | 'user'
}

export type CreateUserResponse = {
  id: string
  name: string
  email: string
  role: string
  message?: string
}

export async function createUser(input: CreateUserInput): Promise<CreateUserResponse> {
  const token = getAccessToken()
  if (!token) throw new Error('Unauthorized')
  const res = await fetch(`${REST_BASE}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = (data as { error?: string; message?: string }).error ?? (data as { message?: string }).message ?? 'Failed to create user'
    throw new Error(msg)
  }
  return data as CreateUserResponse
}

export type UpdateUserInput = {
  name?: string
  email?: string
  password?: string
  role?: 'admin' | 'user'
}

export async function updateUser(id: string, input: UpdateUserInput): Promise<CreateUserResponse> {
  const token = getAccessToken()
  if (!token) throw new Error('Unauthorized')
  const res = await fetch(`${REST_BASE}/users/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(input),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = (data as { error?: string; message?: string }).error ?? (data as { message?: string }).message ?? 'Failed to update user'
    throw new Error(msg)
  }
  return data as CreateUserResponse
}

export async function deleteUser(id: string): Promise<void> {
  const token = getAccessToken()
  if (!token) throw new Error('Unauthorized')
  const res = await fetch(`${REST_BASE}/users/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    const msg = (data as { error?: string; message?: string }).error ?? (data as { message?: string }).message ?? 'Failed to delete user'
    throw new Error(msg)
  }
}
