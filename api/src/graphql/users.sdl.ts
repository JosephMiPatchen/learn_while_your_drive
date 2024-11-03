export const schema = gql`
  type User {
    id: String!
    email: String!
    name: String
    averageDriveDurationMinutes: Int!
    goal: String
    ContentItem: [ContentItem]!
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: String!): User @requireAuth
  }

  input CreateUserInput {
    email: String!
    name: String
    averageDriveDurationMinutes: Int!
    goal: String
  }

  input UpdateUserInput {
    email: String
    name: String
    averageDriveDurationMinutes: Int
    goal: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: String!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: String!): User! @requireAuth
  }
`
