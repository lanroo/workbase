import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/context/AuthContext'
import { Card, PageHeader, Button, EditIcon, BackButton, DetailMessage } from '@/components/ui'
import { GET_TASK } from '@/graphql/tasks'
import { formatDate } from '@/lib/format'

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
}

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>()
  const { isAdmin } = useAuth()

  const { data, loading, error } = useQuery(GET_TASK, {
    variables: { id: id ?? '' },
    skip: !id,
  })

  const task = data?.task

  if (loading) return <p className="text-zinc-500 text-sm py-6 sm:py-8">Loading…</p>
  if (error) {
    return (
      <DetailMessage
        message={error.graphQLErrors?.[0]?.message ?? error.message}
        isError
        backTo="/tasks"
        backLabel="Back to tasks"
      />
    )
  }
  if (!task) {
    return (
      <DetailMessage message="Task not found." backTo="/tasks" backLabel="Back to tasks" />
    )
  }

  return (
    <div className="min-w-0">
      <PageHeader
        leftAction={<BackButton to="/tasks">Back to tasks</BackButton>}
        action={
          isAdmin ? (
            <Link to="/tasks" state={{ editTask: task }}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <EditIcon className="w-4 h-4" />
                Edit
              </Button>
            </Link>
          ) : undefined
        }
      />
      <Card className="overflow-hidden">
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-zinc-700/40">
          <h1 className="text-lg font-semibold text-white tracking-tight m-0 mb-3 sm:text-xl md:text-2xl">
            {task.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300">
              {STATUS_LABELS[task.status] ?? task.status}
            </span>
            <span className="text-zinc-500">Priority {task.priority}</span>
          </div>
        </div>
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {task.description && (
            <div>
              <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Description</h2>
              <p className="text-zinc-300 whitespace-pre-wrap">{task.description}</p>
            </div>
          )}
          <div>
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Collaborator</h2>
            <p className="text-zinc-300">
              {task.collaborator ? (
                <>
                  {task.collaborator.name}
                  {task.collaborator.email && <span className="text-zinc-500 ml-2">({task.collaborator.email})</span>}
                </>
              ) : (
                '—'
              )}
            </p>
          </div>
          {task.report && (
            <div>
              <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Report</h2>
              <p className="text-zinc-300">
                {task.report.taskName ?? '—'}
                {task.report.completedAt && (
                  <span className="text-zinc-500 ml-2">completed at {formatDate(task.report.completedAt)}</span>
                )}
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:gap-6 gap-1 pt-2 text-sm text-zinc-500">
            <span>Created {formatDate(task.insertedAt)}</span>
            <span>Updated {formatDate(task.updatedAt)}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
