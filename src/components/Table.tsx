import type { ReactNode } from 'react'

type Column = {
  key: string
  label: string
  align?: 'left' | 'right'
  render?: (value: unknown, row: Record<string, unknown>) => ReactNode
}

type Props = {
  columns: Column[]
  data: Record<string, unknown>[]
  emptyMessage?: string
}

export function Table({ columns, data, emptyMessage = 'No records.' }: Props) {
  if (data.length === 0) {
    return (
      <div className="py-12 sm:py-16 text-center text-zinc-500 text-sm">
        {emptyMessage}
      </div>
    )
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-700/50 bg-[#1e1e24]/80">
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr>
            {columns.map(({ key, label, align }) => (
              <th
                key={key}
                scope="col"
                className={`py-3 px-4 sm:py-3.5 sm:px-5 text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-800/50 ${align === 'right' ? 'text-right' : 'text-left'}`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={(row.id as string) ?? i}
              className="border-t border-zinc-700/40 hover:bg-zinc-800/40 transition-colors"
            >
              {columns.map(({ key, align, render }) => (
                <td
                  key={key}
                  className={`py-3 px-4 sm:py-3.5 sm:px-5 text-sm text-zinc-300 ${align === 'right' ? 'text-right' : 'text-left'}`}
                >
                  {align === 'right' ? (
                    <div className="flex justify-end">
                      {render ? render(row[key], row) : String(row[key] ?? '—')}
                    </div>
                  ) : render ? render(row[key], row) : String(row[key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
