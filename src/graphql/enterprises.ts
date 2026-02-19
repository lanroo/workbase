import { gql } from '@apollo/client'

export const LIST_ENTERPRISES = gql`
  query ListEnterprises($pagination: PaginationInput, $filters: EnterpriseFilters) {
    enterprises(pagination: $pagination, filters: $filters) {
      data {
        id
        name
        commercialName
        cnpj
        description
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

export const GET_ENTERPRISE = gql`
  query GetEnterprise($id: ID!) {
    enterprise(id: $id) {
      id
      name
      commercialName
      cnpj
      description
      insertedAt
      updatedAt
    }
  }
`

export const CREATE_ENTERPRISE = gql`
  mutation CreateEnterprise($input: CreateEnterpriseInput!) {
    createEnterprise(input: $input) {
      id
      name
      commercialName
      cnpj
      description
      insertedAt
      updatedAt
    }
  }
`

export const UPDATE_ENTERPRISE = gql`
  mutation UpdateEnterprise($id: ID!, $input: UpdateEnterpriseInput!) {
    updateEnterprise(id: $id, input: $input) {
      id
      name
      commercialName
      cnpj
      description
      insertedAt
      updatedAt
    }
  }
`

export const DELETE_ENTERPRISE = gql`
  mutation DeleteEnterprise($id: ID!) {
    deleteEnterprise(id: $id) {
      success
      enterprise {
        id
        name
        cnpj
      }
    }
  }
`
