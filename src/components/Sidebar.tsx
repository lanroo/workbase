import { NavLink } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button, Tooltip } from '@/components/ui'
import WorkbaseLogo from '@/components/WorkbaseLogo'

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

const navItems = [
  { to: '/collaborators', label: 'Collaborators', icon: UsersIcon },
  { to: '/enterprises', label: 'Enterprises', icon: BuildingIcon },
  { to: '/contracts', label: 'Contracts', icon: FileIcon },
  { to: '/tasks', label: 'Tasks', icon: CheckIcon },
  { to: '/reports', label: 'Reports', icon: ReportIcon },
  { to: '/users', label: 'Users', icon: UserCircleIcon },
]

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  )
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )
}

function ReportIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function UserCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="8" r="3" />
    </svg>
  )
}

type SidebarProps = {
  open?: boolean
  onClose?: () => void
}

export default function Sidebar({ open = true, onClose }: SidebarProps) {
  const { user, logout, isAdmin } = useAuth()
  const visibleNavItems = navItems.filter((item) => item.to !== '/users' || isAdmin)

  return (
    <aside
      className={`
        fixed md:static inset-y-0 left-0 z-50
        w-[min(16rem,85vw)] md:w-[4.25rem] shrink-0 flex flex-col h-full max-h-[100dvh] bg-[#1e1e24] border-r border-zinc-700/40
        transform transition-transform duration-200 ease-out
        md:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
        top-0 backdrop-blur-xl overflow-hidden
        md:shadow-none shadow-xl
        rounded-r-2xl md:rounded-none
        pl-[env(safe-area-inset-left)] md:pl-0
      `}
    >
      {/* Header: logo + Workbase text on mobile, só ícone no desktop com tooltip */}
      <div className="px-4 py-4 md:py-5 md:px-0 md:flex md:justify-center border-b border-zinc-700/40 shrink-0">
        <div className="flex items-center justify-between gap-3 md:flex-col md:gap-0">
          <div className="flex items-center gap-3 min-w-0 md:justify-center">
            <Tooltip label="Workbase">
              <WorkbaseLogo size="md" />
            </Tooltip>
            <div className="min-w-0 md:hidden">
              <span className="font-semibold text-white text-sm block truncate">Workbase</span>
              <p className="text-xs text-zinc-500 truncate">Dashboard</p>
            </div>
          </div>
          {onClose && (
            <Tooltip label="Close menu">
              <button
                type="button"
                onClick={onClose}
                className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-3 -mr-1 text-zinc-400 hover:text-white transition-colors shrink-0 rounded-xl hover:bg-zinc-800/80 active:bg-zinc-700/80"
                aria-label="Close menu"
              >
                <CloseIcon />
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      <nav className="flex-1 py-3 px-3 md:py-4 md:px-0 md:flex md:flex-col md:items-center space-y-1 md:space-y-0.5 overflow-y-auto overflow-x-hidden overscroll-contain">
        {visibleNavItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-3 py-3 md:px-0 md:py-2.5 md:w-12 md:justify-center rounded-xl md:rounded-lg text-sm font-medium no-underline transition-all duration-150 active:scale-[0.98] ${
                isActive
                  ? 'text-violet-400 bg-violet-500/10'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`
            }
          >
            {({ isActive }) => (
              <Tooltip label={label}>
                <span className="flex items-center gap-3 min-w-0 md:justify-center md:w-full">
                  <Icon className={`shrink-0 w-5 h-5 ${isActive ? 'text-violet-400' : 'text-zinc-500'}`} />
                  <span className="truncate md:sr-only">{label}</span>
                </span>
              </Tooltip>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 md:p-3 md:flex md:flex-col md:items-center border-t border-zinc-700/40 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))] md:pb-3">
        <div className="mb-3 flex items-center gap-3 px-1 md:mb-2 md:px-0 md:justify-center">
          <div
            className="w-10 h-10 md:w-8 md:h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm md:text-xs font-semibold shrink-0 ring-2 ring-violet-500/30"
            title={user?.name ?? ''}
          >
            {user?.name?.charAt(0)?.toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0 flex-1 md:hidden">
            <p className="text-sm font-medium text-zinc-200 truncate">{user?.name}</p>
            <p className="text-xs text-zinc-500 capitalize truncate">{user?.role}</p>
          </div>
        </div>
        <Tooltip label="Log out">
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            className="md:w-12 md:min-w-0 md:justify-center md:px-0 min-h-[44px] md:min-h-0 rounded-xl md:rounded-lg"
            onClick={() => { logout(); onClose?.() }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="md:sr-only">Log out</span>
          </Button>
        </Tooltip>
      </div>
    </aside>
  )
}
