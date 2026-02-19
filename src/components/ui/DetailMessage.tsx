import { BackLink } from './BackLink'

type Props = {
  message: string
  isError?: boolean
  backTo: string
  backLabel: string
}

export function DetailMessage({ message, isError, backTo, backLabel }: Props) {
  return (
    <div>
      <BackLink to={backTo} className="mb-4 inline-block">
        ← {backLabel}
      </BackLink>
      <p className={isError ? 'text-red-400 text-sm' : 'text-zinc-500 text-sm'}>
        {message}
      </p>
    </div>
  )
}
