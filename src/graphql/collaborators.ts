import { gql } from '@apollo/client'

export const LIST_COLLABORATORS = gql`
  query ListCollaborators($pagination: PaginationInput, $filters: CollaboratorFilters) {
    collaborators(pagination: $pagination, filters: $filters) {
      data {
        id
        name
        email
        cpf
        isActive
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

export const GET_COLLABORATOR = gql`
  query GetCollaborator($id: ID!) {
    collaborator(id: $id) {
      id
      name
      email
      cpf
      isActive
      insertedAt
      updatedAt
    }
  }
`

export const CREATE_COLLABORATOR = gql`
  mutation CreateCollaborator($input: CreateCollaboratorInput!) {
    createCollaborator(input: $input) {
      id
      name
      email
      cpf
      isActive
      insertedAt
      updatedAt
    }
  }
`

export const UPDATE_COLLABORATOR = gql`
  mutation UpdateCollaborator($id: ID!, $input: UpdateCollaboratorInput!) {
    updateCollaborator(id: $id, input: $input) {
      id
      name
      email
      cpf
      isActive
      insertedAt
      updatedAt
    }
  }
`

export const DELETE_COLLABORATOR = gql`
  mutation DeleteCollaborator($id: ID!) {
    deleteCollaborator(id: $id) {
      success
      collaborator {
        id
        name
        email
      }
    }
  }
`
