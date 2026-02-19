type Props = {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = '' }: Props) {
  return (
    <div
      className={`
        rounded-xl bg-[#1e1e24]/90 border border-zinc-700/50
        shadow-sm
        ${className}
      `}
    >
      {children}
    </div>
  )
}
