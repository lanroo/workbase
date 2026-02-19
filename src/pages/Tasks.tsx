import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { useAuth } from '@/context/AuthContext'
import { Table } from '@/components/Table'
import { Pagination } from '@/components/Pagination'
import TasksBoard from '@/components/TasksBoard'
import { Button, Input, Modal, ModalActions, PageHeader, Select, EditIcon, Tooltip, ListIcon, BoardIcon, PlusIcon } from '@/components/ui'
import { LIST_TASKS, CREATE_TASK, UPDATE_TASK } from '@/graphql/tasks'
import { LIST_COLLABORATORS } from '@/graphql/collaborators'

const PAGE_SIZE = 10

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
}

export default function Tasks() {
  const { isAdmin } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [view, setView] = useState<'list' | 'board'>('list')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    collaboratorId: '',
    name: '',
    description: '',
    status: 'PENDING',
    priority: 0,
  })
  const [mutationError, setMutationError] = useState<string | null>(null)

  const { data, loading, error, refetch } = useQuery(LIST_TASKS, {
    variables: { pagination: { page, pageSize: PAGE_SIZE }, filters: {} },
  })

  const { data: collaboratorsData } = useQuery(LIST_COLLABORATORS, {
    variables: { pagination: { page: 1, pageSize: 200 }, filters: { isActive: true } },
    skip: !isAdmin || modal === null,
  })

  const [createTask] = useMutation(CREATE_TASK, {
    onCompleted: () => {
      setModal(null)
      setMutationError(null)
      setForm({ collaboratorId: '', name: '', description: '', status: 'PENDING', priority: 0 })
      refetch()
    },
    onError: (err) => setMutationError(err.graphQLErrors?.[0]?.message ?? err.message ?? 'Failed to create task'),
  })
  const [updateTask] = useMutation(UPDATE_TASK, {
    onCompleted: () => {
      setModal(null)
      setEditingId(null)
      setMutationError(null)
      refetch()
    },
    onError: (err) => setMutationError(err.graphQLErrors?.[0]?.message ?? err.message ?? 'Failed to update task'),
  })

  const list = data?.tasks?.data ?? []
  const pageInfo = data?.tasks?.pageInfo ?? { hasNextPage: false, hasPreviousPage: false, totalCount: 0 }
  const collaborators = collaboratorsData?.collaborators?.data ?? []

  useEffect(() => {
    const editTask = (location.state as { editTask?: { id: string; name: string; description?: string | null; status: string; priority: number } })?.editTask
    if (editTask) {
      setEditingId(editTask.id)
      setForm({
        collaboratorId: '',
        name: editTask.name,
        description: editTask.description ?? '',
        status: editTask.status,
        priority: editTask.priority ?? 0,
      })
      setModal('edit')
      navigate('/tasks', { replace: true, state: {} })
    }
  }, [location.state, navigate])

  const openEdit = (row: { id: string; name: string; description?: string | null; status: string; priority: number }) => {
    setMutationError(null)
    setEditingId(row.id)
    setForm({
      collaboratorId: '',
      name: row.name,
      description: row.description ?? '',
      status: row.status,
      priority: row.priority ?? 0,
    })
    setModal('edit')
  }

  return (
    <div className="min-w-0">
      <PageHeader
        title="Tasks"
        action={
          <div className="flex flex-row flex-wrap items-center gap-2 sm:gap-3 h-9">
            <div className="flex h-full rounded-lg border border-zinc-700/50 p-0.5 bg-zinc-800/40 shrink-0">
              <Tooltip label="List">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className={`h-full min-w-9 flex items-center justify-center px-2 rounded-md transition-colors ${
                    view === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <ListIcon className="w-5 h-5" />
                </button>
              </Tooltip>
              <Tooltip label="Board">
                <button
                  type="button"
                  onClick={() => setView('board')}
                  className={`h-full min-w-9 flex items-center justify-center px-2 rounded-md transition-colors ${
                    view === 'board' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <BoardIcon className="w-5 h-5" />
                </button>
              </Tooltip>
            </div>
            {isAdmin && (
              <Button variant="outline" size="sm" onClick={() => { setMutationError(null); setModal('create') }} className="h-full min-h-0 min-w-0 flex-1 sm:flex-initial sm:flex-none gap-1.5">
                <PlusIcon className="w-4 h-4" />
                New task
              </Button>
            )}
          </div>
        }
      />

      {view === 'board' && <TasksBoard onMutationError={setMutationError} />}

      {view === 'list' && error && (
        <p className="text-red-400 text-sm mb-4 sm:mb-6">
          {error.graphQLErrors?.[0]?.message ?? error.message}
        </p>
      )}
      {mutationError && (
        <div className="mb-4 sm:mb-6 py-3 px-4 rounded-lg bg-red-500/10 border border-red-500/30" role="alert">
          <p className="text-red-400 text-sm m-0">{mutationError}</p>
        </div>
      )}
      {view === 'list' && (loading ? (
        <p className="text-zinc-500 text-sm py-6 sm:py-8">Loading…</p>
      ) : (
        <>
          <Table
            columns={[
              {
                key: 'name',
                label: 'Name',
                render: (v, row) => (
                  <Link to={`/tasks/${(row as { id: string }).id}`} className="text-violet-400 hover:text-violet-300 transition-colors">
                    {String(v ?? '—')}
                  </Link>
                ),
              },
              {
                key: 'description',
                label: 'Description',
                render: (v) => (v ? String(v).slice(0, 40) + (String(v).length > 40 ? '…' : '') : '—'),
              },
              {
                key: 'status',
                label: 'Status',
                render: (v) => STATUS_LABELS[String(v)] ?? v,
              },
              { key: 'priority', label: 'Priority' },
              {
                key: 'collaborator',
                label: 'Collaborator',
                render: (v: { name?: string } | unknown) => (v && typeof v === 'object' && 'name' in v ? (v as { name: string }).name : '—'),
              },
              ...(isAdmin
                ? [
                    {
                      key: 'actions',
                      label: 'Actions',
                      render: (_: unknown, row: Record<string, unknown>) => (
                        <Tooltip label="Edit">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(row as { id: string; name: string; description?: string | null; status: string; priority: number })}
                            className="p-2 min-w-[44px] md:min-w-0 focus:ring-0 focus:ring-offset-0 border-0"
                          >
                            <EditIcon />
                          </Button>
                        </Tooltip>
                      ),
                    },
                  ]
                : []),
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
      ))}

      {modal === 'create' && (
        <Modal title="New task" onClose={() => setModal(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              createTask({
                variables: {
                  input: {
                    collaboratorId: form.collaboratorId,
                    name: form.name,
                    description: form.description || null,
                    status: form.status,
                    priority: form.priority,
                  },
                },
              })
            }}
          >
            <Select
              label="Collaborator"
              value={form.collaboratorId}
              onChange={(e) => setForm((f) => ({ ...f, collaboratorId: e.target.value }))}
              required
            >
              <option value="">Select</option>
              {collaborators.map((c: { id: string; name: string }) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
            <Input label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
            <Input label="Description" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} />
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
            </Select>
            <Input
              label="Priority"
              type="number"
              min={0}
              value={String(form.priority)}
              onChange={(v) => setForm((f) => ({ ...f, priority: parseInt(v, 10) || 0 }))}
            />
            <ModalActions onClose={() => setModal(null)} submitLabel="Create" />
          </form>
        </Modal>
      )}

      {modal === 'edit' && editingId && (
        <Modal title="Edit task" onClose={() => { setModal(null); setEditingId(null) }}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              updateTask({
                variables: {
                  id: editingId,
                  input: {
                    name: form.name,
                    description: form.description || null,
                    status: form.status,
                    priority: form.priority,
                  },
                },
              })
            }}
          >
            <Input label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
            <Input label="Description" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} />
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
            </Select>
            <Input
              label="Priority"
              type="number"
              min={0}
              value={String(form.priority)}
              onChange={(v) => setForm((f) => ({ ...f, priority: parseInt(v, 10) || 0 }))}
            />
            <ModalActions onClose={() => { setModal(null); setEditingId(null) }} submitLabel="Save" />
          </form>
        </Modal>
      )}
    </div>
  )
}
