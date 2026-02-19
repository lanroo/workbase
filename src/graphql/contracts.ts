import { gql } from '@apollo/client'

export const LIST_CONTRACTS = gql`
  query ListContracts($pagination: PaginationInput, $filters: ContractFilters) {
    contracts(pagination: $pagination, filters: $filters) {
      data {
        id
        value
        startsAt
        expiresAt
        status
        enterprise {
          id
          name
        }
        collaborator {
          id
          name
          email
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

export const GET_CONTRACT = gql`
  query GetContract($id: ID!) {
    contract(id: $id) {
      id
      value
      startsAt
      expiresAt
      status
      enterprise {
        id
        name
      }
      collaborator {
        id
        name
        email
      }
      insertedAt
      updatedAt
    }
  }
`

export const CREATE_CONTRACT = gql`
  mutation CreateContract($input: CreateContractInput!) {
    createContract(input: $input) {
      id
      value
      startsAt
      expiresAt
      status
      enterprise {
        id
        name
      }
      collaborator {
        id
        name
      }
      insertedAt
      updatedAt
    }
  }
`

export const UPDATE_CONTRACT = gql`
  mutation UpdateContract($id: ID!, $input: UpdateContractInput!) {
    updateContract(id: $id, input: $input) {
      id
      value
      startsAt
      expiresAt
      status
      insertedAt
      updatedAt
    }
  }
`

export const DELETE_CONTRACT = gql`
  mutation DeleteContract($id: ID!) {
    deleteContract(id: $id) {
      success
      contract {
        id
        value
        status
      }
    }
  }
`
