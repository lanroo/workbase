import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { useAuth } from '@/context/AuthContext'
import { Table } from '@/components/Table'
import { Pagination } from '@/components/Pagination'
import { Button, Input, Modal, ModalActions, PageHeader, ConfirmModal, EditIcon, TrashIcon, Tooltip, PlusIcon } from '@/components/ui'
import {
  LIST_ENTERPRISES,
  CREATE_ENTERPRISE,
  UPDATE_ENTERPRISE,
  DELETE_ENTERPRISE,
} from '@/graphql/enterprises'

const PAGE_SIZE = 10

export default function Enterprises() {
  const { isAdmin } = useAuth()
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState<'create' | 'edit' | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ cnpj: '', name: '', commercialName: '', description: '' })
  const [deletingEnterprise, setDeletingEnterprise] = useState<{ id: string; name: string } | null>(null)
  const [mutationError, setMutationError] = useState<string | null>(null)

  const { data, loading, error, refetch } = useQuery(LIST_ENTERPRISES, {
    variables: { pagination: { page, pageSize: PAGE_SIZE }, filters: {} },
  })

  const [createEnterprise] = useMutation(CREATE_ENTERPRISE, {
    onCompleted: () => {
      setModal(null)
      setMutationError(null)
      setForm({ cnpj: '', name: '', commercialName: '', description: '' })
      refetch()
    },
    onError: (err) => setMutationError(err.graphQLErrors?.[0]?.message ?? err.message ?? 'Failed to create enterprise'),
  })
  const [updateEnterprise] = useMutation(UPDATE_ENTERPRISE, {
    onCompleted: () => {
      setModal(null)
      setEditingId(null)
      setMutationError(null)
      refetch()
    },
    onError: (err) => setMutationError(err.graphQLErrors?.[0]?.message ?? err.message ?? 'Failed to update enterprise'),
  })
  const [deleteEnterprise] = useMutation(DELETE_ENTERPRISE, {
    onCompleted: () => {
      setDeletingEnterprise(null)
      setMutationError(null)
      refetch()
    },
    onError: (err) => {
      setMutationError(err.graphQLErrors?.[0]?.message ?? err.message ?? 'Failed to delete enterprise')
      setDeletingEnterprise(null)
    },
  })

  const list = data?.enterprises?.data ?? []
  const pageInfo = data?.enterprises?.pageInfo ?? {
    hasNextPage: false,
    hasPreviousPage: false,
    totalCount: 0,
  }

  const openEdit = (row: { id: string; name: string; commercialName: string; description?: string | null }) => {
    setMutationError(null)
    setEditingId(row.id)
    setForm({
      cnpj: '',
      name: row.name,
      commercialName: row.commercialName ?? '',
      description: row.description ?? '',
    })
    setModal('edit')
  }

  const openDelete = (row: { id: string; name: string }) => {
    setDeletingEnterprise({ id: row.id, name: row.name })
  }

  const confirmDelete = () => {
    if (!deletingEnterprise) return
    deleteEnterprise({ variables: { id: deletingEnterprise.id } })
  }

  return (
    <div className="min-w-0">
      <PageHeader
        title="Enterprises"
        action={
          isAdmin && (
            <Button variant="outline" size="sm" onClick={() => { setMutationError(null); setModal('create') }} className="shrink-0 gap-1.5">
              <PlusIcon className="w-4 h-4" />
              New enterprise
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
                label: 'Legal name',
                render: (v, row) => (
                  <Link to={`/enterprises/${(row as { id: string }).id}`} className="text-violet-400 hover:text-violet-300 transition-colors">
                    {String(v ?? '—')}
                  </Link>
                ),
              },
              { key: 'commercialName', label: 'Trade name' },
              { key: 'cnpj', label: 'CNPJ' },
              {
                key: 'description',
                label: 'Description',
                render: (v) => (v ? String(v).slice(0, 50) + (String(v).length > 50 ? '…' : '') : '—'),
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
                              onClick={() => openEdit(row as { id: string; name: string; commercialName: string; description?: string | null })}
                              className="p-2 min-w-[44px] md:min-w-0 focus:ring-0 focus:ring-offset-0 border-0"
                            >
                              <EditIcon />
                            </Button>
                          </Tooltip>
                          <Tooltip label="Delete">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => openDelete(row as { id: string; name: string })}
                              className="p-2 min-w-[44px] md:min-w-0 focus:ring-0 focus:ring-offset-0 border-0"
                            >
                              <TrashIcon />
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
        <Modal title="New enterprise" onClose={() => setModal(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              createEnterprise({
                variables: {
                  input: {
                    cnpj: form.cnpj.replace(/\D/g, ''),
                    description: form.description || null,
                  },
                },
              })
            }}
          >
            <Input label="CNPJ" value={form.cnpj} onChange={(v) => setForm((f) => ({ ...f, cnpj: v }))} required />
            <Input label="Description" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} />
            <ModalActions onClose={() => setModal(null)} submitLabel="Create" />
          </form>
        </Modal>
      )}
      {modal === 'edit' && editingId && (
        <Modal title="Edit enterprise" onClose={() => { setModal(null); setEditingId(null) }}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              updateEnterprise({
                variables: {
                  id: editingId,
                  input: {
                    name: form.name,
                    commercialName: form.commercialName,
                    description: form.description || null,
                  },
                },
              })
            }}
          >
            <Input label="Legal name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} required />
            <Input label="Trade name" value={form.commercialName} onChange={(v) => setForm((f) => ({ ...f, commercialName: v }))} />
            <Input label="Description" value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} />
            <ModalActions onClose={() => { setModal(null); setEditingId(null) }} submitLabel="Save" />
          </form>
        </Modal>
      )}

      <ConfirmModal
        open={deletingEnterprise !== null}
        onClose={() => setDeletingEnterprise(null)}
        onConfirm={confirmDelete}
        title="Delete enterprise"
        message={
          deletingEnterprise ? (
            <>
              Delete this enterprise? <strong className="text-white">{deletingEnterprise.name}</strong> will be permanently deleted.
            </>
          ) : (
            ''
          )
        }
        confirmLabel="Delete"
      />
    </div>
  )
}
