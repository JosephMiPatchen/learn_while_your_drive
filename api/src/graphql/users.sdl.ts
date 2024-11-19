export const schema = gql`
  type User {
    id: String!
    email: String!
    name: String
    averageDriveDurationMinutes: Int!
    goal: String
    ContentItem: [ContentItem]!
    learningTree: String
    latestJobId: String
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: String!): User @requireAuth
    getMediaRecs(userId: String!): [String!]! @requireAuth
  }

  input CreateUserInput {
    email: String!
    name: String
    averageDriveDurationMinutes: Int!
    goal: String
    learningTree: String
    latestJobId: String
  }

  input UpdateUserInput {
    email: String
    name: String
    averageDriveDurationMinutes: Int
    goal: String
    learningTree: String
    latestJobId: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: String!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: String!): User! @requireAuth
  }
`
