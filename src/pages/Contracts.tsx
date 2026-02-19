import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { useAuth } from '@/context/AuthContext'
import { Table } from '@/components/Table'
import { Pagination } from '@/components/Pagination'
import { Button, Input, Modal, ModalActions, PageHeader, ConfirmModal, Select, XCircleIcon, Tooltip, PlusIcon } from '@/components/ui'
import { LIST_CONTRACTS, CREATE_CONTRACT, DELETE_CONTRACT } from '@/graphql/contracts'
import { LIST_COLLABORATORS } from '@/graphql/collaborators'
import { LIST_ENTERPRISES } from '@/graphql/enterprises'
import { formatDate, formatMoney } from '@/lib/format'

const PAGE_SIZE = 10

export default function Contracts() {
  const { isAdmin } = useAuth()
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState<'create' | null>(null)
  const [form, setForm] = useState({
    enterpriseId: '',
    collaboratorId: '',
    value: '',
    startsAt: '',
    expiresAt: '',
    status: 'ACTIVE',
  })

  const { data, loading, error, refetch } = useQuery(LIST_CONTRACTS, {
    variables: { pagination: { page, pageSize: PAGE_SIZE }, filters: {} },
  })

  const { data: enterprisesData } = useQuery(LIST_ENTERPRISES, {
    variables: { pagination: { page: 1, pageSize: 200 }, filters: {} },
    skip: !isAdmin || modal !== 'create',
  })
  const { data: collaboratorsData } = useQuery(LIST_COLLABORATORS, {
    variables: { pagination: { page: 1, pageSize: 200 }, filters: {} },
    skip: !isAdmin || modal !== 'create',
  })

  const [mutationError, setMutationError] = useState<string | null>(null)
  const [createContract] = useMutation(CREATE_CONTRACT, {
    onCompleted: () => {
      setModal(null)
      setMutationError(null)
      setForm({ enterpriseId: '', collaboratorId: '', value: '', startsAt: '', expiresAt: '', status: 'ACTIVE' })
      refetch()
    },
    onError: (err) => setMutationError(err.graphQLErrors?.[0]?.message ?? err.message ?? 'Failed to create contract'),
  })
  const [cancellingContract, setCancellingContract] = useState<{ id: string } | null>(null)
  const [deleteContract] = useMutation(DELETE_CONTRACT, {
    onCompleted: () => {
      setCancellingContract(null)
      setMutationError(null)
      refetch()
    },
    onError: (err) => {
      setMutationError(err.graphQLErrors?.[0]?.message ?? err.message ?? 'Failed to cancel contract')
      setCancellingContract(null)
    },
  })

  const list = data?.contracts?.data ?? []
  const pageInfo = data?.contracts?.pageInfo ?? { hasNextPage: false, hasPreviousPage: false, totalCount: 0 }
  const enterprises = enterprisesData?.enterprises?.data ?? []
  const collaborators = collaboratorsData?.collaborators?.data ?? []

  const openCreate = () => {
    setMutationError(null)
    const now = new Date()
    const oneYear = new Date(now)
    oneYear.setFullYear(now.getFullYear() + 1)
    setForm({
      enterpriseId: '',
      collaboratorId: '',
      value: '',
      startsAt: now.toISOString(),
      expiresAt: oneYear.toISOString(),
      status: 'ACTIVE',
    })
    setModal('create')
  }

  const openCancelContract = (row: { id: string }) => {
    setCancellingContract({ id: row.id })
  }

  const confirmCancelContract = () => {
    if (!cancellingContract) return
    deleteContract({ variables: { id: cancellingContract.id } })
  }

  return (
    <div className="min-w-0">
      <PageHeader
        title="Contracts"
        action={
          isAdmin && (
            <Button variant="outline" size="sm" onClick={openCreate} className="shrink-0 gap-1.5">
              <PlusIcon className="w-4 h-4" />
              New contract
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
                key: 'value',
                label: 'Value',
                render: (v, row) => (
                  <Link to={`/contracts/${(row as { id: string }).id}`} className="text-violet-400 hover:text-violet-300 transition-colors">
                    {formatMoney(v)}
                  </Link>
                ),
              },
              { key: 'startsAt', label: 'Start', render: (v: unknown) => formatDate(v, { style: 'date' }) },
              { key: 'expiresAt', label: 'End', render: (v: unknown) => formatDate(v, { style: 'date' }) },
              { key: 'status', label: 'Status' },
              {
                key: 'enterprise',
                label: 'Enterprise',
                render: (v: { name?: string } | unknown) => (v && typeof v === 'object' && 'name' in v ? (v as { name: string }).name : '—'),
              },
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
                        <Tooltip label="Cancel contract">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => openCancelContract(row as { id: string })}
                            className="p-2 min-w-[44px] md:min-w-0 focus:ring-0 focus:ring-offset-0 border-0"
                          >
                            <XCircleIcon />
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
      )}

      {modal === 'create' && (
        <Modal title="New contract" onClose={() => setModal(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              createContract({
                variables: {
                  input: {
                    enterpriseId: form.enterpriseId,
                    collaboratorId: form.collaboratorId,
                    value: form.value ? parseFloat(form.value) : null,
                    startsAt: form.startsAt || new Date().toISOString(),
                    expiresAt: form.expiresAt,
                    status: form.status,
                  },
                },
              })
            }}
          >
            <Select
              label="Enterprise"
              value={form.enterpriseId}
              onChange={(e) => setForm((f) => ({ ...f, enterpriseId: e.target.value }))}
              required
            >
              <option value="">Select</option>
              {enterprises.map((e: { id: string; name: string }) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </Select>
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
            <Input
              label="Value"
              type="number"
              step="0.01"
              value={form.value}
              onChange={(v) => setForm((f) => ({ ...f, value: v }))}
            />
            <div className="mb-5 last:mb-0">
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Start</label>
              <input
                type="datetime-local"
                value={form.startsAt ? form.startsAt.slice(0, 16) : ''}
                onChange={(e) => setForm((f) => ({ ...f, startsAt: new Date(e.target.value).toISOString() }))}
                required
                className="w-full py-2.5 px-3.5 rounded-lg text-[15px] text-zinc-100 bg-zinc-800/80 border border-zinc-700/80 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
            <div className="mb-5 last:mb-0">
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">End</label>
              <input
                type="datetime-local"
                value={form.expiresAt ? form.expiresAt.slice(0, 16) : ''}
                onChange={(e) => setForm((f) => ({ ...f, expiresAt: new Date(e.target.value).toISOString() }))}
                required
                className="w-full py-2.5 px-3.5 rounded-lg text-[15px] text-zinc-100 bg-zinc-800/80 border border-zinc-700/80 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              />
            </div>
            <ModalActions onClose={() => setModal(null)} submitLabel="Create" />
          </form>
        </Modal>
      )}

      <ConfirmModal
        open={cancellingContract !== null}
        onClose={() => setCancellingContract(null)}
        onConfirm={confirmCancelContract}
        title="Cancel contract"
        message="Cancel this contract? This action cannot be undone."
        confirmLabel="Cancel contract"
      />
    </div>
  )
}
