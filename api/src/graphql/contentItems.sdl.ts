export const schema = gql`
  type ContentItem {
    id: String!
    title: String!
    description: String!
    url: String
    content: String
    createdAt: DateTime!
    modifiedAt: DateTime!
    goalId: String!
    goal: Goal!
    nextContentItemId: String
    nextContentItem: ContentItem
    ContentItem: ContentItem
  }

  type Query {
    contentItems: [ContentItem!]! @requireAuth
    contentItem(id: String!): ContentItem @requireAuth
  }

  input CreateContentItemInput {
    title: String!
    description: String!
    url: String
    content: String
    modifiedAt: DateTime!
    goalId: String!
    nextContentItemId: String
  }

  input UpdateContentItemInput {
    title: String
    description: String
    url: String
    content: String
    modifiedAt: DateTime
    goalId: String
    nextContentItemId: String
  }

  type Mutation {
    createContentItem(input: CreateContentItemInput!): ContentItem! @requireAuth
    updateContentItem(
      id: String!
      input: UpdateContentItemInput!
    ): ContentItem! @requireAuth
    deleteContentItem(id: String!): ContentItem! @requireAuth
  }
`