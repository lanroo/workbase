type Props = {
  active: boolean
  label?: boolean
  className?: string
}

const sizeClasses = 'w-2 h-2 rounded-full shrink-0'

export function StatusDot({ active, label = false, className = '' }: Props) {
  const colorClass = active ? 'bg-emerald-500' : 'bg-red-500'
  const text = active ? 'Active' : 'Inactive'

  return (
    <span className={`inline-flex items-center gap-2 ${className}`} role="img" aria-label={text} title={text}>
      <span className={`${sizeClasses} ${colorClass}`} aria-hidden />
      {label && <span className="text-sm text-zinc-400">{text}</span>}
    </span>
  )
}
