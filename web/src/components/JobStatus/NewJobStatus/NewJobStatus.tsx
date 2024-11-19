import type {
  CreateJobStatusMutation,
  CreateJobStatusInput,
  CreateJobStatusMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import JobStatusForm from 'src/components/JobStatus/JobStatusForm'

const CREATE_JOB_STATUS_MUTATION: TypedDocumentNode<
  CreateJobStatusMutation,
  CreateJobStatusMutationVariables
> = gql`
  mutation CreateJobStatusMutation($input: CreateJobStatusInput!) {
    createJobStatus(input: $input) {
      id
    }
  }
`

const NewJobStatus = () => {
  const [createJobStatus, { loading, error }] = useMutation(
    CREATE_JOB_STATUS_MUTATION,
    {
      onCompleted: () => {
        toast.success('JobStatus created')
        navigate(routes.jobStatuses())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateJobStatusInput) => {
    createJobStatus({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New JobStatus</h2>
      </header>
      <div className="rw-segment-main">
        <JobStatusForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewJobStatus
