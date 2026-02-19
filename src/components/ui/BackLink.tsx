import { Link } from 'react-router-dom'

type Props = {
  to: string
  children: React.ReactNode
  className?: string
}

export function BackLink({ to, children, className = '' }: Props) {
  return (
    <Link
      to={to}
      className={`text-sm text-zinc-500 hover:text-zinc-300 transition-colors ${className}`}
    >
      {children}
    </Link>
  )
}
