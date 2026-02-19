import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/context/AuthContext'
import { Table } from '@/components/Table'
import { Pagination } from '@/components/Pagination'
import { Button, Input, Modal, ModalActions, PageHeader, ConfirmModal, EmptyState, Card, Tooltip, TrashIcon, PlusIcon, RoleIcon, RolePicker } from '@/components/ui'
import { LIST_USERS } from '@/graphql/users'
import { createUser, deleteUser } from '@/api/users'

const PAGE_SIZE = 10

export default function Users() {
  const { isAdmin } = useAuth()
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState<'create' | 'edit' | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' as 'admin' | 'user' })
  const [deletingUser, setDeletingUser] = useState<{ id: string; name: string; email: string; role?: string } | null>(null)

  const { data, loading, error, refetch } = useQuery(LIST_USERS, {
    variables: { pagination: { page, pageSize: PAGE_SIZE }, filters: {} },
  })

  const list = data?.users?.data ?? []
  const pageInfo = data?.users?.pageInfo ?? { hasNextPage: false, hasPreviousPage: false, totalCount: 0 }

  const openCreate = () => {
    setForm({ name: '', email: '', password: '', role: 'user' })
    setFormError(null)
    setModalOpen('create')
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    createUser({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      role: form.role,
    })
      .then(() => {
        setModalOpen(null)
        refetch()
      })
      .catch((err) => setFormError(err instanceof Error ? err.message : 'Failed to create user'))
  }

  const confirmDelete = () => {
    if (!deletingUser) return
    deleteUser(deletingUser.id)
      .then(() => {
        setDeletingUser(null)
        refetch()
      })
      .catch((err) => {
        setFormError(err instanceof Error ? err.message : 'Failed to delete user')
        setDeletingUser(null)
      })
  }

  const tableData = list.map((u: { id: string; name: string; email: string; role?: string }) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role ?? '—',
    _raw: u,
  }))

  const errorMessage = error?.graphQLErrors?.[0]?.message ?? error?.message

  const hasData = tableData.length > 0

  return (
    <div className="min-w-0">
      <PageHeader
        title="Users"
        action={
          isAdmin && (
            <Button variant="outline" size="sm" onClick={openCreate} className="shrink-0 gap-1.5">
              <PlusIcon className="w-4 h-4" />
              New user
            </Button>
          )
        }
      />
      <p className="text-zinc-500 text-sm mb-5 sm:mb-6 -mt-2 sm:-mt-4 max-w-2xl">
        System users with access to the platform. Manage roles and credentials here.
      </p>

      {errorMessage && (
        <div className="mb-5 sm:mb-6 py-3 px-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <p className="text-red-400 text-sm m-0">
            {errorMessage}
          </p>
        </div>
      )}

      {loading ? (
        <Card className="py-14 sm:py-20 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" aria-hidden />
          <p className="text-zinc-500 text-sm mt-4 m-0">Loading users…</p>
        </Card>
      ) : hasData ? (
        <>
          <Table
            columns={[
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              {
                key: 'role',
                label: 'Role',
                render: (v: unknown) => {
                  const role = (v as string)?.toLowerCase()
                  if (role !== 'admin' && role !== 'user') return <span className="text-zinc-500">—</span>
                  return <RoleIcon role={role as 'admin' | 'user'} />
                },
              },
              ...(isAdmin
                ? [
                  {
                    key: 'actions',
                    label: 'Actions',
                    align: 'right' as const,
                    render: (_: unknown, row: Record<string, unknown>) => {
                      const u = row._raw as { id: string; name: string; email: string; role?: string }
                      return (
                        <div className="flex gap-2 sm:gap-1">
                          <Tooltip label="Delete">
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => setDeletingUser(u)}
                              className="p-2 min-w-[44px] md:min-w-0 focus:ring-0 focus:ring-offset-0 border-0"
                            >
                              <TrashIcon />
                            </Button>
                          </Tooltip>
                        </div>
                      )
                    },
                  },
                ]
                : []),
            ]}
            data={tableData}
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
      ) : (
        <EmptyState
          title="No users yet"
          description="Create the first user to give someone access to the platform. You can set their role as admin or user."
          action={
            isAdmin ? (
              <Button variant="outline" size="sm" onClick={openCreate} className="gap-1.5">
                <PlusIcon className="w-4 h-4" />
                New user
              </Button>
            ) : undefined
          }
          icon={
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-14 h-14 sm:w-16 sm:h-16 text-zinc-600">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
      )}

      {modalOpen === 'create' && (
        <Modal title="New user" onClose={() => { setModalOpen(null); setFormError(null) }}>
          <form onSubmit={handleCreate}>
            {formError && (
              <p className="text-red-400 text-sm mb-4" role="alert">
                {formError}
              </p>
            )}
            <Input
              label="Name"
              value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))}
              required
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(v) => setForm((f) => ({ ...f, email: v }))}
              required
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(v) => setForm((f) => ({ ...f, password: v }))}
              required
            />
            <div className="mb-5 last:mb-0">
              <RolePicker value={form.role} onChange={(role) => setForm((f) => ({ ...f, role }))} />
            </div>
            <ModalActions onClose={() => { setModalOpen(null); setFormError(null) }} submitLabel="Create" />
          </form>
        </Modal>
      )}

      <ConfirmModal
        open={deletingUser !== null}
        onClose={() => setDeletingUser(null)}
        onConfirm={confirmDelete}
        title="Delete user"
        message={
          deletingUser ? (
            <>
              Delete this user? <strong className="text-white">{deletingUser.name}</strong> ({deletingUser.email}) will be permanently removed.
            </>
          ) : null
        }
        confirmLabel="Delete"
      />
    </div>
  )
}
