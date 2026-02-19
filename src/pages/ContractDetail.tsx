import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Card, PageHeader, BackButton, DetailMessage } from '@/components/ui'
import { GET_CONTRACT } from '@/graphql/contracts'
import { formatDate, formatMoney } from '@/lib/format'

export default function ContractDetail() {
  const { id } = useParams<{ id: string }>()

  const { data, loading, error } = useQuery(GET_CONTRACT, {
    variables: { id: id ?? '' },
    skip: !id,
  })

  const contract = data?.contract

  if (loading) return <p className="text-zinc-500 text-sm py-6 sm:py-8">Loading…</p>
  if (error) {
    return (
      <DetailMessage
        message={error.graphQLErrors?.[0]?.message ?? error.message}
        isError
        backTo="/contracts"
        backLabel="Back to contracts"
      />
    )
  }
  if (!contract) {
    return (
      <DetailMessage message="Contract not found." backTo="/contracts" backLabel="Back to contracts" />
    )
  }

  return (
    <div className="min-w-0">
      <PageHeader
        leftAction={<BackButton to="/contracts">Back to contracts</BackButton>}
      />
      <Card className="overflow-hidden">
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-zinc-700/40">
          <h1 className="text-lg font-semibold text-white tracking-tight m-0 mb-3 sm:text-xl md:text-2xl">
            Contract
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300">
              {contract.status}
            </span>
          </div>
        </div>
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          <div>
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Value</h2>
            <p className="text-zinc-300">{formatMoney(contract.value)}</p>
          </div>
          <div>
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Start</h2>
            <p className="text-zinc-300">{formatDate(contract.startsAt)}</p>
          </div>
          <div>
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">End</h2>
            <p className="text-zinc-300">{formatDate(contract.expiresAt)}</p>
          </div>
          {contract.enterprise && (
            <div>
              <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Enterprise</h2>
              <p className="text-zinc-300">{contract.enterprise.name}</p>
            </div>
          )}
          {contract.collaborator && (
            <div>
              <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Collaborator</h2>
              <p className="text-zinc-300">
                {contract.collaborator.name}
                {contract.collaborator.email && <span className="text-zinc-500 ml-2">({contract.collaborator.email})</span>}
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:gap-6 gap-1 pt-2 text-sm text-zinc-500">
            <span>Created {formatDate(contract.insertedAt)}</span>
            <span>Updated {formatDate(contract.updatedAt)}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
