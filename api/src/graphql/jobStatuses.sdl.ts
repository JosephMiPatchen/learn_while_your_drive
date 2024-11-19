export const schema = gql`
  type JobStatus {
    id: String!
    userId: String!
    status: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    totalTopics: Int!
    currentTopics: Int!
  }

  type Query {
    jobStatuses: [JobStatus!]! @requireAuth
    jobStatus(id: String!): JobStatus @requireAuth
  }

  input CreateJobStatusInput {
    userId: String!
    status: String!
    totalTopics: Int!
    currentTopics: Int!
  }

  input UpdateJobStatusInput {
    userId: String
    status: String
    totalTopics: Int
    currentTopics: Int
  }

  type Mutation {
    createJobStatus(input: CreateJobStatusInput!): JobStatus! @requireAuth
    updateJobStatus(id: String!, input: UpdateJobStatusInput!): JobStatus!
      @requireAuth
    deleteJobStatus(id: String!): JobStatus! @requireAuth
  }
`
