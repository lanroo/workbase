import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Table } from '@/components/Table'
import { Pagination } from '@/components/Pagination'
import { PageHeader, EmptyState } from '@/components/ui'
import { LIST_REPORTS } from '@/graphql/reports'
import { formatDate } from '@/lib/format'

const PAGE_SIZE = 10

export default function Reports() {
  const [page, setPage] = useState(1)

  const { data, loading, error } = useQuery(LIST_REPORTS, {
    variables: { pagination: { page, pageSize: PAGE_SIZE }, filters: {} },
  })

  const list = data?.reports?.data ?? []
  const pageInfo = data?.reports?.pageInfo ?? {
    hasNextPage: false,
    hasPreviousPage: false,
    totalCount: 0,
  }
  const hasData = list.length > 0

  return (
    <div className="min-w-0">
      <PageHeader title="Reports" />
      <p className="text-zinc-500 text-sm mb-4 sm:mb-6 -mt-2 sm:-mt-4">
        Reports are automatically generated when a task is marked as completed.
      </p>

      {error && (
        <p className="text-red-400 text-sm mb-4 sm:mb-6">
          {error.graphQLErrors?.[0]?.message ?? error.message}
        </p>
      )}
      {loading ? (
        <p className="text-zinc-500 text-sm py-6 sm:py-8">Loading…</p>
      ) : !hasData ? (
        <EmptyState
          title="No reports yet"
          description="Reports are generated when a task is marked as completed. Complete tasks to see them here."
        />
      ) : (
        <>
          <Table
            columns={[
              {
                key: 'taskName',
                label: 'Task',
                render: (v, row) => (
                  <Link to={`/reports/${(row as { id: string }).id}`} className="text-violet-400 hover:text-violet-300 transition-colors">
                    {String(v ?? '—')}
                  </Link>
                ),
              },
              {
                key: 'taskDescription',
                label: 'Description',
                render: (v) => (v ? String(v).slice(0, 50) + (String(v).length > 50 ? '…' : '') : '—'),
              },
              { key: 'collaboratorName', label: 'Collaborator' },
              { key: 'completedAt', label: 'Completed at', render: (v: unknown) => formatDate(v) },
            ]}
            data={list}
          />
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            totalCount={pageInfo.totalCount}
            hasNextPage={pageInfo.hasNextPage}
            hasPreviousPage={pageInfo.hasPreviousPage}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}
