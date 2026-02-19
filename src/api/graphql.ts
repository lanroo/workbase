import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { Observable } from '@apollo/client/utilities'
import { GRAPHQL_URI, getAccessToken, clearTokens } from './config'
import { refreshAccessToken } from './auth'

const RETRY_KEY = 'authRetry'

const httpLink = createHttpLink({
  uri: GRAPHQL_URI || '/graphql',
  credentials: GRAPHQL_URI?.startsWith('http') ? 'include' : 'same-origin',
})

const authLink = setContext((_, { headers }) => {
  const token = getAccessToken()
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  }
})

function isAuthError(
  graphQLErrors: readonly { extensions?: { code?: string } }[] | undefined,
  networkError: Error & { statusCode?: number } | null | undefined,
): boolean {
  if (networkError && typeof (networkError as { statusCode?: number }).statusCode === 'number' && (networkError as { statusCode: number }).statusCode === 401) return true
  if (graphQLErrors?.some((e) => e.extensions?.code === 'UNAUTHENTICATED')) return true
  return false
}

function redirectToLogin(): void {
  clearTokens()
  window.location.pathname = '/login'
}

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (!isAuthError(graphQLErrors, networkError)) return forward(operation)

  const ctx = operation.getContext()
  if (ctx[RETRY_KEY] === true) {
    redirectToLogin()
    return forward(operation)
  }

  operation.setContext({ ...ctx, [RETRY_KEY]: true })

  return new Observable((subscriber) => {
    let innerSub: { unsubscribe: () => void } | null = null
    refreshAccessToken()
      .then(() => forward(operation))
      .then((obs) => {
        innerSub = obs.subscribe({
          next: (v) => subscriber.next(v),
          error: (e) => subscriber.error(e),
          complete: () => subscriber.complete(),
        })
      })
      .catch(() => {
        redirectToLogin()
        subscriber.complete()
      })
    return () => { innerSub?.unsubscribe() }
  })
})

export const client = new ApolloClient({
  link: from([authLink, errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: { errorPolicy: 'all' },
    query: { errorPolicy: 'all' },
    mutate: { errorPolicy: 'all' },
  },
})
