import { Button, ChevronLeftIcon, ChevronRightIcon, Tooltip } from '@/components/ui'

type Props = {
  page: number
  pageSize: number
  totalCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  onPageChange: (page: number) => void
}

export function Pagination({
  page,
  pageSize,
  totalCount,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: Props) {
  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalCount)

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mt-4 sm:mt-5 md:mt-6 pt-4 border-t border-zinc-700/40">
      <span className="text-sm text-zinc-500 order-2 sm:order-1">
        {from}–{to} of {totalCount}
      </span>
      <div className="flex items-center gap-2 order-1 sm:order-2">
        <Tooltip label="Previous">
          <Button
            variant="secondary"
            size="sm"
            disabled={!hasPreviousPage}
            onClick={() => onPageChange(page - 1)}
            className="p-2 min-w-[44px] md:min-w-0"
            aria-label="Previous page"
          >
            <ChevronLeftIcon />
          </Button>
        </Tooltip>
        <span className="px-3 text-sm text-zinc-500">Page {page}</span>
        <Tooltip label="Next">
          <Button
            variant="secondary"
            size="sm"
            disabled={!hasNextPage}
            onClick={() => onPageChange(page + 1)}
            className="p-2 min-w-[44px] md:min-w-0"
            aria-label="Next page"
          >
            <ChevronRightIcon />
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}
