export const schema = gql`
  type Goal {
    id: String!
    description: String!
    createdAt: DateTime!
    modifiedAt: DateTime!
    userId: String!
    user: User!
    ContentItem: [ContentItem]!
  }

  type Query {
    goals: [Goal!]! @requireAuth
    goal(id: String!): Goal @requireAuth
  }

  input CreateGoalInput {
    description: String!
    userId: String!
  }

  input UpdateGoalInput {
    description: String
    userId: String
  }

  type Mutation {
    createGoal(input: CreateGoalInput!): Goal! @requireAuth
    updateGoal(id: String!, input: UpdateGoalInput!): Goal! @requireAuth
    deleteGoal(id: String!): Goal! @requireAuth
  }
`
