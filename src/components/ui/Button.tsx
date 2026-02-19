import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  children: React.ReactNode
}

const base =
  'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1a1a1f] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] min-h-[44px] md:min-h-0'

const variants: Record<Variant, string> = {
  primary:
    'bg-violet-600 text-white hover:bg-violet-500 focus:ring-violet-500',
  secondary:
    'bg-zinc-700/80 text-zinc-200 hover:bg-zinc-600/80 border border-zinc-600/80 focus:ring-zinc-500',
  ghost:
    'bg-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 focus:ring-zinc-600',
  danger:
    'bg-zinc-600/90 text-zinc-100 hover:bg-zinc-500/90 border border-zinc-500/60 focus:ring-zinc-500',
  outline:
    'border border-zinc-600/50 text-zinc-300 hover:bg-zinc-800/50 hover:border-zinc-500/50 hover:text-white focus:ring-zinc-500',
}

const sizes = {
  sm: 'py-2 px-3 text-sm gap-1.5 sm:py-1.5 sm:px-2.5',
  md: 'py-2.5 px-4 text-sm gap-2',
  lg: 'py-3 px-5 text-base gap-2.5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className = '',
  children,
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
