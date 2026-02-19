import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/" replace />

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-zinc-100">
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_50%_50%_at_0%_100%,rgba(124,58,237,0.12),transparent),radial-gradient(ellipse_40%_40%_at_100%_100%,rgba(34,197,94,0.1),transparent)]"
        aria-hidden
      />

      <div className="w-full max-w-[720px] bg-white rounded-2xl sm:rounded-[20px] p-6 sm:p-10 shadow-sm relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div className="flex justify-center items-center max-md:max-h-36 md:min-h-0 order-2 md:order-1" aria-hidden>
            <svg
              className="w-full max-w-[280px] h-auto"
              viewBox="0 0 260 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="40" y="30" width="120" height="85" rx="6" fill="#86efac" stroke="#4ade80" strokeWidth="2" />
              <rect x="55" y="45" width="90" height="55" rx="4" fill="#f0fdf4" />
              <circle cx="100" cy="65" r="12" fill="#fbcfe8" stroke="#f9a8d4" strokeWidth="1" />
              <path d="M88 85 Q100 95 112 85" stroke="#f9a8d4" strokeWidth="2" fill="none" strokeLinecap="round" />
              <rect x="125" y="75" width="28" height="28" rx="4" fill="#fde047" stroke="#eab308" strokeWidth="1.5" />
              <path d="M131 75 V68 A7 7 0 0 1 145 68 V75" stroke="#eab308" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M170 42 L200 58 L200 96 L170 118 L140 96 L140 58 Z" fill="#7c3aed" stroke="#6d28d9" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M157 77 L166 86 L183 72" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <line x1="158" y1="75" x2="138" y2="88" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="5 4" />
              <line x1="168" y1="95" x2="195" y2="115" stroke="#d1d5db" strokeWidth="1.5" strokeDasharray="5 4" />
              <circle cx="55" cy="25" r="5" fill="#ef4444" />
              <circle cx="205" cy="35" r="6" fill="#3b82f6" />
              <circle cx="215" cy="150" r="4" fill="#9ca3af" />
              <rect x="195" y="125" width="10" height="10" fill="#fde047" transform="rotate(45 200 130)" rx="1" />
            </svg>
          </div>

          <div className="min-w-0 order-1 md:order-2">
            <h1 className="text-[22px] font-semibold text-zinc-900 mb-6">
              <span className="relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-0.5 after:bg-gradient-to-r after:from-violet-600 after:to-indigo-600 after:rounded">
                Sign in
              </span>
              {' '}to your account
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <div
                  className="flex items-center gap-2.5 py-2.5 px-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
                  role="alert"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="shrink-0">
                    <path
                      fillRule="evenodd"
                      d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zM7 4a1 1 0 0 1 2 0v4a1 1 0 1 1-2 0V4zm1 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              )}
              <div className="relative">
                <div className="relative flex items-center">
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    autoFocus
                    placeholder="email@example.com"
                    disabled={loading}
                    className="w-full py-3 pl-3.5 pr-11 text-[15px] text-zinc-900 bg-white border border-zinc-200 rounded-[10px] placeholder:text-zinc-400 focus:outline-none focus:border-violet-600 focus:ring-[3px] focus:ring-violet-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="relative">
                <div className="relative flex items-center">
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Your password here"
                    disabled={loading}
                    className="w-full py-3 pl-3.5 pr-11 text-[15px] text-zinc-900 bg-white border border-zinc-200 rounded-[10px] placeholder:text-zinc-400 focus:outline-none focus:border-violet-600 focus:ring-[3px] focus:ring-violet-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 mt-1 text-[15px] font-semibold tracking-wide text-white bg-violet-600 rounded-[10px] flex items-center justify-center gap-2.5 hover:bg-violet-700 disabled:opacity-85 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <span className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden />
                    Signing in…
                  </>
                ) : (
                  'LOGIN'
                )}
              </button>
              <div className="flex flex-col gap-2 mt-1 items-center text-center">
                <a href="#" className="text-sm text-zinc-500 hover:text-zinc-700 hover:underline">
                  Forgot your password?
                </a>
                <a href="#" className="text-sm text-blue-500 hover:text-blue-600 hover:underline">
                  Need help signing in
                </a>
              </div>
            </form>

            <footer className="mt-7 pt-5 border-t border-zinc-100 text-xs text-zinc-500 text-center">
              <a href="#" className="hover:text-zinc-700 hover:underline">
                Terms of use
              </a>
              <span className="mx-1.5 text-zinc-300">·</span>
              <a href="#" className="hover:text-zinc-700 hover:underline">
                Privacy policy
              </a>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
