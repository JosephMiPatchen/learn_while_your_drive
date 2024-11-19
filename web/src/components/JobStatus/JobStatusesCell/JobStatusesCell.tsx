import type { FindJobStatuses, FindJobStatusesVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import JobStatuses from 'src/components/JobStatus/JobStatuses'

export const QUERY: TypedDocumentNode<
  FindJobStatuses,
  FindJobStatusesVariables
> = gql`
  query FindJobStatuses {
    jobStatuses {
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

export const Empty = () => {
  return (
    <div className="rw-text-center">
      No jobStatuses yet.{' '}
      <Link to={routes.newJobStatus()} className="rw-link">
        Create one?
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps<FindJobStatuses>) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({
  jobStatuses,
}: CellSuccessProps<FindJobStatuses, FindJobStatusesVariables>) => {
  return <JobStatuses jobStatuses={jobStatuses} />
}
