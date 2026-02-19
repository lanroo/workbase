type Props = {
  /** Optional: when omitted, header shows only left/right actions (e.g. detail pages with title inside card) */
  title?: string
  /** Left side: e.g. Back to list */
  leftAction?: React.ReactNode
  /** Right side: e.g. Edit button */
  action?: React.ReactNode
}

export function PageHeader({ title, leftAction, action }: Props) {
  return (
    <header className="flex flex-row items-center justify-between gap-3 mb-4 pb-4 border-b border-zinc-700/40 sm:mb-6 sm:pb-6 sm:gap-4 md:mb-8 md:pb-8">
      {leftAction ? (
        <div className="flex shrink-0 items-center min-h-[44px] md:min-h-0">
          {leftAction}
        </div>
      ) : null}
      {title != null && title !== '' ? (
        <h1 className="text-lg font-semibold text-white tracking-tight m-0 min-w-0 flex-1 truncate sm:text-xl sm:overflow-visible sm:whitespace-normal sm:break-words md:text-2xl max-w-3xl">
          {title}
        </h1>
      ) : (
        <div className="flex-1 min-w-0" aria-hidden />
      )}
      {action ? (
        <div className="flex shrink-0 min-h-[44px] items-center justify-end gap-2 sm:min-h-0">
          {action}
        </div>
      ) : null}
    </header>
  )
}
