import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { LIST_TASKS, UPDATE_TASK } from '@/graphql/tasks'
import { useAuth } from '@/context/AuthContext'

const STATUSES = [
  { key: 'PENDING', label: 'Pending', color: 'bg-zinc-600/80' },
  { key: 'IN_PROGRESS', label: 'In progress', color: 'bg-amber-600/80' },
  { key: 'COMPLETED', label: 'Completed', color: 'bg-emerald-600/80' },
  { key: 'FAILED', label: 'Failed', color: 'bg-red-600/80' },
] as const

type Task = {
  id: string
  name: string
  description?: string | null
  status: string
  priority: number
  collaborator?: { id: string; name: string } | null
}

type TasksBoardProps = {
  onMutationError?: (message: string) => void
}

export default function TasksBoard({ onMutationError }: TasksBoardProps) {
  const { isAdmin } = useAuth()

  const { data, loading, error, refetch } = useQuery(LIST_TASKS, {
    variables: {
      pagination: { page: 1, pageSize: 100 },
      filters: {},
    },
  })

  const [updateTask] = useMutation(UPDATE_TASK, {
    onCompleted: () => refetch(),
    onError: (err) => onMutationError?.(err.graphQLErrors?.[0]?.message ?? err.message ?? 'Failed to update task'),
  })

  const tasks = (data?.tasks?.data ?? []) as Task[]
  const byStatus = STATUSES.reduce(
    (acc, { key }) => {
      acc[key] = tasks.filter((t) => t.status === key)
      return acc
    },
    {} as Record<string, Task[]>,
  )

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(e: React.DragEvent, newStatus: string) {
    e.preventDefault()
    const id = e.dataTransfer.getData('taskId')
    if (!id || !isAdmin) return
    updateTask({ variables: { id, input: { status: newStatus } } })
  }

  function handleDragStart(e: React.DragEvent, task: Task) {
    if (!isAdmin) return
    e.dataTransfer.setData('taskId', task.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  if (loading) return <p className="text-zinc-500 text-sm py-8">Loading…</p>
  if (error) return <p className="text-red-400 text-sm">{error.graphQLErrors?.[0]?.message ?? error.message}</p>

  return (
    <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 min-h-[360px] sm:min-h-[400px] -mx-1 px-1">
      {STATUSES.map(({ key, label, color }) => (
        <div
          key={key}
          className="w-64 min-[480px]:w-72 shrink-0 flex flex-col rounded-xl border border-zinc-700/50 overflow-hidden bg-[#1e1e24]/80"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, key)}
        >
          <div className={`px-4 py-3 ${color} text-white/95 font-medium text-sm rounded-t-xl`}>
            {label}
            <span className="ml-2 text-white/70 font-normal">({byStatus[key]?.length ?? 0})</span>
          </div>
          <div className="flex-1 p-3 space-y-2 overflow-y-auto min-h-[120px]">
            {(byStatus[key] ?? []).map((task) => (
              <Link
                key={task.id}
                to={`/tasks/${task.id}`}
                draggable={isAdmin}
                onDragStart={(e) => handleDragStart(e, task)}
                className={`
                  block rounded-lg border border-zinc-700/50 bg-[#1e1e24] p-3
                  hover:border-zinc-600/60 hover:bg-zinc-800/50
                  transition-colors duration-150
                  ${isAdmin ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
                `}
              >
                <p className="font-medium text-sm text-zinc-100 truncate">{task.name}</p>
                {task.description && (
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{task.description}</p>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 truncate">{task.collaborator?.name ?? '—'}</span>
                  <span className="text-xs text-zinc-600 shrink-0 ml-2">P{task.priority}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
