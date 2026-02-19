import { Button } from './Button'
import { ShieldIcon, UserIcon } from './Icons'

type Role = 'admin' | 'user'

type Props = {
  value: Role
  onChange: (role: Role) => void
  className?: string
}

export function RolePicker({ value, onChange, className = '' }: Props) {
  return (
    <div className={`flex rounded-lg border border-zinc-700/80 p-0.5 bg-zinc-800/40 ${className}`} role="group" aria-label="Role">
      <Button
        type="button"
        variant={value === 'user' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onChange('user')}
        className="flex-1 min-w-0 gap-1.5 rounded-md"
      >
        <UserIcon className="w-4 h-4" />
        User
      </Button>
      <Button
        type="button"
        variant={value === 'admin' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onChange('admin')}
        className="flex-1 min-w-0 gap-1.5 rounded-md"
      >
        <ShieldIcon className="w-4 h-4" />
        Admin
      </Button>
    </div>
  )
}
