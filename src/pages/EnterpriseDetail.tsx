import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { Card, PageHeader, BackButton, DetailMessage } from '@/components/ui'
import { GET_ENTERPRISE } from '@/graphql/enterprises'
import { formatDate } from '@/lib/format'

export default function EnterpriseDetail() {
  const { id } = useParams<{ id: string }>()

  const { data, loading, error } = useQuery(GET_ENTERPRISE, {
    variables: { id: id ?? '' },
    skip: !id,
  })

  const enterprise = data?.enterprise

  if (loading) return <p className="text-zinc-500 text-sm py-6 sm:py-8">Loading…</p>
  if (error) {
    return (
      <DetailMessage
        message={error.graphQLErrors?.[0]?.message ?? error.message}
        isError
        backTo="/enterprises"
        backLabel="Back to enterprises"
      />
    )
  }
  if (!enterprise) {
    return (
      <DetailMessage message="Enterprise not found." backTo="/enterprises" backLabel="Back to enterprises" />
    )
  }

  return (
    <div className="min-w-0">
      <PageHeader
        leftAction={<BackButton to="/enterprises">Back to enterprises</BackButton>}
      />
      <Card className="overflow-hidden">
        <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-4 sm:pb-5 border-b border-zinc-700/40">
          <h1 className="text-lg font-semibold text-white tracking-tight m-0 sm:text-xl md:text-2xl">
            {enterprise.name}
          </h1>
        </div>
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {enterprise.commercialName && (
            <div>
              <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Trade name</h2>
              <p className="text-zinc-300">{enterprise.commercialName}</p>
            </div>
          )}
          {enterprise.cnpj != null && enterprise.cnpj !== '' && (
            <div>
              <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">CNPJ</h2>
              <p className="text-zinc-300">{enterprise.cnpj}</p>
            </div>
          )}
          {enterprise.description != null && enterprise.description !== '' && (
            <div>
              <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Description</h2>
              <p className="text-zinc-300 whitespace-pre-wrap">{enterprise.description}</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:gap-6 gap-1 pt-2 text-sm text-zinc-500">
            <span>Created {formatDate(enterprise.insertedAt)}</span>
            <span>Updated {formatDate(enterprise.updatedAt)}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
