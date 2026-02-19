import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { AuthUser, UserRole } from '@/api/auth'
import * as authApi from '@/api/auth'
import { getAccessToken, getStoredUser } from '@/api/config'

type AuthState = {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
}

type AuthContextValue = AuthState & {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const u = getStoredUser()
    if (!u) return null
    const role: UserRole = u.role === 'admin' ? UserRole.Admin : UserRole.User
    return { ...u, role: role }
  })
  const [loading, setLoading] = useState(true)

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login(email, password)
    setUser(data.user)
  }, [])

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
  }, [])

  useEffect(() => {
    if (!getAccessToken() && getStoredUser()) {
      setUser(null)
      setLoading(false)
      return
    }
    setLoading(false)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === UserRole.Admin,
      login,
      logout,
    }),
    [user, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
