import type {
  EditJobStatusById,
  UpdateJobStatusInput,
  UpdateJobStatusMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import JobStatusForm from 'src/components/JobStatus/JobStatusForm'

export const QUERY: TypedDocumentNode<EditJobStatusById> = gql`
  query EditJobStatusById($id: String!) {
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

const UPDATE_JOB_STATUS_MUTATION: TypedDocumentNode<
  EditJobStatusById,
  UpdateJobStatusMutationVariables
> = gql`
  mutation UpdateJobStatusMutation(
    $id: String!
    $input: UpdateJobStatusInput!
  ) {
    updateJobStatus(id: $id, input: $input) {
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

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ jobStatus }: CellSuccessProps<EditJobStatusById>) => {
  const [updateJobStatus, { loading, error }] = useMutation(
    UPDATE_JOB_STATUS_MUTATION,
    {
      onCompleted: () => {
        toast.success('JobStatus updated')
        navigate(routes.jobStatuses())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateJobStatusInput,
    id: EditJobStatusById['jobStatus']['id']
  ) => {
    updateJobStatus({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">
          Edit JobStatus {jobStatus?.id}
        </h2>
      </header>
      <div className="rw-segment-main">
        <JobStatusForm
          jobStatus={jobStatus}
          onSave={onSave}
          error={error}
          loading={loading}
        />
      </div>
    </div>
  )
}
