import { gql } from '@apollo/client'

export const LIST_USERS = gql`
  query ListUsers($pagination: PaginationInput, $filters: UserFilters) {
    users(pagination: $pagination, filters: $filters) {
      data {
        id
        name
        email
        role
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        totalCount
      }
    }
  }
`
