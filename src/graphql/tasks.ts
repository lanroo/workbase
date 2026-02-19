import { gql } from '@apollo/client'

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      name
      description
      status
      priority
      collaborator {
        id
        name
        email
      }
      report {
        id
        taskName
        completedAt
      }
      insertedAt
      updatedAt
    }
  }
`

export const LIST_TASKS = gql`
  query ListTasks($pagination: PaginationInput, $filters: TaskFilters) {
    tasks(pagination: $pagination, filters: $filters) {
      data {
        id
        name
        description
        status
        priority
        collaborator {
          id
          name
        }
        insertedAt
        updatedAt
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        totalCount
      }
    }
  }
`

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      name
      description
      status
      priority
      collaborator {
        id
        name
      }
      insertedAt
      updatedAt
    }
  }
`

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      name
      description
      status
      priority
      insertedAt
      updatedAt
    }
  }
`
