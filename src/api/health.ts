import { REST_BASE } from './config'

export type HealthResponse = { status?: string; [key: string]: unknown }

export async function getHealth(): Promise<HealthResponse> {
  const res = await fetch(`${REST_BASE}/health`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((data as { error?: string }).error ?? 'Health check failed')
  return data as HealthResponse
}
