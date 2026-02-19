import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Card, PageHeader, BackButton, DetailMessage } from '@/components/ui'
import { GET_COLLABORATOR } from '@/graphql/collaborators'
import { formatDate, formatCpf } from '@/lib/format'

export default function CollaboratorDetail() {
  const { id } = useParams<{ id: string }>()

  const { data, loading, error } = useQuery(GET_COLLABORATOR, {
    variables: { id: id ?? '' },
    skip: !id,
  })

  const collaborator = data?.collaborator

  if (loading) return <p className="text-zinc-500 text-sm py-6 sm:py-8">Loading…</p>
  if (error) {
    return (
      <DetailMessage
        message={error.graphQLErrors?.[0]?.message ?? error.message}
        isError
        backTo="/collaborators"
        backLabel="Back to collaborators"
      />
    )
  }
  if (!collaborator) {
    return (
      <DetailMessage message="Collaborator not found." backTo="/collaborators" backLabel="Back to collaborators" />
    )
  }

  return (
    <div className="min-w-0">
      <PageHeader
        leftAction={<BackButton to="/collaborators">Back to collaborators</BackButton>}
      />
      <Card className="overflow-hidden">
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-zinc-700/40">
          <h1 className="text-lg font-semibold text-white tracking-tight m-0 mb-3 sm:text-xl md:text-2xl">
            {collaborator.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md ${collaborator.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-700 text-zinc-400'}`}>
              {collaborator.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          <div>
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Email</h2>
            <p className="text-zinc-300">{collaborator.email ?? '—'}</p>
          </div>
          <div>
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">CPF</h2>
            <p className="text-zinc-300">{formatCpf(collaborator.cpf)}</p>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-6 gap-1 pt-2 text-sm text-zinc-500">
            <span>Created {formatDate(collaborator.insertedAt)}</span>
            <span>Updated {formatDate(collaborator.updatedAt)}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
