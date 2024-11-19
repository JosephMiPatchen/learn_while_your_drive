import type {
  FindJobStatusById,
  FindJobStatusByIdVariables,
} from 'types/graphql'

import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import JobStatus from 'src/components/JobStatus/JobStatus'

export const QUERY: TypedDocumentNode<
  FindJobStatusById,
  FindJobStatusByIdVariables
> = gql`
  query FindJobStatusById($id: String!) {
    jobStatus: jobStatus(id: $id) {
      id
      userId
      status
      createdAt
      updatedAt
      totalTopics
      currentTopics
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>JobStatus not found</div>

export const Failure = ({
  error,
}: CellFailureProps<FindJobStatusByIdVariables>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  jobStatus,
}: CellSuccessProps<FindJobStatusById, FindJobStatusByIdVariables>) => {
  return <JobStatus jobStatus={jobStatus} />
}
