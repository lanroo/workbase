import { ShieldIcon, UserIcon } from './Icons'

type Role = 'admin' | 'user'

type Props = {
  role: Role
  showLabel?: boolean
  className?: string
}

const labels: Record<Role, string> = {
  admin: 'Admin',
  user: 'User',
}

export function RoleIcon({ role, showLabel = false, className = '' }: Props) {
  const label = labels[role]
  const isAdmin = role === 'admin'

  return (
    <span className={`inline-flex items-center gap-1.5 text-zinc-300 ${className}`} title={label}>
      {isAdmin ? (
        <ShieldIcon className="w-4 h-4 text-violet-400 shrink-0" aria-hidden />
      ) : (
        <UserIcon className="w-4 h-4 text-zinc-500 shrink-0" aria-hidden />
      )}
      {showLabel && <span>{label}</span>}
    </span>
  )
}
