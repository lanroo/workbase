import type { SelectHTMLAttributes } from 'react'

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
}

export function Select({ label, className = '', id, children, ...props }: Props) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="mb-5 last:mb-0">
      <label htmlFor={inputId} className="block text-sm font-medium text-zinc-400 mb-1.5">
        {label}
      </label>
      <select
        id={inputId}
        className={`
          w-full py-2.5 px-3.5 rounded-lg text-[15px] text-zinc-100
          bg-zinc-800/80 border border-zinc-700/80
          focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50
          transition-colors duration-150
          disabled:opacity-60 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}
