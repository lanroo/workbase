type Props = {
  size?: 'sm' | 'md'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-9 h-9 md:w-10 md:h-10',
}

function WorkbaseLogo({ size = 'md', className = '' }: Props) {
  const isSm = size === 'sm'
  return (
    <div
      className={`rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 cursor-default animate-workbase-lock ${sizeClasses[size]} ${className}`.trim()}
      aria-hidden
    >
      <svg
        width={isSm ? 16 : 18}
        height={isSm ? 16 : 18}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`text-violet-400 ${!isSm ? 'md:w-5 md:h-5' : ''}`.trim()}
      >
        <rect x="4" y="11" width="16" height="10" rx="2" ry="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
    </div>
  )
}

export default WorkbaseLogo
