import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { useAuth } from '@/context/AuthContext'
import { Table } from '@/components/Table'
import { Pagination } from '@/components/Pagination'
import { Button, Input, Modal, ModalActions, PageHeader, ConfirmModal, EditIcon, UserMinusIcon, Tooltip, PlusIcon, StatusDot } from '@/components/ui'
import {
  LIST_COLLABORATORS,
  CREATE_COLLABORATOR,
  UPDATE_COLLABORATOR,
  DELETE_COLLABORATOR,
} from '@/graphql/collaborators'

import { formatCpf } from '@/lib/format'

const PAGE_SIZE = 10

export default function Collaborators() {
  const { isAdmin } = useAuth()
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', cpf: '' })
  const [createError, setCreateError] = useState<string | null>(null)
  const [deactivatingCollaborator, setDeactivatingCollaborator] = useState<{ id: string; name: string } | null>(null)

  const { data, loading, error, refetch } = useQuery(LIST_COLLABORATORS, {
    variables: { pagination: { page, pageSize: PAGE_SIZE }, filters: {} },
  })

  const [createCollaborator] = useMutation(CREATE_COLLABORATOR, {
    onCompleted: () => {
      setModal(null)
      setForm({ name: '', email: '', cpf: '' })
      setCreateError(null)
      refetch()
    },
    onError: (err) => {
      setCreateError(err.graphQLErrors?.[0]?.message ?? err.message ?? 'Failed to create collaborator')
    },
  })
  const [mutationError, setMutationError] = useState<string | null>(null)
  const [updateCollaborator] = useMutation(UPDATE_COLLABORATOR, {
    onCompleted: () => {
      setModal(null)
      setEditingId(null)
      setMutationError(null)
      setForm({ name: '', email: '', cpf: '' })
      refetch()
    },
    onError: (err) => setMutationError(err.graphQLErrors?.[0]?.message ?? err.message ?? 'Failed to update collaborator'),
  })
  const [deleteCollaborator] = useMutation(DELETE_COLLABORATOR, {
    onCompleted: () => {
      setDeactivatingCollaborator(null)
      setMutationError(null)
      refetch()
    },
    onError: (err) => {
      setMutationError(err.graphQLErrors?.[0]?.message ?? err.message ?? 'Failed to deactivate collaborator')
      setDeactivatingCollaborator(null)
    },
  })

  const list = data?.collaborators?.data ?? []
  const pageInfo = data?.collaborators?.pageInfo ?? {
    hasNextPage: false,
    hasPreviousPage: false,
    totalCount: 0,
  }

  const openCreate = () => {
    setForm({ name: '', email: '', cpf: '' })
    setCreateError(null)
    setMutationError(null)
    setEditingId(null)
    setModal('create')
  }

  const openEdit = (row: { id: string; name: string; email: string; cpf?: string }) => {
    setMutationError(null)
    setEditingId(row.id)
    setForm({ name: row.name, email: row.email, cpf: formatCpf(row.cpf ?? '') })
    setModal('edit')
  }

  const openDeactivate = (row: { id: string; name: string }) => {
    setDeactivatingCollaborator({ id: row.id, name: row.name })
  }

  const confirmDeactivate = () => {
    if (!deactivatingCollaborator) return
    deleteCollaborator({ variables: { id: deactivatingCollaborator.id } })
  }

  return (
    <div className="min-w-0">
      <PageHeader
        title="Collaborators"
        action={
          isAdmin && (
            <Button variant="outline" size="sm" onClick={openCreate} className="shrink-0 gap-1.5">
              <PlusIcon className="w-4 h-4" />
              New collaborator
            </Button>
          )
        }
      />

      {error && (
        <p className="text-red-400 text-sm mb-4 sm:mb-6">
          {error.graphQLErrors?.[0]?.message ?? error.message}
        </p>
      )}
      {mutationError && (
        <div className="mb-4 sm:mb-6 py-3 px-4 rounded-lg bg-red-500/10 border border-red-500/30" role="alert">
          <p className="text-red-400 text-sm m-0">{mutationError}</p>
        </div>
      )}
      {loading ? (
        <p className="text-zinc-500 text-sm py-6 sm:py-8">Loading…</p>
      ) : (
        <>
          <Table
            columns={[
              {
                key: 'name',
                label: 'Name',
                render: (v, row) => (
                  <Link to={`/collaborators/${(row as { id: string }).id}`} className="text-violet-400 hover:text-violet-300 transition-colors">
                    {String(v ?? '—')}
                  </Link>
                ),
              },
              { key: 'email', label: 'Email' },
              { key: 'cpf', label: 'CPF' },
              {
                key: 'isActive',
                label: 'Active',
                render: (v) => <StatusDot active={Boolean(v)} />,
              },
              ...(isAdmin
                ? [
                    {
                      key: 'actions',
                      label: 'Actions',
                      render: (_: unknown, row: Record<string, unknown>) => (
                        <div className="flex gap-2 sm:gap-1">
                          <Tooltip label="Edit">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEdit(row as { id: string; name: string; email: string; cpf?: string })}
                              className="p-2 min-w-[44px] md:min-w-0 focus:ring-0 focus:ring-offset-0 border-0"
                            >
                              <EditIcon />
                            </Button>
                          </Tooltip>
                          <Tooltip label="Deactivate">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => openDeactivate(row as { id: string; name: string })}
                              className="p-2 min-w-[44px] md:min-w-0 focus:ring-0 focus:ring-offset-0 border-0"
                            >
                              <UserMinusIcon />
                            </Button>
                          </Tooltip>
                        </div>
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
      )}

      {modal === 'create' && (
        <Modal title="New collaborator" onClose={() => { setModal(null); setCreateError(null) }}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setCreateError(null)
              const cpfDigits = form.cpf.replace(/\D/g, '')
              if (cpfDigits.length !== 11) {
                setCreateError('CPF must have 11 digits')
                return
              }
              createCollaborator({
                variables: {
                  input: { name: form.name.trim(), email: form.email.trim(), cpf: cpfDigits },
                },
              })
            }}
          >
            {createError && (
              <p className="text-red-400 text-sm mb-4" role="alert">
                {createError}
              </p>
            )}
            <Input label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
            <Input label="Email" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} required />
            <Input
              label="CPF"
              value={form.cpf}
              onChange={(v) => setForm((f) => ({ ...f, cpf: formatCpf(v) }))}
              placeholder="000.000.000-00"
              maxLength={14}
              required
            />
            <ModalActions onClose={() => { setModal(null); setCreateError(null) }} submitLabel="Create" />
          </form>
        </Modal>
      )}
      {modal === 'edit' && (
        <Modal title="Edit collaborator" onClose={() => { setModal(null); setEditingId(null) }}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!editingId) return
              updateCollaborator({
                variables: { id: editingId, input: { name: form.name, email: form.email } },
              })
            }}
          >
            <Input label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
            <Input label="Email" type="email" value={form.email} onChange={(v) => setForm((f) => ({ ...f, email: v }))} required />
            <ModalActions onClose={() => { setModal(null); setEditingId(null) }} submitLabel="Save" />
          </form>
        </Modal>
      )}

      <ConfirmModal
        open={deactivatingCollaborator !== null}
        onClose={() => setDeactivatingCollaborator(null)}
        onConfirm={confirmDeactivate}
        title="Deactivate collaborator"
        message={
          deactivatingCollaborator ? (
            <>
              Deactivate this collaborator? <strong className="text-white">{deactivatingCollaborator.name}</strong> will be deactivated.
            </>
          ) : (
            ''
          )
        }
        confirmLabel="Deactivate"
      />
    </div>
  )
}
