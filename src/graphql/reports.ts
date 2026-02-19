import { gql } from '@apollo/client'

export const LIST_REPORTS = gql`
  query ListReports($pagination: PaginationInput, $filters: ReportFilters) {
    reports(pagination: $pagination, filters: $filters) {
      data {
        id
        taskName
        taskDescription
        collaboratorName
        completedAt
        collaborator {
          id
          name
        }
        task {
          id
          name
        }
        insertedAt
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        totalCount
      }
    }
  }
`

export const GET_REPORT = gql`
  query GetReport($id: ID!) {
    report(id: $id) {
      id
      taskName
      taskDescription
      collaboratorName
      completedAt
      collaborator {
        id
        name
      }
      task {
        id
        name
      }
      insertedAt
    }
  }
`
