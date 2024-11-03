export const schema = gql`
  type LearningTreeNode {
    id: String!
    topic: String!
    createdAt: DateTime!
    isRoot: Boolean!
    parentId: String
    parent: LearningTreeNode
    children: [LearningTreeNode]!
    learningTree: LearningTree
  }

  type Query {
    learningTreeNodes: [LearningTreeNode!]! @requireAuth
    learningTreeNode(id: String!): LearningTreeNode @requireAuth
  }

  input CreateLearningTreeNodeInput {
    topic: String!
    isRoot: Boolean!
    parentId: String
  }

  input UpdateLearningTreeNodeInput {
    topic: String
    isRoot: Boolean
    parentId: String
  }

  type Mutation {
    createLearningTreeNode(
      input: CreateLearningTreeNodeInput!
    ): LearningTreeNode! @requireAuth
    updateLearningTreeNode(
      id: String!
      input: UpdateLearningTreeNodeInput!
    ): LearningTreeNode! @requireAuth
    deleteLearningTreeNode(id: String!): LearningTreeNode! @requireAuth
  }
`
