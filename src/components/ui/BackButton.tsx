import { Link } from 'react-router-dom'
import { ChevronLeftIcon } from './Icons'

type Props = {
  to: string
  children: React.ReactNode
  className?: string
}

export function BackButton({ to, children, className = '' }: Props) {
  return (
    <Link
      to={to}
      className={`
        inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-zinc-200
        py-2 pr-2.5 pl-1.5 -ml-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors
        min-h-[44px] md:min-h-0
        ${className}
      `}
    >
      <ChevronLeftIcon className="w-4 h-4 shrink-0" />
      <span>{children}</span>
    </Link>
  )
}
