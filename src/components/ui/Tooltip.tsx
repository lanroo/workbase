import React, { useId } from 'react'

type Props = {
  label: string
  children: React.ReactNode
  /** true = full width everywhere; 'mobile' = full width only below sm (side-by-side on desktop) */
  fullWidth?: boolean | 'mobile'
}

export function Tooltip({ label, children, fullWidth }: Props) {
  const id = useId()
  const widthClass =
    fullWidth === true ? 'flex w-full' : fullWidth === 'mobile' ? 'flex w-full sm:inline-flex sm:w-auto' : 'inline-flex'
  const trigger =
    React.isValidElement(children)
      ? React.cloneElement(children as React.ReactElement<{ 'aria-describedby'?: string; title?: string }>, {
          'aria-describedby': id,
          title: label,
        })
      : children

  return (
    <span className={`relative group ${widthClass}`}>
      {trigger}
      <span
        id={id}
        role="tooltip"
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-200 text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 z-[100] border border-zinc-700/60 shadow-lg transition-opacity duration-150"
      >
        {label}
      </span>
    </span>
  )
}
