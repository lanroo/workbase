import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Card, PageHeader, BackButton, DetailMessage } from '@/components/ui'
import { GET_REPORT } from '@/graphql/reports'
import { formatDate } from '@/lib/format'

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>()

  const { data, loading, error } = useQuery(GET_REPORT, {
    variables: { id: id ?? '' },
    skip: !id,
  })

  const report = data?.report

  if (loading) return <p className="text-zinc-500 text-sm py-6 sm:py-8">Loading…</p>
  if (error) {
    return (
      <DetailMessage
        message={error.graphQLErrors?.[0]?.message ?? error.message}
        isError
        backTo="/reports"
        backLabel="Back to reports"
      />
    )
  }
  if (!report) {
    return (
      <DetailMessage message="Report not found." backTo="/reports" backLabel="Back to reports" />
    )
  }

  return (
    <div className="min-w-0">
      <PageHeader
        leftAction={<BackButton to="/reports">Back to reports</BackButton>}
      />
      <Card className="overflow-hidden">
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-5 border-b border-zinc-700/40">
          <h1 className="text-lg font-semibold text-white tracking-tight m-0 sm:text-xl md:text-2xl">
            {report.taskName ?? 'Report'}
          </h1>
        </div>
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {report.taskDescription != null && report.taskDescription !== '' && (
            <div>
              <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Description</h2>
              <p className="text-zinc-300 whitespace-pre-wrap">{report.taskDescription}</p>
            </div>
          )}
          <div>
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Collaborator</h2>
            <p className="text-zinc-300">{report.collaboratorName ?? (report.collaborator?.name) ?? '—'}</p>
          </div>
          <div>
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Completed at</h2>
            <p className="text-zinc-300">{formatDate(report.completedAt)}</p>
          </div>
          {report.task && (
            <div>
              <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Task</h2>
              <p className="text-zinc-300">{report.task.name}</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:gap-6 gap-1 pt-2 text-sm text-zinc-500">
            <span>Created {formatDate(report.insertedAt)}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
