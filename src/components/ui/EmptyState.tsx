type Props = {
  title: string
  description?: string
  action?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

function DefaultIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export function EmptyState({ title, description, action, icon, className = '' }: Props) {
  return (
    <div
      className={`
        rounded-xl border border-zinc-700/50 bg-[#1e1e24]/60
        flex flex-col items-center justify-center text-center
        py-12 sm:py-16 px-6 sm:px-8
        ${className}
      `}
    >
      <div className="text-zinc-600 mb-4">
        {icon ?? <DefaultIcon className="w-14 h-14 sm:w-16 sm:h-16" />}
      </div>
      <h2 className="text-lg font-semibold text-zinc-300 m-0 mb-1.5">
        {title}
      </h2>
      {description && (
        <p className="text-sm text-zinc-500 max-w-sm m-0 mb-6">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
