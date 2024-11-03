export const schema = gql`
  type LearningTree {
    id: String!
    createdAt: DateTime!
    user: User!
    userId: String!
    rootNode: LearningTreeNode!
    rootNodeId: String!
  }

  type Query {
    learningTrees: [LearningTree!]! @requireAuth
    learningTree(id: String!): LearningTree @requireAuth
  }

  input CreateLearningTreeInput {
    userId: String!
  }

  input UpdateLearningTreeInput {
    userId: String
    rootNodeId: String
  }

  type Mutation {
    createLearningTree(input: CreateLearningTreeInput!): LearningTree!
      @requireAuth
    updateLearningTree(
      id: String!
      input: UpdateLearningTreeInput!
    ): LearningTree! @requireAuth
    deleteLearningTree(id: String!): LearningTree! @requireAuth
  }
`
