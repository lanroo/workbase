import type { InputHTMLAttributes } from 'react'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  label: string
  error?: string
  onChange?: (value: string) => void
}

export function Input({ label, error, className = '', id, onChange, ...props }: Props) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="mb-5 last:mb-0">
      <label htmlFor={inputId} className="block text-sm font-medium text-zinc-400 mb-1.5">
        {label}
      </label>
      <input
        id={inputId}
        className={`
          w-full py-2.5 px-3.5 rounded-lg text-[15px] text-zinc-100
          bg-zinc-800/80 border border-zinc-700/80
          placeholder:text-zinc-500
          focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50
          transition-colors duration-150
          disabled:opacity-60 disabled:cursor-not-allowed
          ${error ? 'border-red-500/50 focus:ring-red-500/50' : ''}
          ${className}
        `}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
    </div>
  )
}
